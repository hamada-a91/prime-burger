import type { DayKey, OpeningHours } from '@/types/api';

export const DAY_KEYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export function dayKeyFor(date: Date): DayKey {
    // JS: 0 = Sunday
    return DAY_KEYS[(date.getDay() + 6) % 7];
}

function minutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + (m || 0);
}

export interface OpenStatus {
    isOpen: boolean;
    /** Closing time when open, next opening time when closed (may be undefined if nothing found). */
    time?: string;
    /** Day key of the next opening when closed and not today. */
    nextDay?: DayKey;
}

export function openStatus(hours: OpeningHours | undefined, now = new Date()): OpenStatus | null {
    if (!hours) return null;

    const today = dayKeyFor(now);
    const current = now.getHours() * 60 + now.getMinutes();
    const todayHours = hours[today];

    if (todayHours && !todayHours.closed) {
        const open = minutes(todayHours.open);
        const close = minutes(todayHours.close);
        if (current >= open && current < close) return { isOpen: true, time: todayHours.close };
        if (current < open) return { isOpen: false, time: todayHours.open };
    }

    // Look ahead for the next opening day.
    const startIndex = DAY_KEYS.indexOf(today);
    for (let i = 1; i <= 7; i++) {
        const key = DAY_KEYS[(startIndex + i) % 7];
        const day = hours[key];
        if (day && !day.closed) return { isOpen: false, time: day.open, nextDay: key };
    }

    return { isOpen: false };
}

/** Groups consecutive days with identical hours: [["mon","thu"], ["fri","sat"], ["sun","sun"]]. */
export function groupHours(hours: OpeningHours): { from: DayKey; to: DayKey; day: OpeningHours[DayKey] }[] {
    const groups: { from: DayKey; to: DayKey; day: OpeningHours[DayKey] }[] = [];
    for (const key of DAY_KEYS) {
        const day = hours[key];
        if (!day) continue;
        const last = groups[groups.length - 1];
        if (last && last.day.closed === day.closed && last.day.open === day.open && last.day.close === day.close) {
            last.to = key;
        } else {
            groups.push({ from: key, to: key, day });
        }
    }
    return groups;
}

export function telHref(phone: string): string {
    const digits = phone.replace(/[^\d+]/g, '');
    return `tel:${digits.startsWith('0') ? `+49${digits.slice(1)}` : digits}`;
}
