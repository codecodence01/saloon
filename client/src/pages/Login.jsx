import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async ({ email, password }) => {
    try {
      const user = await login(email, password, isAdmin);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : redirect, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=85" alt="Salon" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-soft-black/80 to-soft-black/40 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-2 mb-16">
            <Sparkles className="w-6 h-6 text-champagne" />
            <span className="font-playfair text-2xl font-bold text-white">Glamour Salon</span>
          </Link>
          <h2 className="font-playfair text-4xl font-bold text-white mb-4 leading-tight">
            Welcome Back to<br />
            <span className="gradient-text">Your Beauty Hub</span>
          </h2>
          <p className="text-white/70 max-w-sm">
            Log in to manage your appointments, view booking history, and access exclusive member benefits.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-ivory">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-1.5 text-warm-gray text-sm mb-8 hover:text-rose-gold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="lg:hidden flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-rose-gold" />
            <span className="font-playfair text-xl font-bold gradient-text">Glamour Salon</span>
          </div>

          <h1 className="font-playfair text-3xl font-bold text-soft-black mb-2">Sign In</h1>
          <p className="text-warm-gray text-sm mb-8">Enter your credentials to continue</p>

          {/* Admin toggle */}
          <div className="flex bg-white rounded-xl p-1 mb-6 shadow-sm">
            <button
              onClick={() => setIsAdmin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isAdmin ? 'bg-rose-gold text-white' : 'text-warm-gray hover:text-soft-black'}`}
            >
              Client Login
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isAdmin ? 'bg-soft-black text-white' : 'text-warm-gray hover:text-soft-black'}`}
            >
              Admin Login
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-charcoal mb-1.5 block">Email Address</label>
              <input {...register('email')} type="email" className="input-field" placeholder="your@email.com" />
              {errors.email && <p className="text-rose-gold text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-charcoal mb-1.5 block">Password</label>
              <div className="relative">
                <input {...register('password')} type={showPass ? 'text' : 'password'} className="input-field pr-11" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray hover:text-soft-black">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-gold text-xs mt-1">{errors.password.message}</p>}
            </div>

            {isAdmin && (
              <div className="bg-ivory border border-champagne/30 rounded-xl px-4 py-3 text-xs text-warm-gray">
                🔐 Admin credentials: <strong>admin@glamoursalon.com</strong> / <strong>Admin@1234</strong>
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-3.5" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-warm-gray text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-rose-gold font-medium hover:underline">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
