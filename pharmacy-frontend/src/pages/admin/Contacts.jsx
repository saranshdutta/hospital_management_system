import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import { mockHospitals } from '../../mockData';
import { Building, Phone, MapPin } from 'lucide-react';

export default function Contacts() {
  return (
    <AppLayout>
      <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-slate-800">Hospital Contacts</h1>
        <p className="text-slate-500 mt-1 text-lg">Directory of partner hospitals and clinics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-6 duration-500 delay-100 fill-mode-both">
        {mockHospitals.map(hospital => (
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
                  <p className="font-semibold text-slate-700">{hospital.contact}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-slate-600">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Address</p>
                  <p className="font-medium text-slate-700">{hospital.address}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
