import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import { mockMedicines } from '../../mockData';
import { Pill, User as UserIcon, Activity, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
          Welcome back, <span className="text-gradient">{user?.name || 'Customer'}</span>
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Your personalized health dashboard.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div 
          onClick={() => navigate('/medicines')}
          className="group relative p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white cursor-pointer hover:-translate-y-1.5 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_15px_45px_-10px_rgba(79,70,229,0.7)] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner border border-white/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Pill className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Order Medicine</h3>
              <p className="text-blue-100 font-medium opacity-90">Browse our pharmacy</p>
            </div>
          </div>
        </div>
        
        <Card className="p-6 flex items-center gap-5 cursor-pointer hover:-translate-y-1.5 group hover:border-indigo-200 transition-all duration-300" onClick={() => navigate('/profile')}>
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform shadow-sm border border-indigo-100/50"><UserIcon className="w-8 h-8" /></div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800 tracking-tight">View Profile</h3>
            <p className="text-slate-500">Update your details</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-5 cursor-pointer hover:-translate-y-1.5 group hover:border-emerald-200 transition-all duration-300" onClick={() => navigate('/records')}>
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform shadow-sm border border-emerald-100/50"><Activity className="w-8 h-8" /></div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Health Records</h3>
            <p className="text-slate-500">Check past orders</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Medicines */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
            Recommended For You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mockMedicines.slice(0, 4).map(med => (
              <Card key={med.id} className="p-4 flex gap-5 group hover:border-indigo-200 transition-all cursor-pointer">
                <div className="w-28 h-28 shrink-0 overflow-hidden rounded-2xl bg-slate-50 shadow-inner border border-slate-100">
                  <img src={med.image} alt={med.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center flex-1 py-1 pr-2">
                  <h4 className="font-semibold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{med.name}</h4>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{med.desc}</p>
                  <p className="font-semibold text-slate-800 mt-2 text-lg bg-indigo-50 text-indigo-700 self-start px-2 py-0.5 rounded-md">₹{med.price.toFixed(2)}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Health Tips */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Daily Tips</h2>
          <Card className="p-7 bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border border-indigo-100/50 shadow-inner h-full">
            <div className="mb-8 p-5 bg-white/60 rounded-2xl backdrop-blur-sm border border-white shadow-sm hover:shadow-md transition-all">
              <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-3 text-lg">
                <span className="p-2.5 bg-blue-100 text-blue-600 rounded-xl shadow-sm"><Droplets className="w-5 h-5" /></span> Stay Hydrated
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">Drink at least 8 glasses of water daily to maintain a healthy body and clear skin.</p>
            </div>
            
            <div className="p-5 bg-white/60 rounded-2xl backdrop-blur-sm border border-white shadow-sm hover:shadow-md transition-all">
              <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-3 text-lg">
                <span className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl shadow-sm"><Activity className="w-5 h-5" /></span> Move Often
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">30 minutes of walking every day reduces your risk of heart disease.</p>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
