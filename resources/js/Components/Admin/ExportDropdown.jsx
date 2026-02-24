import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';

export default function ExportDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Menutup dropdown saat klik di luar area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExport = (type) => {
        // MENGGUNAKAN WINDOW.LOCATION AGAR BROWSER BISA MENERIMA STREAM FILE
        window.location.href = `/admin-panel/participants/export/${type}`;
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-emerald-400/20"
            >
                <Download size={16} />
                <span>Export Data</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-[#161622] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1"
                    >
                        <button
                            onClick={() => handleExport('excel')}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-emerald-500/20 transition-colors group"
                        >
                            <FileSpreadsheet className="text-emerald-500 group-hover:text-emerald-400" size={18} />
                            <span>Export as Excel</span>
                        </button>
                        
                        <div className="h-px w-full bg-white/5 my-1" />
                        
                        <button
                            onClick={() => handleExport('pdf')}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-rose-500/20 transition-colors group"
                        >
                            <FileText className="text-rose-500 group-hover:text-rose-400" size={18} />
                            <span>Export as PDF</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}