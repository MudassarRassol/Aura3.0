"use client";
import { LucideWindArrowDown, Wind } from "lucide-react";
import React, { useEffect } from "react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";

const Breathing = () => {
  const [phase, setPhase] = React.useState<"inhale" | "hold" | "exhale">("inhale");
  const [progress, setProgress] = React.useState(0);
  const [round, setRound] = React.useState(1);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  const totalRounds = 5;

  // breathing steps
  const steps = {
    inhale: { name: "Breathe In", duration: 5000, increment: 2, icon: <Wind size={35} className="text-primary" /> },
    hold: { name: "Hold", duration: 3000, increment: 4, icon: <LucideWindArrowDown size={35} className="text-primary" /> },
    exhale: { name: "Breathe Out", duration: 4000, increment: 3, icon: <Wind size={35} className="text-primary" /> },
  };

  useEffect(() => {
    if (isCompleted || isPaused) return;

    let timer: NodeJS.Timeout;
    const step = steps[phase];

    timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);

          if (phase === "inhale") setPhase("hold");
          else if (phase === "hold") setPhase("exhale");
          else if (phase === "exhale") {
            if (round >= totalRounds) {
              setIsCompleted(true);
              return 100;
            }
            setPhase("inhale");
            setRound(round + 1);
          }

          return 0;
        }
        return p + step.increment;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [phase, isPaused, isCompleted, round]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Icon */}
      <div className="bg-primary/20 flex items-center justify-center w-[100px] h-[100px] rounded-full animate-pulse ">
        {steps[phase].icon}
      </div>

      {/* Phase Name */}
      <span className="mt-2 text-lg font-semibold">{steps[phase].name}</span>

      {/* Progress Bar */}
      <Progress value={progress} className="w-[300px] mt-6 transition-all duration-700" />

      {/* Round Counter */}
      <span className="mt-7">
        {isCompleted ? "Completed 🎉" : `Round ${round} of ${totalRounds}`}
      </span>

      {/* Controls */}
      <Button
        className="mt-3 bg-transparent shadow hover:scale-105 hover:bg-gray-100"
        onClick={() => setIsPaused((prev) => !prev)}
      >
        {isPaused ? "Resume" : "Pause"}
      </Button>
    </div>
  );
};

export default Breathing;
