import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

const TTL = 3600;

function cacheKey(userId: string, propertyId: string, dateRange: string) {
  return `ga4:${userId}:${propertyId}:${dateRange}`;
}

export async function getCachedAnalytics(
  userId: string,
  propertyId: string,
  dateRange: string
) {
  try {
    const client = getRedis();
    if (!client) return null;
    const key = cacheKey(userId, propertyId, dateRange);
    const data = await client.get(key);
    return data as Record<string, unknown> | null;
  } catch {
    return null;
  }
}

export async function setCachedAnalytics(
  userId: string,
  propertyId: string,
  dateRange: string,
  data: unknown
) {
  try {
    const client = getRedis();
    if (!client) return;
    const key = cacheKey(userId, propertyId, dateRange);
    await client.set(key, JSON.stringify(data), { ex: TTL });
  } catch {
    // silently fail
  }
}

export async function invalidateCache(userId: string, propertyId: string) {
  try {
    const client = getRedis();
    if (!client) return;
    const ranges = ["today", "yesterday", "7daysAgo", "30daysAgo"];
    await Promise.all(
      ranges.map((r) => client!.del(cacheKey(userId, propertyId, r)))
    );
  } catch {
    // silently fail
  }
}
