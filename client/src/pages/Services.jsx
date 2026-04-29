import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Search } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import api from '../utils/api';

const categories = ['All', 'Hair', 'Skin', 'Makeup', 'Nails', 'Bridal', 'Spa'];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(r => r.data.data),
  });

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Page Hero */}
      <section className="relative pt-32 pb-20 bg-soft-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative container-custom text-center">
          <span className="inline-block text-champagne text-sm font-semibold uppercase tracking-widest mb-4">What We Offer</span>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-4">Our Services</h1>
          <div className="divider-rose mx-auto"></div>
          <p className="text-white/70 text-lg max-w-xl mx-auto mt-4">
            Discover a world of curated beauty services designed to elevate your look and lift your spirit.
          </p>
        </div>
      </section>

      <section className="section-pad bg-ivory">
        <div className="container-custom">
          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-11 text-sm"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-rose-gold text-white shadow-md'
                      : 'bg-white text-warm-gray hover:text-rose-gold border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <p className="text-warm-gray text-sm mb-6">
            Showing <span className="text-rose-gold font-semibold">{filtered.length}</span> service{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
          </p>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="skeleton h-52"></div>
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-5 w-3/4 rounded"></div>
                    <div className="skeleton h-4 rounded"></div>
                    <div className="skeleton h-10 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + search}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((service, i) => (
                  <div key={service._id}>
                    <ServiceCard service={service} index={i} />
                    {/* Accordion detail */}
                    <div className="mt-1 bg-white rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedId(expandedId === service._id ? null : service._id)}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm text-warm-gray hover:text-rose-gold transition-colors"
                      >
                        <span>View Details</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedId === service._id ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expandedId === service._id && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 text-sm text-charcoal leading-relaxed border-t border-gray-100">
                              <p className="mt-3">{service.description}</p>
                              <p className="mt-2 text-warm-gray text-xs">Category: {service.category} · Duration: {service.duration} min</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-warm-gray text-lg">No services found for "{search}"</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
