import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PANTRY } from './data';

const STORAGE_KEY = '@jedilnik_pantry';

export type PantryItem = {
  id: string;
  name: string;
  unit: string;
  have: boolean;
  savedPrice: number;
};

function fromSample(): PantryItem[] {
  return PANTRY.map((p, i) => ({ id: `sample-${i}`, name: p.name, unit: p.unit, have: p.have, savedPrice: p.savedPrice }));
}

export function usePantry() {
  const [items, setItems] = useState<PantryItem[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      setItems(raw ? JSON.parse(raw) : fromSample());
      setLoaded(true);
    });
  }, []);

  const persist = useCallback(async (updated: PantryItem[]) => {
    setItems(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const active = items ?? [];

  const addItem = useCallback((item: Omit<PantryItem, 'id'>) => {
    const withId: PantryItem = { ...item, id: Date.now().toString() };
    return persist([...active, withId]);
  }, [active, persist]);

  const updateItem = useCallback((item: PantryItem) => {
    return persist(active.map(p => p.id === item.id ? item : p));
  }, [active, persist]);

  const removeItem = useCallback((id: string) => {
    return persist(active.filter(p => p.id !== id));
  }, [active, persist]);

  const toggleHave = useCallback((id: string) => {
    return persist(active.map(p => p.id === id ? { ...p, have: !p.have } : p));
  }, [active, persist]);

  return { items: active, loaded, addItem, updateItem, removeItem, toggleHave };
}
