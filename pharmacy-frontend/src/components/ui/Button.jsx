import React from 'react';

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const base = "inline-flex items-center justify-center px-5 py-2.5 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-[0_6px_20px_-4px_rgba(79,70,229,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(79,70,229,0.5)] focus:ring-indigo-500 border border-transparent hover:border-indigo-400",
    secondary: "bg-white/80 backdrop-blur-md text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-sm focus:ring-blue-500",
    danger: "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 shadow-md focus:ring-red-500",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100/60 hover:text-slate-900 focus:ring-slate-500"
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
