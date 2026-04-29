import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Facebook, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-soft-black text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-rose-gold" />
              <span className="font-playfair text-xl font-bold gradient-text">Glamour Salon</span>
            </Link>
            <p className="text-warm-gray text-sm leading-relaxed mb-5">
              Where beauty meets artistry. Your premier destination for luxurious salon experiences that transform, inspire, and empower.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-gold flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-gold flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-5 text-champagne">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/services', 'Services'], ['/packages', 'Packages'],
                ['/booking', 'Book Appointment'], ['/about', 'About Us'], ['/gallery', 'Gallery']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-warm-gray hover:text-rose-gold-light text-sm transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-rose-gold"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-5 text-champagne">Our Services</h4>
            <ul className="space-y-2.5">
              {['Hair Care', 'Skin Treatments', 'Bridal Makeup', 'Nail Art', 'Spa & Wellness', 'Party Makeup'].map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-warm-gray hover:text-rose-gold-light text-sm transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-champagne"></span>
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-5 text-champagne">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-gold mt-0.5 shrink-0" />
                <span className="text-warm-gray text-sm">123 Rose Garden Avenue,<br />Bandra West, Mumbai 400050</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-rose-gold shrink-0" />
                <a href="tel:+919876543210" className="text-warm-gray text-sm hover:text-white transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rose-gold shrink-0" />
                <a href="mailto:hello@glamoursalon.com" className="text-warm-gray text-sm hover:text-white transition-colors">hello@glamoursalon.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-rose-gold mt-0.5 shrink-0" />
                <span className="text-warm-gray text-sm">Mon–Sat: 10AM – 8PM<br />Sunday: 11AM – 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-warm-gray text-sm">© {year} Glamour Salon. All rights reserved.</p>
          <div className="flex gap-4 text-warm-gray text-sm">
            <Link to="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
