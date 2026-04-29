import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ name, email, phone, password }) => {
    try {
      await registerUser(name, email, phone, password);
      toast.success('Account created! Welcome to Glamour Salon 💄');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85" alt="Bridal" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-soft-black/80 to-soft-black/40 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-2 mb-16">
            <Sparkles className="w-6 h-6 text-champagne" />
            <span className="font-playfair text-2xl font-bold text-white">Glamour Salon</span>
          </Link>
          <h2 className="font-playfair text-4xl font-bold text-white mb-4">
            Start Your<br /><span className="gradient-text">Beauty Journey</span>
          </h2>
          <p className="text-white/70 max-w-sm">
            Join 500+ happy clients who trust Glamour Salon for all their beauty needs. Sign up and book your first appointment today!
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-ivory">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-1.5 text-warm-gray text-sm mb-8 hover:text-rose-gold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <h1 className="font-playfair text-3xl font-bold text-soft-black mb-2">Create Account</h1>
          <p className="text-warm-gray text-sm mb-8">Join our beauty community today</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-charcoal mb-1.5 block">Full Name</label>
              <input {...register('name')} className="input-field" placeholder="Your full name" />
              {errors.name && <p className="text-rose-gold text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-charcoal mb-1.5 block">Email Address</label>
              <input {...register('email')} type="email" className="input-field" placeholder="your@email.com" />
              {errors.email && <p className="text-rose-gold text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-charcoal mb-1.5 block">Phone Number</label>
              <input {...register('phone')} className="input-field" placeholder="+91 98765 43210" />
              {errors.phone && <p className="text-rose-gold text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-charcoal mb-1.5 block">Password</label>
              <div className="relative">
                <input {...register('password')} type={showPass ? 'text' : 'password'} className="input-field pr-11" placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-gold text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-charcoal mb-1.5 block">Confirm Password</label>
              <input {...register('confirmPassword')} type="password" className="input-field" placeholder="Repeat your password" />
              {errors.confirmPassword && <p className="text-rose-gold text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" className="btn-primary w-full py-3.5" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-warm-gray text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-rose-gold font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
