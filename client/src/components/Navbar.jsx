import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/packages', label: 'Packages' },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-rose-gold/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom flex items-center justify-between h-18 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Sparkles className="w-6 h-6 text-rose-gold group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-playfair text-xl font-bold gradient-text">Glamour Salon</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-gold/10 text-rose-gold'
                      : scrolled
                      ? 'text-soft-black hover:text-rose-gold'
                      : 'text-soft-black hover:text-rose-gold'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA + Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin" className="btn-secondary text-sm py-2 px-4">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              )}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-rose-gold/30 text-soft-black text-sm font-medium hover:border-rose-gold transition-colors">
                  <User className="w-4 h-4 text-rose-gold" />
                  {user?.name?.split(' ')[0]}
                </button>
                <div className="absolute right-0 mt-2 w-44 glass-card py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-warm-gray hover:text-rose-gold hover:bg-ivory transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-sm text-warm-gray hover:text-rose-gold transition-colors font-medium">
              Login
            </Link>
          )}
          <Link to="/booking" className="btn-primary text-sm py-2.5 px-5">
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-soft-black hover:bg-rose-gold/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white/98 backdrop-blur-md border-t border-rose-gold/10 px-6 pb-6 pt-2"
          >
            <ul className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        isActive ? 'bg-rose-gold/10 text-rose-gold' : 'text-soft-black hover:bg-ivory'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2">
              <Link to="/booking" onClick={() => setIsOpen(false)} className="btn-primary text-center">
                Book Now
              </Link>
              {isAuthenticated ? (
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="btn-secondary text-center">
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary text-center">
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
