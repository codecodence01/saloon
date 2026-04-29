import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import { formatPrice, discountPercent } from '../utils/helpers';
import api from '../utils/api';

const TIERS = ['All', 'Basic', 'Premium', 'Bridal', 'Party Makeover', 'Complete Beauty'];

export default function Packages() {
  const [activeTier, setActiveTier] = useState('All');

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: () => api.get('/packages').then(r => r.data.data),
  });

  const filtered = activeTier === 'All' ? packages : packages.filter(p => p.tier === activeTier);

  // Determine featured (Premium tier or most expensive after discount)
  const featuredId = packages.find(p => p.tier === 'Premium')?._id;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative container-custom text-center">
          <span className="inline-block text-champagne text-sm font-semibold uppercase tracking-widest mb-4">Special Bundles</span>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-4">Beauty Packages</h1>
          <div className="divider-rose mx-auto"></div>
          <p className="text-white/70 text-lg max-w-xl mx-auto mt-4">
            Save more with our curated beauty bundles — designed for every occasion and every budget.
          </p>
        </div>
      </section>

      <section className="section-pad bg-ivory">
        <div className="container-custom">
          {/* Tier filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {TIERS.map(tier => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTier === tier
                    ? 'bg-rose-gold text-white shadow-md'
                    : 'bg-white text-warm-gray hover:text-rose-gold border border-gray-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Package cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-96 rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {filtered.map((pkg, i) => (
                <PackageCard key={pkg._id} pkg={pkg} index={i} featured={pkg._id === featuredId} />
              ))}
            </div>
          )}

          {/* Comparison table */}
          {packages.length > 0 && (
            <div className="mt-20">
              <h2 className="font-playfair text-3xl font-bold text-soft-black text-center mb-8">Package Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-2xl shadow-md overflow-hidden text-sm">
                  <thead>
                    <tr className="bg-soft-black text-white">
                      <th className="text-left px-6 py-4 font-semibold">Feature</th>
                      {packages.slice(0, 4).map(pkg => (
                        <th key={pkg._id} className="px-6 py-4 text-center font-semibold whitespace-nowrap">
                          {pkg.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-6 py-4 text-warm-gray font-medium">Price</td>
                      {packages.slice(0, 4).map(pkg => (
                        <td key={pkg._id} className="px-6 py-4 text-center font-bold text-rose-gold">
                          {formatPrice(pkg.discountedPrice)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 bg-ivory/50">
                      <td className="px-6 py-4 text-warm-gray font-medium">Savings</td>
                      {packages.slice(0, 4).map(pkg => (
                        <td key={pkg._id} className="px-6 py-4 text-center">
                          <span className="bg-rose-gold/10 text-rose-gold text-xs font-bold px-2 py-0.5 rounded-full">
                            {discountPercent(pkg.originalPrice, pkg.discountedPrice)}% OFF
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-6 py-4 text-warm-gray font-medium">Services Included</td>
                      {packages.slice(0, 4).map(pkg => (
                        <td key={pkg._id} className="px-6 py-4 text-center text-charcoal font-semibold">
                          {pkg.includedServices.length}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 bg-ivory/50">
                      <td className="px-6 py-4 text-warm-gray font-medium">Book Now</td>
                      {packages.slice(0, 4).map(pkg => (
                        <td key={pkg._id} className="px-6 py-4 text-center">
                          <Link to={`/booking?package=${pkg._id}`} className="btn-primary text-xs py-2 px-4">
                            Book
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-soft-black text-center">
        <div className="container-custom">
          <h2 className="font-playfair text-3xl font-bold text-white mb-4">Can't decide? Let us help!</h2>
          <p className="text-white/60 mb-6">Call us and our consultants will recommend the perfect package for you.</p>
          <a href="tel:+919876543210" className="btn-gold px-8 py-3.5">
            📞 Call Us: +91 98765 43210
          </a>
        </div>
      </section>
    </div>
  );
}
