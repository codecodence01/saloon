import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../utils/api';
import { formatPrice, discountPercent } from '../utils/helpers';

const TIERS = ['Basic', 'Premium', 'Bridal', 'Party Makeover', 'Complete Beauty'];
const EMPTY = { title: '', tier: 'Basic', description: '', includedServices: '', originalPrice: '', discountedPrice: '', badge: '', isActive: true };

export default function PackagesManager() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: () => api.get('/packages').then(r => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/packages', data),
    onSuccess: () => { qc.invalidateQueries(['admin-packages', 'packages']); toast.success('Package created!'); setModal(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/packages/${id}`, data),
    onSuccess: () => { qc.invalidateQueries(['admin-packages', 'packages']); toast.success('Package updated!'); setModal(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/packages/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-packages', 'packages']); toast.success('Package deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p, includedServices: p.includedServices?.join('\n') || '' }); setModal(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      includedServices: form.includedServices.split('\n').map(s => s.trim()).filter(Boolean),
      originalPrice: +form.originalPrice,
      discountedPrice: +form.discountedPrice,
    };
    if (editing) updateMutation.mutate({ id: editing._id, data });
    else createMutation.mutate(data);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-soft-black">Packages</h1>
          <p className="text-warm-gray text-sm">{packages.length} packages</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-4">
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading ? [...Array(3)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl"></div>) :
          packages.map(p => (
            <div key={p._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-gold/10 text-rose-gold font-bold">{p.tier}</span>
                  <h3 className="font-playfair text-lg font-bold text-soft-black mt-1">{p.title}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 flex items-center justify-center">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { if (window.confirm('Delete package?')) deleteMutation.mutate(p._id); }}
                    className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-bold text-rose-gold">{formatPrice(p.discountedPrice)}</span>
                <span className="text-warm-gray line-through text-sm">{formatPrice(p.originalPrice)}</span>
                <span className="text-xs bg-rose-gold/10 text-rose-gold px-1.5 py-0.5 rounded-full font-bold">{discountPercent(p.originalPrice, p.discountedPrice)}% off</span>
              </div>
              <p className="text-warm-gray text-xs">{p.includedServices?.length} services included</p>
            </div>
          ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-playfair text-xl font-bold">{editing ? 'Edit Package' : 'Add Package'}</h2>
              <button onClick={() => setModal(false)} className="text-warm-gray hover:text-soft-black"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal mb-1 block">Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-charcoal mb-1 block">Tier</label>
                  <select value={form.tier} onChange={e => setForm({...form, tier: e.target.value})} className="input-field">
                    {TIERS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal mb-1 block">Badge Label</label>
                  <input value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} className="input-field" placeholder="e.g. Most Popular" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal mb-1 block">Original Price (₹)*</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} required className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal mb-1 block">Discounted Price (₹)*</label>
                  <input type="number" value={form.discountedPrice} onChange={e => setForm({...form, discountedPrice: e.target.value})} required className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="input-field resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal mb-1 block">Included Services (one per line)</label>
                <textarea value={form.includedServices} onChange={e => setForm({...form, includedServices: e.target.value})} rows={4} className="input-field resize-none font-mono text-sm" placeholder="Service 1&#10;Service 2&#10;Service 3" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
