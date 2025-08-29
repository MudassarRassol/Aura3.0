"use client";
import React, { useState } from "react";
import Header from "@/components/Dashboard/Header";
import QuickActions from "@/components/Dashboard/QuickActions";
import Overview from "@/components/Dashboard/Overview";
import Insights from "@/components/Dashboard/Insights";
import { Flower2, Gamepad2, Music2, TreePine, Waves, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ActivityCard from "@/components/Dashboard/ActivityCard";
import Breathing from "@/components/Activities/Breathing";
import Zen from "@/components/Activities/Zen";
import Mindful from "@/components/Activities/Mindful";
import Ocean from "@/components/Activities/Ocean";

const Dashboard = () => {
  const activities = [
    {
      title: "Breathing Patterns",
      description: "Follow calming breathing exercises with visual guidance",
      duration: "5 mins",
      icon: <Wind size={25} className="text-blue-700" />,
      bgColor: "bg-blue-900/10",
    },
    {
      title: "Zen Garden",
      description: "Create and maintain your digital peaceful space",
      duration: "10 mins",
      icon: <Flower2 size={25} className="text-red-700" />,
      bgColor: "bg-red-900/10",
    },
    {
      title: "Mindful Forest",
      description: "Take a peaceful walk through a virtual forest",
      duration: "15 mins",
      icon: <TreePine size={25} className="text-green-700" />,
      bgColor: "bg-green-900/10",
    },
    {
      title: "Ocean Waves",
      description: "Match your breath with gentle ocean waves",
      duration: "8 mins",
      icon: <Waves size={25} className="text-[#06B6D4]" />,
      bgColor: "bg-[#06B6D4]/10",
    },
  ];
const [refreshSignal, setRefreshSignal] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(activities[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen relative mb-5 mt-24 md:mt-28 px-3 md:px-10">
      <Header />
      <div className="space-y-6 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4   lg:h-[26rem] ">
          <QuickActions onDataChange={() => setRefreshSignal(prev => prev + 1)} />
          <Overview refreshSignal={refreshSignal} />
          <Insights refreshSignal={refreshSignal} />
        </div>
      </div>

      {/* Activities Section */}
      <div className="mt-10 border-primary/10 border-2 shadow-md rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <Gamepad2 size={25} className="text-primary" />
          <h2 className="text-2xl font-semibold">Anxiety Relief Activities</h2>
        </div>
        <p>Interactive exercises to help reduce stress and anxiety</p>

        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 mt-4 gap-4">
          {activities.map((act, idx) => (
            <ActivityCard
              key={idx}
              {...act}
              onClick={() => {
                setSelectedActivity(act);
                setIsOpen(true);
              }}
              isSelected={selectedActivity.title === act.title}
            />
          ))}
        </div>

        {/* Start Button */}
        <Button className="flex items-center gap-2 mx-auto mt-5" onClick={()=>setIsOpen(true)} >
          <Gamepad2 className="text-black" />
          <span className="text-black">Start {selectedActivity.title}</span>
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-primary/10 shadow-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {selectedActivity.title}
            </DialogTitle>
            <DialogDescription>
              {selectedActivity.title === "Breathing Patterns" && <Breathing />}
              {selectedActivity.title ===  "Zen Garden" && <Zen />}
              {selectedActivity.title ===  "Mindful Forest" && <Mindful />}
              {selectedActivity.title ===  "Ocean Waves" && <Ocean />}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
