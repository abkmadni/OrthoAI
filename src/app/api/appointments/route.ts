import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Appointment from "@/models/Appointment";

// GET /api/appointments - list
export async function GET() {
  try {
    await dbConnect();
    const appts = await Appointment.find({}).sort({ start: 1 }).lean();
    return NextResponse.json({ success: true, data: appts });
  } catch (error: any) {
    console.error("GET /appointments error", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/appointments - create
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const appt = await Appointment.create(body);
    return NextResponse.json({ success: true, data: appt }, { status: 201 });
  } catch (error: any) {
    console.error("POST /appointments error", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
