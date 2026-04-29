import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Scissors, Package, User, CalendarDays, CheckCircle,
  ArrowRight, ArrowLeft, Clock, Sparkles, Check, Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatPrice, formatDuration, formatDate } from '../utils/helpers';

const steps = [
  { id: 1, label: 'Service', icon: Scissors },
  { id: 2, label: 'Stylist', icon: User },
  { id: 3, label: 'Date & Time', icon: CalendarDays },
  { id: 4, label: 'Details', icon: User },
  { id: 5, label: 'Confirm', icon: CheckCircle },
];

const detailsSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone is required'),
  notes: z.string().optional(),
});

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingResult, setBookingResult] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(detailsSchema),
    defaultValues: { name: '', email: '', phone: '', notes: '' },
  });

  // Populate form when user is authenticated
  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
    }
  }, [user, setValue]);

  // Pre-select from URL params
  const serviceParam = searchParams.get('service');
  const packageParam = searchParams.get('package');

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(r => r.data.data),
  });

  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: () => api.get('/packages').then(r => r.data.data),
  });

  const { data: stylists = [] } = useQuery({
    queryKey: ['stylists'],
    queryFn: () => api.get('/stylists').then(r => r.data.data),
  });

  const { data: availabilityData, isLoading: slotsLoading } = useQuery({
    queryKey: ['availability', selectedStylist?._id, selectedDate],
    queryFn: () => api.get('/bookings/availability', {
      params: { date: selectedDate?.toISOString(), stylistId: selectedStylist._id }
    }).then(r => r.data),
    enabled: !!selectedStylist && !!selectedDate,
  });

  const availableSlots = availabilityData?.available || [];

  useEffect(() => {
    if (serviceParam && services.length) {
      const s = services.find(x => x._id === serviceParam);
      if (s) { setSelectedService(s); setStep(2); }
    }
    if (packageParam && packages.length) {
      const p = packages.find(x => x._id === packageParam);
      if (p) { setSelectedPackage(p); setStep(2); }
    }
  }, [serviceParam, packageParam, services, packages]);

  const bookingMutation = useMutation({
    mutationFn: (data) => api.post('/bookings', data).then(r => r.data),
    onSuccess: (data) => {
      setBookingResult(data.data);
      setStep(5);
      toast.success('Booking confirmed! Check your email for details.');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    },
  });

  const handleDetailsSubmit = (formData) => {
    const body = {
      stylistId: selectedStylist._id,
      date: selectedDate,
      timeSlot: selectedSlot,
      notes: formData.notes,
    };
    if (selectedService) body.serviceId = selectedService._id;
    if (selectedPackage) body.packageId = selectedPackage._id;
    if (!isAuthenticated) {
      body.guestName = formData.name;
      body.guestEmail = formData.email;
      body.guestPhone = formData.phone;
    }
    bookingMutation.mutate(body);
  };

  const totalAmount = selectedService?.price || selectedPackage?.discountedPrice || 0;
  const selectedItem = selectedService || selectedPackage;

  const progress = ((step - 1) / 4) * 100;

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-16">
      {/* Hero */}
      <div className="bg-soft-black py-14 px-4 text-center mb-0">
        <h1 className="font-playfair text-4xl font-bold text-white mb-2">Book Your Appointment</h1>
        <p className="text-white/60 text-sm">Complete your booking in just a few simple steps</p>
      </div>

      {/* Progress bar */}
      <div className="bg-white shadow-sm sticky top-[72px] z-40">
        <div className="container-custom">
          {/* Step indicators */}
          <div className="flex items-center justify-between py-4 overflow-x-auto gap-2">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isDone = step > s.id;
              return (
                <div key={s.id} className="flex items-center gap-2 shrink-0">
                  <div className={`flex items-center gap-2 transition-all ${isActive ? 'text-rose-gold' : isDone ? 'text-green-500' : 'text-gray-300'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'border-rose-gold bg-rose-gold text-white' : isDone ? 'border-green-500 bg-green-500 text-white' : 'border-gray-200 bg-white text-gray-300'}`}>
                      {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-rose-gold' : isDone ? 'text-green-500' : 'text-gray-400'}`}>{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 transition-all ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
          {/* Progress fill */}
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-gradient-rose rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="container-custom py-10 max-w-4xl">
        <AnimatePresence mode="wait">
          {/* STEP 1: Service/Package */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-playfair text-2xl font-bold text-soft-black mb-2">Choose Your Service or Package</h2>
              <p className="text-warm-gray text-sm mb-6">Select what you'd like to book today</p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-warm-gray uppercase tracking-wider mb-3">Individual Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.map(s => (
                    <div
                      key={s._id}
                      onClick={() => { setSelectedService(s); setSelectedPackage(null); }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedService?._id === s._id ? 'border-rose-gold bg-rose-gold/5' : 'border-gray-200 bg-white hover:border-rose-gold/50'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-soft-black text-sm">{s.name}</h4>
                          <span className="text-xs text-warm-gray">{s.category} · {formatDuration(s.duration)}</span>
                        </div>
                        <span className="font-bold text-rose-gold">{formatPrice(s.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-semibold text-warm-gray uppercase tracking-wider mb-3">Packages (Save More)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {packages.map(p => (
                    <div
                      key={p._id}
                      onClick={() => { setSelectedPackage(p); setSelectedService(null); }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedPackage?._id === p._id ? 'border-rose-gold bg-rose-gold/5' : 'border-gray-200 bg-white hover:border-rose-gold/50'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-soft-black text-sm">{p.title}</h4>
                          <span className="text-xs text-warm-gray">{p.tier} · {p.includedServices.length} services</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-rose-gold">{formatPrice(p.discountedPrice)}</span>
                          <div className="text-xs text-warm-gray line-through">{formatPrice(p.originalPrice)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!selectedService && !selectedPackage}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Stylist */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-playfair text-2xl font-bold text-soft-black mb-2">Choose Your Stylist</h2>
              <p className="text-warm-gray text-sm mb-6">Meet our expert team</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {stylists.map(stylist => (
                  <div
                    key={stylist._id}
                    onClick={() => setSelectedStylist(stylist)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 bg-white ${selectedStylist?._id === stylist._id ? 'border-rose-gold bg-rose-gold/5' : 'border-gray-200 hover:border-rose-gold/50'}`}
                  >
                    <img
                      src={stylist.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${stylist.name}`}
                      alt={stylist.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-soft-black">{stylist.name}</h4>
                      <p className="text-rose-gold text-xs font-medium">{stylist.role}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {stylist.specializations?.slice(0, 2).map((spec, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-ivory border border-rose-gold/20 text-warm-gray">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedStylist?._id === stylist._id && (
                      <div className="w-6 h-6 rounded-full bg-rose-gold flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(3)} disabled={!selectedStylist} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Date & Time */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-playfair text-2xl font-bold text-soft-black mb-2">Pick Date & Time</h2>
              <p className="text-warm-gray text-sm mb-6">Choose a convenient slot</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calendar */}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(day) => { setSelectedDate(day); setSelectedSlot(''); }}
                    disabled={{ before: new Date() }}
                    className="!font-sans"
                  />
                </div>

                {/* Time slots */}
                <div>
                  {!selectedDate ? (
                    <div className="flex items-center justify-center h-full text-warm-gray text-sm">
                      Select a date to see available slots
                    </div>
                  ) : slotsLoading ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[...Array(9)].map((_, i) => <div key={i} className="skeleton h-10 rounded-lg"></div>)}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-warm-gray mb-3">
                        {formatDate(selectedDate)} — <span className="text-rose-gold font-medium">{availableSlots.length} slots available</span>
                      </p>
                      {availableSlots.length === 0 ? (
                        <div className="text-center py-8 text-warm-gray text-sm">
                          No slots available on this date. Please try another day.
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.map(slot => (
                            <button
                              key={slot}
                              onClick={() => setSelectedSlot(slot)}
                              className={`px-2 py-2.5 rounded-lg text-xs font-medium transition-all ${
                                selectedSlot === slot
                                  ? 'bg-rose-gold text-white shadow-md'
                                  : 'bg-ivory border border-gray-200 text-charcoal hover:border-rose-gold'
                              }`}
                            >
                              <Clock className="w-3 h-3 mx-auto mb-0.5" />
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(2)} className="btn-secondary">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(4)} disabled={!selectedDate || !selectedSlot} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Personal Details */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-playfair text-2xl font-bold text-soft-black mb-2">Your Details</h2>
              <p className="text-warm-gray text-sm mb-6">Almost there! Just a few details.</p>

              {!isAuthenticated && (
                <div className="bg-champagne/10 border border-champagne/30 rounded-xl p-4 mb-6 text-sm text-charcoal">
                  💡 <Link to="/login" className="text-rose-gold font-medium hover:underline">Log in</Link> to auto-fill your details and track bookings in your account.
                </div>
              )}

              <form onSubmit={handleSubmit(handleDetailsSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-charcoal mb-1.5 block">Full Name *</label>
                    <input {...register('name')} className="input-field" placeholder="Your full name"
                      readOnly={isAuthenticated} />
                    {errors.name && <p className="text-rose-gold text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal mb-1.5 block">Email Address *</label>
                    <input {...register('email')} type="email" className="input-field" placeholder="your@email.com"
                      readOnly={isAuthenticated} />
                    {errors.email && <p className="text-rose-gold text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal mb-1.5 block">Phone Number *</label>
                    <input {...register('phone')} className="input-field" placeholder="+91 98765 43210" />
                    {errors.phone && <p className="text-rose-gold text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal mb-1.5 block">Special Notes (optional)</label>
                    <textarea {...register('notes')} className="input-field resize-none" rows={3} placeholder="Any preferences or requirements..." />
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="glass-card p-5 mt-2">
                  <h3 className="font-semibold text-soft-black mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-champagne" /> Booking Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-warm-gray">Service</span>
                      <span className="font-medium text-soft-black">{selectedItem?.name || selectedItem?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-gray">Stylist</span>
                      <span className="font-medium text-soft-black">{selectedStylist?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-gray">Date</span>
                      <span className="font-medium text-soft-black">{selectedDate ? formatDate(selectedDate) : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-gray">Time</span>
                      <span className="font-medium text-soft-black">{selectedSlot}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span className="font-semibold text-soft-black">Total Amount</span>
                      <span className="font-bold text-rose-gold text-lg">{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(3)} className="btn-secondary">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="submit" className="btn-primary" disabled={bookingMutation.isPending}>
                    {bookingMutation.isPending ? 'Confirming...' : <>Confirm Booking <CheckCircle className="w-4 h-4" /></>}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 5: Confirmation */}
          {step === 5 && bookingResult && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-green-500/10 border-4 border-green-400 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>

              <h2 className="font-playfair text-3xl font-bold text-soft-black mb-2">Booking Confirmed!</h2>
              <p className="text-warm-gray mb-8">A confirmation has been sent to your email. We look forward to seeing you!</p>

              <div className="glass-card p-6 max-w-md mx-auto text-left mb-8">
                <h3 className="font-semibold text-soft-black mb-4 text-center">Appointment Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Service</span>
                    <span className="font-medium">{selectedItem?.name || selectedItem?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Stylist</span>
                    <span className="font-medium">{selectedStylist?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Date</span>
                    <span className="font-medium">{formatDate(bookingResult.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Time</span>
                    <span className="font-medium">{bookingResult.timeSlot}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="font-bold">Amount</span>
                    <span className="font-bold text-rose-gold">{formatPrice(bookingResult.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Status</span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-0.5 rounded-full">Pending Confirmation</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="btn-secondary" onClick={() => window.print()}>
                  <Download className="w-4 h-4" /> Download
                </button>
                <button className="btn-primary" onClick={() => navigate('/')}>
                  Back to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
