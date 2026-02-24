import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Bell, MonitorSmartphone, Loader2, CheckCircle2 } from 'lucide-react';
import { usePage, useForm } from '@inertiajs/react';
import { Card, Input, Button } from './UIComponents';

export default function SettingsView() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [activeTab, setActiveTab] = useState('profile');
    const [showSuccess, setShowSuccess] = useState('');

    // Form Khusus Profil
    const profileForm = useForm({
        name: user?.name || '',
        email: user?.email || '',
    });

    // Form Khusus Password
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Efek flash message
    const { flash } = usePage().props;
    useEffect(() => {
        if (flash?.message) {
            setShowSuccess(flash.message);
            setTimeout(() => setShowSuccess(''), 3000);
        }
    }, [flash]);

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.post('/admin-panel/settings/profile', { preserveScroll: true });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.post('/admin-panel/settings/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const tabs = [
        { id: 'profile', label: 'Profil Saya', icon: User },
        { id: 'security', label: 'Keamanan', icon: Shield },
        { id: 'preferences', label: 'Preferensi', icon: MonitorSmartphone },
    ];

    return (
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
            
            {/* Sidebar Settings (Kiri) */}
            <div className="w-full md:w-64 shrink-0">
                <Card className="p-2 sticky top-24">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                    activeTab === tab.id 
                                    ? 'bg-violet-500/20 text-violet-400 font-medium border border-violet-500/20' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                <tab.icon size={18} className={activeTab === tab.id ? 'text-violet-400' : 'text-gray-500'} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </Card>
            </div>

            {/* Konten Settings (Kanan) */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    
                    {/* --- TAB PROFIL --- */}
                    {activeTab === 'profile' && (
                        <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <Card>
                                <div className="border-b border-white/5 pb-6 mb-6">
                                    <h3 className="text-xl font-bold text-white">Profil Saya</h3>
                                    <p className="text-sm text-gray-400 mt-1">Kelola informasi publik dan data diri Anda.</p>
                                </div>

                                <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-xl">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-500 p-[2px] shadow-lg shadow-violet-500/20">
                                            <div className="w-full h-full rounded-full bg-[#12121a] overflow-hidden">
                                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=random&size=128`} alt="Avatar" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400 mb-2">Avatar diambil secara otomatis dari nama Anda.</p>
                                        </div>
                                    </div>

                                    <Input 
                                        label="Nama Lengkap" 
                                        value={profileForm.data.name} 
                                        onChange={e => profileForm.setData('name', e.target.value)} 
                                        error={profileForm.errors.name} 
                                    />
                                    <Input 
                                        label="Alamat Email" 
                                        type="email" 
                                        value={profileForm.data.email} 
                                        onChange={e => profileForm.setData('email', e.target.value)} 
                                        error={profileForm.errors.email} 
                                    />

                                    <div className="pt-4 flex items-center gap-4">
                                        <Button type="submit" disabled={profileForm.processing}>
                                            {profileForm.processing ? <Loader2 className="animate-spin mr-2" /> : 'Simpan Perubahan'}
                                        </Button>
                                        
                                        <AnimatePresence>
                                            {showSuccess && showSuccess.includes('Profil') && (
                                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-emerald-400 text-sm flex items-center gap-1">
                                                    <CheckCircle2 size={16} /> {showSuccess}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    )}

                    {/* --- TAB KEAMANAN --- */}
                    {activeTab === 'security' && (
                        <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <Card>
                                <div className="border-b border-white/5 pb-6 mb-6">
                                    <h3 className="text-xl font-bold text-white">Ubah Password</h3>
                                    <p className="text-sm text-gray-400 mt-1">Pastikan akun Anda menggunakan password yang panjang dan unik.</p>
                                </div>

                                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-xl">
                                    <Input 
                                        label="Password Saat Ini" 
                                        type="password" 
                                        value={passwordForm.data.current_password} 
                                        onChange={e => passwordForm.setData('current_password', e.target.value)} 
                                        error={passwordForm.errors.current_password} 
                                    />
                                    <div className="h-px bg-white/5 w-full my-4" />
                                    <Input 
                                        label="Password Baru" 
                                        type="password" 
                                        value={passwordForm.data.password} 
                                        onChange={e => passwordForm.setData('password', e.target.value)} 
                                        error={passwordForm.errors.password} 
                                    />
                                    <Input 
                                        label="Konfirmasi Password Baru" 
                                        type="password" 
                                        value={passwordForm.data.password_confirmation} 
                                        onChange={e => passwordForm.setData('password_confirmation', e.target.value)} 
                                        error={passwordForm.errors.password_confirmation} 
                                    />

                                    <div className="pt-4 flex items-center gap-4">
                                        <Button type="submit" disabled={passwordForm.processing} className="bg-rose-600 hover:bg-rose-500 shadow-rose-500/20">
                                            {passwordForm.processing ? <Loader2 className="animate-spin mr-2" /> : 'Perbarui Password'}
                                        </Button>

                                        <AnimatePresence>
                                            {showSuccess && showSuccess.includes('Password') && (
                                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-emerald-400 text-sm flex items-center gap-1">
                                                    <CheckCircle2 size={16} /> {showSuccess}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    )}

                    {/* --- TAB PREFERENSI (Opsional / Segera Hadir) --- */}
                    {activeTab === 'preferences' && (
                        <motion.div key="preferences" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <Card className="text-center py-20">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Preferensi Aplikasi</h3>
                                <p className="text-gray-400">Pengaturan notifikasi dan tema sedang dalam tahap pengembangan.</p>
                            </Card>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}