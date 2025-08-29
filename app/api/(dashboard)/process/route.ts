import { NextResponse } from "next/server";
import { ChatSession, ChatMessage } from "@/models/Chat";
import { Mood } from "@/models/Mood";
import { Activity } from "@/models/Activity"; // 👈 import Activity model
import { connectDB } from "@/inngest/utils/db";

export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Fetch today's sessions
    const sessions = await ChatSession.find({
      createdAt: { $gte: today },
    });

    // ✅ Fetch today's activities
    const activities = await Activity.find({
      date: { $gte: today },
    });

    const totalMessages = sessions.reduce(
      (acc, session) => acc + (session.messages?.length || 0),
      0
    );

    console.log("👉 Total messages today:", totalMessages);

    let totalPoints = 0;
    let maxPoints = sessions.length * 70; // (50 mood + 20 messages per session)

    // 🔹 Add activity max points (30 total cap for today)
    maxPoints += 30;

    const sessionData = await Promise.all(
      sessions.map(async (session) => {
        // ✅ Latest mood for this session
        const latestMood = await Mood.findOne({
          userId: session.userId,
          timestamp: { $gte: session.createdAt },
        })
          .sort({ timestamp: -1 })
          .select("score note");

        // ✅ Messages in this session
        const messages = await ChatMessage.find({ sessionId: session._id });

        const moodScore = latestMood?.score || 0;
        const moodNote = latestMood?.note || "";

        // 🔹 Mood points
        let moodPoints = 0;
        if (moodScore >= 80) moodPoints = 50;
        else if (moodScore >= 60) moodPoints = 40;
        else if (moodScore >= 40) moodPoints = 30;
        else if (moodScore >= 20) moodPoints = 20;
        else if (moodScore > 0) moodPoints = 10;

        // 🔹 Messages points
        let msgPoints = 0;
        if (messages.length >= 30) msgPoints = 20;
        else if (messages.length >= 15) msgPoints = 10;
        else if (messages.length > 0) msgPoints = 5;

        totalPoints += moodPoints + msgPoints;

        return {
          sessionId: session._id,
          messagesCount: messages.length,
          moodScore,
          moodNote,
          moodPoints,
          msgPoints,
          moodemoji: moodNote,
        };
      })
    );

    // 🔹 Activity points (per activity 10 points, max 30 total)
    let activityPoints = Math.min(activities.length * 10, 30);
    totalPoints += activityPoints;

    const completionRate =
      maxPoints > 0
        ? Math.min((totalPoints / maxPoints) * 100, 100).toFixed(2)
        : "0.00";

    const todayMessages = sessionData.reduce(
      (acc, s) => acc + s.messagesCount,
      0
    );

    return NextResponse.json({
      todaySessions: sessions.length,
      todayMessages,
      todayActivities: activities.length,
      completionRate,
      sessions: sessionData,
      moodscore: sessionData[0]?.moodScore || 0,
      activityPoints,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
