import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from '@inertiajs/react'; // ✅ GUNAKAN useForm

export default function AdminModal({ isOpen, onClose }) {
    // ✅ GUNAKAN Inertia useForm UNTUK LOGIN
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleAdminLogin = (e) => {
        e.preventDefault();
        
        // ✅ SUBMIT KE ROUTE LOGIN YANG BENAR
        post('/login', {
            preserveScroll: true,
            onSuccess: () => {
                // ✅ SETELAH LOGIN SUKSES, REDIRECT KE ADMIN PANEL
                window.location.href = '/admin-panel';
            },
            onError: () => {
                // Error sudah ditangani oleh Inertia (errors object)
            },
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                        onClick={handleClose} 
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.9, y: 20 }} 
                        transition={{ type: "spring", stiffness: 300, damping: 30 }} 
                        className="relative w-full max-w-md bg-[#12121a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 blur-[50px] rounded-full" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                        <Lock className="text-white w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-white">Admin Portal</h3>
                                        <p className="text-xs text-gray-400">Secure Login Access</p>
                                    </div>
                                </div>
                                <motion.button onClick={handleClose} className="text-gray-400 hover:text-white" whileHover={{ rotate: 90 }}>
                                    <X size={20} />
                                </motion.button>
                            </div>

                            <form onSubmit={handleAdminLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Email Admin</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                                        <input 
                                            type="email" 
                                            value={data.email} 
                                            onChange={(e) => setData('email', e.target.value)} 
                                            className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all" 
                                            placeholder="admin@verifid.com" 
                                            required 
                                        />
                                    </div>
                                    {/* ✅ TAMPILKAN ERROR JIKA ADA */}
                                    {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                                        <input 
                                            type="password" 
                                            value={data.password} 
                                            onChange={(e) => setData('password', e.target.value)} 
                                            className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all" 
                                            placeholder="••••••••" 
                                            required 
                                        />
                                    </div>
                                    {/* ✅ TAMPILKAN ERROR JIKA ADA */}
                                    {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
                                </div>

                                <motion.button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-violet-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50" 
                                    whileHover={{ scale: 1.02 }} 
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {processing ? <Loader2 className="animate-spin" /> : 'Login'} 
                                    {!processing && <ArrowRight size={18} />}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}