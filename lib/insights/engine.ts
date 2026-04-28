type Overview = {
  activeUsers: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
};

type AnalyticsData = {
  overview: Overview;
  topPages: Array<{ pagePath: string; pageTitle: string; pageViews: number }>;
  trafficSources: Array<{ source: string; sessions: number }>;
  countries: Array<{ country: string; sessions: number }>;
  devices: Array<{ device: string; sessions: number }>;
  timeSeries: Array<{ date: string; activeUsers: number; sessions: number }>;
};

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function generateInsights(
  currentData: AnalyticsData,
  previousData: AnalyticsData
): string[] {
  const insights: string[] = [];

  const userChange = pctChange(
    currentData.overview.activeUsers,
    previousData.overview.activeUsers
  );
  if (Math.abs(userChange) >= 5) {
    insights.push(
      `Active users ${userChange >= 0 ? "increased" : "decreased"} by ${Math.abs(userChange)}% compared to the previous period.`
    );
  }

  const pvChange = pctChange(
    currentData.overview.pageViews,
    previousData.overview.pageViews
  );
  if (Math.abs(pvChange) >= 5) {
    insights.push(
      `Page views ${pvChange >= 0 ? "increased" : "decreased"} by ${Math.abs(pvChange)}% compared to the previous period.`
    );
  }

  const sessionChange = pctChange(
    currentData.overview.sessions,
    previousData.overview.sessions
  );
  if (Math.abs(sessionChange) >= 5) {
    insights.push(
      `Sessions ${sessionChange >= 0 ? "grew" : "dropped"} by ${Math.abs(sessionChange)}% compared to the previous period.`
    );
  }

  if (currentData.overview.bounceRate > 70) {
    insights.push(
      `High bounce rate detected (${currentData.overview.bounceRate.toFixed(1)}%). Consider improving landing page content.`
    );
  }

  if (currentData.trafficSources.length > 0) {
    const top = currentData.trafficSources[0];
    insights.push(
      `Top traffic source: "${top.source}" with ${top.sessions.toLocaleString()} sessions.`
    );
  }

  if (currentData.topPages.length > 0) {
    const topPage = currentData.topPages[0];
    insights.push(
      `Most visited page: "${topPage.pagePath}" with ${topPage.pageViews.toLocaleString()} views.`
    );
  }

  if (currentData.countries.length > 0) {
    const topCountry = currentData.countries[0];
    insights.push(`Majority of traffic comes from ${topCountry.country}.`);
  }

  if (currentData.devices.length > 0) {
    const topDevice = currentData.devices[0];
    const totalDeviceSessions = currentData.devices.reduce((a, d) => a + d.sessions, 0);
    const pct =
      totalDeviceSessions > 0
        ? Math.round((topDevice.sessions / totalDeviceSessions) * 100)
        : 0;
    insights.push(`${pct}% of sessions are from ${topDevice.device} devices.`);
  }

  return insights.length > 0
    ? insights
    : ["No significant changes detected in this period."];
}
