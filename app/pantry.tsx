import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../src/theme';
import { Eyebrow, Rule, Toggle } from '../src/components';
import { usePantry, PantryItem } from '../src/usePantry';

function newItem(): PantryItem {
  return { id: '', name: '', unit: '', have: true, savedPrice: 0 };
}

export default function PantryScreen() {
  const router = useRouter();
  const { items, addItem, updateItem, removeItem, toggleHave } = usePantry();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<PantryItem | null>(null);
  const [priceText, setPriceText] = useState('0');

  const haveItems = items.filter(p => p.have);
  const savings = haveItems.reduce((s, p) => s + p.savedPrice, 0);

  function openAdd() {
    setEditing(newItem());
    setPriceText('0');
    setModalVisible(true);
  }

  function openEdit(item: PantryItem) {
    setEditing({ ...item });
    setPriceText(String(item.savedPrice));
    setModalVisible(true);
  }

  async function saveItem() {
    if (!editing) return;
    if (!editing.name.trim()) {
      Alert.alert('Name required', 'Please enter an ingredient name.');
      return;
    }
    const savedPrice = parseFloat(priceText.replace(',', '.')) || 0;
    const payload = { ...editing, savedPrice };
    if (editing.id) {
      await updateItem(payload);
    } else {
      await addItem({ name: payload.name, unit: payload.unit, have: payload.have, savedPrice });
    }
    setModalVisible(false);
  }

  function deleteEditing() {
    if (!editing?.id) return;
    Alert.alert('Delete item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await removeItem(editing.id);
        setModalVisible(false);
      }},
    ]);
  }

  const isExisting = !!editing?.id;

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

        {items.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No items yet.{'\n'}Add what's in your kitchen below.</Text>
          </View>
        )}

        <View style={{ marginBottom: 20 }}>
          {items.map((item, i) => (
            <TouchableOpacity key={item.id} style={[styles.itemRow, i < items.length - 1 && styles.itemBorder]} onPress={() => openEdit(item)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemUnit}>{item.unit || 'no amount set'}</Text>
              </View>
              <View style={[styles.badge, item.have ? styles.badgeHave : styles.badgeMissing]}>
                <Text style={[styles.badgeText, item.have ? styles.badgeHaveText : styles.badgeMissingText]}>
                  {item.have ? '✓  have' : '✕  missing'}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Add ingredient</Text>
        </TouchableOpacity>

        <Rule />

        <View style={styles.savingsCard}>
          <Eyebrow color={colors.inkSoft}>Savings this week</Eyebrow>
          <Text style={styles.savingsAmount}>€{savings.toFixed(2)}</Text>
          <Text style={styles.savingsNote}>
            {haveItems.length > 0
              ? `Thanks to your pantry, ${haveItems.length} item${haveItems.length !== 1 ? 's' : ''} skipped this week: ${haveItems.map(p => p.name).join(', ')}.`
              : 'Mark ingredients as "have" to see savings here.'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/cook-now')}>
          <Text style={styles.btnPrimaryText}>🍳  Cook now →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline} onPress={openAdd}>
          <Text style={styles.btnOutlineText}>+ Update pantry</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{isExisting ? 'Edit item' : 'New item'}</Text>
            <TouchableOpacity onPress={saveItem}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editing?.name ?? ''}
                onChangeText={t => editing && setEditing({ ...editing, name: t })}
                placeholder="e.g. Olive oil"
                placeholderTextColor={colors.rule}
              />

              <Text style={styles.fieldLabel}>Amount</Text>
              <TextInput
                style={styles.input}
                value={editing?.unit ?? ''}
                onChangeText={t => editing && setEditing({ ...editing, unit: t })}
                placeholder="e.g. 1 kg, 5 pcs, have"
                placeholderTextColor={colors.rule}
              />

              <Text style={styles.fieldLabel}>Estimated savings (€)</Text>
              <TextInput
                style={styles.input}
                value={priceText}
                onChangeText={setPriceText}
                placeholder="0.00"
                placeholderTextColor={colors.rule}
                keyboardType="decimal-pad"
              />

              <View style={styles.haveRow}>
                <Text style={styles.fieldLabel}>In stock</Text>
                <Toggle
                  value={editing?.have ?? true}
                  onToggle={() => editing && setEditing({ ...editing, have: !editing.have })}
                />
              </View>

              {isExisting && (
                <>
                  <Rule my={24} />
                  <TouchableOpacity style={styles.deleteBtn} onPress={deleteEditing}>
                    <Text style={styles.deleteBtnText}>Delete item</Text>
                  </TouchableOpacity>
                </>
              )}

              <View style={{ height: 40 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
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
  emptyBox:    { borderWidth: 1, borderColor: colors.rule, borderStyle: 'dashed', padding: 32, alignItems: 'center', marginBottom: 16 },
  emptyText:   { fontFamily: 'DM Serif Display', fontStyle: 'italic', fontSize: 16, color: colors.inkSoft, textAlign: 'center', lineHeight: 24 },
  itemRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 10 },
  itemBorder:  { borderBottomWidth: 1, borderBottomColor: colors.rule, borderStyle: 'dashed' },
  itemName:    { fontFamily: 'DM Serif Display', fontSize: 17, color: colors.ink, marginBottom: 2 },
  itemUnit:    { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 1, color: colors.inkSoft },
  badge:       { paddingHorizontal: 10, paddingVertical: 4 },
  badgeHave:   { backgroundColor: 'rgba(90,107,58,0.12)' },
  badgeMissing:{ backgroundColor: colors.tomatoSoft },
  badgeText:   { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 1 },
  badgeHaveText:   { color: colors.basil },
  badgeMissingText:{ color: colors.tomato },
  chevron:     { fontFamily: 'JetBrains Mono', fontSize: 14, color: colors.inkSoft },
  addBtn:      { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.rule, padding: 14, alignItems: 'center', marginTop: 4 },
  addBtnText:  { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: colors.inkSoft },
  savingsCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.rule, padding: 18 },
  savingsAmount:   { fontFamily: 'DM Serif Display', fontSize: 38, color: colors.tomato, lineHeight: 38, marginBottom: 8 },
  savingsNote:     { fontFamily: 'Inter', fontSize: 13, lineHeight: 20, color: colors.inkSoft },
  footer:         { paddingHorizontal: 22, paddingBottom: 16, paddingTop: 8, gap: 8 },
  btnPrimary:     { backgroundColor: colors.ink, paddingVertical: 16, alignItems: 'center' },
  btnPrimaryText: { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: colors.paper },
  btnOutline:     { borderWidth: 1, borderColor: colors.ink, paddingVertical: 16, alignItems: 'center' },
  btnOutlineText: { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: colors.ink },
  modalHeader:  { paddingHorizontal: 22, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.rule },
  modalCancel:  { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1, color: colors.inkSoft },
  modalTitle:   { fontFamily: 'DM Serif Display', fontSize: 18, color: colors.ink },
  modalSave:    { fontFamily: 'Inter Medium', fontSize: 14, color: colors.tomato },
  modalContent: { paddingHorizontal: 22, paddingTop: 16 },
  fieldLabel:   { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: colors.inkSoft, marginBottom: 8 },
  input:        { borderWidth: 1, borderColor: colors.rule, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'DM Serif Display', fontSize: 17, color: colors.ink, marginBottom: 16, backgroundColor: colors.card },
  haveRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  deleteBtn:    { borderWidth: 1, borderColor: colors.tomato, paddingVertical: 14, alignItems: 'center' },
  deleteBtnText:{ fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: colors.tomato },
});
