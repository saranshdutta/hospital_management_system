import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: '123 Main St, Springfield',
    bloodGroup: 'O+',
    healthConcerns: 'None'
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 400);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 mt-1 text-lg">Manage your personal and health information</p>
        </div>

        <Card className="p-6 md:p-8 border border-slate-100 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Full Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required
              />
              <Input 
                label="Blood Group" 
                name="bloodGroup" 
                value={formData.bloodGroup} 
                onChange={handleChange} 
              />
              <div className="md:col-span-2">
                <Input 
                  label="Address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Health Concerns / Allergies</label>
                <textarea 
                  name="healthConcerns"
                  value={formData.healthConcerns}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none shadow-inner min-h-[120px]"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
              <Button type="submit" className="min-w-[140px] py-2.5 text-base">
                Save Changes
              </Button>
              {isSaved && (
                <span className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-left-4 text-sm font-semibold w-full">
                  <CheckCircle2 className="w-5 h-5" />
                  Profile updated successfully!
                </span>
              )}
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
