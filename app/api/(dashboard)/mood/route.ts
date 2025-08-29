// app/api/protected/activity/route.ts
import { connectDB } from "@/inngest/utils/db";
import { Mood } from "@/models/Mood";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  try {
    const userId = req.headers.get("userId");
    const { score , note } = await req.json();
    await Mood.create({
      userId,
      score,
      note
    });

    return NextResponse.json({ message: "Mood Saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating activity:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
