import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileDown, FileUp, AlertTriangle, Trash2, CheckCircle2, Loader2, Info, Upload, Database, BellRing } from 'lucide-react';
import { Button } from './UIComponents';
import { useForm, router, usePage } from '@inertiajs/react';

export default function ImportBulkModal({ isOpen, onClose }) {
    const page = usePage();
    const [activeTab, setActiveTab] = useState('import');
    const [dragActive, setDragActive] = useState(false);
    const [bulkIds, setBulkIds] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [importStep, setImportStep] = useState('upload');
    const [isDeleting, setIsDeleting] = useState(false);

    // ✅ State untuk Custom Aesthetic Alert/Confirm Modal
    const [dialog, setDialog] = useState({ isOpen: false, type: 'info', title: '', message: '', onConfirm: null });

    const showDialog = (type, title, message, onConfirm = null) => {
        setDialog({ isOpen: true, type, title, message, onConfirm });
    };
    const closeDialog = () => setDialog({ ...dialog, isOpen: false });

    const { data: importData, setData: setImportData, post: postImport, processing: importing, reset: resetImport, errors: importErrors } = useForm({ file: null });

    const handleClose = () => {
        resetImport();
        setBulkIds('');
        setShowPreview(false);
        setPreviewData(null);
        setImportStep('upload');
        setIsDeleting(false);
        onClose();
    };

    const handleImportSubmit = (e) => {
        e.preventDefault();
        if (!importData.file) {
            showDialog('warning', 'File Kosong', 'Mohon pilih file CSV terlebih dahulu sebelum menganalisis.');
            return;
        }
        setImportStep('processing');
        
        postImport('/admin-panel/participants/import', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: (page) => {
                const flash = page.props.flash;
                if (flash?.error) {
                    showDialog('error', 'Import Gagal', flash.error);
                    setImportStep('upload');
                } else if (flash?.import_preview) {
                    setPreviewData(flash.import_preview);
                    setImportStep('preview');
                } else {
                    handleClose();
                }
            },
            onError: (errors) => {
                setImportStep('upload');
                showDialog('error', 'Terjadi Kesalahan', Object.values(errors).join(', '));
            },
            onFinish: () => setImportData('file', null)
        });
    };

    const handleConfirmImport = () => {
        if (!previewData) return;
        setImportStep('processing');
        
        router.post('/admin-panel/participants/confirm-import', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setImportStep('done');
                setTimeout(() => {
                    showDialog('success', 'Import Sukses', `${previewData.total} data peserta berhasil ditambahkan ke sistem.`);
                    handleClose();
                }, 1500);
            },
            onError: (errors) => {
                setImportStep('preview');
                showDialog('error', 'Gagal Import', Object.values(errors).join(', '));
            }
        });
    };

    const handleBulkDelete = () => {
        const idsArray = bulkIds.split(/[\n,]+/).map(id => id.trim()).filter(id => id !== '');
        
        if (idsArray.length === 0) {
            showDialog('warning', 'Input Kosong', 'Masukkan setidaknya satu ID Peserta untuk dihapus.');
            return;
        }

        // ✅ Menggunakan Custom Confirm Dialog
        showDialog(
            'danger', 
            'Konfirmasi Hapus Massal', 
            `Anda yakin ingin MENGHAPUS PERMANEN ${idsArray.length} data peserta tersebut? Tindakan ini tidak dapat dibatalkan.`, 
            () => executeDelete(idsArray)
        );
    };

    const executeDelete = (idsArray) => {
        closeDialog();
        setIsDeleting(true);
        
        router.post('/admin-panel/participants/bulk-delete', { ids: idsArray }, {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.flash.message) {
                    showDialog('success', 'Berhasil Dihapus', page.props.flash.message);
                    setBulkIds('');
                } else if (page.props.flash.error) {
                    showDialog('error', 'Gagal Menghapus', page.props.flash.error);
                }
            },
            onError: (errors) => {
                showDialog('error', 'Kesalahan Sistem', Object.values(errors).join(', '));
            },
            onFinish: () => setIsDeleting(false)
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
                    {/* Background Overlay Utama */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#05050a]/80 backdrop-blur-md" onClick={handleClose} />
                    
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-3xl bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header Modal Utama */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-violet-900/20 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                    <Database className="text-white w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-wide">Kelola Data Massal</h3>
                                    <p className="text-xs text-violet-300/70">Import CSV & Bulk Actions</p>
                                </div>
                            </div>
                            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-white/5 bg-black/20">
                            <button onClick={() => { setActiveTab('import'); setImportStep('upload'); }}
                                className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === 'import' ? 'text-violet-400' : 'text-gray-400 hover:text-white'}`}>
                                Import Data (CSV)
                                {activeTab === 'import' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />}
                            </button>
                            <button onClick={() => setActiveTab('delete')}
                                className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === 'delete' ? 'text-rose-400' : 'text-gray-400 hover:text-white'}`}>
                                Hapus Massal
                                {activeTab === 'delete' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />}
                            </button>
                        </div>

                        {/* Konten Modal Utama */}
                        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {activeTab === 'import' && (
                                    <motion.div key="import" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                        {/* (UI Panduan Import Tetap Sama) */}
                                        <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-xl p-4 mb-6 flex gap-3 backdrop-blur-sm">
                                            <Info className="text-cyan-400 shrink-0" size={20} />
                                            <div className="text-sm">
                                                <p className="text-cyan-300 font-bold mb-1">Panduan Import:</p>
                                                <ol className="list-decimal list-inside text-gray-300 space-y-1">
                                                    <li>Download template CSV yang disediakan.</li>
                                                    <li>Isi data tanpa mengubah nama kolom (baris pertama).</li>
                                                    <li>Format tanggal: <code className="bg-black/40 px-1.5 py-0.5 rounded text-cyan-400 border border-white/5">YYYY-MM-DD</code></li>
                                                </ol>
                                                <a href="/admin-panel/participants/template" className="inline-flex items-center gap-2 mt-3 text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                                                    <FileDown size={16} /> Download Template CSV
                                                </a>
                                            </div>
                                        </div>

                                        {importStep === 'upload' && (
                                            <form onSubmit={handleImportSubmit}>
                                                <div className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 relative overflow-hidden ${
                                                        dragActive ? 'border-violet-500 bg-violet-500/10 shadow-[inset_0_0_30px_rgba(139,92,246,0.1)]' : 'border-white/10 hover:border-violet-500/50 hover:bg-white/5'
                                                    }`}
                                                    onDragEnter={() => setDragActive(true)} onDragLeave={() => setDragActive(false)} onDrop={() => setDragActive(false)}
                                                >
                                                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".csv,.txt" onChange={e => setImportData('file', e.target.files[0])} />
                                                    <div className="flex flex-col items-center gap-3 pointer-events-none">
                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                                            importData.file ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] rotate-6' : 'bg-white/5 text-gray-400'
                                                        }`}>
                                                            {importData.file ? <CheckCircle2 size={28} /> : <FileUp size={28} />}
                                                        </div>
                                                        <div>
                                                            {importData.file ? (
                                                                <p className="text-emerald-400 font-medium text-lg">{importData.file.name}</p>
                                                            ) : (
                                                                <p className="text-gray-300 text-lg">Tarik & Lepas file CSV ke sini</p>
                                                            )}
                                                            <p className="text-gray-500 text-sm mt-1">atau klik untuk menelusuri</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-6 flex justify-end">
                                                    <Button type="submit" disabled={importing || !importData.file}>
                                                        {importing ? <Loader2 className="animate-spin mr-2" /> : 'Analisis CSV'}
                                                    </Button>
                                                </div>
                                            </form>
                                        )}

                                        {importStep === 'preview' && previewData && (
                                            <div className="space-y-4">
                                                <div className="flex gap-4">
                                                    <div className="flex-1 bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
                                                        <CheckCircle2 className="text-emerald-400" size={24} />
                                                        <div>
                                                            <p className="text-emerald-300 font-bold text-lg">{previewData.total} Data Baru</p>
                                                            <p className="text-emerald-400/60 text-xs">Siap diimport</p>
                                                        </div>
                                                    </div>
                                                    {/* ✅ Indikator Data Duplikat yang Dilewati */}
                                                    {previewData.duplicates > 0 && (
    <div className="flex-1 bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle className="text-amber-400" size={24} />
        <div>
            <p className="text-amber-300 font-bold text-lg">{previewData.duplicates} Data Terbuang</p>
            <p className="text-amber-400/70 text-xs mt-0.5 leading-tight">
                Otomatis dilewati karena sudah ada di Database / duplikat kembar di dalam file CSV.
            </p>
        </div>
    </div>
)}
                                                </div>
                                                
                                                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40 backdrop-blur-sm">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-white/5 border-b border-white/10">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left text-gray-400 font-medium">Nama</th>
                                                                <th className="px-4 py-3 text-left text-gray-400 font-medium">ID</th>
                                                                <th className="px-4 py-3 text-left text-gray-400 font-medium">Program</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-white/5">
                                                            {previewData.preview.map((item, idx) => (
                                                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                                    <td className="px-4 py-3 text-white">{item.name}</td>
                                                                    <td className="px-4 py-3 text-violet-300 font-mono text-xs">{item.participant_id}</td>
                                                                    <td className="px-4 py-3 text-gray-300">{item.program}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="flex justify-end gap-3 mt-4">
                                                    <Button variant="ghost" onClick={() => setImportStep('upload')}>Batal</Button>
                                                    <Button onClick={handleConfirmImport}>
                                                        <Upload className="mr-2" size={16} /> Import {previewData.total} Data
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {importStep === 'processing' && (
                                            <div className="py-16 flex flex-col items-center justify-center">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-violet-500 blur-xl opacity-20 rounded-full animate-pulse" />
                                                    <Loader2 className="w-16 h-16 text-violet-400 animate-spin relative z-10" />
                                                </div>
                                                <p className="text-white font-bold text-lg mt-6 tracking-wide">Memproses Data...</p>
                                            </div>
                                        )}
                                        {importStep === 'done' && (
                                            <div className="py-16 text-center">
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                                    <CheckCircle2 className="text-emerald-400" size={40} />
                                                </motion.div>
                                                <p className="text-white font-bold text-2xl tracking-wide">Berhasil!</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'delete' && (
                                    <motion.div key="delete" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-4 mb-6 flex gap-3 backdrop-blur-sm">
                                            <AlertTriangle className="text-rose-400 shrink-0" size={20} />
                                            <div className="text-sm">
                                                <p className="text-rose-300 font-bold mb-1">Peringatan Penghapusan:</p>
                                                <p className="text-rose-200/70">Fitur ini akan menghapus data secara permanen. Masukkan ID dengan benar.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <textarea
                                                    value={bulkIds}
                                                    onChange={(e) => setBulkIds(e.target.value)}
                                                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all min-h-[150px] font-mono text-sm placeholder-gray-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                                                    placeholder="Contoh:&#10;STD-2024-9001&#10;STD-2024-9002"
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <Button variant="danger" onClick={handleBulkDelete} disabled={isDeleting || !bulkIds.trim()}>
                                                    {isDeleting ? <Loader2 className="animate-spin mr-2" /> : <Trash2 className="mr-2" size={16} />}
                                                    {isDeleting ? 'Menghapus...' : 'Hapus Data Terpilih'}
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* ✅ CUSTOM AESTHETIC DIALOG MODAL (Pengganti Alert) */}
            <AnimatePresence>
                {dialog.isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeDialog} />
                        
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-[#161622] border border-white/10 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            {/* Glow Effect di Background Dialog */}
                            <div className={`absolute -top-20 -left-20 w-40 h-40 blur-[80px] rounded-full opacity-20 pointer-events-none ${
                                dialog.type === 'danger' || dialog.type === 'error' ? 'bg-rose-500' :
                                dialog.type === 'success' ? 'bg-emerald-500' : 'bg-violet-500'
                            }`} />

                            <div className="relative z-10 flex flex-col items-center">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${
                                    dialog.type === 'danger' || dialog.type === 'error' ? 'bg-rose-500/20 text-rose-400 shadow-rose-500/20' :
                                    dialog.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 shadow-emerald-500/20' :
                                    'bg-violet-500/20 text-violet-400 shadow-violet-500/20'
                                }`}>
                                    {dialog.type === 'danger' || dialog.type === 'error' ? <AlertTriangle size={32} /> :
                                     dialog.type === 'success' ? <CheckCircle2 size={32} /> : <BellRing size={32} />}
                                </div>
                                
                                <h4 className="text-xl font-bold text-white mb-2 tracking-wide">{dialog.title}</h4>
                                <p className="text-gray-400 text-sm mb-8 leading-relaxed">{dialog.message}</p>
                                
                                <div className="flex gap-3 w-full">
                                    {dialog.onConfirm ? (
                                        <>
                                            <button onClick={closeDialog} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent">
                                                Batal
                                            </button>
                                            <button onClick={dialog.onConfirm} className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white shadow-lg transition-all ${
                                                dialog.type === 'danger' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/25' : 'bg-violet-500 hover:bg-violet-600 shadow-violet-500/25'
                                            }`}>
                                                Ya, Lanjutkan
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={closeDialog} className={`w-full py-2.5 rounded-xl text-sm font-medium text-white shadow-lg transition-all ${
                                            dialog.type === 'error' ? 'bg-rose-500 hover:bg-rose-600' :
                                            dialog.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-violet-500 hover:bg-violet-600'
                                        }`}>
                                            Mengerti
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AnimatePresence>
    );
}