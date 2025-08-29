import { NextResponse } from "next/server";
import { User } from "@/models/User";
import  { connectDB } from "@/inngest/utils/db";

export async function GET(req: Request) {
  try {
    await connectDB();
    const userId = req.headers.get("userId");
    const user = await User.findById(userId).select("username");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ username: user.username });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
