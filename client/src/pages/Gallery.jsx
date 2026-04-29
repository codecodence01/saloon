import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const allImages = [
  { src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', category: 'Hair', alt: 'Hair styling' },
  { src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80', category: 'Makeup', alt: 'Makeup look' },
  { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', category: 'Skin', alt: 'Skin treatment' },
  { src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80', category: 'Nails', alt: 'Nail art' },
  { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', category: 'Bridal', alt: 'Bridal look' },
  { src: 'https://images.unsplash.com/photo-1560750133-cf09f6b5f1c0?w=600&q=80', category: 'Skin', alt: 'Spa treatment' },
  { src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', category: 'Hair', alt: 'Hair color' },
  { src: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80', category: 'Makeup', alt: 'Glam makeup' },
  { src: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&q=80', category: 'Bridal', alt: 'Bridal makeup' },
  { src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', category: 'Makeup', alt: 'Beauty look' },
  { src: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=600&q=80', category: 'Hair', alt: 'Balayage' },
  { src: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80', category: 'Skin', alt: 'Glow skin' },
];

const categories = ['All', 'Hair', 'Skin', 'Makeup', 'Bridal', 'Nails'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = activeCategory === 'All' ? allImages : allImages.filter(img => img.category === activeCategory);

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  const next = () => setLightboxIndex((lightboxIndex + 1) % filtered.length);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-soft-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative container-custom text-center">
          <span className="inline-block text-champagne text-sm font-semibold uppercase tracking-widest mb-4">Portfolio</span>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-4">Our Gallery</h1>
          <div className="divider-rose mx-auto"></div>
          <p className="text-white/70 text-lg max-w-xl mx-auto mt-4">Browse our portfolio of transformations and get inspired for your next look.</p>
        </div>
      </section>

      <section className="section-pad bg-ivory">
        <div className="container-custom">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
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

          {/* Masonry grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
            >
              {filtered.map((img, i) => (
                <motion.div
                  key={img.src + i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => openLightbox(i)}
                  className="relative break-inside-avoid overflow-hidden rounded-xl cursor-pointer group mb-4"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-soft-black/0 group-hover:bg-soft-black/40 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <span className="absolute bottom-2 right-2 text-xs text-white px-2.5 py-0.5 rounded-full bg-soft-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.category}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-soft-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full"
            >
              <img
                src={filtered[lightboxIndex]?.src}
                alt={filtered[lightboxIndex]?.alt}
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
              <button onClick={closeLightbox} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors">‹</button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl transition-colors">›</button>
              <p className="text-white/50 text-center text-xs mt-3">{lightboxIndex + 1} / {filtered.length}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
