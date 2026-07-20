// Returns Monday of the current week
export function getWeekStart(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// "May 5–11"
export function formatWeekRange(weekStart: Date): string {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const month = weekStart.toLocaleString('en', { month: 'long' });
  const endMonth = end.toLocaleString('en', { month: 'long' });
  if (month === endMonth) {
    return `${month} ${weekStart.getDate()}–${end.getDate()}`;
  }
  return `${month} ${weekStart.getDate()} – ${endMonth} ${end.getDate()}`;
}

// ISO week number (1–53)
export function getISOWeek(date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// "Spring" / "Summer" / "Autumn" / "Winter"
export function getSeason(date = new Date()): string {
  const m = date.getMonth() + 1;
  if (m >= 3 && m <= 5) return 'Spring';
  if (m >= 6 && m <= 8) return 'Summer';
  if (m >= 9 && m <= 11) return 'Autumn';
  return 'Winter';
}

// [{ day: 'MON', date: 'May 5' }, ...]
export function getWeekDays(weekStart: Date): { day: string; date: string }[] {
  const labels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  return labels.map((label, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return {
      day: label,
      date: d.toLocaleString('en', { month: 'long', day: 'numeric' }),
    };
  });
}
