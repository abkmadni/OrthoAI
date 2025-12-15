import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Patient from "@/models/Patient";
import "@/models/User";
import mongoose from "mongoose";

async function getParamId(paramsPromise: { id: string } | Promise<{ id: string }>) {
  const params = await paramsPromise;
  return params?.id;
}

// GET /api/patients/:id
export async function GET(_req: Request, ctx: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const id = await getParamId(ctx.params as any);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }
    const patient = await Patient.findById(id)
      .populate({ path: "dentist", select: "name email" })
      .lean();
    if (!patient) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: patient });
  } catch (error: any) {
    console.error("GET /patients/:id error", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/patients/:id
export async function PUT(req: Request, ctx: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const id = await getParamId(ctx.params as any);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }
    const body = await req.json();
    const updated = await Patient.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PUT /patients/:id error", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/patients/:id
export async function DELETE(_req: Request, ctx: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const id = await getParamId(ctx.params as any);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }
    const deleted = await Patient.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /patients/:id error", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
