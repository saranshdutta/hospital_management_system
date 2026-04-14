import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import { getPatients } from '../../api/patients';
import { Loader2 } from 'lucide-react';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPatients()
      .then(data => setPatients(data))
      .catch(() => setError('Failed to load patient records.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-slate-800">Patient Records</h1>
        <p className="text-slate-500 mt-1 text-lg">View registered patient details and health concerns</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-48 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="font-medium">Loading patients...</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl mb-6 font-medium">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in slide-in-from-bottom-6 duration-500 delay-100 fill-mode-both">
          {patients.length === 0 ? (
            <p className="col-span-full text-center text-slate-400 py-16 font-medium">No patients registered yet.</p>
          ) : (
            patients.map(patient => (
              <Card key={patient.id} className="p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-5 pb-5 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1">{patient.name}</h3>
                    <p className="text-slate-500 text-sm font-medium">{patient.email}</p>
                  </div>
                  <span className="px-3.5 py-1.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 shadow-sm">
                    {patient.blood_group || '—'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Patient ID</p>
                    <p className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg inline-block border border-slate-200 font-mono tracking-wide">P-{patient.id}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Health Concerns</p>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{patient.health_concerns || 'None'}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </AppLayout>
  );
}
