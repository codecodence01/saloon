import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../utils/api';
import { formatPrice, formatDuration } from '../utils/helpers';

const CATEGORIES = ['Hair', 'Skin', 'Makeup', 'Nails', 'Bridal', 'Spa'];

const EMPTY = { name: '', category: 'Hair', description: '', duration: 60, price: '', image: '', isPopular: false, isNew: false, isActive: true };

export default function ServicesManager() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => api.get('/services?isActive=true').then(r => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/services', data),
    onSuccess: () => { qc.invalidateQueries(['admin-services', 'services']); toast.success('Service created!'); closeModal(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/services/${id}`, data),
    onSuccess: () => { qc.invalidateQueries(['admin-services', 'services']); toast.success('Service updated!'); closeModal(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-services', 'services']); toast.success('Service deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ ...s }); setModal(true); };
  const closeModal = () => setModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) updateMutation.mutate({ id: editing._id, data: form });
    else createMutation.mutate(form);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-soft-black">Services</h1>
          <p className="text-warm-gray text-sm">{services.length} active services</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-4">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Category', 'Duration', 'Price', 'Badges', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-warm-gray uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? [...Array(4)].map((_, i) => (
                <tr key={i}>{[...Array(6)].map((_, j) => <td key={j} className="px-5 py-3"><div className="skeleton h-4 rounded"></div></td>)}</tr>
              )) : services.map(s => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-soft-black">{s.name}</td>
                  <td className="px-5 py-3"><span className="text-xs px-2.5 py-1 rounded-full bg-rose-gold/10 text-rose-gold font-medium">{s.category}</span></td>
                  <td className="px-5 py-3 text-warm-gray">{formatDuration(s.duration)}</td>
                  <td className="px-5 py-3 font-bold text-rose-gold">{formatPrice(s.price)}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      {s.isPopular && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-bold">Popular</span>}
                      {s.isNew && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-bold">New</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 flex items-center justify-center">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { if (window.confirm('Delete this service?')) deleteMutation.mutate(s._id); }}
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-playfair text-xl font-bold text-soft-black">{editing ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={closeModal} className="text-warm-gray hover:text-soft-black"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-charcoal mb-1 block">Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal mb-1 block">Duration (min)</label>
                  <input type="number" value={form.duration} onChange={e => setForm({...form, duration: +e.target.value})} required className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal mb-1 block">Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: +e.target.value})} required className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal mb-1 block">Image URL</label>
                  <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="input-field" placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-charcoal mb-1 block">Description *</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={3} className="input-field resize-none" />
                </div>
                <div className="col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal">
                    <input type="checkbox" checked={form.isPopular} onChange={e => setForm({...form, isPopular: e.target.checked})} className="accent-rose-gold" />
                    Mark as Popular
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal">
                    <input type="checkbox" checked={form.isNew} onChange={e => setForm({...form, isNew: e.target.checked})} className="accent-rose-gold" />
                    Mark as New
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
