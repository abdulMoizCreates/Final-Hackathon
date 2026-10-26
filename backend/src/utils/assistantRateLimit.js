/**
 * Per-user sliding-window rate limit for our own /assistant/chat route, so a
 * buggy front-end loop or a spam client cannot burn the Gemini free-tier quota.
 * In-memory (fine for a single-node demo); swap for a datastore if you scale out.
 */
const MINUTE_LIMIT = 8; // messages per rolling 60s
const DAY_LIMIT = 120;  // messages per rolling 24h

const buckets = new Map(); // userId -> { minute: number[], day: number[] }

function windowSeconds(oldest, spanMs, now) {
  return Math.max(1, Math.ceil((spanMs - (now - oldest)) / 1000));
}

export function checkRateLimit(userId) {
  const now = Date.now();
  let bucket = buckets.get(userId);
  if (!bucket) {
    bucket = { minute: [], day: [] };
    buckets.set(userId, bucket);
  }

  bucket.minute = bucket.minute.filter((t) => now - t < 60_000);
  bucket.day = bucket.day.filter((t) => now - t < 86_400_000);

  if (bucket.minute.length >= MINUTE_LIMIT) {
    return { allowed: false, retryAfterSeconds: windowSeconds(bucket.minute[0], 60_000, now) };
  }
  if (bucket.day.length >= DAY_LIMIT) {
    return { allowed: false, retryAfterSeconds: windowSeconds(bucket.day[0], 86_400_000, now) };
  }

  bucket.minute.push(now);
  bucket.day.push(now);
  return { allowed: true };
}

export function clearRateLimit(userId) {
  buckets.delete(userId);
}
