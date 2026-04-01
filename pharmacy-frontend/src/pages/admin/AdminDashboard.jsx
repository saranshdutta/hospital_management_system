import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import { mockOrders, mockMedicines, mockPatients } from '../../mockData';
import { ShoppingCart, AlertCircle, Users, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const pendingOrders = mockOrders.filter(o => o.status === 'Pending').length;
  const lowStock = mockMedicines.filter(m => m.stock < 100).length;

  return (
    <AppLayout>
      <div className="mb-10 animate-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          Admin <span className="text-gradient">Dashboard</span>
        </h1>
        <p className="text-slate-500 mt-2.5 text-lg font-medium">Overview of pharmacy operations and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
        <Card className="p-6 relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-200/50 transition-colors" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform"><ShoppingCart className="w-8 h-8" /></div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Orders</p>
              <h3 className="text-4xl font-black text-slate-800">{mockOrders.length}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-200/50 transition-colors" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform"><AlertCircle className="w-8 h-8" /></div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Pending Dispatch</p>
              <h3 className="text-4xl font-black text-slate-800">{pendingOrders}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300">
           <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-200/50 transition-colors" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform"><Activity className="w-8 h-8" /></div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Low Stock Alerts</p>
              <h3 className="text-4xl font-black text-slate-800">{lowStock}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-200/50 transition-colors" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform"><Users className="w-8 h-8" /></div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Patients</p>
              <h3 className="text-4xl font-black text-slate-800">{mockPatients.length}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-bottom-12 duration-700 delay-200 fill-mode-both">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl hover:bg-indigo-100 font-bold transition-all shadow-sm border border-indigo-100/50">View All →</Link>
          </div>
          <Card className="p-0 border border-white/60 overflow-hidden bg-white/60 backdrop-blur-xl">
            <div className="divide-y divide-slate-100/80">
              {mockOrders.slice(0, 4).map(order => (
                <div key={order.id} className="p-5 flex items-center justify-between hover:bg-white/80 transition-all cursor-pointer group">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-0.5 group-hover:text-indigo-600 transition-colors">{order.id}</h4>
                    <p className="text-sm text-slate-500 font-medium">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${
                    order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    order.status === 'Dispatched' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Inventory Alerts</h2>
            <Link to="/admin/stock" className="text-sm bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl hover:bg-indigo-100 font-bold transition-all shadow-sm border border-indigo-100/50">Manage Stock →</Link>
          </div>
          <Card className="p-0 border border-white/60 overflow-hidden bg-white/60 backdrop-blur-xl">
            <div className="divide-y divide-slate-100/80">
              {mockMedicines.filter(m => m.stock < 100).map(med => (
                <div key={med.id} className="p-5 flex items-center justify-between hover:bg-white/80 transition-all cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <img src={med.image} alt={med.name} className="w-14 h-14 rounded-xl bg-slate-100 object-cover shadow-sm border border-slate-200 group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors mb-0.5">{med.name}</h4>
                      <p className="text-sm text-slate-500 font-medium">${med.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right bg-rose-50/80 px-4 py-2 rounded-2xl border border-rose-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-rose-200/30 rounded-full blur-md" />
                    <p className="text-2xl font-black text-rose-600 leading-none relative z-10">{med.stock}</p>
                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider mt-1 relative z-10">Left</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
