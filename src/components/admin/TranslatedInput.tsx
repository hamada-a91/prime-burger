import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Translated } from '@/types/api';

interface Props {
    label: string;
    value: Translated | null | undefined;
    onChange: (value: Translated) => void;
    multiline?: boolean;
    required?: boolean;
    rows?: number;
}

/** Side-by-side DE / EN inputs for a translatable JSON field. */
export function TranslatedInput({ label, value, onChange, multiline = false, required = false, rows = 3 }: Props) {
    const current = value ?? {};
    const update = (lang: 'de' | 'en', text: string) => onChange({ ...current, [lang]: text });
    const Control = multiline ? Textarea : Input;

    return (
        <fieldset className="space-y-2">
            <legend className="text-sm font-semibold">
                {label}
                {required && <span className="text-destructive"> *</span>}
            </legend>
            <div className="grid gap-3 md:grid-cols-2">
                {(['de', 'en'] as const).map((lang) => (
                    <div key={lang} className="space-y-1">
                        <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{lang === 'de' ? 'Deutsch' : 'English'}</Label>
                        <Control
                            value={current[lang] ?? ''}
                            onChange={(e) => update(lang, e.target.value)}
                            required={required && lang === 'de'}
                            rows={multiline ? rows : undefined}
                            lang={lang}
                        />
                    </div>
                ))}
            </div>
        </fieldset>
    );
}
