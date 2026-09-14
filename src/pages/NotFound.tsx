import { SEOHead } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function NotFound() {
    return (
        <>
            <SEOHead title="Seite nicht gefunden" description="404 Error" noIndex={true} />

            <div className="container py-32 text-center">
                <h1 className="text-9xl font-bold text-muted-foreground/20 mb-4">404</h1>
                <h2 className="text-2xl font-bold mb-4">Seite nicht gefunden</h2>
                <p className="text-muted-foreground mb-8">
                    Die angeforderte Seite existiert nicht.
                </p>
                <Button asChild>
                    <Link to="/">Zur Startseite</Link>
                </Button>
            </div>
        </>
    );
}
