import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopPagesTableProps {
  data: Array<{ pagePath: string; pageTitle: string; pageViews: number }>;
}

export function TopPagesTable({ data }: TopPagesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-4">No data available</p>
          )}
          {data.map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-medium text-slate-700 truncate">{row.pagePath}</p>
                <p className="text-xs text-slate-400 truncate">{row.pageTitle}</p>
              </div>
              <span className="text-sm font-semibold text-slate-900 tabular-nums">
                {row.pageViews.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
