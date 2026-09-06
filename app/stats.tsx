import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/theme';
import { useTheme } from '../src/ThemeContext';
import { Eyebrow, Rule } from '../src/components';
import { STATS, SAMPLE_WEEK, PANTRY } from '../src/data';
import { useFamilyCount } from '../src/useFamily';

const pantryHave = PANTRY.filter(p => p.have);
const pantrySavings = pantryHave.reduce((s, p) => s + p.savedPrice, 0);

export default function StatsScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const router = useRouter();
  const { budget, nutrition, topRated } = STATS;
  const memberCount = useFamilyCount();
  const budgetPct = (budget.spent / budget.target) * 100;
  const kcalPct = (nutrition.kcalAvg / nutrition.kcalTarget) * 100;
  const proteinPct = (nutrition.proteinAvg / nutrition.proteinTarget) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.chapter}>STATS</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Eyebrow>Overview · {budget.week}</Eyebrow>
        <Text style={styles.title}>Your week,{'\n'}<Text style={{ fontStyle: 'italic' }}>in numbers.</Text></Text>

        <Rule />

        {/* Budget */}
        <Eyebrow color={colors.inkSoft}>This week's budget</Eyebrow>
        <View style={styles.budgetRow}>
          <Text style={styles.budgetSpent}>€{budget.spent.toFixed(2)}</Text>
          <Text style={styles.budgetOf}> / €{budget.target}</Text>
        </View>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${Math.min(budgetPct, 100)}%` as any }]} />
        </View>
        <View style={styles.budgetLabels}>
          <Text style={styles.barLabel}>Spent</Text>
          <Text style={styles.barLabel}>{Math.round(budgetPct)}% of budget</Text>
        </View>

        <Rule my={20} />

        {/* Nutrition */}
        <Eyebrow color={colors.inkSoft}>Nutrition · avg/day</Eyebrow>
        <View style={styles.nutritionRow}>
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionVal}>{nutrition.kcalAvg}</Text>
            <Text style={styles.nutritionLabel}>kcal / day</Text>
            <View style={styles.miniBarBg}>
              <View style={[styles.miniBarFill, { width: `${Math.min(kcalPct, 100)}%` as any }]} />
            </View>
            <Text style={styles.nutritionSub}>goal {nutrition.kcalTarget} kcal</Text>
          </View>
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionVal}>{nutrition.proteinAvg}<Text style={{ fontSize: 16 }}>g</Text></Text>
            <Text style={styles.nutritionLabel}>protein / day</Text>
            <View style={styles.miniBarBg}>
              <View style={[styles.miniBarFill, { width: `${Math.min(proteinPct, 100)}%` as any }]} />
            </View>
            <Text style={styles.nutritionSub}>goal {nutrition.proteinTarget}g</Text>
          </View>
        </View>

        <Rule my={20} />

        {/* Top rated */}
        <Eyebrow color={colors.inkSoft}>Most popular</Eyebrow>
        <View style={styles.topList}>
          {topRated.map((dish, i) => (
            <View key={i} style={[styles.topRow, i < topRated.length - 1 && styles.topBorder]}>
              <Text style={styles.topRank}>{i + 1}.</Text>
              <Text style={styles.topName}>{dish.name}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingVal}>{dish.rating}</Text>
                <Text style={styles.ratingStar}> ★</Text>
              </View>
            </View>
          ))}
        </View>

        <Rule my={20} />

        {/* Summary stat cells */}
        <View style={styles.summaryGrid}>
          {[
            { v: String(SAMPLE_WEEK.length * 3), l: 'Meals' },
            { v: String(SAMPLE_WEEK.length),     l: 'Days' },
            { v: memberCount > 0 ? String(memberCount) : '—', l: 'Members' },
            { v: `€${pantrySavings.toFixed(2)}`, l: 'Savings' },
          ].map((s, i) => (
            <View key={i} style={[styles.summaryCell, i < 3 && styles.summaryCellBorder]}>
              <Text style={styles.summaryVal}>{s.v}</Text>
              <Text style={styles.summaryLabel}>{s.l}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  header:        { paddingHorizontal: 22, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn:       { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1.5, color: colors.inkSoft },
  chapter:       { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 2, color: colors.inkSoft },
  content:       { paddingHorizontal: 22, paddingBottom: 40 },
  title:         { fontFamily: 'DM Serif Display', fontSize: 32, lineHeight: 34, letterSpacing: -0.5, color: colors.ink, marginBottom: 8, marginTop: 4 },
  budgetRow:     { flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 },
  budgetSpent:   { fontFamily: 'DM Serif Display', fontSize: 38, color: colors.tomato },
  budgetOf:      { fontFamily: 'DM Serif Display', fontSize: 22, color: colors.inkSoft },
  barBg:         { height: 4, backgroundColor: colors.rule, overflow: 'hidden', marginBottom: 6 },
  barFill:       { height: '100%', backgroundColor: colors.tomato },
  budgetLabels:  { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel:      { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1, color: colors.inkSoft, textTransform: 'uppercase' },
  nutritionRow:  { flexDirection: 'row', gap: 10 },
  nutritionCard: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.rule, padding: 14 },
  nutritionVal:  { fontFamily: 'DM Serif Display', fontSize: 30, color: colors.ink, lineHeight: 30, marginBottom: 4 },
  nutritionLabel:{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1, color: colors.inkSoft, textTransform: 'uppercase', marginBottom: 10 },
  miniBarBg:     { height: 2, backgroundColor: colors.rule, overflow: 'hidden', marginBottom: 6 },
  miniBarFill:   { height: '100%', backgroundColor: colors.tomato },
  nutritionSub:  { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 0.5, color: colors.inkSoft },
  topList:       { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.rule },
  topRow:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, gap: 12 },
  topBorder:     { borderBottomWidth: 1, borderBottomColor: colors.rule, borderStyle: 'dashed' },
  topRank:       { fontFamily: 'DM Serif Display', fontStyle: 'italic', fontSize: 22, color: colors.tomato, width: 24, lineHeight: 22 },
  topName:       { fontFamily: 'DM Serif Display', fontSize: 16, color: colors.ink, flex: 1 },
  ratingRow:     { flexDirection: 'row', alignItems: 'baseline' },
  ratingVal:     { fontFamily: 'JetBrains Mono', fontSize: 13, color: colors.ink, letterSpacing: 0.3 },
  ratingStar:    { fontFamily: 'JetBrains Mono', fontSize: 11, color: colors.tomato },
  summaryGrid:   { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.rule, paddingVertical: 14 },
  summaryCell:   { flex: 1, alignItems: 'center' },
  summaryCellBorder: { borderRightWidth: 1, borderRightColor: colors.rule },
  summaryVal:    { fontFamily: 'DM Serif Display', fontSize: 20, color: colors.ink },
  summaryLabel:  { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1, color: colors.inkSoft, marginTop: 4, textTransform: 'uppercase' },
  });
}
