import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SectionList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../src/theme';
import { Eyebrow, Rule, Toggle } from '../src/components';
import { useRegion, REGIONS, STORES } from '../src/useRegion';

const PRICE_SOURCES = [
  { label: 'Store catalogues', pct: 68 },
  { label: 'Price database',   pct: 24 },
  { label: 'Manual entry',     pct: 8  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { region, setRegion } = useRegion();

  const [selectedStores, setSelectedStores] = useState<Record<string, boolean>>({
    Mercator: true, Spar: true, Lidl: true, Hofer: true,
    Billa: true, REWE: true, Edeka: true, Aldi: true,
    Konzum: true, Kaufland: true,
    Esselunga: true, Conad: true, Coop: true,
    Carrefour: true, Leclerc: true, Auchan: true,
    Tesco: true, "Sainsbury's": true, ASDA: true,
    'Whole Foods': true, "Trader Joe's": true, Walmart: true, Kroger: true,
  });
  const [localRecipes, setLocalRecipes] = useState(true);
  const [scanReceipts, setScanReceipts] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);

  function toggleStore(store: string) {
    setSelectedStores(prev => ({ ...prev, [store]: !prev[store] }));
  }

  const regionInfo = REGIONS.find(r => r.id === region);
  const currency = regionInfo?.currency ?? 'EUR';
  const symbol = regionInfo?.symbol ?? '€';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.chapter}>SETTINGS</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Eyebrow>Price sources & localization</Eyebrow>
        <Text style={styles.title}>Prices from{'\n'}<Text style={{ fontStyle: 'italic' }}>your region.</Text></Text>
        <Text style={styles.subtitle}>
          Prices automatically adjust to your market. Each region pulls data from local stores.
          Your region was detected from your device settings — change it below.
        </Text>

        <Rule />

        {/* Region picker */}
        <Eyebrow color={colors.inkSoft}>Your region</Eyebrow>

        {/* Selected region display */}
        <View style={styles.selectedRegion}>
          <Text style={styles.selectedFlag}>{REGIONS.find(r => r.id === region)?.flag}</Text>
          <View>
            <Text style={styles.selectedLabel}>{REGIONS.find(r => r.id === region)?.label}</Text>
            <Text style={styles.selectedSub}>Tap below to change</Text>
          </View>
        </View>

        {/* Scrollable region grid */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionScroll}>
          {REGIONS.map(r => (
            <TouchableOpacity
              key={r.id}
              style={[styles.regionBtn, r.id === region && styles.regionBtnActive]}
              onPress={() => setRegion(r.id)}
            >
              <Text style={styles.regionFlag}>{r.flag}</Text>
              <Text style={[styles.regionId, r.id === region && styles.regionIdActive]}>{r.id}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.currencyRow}>
          <Text style={styles.currencyLabel}>Currency for this market</Text>
          <Text style={styles.currencyVal}>{symbol} {currency}</Text>
        </View>

        <Rule />

        {/* Store selector */}
        <Eyebrow color={colors.inkSoft}>Stores · {regionInfo?.label}</Eyebrow>
        <View style={styles.storeGrid}>
          {STORES[region].map(store => {
            const on = selectedStores[store] ?? true;
            return (
              <TouchableOpacity key={store} style={[styles.storeBtn, on && styles.storeBtnActive]} onPress={() => toggleStore(store)}>
                <Text style={[styles.storeName, on && styles.storeNameActive]}>{store}</Text>
                {on && <Text style={styles.storeCheck}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <Rule />

        {/* Price source breakdown */}
        <Eyebrow color={colors.inkSoft}>Price data sources</Eyebrow>
        <View style={styles.sourceList}>
          {PRICE_SOURCES.map((s, i) => (
            <View key={i} style={styles.sourceRow}>
              <View style={styles.sourceLabelRow}>
                <Text style={styles.sourceLabel}>{s.label}</Text>
                <Text style={styles.sourcePct}>{s.pct}%</Text>
              </View>
              <View style={styles.sourceBarBg}>
                <View style={[styles.sourceBarFill, { width: `${s.pct}%` as any }]} />
              </View>
            </View>
          ))}
        </View>

        <Rule />

        {/* Toggle settings */}
        <Eyebrow color={colors.inkSoft}>App settings</Eyebrow>
        <View style={styles.toggleList}>
          {[
            {
              label: 'Localized recipes',
              sub: 'Ingredients and measures in local units',
              val: localRecipes,
              set: () => setLocalRecipes(v => !v),
            },
            {
              label: 'Scan receipts',
              sub: 'Automatically read prices from shopping receipts',
              val: scanReceipts,
              set: () => setScanReceipts(v => !v),
            },
            {
              label: 'Auto-update prices',
              sub: 'Prices refresh every week from local stores',
              val: autoUpdate,
              set: () => setAutoUpdate(v => !v),
            },
          ].map((t, i, arr) => (
            <View key={i}>
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleLabel}>{t.label}</Text>
                  <Text style={styles.toggleSub}>{t.sub}</Text>
                </View>
                <TouchableOpacity onPress={t.set}>
                  <Toggle value={t.val} onToggle={t.set} />
                </TouchableOpacity>
              </View>
              {i < arr.length - 1 && <Rule my={0} color={colors.rule} />}
            </View>
          ))}
        </View>

        <Rule />

        <Text style={styles.versionNote}>Jedilnik · version 1.0.0 · prices updated May 5, 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:            { paddingHorizontal: 22, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn:           { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1.5, color: colors.inkSoft },
  chapter:           { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 2, color: colors.inkSoft },
  content:           { paddingHorizontal: 22, paddingBottom: 40 },
  title:             { fontFamily: 'DM Serif Display', fontSize: 32, lineHeight: 34, letterSpacing: -0.5, color: colors.ink, marginBottom: 8, marginTop: 4 },
  subtitle:          { fontFamily: 'Inter', fontSize: 14, lineHeight: 21, color: colors.inkSoft, marginBottom: 20 },
  selectedRegion:    { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.rule, padding: 14, marginBottom: 10 },
  selectedFlag:      { fontSize: 32 },
  selectedLabel:     { fontFamily: 'DM Serif Display', fontSize: 20, color: colors.ink },
  selectedSub:       { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1, color: colors.inkSoft, marginTop: 2 },
  regionScroll:      { gap: 6, paddingBottom: 12 },
  regionBtn:         { borderWidth: 1, borderColor: colors.rule, paddingHorizontal: 10, paddingVertical: 8, alignItems: 'center', gap: 3, minWidth: 52 },
  regionBtnActive:   { backgroundColor: colors.ink, borderColor: colors.ink },
  regionFlag:        { fontSize: 18 },
  regionId:          { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1, color: colors.inkSoft },
  regionIdActive:    { color: colors.paper },
  regionLabel:       { fontFamily: 'JetBrains Mono', fontSize: 7, letterSpacing: 0.5, color: colors.inkSoft, textTransform: 'uppercase' },
  regionLabelActive: { color: 'rgba(251,246,234,0.7)' },
  currencyRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.rule, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 4 },
  currencyLabel:     { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 1, color: colors.inkSoft, textTransform: 'uppercase' },
  currencyVal:       { fontFamily: 'DM Serif Display', fontSize: 20, color: colors.tomato },
  storeGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  storeBtn:          { borderWidth: 1, borderColor: colors.rule, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  storeBtnActive:    { borderColor: colors.basil, backgroundColor: 'rgba(90,107,58,0.08)' },
  storeName:         { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 0.5, color: colors.inkSoft },
  storeNameActive:   { color: colors.basil },
  storeCheck:        { fontFamily: 'JetBrains Mono', fontSize: 10, color: colors.basil },
  sourceList:        { gap: 12, marginBottom: 4 },
  sourceRow:         { gap: 6 },
  sourceLabelRow:    { flexDirection: 'row', justifyContent: 'space-between' },
  sourceLabel:       { fontFamily: 'Inter', fontSize: 13, color: colors.ink },
  sourcePct:         { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 0.5, color: colors.tomato },
  sourceBarBg:       { height: 3, backgroundColor: colors.rule, overflow: 'hidden' },
  sourceBarFill:     { height: '100%', backgroundColor: colors.tomato },
  toggleList:        { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.rule, marginBottom: 4 },
  toggleRow:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14, gap: 12 },
  toggleLabel:       { fontFamily: 'DM Serif Display', fontSize: 17, color: colors.ink, marginBottom: 2 },
  toggleSub:         { fontFamily: 'Inter', fontSize: 12, lineHeight: 17, color: colors.inkSoft },
  versionNote:       { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1, color: colors.inkSoft, textAlign: 'center', opacity: 0.6, marginTop: 4 },
});
