import { describe, expect, it } from 'vitest';
import { groupHours, openStatus, telHref } from '@/lib/opening-hours';
import type { OpeningHours } from '@/types/api';

const hours: OpeningHours = {
    mon: { open: '11:30', close: '22:00', closed: false },
    tue: { open: '11:30', close: '22:00', closed: false },
    wed: { open: '11:30', close: '22:00', closed: false },
    thu: { open: '11:30', close: '22:00', closed: false },
    fri: { open: '11:30', close: '23:00', closed: false },
    sat: { open: '11:30', close: '23:00', closed: false },
    sun: { open: '11:30', close: '21:00', closed: true },
};

describe('openStatus', () => {
    it('is open during opening hours', () => {
        // Monday 2026-09-14 15:00
        expect(openStatus(hours, new Date(2026, 8, 14, 15, 0))).toEqual({ isOpen: true, time: '22:00' });
    });

    it('reports next opening time before opening', () => {
        expect(openStatus(hours, new Date(2026, 8, 14, 9, 0))).toEqual({ isOpen: false, time: '11:30' });
    });

    it('skips closed days when looking ahead', () => {
        // Saturday 23:30 -> Sunday closed -> Monday
        expect(openStatus(hours, new Date(2026, 8, 19, 23, 30))).toEqual({ isOpen: false, time: '11:30', nextDay: 'mon' });
    });
});

describe('groupHours', () => {
    it('groups consecutive identical days', () => {
        const groups = groupHours(hours);
        expect(groups.map((g) => [g.from, g.to])).toEqual([['mon', 'thu'], ['fri', 'sat'], ['sun', 'sun']]);
    });
});

describe('telHref', () => {
    it('converts a German number to E.164', () => {
        expect(telHref('0341 30853717')).toBe('tel:+4934130853717');
    });
});
