// Trattoria design system

export type Colors = {
  paper: string;
  paperAlt: string;
  ink: string;
  inkSoft: string;
  rule: string;
  tomato: string;
  tomatoSoft: string;
  basil: string;
  card: string;
  white: string;
};

export type ThemeMode = 'original' | 'light' | 'dark';

const original: Colors = {
  paper:      '#F2EBDD',
  paperAlt:   '#EBE2D0',
  ink:        '#1F1612',
  inkSoft:    '#5C4A3C',
  rule:       '#D4C7B0',
  tomato:     '#B8421F',
  tomatoSoft: '#E8C9BD',
  basil:      '#5A6B3A',
  card:       '#FBF6EA',
  white:      '#FFFFFF',
};

const light: Colors = {
  paper:      '#FFFFFF',
  paperAlt:   '#F4F4F2',
  ink:        '#1A1A1A',
  inkSoft:    '#63615C',
  rule:       '#E2E0DA',
  tomato:     '#B8421F',
  tomatoSoft: '#F0D9CF',
  basil:      '#5A6B3A',
  card:       '#FAFAF8',
  white:      '#FFFFFF',
};

const dark: Colors = {
  paper:      '#17130F',
  paperAlt:   '#211B15',
  ink:        '#F2EBDD',
  inkSoft:    '#B3A594',
  rule:       '#3A3128',
  tomato:     '#E2703A',
  tomatoSoft: '#4A2B22',
  basil:      '#8FA968',
  card:       '#211B15',
  white:      '#FFFFFF',
};

export const palettes: Record<ThemeMode, Colors> = { original, light, dark };

// Default palette for anything not yet wired to useTheme().
export const colors = original;

export const fonts = {
  serif: 'DM Serif Display' as const,
  body:  'Inter' as const,
  mono:  'JetBrains Mono' as const,
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  22,
  xl:  32,
  xxl: 48,
};
