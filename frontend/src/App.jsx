import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useSettings } from './hooks/useSettings';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Public pages – lazy loaded for route-level code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Programs = lazy(() => import('./pages/Programs'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Facilities = lazy(() => import('./pages/Facilities'));
const Contact = lazy(() => import('./pages/Contact'));

// Admin pages – lazy loaded
const Login = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const GalleryAdmin = lazy(() => import('./pages/admin/GalleryAdmin'));
const FacilitiesAdmin = lazy(() => import('./pages/admin/FacilitiesAdmin'));
const ProgramsAdmin = lazy(() => import('./pages/admin/ProgramsAdmin'));
const MessagesAdmin = lazy(() => import('./pages/admin/MessagesAdmin'));
const SettingsAdmin = lazy(() => import('./pages/admin/SettingsAdmin'));
const ProtectedRoute = lazy(() => import('./pages/admin/ProtectedRoute'));

function PublicLayout() {
  const { settings } = useSettings();
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
      <Footer settings={settings} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="programs" element={<ProgramsAdmin />} />
              <Route path="gallery" element={<GalleryAdmin />} />
              <Route path="facilities" element={<FacilitiesAdmin />} />
              <Route path="messages" element={<MessagesAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
            </Route>

            {/* Public routes */}
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
