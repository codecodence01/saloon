import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Check, X, Trash2, Star } from 'lucide-react';
import api from '../utils/api';

export default function TestimonialsManager() {
  const qc = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => api.get('/testimonials/admin').then(r => r.data.data),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, isApproved }) => api.put(`/testimonials/${id}/approve`, { isApproved }),
    onSuccess: () => { qc.invalidateQueries(['admin-testimonials', 'testimonials']); toast.success('Review updated!'); },
    onError: () => toast.error('Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/testimonials/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-testimonials', 'testimonials']); toast.success('Review deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const pending = testimonials.filter(t => !t.isApproved);
  const approved = testimonials.filter(t => t.isApproved);

  const ReviewCard = ({ t }) => (
    <div className={`bg-white rounded-xl p-4 border ${t.isApproved ? 'border-green-100' : 'border-yellow-100'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-champagne fill-champagne' : 'text-gray-200 fill-gray-200'}`} />
              ))}
            </div>
            <span className="text-xs text-warm-gray">{t.rating}/5</span>
          </div>
          <p className="text-sm text-charcoal italic mb-2 line-clamp-3">"{t.comment}"</p>
          <div className="flex items-center gap-2 flex-wrap text-xs text-warm-gray">
            <span className="font-medium text-soft-black">{t.userId?.name || t.guestName || 'Anonymous'}</span>
            {t.serviceName && <span>· {t.serviceName}</span>}
            <span>· {new Date(t.createdAt).toLocaleDateString('en-IN')}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          {!t.isApproved ? (
            <button onClick={() => approveMutation.mutate({ id: t._id, isApproved: true })}
              className="w-7 h-7 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center" title="Approve">
              <Check className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button onClick={() => approveMutation.mutate({ id: t._id, isApproved: false })}
              className="w-7 h-7 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-600 flex items-center justify-center" title="Revoke">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => { if (window.confirm('Delete review?')) deleteMutation.mutate(t._id); }}
            className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold text-soft-black mb-1">Testimonials</h1>
      <p className="text-warm-gray text-sm mb-6">{pending.length} pending approval · {approved.length} approved</p>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-soft-black mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            Pending Approval ({pending.length})
          </h2>
          <div className="space-y-3">
            {isLoading ? [...Array(2)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl"></div>) :
              pending.map(t => <ReviewCard key={t._id} t={t} />)
            }
          </div>
        </div>
      )}

      {/* Approved */}
      <div>
        <h2 className="font-semibold text-soft-black mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          Approved ({approved.length})
        </h2>
        <div className="space-y-3">
          {isLoading ? [...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl"></div>) :
            approved.length === 0 ? <p className="text-warm-gray text-sm">No approved reviews yet.</p> :
            approved.map(t => <ReviewCard key={t._id} t={t} />)
          }
        </div>
      </div>
    </div>
  );
}
