import React from "react";
import {
  Brain,
  Shield,
  Activity,
  Wifi,
  Lock,
  Heart,
  LineChart,
  ScanLine,
  Sparkles,
  CircleFadingPlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const about = [
    {
        icon : <Heart size={25} className="text-primary" />,
        title : "Our Mission",
        description : "To democratize access to mental health support through ethical AI and blockchain technology, making quality therapeutic care available to everyone, everywhere, at any time."
    },
    {
        icon : <CircleFadingPlusIcon size={25} className="text-primary" />,
        title : "Our Vision",
        description : "A world where mental health support is accessible, private, and personalized, powered by trusted AI agents and secured by blockchain technology."
    },
        {
        icon : <Sparkles size={25} className="text-primary" />,
        title : "Our Values",
        description : "Privacy, Innovation, Empathy, and Trust form the cornerstone of our platform, ensuring the highest standards of care and security."
    }

]

const page = () => {
  return (
    <div className=" mt-14  py-10 md:p-10 ">
      <div className=" flex flex-col items-center justify-center ">
        <h1 className=" font-extrabold text-4xl text-primary ">
          About Aura3.0
        </h1>
        <p className=" text-sm text-muted-foreground mt-4 p-3 md:w-2xl text-center ">
          We're revolutionizing mental health support by combining cutting-edge
          AI technology with the security and transparency of blockchain.
        </p>
      </div>
      <div className=" w-full md:max-w-[95rem]  ">
        <div className=" grid grid-cols-1 md:grid-cols-3  gap-4 p-10 ">
          {about.map((ele, index) => {
            return (
              <div className=" flex gap-2 flex-col border border-primary/60 rounded-2xl p-10 shadow-md justify-center items-center ">
                {ele.icon}
                <span className="text-lg font-semibold">{ele.title}</span>
                <span className="text-center" >{ele.description}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default page;
