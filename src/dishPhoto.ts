import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY;
const CACHE_KEY = '@jedilnik_photo_cache';

let cache: Record<string, string> | null = null;

async function loadCache(): Promise<Record<string, string>> {
  if (cache) return cache;
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  cache = raw ? JSON.parse(raw) : {};
  return cache!;
}

async function saveCache() {
  if (cache) await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

async function fetchOne(query: string): Promise<string | null> {
  if (!API_KEY) return null;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: API_KEY } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.photos?.[0]?.src?.large ?? null;
  } catch {
    return null;
  }
}

/** Looks up (and caches) a real food photo for a dish name. Falls back to null on any failure. */
export async function getDishPhotoUrl(dishName: string): Promise<string | null> {
  const c = await loadCache();
  if (c[dishName]) return c[dishName];

  const url = await fetchOne(`${dishName} food`);
  if (url) {
    c[dishName] = url;
    await saveCache();
  }
  return url;
}

/** Fetches photos for many dish names with limited concurrency, to stay polite to the API. */
export async function getDishPhotoUrls(dishNames: string[]): Promise<Record<string, string>> {
  const unique = Array.from(new Set(dishNames));
  const result: Record<string, string> = {};
  const CONCURRENCY = 5;

  for (let i = 0; i < unique.length; i += CONCURRENCY) {
    const batch = unique.slice(i, i + CONCURRENCY);
    const urls = await Promise.all(batch.map(getDishPhotoUrl));
    batch.forEach((name, idx) => {
      const url = urls[idx];
      if (url) result[name] = url;
    });
  }

  return result;
}
