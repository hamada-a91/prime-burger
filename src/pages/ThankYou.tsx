import { SEOHead } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function ThankYou() {
    return (
        <>
            <SEOHead title="Vielen Dank" description="Vielen Dank für Ihre Nachricht" noIndex={true} />

            <div className="container py-32 text-center">
                <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Vielen Dank!</h1>
                <p className="text-muted-foreground mb-8">
                    Ihre Nachricht wurde erfolgreich übermittelt.
                </p>
                <Button asChild>
                    <Link to="/">Zurück zur Startseite</Link>
                </Button>
            </div>
        </>
    );
}
