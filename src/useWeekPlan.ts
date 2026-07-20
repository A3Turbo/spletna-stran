import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlanDay } from './generatePlan';
import { SAMPLE_WEEK } from './data';

const STORAGE_KEY = '@jedilnik_plan';

export function useWeekPlan() {
  const [plan, setPlan] = useState<PlanDay[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) setPlan(JSON.parse(raw));
      setLoaded(true);
    });
  }, []);

  const savePlan = useCallback(async (days: PlanDay[]) => {
    setPlan(days);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(days));
  }, []);

  return {
    plan: plan ?? (SAMPLE_WEEK as unknown as PlanDay[]),
    hasGeneratedPlan: plan !== null,
    loaded,
    savePlan,
  };
}
