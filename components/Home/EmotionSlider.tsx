import { Slider } from "@/components/ui/slider";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
type Emotion = { value: number; label: string; color: string };

type EmotionSliderProps = {
  emotions: Emotion[];
  emotion: number;
  setEmotion: (val: number) => void;
  currentEmotion: Emotion;
};

const EmotionSlider = ({
  emotions,
  emotion,
  setEmotion,
  currentEmotion,
}: EmotionSliderProps) => {
   const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  return (
    <div className="flex flex-col items-center justify-center w-full -mt-10  md:w-2xl mx-auto px-3 ">
      <span>{`Whatever you're feeling, we're here to listen`}</span>

      {/* Emoji List */}
      <div className="flex items-center justify-around gap-5 w-full  md:w-3xl  mt-2">
        {emotions.map((em) => (
          <div
            key={em.value}
            className={`${
              Math.abs(em.value - emotion) < 15
                ? "opacity-100 scale-110"
                : "opacity-60"
            } flex flex-col cursor-pointer`}
            onClick={() => setEmotion(em.value)}
          >
            <span className="mt-2 text-primary text-3xl">
              {em.label.split(" ")[0]}
            </span>
            <span className="mt-2 text-sm">{em.label.split(" ")[1]}</span>
          </div>
        ))}
      </div>

      {/* Slider */}
      <Slider
        value={[emotion]}
        onValueChange={(value) => setEmotion(value[0])}
        min={0}
        max={100}
        step={1}
        className={`py-4 mt-4 shadow-md p-4 rounded-full bg-gradient-to-l via-${currentEmotion.color} to-transparent`}
      />

      <p className="mt-5 animate-pulse text-sm">
        {`Slide to express how you're feeling today`}
      </p>

      {/* CTA */}
      <Link href={isLoggedIn ? "/page/dashboard" : "/page/login"} >
      <Button className="mt-10 font-semibold w-[200px] p-5 rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent hover:scale-110 hover:to-purple-700 shadow-2xl flex items-center mx-auto ">
        Begin Your Journey
        <ArrowRight className="  text-purple-500  hover:ml-2  " />
      </Button>
      </Link>
    </div>
  );
};

export default EmotionSlider;
