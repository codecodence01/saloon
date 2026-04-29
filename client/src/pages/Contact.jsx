import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone is required'),
  preferredTime: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const hours = [
  { day: 'Monday – Friday', time: '10:00 AM – 8:00 PM' },
  { day: 'Saturday', time: '9:00 AM – 8:00 PM' },
  { day: 'Sunday', time: '11:00 AM – 6:00 PM' },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 1000)); // Simulate API
    setSubmitted(true);
    reset();
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-soft-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1560750133-cf09f6b5f1c0?w=1920&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative container-custom text-center">
          <span className="inline-block text-champagne text-sm font-semibold uppercase tracking-widest mb-4">Get in Touch</span>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-4">Contact Us</h1>
          <div className="divider-rose mx-auto"></div>
          <p className="text-white/70 text-lg max-w-xl mx-auto mt-4">Have questions? We'd love to hear from you. Send us a message and we'll respond promptly.</p>
        </div>
      </section>

      <section className="section-pad bg-ivory">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-5">
              {/* Info cards */}
              {[
                { icon: MapPin, title: 'Visit Us', content: '123 Rose Garden Avenue\nBandra West, Mumbai 400050', color: 'bg-rose-gold/10 text-rose-gold' },
                { icon: Phone, title: 'Call Us', content: '+91 98765 43210\n+91 87654 32109', color: 'bg-champagne/10 text-champagne-light', href: 'tel:+919876543210' },
                { icon: Mail, title: 'Email Us', content: 'hello@glamoursalon.com\nbookings@glamoursalon.com', color: 'bg-rose-gold/10 text-rose-gold', href: 'mailto:hello@glamoursalon.com' },
              ].map(({ icon: Icon, title, content, color, href }) => (
                <div key={title} className="glass-card p-5 flex gap-4">
                  <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-soft-black mb-1">{title}</h3>
                    <p className="text-warm-gray text-sm whitespace-pre-line">{content}</p>
                  </div>
                </div>
              ))}

              {/* Business hours */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-rose-gold/10 text-rose-gold flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-soft-black">Business Hours</h3>
                </div>
                <div className="space-y-2">
                  {hours.map(h => (
                    <div key={h.day} className="flex justify-between text-sm">
                      <span className="text-warm-gray">{h.day}</span>
                      <span className="font-medium text-soft-black">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="font-playfair text-2xl font-bold text-soft-black mb-6">Send Us a Message</h2>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-playfair text-xl font-bold text-soft-black mb-2">Message Sent!</h3>
                    <p className="text-warm-gray">We'll get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="btn-secondary mt-6">Send Another</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-1.5 block">Full Name *</label>
                        <input {...register('name')} className="input-field" placeholder="Your name" />
                        {errors.name && <p className="text-rose-gold text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-1.5 block">Email Address *</label>
                        <input {...register('email')} type="email" className="input-field" placeholder="your@email.com" />
                        {errors.email && <p className="text-rose-gold text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-1.5 block">Phone Number *</label>
                        <input {...register('phone')} className="input-field" placeholder="+91 98765 43210" />
                        {errors.phone && <p className="text-rose-gold text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-charcoal mb-1.5 block">Preferred Contact Time</label>
                        <select {...register('preferredTime')} className="input-field">
                          <option value="">Any time</option>
                          <option>Morning (10AM–12PM)</option>
                          <option>Afternoon (12PM–4PM)</option>
                          <option>Evening (4PM–8PM)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-charcoal mb-1.5 block">Your Message *</label>
                      <textarea {...register('message')} rows={5} className="input-field resize-none"
                        placeholder="Tell us how we can help you..."></textarea>
                      {errors.message && <p className="text-rose-gold text-xs mt-1">{errors.message.message}</p>}
                    </div>
                    <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Map embed */}
          <div className="mt-12 rounded-2xl overflow-hidden shadow-md">
            <iframe
              title="Glamour Salon Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.1624082597574!2d72.82777867592494!3d19.065890450924286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c947f3e55a11%3A0x456a0b6474cb3da3!2sBandra%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1703000000000!5m2!1sen!2sin"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
