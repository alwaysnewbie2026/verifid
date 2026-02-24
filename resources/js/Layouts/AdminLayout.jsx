import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, LayoutDashboard, Users, Activity, Settings, LogOut, Menu, Bell, X, User } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

export default function AdminLayout({ children, currentView, setCurrentView, sidebarOpen, setSidebarOpen, logs = [] }) {
  // Setup untuk mengambil data User
  const { auth } = usePage().props;
  const user = auth?.user || { name: 'Admin Utama', email: 'admin@system.com' };

  // Setup State untuk Dropdown
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Menutup dropdown saat diklik di luar area
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotif(false);
          if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Sesuaikan dengan route logout Anda, biasanya menggunakan post('/logout')
    router.post('/logout'); 
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'participants', label: 'Data Peserta', icon: Users },
    { id: 'logs', label: 'Aktivitas Log', icon: Activity },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  // Ambil 5 log terbaru
  const recentLogs = logs.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex overflow-hidden font-sans">
      
      {/* 1. OVERLAY GELAP UNTUK MOBILE */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" 
          />
        )}
      </AnimatePresence>

      {/* 2. SIDEBAR */}
      <motion.aside 
        initial={false} 
        animate={{ width: sidebarOpen ? 280 : 80 }} 
        className={`bg-[#12121a] border-r border-white/5 flex flex-col fixed md:relative z-50 h-full top-0 left-0 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5 h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="font-bold text-lg tracking-tight">Verif<span className="text-violet-400">ID</span></h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Panel</p>
              </motion.div>
            )}
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => {
                setCurrentView(item.id);
                if (window.innerWidth < 768) setSidebarOpen(false);
              }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${currentView === item.id ? 'bg-gradient-to-r from-violet-600/20 to-cyan-600/10 text-white border border-violet-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              {currentView === item.id && <motion.div layoutId="activeNav" className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-cyan-500" />}
              <item.icon size={20} className={currentView === item.id ? 'text-violet-400' : 'group-hover:text-violet-400 transition-colors'} />
              {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="block text-gray-400 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-bold capitalize text-white">{currentView.replace('-', ' ')}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            
            {/* NOTIFICATION BELL DROPDOWN */}
            <div className="relative" ref={notifRef}>
                <button 
                    onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
                    className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors focus:outline-none"
                >
                    <Bell size={20} />
                    {recentLogs.length > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0f]" />
                    )}
                </button>

                <AnimatePresence>
                    {showNotif && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-3 w-80 bg-[#161622] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                        >
                            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                                <h4 className="text-sm font-bold text-white">Aktivitas Terbaru</h4>
                            </div>
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                {recentLogs.length > 0 ? (
                                    recentLogs.map((log, idx) => (
                                        <div key={idx} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3">
                                            <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                                                log.type === 'create' ? 'bg-emerald-500' : 
                                                log.type === 'delete' ? 'bg-rose-500' : 'bg-violet-500'
                                            }`} />
                                            <div>
                                                <p className="text-sm text-gray-300 leading-snug">{log.action}</p>
                                                <p className="text-xs text-gray-500 mt-1">{log.time} • {log.user}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-gray-500 text-sm">
                                        Belum ada aktivitas.
                                    </div>
                                )}
                            </div>
                            <div className="p-2 bg-black/20 text-center">
                                <button onClick={() => { setCurrentView('logs'); setShowNotif(false); }} className="text-xs text-violet-400 hover:text-violet-300 font-medium py-1">
                                    Lihat Semua Log
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* USER PROFILE DROPDOWN */}
            <div className="relative" ref={profileRef}>
                <button 
                    onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
                    className="focus:outline-none"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 p-[2px] transition-transform hover:scale-105">
                        <div className="w-full h-full rounded-full bg-[#12121a] flex items-center justify-center overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} alt="Admin" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </button>

                <AnimatePresence>
                    {showProfile && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-3 w-56 bg-[#161622] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 p-1"
                        >
                            <div className="px-4 py-3 border-b border-white/5 mb-1">
                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                            
                            <button onClick={() => { setCurrentView('settings'); setShowProfile(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                <User size={16} className="text-gray-400" /> Profil Saya
                            </button>
                            <button onClick={() => { setCurrentView('settings'); setShowProfile(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                <Settings size={16} className="text-gray-400" /> Pengaturan
                            </button>
                            
                            <div className="h-px w-full bg-white/5 my-1" />
                            
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                            >
                                <LogOut size={16} /> Keluar Sistem
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}