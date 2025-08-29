"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TodayDate from "@/app/page/dashboard/date";
import { buildDashboardStats } from "@/app/page/dashboard/dashboardStats";
import { Loader2 } from "lucide-react";

const Overview = ({refreshSignal}:any) => {
  const [stats, setStats] = useState<any[]>([]);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/process"); // 👈 aapka API route
        const data = await res.json();
        console.log(data)
        setStats(buildDashboardStats(data));
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchStats();
  }, [refreshSignal]);

  return (
    <Card className="border-primary backdrop-blur-3xl bg-transparent shadow-md relative overflow-hidden">
      <CardContent className="relative">
        <div>
          <h3 className="font-semibold text-lg">Today's Overview</h3>
          <p className="text-xs">
            Your wellness metrics for <TodayDate />
          </p>
        </div>
        {
          stats.length == 0 ? (
            <div className=" w-full h-full mt-24 flex items-center justify-center  " >
              <Loader2 className="animate-spin w-8 h-8 " />
            </div>
          ) : (
                    <div className="grid grid-cols-2 grid-rows-2 mt-8 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`p-4 2xl:p-6 rounded-xl ${stat.bg} hover:scale-105 transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-center gap-2">
                <stat.icon className={`w-6 h-6 ${stat.text}`} />
                <h3 className="font-semibold text-sm 2xl:text-xl">{stat.title}</h3>
              </div>
              <p className="text-xl 2xl:text-xl font-bold mt-2">{stat.value}</p>
              <p className="text-sm opacity-75 mt-2">{stat.subtitle}</p>
            </div>
          ))}
        </div>
          )
        }

      </CardContent>
    </Card>
  );
};

export default Overview;
