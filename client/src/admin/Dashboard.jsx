import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CalendarDays, Users, DollarSign, Clock, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import { formatPrice } from '../utils/helpers';

function StatCard({ icon: Icon, title, value, subtitle, color, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-warm-gray text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
          <p className="font-playfair text-2xl font-bold text-soft-black">{value}</p>
          {subtitle && <p className="text-warm-gray text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['booking-stats'],
    queryFn: () => api.get('/bookings/stats').then(r => r.data.data),
  });

  const { data: bookingsData } = useQuery({
    queryKey: ['admin-bookings', 'recent'],
    queryFn: () => api.get('/bookings/admin?limit=5').then(r => r.data),
  });

  const recentBookings = bookingsData?.data || [];

  const chartData = (stats?.monthlyRevenue || []).map(item => ({
    month: new Date(2024, item._id.month - 1).toLocaleString('default', { month: 'short' }),
    revenue: item.revenue,
    bookings: item.count,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-playfair text-2xl font-bold text-soft-black">Dashboard</h1>
        <p className="text-warm-gray text-sm mt-1">Welcome back! Here's your salon overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={CalendarDays} title="Today's Bookings" value={stats?.todayCount ?? '—'} subtitle="Appointments today" color="bg-rose-gold" index={0} />
        <StatCard icon={Clock} title="Pending" value={stats?.pending ?? '—'} subtitle="Awaiting confirmation" color="bg-champagne" index={1} />
        <StatCard icon={DollarSign} title="Total Revenue" value={stats?.totalRevenue ? formatPrice(stats.totalRevenue) : '—'} subtitle="Confirmed + completed" color="bg-soft-black" index={2} />
        <StatCard icon={TrendingUp} title="Monthly Growth" value="+12%" subtitle="vs last month" color="bg-green-500" index={3} />
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-soft-black">Revenue (Last 6 Months)</h2>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B6B6B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6B6B6B' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [formatPrice(v), 'Revenue']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="revenue" fill="#B76E79" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-warm-gray text-sm">No revenue data yet</div>
          )}
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-soft-black mb-4">Quick Overview</h2>
          <div className="space-y-4">
            {[
              { label: 'Confirmed bookings', value: '—', color: 'bg-green-100 text-green-600' },
              { label: 'Completed sessions', value: '—', color: 'bg-blue-100 text-blue-600' },
              { label: 'Cancelled', value: '—', color: 'bg-red-100 text-red-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-warm-gray text-sm">{item.label}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-soft-black">Recent Bookings</h2>
          <a href="/admin/bookings" className="text-rose-gold text-sm hover:underline">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Client', 'Service', 'Stylist', 'Date', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.length > 0 ? recentBookings.map(b => (
                <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-soft-black">{b.userId?.name || b.guestName || '—'}</td>
                  <td className="px-5 py-3 text-warm-gray">{b.serviceId?.name || b.packageId?.title || '—'}</td>
                  <td className="px-5 py-3 text-warm-gray">{b.stylistId?.name || '—'}</td>
                  <td className="px-5 py-3 text-warm-gray">{new Date(b.date).toLocaleDateString('en-IN')} · {b.timeSlot}</td>
                  <td className="px-5 py-3 font-semibold text-rose-gold">{formatPrice(b.totalAmount)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                      b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      b.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-500'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-warm-gray text-sm">No bookings yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
