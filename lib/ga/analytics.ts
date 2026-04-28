import { BetaAnalyticsDataClient } from "@google-analytics/data";

export type DateRange = "today" | "yesterday" | "7daysAgo" | "30daysAgo";

function getDateRange(range: DateRange): { startDate: string; endDate: string } {
  switch (range) {
    case "today":
      return { startDate: "today", endDate: "today" };
    case "yesterday":
      return { startDate: "yesterday", endDate: "yesterday" };
    case "7daysAgo":
      return { startDate: "7daysAgo", endDate: "today" };
    case "30daysAgo":
      return { startDate: "30daysAgo", endDate: "today" };
    default:
      return { startDate: "7daysAgo", endDate: "today" };
  }
}

function createClient(accessToken: string) {
  const authClient = {
    getAccessToken: async () => ({ token: accessToken }),
  };
  return new BetaAnalyticsDataClient({ authClient } as any);
}

export async function getOverviewMetrics(
  propertyId: string,
  accessToken: string,
  dateRange: DateRange
) {
  const client = createClient(accessToken);
  const { startDate, endDate } = getDateRange(dateRange);

  const [response] = await client.runReport({
    property: propertyId.startsWith("properties/") ? propertyId : `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: "activeUsers" },
      { name: "screenPageViews" },
      { name: "sessions" },
      { name: "bounceRate" },
    ],
  });

  const row = response.rows?.[0];
  return {
    activeUsers: parseInt(row?.metricValues?.[0]?.value ?? "0"),
    pageViews: parseInt(row?.metricValues?.[1]?.value ?? "0"),
    sessions: parseInt(row?.metricValues?.[2]?.value ?? "0"),
    bounceRate: parseFloat(row?.metricValues?.[3]?.value ?? "0"),
  };
}

export async function getTopPages(
  propertyId: string,
  accessToken: string,
  dateRange: DateRange
) {
  const client = createClient(accessToken);
  const { startDate, endDate } = getDateRange(dateRange);

  const [response] = await client.runReport({
    property: propertyId.startsWith("properties/") ? propertyId : `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 10,
  });

  return (response.rows ?? []).map((row) => ({
    pagePath: row.dimensionValues?.[0]?.value ?? "",
    pageTitle: row.dimensionValues?.[1]?.value ?? "",
    pageViews: parseInt(row.metricValues?.[0]?.value ?? "0"),
  }));
}

export async function getTrafficSources(
  propertyId: string,
  accessToken: string,
  dateRange: DateRange
) {
  const client = createClient(accessToken);
  const { startDate, endDate } = getDateRange(dateRange);

  const [response] = await client.runReport({
    property: propertyId.startsWith("properties/") ? propertyId : `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "sessionSource" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10,
  });

  return (response.rows ?? []).map((row) => ({
    source: row.dimensionValues?.[0]?.value ?? "",
    sessions: parseInt(row.metricValues?.[0]?.value ?? "0"),
  }));
}

export async function getCountries(
  propertyId: string,
  accessToken: string,
  dateRange: DateRange
) {
  const client = createClient(accessToken);
  const { startDate, endDate } = getDateRange(dateRange);

  const [response] = await client.runReport({
    property: propertyId.startsWith("properties/") ? propertyId : `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "country" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10,
  });

  return (response.rows ?? []).map((row) => ({
    country: row.dimensionValues?.[0]?.value ?? "",
    sessions: parseInt(row.metricValues?.[0]?.value ?? "0"),
  }));
}

export async function getDevices(
  propertyId: string,
  accessToken: string,
  dateRange: DateRange
) {
  const client = createClient(accessToken);
  const { startDate, endDate } = getDateRange(dateRange);

  const [response] = await client.runReport({
    property: propertyId.startsWith("properties/") ? propertyId : `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });

  return (response.rows ?? []).map((row) => ({
    device: row.dimensionValues?.[0]?.value ?? "",
    sessions: parseInt(row.metricValues?.[0]?.value ?? "0"),
  }));
}

export async function getTimeSeries(
  propertyId: string,
  accessToken: string,
  dateRange: DateRange
) {
  const client = createClient(accessToken);
  const { startDate, endDate } = getDateRange(dateRange);

  const [response] = await client.runReport({
    property: propertyId.startsWith("properties/") ? propertyId : `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "activeUsers" }, { name: "sessions" }],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });

  return (response.rows ?? []).map((row) => {
    const dateStr = row.dimensionValues?.[0]?.value ?? "";
    return {
      date: `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`,
      activeUsers: parseInt(row.metricValues?.[0]?.value ?? "0"),
      sessions: parseInt(row.metricValues?.[1]?.value ?? "0"),
    };
  });
}

export async function getAllAnalytics(
  propertyId: string,
  accessToken: string,
  dateRange: DateRange
) {
  const [overview, topPages, trafficSources, countries, devices, timeSeries] =
    await Promise.all([
      getOverviewMetrics(propertyId, accessToken, dateRange),
      getTopPages(propertyId, accessToken, dateRange),
      getTrafficSources(propertyId, accessToken, dateRange),
      getCountries(propertyId, accessToken, dateRange),
      getDevices(propertyId, accessToken, dateRange),
      getTimeSeries(propertyId, accessToken, dateRange),
    ]);

  return { overview, topPages, trafficSources, countries, devices, timeSeries };
}
