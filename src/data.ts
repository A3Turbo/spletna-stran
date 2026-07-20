export const SAMPLE_FAMILY = [
  { name: 'Ana',   role: 'mom',      diet: 'No restrictions', allergies: [] as string[],       dislikes: ['Mushrooms'], color: '#C8421F' },
  { name: 'Marko', role: 'dad',      diet: 'No restrictions', allergies: [] as string[],       dislikes: ['Olives'],    color: '#3F6E5A' },
  { name: 'Lina',  role: 'daughter', diet: 'Vegetarian',      allergies: ['Nuts'] as string[], dislikes: ['Broccoli'],  color: '#D4A24C' },
  { name: 'Jakob', role: 'son',      diet: 'No restrictions', allergies: ['Lactose'] as string[], dislikes: ['Spinach'], color: '#7C4A8C' },
];

export const SAMPLE_WEEK = [
  { day: 'MON', date: 'May 5', meals: [
    { type: 'breakfast', name: 'Oatmeal with berries',         time: '10 min', kcal: 320, price: 1.80, tag: 'quick',     mainIngredients: ['Oats', 'Berries', 'Milk'] },
    { type: 'lunch',     name: 'Beef goulash with polenta',    time: '45 min', kcal: 640, price: 4.20, tag: 'warm dish', mainIngredients: ['Beef', 'Onion', 'Red wine', 'Polenta'] },
    { type: 'dinner',    name: 'Caprese salad with olives',    time: '12 min', kcal: 380, price: 3.10, tag: 'light',     mainIngredients: ['Tomatoes', 'Mozzarella', 'Olive oil'] },
  ]},
  { day: 'TUE', date: 'May 6', meals: [
    { type: 'breakfast', name: 'Whole grain toast with avocado', time: '8 min',  kcal: 290, price: 2.10, tag: 'quick', mainIngredients: ['Bread', 'Avocado', 'Olive oil'] },
    { type: 'lunch',     name: 'Lentil stew',                    time: '35 min', kcal: 520, price: 2.80, tag: 'vegan', mainIngredients: ['Lentils', 'Onion', 'Tomatoes', 'Olive oil'] },
    { type: 'dinner',    name: 'Baked trout with potatoes',      time: '30 min', kcal: 480, price: 5.40, tag: 'fish',  mainIngredients: ['Trout', 'Potato', 'Olive oil'] },
  ]},
  { day: 'WED', date: 'May 7', meals: [
    { type: 'breakfast', name: 'Cottage cheese pancakes',  time: '20 min', kcal: 410, price: 1.90, tag: 'sweet', mainIngredients: ['Cottage cheese', 'Eggs', 'Flour'] },
    { type: 'lunch',     name: 'Chicken curry with rice',  time: '40 min', kcal: 590, price: 4.60, tag: 'asian', mainIngredients: ['Chicken breast', 'Rice', 'Onion', 'Olive oil'] },
    { type: 'dinner',    name: 'Zucchini soup with ginger',time: '25 min', kcal: 240, price: 2.20, tag: 'light', mainIngredients: ['Zucchini', 'Onion', 'Olive oil'] },
  ]},
  { day: 'THU', date: 'May 8', meals: [
    { type: 'breakfast', name: 'Granola with Greek yogurt', time: '5 min',  kcal: 360, price: 2.40, tag: 'quick',   mainIngredients: ['Granola', 'Greek yogurt'] },
    { type: 'lunch',     name: 'Spaghetti bolognese',       time: '40 min', kcal: 680, price: 3.80, tag: 'classic', mainIngredients: ['Pasta', 'Beef', 'Onion', 'Tomato paste', 'Olive oil'] },
    { type: 'dinner',    name: 'Seasonal salad with tofu',  time: '15 min', kcal: 320, price: 3.40, tag: 'vegan',   mainIngredients: ['Tofu', 'Olive oil', 'Salt & pepper'] },
  ]},
  { day: 'FRI', date: 'May 9', meals: [
    { type: 'breakfast', name: 'Pan-fried eggs with tomatoes', time: '15 min', kcal: 380, price: 2.20, tag: 'warm',    mainIngredients: ['Eggs', 'Tomatoes', 'Olive oil', 'Salt & pepper'] },
    { type: 'lunch',     name: 'Baked salmon with risotto',   time: '35 min', kcal: 620, price: 6.80, tag: 'fish',    mainIngredients: ['Salmon', 'Rice', 'Onion', 'Olive oil'] },
    { type: 'dinner',    name: 'Chicken tortilla',            time: '20 min', kcal: 510, price: 3.60, tag: 'mexican', mainIngredients: ['Chicken breast', 'Tortilla', 'Onion'] },
  ]},
  { day: 'SAT', date: 'May 10', meals: [
    { type: 'breakfast', name: 'Homemade bread with jam',  time: '10 min', kcal: 340, price: 1.50, tag: 'tradition', mainIngredients: ['Bread', 'Jam'] },
    { type: 'lunch',     name: 'Sunday soup & roast',      time: '90 min', kcal: 720, price: 7.20, tag: 'festive',   mainIngredients: ['Beef', 'Potato', 'Onion', 'Salt & pepper'] },
    { type: 'dinner',    name: 'Cheese platter',           time: '10 min', kcal: 420, price: 4.80, tag: 'light',     mainIngredients: ['Cheese', 'Olive oil'] },
  ]},
  { day: 'SUN', date: 'May 11', meals: [
    { type: 'breakfast', name: 'Chocolate pancakes', time: '20 min', kcal: 480, price: 2.10, tag: 'sweet',  mainIngredients: ['Flour', 'Eggs', 'Milk', 'Cocoa'] },
    { type: 'lunch',     name: 'Homemade burgers',   time: '30 min', kcal: 720, price: 5.20, tag: 'family', mainIngredients: ['Beef', 'Onion', 'Salt & pepper'] },
    { type: 'dinner',    name: 'Fruit salad',        time: '8 min',  kcal: 220, price: 3.40, tag: 'light',  mainIngredients: ['Fruit'] },
  ]},
];

export const RECIPE_DETAIL = {
  name: 'Beef Goulash with Polenta',
  time: '45 min', servings: 4, kcal: 640, protein: 38, price: 4.20,
  intro: "A classic goulash from our grandmothers' old recipe. The beef slowly braises in red wine with onions and peppers until tender as butter. Served with creamy polenta.",
  ingredients: [
    { name: 'Beef chuck',      amount: '600', unit: 'g' },
    { name: 'Onion',           amount: '3',   unit: 'pcs' },
    { name: 'Red pepper',      amount: '2',   unit: 'pcs' },
    { name: 'Tomato paste',    amount: '2',   unit: 'tbsp' },
    { name: 'Red wine',        amount: '200', unit: 'ml' },
    { name: 'Ground paprika',  amount: '1',   unit: 'tbsp' },
    { name: 'Polenta',         amount: '250', unit: 'g' },
    { name: 'Milk',            amount: '500', unit: 'ml' },
    { name: 'Salt & pepper',   amount: 'to taste', unit: '' },
  ],
  steps: [
    'Cut the meat into 3×3 cm cubes. Finely chop the onion.',
    'Heat oil in a pot, add onion and sauté for 8 min until golden brown.',
    'Add ground paprika, stir for 30 seconds, then add the meat. Brown for 5 min.',
    'Pour in the wine, add tomato paste, peppers and water to cover the meat.',
    'Cover and braise for 90 min. Stir occasionally.',
    'Cook polenta in milk according to package instructions. Serve together.',
  ],
};

export const PANTRY = [
  { name: 'Olive oil',     have: true,  unit: 'have',    savedPrice: 3.20 },
  { name: 'Salt & pepper', have: true,  unit: 'have',    savedPrice: 1.10 },
  { name: 'Onion',         have: true,  unit: '5 pcs',   savedPrice: 1.50 },
  { name: 'Potato',        have: true,  unit: '1 kg',    savedPrice: 2.60 },
  { name: 'Red wine',      have: false, unit: 'missing', savedPrice: 0 },
  { name: 'Beef',          have: false, unit: 'missing', savedPrice: 0 },
];

export const SHOPPING = [
  { cat: 'Meat & fish', items: [
    { name: 'Beef chuck',      amount: '600 g', price: 9.80, checked: false },
    { name: 'Trout',           amount: '2 pcs', price: 7.20, checked: false },
    { name: 'Chicken breast',  amount: '500 g', price: 6.40, checked: true  },
  ]},
  { cat: 'Vegetables', items: [
    { name: 'Tomatoes',    amount: '1 kg',  price: 3.20, checked: false },
    { name: 'Red pepper',  amount: '4 pcs', price: 2.80, checked: false },
    { name: 'Zucchini',    amount: '3 pcs', price: 2.10, checked: false },
    { name: 'Avocado',     amount: '2 pcs', price: 3.40, checked: true  },
  ]},
  { cat: 'Dairy', items: [
    { name: 'Greek yogurt',    amount: '500 g', price: 2.60, checked: false },
    { name: 'Cottage cheese',  amount: '250 g', price: 1.90, checked: false },
  ]},
  { cat: 'Grains & basics', items: [
    { name: 'Polenta',      amount: '500 g', price: 1.40, checked: false },
    { name: 'Basmati rice', amount: '1 kg',  price: 2.80, checked: false },
  ]},
];

export const STATS = {
  budget:    { spent: 47.20, target: 80, week: 'May 5–11' },
  nutrition: { kcalAvg: 1850, proteinAvg: 92, kcalTarget: 2000, proteinTarget: 120 },
  topRated:  [
    { name: 'Spaghetti bolognese',    rating: 4.8 },
    { name: 'Beef goulash',           rating: 4.6 },
    { name: 'Cottage cheese pancakes',rating: 4.5 },
  ],
};

export const PHOTO_BY_DISH: Record<string, string> = {
  'hero-table':  'https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=80&auto=format&fit=crop',
  'hero-spread': 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=900&q=80&auto=format&fit=crop',
  'hero-rustic': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=80&auto=format&fit=crop',
  'Oatmeal with berries':              'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&q=80&auto=format&fit=crop',
  'Whole grain toast with avocado':    'https://images.unsplash.com/photo-1603046891744-76e6300f82ef?w=600&q=80&auto=format&fit=crop',
  'Cottage cheese pancakes':           'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&q=80&auto=format&fit=crop',
  'Granola with Greek yogurt':         'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80&auto=format&fit=crop',
  'Pan-fried eggs with tomatoes':      'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80&auto=format&fit=crop',
  'Homemade bread with jam':           'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80&auto=format&fit=crop',
  'Chocolate pancakes':                'https://images.unsplash.com/photo-1565299543923-37dd37887442?w=600&q=80&auto=format&fit=crop',
  'Beef goulash with polenta':         'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900&q=80&auto=format&fit=crop',
  'Lentil stew':                       'https://images.unsplash.com/photo-1547308283-b941ea5b8f78?w=600&q=80&auto=format&fit=crop',
  'Chicken curry with rice':           'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80&auto=format&fit=crop',
  'Spaghetti bolognese':               'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80&auto=format&fit=crop',
  'Baked salmon with risotto':         'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&auto=format&fit=crop',
  'Sunday soup & roast':               'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80&auto=format&fit=crop',
  'Homemade burgers':                  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80&auto=format&fit=crop',
  'Caprese salad with olives':         'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600&q=80&auto=format&fit=crop',
  'Baked trout with potatoes':         'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=600&q=80&auto=format&fit=crop',
  'Zucchini soup with ginger':         'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80&auto=format&fit=crop',
  'Seasonal salad with tofu':          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&auto=format&fit=crop',
  'Chicken tortilla':                  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80&auto=format&fit=crop',
  'Cheese platter':                    'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80&auto=format&fit=crop',
  'Fruit salad':                       'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=600&q=80&auto=format&fit=crop',
};

export function getDishPhoto(name: string): string {
  return PHOTO_BY_DISH[name] ?? PHOTO_BY_DISH['hero-rustic'];
}
