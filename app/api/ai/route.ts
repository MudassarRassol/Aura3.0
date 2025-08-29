import { NextResponse } from "next/server";
import { ChatSession, ChatMessage } from "@/models/Chat";
import { Mood } from "@/models/Mood";
import { Activity } from "@/models/Activity";
import { connectDB } from "@/inngest/utils/db";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET(req: Request) {
  try {
    await connectDB();


    const userId = req.headers.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ ab queries me userId filter add karo
    const sessions = await ChatSession.find({
      userId,
      createdAt: { $gte: today },
    });

    const activities = await Activity.find({
      userId,
      date: { $gte: today },
    });



    let totalPoints = 0;
    let maxPoints = sessions.length * 70;
    maxPoints += 30; // activity cap

    const sessionData = await Promise.all(
      sessions.map(async (session) => {
        const latestMood = await Mood.findOne({
          userId: session.userId,
          timestamp: { $gte: session.createdAt },
        })
          .sort({ timestamp: -1 })
          .select("score note");

        const messages = await ChatMessage.find({ userId: userId });

        const moodScore = latestMood?.score || 0;
        const moodNote = latestMood?.note || "";

        let moodPoints = 0;
        if (moodScore >= 80) moodPoints = 50;
        else if (moodScore >= 60) moodPoints = 40;
        else if (moodScore >= 40) moodPoints = 30;
        else if (moodScore >= 20) moodPoints = 20;
        else if (moodScore > 0) moodPoints = 10;

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
        };
      })
    );

    const activityPoints = Math.min(activities.length * 10, 30);
    totalPoints += activityPoints;

    const completionRate =
      maxPoints > 0
        ? Math.min((totalPoints / maxPoints) * 100, 100).toFixed(2)
        : "0.00";

    const todayMessages = sessionData.reduce(
      (acc, s) => acc + s.messagesCount,
      0
    );

    // 🔥 AI-based recommendations
    const activitySummary = activities
      .map((a) => `${a.type} (${a.duration} mins)`)
      .join(", ");

    const aiPrompt = `
    User's data today:
    - Sessions: ${sessions.length}
    - Messages: ${todayMessages}
    - Mood Score: ${sessionData[0]?.moodScore || 0}
    - Mood Note: ${sessionData[0]?.moodNote || "-"}
    - Activities: ${activitySummary || "No activities"}

    Based on their activity & mood, give exactly 2 personalized recommendations
    to improve mental well-being and productivity. Keep them short and actionable.
    `;

    const aiResponse = await generateText({
      model: google("models/gemini-1.5-flash"),
      prompt: aiPrompt,
      maxOutputTokens: 100,
    });

    const recommendations =
      aiResponse.text?.split("\n").filter((r) => r.trim() !== "") || [];

    // 🎮 Game Recommendation
    const moodScore = sessionData[0]?.moodScore || 0;
    let gameSuggestion;

    if (moodScore < 25) {
      gameSuggestion = {
        name: "Breathing Patterns",
        description: "Follow calming breathing exercises with visual guidance",
        duration: "5 mins",
      };
    } else if (moodScore < 50) {
      gameSuggestion = {
        name: "Zen Garden",
        description: "Create and maintain your digital peaceful space",
        duration: "10 mins",
      };
    } else if (moodScore < 70) {
      gameSuggestion = {
        name: "Mindful Forest",
        description: "Take a peaceful walk through a virtual forest",
        duration: "15 mins",
      };
    } else {
      gameSuggestion = {
        name: "Ocean Waves",
        description: "Relax with soothing virtual ocean waves",
        duration: "10 mins",
      };
    }

    return NextResponse.json({
      todaySessions: sessions.length,
      todayMessages,
      todayActivities: activities.length,
      completionRate,
      sessions: sessionData,
      moodscore: moodScore,
      activityPoints,
      recommendations,
      gameSuggestion,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
