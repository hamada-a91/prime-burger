import { createContext, useContext, type ReactNode } from 'react';
import { websiteConfig } from '@/config/website.config';
import type { WebsiteConfig } from '@/config/website.config.schema';

const ConfigContext = createContext<WebsiteConfig>(websiteConfig);

export function ConfigProvider({ children, config = websiteConfig }: { children: ReactNode; config?: WebsiteConfig }) {
    return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useConfig(): WebsiteConfig {
    return useContext(ConfigContext);
}

export function useSiteConfig() {
    return useConfig().site;
}

export function useLegalConfig() {
    return useConfig().legal;
}
