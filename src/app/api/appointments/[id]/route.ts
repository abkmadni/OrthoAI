import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Appointment from "@/models/Appointment";

// GET /api/appointments/:id
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }
    const appt = await Appointment.findById(params.id).lean();
    if (!appt) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: appt });
  } catch (error: any) {
    console.error("GET /appointments/:id error", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/appointments/:id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }
    const body = await req.json();
    const updated = await Appointment.findByIdAndUpdate(params.id, body, { new: true }).lean();
    if (!updated) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PUT /appointments/:id error", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/appointments/:id
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }
    const deleted = await Appointment.findByIdAndDelete(params.id).lean();
    if (!deleted) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /appointments/:id error", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
