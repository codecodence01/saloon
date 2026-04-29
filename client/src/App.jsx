import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Spinner from './components/Spinner';
import AdminRoute from './components/AdminRoute';

// Lazy-load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Packages = lazy(() => import('./pages/Packages'));
const Booking = lazy(() => import('./pages/Booking'));
const About = lazy(() => import('./pages/About'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Admin pages
const AdminDashboard = lazy(() => import('./admin/Dashboard'));
const AdminBookings = lazy(() => import('./admin/BookingsManager'));
const AdminServices = lazy(() => import('./admin/ServicesManager'));
const AdminPackages = lazy(() => import('./admin/PackagesManager'));
const AdminStylists = lazy(() => import('./admin/StylistsManager'));
const AdminTestimonials = lazy(() => import('./admin/TestimonialsManager'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});

// Layout wrapper for public pages
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-center"
            toastOptions={{
              style: { fontFamily: 'DM Sans, sans-serif', borderRadius: '12px' },
              success: { iconTheme: { primary: '#B76E79', secondary: '#fff' } },
            }}
          />
          <Suspense fallback={<Spinner />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
              <Route path="/packages" element={<PublicLayout><Packages /></PublicLayout>} />
              <Route path="/booking" element={<PublicLayout><Booking /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin routes — protected */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="packages" element={<AdminPackages />} />
                <Route path="stylists" element={<AdminStylists />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
