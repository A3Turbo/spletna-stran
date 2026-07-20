import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@jedilnik_family';

export function useFamilyCount(): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) setCount(JSON.parse(raw).length);
    });
  }, []);
  return count;
}
