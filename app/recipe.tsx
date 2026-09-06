import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../src/theme';
import { Eyebrow, Rule, FoodImage } from '../src/components';
import { RECIPE_DETAIL } from '../src/data';
import { useRatings } from '../src/useRatings';
import { useFavorites } from '../src/useFavorites';
import { useWeekPlan } from '../src/useWeekPlan';
import { Meal } from '../src/generatePlan';

function scaleAmount(amount: string, factor: number): string {
  if (factor === 1) return amount;
  const fracMatch = amount.match(/^(\d+)\/(\d+)\s*(.*)$/);
  if (fracMatch) {
    const value = (parseInt(fracMatch[1], 10) / parseInt(fracMatch[2], 10)) * factor;
    const scaled = Math.round(value * 100) / 100;
    return fracMatch[3] ? `${scaled} ${fracMatch[3]}` : `${scaled}`;
  }
  const match = amount.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  if (!match) return amount;
  const scaled = Math.round(parseFloat(match[1]) * factor * 10) / 10;
  return match[2] ? `${scaled} ${match[2]}` : `${scaled}`;
}

export default function RecipeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string; time?: string; kcal?: string; price?: string; type?: string; tag?: string; mainIngredients?: string; photoUrl?: string }>();
  const { days } = useWeekPlan();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const mealName = params.name ?? RECIPE_DETAIL.name;
  const found = days.flatMap(d => d.meals).find(m => m.name === mealName)
    ?? favorites.find(m => m.name === mealName);

  const meal: Meal = found ?? {
    type: (params.type as Meal['type']) ?? 'dinner',
    name: mealName,
    time: params.time ?? RECIPE_DETAIL.time,
    kcal: params.kcal ? parseInt(params.kcal) : RECIPE_DETAIL.kcal,
    price: params.price ? parseFloat(params.price) : RECIPE_DETAIL.price,
    tag: params.tag ?? '',
    mainIngredients: params.mainIngredients ? JSON.parse(params.mainIngredients) : [],
    photoUrl: params.photoUrl || undefined,
    intro: RECIPE_DETAIL.intro,
    servings: RECIPE_DETAIL.servings,
    protein: RECIPE_DETAIL.protein,
    ingredients: RECIPE_DETAIL.ingredients.map(i => ({ name: i.name, amount: `${i.amount} ${i.unit}`.trim() })),
    steps: RECIPE_DETAIL.steps,
  };

  const [portion, setPortion] = useState(meal.servings);
  const { ratings, rate } = useRatings();
  const currentRating = ratings[mealName] ?? 0;
  const favorite = isFavorite(mealName);
  const scaleFactor = portion / meal.servings;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.paper }} showsVerticalScrollIndicator={false}>
      {/* Hero photo */}
      <View style={{ position: 'relative' }}>
        <FoodImage dishName={mealName} photo={meal.photoUrl} height={280} caption={`${meal.type.toUpperCase()} · ${mealName.slice(0, 28)}`} />
        <TouchableOpacity style={styles.backCircle} onPress={() => router.back()}>
          <Text style={styles.backCircleText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.heartCircle} onPress={() => toggleFavorite(meal)}>
          <Text style={styles.heartCircleText}>{favorite ? '♥' : '♡'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Eyebrow>Recipe · {meal.type}</Eyebrow>
        <Text style={styles.title}>{mealName}</Text>
        <Text style={styles.intro}>{meal.intro}</Text>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            { v: meal.time,               l: 'Time' },
            { v: `${meal.kcal}`,          l: 'kcal' },
            { v: `${meal.protein}g`,      l: 'Protein' },
            { v: `€${meal.price.toFixed(2)}`, l: '/person' },
          ].map((s, i) => (
            <View key={i} style={[styles.statCell, i < 3 && styles.statBorder]}>
              <Text style={styles.statVal}>{s.v}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Portion stepper */}
        <View style={styles.portionRow}>
          <View>
            <Eyebrow color={colors.inkSoft}>Servings</Eyebrow>
            <Text style={styles.portionText}>{portion} people</Text>
          </View>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepBtn} onPress={() => setPortion(Math.max(1, portion - 1))}>
              <Text style={styles.stepBtnText}>–</Text>
            </TouchableOpacity>
            <View style={styles.stepVal}>
              <Text style={styles.stepValText}>{portion}</Text>
            </View>
            <TouchableOpacity style={styles.stepBtn} onPress={() => setPortion(portion + 1)}>
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Rule />
        <Eyebrow>Ingredients</Eyebrow>
        <View style={{ marginBottom: 16 }}>
          {meal.ingredients.map((ing, i) => (
            <View key={i} style={[styles.ingRow, i < meal.ingredients.length - 1 && styles.ingBorder]}>
              <Text style={styles.ingName}>{ing.name}</Text>
              <Text style={styles.ingAmt}>{scaleAmount(ing.amount, scaleFactor)}</Text>
            </View>
          ))}
        </View>

        <Rule />
        <Eyebrow>Preparation</Eyebrow>
        <View style={{ marginBottom: 20 }}>
          {meal.steps.map((s, i) => (
            <View key={i} style={styles.stepRow}>
              <Text style={styles.stepNum}>{i + 1}.</Text>
              <Text style={styles.stepText}>{s}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.cookBtn}>
          <Text style={styles.cookBtnText}>Start cooking  ▸</Text>
        </TouchableOpacity>

        <Rule my={20} />

        {/* Rating */}
        <Eyebrow>How was it?</Eyebrow>
        <Text style={styles.ratingSubtitle}>Rate this meal — the plan improves with every rating.</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => rate(mealName, star)} style={styles.starBtn}>
              <Text style={[styles.starIcon, star <= currentRating && styles.starActive]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
        {currentRating > 0 && (
          <Text style={styles.ratingConfirm}>
            {currentRating >= 4 ? '✓  Saved — more meals like this!' : currentRating === 3 ? '✓  Noted — we\'ll keep it occasional.' : '✓  Saved — we\'ll skip this next time.'}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backCircle:     { position: 'absolute', top: 52, left: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(31,22,18,.7)', alignItems: 'center', justifyContent: 'center' },
  backCircleText: { color: '#fff', fontFamily: 'JetBrains Mono', fontSize: 14 },
  heartCircle:    { position: 'absolute', top: 52, right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(31,22,18,.7)', alignItems: 'center', justifyContent: 'center' },
  heartCircleText:{ color: '#fff', fontSize: 14 },
  content:        { padding: 22 },
  title:          { fontFamily: 'DM Serif Display', fontSize: 32, lineHeight: 34, letterSpacing: -0.5, color: colors.ink, marginBottom: 8 },
  intro:          { fontFamily: 'DM Serif Display', fontStyle: 'italic', fontSize: 15, lineHeight: 23, color: colors.inkSoft, marginBottom: 16 },
  statsGrid:      { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.rule, paddingVertical: 12, marginBottom: 0 },
  statCell:       { flex: 1, alignItems: 'center' },
  statBorder:     { borderRightWidth: 1, borderRightColor: colors.rule },
  statVal:        { fontFamily: 'DM Serif Display', fontSize: 19, color: colors.ink },
  statLabel:      { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1, color: colors.inkSoft, marginTop: 4, textTransform: 'uppercase' },
  portionRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  portionText:    { fontFamily: 'DM Serif Display', fontSize: 22, color: colors.ink },
  stepper:        { flexDirection: 'row', borderWidth: 1, borderColor: colors.rule },
  stepBtn:        { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  stepBtnText:    { fontFamily: 'DM Serif Display', fontSize: 18, color: colors.ink },
  stepVal:        { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.rule },
  stepValText:    { fontFamily: 'DM Serif Display', fontSize: 18, color: colors.ink },
  ingRow:         { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9 },
  ingBorder:      { borderBottomWidth: 1, borderBottomColor: colors.rule, borderStyle: 'dashed' },
  ingName:        { fontFamily: 'DM Serif Display', fontSize: 15, color: colors.ink },
  ingAmt:         { fontFamily: 'JetBrains Mono', fontSize: 11, color: colors.tomato, letterSpacing: 0.5 },
  stepRow:        { flexDirection: 'row', gap: 14, marginBottom: 16 },
  stepNum:        { fontFamily: 'DM Serif Display', fontStyle: 'italic', fontSize: 28, lineHeight: 28, color: colors.tomato, width: 32 },
  stepText:       { fontFamily: 'DM Serif Display', fontSize: 15, lineHeight: 23, flex: 1, paddingTop: 4, color: colors.ink },
  cookBtn:          { backgroundColor: colors.tomato, paddingVertical: 16, alignItems: 'center', marginBottom: 20 },
  cookBtnText:      { fontFamily: 'Inter Medium', fontSize: 14, color: '#fff', letterSpacing: 0.3 },
  ratingSubtitle:   { fontFamily: 'Inter', fontSize: 13, color: colors.inkSoft, marginBottom: 14, lineHeight: 19 },
  starsRow:         { flexDirection: 'row', gap: 6, marginBottom: 12 },
  starBtn:          { padding: 4 },
  starIcon:         { fontSize: 32, color: colors.rule },
  starActive:       { color: colors.tomato },
  ratingConfirm:    { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 1.2, color: colors.basil, marginBottom: 24 },
});
