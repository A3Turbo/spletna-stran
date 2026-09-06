import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { ThemeProvider, useTheme } from '../src/ThemeContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { colors, mode } = useTheme();
  const [loaded] = useFonts({
    'DM Serif Display':      require('../assets/fonts/DMSerifDisplay-Regular.ttf'),
    'DM Serif Display Italic': require('../assets/fonts/DMSerifDisplay-Italic.ttf'),
    'Inter':                 require('../assets/fonts/Inter-Regular.ttf'),
    'Inter Medium':          require('../assets/fonts/Inter-Medium.ttf'),
    'Inter SemiBold':        require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter Bold':            require('../assets/fonts/Inter-Bold.ttf'),
    'JetBrains Mono':        require('../assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrains Mono Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: colors.paper } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="family" />
        <Stack.Screen name="generating" />
        <Stack.Screen name="week" />
        <Stack.Screen name="recipe" />
        <Stack.Screen name="pantry" />
        <Stack.Screen name="shopping" />
        <Stack.Screen name="stats" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}
