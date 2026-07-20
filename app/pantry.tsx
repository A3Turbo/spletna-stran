import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../src/theme';
import { Eyebrow, Rule } from '../src/components';
import { PANTRY } from '../src/data';

const haveItems = PANTRY.filter(p => p.have);
const savings = haveItems.reduce((s, p) => s + p.savedPrice, 0);

export default function PantryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.chapter}>PANTRY</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Eyebrow>Pantry · This week</Eyebrow>
        <Text style={styles.title}>Your{'\n'}<Text style={{ fontStyle: 'italic' }}>pantry.</Text></Text>
        <Text style={styles.subtitle}>Ingredients you already have at home. The meal plan uses them automatically.</Text>

        <Rule />

        <View style={{ marginBottom: 20 }}>
          {PANTRY.map((item, i) => (
            <View key={i} style={[styles.itemRow, i < PANTRY.length - 1 && styles.itemBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemUnit}>{item.unit}</Text>
              </View>
              <View style={[styles.badge, item.have ? styles.badgeHave : styles.badgeMissing]}>
                <Text style={[styles.badgeText, item.have ? styles.badgeHaveText : styles.badgeMissingText]}>
                  {item.have ? '✓  have' : '✕  missing'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Rule />

        <View style={styles.savingsCard}>
          <Eyebrow color={colors.inkSoft}>Savings this week</Eyebrow>
          <Text style={styles.savingsAmount}>€{savings.toFixed(2)}</Text>
          <Text style={styles.savingsNote}>
            Thanks to your pantry, {haveItems.length} item{haveItems.length !== 1 ? 's' : ''} skipped this week: {haveItems.map(p => p.name).join(', ')}.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/cook-now')}>
          <Text style={styles.btnPrimaryText}>🍳  Cook now →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline}>
          <Text style={styles.btnOutlineText}>+ Update pantry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:      { paddingHorizontal: 22, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn:     { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1.5, color: colors.inkSoft },
  chapter:     { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 2, color: colors.inkSoft },
  content:     { paddingHorizontal: 22, paddingBottom: 20 },
  title:       { fontFamily: 'DM Serif Display', fontSize: 32, lineHeight: 34, letterSpacing: -0.5, color: colors.ink, marginBottom: 8, marginTop: 4 },
  subtitle:    { fontFamily: 'Inter', fontSize: 14, lineHeight: 21, color: colors.inkSoft, marginBottom: 20 },
  itemRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  itemBorder:  { borderBottomWidth: 1, borderBottomColor: colors.rule, borderStyle: 'dashed' },
  itemName:    { fontFamily: 'DM Serif Display', fontSize: 17, color: colors.ink, marginBottom: 2 },
  itemUnit:    { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 1, color: colors.inkSoft },
  badge:       { paddingHorizontal: 10, paddingVertical: 4 },
  badgeHave:   { backgroundColor: 'rgba(90,107,58,0.12)' },
  badgeMissing:{ backgroundColor: colors.tomatoSoft },
  badgeText:   { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 1 },
  badgeHaveText:   { color: colors.basil },
  badgeMissingText:{ color: colors.tomato },
  savingsCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.rule, padding: 18 },
  savingsAmount:   { fontFamily: 'DM Serif Display', fontSize: 38, color: colors.tomato, lineHeight: 38, marginBottom: 8 },
  savingsNote:     { fontFamily: 'Inter', fontSize: 13, lineHeight: 20, color: colors.inkSoft },
  footer:         { paddingHorizontal: 22, paddingBottom: 16, paddingTop: 8, gap: 8 },
  btnPrimary:     { backgroundColor: colors.ink, paddingVertical: 16, alignItems: 'center' },
  btnPrimaryText: { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: colors.paper },
  btnOutline:     { borderWidth: 1, borderColor: colors.ink, paddingVertical: 16, alignItems: 'center' },
  btnOutlineText: { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: colors.ink },
});
