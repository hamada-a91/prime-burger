import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface LegalSection {
    heading: string;
    content: string;
}

interface LegalPageTemplateProps {
    title: string;
    sections: LegalSection[];
    lastUpdated?: string;
}

export function LegalPageTemplate({ title, sections, lastUpdated }: LegalPageTemplateProps) {
    return (
        <div className="container py-20 max-w-4xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-bold mb-4">{title}</h1>
                {lastUpdated && (
                    <p className="text-muted-foreground">
                        Zuletzt aktualisiert: {format(new Date(lastUpdated), 'dd. MMMM yyyy', { locale: de })}
                    </p>
                )}
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none">
                {sections.map((section, index) => (
                    <section key={index} className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4">{section.heading}</h2>
                        <div
                            dangerouslySetInnerHTML={{ __html: section.content }}
                            className="text-muted-foreground leading-relaxed legal-content"
                        />
                    </section>
                ))}
            </div>

            <footer className="mt-16 pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                    Bei Fragen wenden Sie sich bitte an uns.
                </p>
            </footer>
        </div>
    );
}
