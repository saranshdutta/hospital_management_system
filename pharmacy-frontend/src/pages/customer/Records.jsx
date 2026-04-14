import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import { getOrders } from '../../api/orders';
import { FileText, Package, Clock, Loader2 } from 'lucide-react';

export default function Records() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrders()
      .then(data => setOrders(data))
      .catch(() => setError('Failed to load order history.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-800">Health Records</h1>
        <p className="text-slate-500 mt-1 text-lg">View your order history and prescriptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order History */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Package className="w-5 h-5" /></div>
            Previous Orders
          </h2>

          {loading ? (
            <div className="flex items-center gap-2 text-slate-400 py-6">
              <Loader2 className="w-5 h-5 animate-spin" /><span>Loading orders...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-medium">{error}</div>
          ) : (
            <Card className="p-0 border border-slate-100 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <p className="p-8 text-center text-slate-400 font-medium">No orders placed yet.</p>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                      <div>
                        <h4 className="font-semibold text-slate-800 text-lg mb-1">Order #{order.id}</h4>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2">
                          <Clock className="w-4 h-4" /> {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-slate-600">
                          {order.items?.length ?? 0} Items
                          <span className="mx-2 text-slate-300">•</span>
                          <span className="font-semibold text-slate-800">₹{order.total.toFixed(2)}</span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          order.status === 'Dispatched' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Prescription History */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><FileText className="w-5 h-5" /></div>
            Prescriptions
          </h2>
          <Card className="p-8 border border-slate-100 flex flex-col items-center justify-center text-center min-h-[300px] bg-slate-50/50 shadow-inner">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-5 text-slate-300 border border-slate-100">
              <FileText className="w-10 h-10" />
            </div>
            <h4 className="font-bold text-slate-700 text-lg">No active prescriptions</h4>
            <p className="text-slate-500 mt-2 max-w-sm leading-relaxed">When a doctor prescribes medication for you, it will appear here for easy ordering.</p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
