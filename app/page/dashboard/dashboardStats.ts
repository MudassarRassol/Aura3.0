// app/page/dashboard/dashboardStats.ts
import { Activity, MessageSquare, Smile, Percent,Target } from "lucide-react";

const getMoodEmoji = (score: number) => {
  if (score <= 25) return "😔"; // Very Sad
  if (score <= 40) return "😕"; // Sad
  if (score <= 60) return "🙂"; // Neutral
  if (score <= 80) return "😊"; // Happy
  return "😀"; // Very Happy
};
export const buildDashboardStats = (data: any) => {
  return [
    {
      title: "Sessions",
      value: data.todaySessions ?? 0,
      subtitle: "Total sessions today",
      icon: Activity,
    bg: "bg-purple-700/20 dark:bg-purple-700/10",
    text: "text-purple-900"
    },
    {
      title: "Activities",
      value: data.todayActivities ?? 0,
      subtitle: "Total activities today",
      icon: Target,
    bg: "bg-yellow-700/30 dark:bg-yellow-700/10",
    text: "text-yellow-900"
    },
    {
      title: "Mood",
      value: data.moodscore ??  "N/A",
      subtitle: `Score: ${data.moodscore ?? "-"} ${data.moodscore ? getMoodEmoji(data.moodscore) : ""}`,
      icon: Smile,
    bg: "bg-red-700/30 dark:bg-red-700/10",
    text: "text-red-900"
    },
    {
      title: "Completion",
      value: `${data.completionRate ?? "0.00"}%`,
      subtitle: "Based on moods & activity",
      icon: Percent,
    bg: "bg-blue-700/20 dark:bg-blue-700/10 ",
    text: "text-blue-900"
    },
  ];
};
