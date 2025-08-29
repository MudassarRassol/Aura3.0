"use client";
import { Music2 } from "lucide-react";

interface ActivityCardProps {
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  bgColor: string;
  onClick: () => void;
  isSelected: boolean;
}

const ActivityCard = ({
  title,
  description,
  duration,
  icon,
  bgColor,
  onClick,
  isSelected,
}: ActivityCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex gap-7 border-2 border-primary/45 shadow rounded-2xl p-5 transition-all duration-500 cursor-pointer
        ${isSelected ? "bg-primary/20 border-primary" : "hover:scale-[1.02] hover:bg-primary/10 dark:border-primary/10"}
      `}
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-md ${bgColor}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{title}</span>
        <span>{description}</span>
        <span className="flex items-center gap-2 mt-2">
          <Music2 size={15} />
          <span>{duration}</span>
        </span>
      </div>
    </div>
  );
};

export default ActivityCard;
