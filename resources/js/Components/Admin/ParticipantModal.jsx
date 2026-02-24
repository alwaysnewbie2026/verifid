import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2 } from 'lucide-react';
import { Input, Select, Button } from './UIComponents';
import { useForm } from '@inertiajs/react';

export default function ParticipantModal({ isModalOpen, setIsModalOpen, editingParticipant }) {
    // Perhatikan: Kita tidak lagi memanggil 'reset' dari useForm
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '', participant_id: '', program: '', grade: '', status: 'Lulus', date: '', certificate: null
    });

    // ✅ FUNGSI MANUAL ANTI-GAGAL UNTUK MENGOSONGKAN FORM
    const clearForm = () => {
        setData({
            name: '',
            participant_id: '',
            program: '',
            grade: '',
            status: 'Lulus', // Reset ke default pilihan select
            date: '',
            certificate: null
        });
        clearErrors();
    };

    // Deteksi perubahan saat modal terbuka
    useEffect(() => {
        if (isModalOpen) {
            if (editingParticipant) {
                // Mode Edit: Isi dengan data lama
                setData({
                    name: editingParticipant.name || '',
                    participant_id: editingParticipant.participant_id || '',
                    program: editingParticipant.program || '',
                    grade: editingParticipant.grade || '',
                    status: editingParticipant.status || 'Lulus',
                    date: editingParticipant.date || '',
                    certificate: null 
                });
            } else {
                // Mode Tambah: Paksa kosongkan form secara eksplisit
                clearForm();
            }
        }
    }, [isModalOpen, editingParticipant]);

    // Fungsi penutup modal yang aman
    const handleClose = () => {
        setIsModalOpen(false);
        // Hapus data setelah animasi fade-out selesai (300ms)
        setTimeout(() => {
            clearForm();
        }, 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingParticipant) {
            post(`/admin-panel/participants/${editingParticipant.id}`, {
                _method: 'put',
                preserveScroll: true,
                onSuccess: () => handleClose()
            });
        } else {
            post('/admin-panel/participants', {
                preserveScroll: true,
                onSuccess: () => handleClose()
            });
        }
    };

    return (
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                        onClick={handleClose} 
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                        className="relative w-full max-w-2xl bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-violet-900/20 to-transparent">
                            <h3 className="text-xl font-bold text-white">{editingParticipant ? 'Edit Peserta' : 'Tambah Peserta Baru'}</h3>
                            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <form id="participantForm" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="Nama Lengkap" value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} required />
                                    <Input label="Nomor ID Peserta" value={data.participant_id} onChange={e => setData('participant_id', e.target.value)} error={errors.participant_id} required />
                                    <Input label="Program/Kursus" value={data.program} onChange={e => setData('program', e.target.value)} error={errors.program} required />
                                    <Select label="Status Kelulusan" options={[{ value: 'Lulus', label: 'Lulus' }, { value: 'Tidak Lulus', label: 'Tidak Lulus' }]} value={data.status} onChange={e => setData('status', e.target.value)} />
                                    <Input label="Nilai" value={data.grade} onChange={e => setData('grade', e.target.value)} error={errors.grade} required />
                                    <Input
                                        label="Tanggal Kelulusan"
                                        type="date"
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                        error={errors.date}
                                        max={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Upload Sertifikat (PDF)
                                    </label>

                                    {editingParticipant?.certificate && (
                                        <div className="mb-3 p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-between">
                                            <span className="text-sm text-gray-300">File saat ini sudah tersedia</span>
                                            <a 
                                                href={`/storage/${editingParticipant.certificate}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-xs text-violet-400 hover:text-violet-300 font-medium bg-violet-500/20 px-3 py-1.5 rounded-lg transition-colors z-10"
                                            >
                                                Lihat PDF
                                            </a>
                                        </div>
                                    )}

                                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden">
                                        <input 
                                            type="file" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                                            accept=".pdf" 
                                            onChange={e => setData('certificate', e.target.files[0])} 
                                        />
                                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                <Upload className="text-gray-400" size={24} />
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                {data.certificate instanceof File ? (
                                                    <span className="text-violet-400 font-medium">{data.certificate.name}</span>
                                                ) : (
                                                    <>Klik atau Drag file PDF {editingParticipant?.certificate ? 'baru untuk mengganti' : ''}</>
                                                )}
                                            </p>
                                            {errors.certificate && <p className="text-red-400 text-xs mt-1">{errors.certificate}</p>}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-6 border-t border-white/5 bg-[#0a0a0f]/50 flex justify-end gap-3">
                            <Button variant="ghost" onClick={handleClose}>Batal</Button>
                            <Button type="submit" form="participantForm" disabled={processing}>
                                {processing ? <Loader2 className="animate-spin" /> : 'Simpan Data'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}