"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, ActivitySquare, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const Insights = ({refreshSignal}:any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/ai");
        setData(res.data);
      } catch (err: any) {
        console.error("Error fetching insights:", err);
        setError("Failed to fetch insights");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [refreshSignal]);

  return (
    <Card className="border-primary backdrop-blur-3xl bg-transparent shadow-md relative overflow-hidden overflow-y-scroll no-scrollbar">
      <CardContent>
        <div>
          <span className="flex gap-3 items-center">
            <BrainCircuit size={20} className="text-primary" />
            <span className="text-xl font-semibold">Insights</span>
          </span>
          <p className="mt-2">
            Personalized recommendations based on your activity patterns
          </p>
        </div>

        {/* Loading */}
        {loading && (
           <div className=" w-full h-full mt-14 flex items-center justify-center  " >
              <Loader2 className="animate-spin w-8 h-8 " />
            </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-5 text-red-500">{error}</p>
        )}

        {/* Data */}
        {data && (
          <div className="flex flex-col gap-4 mt-5">
            {/* Game Suggestion */}
            {data.gameSuggestion && (
              <div className="w-full bg-primary/40 p-5 rounded-xl border border-primary/50">
                <h3 className="font-semibold text-lg">🎮 Game Suggestion</h3>
                <div className="mt-1 prose prose-sm ">
                  <ReactMarkdown>
                    {`**${data.gameSuggestion.name}** - ${data.gameSuggestion.description} (${data.gameSuggestion.duration})`}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {data.recommendations?.map((rec: string, i: number) => (
              <div key={i} className="w-full bg-primary/40 p-5 rounded-xl">
                <span className="flex gap-3 items-center">
                  <ActivitySquare size={20} className="text-primary" />
                  <span>Recommendation {i + 1}</span>
                </span>
                <div className="mt-2 prose prose-sm ">
                  <ReactMarkdown>{rec}</ReactMarkdown>
                </div>
              </div>
            ))}


          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Insights;
