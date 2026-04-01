import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingCart, User, ClipboardList, Pill, Users, Building } from 'lucide-react';

const customerLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/medicines', label: 'Order Medicines', icon: Pill },
  { to: '/records', label: 'My Records', icon: ClipboardList },
  { to: '/profile', label: 'Profile', icon: User }
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/stock', label: 'Stock', icon: Pill },
  { to: '/admin/patients', label: 'Patients', icon: Users },
  { to: '/admin/contacts', label: 'Hospitals', icon: Building }
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === 'admin' ? adminLinks : customerLinks;

  return (
    <aside className="w-64 glass-panel border-r border-indigo-50/50 min-h-[calc(100vh-5rem)] p-5 hidden md:block rounded-tr-3xl relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin' || link.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/50 text-indigo-700 font-bold shadow-sm border border-indigo-100/50'
                    : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-800 font-semibold'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-lg transition-all duration-300 shadow-sm ${isActive ? 'bg-indigo-600 text-white shadow-indigo-500/30' : 'bg-white text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 border border-slate-100'}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                  </div>
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
