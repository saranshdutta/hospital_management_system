import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { mockMedicines } from '../../mockData';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export default function Stock() {
  const [medicines, setMedicines] = useState(mockMedicines);

  const handleDelete = (id) => {
    setMedicines(medicines.filter(m => m.id !== id));
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
              placeholder="Search inventory..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none shadow-sm w-full md:w-64"
            />
          </div>
          <Button className="flex items-center gap-2 shadow-sm py-2.5 whitespace-nowrap">
            <Plus className="w-5 h-5" /> Add New
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border border-slate-200 shadow-sm animate-in slide-in-from-bottom-6 duration-500 delay-100 fill-mode-both">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-xs font-bold tracking-wider">
                <th className="p-4 pl-6">Medicine</th>
                <th className="p-4">Description</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {medicines.map(med => (
                <tr key={med.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-4">
                      <img src={med.image} alt={med.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm" />
                      <span className="font-bold text-slate-800 text-base">{med.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 text-sm max-w-[200px] truncate">{med.desc}</td>
                  <td className="p-4 font-bold text-slate-800 text-base">${med.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-4 py-1.5 rounded-lg text-sm font-bold border inline-block min-w-[60px] text-center ${med.stock < 100 ? 'text-red-700 bg-red-50 border-red-200 shadow-sm' : 'text-slate-700 bg-slate-50 border-slate-200 shadow-sm'}`}>
                      {med.stock}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(med.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
}
