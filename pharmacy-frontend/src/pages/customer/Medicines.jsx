import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getMedicines } from '../../api/medicines';
import { placeOrder } from '../../api/orders';
import { ShoppingCart, Check, X, Loader2 } from 'lucide-react';

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    getMedicines()
      .then(data => setMedicines(data))
      .catch(err => console.error('Failed to load medicines:', err))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (med) => {
    const existing = cart.find(item => item.id === med.id);
    if (existing) {
      setCart(cart.map(item => item.id === med.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...med, qty: 1 }]);
    }
    if (!isCartOpen) setIsCartOpen(true);
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      const items = cart.map(item => ({ medicine_id: item.id, quantity: item.qty }));
      await placeOrder(items);
      setOrderConfirmed(true);
      setCart([]);
      setIsCartOpen(false);
      setTimeout(() => setOrderConfirmed(false), 4000);
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to place order. Please try again.';
      alert(msg);
    } finally {
      setPlacing(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-10 relative">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
            Order <span className="text-gradient">Medicines</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Browse and order from our pharmacy</p>
        </div>
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-glass border border-white hover:shadow-lg transition-all text-indigo-600 hover:bg-white"
        >
          <ShoppingCart className="w-7 h-7" />
          {cart.length > 0 && (
            <span className="absolute -top-3 -right-3 bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm font-black w-8 h-8 rounded-full flex items-center justify-center border-4 border-slate-50 shadow-md">
              {cart.reduce((sum, item) => sum + item.qty, 0)}
            </span>
          )}
        </button>

        {isCartOpen && (
          <Card className="absolute top-24 right-0 w-80 md:w-96 z-50 p-6 border border-white/60 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.3)] bg-white/95 backdrop-blur-3xl">
            <h3 className="font-semibold text-slate-800 text-xl mb-4 flex items-center justify-between pb-3 border-b border-slate-200/60">
              Your Cart
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </h3>
            {cart.length === 0 ? (
              <div className="text-center py-10 text-slate-400 flex flex-col items-center">
                <ShoppingCart className="w-16 h-16 mb-3 opacity-20" />
                <p className="font-medium">Cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-72 overflow-y-auto mb-4 pr-1 custom-scrollbar">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-white/60 py-3 px-4 rounded-xl border border-slate-100 shadow-sm backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-white overflow-hidden shadow-sm flex-shrink-0">
                           <img src={item.image_url} alt={item.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                          <p className="text-sm text-indigo-600 font-semibold mt-0.5">{item.qty} x ₹{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200/60 pt-4 mb-5 bg-gradient-to-b from-transparent to-slate-50/50 -mx-6 px-6 py-4 rounded-b-xl">
                  <div className="flex justify-between text-lg items-end">
                    <span className="text-slate-500 font-semibold">Subtotal</span>
                    <span className="font-semibold text-2xl text-gradient">₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full py-3.5 text-lg flex items-center justify-center gap-2" onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? <><Loader2 className="w-5 h-5 animate-spin" /> Placing...</> : 'Place Order Securely'}
                </Button>
              </>
            )}
          </Card>
        )}
      </div>

      {orderConfirmed && (
        <div className="mb-10 p-5 bg-gradient-to-r from-emerald-400 to-teal-500 border border-emerald-300 text-white rounded-2xl flex items-center gap-5 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)]">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner"><Check className="w-7 h-7 text-white" /></div>
          <div>
            <h4 className="font-semibold text-xl">Order placed successfully!</h4>
            <p className="text-emerald-50 mt-1">You can track your order in the Health Records section.</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mr-3" /><span className="text-lg font-medium">Loading medicines...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {medicines.map(med => (
            <Card key={med.id} className="flex flex-col group hover:border-indigo-200/60 transition-all bg-white/60 overflow-visible relative pt-2">
              <div className="absolute top-0 right-4 -translate-y-1/2 bg-white backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-indigo-100/50 z-10">
                <span className="text-xs font-semibold text-indigo-700 uppercase tracking-widest">{med.stock} in stock</span>
              </div>
              <div className="h-56 overflow-hidden bg-slate-100/50 p-5 relative rounded-t-2xl">
                {med.image_url ? (
                  <img src={med.image_url} alt={med.name} className="w-full h-full object-contain bg-white p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-700 origin-center" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-slate-200 rounded-xl">💊</div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1 bg-white/50 backdrop-blur-sm">
                <div className="mb-2">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">{med.category}</span>
                </div>
                <h3 className="font-semibold text-slate-800 text-xl leading-tight group-hover:text-indigo-600 transition-colors">
                  {med.name}
                </h3>
                <p className="text-slate-500 text-sm mt-2 line-clamp-2 flex-1 leading-relaxed">{med.description}</p>
                <div className="mt-6 flex items-center justify-between pt-5 border-t border-slate-200/60">
                  <span className="text-slate-800 font-semibold text-2xl">₹{med.price.toFixed(2)}</span>
                  <Button
                    onClick={() => addToCart(med)}
                    className="!px-5 !py-3 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]"
                    disabled={med.stock === 0}
                  >
                    {med.stock === 0 ? 'Out of Stock' : <><span>Add</span><ShoppingCart className="w-4 h-4 ml-2" /></>}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
