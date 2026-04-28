import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CountriesTableProps {
  data: Array<{ country: string; sessions: number }>;
}

export function CountriesTable({ data }: CountriesTableProps) {
  const total = data.reduce((sum, row) => sum + row.sessions, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Countries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-4">No data available</p>
          )}
          {data.map((row, i) => {
            const pct = total > 0 ? Math.round((row.sessions / total) * 100) : 0;
            return (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 tabular-nums w-4">{i + 1}</span>
                  <span className="text-sm text-slate-700">{row.country}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full hidden sm:block">
                    <div className="h-1.5 bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-medium tabular-nums text-slate-900">
                    {row.sessions.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
