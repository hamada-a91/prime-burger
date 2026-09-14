import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ConfigProvider } from '@/hooks';
import { AuthProvider } from '@/hooks/useAuth';
import { Layout } from '@/components/layout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

// Pages
import {
  Home,
  About,
  Services,
  Contact,
  FAQ,
  Blog,
  BlogPost,
  Jobs,
  JobDetail,
  Privacy,
  Imprint,
  Terms,
  ThankYou,
  NotFound,
  Examples
} from '@/pages';

import { AdminLogin } from '@/pages/admin/AdminLogin';
import { Dashboard } from '@/pages/admin/Dashboard';
import { BlogList } from '@/pages/admin/Blog/BlogList';
import { BlogEditor } from '@/pages/admin/Blog/BlogEditor';
import { JobList } from '@/pages/admin/Jobs/JobList';
import { JobEditor } from '@/pages/admin/Jobs/JobEditor';
import { ContactSubmissions } from '@/pages/admin/ContactSubmissions';
import { ContactSlots } from '@/pages/admin/ContactSlots';
import { Settings } from '@/pages/admin/Settings';
import { Analytics } from '@/pages/admin/Analytics';

import './styles/tokens.css';
import './styles/globals.css';

export default function App() {
  return (
    <HelmetProvider>
      <ConfigProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="services" element={<Services />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogPost />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="jobs/:slug" element={<JobDetail />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="imprint" element={<Imprint />} />
                <Route path="terms" element={<Terms />} />
                <Route path="thank-you" element={<ThankYou />} />
                <Route path="examples" element={<Examples />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Routes */}
              <Route path="admin">
                <Route path="login" element={<AdminLogin />} />
                <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="posts" element={<BlogList />} />
                  <Route path="posts/new" element={<BlogEditor />} />
                  <Route path="posts/:id" element={<BlogEditor />} />
                  <Route path="jobs" element={<JobList />} />
                  <Route path="jobs/new" element={<JobEditor />} />
                  <Route path="jobs/:id" element={<JobEditor />} />
                  <Route path="contact" element={<ContactSubmissions />} />
                  <Route path="contact-slots" element={<ContactSlots />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="analytics" element={<Analytics />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ConfigProvider>
    </HelmetProvider>
  );
}

