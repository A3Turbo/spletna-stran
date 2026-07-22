import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../src/theme';
import { Eyebrow } from '../src/components';
import { useRatings } from '../src/useRatings';
import { useRegion } from '../src/useRegion';
import { useWeekPlan } from '../src/useWeekPlan';
import { useFavorites } from '../src/useFavorites';
import { generateWeekPlan, FamilyMember } from '../src/generatePlan';
import { getWeekStart, getWeekDays } from '../src/utils';

const FAMILY_KEY = '@jedilnik_family';

const STEPS = [
  'Reading family preferences...',
  'Finding recipes for all members...',
  'Composing the weekly rhythm...',
  'Preparing the shopping list...',
];

export default function GeneratingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { ratings, loaded: ratingsLoaded } = useRatings();
  const { region, loaded: regionLoaded } = useRegion();
  const { savePlan } = useWeekPlan();
  const { favorites, loaded: favoritesLoaded } = useFavorites();
  const started = useRef(false);

  useEffect(() => {
    if (!ratingsLoaded || !regionLoaded || !favoritesLoaded || started.current) return;
    started.current = true;

    let cancelled = false;
    const stepTimer = setInterval(() => {
      setStep(s => (s < STEPS.length - 1 ? s + 1 : s));
    }, 700);

    async function run() {
      try {
        const raw = await AsyncStorage.getItem(FAMILY_KEY);
        const family: FamilyMember[] = raw ? JSON.parse(raw) : [];
        const weekDays = getWeekDays(getWeekStart());

        const generated = await generateWeekPlan({ family, ratings, region, weekDays, favorites });
        if (cancelled) return;

        await savePlan(generated);
        clearInterval(stepTimer);
        setStep(STEPS.length - 1);
        setTimeout(() => { if (!cancelled) router.replace('/week'); }, 500);
      } catch (e: any) {
        if (cancelled) return;
        clearInterval(stepTimer);
        setError(e?.message ?? 'Something went wrong while generating your plan.');
      }
    }
    run();

    return () => { cancelled = true; clearInterval(stepTimer); };
  }, [ratingsLoaded, regionLoaded, favoritesLoaded]);

  const progress = ((step + 1) / STEPS.length) * 100;

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
        <View style={styles.container}>
          <Eyebrow color={colors.tomato}>Couldn't generate plan</Eyebrow>
          <Text style={styles.title}><Text style={{ fontStyle: 'italic' }}>Something</Text>{'\n'}went wrong.</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => {
            setError(null);
            setStep(0);
            started.current = false;
          }}>
            <Text style={styles.btnPrimaryText}>Try again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnGhost} onPress={() => router.back()}>
            <Text style={styles.btnGhostText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={styles.container}>
        <Eyebrow>Preparing...</Eyebrow>
        <Text style={styles.title}><Text style={{ fontStyle: 'italic' }}>Writing</Text>{'\n'}your meal plan.</Text>

        <View style={styles.steps}>
          {STEPS.map((s, i) => (
            <View key={i} style={[styles.stepRow, i < STEPS.length - 1 && styles.stepBorder]}>
              <View style={[styles.stepDot, { backgroundColor: i <= step ? colors.tomato : 'transparent', borderColor: i <= step ? colors.tomato : colors.rule }]}>
                {i < step && <Text style={styles.stepCheck}>✓</Text>}
                {i === step && <View style={styles.stepSpinner} />}
              </View>
              <Text style={[styles.stepText, { color: i <= step ? colors.ink : colors.inkSoft, fontFamily: i === step ? 'Inter Medium' : 'Inter' }]}>{s}</Text>
            </View>
          ))}
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
        </View>
        <Text style={styles.progressLabel}>~{Math.round(STEPS.length * 700 / 1000)} seconds · {Math.round(progress)}%</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 22 },
  title: { fontFamily: 'DM Serif Display', fontSize: 38, lineHeight: 38, letterSpacing: -0.5, color: colors.ink, marginBottom: 28 },
  steps: { marginBottom: 28 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  stepBorder: { borderBottomWidth: 1, borderBottomColor: colors.rule },
  stepDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  stepCheck: { color: '#fff', fontSize: 12 },
  stepSpinner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  stepText: { fontSize: 14, flex: 1 },
  progressBar: { height: 2, backgroundColor: colors.rule, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.tomato },
  progressLabel: { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 1.5, color: colors.inkSoft, marginTop: 8, textAlign: 'right' },
  errorText: { fontFamily: 'Inter', fontSize: 14, lineHeight: 21, color: colors.inkSoft, marginBottom: 28 },
  btnPrimary: { backgroundColor: colors.ink, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  btnPrimaryText: { fontFamily: 'Inter Medium', fontSize: 15, color: colors.paper },
  btnGhost: { paddingVertical: 8, alignItems: 'center' },
  btnGhostText: { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: colors.inkSoft },
});
