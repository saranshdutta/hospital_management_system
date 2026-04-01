import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col font-sans relative overflow-hidden">
      {/* Background ambient gradients */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-indigo-400/10 rounded-full blur-[140px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      
      <Navbar />
      <div className="flex flex-1 relative z-10 w-full max-w-[1600px] mx-auto">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto w-full max-w-7xl mx-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
