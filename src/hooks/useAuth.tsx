import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AuthResponse, User } from '@/types/api';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, remember?: boolean) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(() => window.location.pathname.startsWith('/admin'));
    const queryClient = useQueryClient();

    async function refreshUser() {
        const userData = await api.get<User>('/user');
        setUser(userData);
    }

    useEffect(() => {
        if (!window.location.pathname.startsWith('/admin')) {
            return;
        }

        refreshUser()
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    async function login(email: string, password: string, remember = false) {
        await api.csrf();
        const response = await api.post<AuthResponse>('/login', { email, password, remember });
        setUser(response.user);
    }

    async function logout() {
        try {
            await api.post('/logout');
        } catch {
            // Ignore logout errors; the local auth state is still cleared below.
        } finally {
            setUser(null);
            queryClient.clear();
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            refreshUser,
            isAuthenticated: !!user,
            isLoading,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
