// API Types for Phase 11+

export interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    featured_image?: string;
    meta?: Record<string, unknown>;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface JobListing {
    id: number;
    slug: string;
    title: string;
    description: string;
    requirements?: string;
    tasks?: string;
    foot_notes?: string;
    location?: string;
    type: 'full-time' | 'part-time' | 'freelance' | 'internship';
    salary_range?: string;
    department?: string;
    is_active: boolean;
    expires_at?: string;
    created_at: string;
    updated_at: string;
}

export interface ContactSubmission {
    id: number;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    created_at: string;
    updated_at: string;
}

export interface ContactSlot {
    id: number;
    date: string;
    time: string;
    is_available: boolean;
    booked_by?: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface AuthResponse {
    user: User;
}

export interface DashboardStats {
    contacts: {
        total: number;
        new: number;
        today: number;
        this_week: number;
        this_month: number;
        by_day: { date: string; count: number }[];
    };
    blog: {
        total: number;
        published: number;
        drafts: number;
    };
    jobs: {
        total: number;
        active: number;
        expired: number;
    };
    team?: {
        total: number;
    };
}

export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    website?: string;
}

export interface BlogFormData {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featured_image?: string | File;
    is_published: boolean;
}

export interface JobFormData {
    title: string;
    slug: string;
    description: string;
    requirements?: string;
    tasks?: string;
    foot_notes?: string;
    type: 'full-time' | 'part-time' | 'freelance' | 'internship';
    location?: string;
    salary_range?: string;
    is_active: boolean;
}

export interface SlotFormData {
    date: string;
    time: string;
}
