import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@jedilnik_ratings';

type Ratings = Record<string, number>; // dishName → 1-5

export function useRatings() {
  const [ratings, setRatings] = useState<Ratings>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) setRatings(JSON.parse(raw));
      setLoaded(true);
    });
  }, []);

  const rate = useCallback(async (dishName: string, stars: number) => {
    const updated = { ...ratings, [dishName]: stars };
    setRatings(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [ratings]);

  return { ratings, rate, loaded };
}
