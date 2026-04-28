import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Smartphone, Tablet } from "lucide-react";

interface DevicesTableProps {
  data: Array<{ device: string; sessions: number }>;
}

const deviceIcons: Record<string, React.ReactNode> = {
  desktop: <Monitor className="h-4 w-4" />,
  mobile: <Smartphone className="h-4 w-4" />,
  tablet: <Tablet className="h-4 w-4" />,
};

export function DevicesTable({ data }: DevicesTableProps) {
  const total = data.reduce((sum, row) => sum + row.sessions, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-4">No data available</p>
          )}
          {data.map((row, i) => {
            const pct = total > 0 ? Math.round((row.sessions / total) * 100) : 0;
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="text-slate-500">
                  {deviceIcons[row.device.toLowerCase()] ?? <Monitor className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium capitalize text-slate-700">{row.device}</span>
                    <span className="text-sm text-slate-500">{pct}% · {row.sessions.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
