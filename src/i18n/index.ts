import { createContext, useContext } from 'react';
import de from './de';
import en from './en';
import type { Locale } from './routes';

export * from './routes';

const dictionaries = { de, en } as const;
type Dict = typeof de;

/** Builds dotted key paths of the dictionary ("reservation.form.name"). Arrays are leaf values. */
type PathsOf<T, Prefix extends string = ''> = {
    [K in keyof T & string]: T[K] extends string
        ? `${Prefix}${K}`
        : T[K] extends readonly unknown[]
          ? `${Prefix}${K}`
          : T[K] extends object
            ? PathsOf<T[K], `${Prefix}${K}.`>
            : never;
}[keyof T & string];

export type TranslationKey = PathsOf<Dict>;

export const LocaleContext = createContext<Locale>('de');

export function useLocale(): Locale {
    return useContext(LocaleContext);
}

function lookup(dict: Dict, key: string): unknown {
    return key.split('.').reduce<unknown>((acc, part) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined), dict);
}

export type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

export function translate(locale: Locale, key: TranslationKey, vars?: Record<string, string | number>): string {
    const raw = lookup(dictionaries[locale], key) ?? lookup(de, key);
    if (typeof raw !== 'string') return key;
    return vars ? raw.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? '')) : raw;
}

export function useT(): Translate {
    const locale = useLocale();
    return (key, vars) => translate(locale, key, vars);
}

/** Access to non-string dictionary nodes (arrays, nested objects), e.g. the about timeline. */
export function useDictionary(): Dict {
    const locale = useLocale();
    return dictionaries[locale];
}

/** Picks the current language from a {de, en} JSON field coming from the API. */
export type Translatable = { de?: string | null; en?: string | null } | string | null | undefined;

export function pick(value: Translatable, locale: Locale): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[locale] || value.de || value.en || '';
}

export function usePick(): (value: Translatable) => string {
    const locale = useLocale();
    return (value) => pick(value, locale);
}

export function formatPrice(value: number | string | null | undefined, locale: Locale): string {
    if (value === null || value === undefined || value === '') return '';
    const number = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-GB', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
    }).format(number);
}

export function formatDate(value: string | Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
    const date = typeof value === 'string' ? new Date(value) : value;
    return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', options ?? { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}
