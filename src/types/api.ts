// API types mirroring the Laravel backend.

export interface Translated {
    de?: string | null;
    en?: string | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    user: User;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

// ---- Settings ----

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface DayHours {
    open: string;
    close: string;
    closed: boolean;
}

export type OpeningHours = Record<DayKey, DayHours>;

export interface Address {
    street?: string;
    zip?: string;
    city?: string;
    country?: string;
}

export interface DeliveryPlatform {
    key: string;
    name: string;
    url: string;
    eta: string;
    badge?: Translated;
}

export interface SocialLinks {
    instagram?: string;
    facebook?: string;
    tripadvisor?: string;
}

export interface SettingsMap {
    site_name?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: Address;
    opening_hours?: OpeningHours;
    delivery_platforms?: DeliveryPlatform[];
    social_links?: SocialLinks;
    maps_url?: string;
    hero_headline?: Translated;
    hero_subline?: Translated;
    about_story?: Translated;
    about_philosophy?: Translated;
    reservation_notice?: Translated;
    reservation_email?: string;
}

// ---- Menu ----

export type MenuTag = 'vegan' | 'vegetarian' | 'spicy' | 'signature' | 'new';
export type Allergen = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'L' | 'M' | 'N' | 'O' | 'P' | 'R';

export interface MenuVariant {
    label: Translated;
    price: number;
}

export interface MenuItem {
    id: number;
    category_id: number;
    name: Translated;
    description?: Translated | null;
    price: string | number | null;
    variants?: MenuVariant[] | null;
    price_note?: Translated | null;
    allergens?: Allergen[] | null;
    tags?: MenuTag[] | null;
    is_available: boolean;
    sort_order: number;
    category?: MenuCategory;
}

export interface MenuCategory {
    id: number;
    name: Translated;
    description?: Translated | null;
    sort_order: number;
    is_active: boolean;
    items?: MenuItem[];
    items_count?: number;
}

// ---- Gallery ----

export type GalleryCategory = 'burger' | 'food' | 'ambience' | 'drinks' | 'misc';

export interface GalleryImage {
    id: number;
    path: string;
    thumb_path: string;
    url: string;
    thumb_url: string;
    caption?: Translated | null;
    category: GalleryCategory;
    is_featured: boolean;
    featured_title?: Translated | null;
    featured_subtitle?: Translated | null;
    sort_order: number;
    width?: number | null;
    height?: number | null;
}

// ---- Reservations ----

export type ReservationStatus = 'new' | 'confirmed' | 'declined' | 'archived';

export interface Reservation {
    id: number;
    name: string;
    email: string;
    phone: string;
    guests: number;
    date: string;
    time: string;
    notes?: string | null;
    locale: 'de' | 'en';
    status: ReservationStatus;
    created_at: string;
    updated_at: string;
}

export interface ReservationFormData {
    name: string;
    email: string;
    phone: string;
    guests: number;
    date: string;
    time: string;
    notes?: string;
    website?: string;
}

// ---- Stats ----

export interface Stats {
    reservations: {
        total: number;
        new: number;
        today: number;
        this_week: number;
        upcoming: number;
        by_day: { date: string; count: number }[];
        latest: Reservation[];
    };
    menu: { items: number; unavailable: number };
    gallery: { images: number; featured: number };
}
