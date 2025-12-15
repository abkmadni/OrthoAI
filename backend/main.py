from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
import uuid
import shutil
import os
from pathlib import Path
try:
    from ultralytics import YOLO
    import cv2
    import numpy as np
except ImportError:
    print("Ultralytics or OpenCV not installed. Running in mock mode.")
    YOLO = None

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
# We need to save to the Next.js public folder so the frontend can serve the image
UPLOAD_DIR = Path("../public/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# --- MODEL INITIALIZATION ---
# Place your .pt files in the backend/weights/ folder
WEIGHTS_DIR = Path("weights")
# Optional: Trained classifier directory (exported YOLO run)
CLASSIFIER_RUN_DIR = Path("models/xray_type_classifier/weights")

models = {
    "classifier": None,
    "OPG": None,
    "Periapical": None,
    "Bitewing": None
}

def load_models():
    """Attempts to load YOLO models if weights exist."""
    if not YOLO: return

    # 1. Classifier Model
    # Prefer a trained classifier from the run folder if present
    trained_classifier = CLASSIFIER_RUN_DIR / "best.pt"
    fallback_classifier = WEIGHTS_DIR / "yolov8n-cls.pt"
    classifier_path = trained_classifier if trained_classifier.exists() else fallback_classifier

    if classifier_path.exists():
        print(f"Loading Classifier from {classifier_path}...")
        models["classifier"] = YOLO(classifier_path)
    
    # 2. OPG Model
    opg_path = WEIGHTS_DIR / "opg.pt"
    if opg_path.exists():
        print(f"Loading OPG Model from {opg_path}...")
        models["OPG"] = YOLO(opg_path)

    # 3. Periapical Model
    periapical_path = WEIGHTS_DIR / "periapical.pt"
    if periapical_path.exists():
        print(f"Loading Periapical Model from {periapical_path}...")
        models["Periapical"] = YOLO(periapical_path)

    # 4. Bitewing Model
    bitewing_path = WEIGHTS_DIR / "bitewing.pt"
    if bitewing_path.exists():
        print(f"Loading Bitewing Model from {bitewing_path}...")
        models["Bitewing"] = YOLO(bitewing_path)

# Load models on startup
load_models()

class BoundingBox(BaseModel):
    id: str
    label: str
    confidence: float
    x: float
    y: float
    width: float
    height: float
    color: str

class AnalysisResult(BaseModel):
    imageId: str
    imageUrl: str
    type: str
    issues: List[BoundingBox]

def process_yolo_results(results) -> List[BoundingBox]:
    """Converts YOLO results to our BoundingBox format."""
    boxes = []
    for r in results:
        for box in r.boxes:
            # Get coordinates (xywh)
            x, y, w, h = box.xywh[0].tolist()
            # Convert center-x, center-y to top-left x, y for HTML canvas
            x = x - (w / 2)
            y = y - (h / 2)
            
            conf = float(box.conf[0])
            cls = int(box.cls[0])
            label = r.names[cls]
            
            # Assign color based on label (simple hash or predefined)
            color_map = {
                "Caries": "#ef4444", # Red
                "Restoration": "#3b82f6", # Blue
                "Root Canal": "#eab308", # Yellow
                "Impacted": "#a855f7" # Purple
            }
            color = color_map.get(label, "#ef4444")

            boxes.append(BoundingBox(
                id=str(uuid.uuid4()),
                label=label,
                confidence=conf,
                x=x, y=y, width=w, height=h,
                color=color
            ))
    return boxes

# --- ANALYSIS FUNCTIONS ---

def classify_image(image_path: str) -> str:
    """Model 1: Classifies the image type. Fails fast if classifier not loaded."""
    if not models["classifier"]:
        raise HTTPException(status_code=500, detail="Classifier model not loaded. Ensure weights/yolov8n-cls.pt exists.")

    results = models["classifier"](image_path)
    if results and results[0].probs:
        top_class_index = results[0].probs.top1
        class_name = results[0].names[top_class_index]

        # Optional safety: enforce only known dental classes if present
        allowed = {"OPG", "Periapical", "Bitewing"}
        if allowed and class_name not in allowed and any(name in allowed for name in results[0].names.values()):
            raise HTTPException(status_code=500, detail=f"Classifier predicted '{class_name}' outside allowed set {allowed}. Check your trained weights.")

        print(f"Classified as: {class_name}")
        return class_name

    raise HTTPException(status_code=500, detail="Classifier returned no probabilities.")

def detect_issues(image_path: str, image_type: str) -> List[BoundingBox]:
    """Routes to the specific model based on type."""
    model = models.get(image_type)
    
    if model:
        results = model(image_path)
        return process_yolo_results(results)

    # Fallback Mock Data if model not loaded
    if image_type == "OPG":
        return [
            BoundingBox(id=str(uuid.uuid4()), label="Caries", confidence=0.92, x=100, y=100, width=50, height=50, color="#ef4444"),
            BoundingBox(id=str(uuid.uuid4()), label="Impacted Tooth", confidence=0.88, x=300, y=200, width=60, height=80, color="#eab308")
        ]
    elif image_type == "Periapical":
        return [
            BoundingBox(id=str(uuid.uuid4()), label="Root Canal Treatment", confidence=0.95, x=50, y=50, width=100, height=100, color="#3b82f6")
        ]
    elif image_type == "Bitewing":
        return [
            BoundingBox(id=str(uuid.uuid4()), label="Interproximal Caries", confidence=0.85, x=150, y=120, width=40, height=40, color="#ef4444")
        ]
    return []

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_xray(file: UploadFile = File(...)):
    try:
        # Save the file
        file_id = str(uuid.uuid4())
        extension = file.filename.split(".")[-1]
        filename = f"{file_id}.{extension}"
        file_path = UPLOAD_DIR / filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Relative path for frontend
        image_url = f"/uploads/{filename}"
        
        # Step 1: Classification
        image_type = classify_image(str(file_path))
        
        # Ensure type matches our expected keys (normalize if needed)
        # For now assuming model returns exact strings "OPG", "Periapical", "Bitewing"
        
        # Step 2: Specific Detection
        issues = detect_issues(str(file_path), image_type)
            
        return AnalysisResult(
            imageId=file_id,
            imageUrl=image_url,
            type=image_type,
            issues=issues
        )
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "OrthoAI Backend is running", "models_loaded": {k: v is not None for k, v in models.items()}}
