import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getHospitals, createHospital } from '../../api/hospitals';
import { Building, Phone, MapPin, Loader2, Plus, X } from 'lucide-react';

export default function Contacts() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', address: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getHospitals()
      .then(data => setHospitals(data))
      .catch(() => setError('Failed to load hospitals.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createHospital(form);
      setHospitals(prev => [created, ...prev]);
      setShowModal(false);
      setForm({ name: '', contact: '', address: '' });
    } catch {
      alert('Failed to add hospital.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8 animate-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Hospital Contacts</h1>
          <p className="text-slate-500 mt-1 text-lg">Directory of partner hospitals and clinics</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Hospital
        </Button>
      </div>

      {error && <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl mb-6 font-medium">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /><span className="font-medium">Loading hospitals...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-6 duration-500 delay-100 fill-mode-both">
          {hospitals.length === 0 ? (
            <p className="col-span-full text-center text-slate-400 py-16 font-medium">No hospitals in directory. Add one above.</p>
          ) : (
            hospitals.map(hospital => (
              <Card key={hospital.id} className="p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:bg-blue-100 transition-colors" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 leading-tight">{hospital.name}</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-slate-600">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Contact Number</p>
                      <p className="font-semibold text-slate-700">{hospital.contact || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Address</p>
                      <p className="font-medium text-slate-700">{hospital.address || '—'}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Add Hospital Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Add Hospital</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hospital Name *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contact</label>
                <input value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Address</label>
                <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm">Cancel</button>
                <Button type="submit" className="flex-1 py-2.5 flex items-center justify-center gap-2" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Add Hospital
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
