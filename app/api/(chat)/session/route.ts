import { NextRequest, NextResponse } from "next/server";
import { ChatMessage, ChatSession } from "@/models/Chat";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await ChatSession.create({
      userId,
      sessionId: nanoid(),
      messages: [],
    });

    return NextResponse.json(session, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create session" , err }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await ChatSession.find({ userId }).sort({ updatedAt: -1 });

    return NextResponse.json(sessions, { status: 201} );
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}



export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();
    console.log(sessionId);
    const deleted = await ChatSession.findOneAndDelete({ userId, sessionId });
        await ChatMessage.deleteMany({ sessionId })
    if (!deleted) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Session deleted successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json( err as Error , { status: 500 });
  }
}
