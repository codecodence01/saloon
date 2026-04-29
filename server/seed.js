require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/db');
const User = require('./models/User');
const Service = require('./models/Service');
const Package = require('./models/Package');
const Stylist = require('./models/Stylist');
const Testimonial = require('./models/Testimonial');

const AVATAR_BASE = 'https://api.dicebear.com/7.x/avataaars/svg?seed=';
const UNSPLASH_HAIR = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80';
const UNSPLASH_SPA = 'https://images.unsplash.com/photo-1560750133-cf09f6b5f1c0?w=600&q=80';
const UNSPLASH_MAKEUP = 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80';
const UNSPLASH_NAILS = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80';
const UNSPLASH_BRIDAL = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80';
const UNSPLASH_SKIN = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80';

const services = [
  { name: 'Signature Haircut & Style', category: 'Hair', description: 'Precision cut tailored to your face shape with professional blow-dry and styling.', duration: 60, price: 1200, image: UNSPLASH_HAIR, isPopular: true, isNew: false },
  { name: 'Balayage & Highlights', category: 'Hair', description: 'Hand-painted highlights for a sun-kissed, natural gradient effect.', duration: 180, price: 4500, image: UNSPLASH_HAIR, isPopular: true, isNew: false },
  { name: 'Deep Conditioning Treatment', category: 'Hair', description: 'Intensive moisture repair treatment to restore shine and softness.', duration: 45, price: 800, image: UNSPLASH_HAIR, isPopular: false, isNew: true },
  { name: 'Gold Facial', category: 'Skin', description: '24K gold-infused facial to brighten, firm, and rejuvenate your skin.', duration: 75, price: 2200, image: UNSPLASH_SKIN, isPopular: true, isNew: false },
  { name: 'Hydra-Dermabrasion', category: 'Skin', description: 'Non-invasive skin resurfacing to exfoliate, cleanse, and hydrate deeply.', duration: 60, price: 3000, image: UNSPLASH_SKIN, isPopular: false, isNew: true },
  { name: 'Party Glam Makeup', category: 'Makeup', description: 'Full glam makeup with airbrush finish, lashes, and long-lasting setting spray.', duration: 90, price: 2500, image: UNSPLASH_MAKEUP, isPopular: true, isNew: false },
  { name: 'Bridal Makeup', category: 'Bridal', description: 'HD bridal makeup with trial session, skin prep, and full-day wear guarantee.', duration: 180, price: 8000, image: UNSPLASH_BRIDAL, isPopular: false, isNew: false },
  { name: 'Luxury Gel Manicure', category: 'Nails', description: 'Gel polish manicure with cuticle care, hand massage, and nourishing treatment.', duration: 60, price: 900, image: UNSPLASH_NAILS, isPopular: true, isNew: false },
  { name: 'Aromatherapy Body Massage', category: 'Spa', description: 'Full body Swedish massage using essential oils for deep relaxation and stress relief.', duration: 90, price: 2800, image: UNSPLASH_SPA, isPopular: false, isNew: false },
  { name: 'Express Facial', category: 'Skin', description: 'Quick 30-minute glow facial with cleansing, toning, and vitamin C serum.', duration: 30, price: 750, image: UNSPLASH_SKIN, isPopular: false, isNew: true },
];

const packages = [
  {
    title: 'Glow Starter',
    tier: 'Basic',
    description: 'Perfect for a quick refresh — the essentials of beauty care.',
    includedServices: ['Express Facial', 'Signature Haircut & Style', 'Luxury Gel Manicure'],
    originalPrice: 2850,
    discountedPrice: 1999,
    badge: 'Best Value',
    duration: 150,
  },
  {
    title: 'Premium Glow',
    tier: 'Premium',
    description: 'Elevate your look with our most popular combination of services.',
    includedServices: ['Gold Facial', 'Balayage & Highlights', 'Party Glam Makeup', 'Luxury Gel Manicure'],
    originalPrice: 10100,
    discountedPrice: 6999,
    badge: 'Most Popular',
    duration: 390,
  },
  {
    title: 'Royal Bridal',
    tier: 'Bridal',
    description: 'Complete bridal transformation — from hair to toes — on your special day.',
    includedServices: ['Bridal Makeup', 'Balayage & Highlights', 'Hydra-Dermabrasion', 'Luxury Gel Manicure', 'Aromatherapy Body Massage'],
    originalPrice: 19200,
    discountedPrice: 13999,
    badge: 'Exclusive',
    duration: 570,
  },
  {
    title: 'Party Queen',
    tier: 'Party Makeover',
    description: 'Show-stopping party look curated for events, occasions, and celebrations.',
    includedServices: ['Party Glam Makeup', 'Deep Conditioning Treatment', 'Luxury Gel Manicure'],
    originalPrice: 4200,
    discountedPrice: 2999,
    badge: 'Limited Time',
    duration: 240,
  },
];

const stylists = [
  {
    name: 'Priya Sharma',
    role: 'Senior Hair Stylist & Colorist',
    specializations: ['Balayage', 'Color Correction', 'Bridal Hair', 'Keratin Treatments'],
    experience: 8,
    bio: 'Priya brings 8 years of award-winning expertise in hair artistry. Trained in Paris and Mumbai, she specializes in transformational color work and bridal styling.',
    image: `${AVATAR_BASE}Priya`,
    socialLinks: { instagram: 'https://instagram.com', facebook: '', linkedin: '' },
    availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false },
  },
  {
    name: 'Anjali Mehta',
    role: 'Makeup Artist & Beauty Consultant',
    specializations: ['Bridal Makeup', 'Airbrush Technique', 'Editorial Looks', 'Skin Prep'],
    experience: 6,
    bio: 'Anjali is a certified makeup artist with a flair for creating flawless, long-lasting looks. Her expertise spans bridal, editorial, and bold party glam.',
    image: `${AVATAR_BASE}Anjali`,
    socialLinks: { instagram: 'https://instagram.com', facebook: '', linkedin: '' },
    availability: { monday: false, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true },
  },
  {
    name: 'Ritu Kapoor',
    role: 'Skin Care Specialist & Esthetician',
    specializations: ['Chemical Peels', 'Anti-Aging Treatments', 'Acne Care', 'Gold Facials'],
    experience: 10,
    bio: 'With a decade of experience, Ritu is renowned for her transformative skincare regimens. She holds certifications from leading dermatology institutes.',
    image: `${AVATAR_BASE}Ritu`,
    socialLinks: { instagram: 'https://instagram.com', facebook: '', linkedin: '' },
    availability: { monday: true, tuesday: true, wednesday: false, thursday: true, friday: true, saturday: true, sunday: false },
  },
  {
    name: 'Meera Nair',
    role: 'Nail Technician & Nail Artist',
    specializations: ['Gel Nails', 'Nail Art', 'Acrylic Extensions', 'Nail Repair'],
    experience: 5,
    bio: 'Meera creates tiny works of art on every nail. Trained in intricate nail art techniques, she transforms every manicure into a personalized masterpiece.',
    image: `${AVATAR_BASE}Meera`,
    socialLinks: { instagram: 'https://instagram.com', facebook: '', linkedin: '' },
    availability: { monday: true, tuesday: true, wednesday: true, thursday: false, friday: true, saturday: true, sunday: false },
  },
  {
    name: 'Kavita Singh',
    role: 'Spa Therapist & Wellness Expert',
    specializations: ['Aromatherapy', 'Deep Tissue Massage', 'Hot Stone Therapy', 'Reflexology'],
    experience: 7,
    bio: 'Kavita is a holistic wellness practitioner who believes beauty begins from within. Her signature massage techniques melt away stress and restore balance.',
    image: `${AVATAR_BASE}Kavita`,
    socialLinks: { instagram: 'https://instagram.com', facebook: '', linkedin: '' },
    availability: { monday: true, tuesday: false, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true },
  },
];

const testimonialData = [
  { guestName: 'Sarah J.', rating: 5, comment: 'Absolutely blown away! Priya transformed my hair — the balayage is stunning. I get compliments everywhere I go. This is the only salon I\'ll ever trust.', serviceName: 'Balayage & Highlights', isApproved: true },
  { guestName: 'Nisha Patel', rating: 5, comment: 'Anjali did my bridal makeup and I felt like a queen. She understood exactly what I wanted and delivered beyond my expectations. Tears of joy!', serviceName: 'Bridal Makeup', isApproved: true },
  { guestName: 'Rohan M.', rating: 4, comment: 'Booked the aromatherapy massage for my wife\'s birthday — she loved it! Professional staff, serene ambiance, and real results. Will definitely return.', serviceName: 'Aromatherapy Body Massage', isApproved: true },
  { guestName: 'Deepa Krishnan', rating: 5, comment: 'Ritu\'s gold facial gave me a natural glow I haven\'t had in years. The attention to detail and the relaxing experience are unmatched in the city.', serviceName: 'Gold Facial', isApproved: true },
  { guestName: 'Preethi Arun', rating: 5, comment: 'Meera\'s nail art is legit art. She created a custom floral design that lasted over 3 weeks. The gel manicure quality is exceptional.', serviceName: 'Luxury Gel Manicure', isApproved: true },
  { guestName: 'Tanvi Shah', rating: 5, comment: 'I walked in stressed and walked out feeling like a completely transformed woman. The Premium Glow package is absolutely worth every rupee!', serviceName: 'Premium Glow', isApproved: true },
  { guestName: 'Riya Menon', rating: 4, comment: 'The party makeup Anjali did for my sister\'s wedding reception lasted all night through dancing, humidity, and happy tears. Incredible staying power!', serviceName: 'Party Glam Makeup', isApproved: true },
  { guestName: 'Swati Gupta', rating: 5, comment: 'Glamour Salon has raised the bar for luxury beauty experiences in the city. The ambiance, the team, the results — all 10/10. My go-to forever!', serviceName: 'Signature Haircut & Style', isApproved: true },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seed...\n');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Package.deleteMany({});
    await Stylist.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user via insertMany to bypass pre-save hook (avoids double-hashing)
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const admins = await User.insertMany([{
      name: 'Glamour Admin',
      email: process.env.ADMIN_EMAIL || 'admin@glamoursalon.com',
      phone: '+91 98765 43210',
      passwordHash: hashedPassword,
      role: 'admin',
    }]);
    const admin = admins[0];
    console.log(`✅ Admin user created: ${admin.email}`);

    // Seed services
    const createdServices = await Service.insertMany(services);
    console.log(`✅ ${createdServices.length} services seeded`);

    // Seed packages
    const createdPackages = await Package.insertMany(packages);
    console.log(`✅ ${createdPackages.length} packages seeded`);

    // Seed stylists
    const createdStylists = await Stylist.insertMany(stylists);
    console.log(`✅ ${createdStylists.length} stylists seeded`);

    // Seed testimonials
    const createdTestimonials = await Testimonial.insertMany(testimonialData);
    console.log(`✅ ${createdTestimonials.length} testimonials seeded`);

    console.log('\n🎉 Seed completed successfully!');
    console.log(`\n📋 Admin credentials:`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
