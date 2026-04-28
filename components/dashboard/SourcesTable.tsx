import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SourcesTableProps {
  data: Array<{ source: string; sessions: number }>;
}

export function SourcesTable({ data }: SourcesTableProps) {
  const total = data.reduce((sum, row) => sum + row.sessions, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-4">No data available</p>
          )}
          {data.map((row, i) => {
            const pct = total > 0 ? Math.round((row.sessions / total) * 100) : 0;
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 capitalize">{row.source || "direct"}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{pct}%</Badge>
                    <span className="text-sm tabular-nums text-slate-600">{row.sessions.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full">
                  <div
                    className="h-1.5 bg-blue-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
