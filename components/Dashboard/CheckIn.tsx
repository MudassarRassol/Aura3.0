"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { BrainCircuit } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";


const CheckInModal = ({ onActivitySaved }: { onActivitySaved?: () => void }) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [ActivityType, setActivityType] = React.useState("Walking");
  const [ActivityDescription, setActivityDescription] = React.useState("");
  const [ActivityDuration, setActivityDuration] = React.useState<number>();
  const [Activityname, setActivityName] = React.useState("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const res = await axios.post("/api/activity", {
        type: ActivityType,
        name: Activityname,
        description: ActivityDescription,
        duration: ActivityDuration
      });

      if (res.status === 201) {
        setActivityType("Walking");
        setActivityDescription("");
        setActivityName("");
        setActivityDuration(undefined);
        onActivitySaved?.();
        toast.success("Activity logged successfully");
        setOpen(false);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-col h-auto hover:bg-blue-700/20 dark:bg-transparent border-blue-600/30 dark:hover:bg-blue-700/20 dark:border-blue-500/20"
        >
          <div className="flex items-center gap-3 bg-blue-700/20 rounded-full">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-blue-700">
              <BrainCircuit size={20} className="text-blue-700" />
            </div>
          </div>
          <h3 className="font-semibold text-lg mt-2 text-blue-700">Check-in</h3>
          <p className="text-xs md:text-md">Quick Wellness Check</p>
        </Button>
      </DialogTrigger>

      {/* Modal Content */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
          <DialogDescription>Record your wellness activity</DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4 py-4 w-f"
          onSubmit={(e) => {
            handleFormSubmit(e);
          }}
        >
          {/* Activity Type */}
          <div className="flex flex-col gap-3 w-full">
            <label className="text-sm font-medium">Activity Type</label>
            <Select value={ActivityType} onValueChange={setActivityType}>
              <SelectTrigger className="border border-primary/60 w-full text-sm font-medium dark:bg-transparent dark:border-primary/10">
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Walking">Walking</SelectItem>
                <SelectItem value="Meditation">Meditation</SelectItem>
                <SelectItem value="Yoga">Yoga</SelectItem>
                <SelectItem value="Exercise">Exercise</SelectItem>
                <SelectItem value="Reading">Reading</SelectItem>
                <SelectItem value="Journaling">Journaling</SelectItem>
                <SelectItem value="Therapy Session">Therapy Session</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className=" flex flex-col gap-3  ">
            <label className="text-sm font-medium">Name</label>
            <Input
              required
              onChange={(e) => setActivityName(e.target.value)}
              value={Activityname}
              placeholder="Morning Meditation, Evening Walk, etc."
              className="dark:bg-transparent border border-primary/60  dark:border-primary/10"
            />
          </div>

          {/* Duration */}
          <div className=" flex flex-col gap-3  ">
            <label className="text-sm font-medium">Duration (minutes)</label>
            <Input
              onChange={(e) => setActivityDuration(Number(e.target.value))}
              value={ActivityDuration}
              type="number"
              placeholder="15"
              min={1}
              required
              className="dark:bg-transparent border border-primary/60  dark:border-primary/10"
            />
          </div>

          {/* Description */}
          <div className=" flex flex-col gap-3  ">
            <label className=" text-sm font-medium ">
              Description (optional)
            </label>
            <Textarea
              onChange={(e) => setActivityDescription(e.target.value)}
              value={ActivityDescription}
              placeholder="How did it go?"
              className=" text-sm font-medium border border-primary/60  dark:bg-transparent dark:border-primary/10"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button className="text-black" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInModal;
