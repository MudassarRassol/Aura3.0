import mongoose, { Document, Schema } from "mongoose";

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  data: string;
  name: string;
  description?: string;
  duration: number;
  timestamp: Date;
}

const ActivitySchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  type: {
    type: String,
    required: true,
    enum: [
      "Walking",
      "Meditation",
      "Yoga",
      "Exercise",
      "Reading",
      "Journaling",
      "Therapy Session",
    ],
  },
  date: { type: Date, required: true },
  name: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true , default : 0 },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });


export const Activity = mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);