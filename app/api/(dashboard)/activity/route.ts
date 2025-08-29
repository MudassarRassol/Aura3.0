// app/api/protected/activity/route.ts
import { connectDB } from "@/inngest/utils/db";
import { Activity } from "@/models/Activity";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  try {
    const userId = req.headers.get("userId");
    const { type, name, description, duration } = await req.json();
    console.log(type, name, description, duration, userId);
    await Activity.create({
      userId,
      type,
      name,
      description,
      duration,
      date: new Date(),
    });

    return NextResponse.json({ message: "Activity created successfully" }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating activity:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
