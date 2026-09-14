// src/hooks/useConfig.tsx
import { createContext, useContext, type ReactNode } from 'react';
import { websiteConfig } from '@/config/website.config';
import type { WebsiteConfig, PageConfig, ContentBlock } from '@/config/website.config.schema';

// Context
const ConfigContext = createContext<WebsiteConfig | null>(null);

// Provider Component
interface ConfigProviderProps {
    children: ReactNode;
    config?: WebsiteConfig;
}

export function ConfigProvider({ children, config = websiteConfig }: ConfigProviderProps) {
    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
}

// Main Hook
export function useConfig(): WebsiteConfig {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
}

// Convenience Hooks
export function useSiteConfig() {
    const config = useConfig();
    return config.site;
}

export function useNavigation() {
    const config = useConfig();
    return config.navigation;
}

export function usePageConfig(pageName: keyof WebsiteConfig['pages']): PageConfig {
    const config = useConfig();
    const page = config.pages[pageName];
    if (!page) {
        throw new Error(`Seite "${String(pageName)}" ist in website.config.ts nicht definiert`);
    }
    return page;
}

export function usePageBlocks(pageName: keyof WebsiteConfig['pages']): ContentBlock[] {
    const pageConfig = usePageConfig(pageName);
    return pageConfig.blocks;
}

export function useLegalConfig() {
    const config = useConfig();
    return config.legal;
}

export function useSEOConfig() {
    const config = useConfig();
    return config.seo;
}

export function useSocialConfig() {
    const config = useConfig();
    return config.social;
}

export function useAPIConfig() {
    const config = useConfig();
    return config.api;
}

export function useTokens() {
    const config = useConfig();
    return config.tokens;
}
