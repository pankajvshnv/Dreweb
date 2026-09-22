import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { ToastProvider } from './lib/ToastContext';

import Layout from './components/layout/Layout';

// Lazy loaded pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Templates = lazy(() => import('./pages/Templates'));
const Checkout = lazy(() => import('./pages/Checkout'));
const LocalLanding = lazy(() => import('./pages/LocalLanding'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy loaded admin pages
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProjects = lazy(() => import('./pages/admin/Projects'));
const AdminProjectEdit = lazy(() => import('./pages/admin/ProjectEdit'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminServices = lazy(() => import('./pages/admin/Services'));
const AdminShowcaseCards = lazy(() => import('./pages/admin/ShowcaseCards'));
const AdminPricing = lazy(() => import('./pages/admin/Pricing'));
const AdminTemplates = lazy(() => import('./pages/admin/Templates'));
const AdminTemplateEdit = lazy(() => import('./pages/admin/TemplateEdit'));
const AdminMedia = lazy(() => import('./pages/admin/Media'));
const AdminBlog = lazy(() => import('./pages/admin/Blog'));
const AdminLeads = lazy(() => import('./pages/admin/Leads'));
const AdminTestimonials = lazy(() => import('./pages/admin/Testimonials'));

// Scroll restoration component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {

  return (
    <ToastProvider>
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-8 h-8 border-4 border-brand-lime border-t-black rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            {/* Public Routes */}
            <Route element={<Layout><Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-brand-lime border-t-black rounded-full animate-spin"></div></div>}><Outlet /></Suspense></Layout>}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/locations/:city/:service" element={<LocalLanding />} />
              <Route path="/work" element={<Portfolio />} />
              <Route path="/work/:slug" element={<ProjectDetail />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="projects/new" element={<AdminProjectEdit />} />
              <Route path="projects/:id" element={<AdminProjectEdit />} />
              <Route path="showcase-cards" element={<AdminShowcaseCards />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="templates" element={<AdminTemplates />} />
              <Route path="templates/:id" element={<AdminTemplateEdit />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<AdminDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
    </ToastProvider>
  );
}
