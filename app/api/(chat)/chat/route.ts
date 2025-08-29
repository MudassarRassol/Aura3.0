// ✅ backend route (e.g. app/api/chat/route.ts)
import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";
import mongoose from "mongoose";
import { ChatMessage, ChatSession } from "@/models/Chat";

export async function POST(req: Request) {
  try {
    const userIdRaw = req.headers.get("userId");
    if (!userIdRaw) {
      return Response.json({ error: "No userId" }, { status: 400 });
    }
    const userId = new mongoose.Types.ObjectId(userIdRaw);

    const { messages } = await req.json();
    console.log(JSON.stringify(messages, null, 2));

    const userMessage = messages[messages.length - 1]; // last message user ka hoga
    const { sessionId } = userMessage.metadata || {};
    const lastMsg = messages[messages.length - 1];
    const lastText = lastMsg.parts?.[0]?.text;
    console.log("Last message text:", lastText);
    console.log(sessionId);
    if (!sessionId) {
      return Response.json(
        { error: "No sessionId found in metadata" },
        { status: 400 }
      );
    }

    // Save user message
    const savedUserMessage = await ChatMessage.create({
      userId,
      sessionId: sessionId,
      role: "user",
      content: lastText,
    });

    await ChatSession.updateOne(
      { sessionId: sessionId },
      { $push: { messages: savedUserMessage._id } }
    );

    const lastthreemessage = await messages.slice(-1);

    // AI Response
    const result = streamText({
      model: google("models/gemini-1.5-flash"),
      messages: [
        {
          role: "system",
          content: `You are an AI Therapist assistant. 
                Your role is to listen carefully to the user, respond with empathy, and guide them step by step through a supportive conversation.

                ### Behavior:
                - Always validate the user’s feelings first with kind and understanding words.
                - Ask gentle, step-by-step questions to understand their situation better.
                - Keep responses simple, clear, and positive.
                - Use friendly emojis where appropriate (😊🌊🐦🌿🧘).

                ### Conversation Flow:
                1. Start by greeting warmly and asking how the user feels.  
                2. Based on their answers, go deeper step by step (never rush).  
                3. Offer gentle suggestions or coping techniques.  
                4. Recommend one of these wellness activities from our website at the right time:  
                  - Zen Garden 🌿  
                  - Ocean Music 🌊  
                  - Bird Music 🐦  
                  - Breathing Exercise 🧘  

                ### At the End of Session:
                - Generate a **summary report** with:  
                  - Key feelings shared by the user  
                  - Main issues discussed  
                  - Positive suggestions given  
                  - Recommended wellness activity  

                Keep the tone warm, human-like, and encouraging. Do not sound robotic.  
                `,
        },
        ...convertToModelMessages(lastthreemessage), // ✅ spread so it's flat,
      ],
    });

    // Save AI response
    result.text.then(async (aiText) => {
      const savedAIMessage = await ChatMessage.create({
        userId,
        sessionId: sessionId,
        role: "assistant",
        content: aiText,
      });

      await ChatSession.updateOne(
        { sessionId: sessionId },
        { $push: { messages: savedAIMessage._id } }
      );
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
