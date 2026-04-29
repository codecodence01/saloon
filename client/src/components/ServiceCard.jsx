import { motion } from 'framer-motion';
import { Clock, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, formatDuration } from '../utils/helpers';

export default function ServiceCard({ service, index = 0 }) {
  const { name, category, description, duration, price, image, isPopular, isNew } = service;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-luxury transition-all duration-400 group"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Category tag */}
        <span className="absolute bottom-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
          {category}
        </span>

        {/* Badges */}
        {isPopular && <span className="badge-popular">⭐ Popular</span>}
        {isNew && <span className="badge-new">✨ New</span>}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-playfair text-lg font-bold text-soft-black mb-2 group-hover:text-rose-gold transition-colors">
          {name}
        </h3>
        <p className="text-warm-gray text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-warm-gray text-sm">
            <Clock className="w-4 h-4 text-rose-gold" />
            <span>{formatDuration(duration)}</span>
          </div>
          <span className="font-playfair text-xl font-bold text-rose-gold">{formatPrice(price)}</span>
        </div>

        <Link
          to={`/booking?service=${service._id}`}
          className="btn-primary w-full text-sm py-2.5 group/btn"
        >
          Book Now
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
