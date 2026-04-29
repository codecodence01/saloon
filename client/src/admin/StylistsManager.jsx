import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../utils/api';

const EMPTY = { name: '', role: '', specializations: '', experience: 1, bio: '', image: '',
  socialLinks: { instagram: '', facebook: '', linkedin: '' },
  availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false }
};
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function StylistsManager() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const { data: stylists = [], isLoading } = useQuery({
    queryKey: ['admin-stylists'],
    queryFn: () => api.get('/stylists').then(r => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/stylists', data),
    onSuccess: () => { qc.invalidateQueries(['admin-stylists', 'stylists']); toast.success('Stylist added!'); setModal(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/stylists/${id}`, data),
    onSuccess: () => { qc.invalidateQueries(['admin-stylists', 'stylists']); toast.success('Stylist updated!'); setModal(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/stylists/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-stylists', 'stylists']); toast.success('Stylist removed'); },
  });

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ ...s, specializations: s.specializations?.join(', ') || '' }); setModal(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, specializations: form.specializations.split(',').map(x => x.trim()).filter(Boolean), experience: +form.experience };
    if (editing) updateMutation.mutate({ id: editing._id, data });
    else createMutation.mutate(data);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-soft-black">Stylists</h1>
          <p className="text-warm-gray text-sm">{stylists.length} team members</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-4">
          <Plus className="w-4 h-4" /> Add Stylist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading ? [...Array(3)].map((_, i) => <div key={i} className="skeleton h-44 rounded-2xl"></div>) :
          stylists.map(s => (
            <div key={s._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
              <img src={s.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} alt={s.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-rose-gold/20 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-soft-black">{s.name}</h3>
                <p className="text-rose-gold text-xs font-medium mb-1">{s.role}</p>
                <p className="text-warm-gray text-xs">{s.experience} yrs · {s.specializations?.slice(0, 2).join(', ')}</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => openEdit(s)} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 flex items-center justify-center">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { if (window.confirm('Remove stylist?')) deleteMutation.mutate(s._id); }}
                  className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-playfair text-xl font-bold">{editing ? 'Edit Stylist' : 'Add Stylist'}</h2>
              <button onClick={() => setModal(false)} className="text-warm-gray"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-charcoal mb-1 block">Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal mb-1 block">Role *</label>
                  <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} required className="input-field" placeholder="Senior Stylist" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal mb-1 block">Experience (yrs)</label>
                  <input type="number" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} className="input-field" min="0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal mb-1 block">Image URL</label>
                  <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="input-field" placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal mb-1 block">Specializations (comma-separated)</label>
                <input value={form.specializations} onChange={e => setForm({...form, specializations: e.target.value})} className="input-field" placeholder="Balayage, Color, Keratin" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal mb-1 block">Bio</label>
                <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={3} className="input-field resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal mb-2 block">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <label key={day} className="flex items-center gap-1.5 cursor-pointer text-xs capitalize">
                      <input type="checkbox" checked={form.availability?.[day] || false}
                        onChange={e => setForm({...form, availability: {...form.availability, [day]: e.target.checked}})}
                        className="accent-rose-gold" />
                      {day.slice(0, 3)}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
