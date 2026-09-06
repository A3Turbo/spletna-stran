import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UNITS_KEY = '@nana_units';

export type UnitSystem = 'metric' | 'imperial';

function detectUnits(): UnitSystem {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale ?? 'en-US';
    return /-(US|LR|MM)$/.test(locale) ? 'imperial' : 'metric';
  } catch {
    return 'metric';
  }
}

export function useUnits() {
  const [units, setUnitsState] = useState<UnitSystem>('metric');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(UNITS_KEY).then(saved => {
      if (saved === 'metric' || saved === 'imperial') {
        setUnitsState(saved);
      } else {
        setUnitsState(detectUnits());
      }
      setLoaded(true);
    });
  }, []);

  async function setUnits(u: UnitSystem) {
    setUnitsState(u);
    await AsyncStorage.setItem(UNITS_KEY, u);
  }

  return { units, setUnits, loaded };
}
