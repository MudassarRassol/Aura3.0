import { Ripple } from "@/components/magicui/ripple";

import { motion } from "framer-motion";
import { Waves } from "lucide-react";

type HeroProps = {
  mounted: boolean;
  currentEmotion: { color: string };
};

const Hero = ({ mounted, currentEmotion }: HeroProps) => {

  return (
    <section className="relative  select-none min-h-[80vh]  flex flex-col items-center justify-center  px-4">
      {/* Background gradients */}
      <div
        className={`absolute w-[500px] h-[500px] rounded-full blur-3xl -bottom-20 -right-20 transition-all duration-700 ease-in-out bg-gradient-to-r ${currentEmotion.color} to-transparent opacity-50`}
      />
      <div
        className={`absolute w-[500px] h-[500px] rounded-full blur-3xl top-0 -left-20 transition-all duration-700 ease-in-out bg-gradient-to-r ${currentEmotion.color} to-transparent opacity-80`}
      />

      <Ripple className="opacity-80" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative text-center space-y-8"
      >
        {/* Badge */}
        <span className="flex items-center  w-md mx-auto  justify-center gap-3 px-3 py-2 rounded-4xl border hover:bg-gradient-to-l hover:via-primary/90 dark:border-none hover:animate-pulse transition-all duration-700 ease-in-out backdrop-blur-md">
          <Waves className="w-6 h-6" />
          <span>Your AI Agent Mental Health Companion</span>
        </span>

        {/* Title */}
        <span className="flex flex-col text-8xl font-bold">
          <span className="inline-block bg-gradient-to-r from-primary via-primary/90 to-purple-600/20 hover:text-primary bg-clip-text text-transparent">
            Find Peace
          </span>
          <span>of Mind</span>
        </span>

        {/* Subtitle */}
        <p className=" px-10 md:p-0 max-w-xl mx-auto">
          Experience a new way of emotional support. Our AI companion is here to
          listen, understand, and guide you through {`life's`} journey.
        </p>

      </motion.div>
    </section>
  );
};

export default Hero;
