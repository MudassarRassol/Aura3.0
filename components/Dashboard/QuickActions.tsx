import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import MoodTracker from "./Moodtracker";
import CheckIn from "./CheckIn";
import Link from "next/link";

const QuickActions = ({ onDataChange }: { onDataChange?: () => void }) => {
  return (
    <Card className="border-primary backdrop-blur-3xl bg-transparent relative overflow-hidden group">
      {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent" /> */}
      <CardContent className="relative">
        
        {/* Header */}
        <div className="gap-4 flex p-4 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
              <Sparkles size={20} className="text-primary" />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg">Quick Actions</h3>
            <p>Start Your Wellness Journey</p>
          </div>
        </div>

        {/* Start Therapy */}
        <Link href="/page/therapy" >
                <div className="gap-4 flex items-center bg-primary rounded-2xl p-4 transition-all duration-300 cursor-pointer relative">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
              <MessageCircle size={20} />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg">Start Therapy</h3>
            <p>Begin a new session</p>
          </div>
          <ArrowRight size={20} className="absolute right-4 group-hover:translate-x-2 transition-all duration-300" />
        </div></Link>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <MoodTracker onDataChange={onDataChange} />
          <CheckIn onActivitySaved={onDataChange} />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
