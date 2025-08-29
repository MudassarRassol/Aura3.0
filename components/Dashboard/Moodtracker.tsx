"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import axios from "axios";

const emoji = [
  { id: 1, emoji: "😔", text: "Very Low", value: 0 },
  { id: 2, emoji: "😕", text: "Low", value: 25 },
  { id: 3, emoji: "😊", text: "Neutral", value: 50 },
  { id: 4, emoji: "🙂", text: "High", value: 75 },
  { id: 5, emoji: "😀", text: "Very High", value: 100 },
];

const MoodTracker = ({ onDataChange }: { onDataChange?: () => void }) => {
  const [model, setModel] = useState(false);
  const [emotion, setEmotion] = useState(50);
  const [saving, setSaving] = useState(false);

  const currentEmotion = emoji.reduce((prev, curr) =>
    Math.abs(curr.value - emotion) < Math.abs(prev.value - emotion) ? curr : prev
  );

  const savemood = async () => {
    setSaving(true);
    try {
      const res = await axios.post("/api/mood", {
        score: emotion, // ✅ matches API
        note: currentEmotion.text, // optional description
      });

      if (res.status === 201) {
        toast.success("Mood saved successfully ✅");
        setModel(false); // close modal
        onDataChange?.();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save mood ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex flex-col h-auto py-10 px-10 hover:bg-red-700/20 dark:bg-transparent border-red-600/30 dark:hover:bg-red-700/20 dark:border-red-500/20"
        onClick={() => setModel(true)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-700/20">
            <Heart size={20} className="text-red-700" />
          </div>
        </div>
        <span className="font-semibold text-lg mt-2">Track Mood</span>
        <span className="text-xs md:text-md">How are you feeling?</span>
      </Button>

      <Dialog open={model} onOpenChange={setModel}>
        <DialogContent className="overflow-hidden border-primary/10 shadow-md">
          <DialogHeader>
            <DialogTitle className="flex flex-col gap-2.5">
              <span className="font-semibold">How are you feeling?</span>
              <span className="text-sm">Move the slider to track your current mood</span>
            </DialogTitle>
            <DialogDescription>
              <div className="flex items-center justify-center flex-col gap-4 p-10">
                <span className="text-5xl">{currentEmotion.emoji}</span>
                <span>{currentEmotion.text}</span>
              </div>

              {/* Mood Scale */}
              <div className="flex items-center gap-2 justify-between mt-2">
                {emoji.map((em) => (
                  <div
                    key={em.id}
                    className={`text-3xl transition-transform ${
                      currentEmotion.value === em.value ? "scale-125" : "opacity-60"
                    }`}
                  >
                    {em.emoji}
                  </div>
                ))}
              </div>

              {/* Slider */}
              <Slider
                min={0}
                max={100}
                step={1}
                value={[emotion]}
                onValueChange={(e) => setEmotion(e[0])}
                className="mt-6"
              />

              {/* Save Button */}
              <Button className="w-full mt-4 text-black" onClick={savemood} disabled={saving}>
                {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                {saving ? "Saving..." : "Save Mood"}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MoodTracker;
