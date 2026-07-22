import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal } from './generatePlan';

const STORAGE_KEY = '@jedilnik_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) setFavorites(JSON.parse(raw));
      setLoaded(true);
    });
  }, []);

  const persist = useCallback(async (updated: Meal[]) => {
    setFavorites(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const isFavorite = useCallback(
    (name: string) => favorites.some(m => m.name === name),
    [favorites]
  );

  const toggleFavorite = useCallback((meal: Meal) => {
    if (favorites.some(m => m.name === meal.name)) {
      return persist(favorites.filter(m => m.name !== meal.name));
    }
    return persist([...favorites, meal]);
  }, [favorites, persist]);

  return { favorites, loaded, isFavorite, toggleFavorite };
}
