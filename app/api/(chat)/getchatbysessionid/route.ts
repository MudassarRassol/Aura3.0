import { NextResponse } from "next/server";
import { ChatSession } from "@/models/Chat";
import { connectDB } from "@/inngest/utils/db";
// GET /api/messages/:sessionId
export async function POST(
  req: Request
) {
  try {
    await connectDB();

    const  {sessionId}  = await req.json();

     console.log(sessionId);

    if (!sessionId) {
      return NextResponse.json(
        { error: "SessionId is required" },
        { status: 400 }
      );
    }


    const messages = await ChatSession.findOne({
      sessionId : sessionId 
    }).populate("messages");

    return NextResponse.json(messages, { status: 201 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
