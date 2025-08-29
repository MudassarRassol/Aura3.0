import { inngest } from "../client";
import logger from "../utils/logger";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// Utility: Safe JSON parser
function safeJSONParse(str: string, fallback: any = {}) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Function to handle chat message processing
 */
export const processChatMessage = inngest.createFunction(
  { id: "process-chat-message" },
  { event: "therapy/session.message" },
  async ({ event, step }) => {
    try {
      const {
        message,
        history,
        memory = {
          userProfile: {
            emotionalState: [],
            riskLevel: 0,
            preferences: {},
          },
          sessionContext: {
            conversationThemes: [],
            currentTechnique: null,
          },
        },
        goals = [],
        systemPrompt,
      } = event.data;

      logger.info("Processing chat message:", {
        message,
        historyLength: history?.length,
      });

      // Step 1: Analyze the message
      const analysis = await step.run("analyze-message", async () => {
        try {
          const model = google("gemini-2.0-flash");

          const prompt = `Analyze this therapy message and provide insights. 
          Return ONLY a valid JSON object with no markdown formatting or extra text.
          
          Message: ${message}
          Context: ${JSON.stringify({ memory, goals })}
          
          Required JSON structure:
          {
            "emotionalState": "string",
            "themes": ["string"],
            "riskLevel": number,
            "recommendedApproach": "string",
            "progressIndicators": ["string"]
          }`;

          const { text } = await generateText({ model, prompt });
          logger.info("Received analysis from Gemini:", { text });

          return safeJSONParse(text, {
            emotionalState: "neutral",
            themes: [],
            riskLevel: 0,
            recommendedApproach: "supportive",
            progressIndicators: [],
          });
        } catch (error) {
          logger.error("Error in message analysis:", { error, message });
          return {
            emotionalState: "neutral",
            themes: [],
            riskLevel: 0,
            recommendedApproach: "supportive",
            progressIndicators: [],
          };
        }
      });

      // Step 2: Update memory
      const updatedMemory = await step.run("update-memory", async () => {
        if (analysis.emotionalState) {
          memory.userProfile.emotionalState.push(analysis.emotionalState);
        }
        if (analysis.themes) {
          memory.sessionContext.conversationThemes.push(...analysis.themes);
        }
        if (analysis.riskLevel !== undefined) {
          memory.userProfile.riskLevel = analysis.riskLevel;
        }
        return memory;
      });

      // Step 3: Trigger alert if high risk
      if (analysis.riskLevel > 4) {
        await step.run("trigger-risk-alert", async () => {
          logger.warn("High risk level detected", {
            message,
            riskLevel: analysis.riskLevel,
          });
        });
      }

      // Step 4: Generate response
      const response = await step.run("generate-response", async () => {
        try {
          const model = google("gemini-2.0-flash");

          const prompt = `${systemPrompt}
          
          Based on the following context, generate a therapeutic response:
          Message: ${message}
          Analysis: ${JSON.stringify(analysis)}
          Memory: ${JSON.stringify(memory)}
          Goals: ${JSON.stringify(goals)}
          
          Provide a response that:
          1. Addresses the emotional needs
          2. Uses therapeutic techniques
          3. Shows empathy
          4. Maintains professional boundaries
          5. Considers safety and well-being`;

          const { text } = await generateText({ model, prompt });
          logger.info("Generated response:", { text });
          return text;
        } catch (error) {
          logger.error("Error generating response:", { error, message });
          return "I'm here to support you. Could you tell me more about what's on your mind?";
        }
      });

      return { response, analysis, updatedMemory };
    } catch (error) {
      logger.error("Error in chat message processing:", {
        error,
        message: event.data.message,
      });
      return {
        response: "I'm here to support you. Could you tell me more about what's on your mind?",
        analysis: {
          emotionalState: "neutral",
          themes: [],
          riskLevel: 0,
          recommendedApproach: "supportive",
          progressIndicators: [],
        },
        updatedMemory: event.data.memory,
      };
    }
  }
);

/**
 * Function to analyze therapy session content
 */
export const analyzeTherapySession = inngest.createFunction(
  { id: "analyze-therapy-session" },
  { event: "therapy/session.created" },
  async ({ event, step }) => {
    try {
      const sessionContent = await step.run("get-session-content", async () => {
        return event.data.notes || event.data.transcript;
      });

      const analysis = await step.run("analyze-with-gemini", async () => {
        const model = google("gemini-2.0-flash");

        const prompt = `Analyze this therapy session and provide insights:
        Session Content: ${sessionContent}
        
        Please provide:
        1. Key themes
        2. Emotional state
        3. Areas of concern
        4. Follow-up recommendations
        5. Progress indicators
        
        Format as JSON.`;

        const { text } = await generateText({ model, prompt });
        return safeJSONParse(text, {});
      });

      await step.run("store-analysis", async () => {
        logger.info("Session analysis stored successfully");
        return analysis;
      });

      if (analysis.areasOfConcern?.length > 0) {
        await step.run("trigger-concern-alert", async () => {
          logger.warn("Concerning indicators detected", {
            sessionId: event.data.sessionId,
            concerns: analysis.areasOfConcern,
          });
        });
      }

      return { message: "Session analysis completed", analysis };
    } catch (error) {
      logger.error("Error in therapy session analysis:", error);
      throw error;
    }
  }
);

/**
 * Function to generate personalized activity recommendations
 */
export const generateActivityRecommendations = inngest.createFunction(
  { id: "generate-activity-recommendations" },
  { event: "mood/updated" },
  async ({ event, step }) => {
    try {
      const userContext = await step.run("get-user-context", async () => {
        return {
          recentMoods: event.data.recentMoods,
          completedActivities: event.data.completedActivities,
          preferences: event.data.preferences,
        };
      });

      const recommendations = await step.run("generate-recommendations", async () => {
        const model = google("gemini-2.0-flash");

        const prompt = `Based on this user context, generate personalized activity recommendations:
        User Context: ${JSON.stringify(userContext)}
        
        Please provide:
        1. 3-5 activities
        2. Reasoning for each
        3. Expected benefits
        4. Difficulty level
        5. Estimated duration
        
        Format as JSON.`;

        const { text } = await generateText({ model, prompt });
        return safeJSONParse(text, []);
      });

      await step.run("store-recommendations", async () => {
        logger.info("Activity recommendations stored successfully");
        return recommendations;
      });

      return { message: "Activity recommendations generated", recommendations };
    } catch (error) {
      logger.error("Error generating activity recommendations:", error);
      throw error;
    }
  }
);

// Export all functions
export const functions = [
  processChatMessage,
  analyzeTherapySession,
  generateActivityRecommendations,
];
