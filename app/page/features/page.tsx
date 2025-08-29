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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    title: "AI-Powered Therapy",
    description:
      "24/7 access to empathetic AI agents trained in various therapeutic approaches, providing personalized mental health support.",
    icon: <Brain size={25} className="text-primary" />,
  },
  {
    title: "Blockchain Security",
    description:
      "Your therapy sessions are secured by blockchain technology, ensuring complete privacy and transparent record-keeping.",
    icon: <Shield size={25} className="text-primary" />,
  },
  {
    title: "Smart Analysis",
    description:
      "Advanced NLP and emotion detection helps understand your mental state and provide appropriate interventions.",
    icon: <ScanLine size={25} className="text-primary" />,
  },
  {
    title: "Crisis Detection",
    description:
      "Real-time monitoring and emergency response protocols to ensure your safety during critical situations.",
    icon: <Activity size={25} className="text-primary" />,
  },
  {
    title: "IoT Integration",
    description:
      "Connect with smart home devices to create an ambient therapeutic environment that adapts to your needs.",
    icon: <Wifi size={25} className=" text-primary " />,
  },
  {
    title: "Progress Tracking",
    description:
      "Detailed analytics and insights about your mental health journey, with blockchain-verified session records.",
    icon: <LineChart size={25} className="text-primary" />,
  },
  {
    title: "Privacy First",
    description:
      "End-to-end encryption and zero-knowledge proofs ensure your data remains completely confidential.",
    icon: <Lock size={25} className="text-primary" />,
  },
  {
    title: "Holistic Care",
    description:
      "Integration with wearables and health providers for comprehensive mental wellness monitoring.",
    icon: <Heart size={25} className="text-primary" />,
  },
];

const page = () => {
  return (
    <div className=" mt-14  py-10 md:p-10 ">
      <div className=" flex flex-col items-center justify-center ">
        <h1 className=" font-extrabold text-4xl text-primary ">
          Platform Features
        </h1>
        <p className=" text-sm text-muted-foreground mt-4 p-3 md:w-2xl text-center ">
          Discover how our AI-powered platform revolutionizes mental health
          support with cutting-edge technology and unwavering privacy
          protection.
        </p>
      </div>
      <div className=" w-full md:max-w-[95rem]  ">
        <div className=" grid grid-cols-1 md:grid-cols-3 2xl:grids-cols-4 gap-4 p-10 ">
          {features.map((ele, index) => {
            return (
              <div className=" flex gap-2 flex-col border border-primary/20 rounded-2xl p-10 shadow-md ">
                {ele.icon}
                <span className="text-lg font-semibold">{ele.title}</span>
                <span>{ele.description}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className=" flex flex-col items-center justify-center ">
        <h1 className=" font-extrabold text-2xl text-primary ">
          Ready to Get Started?
        </h1>
        <p className=" text-sm text-muted-foreground mt-4 p-3 md:w-2xl text-center ">
          Join thousands of users benefiting from AI-powered mental health support.
        </p>
        <Link href={'/page/dashboard'} className=" cursor-pointer " >
        <Button className=" flex items-center text-foreground cursor-pointer text-black " >
            Start Your Journey 
            <Heart size={15} />
        </Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
