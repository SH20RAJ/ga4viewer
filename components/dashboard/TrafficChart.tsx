"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrafficChartProps {
  data: Array<{ date: string; activeUsers: number; sessions: number }>;
}

export function TrafficChart({ data }: TrafficChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Traffic Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(v) => v.slice(5)}
            />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="activeUsers"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Active Users"
            />
            <Line
              type="monotone"
              dataKey="sessions"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              name="Sessions"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
