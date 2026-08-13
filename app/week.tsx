import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../src/theme';
import { Eyebrow, Rule, FoodImage } from '../src/components';
import { STATS } from '../src/data';
import { getWeekStart, formatWeekRange, getISOWeek, getSeason, getWeekDays } from '../src/utils';
import { useFamilyCount } from '../src/useFamily';
import { useRatings } from '../src/useRatings';
import { useWeekPlan } from '../src/useWeekPlan';

const weekStart = getWeekStart();
const weekDays = getWeekDays(weekStart);
const weekRange = formatWeekRange(weekStart);
const weekNum = getISOWeek();
const season = getSeason();

export default function WeekScreen() {
  const router = useRouter();
  const [day, setDay] = useState(0);
  const [guestDay, setGuestDay] = useState<number | null>(null);
  const [guestCount, setGuestCount] = useState<Record<number, number>>({});
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [modalDay, setModalDay] = useState(0);
  const [modalGuests, setModalGuests] = useState(2);
  const { days: plan } = useWeekPlan();
  const cur = plan[day] ?? plan[0];
  const totalMeals = plan.length * 3;
  const memberCount = useFamilyCount();
  const { budget } = STATS;
  const { ratings } = useRatings();

  const guests = guestCount[day] ?? 0;

  function openGuestModal(i: number) {
    setModalDay(i);
    setModalGuests(guestCount[i] ?? 2);
    setShowGuestModal(true);
  }

  function confirmGuests() {
    setGuestCount(prev => ({ ...prev, [modalDay]: modalGuests }));
    setShowGuestModal(false);
  }

  function clearGuests(i: number) {
    setGuestCount(prev => { const n = { ...prev }; delete n[i]; return n; });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      {/* Masthead */}
      <View style={styles.masthead}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.menuBtn}>≡  Menu</Text>
        </TouchableOpacity>
        <Text style={styles.dateRange}>Nana</Text>
        <TouchableOpacity onPress={() => router.push('/stats')}>
          <Text style={styles.statsBtn}>◔  STATS</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Eyebrow>Week {weekNum} · {season} · {weekRange}</Eyebrow>
          <Text style={styles.title}>Weekly{'\n'}<Text style={{ fontStyle: 'italic' }}>meal plan.</Text></Text>
          <Text style={styles.meta}>
            {totalMeals} MEALS  ·  €{budget.spent.toFixed(2)} / €{budget.target}
            {memberCount > 0 ? `  ·  ${memberCount} MEMBER${memberCount !== 1 ? 'S' : ''}` : ''}
          </Text>
        </View>

        <Rule my={18} />

        {/* Day strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayStrip}>
          {plan.map((_, i) => {
            const g = guestCount[i];
            return (
              <View key={i} style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={() => setDay(i)}
                  style={[styles.dayBtn, i === day && styles.dayBtnActive]}>
                  <Text style={[styles.dayName, i === day && styles.dayNameActive]}>{weekDays[i].day}</Text>
                  <Text style={[styles.dayDate, i === day && styles.dayDateActive]}>
                    {weekDays[i].date.split(' ')[1]}
                  </Text>
                  {g ? <Text style={styles.guestBadge}>+{g}</Text> : null}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => g ? clearGuests(i) : openGuestModal(i)} style={styles.guestBtn}>
                  <Text style={[styles.guestBtnText, g ? { color: colors.tomato } : {}]}>
                    {g ? '✕' : '👥'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        {guests > 0 && (
          <View style={styles.guestBanner}>
            <Text style={styles.guestBannerText}>
              +{guests} guests on {weekDays[day].day} · portions & shopping adjusted
            </Text>
          </View>
        )}

        {/* Meal cards */}
        <View style={styles.meals}>
          {cur.meals.map((m, i) => {
            const rating = ratings[m.name] ?? 0;
            const multiplier = 1 + guests;
            return (
              <TouchableOpacity key={i} style={styles.mealCard} onPress={() => router.push({
                pathname: '/recipe',
                params: {
                  name: m.name, time: m.time, kcal: String(m.kcal), price: String(m.price), type: m.type,
                  tag: m.tag, mainIngredients: JSON.stringify(m.mainIngredients), photoUrl: m.photoUrl ?? '',
                },
              })}>
                <FoodImage dishName={m.name} photo={m.photoUrl} height={140} caption={`${m.type.toUpperCase()} · ${m.name.slice(0, 22)}`} />
                <View style={styles.mealInfo}>
                  <View style={styles.mealTopRow}>
                    <Text style={styles.mealType}>{m.type}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {rating > 0 && (
                        <Text style={styles.mealRating}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</Text>
                      )}
                      <Text style={styles.mealTime}>⏱  {m.time}</Text>
                    </View>
                  </View>
                  <Text style={styles.mealName}>{m.name}</Text>
                  <View style={styles.mealMeta}>
                    <Text style={styles.mealMetaText}>{m.kcal} kcal</Text>
                    <Text style={styles.mealMetaText}>·</Text>
                    <Text style={styles.mealMetaText}>€{(m.price * multiplier).toFixed(2)}{guests > 0 ? ` ×${multiplier}` : ''}</Text>
                    <Text style={styles.mealMetaText}>·</Text>
                    <Text style={[styles.mealMetaText, { color: colors.basil, textTransform: 'uppercase' }]}>{m.tag}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/shopping')}>
            <Text style={styles.btnPrimaryText}>🛒  Shopping</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={() => router.push('/pantry')}>
            <Text style={styles.btnOutlineText}>Pantry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Guest modal */}
      <Modal visible={showGuestModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Eyebrow>Guests on {weekDays[modalDay]?.day}</Eyebrow>
            <Text style={styles.modalTitle}>How many guests?</Text>
            <Text style={styles.modalSub}>Portions and shopping list will be adjusted for that day.</Text>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setModalGuests(g => Math.max(1, g - 1))}>
                <Text style={styles.stepBtnText}>–</Text>
              </TouchableOpacity>
              <View style={styles.stepVal}>
                <Text style={styles.stepValText}>+{modalGuests}</Text>
              </View>
              <TouchableOpacity style={styles.stepBtn} onPress={() => setModalGuests(g => Math.min(20, g + 1))}>
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalBtnOutline} onPress={() => setShowGuestModal(false)}>
                <Text style={styles.modalBtnOutlineText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} onPress={confirmGuests}>
                <Text style={styles.modalBtnPrimaryText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  masthead:         { paddingHorizontal: 22, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuBtn:          { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1.5, color: colors.inkSoft },
  dateRange:        { fontFamily: 'DM Serif Display', fontStyle: 'italic', fontSize: 13, color: colors.inkSoft },
  statsBtn:         { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1.5, color: colors.inkSoft },
  titleSection:     { paddingHorizontal: 22, paddingTop: 8 },
  title:            { fontFamily: 'DM Serif Display', fontSize: 38, lineHeight: 38, letterSpacing: -0.8, color: colors.ink, marginBottom: 8 },
  meta:             { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 1.2, color: colors.inkSoft },
  dayStrip:         { paddingHorizontal: 22, gap: 6, paddingBottom: 16 },
  dayBtn:           { paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: colors.rule, minWidth: 56, alignItems: 'center' },
  dayBtnActive:     { backgroundColor: colors.ink, borderColor: colors.ink },
  dayName:          { fontFamily: 'DM Serif Display', fontSize: 16, color: colors.ink, marginBottom: 2 },
  dayNameActive:    { color: colors.paper },
  dayDate:          { fontFamily: 'JetBrains Mono', fontSize: 10, color: colors.inkSoft, opacity: 0.7 },
  dayDateActive:    { color: colors.paper },
  guestBadge:       { fontFamily: 'JetBrains Mono', fontSize: 8, color: colors.tomato, marginTop: 3 },
  guestBtn:         { marginTop: 4 },
  guestBtnText:     { fontSize: 14, color: colors.inkSoft },
  guestBanner:      { marginHorizontal: 22, marginBottom: 12, backgroundColor: 'rgba(184,66,31,0.08)', padding: 10 },
  guestBannerText:  { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 1, color: colors.tomato, textTransform: 'uppercase' },
  meals:            { paddingHorizontal: 22, paddingBottom: 14 },
  mealCard:         { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.rule, marginBottom: 12, overflow: 'hidden' },
  mealInfo:         { padding: 14 },
  mealTopRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
  mealType:         { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: colors.tomato },
  mealTime:         { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1, color: colors.inkSoft },
  mealRating:       { fontFamily: 'JetBrains Mono', fontSize: 9, color: colors.tomato, letterSpacing: 1 },
  mealName:         { fontFamily: 'DM Serif Display', fontSize: 21, lineHeight: 23, color: colors.ink, marginBottom: 8 },
  mealMeta:         { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: colors.rule, paddingTop: 8 },
  mealMetaText:     { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 0.8, color: colors.inkSoft },
  actions:          { paddingHorizontal: 22, paddingBottom: 32, flexDirection: 'row', gap: 8 },
  btnPrimary:       { flex: 1, backgroundColor: colors.ink, paddingVertical: 14, alignItems: 'center' },
  btnPrimaryText:   { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: colors.paper },
  btnOutline:       { flex: 1, borderWidth: 1, borderColor: colors.ink, paddingVertical: 14, alignItems: 'center' },
  btnOutlineText:   { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: colors.ink },
  modalOverlay:     { flex: 1, backgroundColor: 'rgba(31,22,18,0.5)', justifyContent: 'center', paddingHorizontal: 28 },
  modalBox:         { backgroundColor: colors.paper, padding: 24 },
  modalTitle:       { fontFamily: 'DM Serif Display', fontSize: 26, color: colors.ink, marginBottom: 6, marginTop: 4 },
  modalSub:         { fontFamily: 'Inter', fontSize: 13, color: colors.inkSoft, lineHeight: 19, marginBottom: 22 },
  stepper:          { flexDirection: 'row', borderWidth: 1, borderColor: colors.rule, alignSelf: 'flex-start', marginBottom: 24 },
  stepBtn:          { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  stepBtnText:      { fontFamily: 'DM Serif Display', fontSize: 22, color: colors.ink },
  stepVal:          { width: 64, height: 48, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.rule },
  stepValText:      { fontFamily: 'DM Serif Display', fontSize: 22, color: colors.tomato },
  modalBtns:        { flexDirection: 'row', gap: 10 },
  modalBtnOutline:  { flex: 1, borderWidth: 1, borderColor: colors.rule, paddingVertical: 14, alignItems: 'center' },
  modalBtnOutlineText: { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1.5, color: colors.inkSoft },
  modalBtnPrimary:  { flex: 1, backgroundColor: colors.ink, paddingVertical: 14, alignItems: 'center' },
  modalBtnPrimaryText: { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1.5, color: colors.paper },
});
