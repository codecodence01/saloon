import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Award, Heart, Users, Star, Instagram, Facebook } from 'lucide-react';
import StylistCard from '../components/StylistCard';
import api from '../utils/api';

const story = [
  { year: '2015', title: 'The Beginning', desc: 'Glamour Salon was founded in Bandra West with a vision to bring luxury beauty experiences to every woman in Mumbai.' },
  { year: '2017', title: 'Award Winning', desc: 'We won our first "Best Salon in Mumbai" award from Femina Magazine, recognizing our exceptional service quality.' },
  { year: '2019', title: 'Team Expansion', desc: 'Expanded our expert team to 10+ certified stylists, bringing international training and diverse specializations.' },
  { year: '2024', title: 'Digital First', desc: 'Launched our online booking platform to make premium beauty more accessible than ever.' },
];

const awards = [
  { icon: '🏆', title: 'Best Salon Mumbai 2023', org: 'Femina Beauty Awards' },
  { icon: '⭐', title: 'Top Rated Salon', org: 'Google Maps · 4.9★' },
  { icon: '💄', title: 'Excellence in Bridal', org: 'WeddingWire India 2022' },
  { icon: '🌿', title: 'Eco-Conscious Brand', org: 'Green Beauty Certified' },
];

export default function About() {
  const { data: stylists = [] } = useQuery({
    queryKey: ['stylists'],
    queryFn: () => api.get('/stylists').then(r => r.data.data),
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-soft-black">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative container-custom text-center">
          <span className="inline-block text-champagne text-sm font-semibold uppercase tracking-widest mb-4">Our Story</span>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-4">About Glamour Salon</h1>
          <div className="divider-rose mx-auto"></div>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
            Born from a passion for beauty and a commitment to excellence, Glamour Salon has been
            transforming lives and boosting confidence since 2015.
          </p>
        </div>
      </section>

      {/* Story / Mission */}
      <section className="section-pad bg-ivory">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="section-tag">Who We Are</p>
              <h2 className="section-heading mb-5">A Legacy of Beauty & Excellence</h2>
              <p className="text-warm-gray leading-relaxed mb-4">
                Glamour Salon was founded in 2015 with a singular vision — to create a sanctuary
                where every woman could experience the luxury and transformation she deserves.
                What began as a boutique studio in Bandra has grown into Mumbai's most trusted
                salon brand.
              </p>
              <p className="text-warm-gray leading-relaxed mb-6">
                Our philosophy is simple: beauty is not about covering up — it's about revealing
                your best self. Every service, every treatment, every client interaction is guided
                by this belief.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[['500+', 'Happy Clients'], ['10+', 'Expert Stylists'], ['8+', 'Years Experience']].map(([num, label]) => (
                  <div key={label} className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="font-playfair text-2xl font-bold gradient-text">{num}</div>
                    <div className="text-warm-gray text-xs mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80" alt="Salon interior" className="rounded-2xl object-cover h-48 w-full" />
                <img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80" alt="Makeup" className="rounded-2xl object-cover h-48 w-full mt-6" />
                <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80" alt="Skin care" className="rounded-2xl object-cover h-48 w-full -mt-6" />
                <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80" alt="Hair" className="rounded-2xl object-cover h-48 w-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="section-tag">Our Journey</p>
            <h2 className="section-heading">Milestones That Matter</h2>
            <div className="divider-rose mx-auto"></div>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-rose-gold/20 hidden md:block"></div>
            <div className="space-y-10">
              {story.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex flex-col md:flex-row gap-6 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                >
                  <div className="md:w-1/2 flex md:justify-end">
                    <div className={`glass-card p-6 max-w-sm ${i % 2 !== 0 ? 'md:ml-10' : 'md:mr-10'}`}>
                      <div className="text-champagne font-playfair text-xl font-bold mb-1">{item.year}</div>
                      <h3 className="font-playfair text-lg font-semibold text-soft-black mb-2">{item.title}</h3>
                      <p className="text-warm-gray text-sm">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-gold border-4 border-white shadow-md top-6"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-pad bg-ivory">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="section-tag">Expert Team</p>
            <h2 className="section-heading">Meet Our Artists</h2>
            <div className="divider-rose mx-auto"></div>
            <p className="section-sub mx-auto text-center mt-4">Our certified professionals bring artistry, expertise, and warmth to every appointment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {stylists.map((stylist, i) => <StylistCard key={stylist._id} stylist={stylist} index={i} />)}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="section-pad bg-soft-black">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-champagne text-sm font-semibold uppercase tracking-widest mb-3">Recognition</p>
            <h2 className="font-playfair text-4xl font-bold text-white">Awards & Recognition</h2>
            <div className="divider-rose mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {awards.map((award, i) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark p-6 rounded-2xl text-center hover:border-champagne/30 transition-all"
              >
                <div className="text-4xl mb-3">{award.icon}</div>
                <h3 className="font-playfair text-base font-bold text-white mb-1">{award.title}</h3>
                <p className="text-white/50 text-xs">{award.org}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
