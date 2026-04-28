export async function getGA4Properties(accessToken: string) {
  try {
    const response = await fetch(
      "https://analyticsadmin.googleapis.com/v1beta/properties?filter=parent:accounts/-",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return (data.properties ?? []).map((p: { name: string; displayName: string }) => ({
      propertyId: p.name,
      propertyName: p.displayName,
    }));
  } catch {
    return [];
  }
}
