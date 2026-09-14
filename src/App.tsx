import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ConfigProvider } from '@/hooks';
import { AuthProvider } from '@/hooks/useAuth';
import { LocaleLayout } from '@/components/layout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { detectLocale, LOCALES, ROUTE_SLUGS, type RouteKey } from '@/i18n';

import { Home, About, Menu, Gallery, Reservation, Privacy, Imprint, NotFound } from '@/pages';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { Dashboard } from '@/pages/admin/Dashboard';
import { Reservations } from '@/pages/admin/Reservations';
import { MenuAdmin } from '@/pages/admin/MenuAdmin';
import { GalleryAdmin } from '@/pages/admin/GalleryAdmin';
import { Settings } from '@/pages/admin/Settings';

const PAGES: Record<RouteKey, React.ComponentType> = {
    home: Home,
    about: About,
    menu: Menu,
    gallery: Gallery,
    reservation: Reservation,
    privacy: Privacy,
    imprint: Imprint,
};

function LocaleRedirect() {
    return <Navigate to={`/${detectLocale()}`} replace />;
}

export default function App() {
    return (
        <HelmetProvider>
            <ConfigProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <ErrorBoundary>
                            <Routes>
                                <Route index element={<LocaleRedirect />} />

                                {/* Public routes, one set per language with localised slugs */}
                                <Route path=":locale" element={<LocaleLayout />}>
                                    {LOCALES.flatMap((locale) =>
                                        (Object.keys(PAGES) as RouteKey[]).map((key) => {
                                            const Page = PAGES[key];
                                            const slug = ROUTE_SLUGS[key][locale];
                                            return slug
                                                ? <Route key={`${locale}-${key}`} path={slug} element={<Page />} />
                                                : <Route key={`${locale}-${key}`} index element={<Page />} />;
                                        })
                                    )}
                                    <Route path="*" element={<NotFound />} />
                                </Route>

                                {/* Admin */}
                                <Route path="admin">
                                    <Route path="login" element={<AdminLogin />} />
                                    <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                                        <Route index element={<Dashboard />} />
                                        <Route path="reservations" element={<Reservations />} />
                                        <Route path="menu" element={<MenuAdmin />} />
                                        <Route path="gallery" element={<GalleryAdmin />} />
                                        <Route path="settings" element={<Settings />} />
                                    </Route>
                                </Route>
                            </Routes>
                        </ErrorBoundary>
                    </BrowserRouter>
                </AuthProvider>
            </ConfigProvider>
        </HelmetProvider>
    );
}
