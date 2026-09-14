import { formatDate, useLocale, useT } from '@/i18n';
import type { LegalSection } from '@/config/website.config.schema';

interface Props {
    title: string;
    sections: LegalSection[];
    lastUpdated?: string;
}

export function LegalPageTemplate({ title, sections, lastUpdated }: Props) {
    const t = useT();
    const locale = useLocale();

    return (
        <div className="container-site max-w-3xl pt-[72px]">
            <header className="pt-16 pb-10 md:pt-24">
                <h1 className="font-display display-xl text-foreground">{title}</h1>
                {lastUpdated && (
                    <p className="mt-3 text-sm text-muted-foreground">
                        {t('legal.lastUpdated', { date: formatDate(lastUpdated, locale, { day: '2-digit', month: 'long', year: 'numeric' }) })}
                    </p>
                )}
            </header>

            <div className="space-y-10 pb-20">
                {sections.map((section) => (
                    <section key={section.heading}>
                        <h2 className="font-display display-sm text-foreground mb-3">{section.heading}</h2>
                        <div
                            className="space-y-3 text-muted-foreground leading-relaxed [&_a]:text-primary [&_a]:underline"
                            dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                    </section>
                ))}
            </div>
        </div>
    );
}
