import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import { mockOrders } from '../../mockData';

export default function Orders() {
  const [orders, setOrders] = useState(mockOrders);

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <AppLayout>
      <div className="mb-8 animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-slate-800">Order Management</h1>
        <p className="text-slate-500 mt-1 text-lg">Manage and update customer orders</p>
      </div>

      <Card className="overflow-hidden border border-slate-200 shadow-sm animate-in slide-in-from-bottom-6 duration-500 delay-100 fill-mode-both">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-xs font-bold tracking-wider">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-800">{order.id}</td>
                  <td className="p-4 text-slate-600 font-medium">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-4 text-slate-600">{order.items} Items</td>
                  <td className="p-4 text-slate-800 font-bold">${order.total.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm inline-block ${
                      order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      order.status === 'Dispatched' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <select 
                      className="text-sm font-semibold border-slate-300 rounded-lg bg-white px-3 py-2 border shadow-sm focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 transition-colors cursor-pointer w-full max-w-[140px]"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                    </select>
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
