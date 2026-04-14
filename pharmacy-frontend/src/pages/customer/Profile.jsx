import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../../api/patients';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    blood_group: '',
    address: '',
    health_concerns: '',
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);

  // Load existing profile on mount
  useEffect(() => {
    getMyProfile()
      .then(profile => {
        setFormData({
          blood_group: profile.blood_group || '',
          address: profile.address || '',
          health_concerns: profile.health_concerns || '',
        });
      })
      .catch(() => {
        // Profile not found is fine — user can fill in from scratch
      })
      .finally(() => setLoadingProfile(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await updateMyProfile(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 mt-1 text-lg">Manage your personal and health information</p>
        </div>

        {/* Account info (read-only from JWT) */}
        <Card className="p-6 md:p-8 border border-slate-100 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-slate-700 mb-4 pb-3 border-b border-slate-100">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-slate-800 font-semibold text-lg">{user?.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
              <p className="text-slate-800 font-semibold text-lg">{user?.email || '—'}</p>
            </div>
          </div>
        </Card>

        {/* Health profile (editable) */}
        <Card className="p-6 md:p-8 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-700 mb-6 pb-3 border-b border-slate-100">Health Information</h2>

          {loadingProfile ? (
            <div className="flex items-center gap-2 text-slate-400 py-8">
              <Loader2 className="w-5 h-5 animate-spin" /><span>Loading profile...</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Blood Group</label>
                  <input
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    placeholder="e.g. O+, A-, B+"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your home / delivery address"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none shadow-inner"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Health Concerns / Allergies</label>
                  <textarea
                    name="health_concerns"
                    value={formData.health_concerns}
                    onChange={handleChange}
                    placeholder="e.g. Diabetes Type 2, Penicillin allergy, Asthma..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none shadow-inner min-h-[120px]"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-sm font-medium">{error}</div>
              )}

              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <Button type="submit" className="min-w-[140px] py-2.5 text-base flex items-center justify-center gap-2" disabled={isSaving}>
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
                </Button>
                {isSaved && (
                  <span className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-left-4 text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    Profile updated successfully!
                  </span>
                )}
              </div>
            </form>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
