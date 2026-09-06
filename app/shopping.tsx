import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/theme';
import { useTheme } from '../src/ThemeContext';
import { Eyebrow, Rule } from '../src/components';
import { useWeekPlan } from '../src/useWeekPlan';

type CheckedMap = Record<string, boolean>;

export default function ShoppingScreen() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const router = useRouter();
  const { shoppingList } = useWeekPlan();
  const [checked, setChecked] = useState<CheckedMap>({});

  function toggle(cat: string, name: string) {
    const key = `${cat}:${name}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const total = shoppingList.reduce((sum, cat) =>
    sum + cat.items.reduce((s, item) =>
      checked[`${cat.cat}:${item.name}`] ? s : s + item.price, 0), 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Seznam.</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>€{total.toFixed(2)}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {shoppingList.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No shopping list yet.{'\n'}Generate a meal plan first.</Text>
          </View>
        )}
        {shoppingList.map((cat, ci) => {
          const catTotal = cat.items.reduce((s, item) =>
            checked[`${cat.cat}:${item.name}`] ? s : s + item.price, 0);
          return (
            <View key={ci} style={{ marginBottom: 8 }}>
              <View style={styles.catHeader}>
                <Eyebrow color={colors.inkSoft}>{cat.cat}</Eyebrow>
                <Text style={styles.catTotal}>€{catTotal.toFixed(2)}</Text>
              </View>
              <View style={styles.catCard}>
                {cat.items.map((item, ii) => {
                  const key = `${cat.cat}:${item.name}`;
                  const done = checked[key];
                  return (
                    <TouchableOpacity
                      key={ii}
                      style={[styles.itemRow, ii < cat.items.length - 1 && styles.itemBorder]}
                      onPress={() => toggle(cat.cat, item.name)}
                    >
                      <View style={[styles.checkbox, done && styles.checkboxDone]}>
                        {done && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={[styles.itemName, done && styles.itemNameDone]}>{item.name}</Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.itemAmt, done && styles.dimmed]}>{item.amount}</Text>
                        <Text style={[styles.itemPrice, done && styles.dimmed]}>€{item.price.toFixed(2)}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.footerLabel}>Total to buy</Text>
            <Text style={styles.footerTotal}>€{total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.orderBtn}>
            <Text style={styles.orderBtnText}>🛒  Order delivery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
  header:       { paddingHorizontal: 22, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn:      { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1.5, color: colors.inkSoft },
  title:        { fontFamily: 'DM Serif Display', fontSize: 26, color: colors.ink },
  totalBadge:   { backgroundColor: colors.tomato, paddingHorizontal: 10, paddingVertical: 4 },
  totalBadgeText: { fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: 0.5, color: '#fff' },
  content:      { paddingHorizontal: 22, paddingTop: 4 },
  emptyBox:     { borderWidth: 1, borderColor: colors.rule, borderStyle: 'dashed', padding: 32, alignItems: 'center', marginTop: 20 },
  emptyText:    { fontFamily: 'DM Serif Display', fontStyle: 'italic', fontSize: 16, color: colors.inkSoft, textAlign: 'center', lineHeight: 24 },
  catHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  catTotal:     { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 0.5, color: colors.inkSoft },
  catCard:      { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.rule, marginBottom: 8 },
  itemRow:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
  itemBorder:   { borderBottomWidth: 1, borderBottomColor: colors.rule },
  checkbox:     { width: 20, height: 20, borderWidth: 1.5, borderColor: colors.rule, alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: colors.basil, borderColor: colors.basil },
  checkmark:    { color: '#fff', fontSize: 11 },
  itemName:     { fontFamily: 'DM Serif Display', fontSize: 16, color: colors.ink, flex: 1 },
  itemNameDone: { color: colors.inkSoft, textDecorationLine: 'line-through' },
  itemAmt:      { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 0.8, color: colors.inkSoft },
  itemPrice:    { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 0.5, color: colors.tomato, marginTop: 1 },
  dimmed:       { opacity: 0.4 },
  footer:       { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.rule, paddingHorizontal: 22, paddingVertical: 14, paddingBottom: 28 },
  footerRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerLabel:  { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: colors.inkSoft, marginBottom: 2 },
  footerTotal:  { fontFamily: 'DM Serif Display', fontSize: 24, color: colors.ink },
  orderBtn:     { backgroundColor: colors.ink, paddingHorizontal: 20, paddingVertical: 14 },
  orderBtnText: { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: colors.paper },
  });
}
