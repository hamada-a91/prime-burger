// src/config/website.config.schema.ts

// ─────────────────────────────────────────
// Main Config Interface
// ─────────────────────────────────────────
export interface WebsiteConfig {
    site: SiteConfig;
    tokens: TokensConfig;
    navigation: NavigationConfig;
    pages: PagesConfig;
    legal: LegalConfig;
    seo: SEOConfig;
    social: SocialConfig;
    api: APIConfig;
    features: FeaturesConfig;
}

// ─────────────────────────────────────────
// Site Config
// ─────────────────────────────────────────
export interface SiteConfig {
    name: string;
    tagline: string;
    description: string;
    url: string;
    logo: {
        light: string;
        dark: string;
        favicon: string;
    };
    contact: {
        email: string;
        phone?: string;
        address?: AddressConfig;
    };
    language: 'de' | 'en' | 'nl';
}

export interface AddressConfig {
    street: string;
    city: string;
    zip: string;
    country: string;
}

// ─────────────────────────────────────────
// Tokens Config (Design System)
// ─────────────────────────────────────────
export interface TokensConfig {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        foreground: string;
        muted: string;
        destructive: string;
    };
    radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    shadows: {
        sm: string;
        md: string;
        lg: string;
    };
    typography: {
        fontFamily: {
            heading: string;
            body: string;
        };
        fontSizes: {
            xs: string;
            sm: string;
            base: string;
            lg: string;
            xl: string;
            '2xl': string;
            '3xl': string;
            '4xl': string;
        };
    };
    spacing: {
        section: string;
        container: string;
    };
    animations: {
        enabled: boolean;
        duration: string;
        easing: string;
    };
}

// ─────────────────────────────────────────
// Navigation Config
// ─────────────────────────────────────────
export interface NavigationConfig {
    items: NavItem[];
    cta?: {
        text: string;
        href: string;
        variant: 'default' | 'outline' | 'ghost';
    };
}

export interface NavItem {
    label: string;
    href: string;
    children?: NavItem[];
    external?: boolean;
}

// ─────────────────────────────────────────
// Pages Config
// ─────────────────────────────────────────
export interface PagesConfig {
    home: PageConfig;
    about: PageConfig;
    services: PageConfig;
    contact: PageConfig;
    faq: PageConfig;
    blog: PageConfig;
    jobs?: PageConfig;
}

export interface PageConfig {
    seo: PageSEOConfig;
    blocks: ContentBlock[];
}

export interface PageSEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
}

// ─────────────────────────────────────────
// Content Blocks
// ─────────────────────────────────────────
export type ContentBlock =
    | HeroBlock
    | SocialProofBlock
    | FeatureGridBlock
    | CTABlock
    | TestimonialsBlock
    | PricingBlock
    | FAQBlock
    | BlogPreviewBlock
    | JobsListBlock
    | ContactFormBlock
    | TextBlock
    | ImageBlock
    | TeamBlock;

export interface HeroBlock {
    type: 'hero';
    variant: 'centered' | 'split' | 'video' | 'fullscreen' | 'parallax';
    headline: string;
    subheadline?: string;
    cta?: {
        primary: { text: string; href: string };
        secondary?: { text: string; href: string };
    };
    backgroundImage?: string;
    badge?: string;
}

export interface SocialProofBlock {
    type: 'social-proof';
    variant: 'logos' | 'stats' | 'combined';
    title?: string;
    logos?: { src: string; alt: string; href?: string }[];
    stats?: { value: string; label: string }[];
}

export interface FeatureGridBlock {
    type: 'feature-grid';
    variant: 'cards' | 'icons' | 'bento';
    title: string;
    subtitle?: string;
    features: {
        icon?: string;
        title: string;
        description: string;
        image?: string;
        href?: string;
    }[];
    columns?: 2 | 3 | 4;
}

export interface CTABlock {
    type: 'cta';
    variant: 'simple' | 'newsletter' | 'gradient';
    headline: string;
    description?: string;
    button: { text: string; href: string };
    backgroundImage?: string;
}

export interface TestimonialsBlock {
    type: 'testimonials';
    variant: 'carousel' | 'grid' | 'masonry' | 'wall';
    title?: string;
    testimonials: {
        quote: string;
        author: string;
        role?: string;
        company?: string;
        avatar?: string;
        rating?: number;
    }[];
}

export interface PricingBlock {
    type: 'pricing';
    variant: 'cards' | 'comparison';
    title: string;
    subtitle?: string;
    billingToggle?: boolean;
    plans: PricingPlan[];
}

export interface PricingPlan {
    name: string;
    description: string;
    price: {
        monthly: string;
        yearly?: string;
    };
    features: string[];
    cta: { text: string; href: string };
    highlighted?: boolean;
    badge?: string;
}

export interface FAQBlock {
    type: 'faq';
    variant: 'accordion' | 'grid';
    title: string;
    subtitle?: string;
    items: { question: string; answer: string }[];
}

export interface BlogPreviewBlock {
    type: 'blog-preview';
    variant: 'cards' | 'list';
    title: string;
    subtitle?: string;
    count: number;
    showImages: boolean;
}

export interface JobsListBlock {
    type: 'jobs-list';
    title: string;
    subtitle?: string;
    limit?: number;
    showFilters?: boolean;
}

export interface ContactFormBlock {
    type: 'contact-form';
    variant: 'simple' | 'with-info' | 'split';
    title: string;
    subtitle?: string;
    fields: FormField[];
    submitText: string;
    successMessage: string;
    successRedirect?: string;
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
    placeholder?: string;
    required?: boolean;
    options?: string[];
}

export interface TextBlock {
    type: 'text';
    content: string;
    alignment?: 'left' | 'center' | 'right';
}

export interface ImageBlock {
    type: 'image';
    src: string;
    alt: string;
    caption?: string;
    fullWidth?: boolean;
}

export interface TeamBlock {
    type: 'team';
    variant: 'cards' | 'grid';
    title: string;
    subtitle?: string;
    members: {
        name: string;
        role: string;
        image: string;
        bio?: string;
        social?: { platform: string; url: string }[];
    }[];
}

// ─────────────────────────────────────────
// Legal Config
// ─────────────────────────────────────────
export interface LegalConfig {
    company: {
        name: string;
        legalForm?: string;
        registerNumber?: string;
        registerCourt?: string;
        vatId?: string;
        managingDirector?: string;
    };
    privacyPolicy: LegalSection[];
    imprint: LegalSection[];
    terms: LegalSection[];
    cookieConsent: CookieConsentConfig;
}

export interface LegalSection {
    heading: string;
    content: string;
}

export interface CookieConsentConfig {
    enabled: boolean;
    title: string;
    description: string;
    categories: {
        necessary: boolean;
        analytics?: boolean;
        marketing?: boolean;
    };
    privacyLink: string;
}

// ─────────────────────────────────────────
// SEO Config
// ─────────────────────────────────────────
export interface SEOConfig {
    titleTemplate: string;
    defaultTitle: string;
    defaultDescription: string;
    defaultImage: string;
    twitterHandle?: string;
    googleVerification?: string;
    jsonLd: {
        organization: boolean;
        website: boolean;
        localBusiness?: LocalBusinessConfig;
    };
}

export interface LocalBusinessConfig {
    type: string;
    priceRange?: string;
    openingHours?: string[];
}

// ─────────────────────────────────────────
// Social Config
// ─────────────────────────────────────────
export interface SocialConfig {
    links: {
        platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'xing';
        url: string;
    }[];
}

// ─────────────────────────────────────────
// Feature Flags
// ─────────────────────────────────────────
export interface FeaturesConfig {
    blog: boolean;
    jobs: boolean;
    team: boolean;
    contactSlots: boolean;
    analytics: boolean;
}

// ─────────────────────────────────────────
// API Config
// ─────────────────────────────────────────
export interface APIConfig {
    baseUrl: string;
    endpoints: {
        blog: string;
        jobs: string;
        contact: string;
    };
}
