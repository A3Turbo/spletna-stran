import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../src/theme';
import { Eyebrow, Rule, Tag } from '../src/components';

const STORAGE_KEY = '@jedilnik_family';
const AVATAR_COLORS = ['#C8421F', '#3F6E5A', '#D4A24C', '#7C4A8C', '#4A7C8C', '#8C6A2A'];
const DIET_OPTIONS = [
  'No restrictions',
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Mediterranean',
  'Ketogenic',
  'Paleo',
  'High protein',
  'Low calorie',
  'Gluten-free',
  'Lactose-free',
  'Sugar-free',
];
const COMMON_ALLERGIES = ['Nuts', 'Lactose', 'Gluten', 'Eggs', 'Fish', 'Soy', 'Shrimp'];
const COMMON_DISLIKES = ['Mushrooms', 'Olives', 'Broccoli', 'Spinach', 'Onion', 'Peppers', 'Celery'];

type Member = {
  id: string;
  name: string;
  role: string;
  diet: string;
  allergies: string[];
  dislikes: string[];
  color: string;
};

function newMember(index: number): Member {
  return {
    id: Date.now().toString(),
    name: '',
    role: '',
    diet: 'Brez omejitev',
    allergies: [],
    dislikes: [],
    color: AVATAR_COLORS[index % AVATAR_COLORS.length],
  };
}

export default function FamilyScreen() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [customAllergy, setCustomAllergy] = useState('');
  const [customDislike, setCustomDislike] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) setMembers(JSON.parse(raw));
    });
  }, []);

  async function save(updated: Member[]) {
    setMembers(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function openAdd() {
    setEditing(newMember(members.length));
    setCustomAllergy('');
    setCustomDislike('');
    setModalVisible(true);
  }

  function openEdit(m: Member) {
    setEditing({ ...m });
    setCustomAllergy('');
    setCustomDislike('');
    setModalVisible(true);
  }

  async function saveMember() {
    if (!editing) return;
    if (!editing.name.trim()) {
      Alert.alert('Name required', 'Please enter a name.');
      return;
    }
    const exists = members.find(m => m.id === editing.id);
    const updated = exists
      ? members.map(m => m.id === editing.id ? editing : m)
      : [...members, editing];
    await save(updated);
    setModalVisible(false);
  }

  async function deleteMember(id: string) {
    Alert.alert('Delete member', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await save(members.filter(m => m.id !== id));
        setModalVisible(false);
      }},
    ]);
  }

  function toggleTag(list: string[], val: string): string[] {
    return list.includes(val) ? list.filter(x => x !== val) : [...list, val];
  }

  function addCustomAllergy() {
    const val = customAllergy.trim();
    if (!val || !editing) return;
    if (!editing.allergies.includes(val))
      setEditing({ ...editing, allergies: [...editing.allergies, val] });
    setCustomAllergy('');
  }

  function addCustomDislike() {
    const val = customDislike.trim();
    if (!val || !editing) return;
    if (!editing.dislikes.includes(val))
      setEditing({ ...editing, dislikes: [...editing.dislikes, val] });
    setCustomDislike('');
  }

  const isExisting = !!members.find(m => m.id === editing?.id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.chapter}>CHAPTER 1 / 3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Eyebrow>Mise en place</Eyebrow>
        <Text style={styles.title}>Your family,{'\n'}<Text style={{ fontStyle: 'italic' }}>your table.</Text></Text>
        <Text style={styles.subtitle}>Each member has their own taste. Set diets, allergies and dislikes.</Text>

        {members.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No members yet.{'\n'}Add the first one below.</Text>
          </View>
        )}

        {members.map(m => (
          <TouchableOpacity key={m.id} style={styles.memberCard} onPress={() => openEdit(m)}>
            <View style={[styles.avatar, { backgroundColor: m.color }]}>
              <Text style={styles.avatarLetter}>{m.name[0]?.toUpperCase() ?? '?'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.memberName}>{m.name}</Text>
              <Text style={styles.memberMeta}>{[m.role, m.diet].filter(Boolean).join(' · ')}</Text>
              <View style={styles.tags}>
                {m.allergies.map(a => <Tag key={a} variant="allergy">{a}</Tag>)}
                {m.dislikes.map(d => <Tag key={d}>{d}</Tag>)}
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Add member</Text>
        </TouchableOpacity>
      </ScrollView>

      {members.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/generating')}>
            <Text style={styles.btnPrimaryText}>Continue  →</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{isExisting ? 'Edit member' : 'New member'}</Text>
            <TouchableOpacity onPress={saveMember}>
              <Text style={styles.modalSave}>Shrani</Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>

              <View style={styles.colorRow}>
                {AVATAR_COLORS.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.colorDot, { backgroundColor: c }, editing?.color === c && styles.colorDotActive]}
                    onPress={() => editing && setEditing({ ...editing, color: c })}
                  />
                ))}
              </View>

              <Rule />

              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editing?.name ?? ''}
                onChangeText={t => editing && setEditing({ ...editing, name: t })}
                placeholder="e.g. Ana"
                placeholderTextColor={colors.rule}
              />

              <Text style={styles.fieldLabel}>Role</Text>
              <TextInput
                style={styles.input}
                value={editing?.role ?? ''}
                onChangeText={t => editing && setEditing({ ...editing, role: t })}
                placeholder="e.g. mom, dad, daughter 8, son 5"
                placeholderTextColor={colors.rule}
              />

              <Rule />

              <Text style={styles.fieldLabel}>Diet</Text>
              <View style={styles.pillRow}>
                {DIET_OPTIONS.map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.pill, editing?.diet === d && styles.pillActive]}
                    onPress={() => editing && setEditing({ ...editing, diet: d })}
                  >
                    <Text style={[styles.pillText, editing?.diet === d && styles.pillTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Rule />

              <Text style={styles.fieldLabel}>Allergies</Text>
              <View style={styles.pillRow}>
                {COMMON_ALLERGIES.map(a => {
                  const on = editing?.allergies.includes(a);
                  return (
                    <TouchableOpacity
                      key={a}
                      style={[styles.pill, on && styles.pillAllergyActive]}
                      onPress={() => editing && setEditing({ ...editing, allergies: toggleTag(editing.allergies, a) })}
                    >
                      <Text style={[styles.pillText, on && styles.pillAllergyText]}>{on ? '⊘ ' : ''}{a}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.customRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={customAllergy}
                  onChangeText={setCustomAllergy}
                  placeholder="Other allergy..."
                  placeholderTextColor={colors.rule}
                  onSubmitEditing={addCustomAllergy}
                  returnKeyType="done"
                />
                <TouchableOpacity style={styles.addTagBtn} onPress={addCustomAllergy}>
                  <Text style={styles.addTagBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              <Rule />

              <Text style={styles.fieldLabel}>Dislikes</Text>
              <View style={styles.pillRow}>
                {COMMON_DISLIKES.map(d => {
                  const on = editing?.dislikes.includes(d);
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[styles.pill, on && styles.pillActive]}
                      onPress={() => editing && setEditing({ ...editing, dislikes: toggleTag(editing.dislikes, d) })}
                    >
                      <Text style={[styles.pillText, on && styles.pillTextActive]}>{d}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.customRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={customDislike}
                  onChangeText={setCustomDislike}
                  placeholder="Other..."
                  placeholderTextColor={colors.rule}
                  onSubmitEditing={addCustomDislike}
                  returnKeyType="done"
                />
                <TouchableOpacity style={styles.addTagBtn} onPress={addCustomDislike}>
                  <Text style={styles.addTagBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              {isExisting && (
                <>
                  <Rule my={24} />
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => editing && deleteMember(editing.id)}>
                    <Text style={styles.deleteBtnText}>Delete member</Text>
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
  header:            { paddingHorizontal: 22, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn:           { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1.5, color: colors.inkSoft },
  chapter:           { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 2, color: colors.inkSoft },
  content:           { paddingHorizontal: 22, paddingBottom: 20 },
  title:             { fontFamily: 'DM Serif Display', fontSize: 32, lineHeight: 34, letterSpacing: -0.5, color: colors.ink, marginBottom: 8, marginTop: 4 },
  subtitle:          { fontFamily: 'Inter', fontSize: 14, lineHeight: 21, color: colors.inkSoft, marginBottom: 20 },
  emptyBox:          { borderWidth: 1, borderColor: colors.rule, borderStyle: 'dashed', padding: 32, alignItems: 'center', marginBottom: 16 },
  emptyText:         { fontFamily: 'DM Serif Display', fontStyle: 'italic', fontSize: 16, color: colors.inkSoft, textAlign: 'center', lineHeight: 24 },
  memberCard:        { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.rule, marginBottom: 10, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar:            { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarLetter:      { fontFamily: 'DM Serif Display', fontSize: 22, color: '#fff' },
  memberName:        { fontFamily: 'DM Serif Display', fontSize: 19, lineHeight: 20, color: colors.ink, marginBottom: 3 },
  memberMeta:        { fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1.2, color: colors.inkSoft, textTransform: 'uppercase' },
  tags:              { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  chevron:           { fontFamily: 'JetBrains Mono', fontSize: 14, color: colors.inkSoft },
  addBtn:            { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.rule, padding: 14, alignItems: 'center', marginTop: 4 },
  addBtnText:        { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: colors.inkSoft },
  footer:            { paddingHorizontal: 22, paddingBottom: 16, paddingTop: 8 },
  btnPrimary:        { backgroundColor: colors.ink, paddingVertical: 16, alignItems: 'center' },
  btnPrimaryText:    { fontFamily: 'Inter Medium', fontSize: 15, color: colors.paper },
  modalHeader:       { paddingHorizontal: 22, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.rule },
  modalCancel:       { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 1, color: colors.inkSoft },
  modalTitle:        { fontFamily: 'DM Serif Display', fontSize: 18, color: colors.ink },
  modalSave:         { fontFamily: 'Inter Medium', fontSize: 14, color: colors.tomato },
  modalContent:      { paddingHorizontal: 22, paddingTop: 16 },
  colorRow:          { flexDirection: 'row', gap: 10, marginBottom: 4 },
  colorDot:          { width: 32, height: 32, borderRadius: 16 },
  colorDotActive:    { borderWidth: 3, borderColor: colors.ink },
  fieldLabel:        { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: colors.inkSoft, marginBottom: 8 },
  input:             { borderWidth: 1, borderColor: colors.rule, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'DM Serif Display', fontSize: 17, color: colors.ink, marginBottom: 16, backgroundColor: colors.card },
  pillRow:           { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  pill:              { borderWidth: 1, borderColor: colors.rule, paddingHorizontal: 12, paddingVertical: 6 },
  pillActive:        { backgroundColor: colors.ink, borderColor: colors.ink },
  pillText:          { fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: 0.8, color: colors.inkSoft },
  pillTextActive:    { color: colors.paper },
  pillAllergyActive: { backgroundColor: colors.tomatoSoft, borderColor: colors.tomato },
  pillAllergyText:   { color: colors.tomato },
  customRow:         { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'center' },
  addTagBtn:         { width: 44, height: 44, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  addTagBtnText:     { fontFamily: 'DM Serif Display', fontSize: 22, color: colors.paper },
  deleteBtn:         { borderWidth: 1, borderColor: colors.tomato, paddingVertical: 14, alignItems: 'center' },
  deleteBtnText:     { fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: colors.tomato },
});
