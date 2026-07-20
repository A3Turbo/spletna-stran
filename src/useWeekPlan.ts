import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeneratedPlan } from './generatePlan';
import { SAMPLE_WEEK, SHOPPING } from './data';

const STORAGE_KEY = '@jedilnik_plan';

const FALLBACK_PLAN: GeneratedPlan = {
  days: SAMPLE_WEEK as unknown as GeneratedPlan['days'],
  shoppingList: SHOPPING as unknown as GeneratedPlan['shoppingList'],
};

export function useWeekPlan() {
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) setPlan(JSON.parse(raw));
      setLoaded(true);
    });
  }, []);

  const savePlan = useCallback(async (generated: GeneratedPlan) => {
    setPlan(generated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(generated));
  }, []);

  const active = plan ?? FALLBACK_PLAN;

  return {
    days: active.days,
    shoppingList: active.shoppingList,
    hasGeneratedPlan: plan !== null,
    loaded,
    savePlan,
  };
}
