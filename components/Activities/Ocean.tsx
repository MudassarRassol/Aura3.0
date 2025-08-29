import React, { useState, useEffect } from "react";
import { Waves, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Progress } from "../ui/progress";
import { motion } from "framer-motion";

const MEDITATION_DURATION = 5 * 60; // 5 minutes

const Ocean = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MEDITATION_DURATION);

  const [audioElement] = useState({
    waves: new Audio("/sound/wave.mp3"),
  });

  // setup audio
  useEffect(() => {
    Object.values(audioElement).forEach((audio) => {
      audio.loop = true;
      audio.volume = volume / 100;
    });

    return () => {
      Object.values(audioElement).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  // update volume live
  useEffect(() => {
    Object.values(audioElement).forEach((audio) => {
      audio.volume = volume / 100;
    });
  }, [volume]);

  // timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress(((MEDITATION_DURATION - newTime) / MEDITATION_DURATION) * 100);
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      Object.values(audioElement).forEach((audio) => audio.pause());
      setIsPlaying(false);
    } else {
      Object.values(audioElement).forEach((audio) => audio.play());
      setIsPlaying(true);
    }
  };

  // format mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-8">
      {/* Animated tree */}
      <div className="relative w-48 h-48">
        <motion.div
          animate={{
            borderRadius: ["20%", "20%", "50%", "50%", "20%"],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full blur-xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Waves className="w-24 h-24 text-blue-500 animate-pulse   " />
          </div>
        </motion.div>
      </div>

      {/* Volume Control */}
      <div className="w-64 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Volume</span>
            <span>{volume}%</span>
          </div>
          <div className="flex items-center gap-2">
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              min={0}
              max={100}
              step={1}
              className="w-full h-2"
            />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <Progress className="w-64  " value={progress} />
      {/* Time + Controls */}
      <div className="flex items-center justify-between w-64">
        <span className="text-sm text-muted-foreground">{formatTime(timeLeft)}</span>
        <Button size="icon" onClick={togglePlay}>
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
        <span className="text-sm text-muted-foreground">{formatTime(MEDITATION_DURATION)}</span>
      </div>
    </div>
  );
};

export default Ocean;
