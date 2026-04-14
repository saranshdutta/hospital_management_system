import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getMedicines, deleteMedicine, createMedicine, updateMedicine } from '../../api/medicines';
import { Plus, Edit2, Trash2, Search, Loader2, X, Check } from 'lucide-react';

const EMPTY_FORM = { name: '', category: 'General', description: '', price: '', stock: '', image_url: '' };

export default function Stock() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = create, obj = edit
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchMedicines = () =>
    getMedicines()
      .then(data => setMedicines(data))
      .catch(() => setError('Failed to load stock.'))
      .finally(() => setLoading(false));

  useEffect(() => { fetchMedicines(); }, []);

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (med) => {
    setEditTarget(med);
    setForm({
      name: med.name,
      category: med.category,
      description: med.description,
      price: med.price,
      stock: med.stock,
      image_url: med.image_url,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this medicine from inventory?')) return;
    try {
      await deleteMedicine(id);
      setMedicines(prev => prev.filter(m => m.id !== id));
    } catch {
      alert('Failed to delete medicine.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock, 10) };
      if (editTarget) {
        const updated = await updateMedicine(editTarget.id, payload);
        setMedicines(prev => prev.map(m => m.id === updated.id ? updated : m));
      } else {
        const created = await createMedicine(payload);
        setMedicines(prev => [created, ...prev]);
      }
      setShowModal(false);
    } catch {
      alert('Failed to save medicine.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Stock Management</h1>
          <p className="text-slate-500 mt-1 text-lg">Manage medicine inventory and pricing</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search inventory..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none shadow-sm w-full md:w-64"
            />
          </div>
          <Button onClick={openCreate} className="flex items-center gap-2 shadow-sm py-2.5 whitespace-nowrap">
            <Plus className="w-5 h-5" /> Add New
          </Button>
        </div>
      </div>

      {error && <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl mb-6 font-medium">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /><span className="font-medium">Loading inventory...</span>
        </div>
      ) : (
        <Card className="overflow-hidden border border-slate-200 shadow-sm animate-in slide-in-from-bottom-6 duration-500 delay-100 fill-mode-both">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-xs font-bold tracking-wider">
                  <th className="p-4 pl-6">Medicine</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-400 font-medium">No medicines found.</td></tr>
                ) : (
                  filtered.map(med => (
                    <tr key={med.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-4">
                          {med.image_url ? (
                            <div className="w-12 h-12 rounded-lg bg-white overflow-hidden shadow-sm border border-slate-200 flex-shrink-0">
                               <img src={med.image_url} alt={med.name} className="w-full h-full object-contain p-1" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300 text-xl">💊</div>
                          )}
                          <span className="font-bold text-slate-800 text-base">{med.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-xs font-bold">{med.category}</span>
                      </td>
                      <td className="p-4 text-slate-500 text-sm max-w-[200px] truncate">{med.description}</td>
                      <td className="p-4 font-bold text-slate-800 text-base">₹{med.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-4 py-1.5 rounded-lg text-sm font-bold border inline-block min-w-[60px] text-center ${med.stock < 100 ? 'text-red-700 bg-red-50 border-red-200 shadow-sm' : 'text-slate-700 bg-slate-50 border-slate-200 shadow-sm'}`}>
                          {med.stock}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(med)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(med.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">{editTarget ? 'Edit Medicine' : 'Add New Medicine'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Paracetamol 500mg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                  <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Antibiotic" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Price (₹) *</label>
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Stock *</label>
                  <input required type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Image URL</label>
                  <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" placeholder="Brief description..." />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm">Cancel</button>
                <Button type="submit" className="flex-1 py-2.5 flex items-center justify-center gap-2" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editTarget ? 'Save Changes' : 'Add Medicine'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
