"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";

interface InsightsPanelProps {
  insights: string[];
  currentData: unknown;
  onRefresh: () => void;
}

export function InsightsPanel({ insights, currentData, onRefresh }: InsightsPanelProps) {
  const [aiInsights, setAiInsights] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchAiInsights() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentData, previousData: currentData }),
      });
      const data = await res.json();
      setAiInsights(data.insights);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  const displayed = aiInsights ?? insights;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          Insights
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={fetchAiInsights}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            {loading ? "Analyzing..." : "AI Insights"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {displayed.map((insight, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
              {insight}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
