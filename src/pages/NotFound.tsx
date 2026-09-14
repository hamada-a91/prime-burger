import { useT } from '@/i18n';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo';
import { LocaleLink } from '@/components/site/LocaleLink';

export function NotFound() {
    const t = useT();

    return (
        <>
            <SEOHead title="404" description={t('notFound.title')} noIndex />
            <div className="container-site flex min-h-[70vh] flex-col items-start justify-center pt-[72px]">
                <p className="font-display text-8xl text-primary">404</p>
                <h1 className="font-display display-lg text-foreground mt-2">{t('notFound.title')}</h1>
                <p className="mt-4 max-w-md text-muted-foreground">{t('notFound.text')}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild size="lg">
                        <LocaleLink to="menu">{t('common.viewMenu')}</LocaleLink>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <LocaleLink to="home">{t('common.backHome')}</LocaleLink>
                    </Button>
                </div>
            </div>
        </>
    );
}
