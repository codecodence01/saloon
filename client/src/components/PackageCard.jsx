import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, discountPercent } from '../utils/helpers';

const tierColors = {
  Basic: 'from-gray-400 to-gray-600',
  Premium: 'from-rose-gold to-rose-gold-dark',
  Bridal: 'from-champagne to-champagne-light',
  'Party Makeover': 'from-purple-500 to-pink-500',
  'Complete Beauty': 'from-soft-black to-charcoal',
};

export default function PackageCard({ pkg, index = 0, featured = false }) {
  const { title, tier, description, includedServices, originalPrice, discountedPrice, badge } = pkg;
  const saving = discountPercent(originalPrice, discountedPrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-2xl overflow-hidden ${featured ? 'gradient-border-card scale-105 z-10' : 'bg-white border border-gray-100'} shadow-lg hover:shadow-luxury transition-all duration-400`}
    >
      {/* Ribbon badge */}
      {badge && (
        <div className={`absolute top-4 right-0 bg-gradient-to-r ${tierColors[tier] || tierColors.Premium} text-white text-xs font-bold py-1 px-4 rounded-l-full`}>
          {badge}
        </div>
      )}

      <div className="p-7">
        {/* Tier label */}
        <div className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 bg-gradient-to-r ${tierColors[tier] || tierColors.Premium} text-white`}>
          {tier}
        </div>

        <h3 className="font-playfair text-2xl font-bold text-soft-black mb-2">{title}</h3>
        {description && <p className="text-warm-gray text-sm mb-5">{description}</p>}

        {/* Pricing */}
        <div className="mb-5">
          <div className="flex items-baseline gap-3">
            <span className="font-playfair text-3xl font-bold text-rose-gold">{formatPrice(discountedPrice)}</span>
            <span className="text-warm-gray line-through text-sm">{formatPrice(originalPrice)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-rose-gold/10 text-rose-gold text-xs font-bold px-2 py-0.5 rounded-full">
              Save {saving}%
            </span>
            <span className="text-warm-gray text-xs">per session</span>
          </div>
        </div>

        {/* Included services */}
        <ul className="space-y-2 mb-6">
          {includedServices.map((s, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-charcoal">
              <div className="w-5 h-5 rounded-full bg-rose-gold/10 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-rose-gold" />
              </div>
              {s}
            </li>
          ))}
        </ul>

        <Link
          to={`/booking?package=${pkg._id}`}
          className={`${featured ? 'btn-primary' : 'btn-secondary'} w-full text-sm py-3`}
        >
          <Sparkles className="w-4 h-4" />
          Book This Package
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
