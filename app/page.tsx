"use client";
import React, { useEffect, useState } from "react";
import Hero from "@/components/Home/Hero";
import EmotionSlider from "@/components/Home/EmotionSlider";
import Features from "@/components/Home/Features";
import { emotions } from "@/components/Home/Homedata";

const Home = () => {


  const [emotion, setEmotion] = useState(50);
  const [mounted, setMounted] = useState(false);

  const currentEmotion =
    emotions.find((em) => Math.abs(emotion - em.value) < 15) || emotions[2];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden   ">
      <Hero mounted={mounted} currentEmotion={currentEmotion} />
      <EmotionSlider
        emotions={emotions}
        emotion={emotion}
        setEmotion={setEmotion}
        currentEmotion={currentEmotion}
      />
      <Features  />
    </div>
  );
};

export default Home;
