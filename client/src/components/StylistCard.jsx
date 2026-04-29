import { motion } from 'framer-motion';
import { Instagram, Briefcase } from 'lucide-react';

export default function StylistCard({ stylist, index = 0 }) {
  const { name, role, specializations, experience, bio, image, socialLinks } = stylist;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-luxury transition-all duration-400"
    >
      {/* Photo */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-rose-gold/10 to-champagne/10">
        <img
          src={image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-soft-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
          <p className="text-white text-sm leading-relaxed line-clamp-3">{bio}</p>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-playfair text-xl font-bold text-soft-black">{name}</h3>
        <p className="text-rose-gold text-sm font-medium mt-0.5 mb-3">{role}</p>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {specializations?.slice(0, 3).map((spec, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-ivory border border-rose-gold/20 text-warm-gray">
              {spec}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-warm-gray text-sm">
            <Briefcase className="w-3.5 h-3.5 text-champagne" />
            <span>{experience}+ yrs experience</span>
          </div>
          {socialLinks?.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-rose-gold/10 hover:bg-rose-gold flex items-center justify-center transition-colors group/ig"
            >
              <Instagram className="w-3.5 h-3.5 text-rose-gold group-hover/ig:text-white transition-colors" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
