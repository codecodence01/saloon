import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { ArrowRight, Star, Users, Award, Scissors, Sparkles, Heart, Shield, Clock, ChevronDown } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';
import api from '../utils/api';

const HERO_BG = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=85';

const stats = [
  { icon: Users, value: '500+', label: 'Happy Clients', color: 'text-rose-gold' },
  { icon: Scissors, value: '10+', label: 'Expert Stylists', color: 'text-champagne' },
  { icon: Star, value: '5★', label: 'Rated Salon', color: 'text-rose-gold' },
  { icon: Award, value: '8+', label: 'Years of Excellence', color: 'text-champagne' },
];

const whyUs = [
  { icon: Sparkles, title: 'Premium Products', desc: 'We use only the finest brands — L\'Oréal Professional, Wella, Kerastase — for exceptional results.' },
  { icon: Award, title: 'Expert Team', desc: 'Each stylist is certified, trained internationally, and passionate about their craft.' },
  { icon: Heart, title: 'Personalized Care', desc: 'Every appointment is tailored to you — your face shape, lifestyle, and unique beauty vision.' },
  { icon: Shield, title: 'Hygiene Guaranteed', desc: 'Strict sterilization and sanitization protocols for your safety and comfort.' },
  { icon: Clock, title: 'On-Time Service', desc: 'We respect your time. Book online, arrive on schedule, leave transformed.' },
  { icon: Star, title: 'Satisfaction Promise', desc: 'Not happy? We\'ll make it right — no questions asked. Your joy is our priority.' },
];

const galleryImages = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80',
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
  'https://images.unsplash.com/photo-1560750133-cf09f6b5f1c0?w=400&q=80',
];

function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);
  const numeric = parseInt(value.replace(/\D/g, '')) || 0;

  useEffect(() => {
    if (!numeric) return;
    let start = 0;
    const step = Math.ceil(numeric / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) { setCount(numeric); clearInterval(timer); }
      else setCount(start);
    }, 40);
    return () => clearInterval(timer);
  }, [numeric]);

  if (!numeric) return <span>{value}</span>;
  return <span>{count}{value.replace(/\d/g, '')}</span>;
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 180]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const { data: servicesData } = useQuery({
    queryKey: ['services', 'popular'],
    queryFn: () => api.get('/services?isPopular=true').then(r => r.data.data),
  });

  const { data: testimonialsData } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => api.get('/testimonials').then(r => r.data.data),
  });

  const popularServices = servicesData?.slice(0, 6) || [];
  const testimonials = testimonialsData || [];

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ─────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src={HERO_BG} alt="Glamour Salon" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-soft-black/60 via-soft-black/40 to-soft-black/80" />
        </motion.div>

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="inline-block text-champagne-light text-sm font-semibold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full border border-champagne/40 bg-champagne/10 backdrop-blur-sm">
              ✨ Mumbai's Premier Beauty Destination
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Where Beauty
            <span className="block gradient-text">Becomes Art</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Experience transformative luxury beauty services crafted by award-winning stylists.
            Your most radiant self is just one appointment away.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/booking" className="btn-primary text-base px-8 py-4">
              <Sparkles className="w-5 h-5" />
              Book Your Appointment
            </Link>
            <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white border-2 border-white/40 hover:bg-white/10 transition-all duration-300 text-base">
              Explore Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ── STATS BAR ─────────────────────────── */}
      <section className="bg-soft-black py-10 relative z-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <Icon className={`w-7 h-7 ${color} mx-auto mb-2`} />
                <div className={`font-playfair text-3xl font-bold ${color} mb-1`}>
                  <AnimatedCounter value={value} />
                </div>
                <div className="text-white/60 text-sm">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SERVICES ─────────────────── */}
      <section className="section-pad bg-ivory">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="section-tag">Our Specialties</p>
            <h2 className="section-heading">Featured Services</h2>
            <div className="divider-rose mx-auto"></div>
            <p className="section-sub mx-auto text-center mt-4">
              Discover our most-loved treatments crafted to bring out your absolute best.
            </p>
          </div>

          {popularServices.length > 0 ? (
            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              spaceBetween={24}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              className="pb-12"
            >
              {popularServices.map((service, i) => (
                <SwiperSlide key={service._id}>
                  <ServiceCard service={service} index={i} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="skeleton h-52 w-full"></div>
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-5 w-3/4 rounded"></div>
                    <div className="skeleton h-4 w-full rounded"></div>
                    <div className="skeleton h-10 w-full rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/services" className="btn-secondary">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────── */}
      <section className="section-pad bg-soft-black">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-champagne text-sm font-semibold uppercase tracking-widest mb-3">Our Promise</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white">Why Choose Glamour?</h2>
            <div className="divider-rose mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark p-6 rounded-2xl hover:border-rose-gold/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center mb-4 group-hover:bg-rose-gold/20 transition-colors">
                  <Icon className="w-6 h-6 text-rose-gold" />
                </div>
                <h3 className="font-playfair text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSFORMATION GALLERY ────────────── */}
      <section className="section-pad bg-ivory">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="section-tag">Our Work</p>
            <h2 className="section-heading">Beauty Transformations</h2>
            <div className="divider-rose mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {galleryImages.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative overflow-hidden rounded-2xl aspect-square group cursor-pointer"
              >
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-soft-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-medium">View More</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/gallery" className="btn-secondary">
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────── */}
      <section className="section-pad bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="section-tag">Client Love</p>
            <h2 className="section-heading">What Our Clients Say</h2>
            <div className="divider-rose mx-auto"></div>
          </div>

          {testimonials.length > 0 ? (
            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              spaceBetween={24}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              className="pb-12"
            >
              {testimonials.map((t) => (
                <SwiperSlide key={t._id} className="h-auto">
                  <TestimonialCard testimonial={t} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-center text-warm-gray">No testimonials yet.</p>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"
            alt="CTA"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-soft-black/90 to-soft-black/70" />
        </div>
        <div className="relative container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
              Ready for Your <span className="gradient-text">Transformation?</span>
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
              Book your appointment today and experience the Glamour difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking" className="btn-primary px-9 py-4 text-base">
                <Sparkles className="w-5 h-5" />
                Book Now
              </Link>
              <Link to="/packages" className="btn-gold px-9 py-4 text-base">
                View Packages
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
