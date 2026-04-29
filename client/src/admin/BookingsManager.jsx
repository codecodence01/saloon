import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Check, X, Trash2, Calendar, Search, Filter } from 'lucide-react';
import api from '../utils/api';
import { formatPrice, formatDate } from '../utils/helpers';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-600',
  completed: 'bg-blue-100 text-blue-600',
  cancelled: 'bg-red-100 text-red-500',
};

export default function BookingsManager() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', statusFilter, page],
    queryFn: () => api.get('/bookings/admin', { params: { status: statusFilter || undefined, page, limit: 15 } }).then(r => r.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.put(`/bookings/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries(['admin-bookings']); toast.success('Booking status updated'); },
    onError: () => toast.error('Failed to update status'),
  });

  const bookings = data?.data || [];
  const total = data?.total || 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-soft-black">Bookings</h1>
          <p className="text-warm-gray text-sm">{total} total bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all border ${
              statusFilter === s ? 'bg-rose-gold text-white border-rose-gold' : 'bg-white text-warm-gray border-gray-200 hover:border-rose-gold'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Client', 'Service', 'Stylist', 'Date & Time', 'Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>{[...Array(7)].map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded"></div></td>
                  ))}</tr>
                ))
              ) : bookings.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-warm-gray">No bookings found</td></tr>
              ) : bookings.map(b => (
                <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-soft-black">{b.userId?.name || b.guestName || '—'}</div>
                    <div className="text-warm-gray text-xs">{b.userId?.email || b.guestEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-warm-gray whitespace-nowrap">{b.serviceId?.name || b.packageId?.title || '—'}</td>
                  <td className="px-4 py-3 text-warm-gray">{b.stylistId?.name || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-soft-black">{new Date(b.date).toLocaleDateString('en-IN')}</div>
                    <div className="text-warm-gray text-xs">{b.timeSlot}</div>
                  </td>
                  <td className="px-4 py-3 font-bold text-rose-gold whitespace-nowrap">{formatPrice(b.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {b.status === 'pending' && (
                        <button onClick={() => updateStatus.mutate({ id: b._id, status: 'confirmed' })}
                          className="w-7 h-7 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center transition-colors" title="Confirm">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <button onClick={() => updateStatus.mutate({ id: b._id, status: 'cancelled' })}
                          className="w-7 h-7 rounded-lg bg-red-100 hover:bg-red-200 text-red-500 flex items-center justify-center transition-colors" title="Cancel">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <button onClick={() => updateStatus.mutate({ id: b._id, status: 'completed' })}
                          className="px-2 h-7 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-xs transition-colors" title="Complete">
                          Done
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 15 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-warm-gray">
            <span>Page {page} of {Math.ceil(total / 15)}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded-lg border border-gray-200 hover:border-rose-gold disabled:opacity-40">Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 15)} className="px-3 py-1 rounded-lg border border-gray-200 hover:border-rose-gold disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
