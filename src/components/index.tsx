import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../theme';
import { useTheme } from '../ThemeContext';
import { getDishPhoto } from '../data';

// ─── Eyebrow label ───────────────────────────────────────────────────────────
export function Eyebrow({ children, color }: { children: React.ReactNode; color?: string }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <Text style={[styles.eyebrow, { color: color ?? colors.tomato }]}>{children}</Text>
  );
}

// ─── Horizontal rule ─────────────────────────────────────────────────────────
export function Rule({ color, my = 14 }: { color?: string; my?: number }) {
  const { colors } = useTheme();
  return <View style={{ height: 1, backgroundColor: color ?? colors.rule, marginVertical: my }} />;
}

// ─── Food photo with gradient overlay ────────────────────────────────────────
export function FoodImage({
  dishName,
  photo,
  height = 200,
  caption,
}: {
  dishName?: string;
  photo?: string;
  height?: number;
  caption?: string;
}) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const uri = photo ?? (dishName ? getDishPhoto(dishName) : getDishPhoto('hero-rustic'));
  return (
    <View style={{ width: '100%', height, backgroundColor: '#3a2a20', overflow: 'hidden' }}>
      <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ flex: 1 }} />
        <View style={{ height: height * 0.55, backgroundColor: 'rgba(0,0,0,0)' }} />
      </View>
      {caption ? (
        <Text style={styles.photoCaption}>{caption}</Text>
      ) : null}
    </View>
  );
}

// ─── Tag badge ───────────────────────────────────────────────────────────────
export function Tag({ children, variant = 'outline' }: { children: string; variant?: 'allergy' | 'outline' }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={variant === 'allergy' ? styles.tagAllergy : styles.tagOutline}>
      <Text style={variant === 'allergy' ? styles.tagAllergyText : styles.tagOutlineText}>
        {variant === 'allergy' ? '⊘ ' : ''}{children}
      </Text>
    </View>
  );
}

// ─── Toggle switch ───────────────────────────────────────────────────────────
export function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <View
      style={[styles.toggleTrack, { backgroundColor: value ? colors.tomato : colors.rule }]}
    >
      <View style={[styles.toggleThumb, { transform: [{ translateX: value ? 18 : 2 }] }]} />
    </View>
  );
}

function makeStyles(colors: Colors) {
  return StyleSheet.create({
    eyebrow: {
      fontFamily: 'JetBrains Mono',
      fontSize: 10,
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    photoCaption: {
      position: 'absolute',
      left: 12,
      bottom: 10,
      fontFamily: 'JetBrains Mono',
      fontSize: 10,
      letterSpacing: 1.5,
      color: '#fff',
      textTransform: 'uppercase',
    },
    tagAllergy: {
      backgroundColor: colors.tomatoSoft,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    tagAllergyText: {
      fontFamily: 'JetBrains Mono',
      fontSize: 9,
      letterSpacing: 0.8,
      color: colors.tomato,
    },
    tagOutline: {
      borderWidth: 1,
      borderColor: colors.rule,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    tagOutlineText: {
      fontFamily: 'JetBrains Mono',
      fontSize: 9,
      letterSpacing: 0.8,
      color: colors.inkSoft,
    },
    toggleTrack: {
      width: 38,
      height: 22,
      borderRadius: 11,
      position: 'relative',
    },
    toggleThumb: {
      position: 'absolute',
      top: 2,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
  });
}
