"use client";

import { useState, useEffect, useCallback } from "react";
import { PropertySelector } from "@/components/ui/PropertySelector";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { StatsCard } from "./StatsCard";
import { TopPagesTable } from "./TopPagesTable";
import { TrafficChart } from "./TrafficChart";
import { SourcesTable } from "./SourcesTable";
import { CountriesTable } from "./CountriesTable";
import { DevicesTable } from "./DevicesTable";
import { InsightsPanel } from "./InsightsPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Eye, MousePointerClick, TrendingUp } from "lucide-react";
import type { DateRange } from "@/lib/ga/analytics";

interface AnalyticsData {
  overview: {
    activeUsers: number;
    pageViews: number;
    sessions: number;
    bounceRate: number;
  };
  topPages: Array<{ pagePath: string; pageTitle: string; pageViews: number }>;
  trafficSources: Array<{ source: string; sessions: number }>;
  countries: Array<{ country: string; sessions: number }>;
  devices: Array<{ device: string; sessions: number }>;
  timeSeries: Array<{ date: string; activeUsers: number; sessions: number }>;
  insights: string[];
}

interface DashboardClientProps {
  userId: string;
  userName: string;
}

export function DashboardClient({ userName }: DashboardClientProps) {
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>("7daysAgo");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!selectedProperty) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/analytics?propertyId=${encodeURIComponent(selectedProperty)}&dateRange=${dateRange}`
      );
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [selectedProperty, dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {userName}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <PropertySelector
            onSelect={setSelectedProperty}
            selected={selectedProperty}
          />
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {!selectedProperty && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <p className="text-blue-700 font-medium">Select a GA4 property to view analytics</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      )}

      {selectedProperty && loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      )}

      {selectedProperty && data && !loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Active Users"
              value={data.overview.activeUsers.toLocaleString()}
              icon={<Users className="h-5 w-5" />}
              color="blue"
            />
            <StatsCard
              title="Page Views"
              value={data.overview.pageViews.toLocaleString()}
              icon={<Eye className="h-5 w-5" />}
              color="green"
            />
            <StatsCard
              title="Sessions"
              value={data.overview.sessions.toLocaleString()}
              icon={<MousePointerClick className="h-5 w-5" />}
              color="purple"
            />
            <StatsCard
              title="Bounce Rate"
              value={`${data.overview.bounceRate.toFixed(1)}%`}
              icon={<TrendingUp className="h-5 w-5" />}
              color="orange"
            />
          </div>

          <TrafficChart data={data.timeSeries} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopPagesTable data={data.topPages} />
            <SourcesTable data={data.trafficSources} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CountriesTable data={data.countries} />
            <DevicesTable data={data.devices} />
          </div>

          <InsightsPanel
            insights={data.insights}
            currentData={data}
            onRefresh={fetchAnalytics}
          />
        </>
      )}
    </div>
  );
}
