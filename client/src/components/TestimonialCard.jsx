import { Star } from 'lucide-react';

export default function TestimonialCard({ testimonial }) {
  const { guestName, comment, rating, serviceName, userId } = testimonial;
  const displayName = userId?.name || guestName || 'Anonymous';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-champagne fill-champagne' : 'text-gray-200 fill-gray-200'}`}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-charcoal text-sm leading-relaxed flex-1 mb-5 italic">
        "{comment}"
      </p>

      {/* Service tag */}
      {serviceName && (
        <div className="mb-4">
          <span className="text-xs px-3 py-1 rounded-full bg-rose-gold/10 text-rose-gold font-medium">
            {serviceName}
          </span>
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="w-10 h-10 rounded-full bg-gradient-rose flex items-center justify-center text-white text-sm font-bold shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-soft-black text-sm">{displayName}</p>
          <p className="text-warm-gray text-xs">Verified Client</p>
        </div>
      </div>
    </div>
  );
}
