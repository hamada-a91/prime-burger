import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
// Schriften als eigene CSS-Module importieren: beim @import in globals.css schreibt
// Tailwind die url(./files/...) nicht um, die Dateien fehlen dann im Produktions-Build.
import '@fontsource/bebas-neue/latin-400.css';
import '@fontsource-variable/manrope/wght.css';
import './styles/globals.css';
import App from './App.tsx';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            <Toaster position="top-right" richColors closeButton />
        </QueryClientProvider>
    </StrictMode>
);
