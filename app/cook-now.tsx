import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/theme';
import { useTheme } from '../src/ThemeContext';
import { Eyebrow, Rule, FoodImage } from '../src/components';
import { usePantry } from '../src/usePantry';
import { useWeekPlan } from '../src/useWeekPlan';

function matchScore(ingredients: string[], pantryNames: string[]): number {
  return ingredients.filter(ing => pantryNames.some(p => p.includes(ing.toLowerCase()) || ing.toLowerCase().includes(p))).length;
}

export default function CookNowScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const router = useRouter();
  const { items } = usePantry();
  const { days } = useWeekPlan();

  const haveItems = items.filter(p => p.have);
  const pantryNames = haveItems.map(p => p.name.toLowerCase());
  const allMeals = days.flatMap(day => day.meals);

  const suggestions = allMeals
    .map(m => ({ ...m, score: matchScore(m.mainIngredients, pantryNames), total: m.mainIngredients.length }))
    .filter(m => m.score >= 2)
    .sort((a, b) => b.score / b.total - a.score / a.total)
    .slice(0, 6);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.chapter}>COOK NOW</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Eyebrow>Pantry · {haveItems.length} items available</Eyebrow>
        <Text style={styles.title}>What can you{'\n'}<Text style={{ fontStyle: 'italic' }}>cook right now?</Text></Text>
        <Text style={styles.subtitle}>
          Based on what's in your pantry — no shopping needed.
        </Text>

        {/* Pantry chips */}
        <View style={styles.chips}>
          {haveItems.map((item, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipText}>{item.name}</Text>
            </View>
          ))}
        </View>

        <Rule my={18} />

        {suggestions.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Not enough ingredients.</Text>
            <Text style={styles.emptySub}>Update your pantry with more items and we'll find matching meals.</Text>
          </View>
        ) : (
          <>
            <Eyebrow color={colors.inkSoft}>{suggestions.length} meals you can make</Eyebrow>
            <View style={{ marginTop: 12 }}>
              {suggestions.map((m, i) => {
                const matched = m.mainIngredients.filter(ing =>
                  pantryNames.some(p => p.includes(ing.toLowerCase()) || ing.toLowerCase().includes(p))
                );
                const missing = m.mainIngredients.filter(ing =>
                  !pantryNames.some(p => p.includes(ing.toLowerCase()) || ing.toLowerCase().includes(p))
                );
                return (
                  <TouchableOpacity key={i} style={styles.card} onPress={() => router.push({
                    pathname: '/recipe',
                    params: {
                      name: m.name, time: m.time, kcal: String(m.kcal), price: String(m.price), type: m.type,
                      tag: m.tag, mainIngredients: JSON.stringify(m.mainIngredients), photoUrl: m.photoUrl ?? '',
                    },
                  })}>
                    <FoodImage dishName={m.name} photo={m.photoUrl} height={120} caption={`${m.type.toUpperCase()} · ${m.time}`} />
                    <View style={styles.cardBody}>
                      <Text style={styles.mealType}>{m.type}</Text>
                      <Text style={styles.mealName}>{m.name}</Text>
                      <View style={styles.matchRow}>
                        <Text style={styles.matchHave}>✓ {matched.join(', ')}</Text>
                        {missing.length > 0 && (
                          <Text style={styles.matchMissing}>+ {missing.join(', ')}</Text>
                        )}
                      </View>
                      <View style={styles.matchBar}>
                        <View style={[styles.matchFill, { width: `${(m.score / m.total) * 100}%` as any }]} />
                      </View>
                      <Text style={styles.matchLabel}>{m.score}/{m.total} ingredients in pantry</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  header:       { paddingHorizontal: 22, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn:      { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1.5, color: colors.inkSoft },
  chapter:      { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 2, color: colors.inkSoft },
  content:      { paddingHorizontal: 22, paddingBottom: 32 },
  title:        { fontFamily: 'DM Serif Display', fontSize: 32, lineHeight: 34, letterSpacing: -0.5, color: colors.ink, marginBottom: 8, marginTop: 4 },
  subtitle:     { fontFamily: 'Inter', fontSize: 14, lineHeight: 21, color: colors.inkSoft, marginBottom: 14 },
  chips:        { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip:         { backgroundColor: 'rgba(90,107,58,0.12)', paddingHorizontal: 10, paddingVertical: 5 },
  chipText:     { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 0.8, color: colors.basil },
  empty:        { paddingVertical: 24 },
  emptyTitle:   { fontFamily: 'DM Serif Display', fontSize: 22, color: colors.ink, marginBottom: 8 },
  emptySub:     { fontFamily: 'Inter', fontSize: 14, lineHeight: 21, color: colors.inkSoft },
  card:         { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.rule, marginBottom: 14, overflow: 'hidden' },
  cardBody:     { padding: 14 },
  mealType:     { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: colors.tomato, marginBottom: 3 },
  mealName:     { fontFamily: 'DM Serif Display', fontSize: 20, lineHeight: 22, color: colors.ink, marginBottom: 10 },
  matchRow:     { marginBottom: 8, gap: 3 },
  matchHave:    { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 0.8, color: colors.basil },
  matchMissing: { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 0.8, color: colors.inkSoft },
  matchBar:     { height: 2, backgroundColor: colors.rule, overflow: 'hidden', marginBottom: 4 },
  matchFill:    { height: '100%', backgroundColor: colors.basil },
  matchLabel:   { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 0.8, color: colors.inkSoft },
  });
}
