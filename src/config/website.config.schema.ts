export interface LegalSection {
    heading: string;
    content: string;
}

export interface WebsiteConfig {
    site: {
        name: string;
        url: string;
        logo: string;
        favicon: string;
        ogImage: string;
        /** Fallbacks while settings are loading or the API is unreachable. */
        contact: {
            email: string;
            phone: string;
            street: string;
            zip: string;
            city: string;
        };
        themeColor: string;
    };
    legal: {
        owner: string;
        legalForm: string;
        representative: string;
        registerNumber: string;
        registerCourt: string;
        vatId: string;
        lastUpdated: string;
        imprint: Record<'de' | 'en', LegalSection[]>;
        privacy: Record<'de' | 'en', LegalSection[]>;
    };
}
