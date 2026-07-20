import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REGION_KEY = '@jedilnik_region';

export type RegionId =
  | 'SI' | 'HR' | 'BA' | 'RS' | 'MK' | 'ME' | 'AL'  // Balkans
  | 'AT' | 'DE' | 'CH'                                  // DACH
  | 'IT' | 'FR' | 'ES' | 'PT'                           // Southern Europe
  | 'NL' | 'BE' | 'LU'                                  // Benelux
  | 'PL' | 'CZ' | 'SK' | 'HU' | 'RO' | 'BG'           // Central/Eastern Europe
  | 'SE' | 'NO' | 'DK' | 'FI'                           // Nordics
  | 'GB' | 'IE'                                          // British Isles
  | 'GR' | 'CY'                                          // Greece/Cyprus
  | 'US' | 'CA' | 'AU' | 'NZ'                           // English-speaking world
  | 'BR' | 'MX' | 'AR'                                  // Latin America
  | 'JP' | 'KR' | 'CN' | 'IN' | 'SG'                   // Asia
  | 'ZA' | 'NG' | 'KE'                                  // Africa
  | 'AE' | 'SA' | 'IL';                                 // Middle East

export const REGIONS: { id: RegionId; label: string; flag: string; currency: string; symbol: string }[] = [
  // Balkans
  { id: 'SI', label: 'Slovenia',    flag: '🇸🇮', currency: 'EUR', symbol: '€' },
  { id: 'HR', label: 'Croatia',     flag: '🇭🇷', currency: 'EUR', symbol: '€' },
  { id: 'BA', label: 'Bosnia',      flag: '🇧🇦', currency: 'BAM', symbol: 'KM' },
  { id: 'RS', label: 'Serbia',      flag: '🇷🇸', currency: 'RSD', symbol: 'din' },
  { id: 'MK', label: 'N. Macedonia',flag: '🇲🇰', currency: 'MKD', symbol: 'ден' },
  { id: 'ME', label: 'Montenegro',  flag: '🇲🇪', currency: 'EUR', symbol: '€' },
  { id: 'AL', label: 'Albania',     flag: '🇦🇱', currency: 'ALL', symbol: 'L' },
  // DACH
  { id: 'DE', label: 'Germany',     flag: '🇩🇪', currency: 'EUR', symbol: '€' },
  { id: 'AT', label: 'Austria',     flag: '🇦🇹', currency: 'EUR', symbol: '€' },
  { id: 'CH', label: 'Switzerland', flag: '🇨🇭', currency: 'CHF', symbol: 'Fr' },
  // Southern Europe
  { id: 'IT', label: 'Italy',       flag: '🇮🇹', currency: 'EUR', symbol: '€' },
  { id: 'FR', label: 'France',      flag: '🇫🇷', currency: 'EUR', symbol: '€' },
  { id: 'ES', label: 'Spain',       flag: '🇪🇸', currency: 'EUR', symbol: '€' },
  { id: 'PT', label: 'Portugal',    flag: '🇵🇹', currency: 'EUR', symbol: '€' },
  { id: 'GR', label: 'Greece',      flag: '🇬🇷', currency: 'EUR', symbol: '€' },
  { id: 'CY', label: 'Cyprus',      flag: '🇨🇾', currency: 'EUR', symbol: '€' },
  // Benelux
  { id: 'NL', label: 'Netherlands', flag: '🇳🇱', currency: 'EUR', symbol: '€' },
  { id: 'BE', label: 'Belgium',     flag: '🇧🇪', currency: 'EUR', symbol: '€' },
  { id: 'LU', label: 'Luxembourg',  flag: '🇱🇺', currency: 'EUR', symbol: '€' },
  // Central/Eastern Europe
  { id: 'PL', label: 'Poland',      flag: '🇵🇱', currency: 'PLN', symbol: 'zł' },
  { id: 'CZ', label: 'Czech Rep.',  flag: '🇨🇿', currency: 'CZK', symbol: 'Kč' },
  { id: 'SK', label: 'Slovakia',    flag: '🇸🇰', currency: 'EUR', symbol: '€' },
  { id: 'HU', label: 'Hungary',     flag: '🇭🇺', currency: 'HUF', symbol: 'Ft' },
  { id: 'RO', label: 'Romania',     flag: '🇷🇴', currency: 'RON', symbol: 'lei' },
  { id: 'BG', label: 'Bulgaria',    flag: '🇧🇬', currency: 'BGN', symbol: 'лв' },
  // Nordics
  { id: 'SE', label: 'Sweden',      flag: '🇸🇪', currency: 'SEK', symbol: 'kr' },
  { id: 'NO', label: 'Norway',      flag: '🇳🇴', currency: 'NOK', symbol: 'kr' },
  { id: 'DK', label: 'Denmark',     flag: '🇩🇰', currency: 'DKK', symbol: 'kr' },
  { id: 'FI', label: 'Finland',     flag: '🇫🇮', currency: 'EUR', symbol: '€' },
  // British Isles
  { id: 'GB', label: 'UK',          flag: '🇬🇧', currency: 'GBP', symbol: '£' },
  { id: 'IE', label: 'Ireland',     flag: '🇮🇪', currency: 'EUR', symbol: '€' },
  // English-speaking world
  { id: 'US', label: 'USA',         flag: '🇺🇸', currency: 'USD', symbol: '$' },
  { id: 'CA', label: 'Canada',      flag: '🇨🇦', currency: 'CAD', symbol: 'C$' },
  { id: 'AU', label: 'Australia',   flag: '🇦🇺', currency: 'AUD', symbol: 'A$' },
  { id: 'NZ', label: 'New Zealand', flag: '🇳🇿', currency: 'NZD', symbol: 'NZ$' },
  // Latin America
  { id: 'BR', label: 'Brazil',      flag: '🇧🇷', currency: 'BRL', symbol: 'R$' },
  { id: 'MX', label: 'Mexico',      flag: '🇲🇽', currency: 'MXN', symbol: 'MX$' },
  { id: 'AR', label: 'Argentina',   flag: '🇦🇷', currency: 'ARS', symbol: '$' },
  // Asia
  { id: 'JP', label: 'Japan',       flag: '🇯🇵', currency: 'JPY', symbol: '¥' },
  { id: 'KR', label: 'South Korea', flag: '🇰🇷', currency: 'KRW', symbol: '₩' },
  { id: 'CN', label: 'China',       flag: '🇨🇳', currency: 'CNY', symbol: '¥' },
  { id: 'IN', label: 'India',       flag: '🇮🇳', currency: 'INR', symbol: '₹' },
  { id: 'SG', label: 'Singapore',   flag: '🇸🇬', currency: 'SGD', symbol: 'S$' },
  // Africa
  { id: 'ZA', label: 'South Africa',flag: '🇿🇦', currency: 'ZAR', symbol: 'R' },
  { id: 'NG', label: 'Nigeria',     flag: '🇳🇬', currency: 'NGN', symbol: '₦' },
  { id: 'KE', label: 'Kenya',       flag: '🇰🇪', currency: 'KES', symbol: 'KSh' },
  // Middle East
  { id: 'AE', label: 'UAE',         flag: '🇦🇪', currency: 'AED', symbol: 'د.إ' },
  { id: 'SA', label: 'Saudi Arabia',flag: '🇸🇦', currency: 'SAR', symbol: '﷼' },
  { id: 'IL', label: 'Israel',      flag: '🇮🇱', currency: 'ILS', symbol: '₪' },
];

export const STORES: Record<RegionId, string[]> = {
  SI: ['Mercator', 'Spar', 'Lidl', 'Hofer'],
  HR: ['Konzum', 'Lidl', 'Spar', 'Kaufland'],
  BA: ['Bingo', 'Konzum', 'Tropic', 'Lidl'],
  RS: ['Idea', 'Maxi', 'Lidl', 'Roda'],
  MK: ['Tinex', 'Ramstor', 'Lidl', 'Kam'],
  ME: ['Voli', 'Idea', 'Lidl', 'Aroma'],
  AL: ['Conad', 'Spar', 'Euromax', 'Fitesa'],
  DE: ['REWE', 'Edeka', 'Aldi', 'Lidl'],
  AT: ['Spar', 'Billa', 'Hofer', 'Lidl'],
  CH: ['Migros', 'Coop', 'Lidl', 'Aldi'],
  IT: ['Esselunga', 'Conad', 'Lidl', 'Coop'],
  FR: ['Carrefour', 'Leclerc', 'Lidl', 'Auchan'],
  ES: ['Mercadona', 'Carrefour', 'Lidl', 'Día'],
  PT: ['Continente', 'Pingo Doce', 'Lidl', 'Aldi'],
  GR: ['AB Vassilopoulos', 'Sklavenitis', 'Lidl', 'My Market'],
  CY: ['Alphamega', 'Lidl', 'Papantoniou', 'Carrefour'],
  NL: ['Albert Heijn', 'Jumbo', 'Lidl', 'Aldi'],
  BE: ['Colruyt', 'Carrefour', 'Lidl', 'Delhaize'],
  LU: ['Auchan', 'Cactus', 'Lidl', 'Delhaize'],
  PL: ['Biedronka', 'Lidl', 'Kaufland', 'Auchan'],
  CZ: ['Albert', 'Kaufland', 'Lidl', 'Penny'],
  SK: ['Kaufland', 'Lidl', 'Tesco', 'Billa'],
  HU: ['Tesco', 'Lidl', 'Aldi', 'Spar'],
  RO: ['Kaufland', 'Carrefour', 'Lidl', 'Penny'],
  BG: ['Kaufland', 'Billa', 'Lidl', 'Fantastico'],
  SE: ['ICA', 'Coop', 'Lidl', 'Willys'],
  NO: ['Rema 1000', 'Kiwi', 'Meny', 'Coop'],
  DK: ['Netto', 'Bilka', 'Lidl', 'Rema 1000'],
  FI: ['S-kaupat', 'K-kaupat', 'Lidl', 'Prisma'],
  GB: ['Tesco', "Sainsbury's", 'Lidl', 'ASDA'],
  IE: ['Tesco', 'SuperValu', 'Lidl', 'Aldi'],
  US: ['Whole Foods', "Trader Joe's", 'Walmart', 'Kroger'],
  CA: ['Loblaws', 'Metro', 'Sobeys', 'Costco'],
  AU: ['Woolworths', 'Coles', 'Aldi', 'IGA'],
  NZ: ['Countdown', 'New World', 'Pak\'nSave', 'Four Square'],
  BR: ['Pão de Açúcar', 'Carrefour', 'Extra', 'Atacadão'],
  MX: ['Walmart', 'Soriana', 'Chedraui', 'La Comer'],
  AR: ['Carrefour', 'Coto', 'Jumbo', 'Dia'],
  JP: ['Aeon', 'Ito-Yokado', 'Life', 'Seiyu'],
  KR: ['E-Mart', 'Homeplus', 'Lotte Mart', 'GS25'],
  CN: ['RT-Mart', 'CR Vanguard', 'Carrefour', 'Walmart'],
  IN: ['Big Bazaar', 'Reliance Fresh', 'DMart', 'Spencer\'s'],
  SG: ['NTUC FairPrice', 'Cold Storage', 'Giant', 'Sheng Siong'],
  ZA: ['Pick n Pay', 'Checkers', 'Woolworths', 'Shoprite'],
  NG: ['Shoprite', 'Spar', 'Hubmart', 'Prince Ebeano'],
  KE: ['Naivas', 'Carrefour', 'Quickmart', 'Chandarana'],
  AE: ['Carrefour', 'Lulu', 'Spinneys', 'Union Coop'],
  SA: ['Panda', 'Danube', 'Carrefour', 'Tamimi'],
  IL: ['Shufersal', 'Rami Levy', 'Victory', 'Mega'],
};

const LOCALE_MAP: Record<string, RegionId> = {
  'sl': 'SI', 'sl-SI': 'SI',
  'hr': 'HR', 'hr-HR': 'HR',
  'bs': 'BA', 'bs-BA': 'BA',
  'sr': 'RS', 'sr-RS': 'RS',
  'mk': 'MK', 'mk-MK': 'MK',
  'sq': 'AL', 'sq-AL': 'AL',
  'de': 'DE', 'de-DE': 'DE',
  'de-AT': 'AT',
  'de-CH': 'CH',
  'it': 'IT', 'it-IT': 'IT',
  'fr': 'FR', 'fr-FR': 'FR',
  'fr-BE': 'BE',
  'fr-CH': 'CH',
  'es': 'ES', 'es-ES': 'ES',
  'es-MX': 'MX', 'es-AR': 'AR',
  'pt': 'PT', 'pt-PT': 'PT',
  'pt-BR': 'BR',
  'el': 'GR', 'el-GR': 'GR',
  'nl': 'NL', 'nl-NL': 'NL',
  'nl-BE': 'BE',
  'pl': 'PL', 'pl-PL': 'PL',
  'cs': 'CZ', 'cs-CZ': 'CZ',
  'sk': 'SK', 'sk-SK': 'SK',
  'hu': 'HU', 'hu-HU': 'HU',
  'ro': 'RO', 'ro-RO': 'RO',
  'bg': 'BG', 'bg-BG': 'BG',
  'sv': 'SE', 'sv-SE': 'SE',
  'nb': 'NO', 'no': 'NO',
  'da': 'DK', 'da-DK': 'DK',
  'fi': 'FI', 'fi-FI': 'FI',
  'en-GB': 'GB',
  'en-IE': 'IE',
  'en-US': 'US',
  'en-CA': 'CA',
  'en-AU': 'AU',
  'en-NZ': 'NZ',
  'en-ZA': 'ZA',
  'en-SG': 'SG',
  'en-IN': 'IN',
  'ja': 'JP', 'ja-JP': 'JP',
  'ko': 'KR', 'ko-KR': 'KR',
  'zh': 'CN', 'zh-CN': 'CN',
  'hi': 'IN', 'hi-IN': 'IN',
  'ar': 'AE', 'ar-AE': 'AE', 'ar-SA': 'SA',
  'he': 'IL', 'he-IL': 'IL',
  'en': 'US',
};

function detectRegion(): RegionId {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale ?? 'en-US';
    return LOCALE_MAP[locale] ?? LOCALE_MAP[locale.split('-')[0]] ?? 'US';
  } catch {
    return 'US';
  }
}

export function useRegion() {
  const [region, setRegionState] = useState<RegionId>('US');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(REGION_KEY).then(saved => {
      if (saved && REGIONS.find(r => r.id === saved)) {
        setRegionState(saved as RegionId);
      } else {
        const detected = detectRegion();
        setRegionState(detected);
        AsyncStorage.setItem(REGION_KEY, detected);
      }
      setLoaded(true);
    });
  }, []);

  async function setRegion(r: RegionId) {
    setRegionState(r);
    await AsyncStorage.setItem(REGION_KEY, r);
  }

  return { region, setRegion, loaded };
}
