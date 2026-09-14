import { describe, expect, it } from 'vitest';
import de from './de';
import en from './en';
import { localePath, routeKeyFromSlug, translate } from './index';

function keys(obj: object, prefix = ''): string[] {
    return Object.entries(obj).flatMap(([k, v]) =>
        v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
    );
}

describe('dictionaries', () => {
    it('en has exactly the same keys as de', () => {
        expect(keys(en).sort()).toEqual(keys(de).sort());
    });

    it('contains no em or en dashes (typography rule)', () => {
        const all = JSON.stringify(de) + JSON.stringify(en);
        expect(all).not.toMatch(/[–—]/);
    });
});

describe('translate', () => {
    it('interpolates variables', () => {
        expect(translate('en', 'gallery.counter', { index: 2, total: 9 })).toBe('2 / 9');
    });
});

describe('routes', () => {
    it('builds localised paths', () => {
        expect(localePath('de', 'menu')).toBe('/de/speisekarte');
        expect(localePath('en', 'home')).toBe('/en');
        expect(routeKeyFromSlug('en', 'reservation')).toBe('reservation');
        expect(routeKeyFromSlug('de', undefined)).toBe('home');
        expect(routeKeyFromSlug('de', 'nope')).toBeUndefined();
    });
});
