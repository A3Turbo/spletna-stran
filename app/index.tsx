import { View, Text, ScrollView, TouchableOpacity, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../src/theme';
import { Eyebrow, Rule } from '../src/components';
import { PHOTO_BY_DISH, SAMPLE_WEEK } from '../src/data';
import { getISOWeek, getSeason } from '../src/utils';

const mealsPerWeek = SAMPLE_WEEK.length * 3;

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const week = getISOWeek();
  const season = getSeason();
  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      {/* Hero */}
      <ImageBackground
        source={{ uri: PHOTO_BY_DISH['hero-table'] }}
        style={{ height: height * 0.44 }}
        resizeMode="cover"
      >
        <View style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.heroGradient]} />
        <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
          <Text style={styles.wordmark}>Nana</Text>
          <View style={styles.heroText}>
            <Text style={styles.heroIssue}>Week {week} · {season} meal plan</Text>
            <Text style={styles.heroTitle}>
              Your{'\n'}<Text style={{ fontStyle: 'italic', color: colors.tomatoSoft }}>cookbook.</Text>
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Tell us who sits at your table —{'\n'}
          and every week we write a meal plan{'\n'}
          that <Text style={{ fontStyle: 'italic' }}>works for everyone</Text>.
        </Text>

        <Rule />

        <View style={styles.statsRow}>
          {[["2'", 'Setup'], [String(mealsPerWeek), 'Meals / week'], ['∞', 'Recipes']].map(([v, l]) => (
            <View key={l} style={{ flex: 1 }}>
              <Text style={styles.statNum}>{v}</Text>
              <Text style={styles.statLabel}>{l}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/family')}>
          <Text style={styles.btnPrimaryText}>Start planning  →</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnGhost} onPress={() => router.push('/week')}>
          <Text style={styles.btnGhostText}>or open existing plan →</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnLink} onPress={() => router.push('/settings')}>
          <Text style={styles.btnLinkText}>⚙  Price sources & settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroGradient: {
    backgroundColor: 'transparent',
  },
  wordmark: {
    fontFamily: 'DM Serif Display Italic',
    fontSize: 22,
    color: '#FBF6EA',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  heroText: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroIssue: {
    fontFamily: 'JetBrains Mono',
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: 'rgba(251,246,234,0.85)',
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: 'DM Serif Display',
    fontSize: 44,
    lineHeight: 44,
    letterSpacing: -0.5,
    color: '#FBF6EA',
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 40,
  },
  intro: {
    fontFamily: 'DM Serif Display',
    fontSize: 18,
    lineHeight: 26,
    color: colors.ink,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  statNum: {
    fontFamily: 'DM Serif Display',
    fontSize: 28,
    color: colors.tomato,
    lineHeight: 28,
  },
  statLabel: {
    fontFamily: 'JetBrains Mono',
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.inkSoft,
    marginTop: 4,
  },
  btnPrimary: {
    backgroundColor: colors.ink,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontFamily: 'Inter Medium',
    fontSize: 15,
    color: colors.paper,
    letterSpacing: 0.3,
  },
  btnGhost: {
    paddingVertical: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  btnGhostText: {
    fontFamily: 'JetBrains Mono',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  btnLink: {
    paddingVertical: 10,
    marginTop: 4,
    alignItems: 'center',
  },
  btnLinkText: {
    fontFamily: 'JetBrains Mono',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.inkSoft,
    opacity: 0.75,
  },
});
