const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-5';
const API_URL = 'https://api.anthropic.com/v1/messages';

export type Meal = {
  type: 'breakfast' | 'lunch' | 'dinner';
  name: string;
  time: string;
  kcal: number;
  price: number;
  tag: string;
  mainIngredients: string[];
};

export type PlanDay = {
  day: string;
  date: string;
  meals: Meal[];
};

export type ShoppingItem = {
  name: string;
  amount: string;
  price: number;
};

export type ShoppingCategory = {
  cat: string;
  items: ShoppingItem[];
};

export type GeneratedPlan = {
  days: PlanDay[];
  shoppingList: ShoppingCategory[];
};

export type FamilyMember = {
  name: string;
  role: string;
  diet: string;
  allergies: string[];
  dislikes: string[];
};

export class GenerationError extends Error {}

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    days: {
      type: 'array',
      minItems: 7,
      maxItems: 7,
      items: {
        type: 'object',
        properties: {
          day: { type: 'string' },
          date: { type: 'string' },
          meals: {
            type: 'array',
            minItems: 3,
            maxItems: 3,
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['breakfast', 'lunch', 'dinner'] },
                name: { type: 'string' },
                time: { type: 'string', description: 'e.g. "20 min"' },
                kcal: { type: 'number' },
                price: { type: 'number', description: 'estimated price per portion in the local currency' },
                tag: { type: 'string', description: 'one short tag, e.g. quick, vegan, warm dish' },
                mainIngredients: { type: 'array', items: { type: 'string' } },
              },
              required: ['type', 'name', 'time', 'kcal', 'price', 'tag', 'mainIngredients'],
            },
          },
        },
        required: ['day', 'date', 'meals'],
      },
    },
    shoppingList: {
      type: 'array',
      description: 'Consolidated grocery list for the whole week, grouped by category, with duplicate ingredients across meals merged into one line.',
      items: {
        type: 'object',
        properties: {
          cat: { type: 'string', description: 'e.g. Meat & fish, Vegetables, Dairy, Grains & basics, Pantry & spices' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                amount: { type: 'string', description: 'total amount needed for the week, e.g. "600 g" or "3 pcs"' },
                price: { type: 'number', description: 'estimated total price for that amount, local currency' },
              },
              required: ['name', 'amount', 'price'],
            },
          },
        },
        required: ['cat', 'items'],
      },
    },
  },
  required: ['days', 'shoppingList'],
};

export async function generateWeekPlan(params: {
  family: FamilyMember[];
  ratings: Record<string, number>;
  region: string;
  weekDays: { day: string; date: string }[];
}): Promise<GeneratedPlan> {
  if (!API_KEY) {
    throw new GenerationError('Missing Anthropic API key. Add EXPO_PUBLIC_ANTHROPIC_API_KEY to .env');
  }

  const { family, ratings, region, weekDays } = params;

  const liked = Object.entries(ratings).filter(([, s]) => s >= 4).map(([n]) => n);
  const disliked = Object.entries(ratings).filter(([, s]) => s <= 2).map(([n]) => n);

  const familyLines = family.length
    ? family.map(m =>
        `- ${m.name} (${m.role || 'family member'}): diet=${m.diet}, allergies=${m.allergies.join(', ') || 'none'}, dislikes=${m.dislikes.join(', ') || 'none'}`
      ).join('\n')
    : '- No family members specified, plan for a general adult household.';

  const prompt = `You are a family meal planner. Write a 7-day meal plan (breakfast, lunch, dinner for each day).

Family:
${familyLines}

${liked.length ? `Dishes this family previously rated highly (favor similar dishes/ingredients): ${liked.join(', ')}` : ''}
${disliked.length ? `Dishes this family previously rated poorly (avoid these and similar dishes): ${disliked.join(', ')}` : ''}

Region: ${region}. Use realistic grocery prices for that region's currency.

Days, in order: ${weekDays.map(d => `${d.day} ${d.date}`).join(', ')}

Rules:
- Never include an ingredient any family member is allergic to.
- Avoid ingredients any family member dislikes.
- Vary meals across the week — do not repeat the same dish.
- Keep breakfasts quick (under 20 min) unless it's a weekend.
- After planning all meals, build a consolidated shoppingList: merge the same ingredient used in multiple meals into a single line with the total amount and total estimated price, grouped into sensible categories.
- Call the submit_week_plan tool with the full 7-day plan and the shoppingList.`;

  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        // React Native's fetch doesn't enforce CORS, but Expo's web target runs in a
        // real browser, which blocks this call without the header below.
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
        tools: [{
          name: 'submit_week_plan',
          description: 'Submit the generated 7-day meal plan',
          input_schema: PLAN_SCHEMA,
        }],
        tool_choice: { type: 'tool', name: 'submit_week_plan' },
      }),
    });
  } catch (e: any) {
    throw new GenerationError(`Network error: ${e?.message ?? e}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new GenerationError(`Claude API error ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const toolUse = data.content?.find((b: any) => b.type === 'tool_use' && b.name === 'submit_week_plan');
  if (!toolUse) {
    throw new GenerationError('Claude did not return a structured plan.');
  }

  return toolUse.input as GeneratedPlan;
}
