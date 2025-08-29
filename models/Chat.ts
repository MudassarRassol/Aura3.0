// models/ChatModels.ts
import mongoose, { Document, Schema } from "mongoose";

// ---------------------
// ChatMessage Model
// ---------------------
export interface IChatMessage extends Document {
  userId : Schema.Types.ObjectId;
  sessionId: string; // link to session
  role: "user" | "assistant";
  content: string;
  metadata?: {
    technique?: string;
    goal?: string;
    progress?: { step: string; status: string }[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true, index: true },
    role: { type: String, required: true, enum: ["user", "assistant"] },
    content: { type: String, required: true },
    metadata: {
      technique: { type: String },
      goal: { type: String },
      progress: [{ step: String, status: String }],
    },
  },
  { timestamps: true }
);

const ChatMessage =
  mongoose.models.ChatMessage ||
  mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);

// ---------------------
// ChatSession Model
// ---------------------
export interface IChatSession extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: string;
  messages: mongoose.Types.ObjectId[]; // reference to ChatMessage documents
  summary?: string; // optional summary for memory
  active?: boolean; // is this session currently active
  createdAt?: Date;
  updatedAt?: Date;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true, unique: true },
    messages: [{ type: Schema.Types.ObjectId, ref: "ChatMessage" }],
    summary: { type: String , default : "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);


// ChatSessionSchema.index({ sessionId: 1 });
ChatSessionSchema.index({ userId: 1, updatedAt: -1 });

// Cascade delete messages when session is deleted
ChatSessionSchema.pre("findOneAndDelete", async function (next) {
  try {
    const doc: any = await this.model.findOne(this.getFilter());
    if (doc) {
      await ChatMessage.deleteMany({ sessionId: doc.sessionId });
    }
    next();
  } catch (err) {
    next(err as Error);
  }
});

const ChatSession =
  mongoose.models.ChatSession ||
  mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);

export { ChatSession, ChatMessage };
