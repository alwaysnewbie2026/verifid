import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, Download, Plus, FileText, Edit, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Card, Button, Select, Badge } from './UIComponents';
import ExportDropdown from './ExportDropdown';

export default function ParticipantsView({ 
    filteredParticipants, 
    searchTerm, 
    setSearchTerm, 
    filterStatus, 
    setFilterStatus, 
    handleOpenModal, 
    handleDeleteParticipant, 
    openImportModal 
}) {
  
  // --- STATE UNTUK PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset ke halaman 1 setiap kali user melakukan pencarian atau filter
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Logika pemotongan data untuk pagination
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedParticipants = filteredParticipants.slice(startIndex, startIndex + itemsPerPage);

  // --- STATE UNTUK MODAL PDF ---
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');
  
  const handleViewPdf = (participant) => {
  setSelectedPdfUrl(`/storage/${participant.certificate}`);
  setSelectedParticipant({
    name: participant.name,
    participant_id: participant.participant_id
  });
  setIsPdfModalOpen(true);
};

  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // Generate nomor halaman untuk ditampilkan
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 relative">
      <Card className="py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Bagian Kiri: Search & Filter */}
          <div className="flex flex-col sm:flex-row flex-1 gap-4 w-full">
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Cari nama atau ID..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-all [color-scheme:dark]" 
              />
            </div>
            <div className="w-full sm:w-auto min-w-[160px]">
              <Select 
                options={[
                  { value: 'All', label: 'Semua Status' }, 
                  { value: 'Lulus', label: 'Lulus' }, 
                  { value: 'Tidak Lulus', label: 'Tidak Lulus' }
                ]} 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)} 
              />
            </div>
          </div>

          {/* Bagian Kanan: Aksi (Import, Export, Tambah) */}
          <div className="grid grid-cols-2 md:flex md:items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
            <Button variant="secondary" onClick={openImportModal} className="justify-center w-full">
               <Upload size={16} className="mr-2" /> Bulk Actions
            </Button>
            
            <ExportDropdown />
            
            <Button onClick={() => handleOpenModal()} className="col-span-2 md:col-span-1 justify-center w-full">
              <Plus size={16} className="mr-2" /> Tambah Peserta
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-0 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Peserta</th>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Program</th>
                <th className="px-6 py-4 font-medium">Nilai</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              
              {/* ✅ MAPPING DATA KE DALAM TABEL */}
              {paginatedParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center text-violet-400 font-bold text-sm border border-violet-500/20 shrink-0">
                                  {p.name ? p.name.charAt(0).toUpperCase() : '?'}
                              </div>
                              <div>
                                  <p className="font-medium text-white line-clamp-1">{p.name}</p>
                                  {p.certificate ? (
                                      <button 
  onClick={() => handleViewPdf(p)}  // Kirim seluruh objek participant
  className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 hover:text-emerald-300 transition-colors"
>
  <FileText size={10} /> 
  <span className="border-b border-transparent hover:border-emerald-400">Lihat Sertifikat</span>
</button>
                                  ) : (
                                      <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                          <FileText size={10} /> Tidak Ada
                                      </span>
                                  )}
                              </div>
                          </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 font-mono text-sm">{p.participant_id}</td>
                      <td className="px-6 py-4 text-gray-300">{p.program}</td>
                      <td className="px-6 py-4 text-white font-bold">{p.grade}</td>
                      <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                              p.status === 'Lulus' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                              {p.status}
                          </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{p.date}</td>
                      <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                              <button onClick={() => handleOpenModal(p)} className="p-2 text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors">
                                  <Edit size={16} />
                              </button>
                              <button onClick={() => handleDeleteParticipant(p.id, p.name)} className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                                  <Trash2 size={16} />
                              </button>
                          </div>
                      </td>
                  </tr>
              ))}

              {/* Pesan Data Kosong */}
              {filteredParticipants.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <p>Data tidak ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* --- PAGINATION FOOTER --- */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 bg-[#0a0a0f]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              Menampilkan <span className="font-medium text-white">{startIndex + 1}</span> hingga <span className="font-medium text-white">{Math.min(startIndex + itemsPerPage, filteredParticipants.length)}</span> dari <span className="font-medium text-white">{filteredParticipants.length}</span> data
            </p>
            
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((number) => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all ${
                      currentPage === number
                        ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/20 border-transparent'
                        : 'border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* ✅ POSISI MODAL PDF YANG BENAR (Di Luar Tabel, Di Paling Bawah) */}
      <AnimatePresence>
          {isPdfModalOpen && (
              <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                  <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      className="absolute inset-0 bg-black/90 backdrop-blur-md"
                      onClick={() => setIsPdfModalOpen(false)}
                  />
                  
                  <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                      animate={{ opacity: 1, scale: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                      className="relative w-full max-w-5xl bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden"
                  >
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-violet-900/20 to-transparent">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                  <FileText className="text-emerald-400" size={16} />
                              </div>
                              <div>
                                  <h3 className="text-md font-bold text-white leading-tight">Preview Sertifikat</h3>
                                  <p className="text-xs text-gray-400">{selectedPdfUrl.split('/').pop()}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                              <a 
  href={selectedPdfUrl} 
  download={`${selectedParticipant?.name?.replace(/[<>:"/\\|?*]/g, '_')} - ${selectedParticipant?.participant_id} - sertifikat.pdf`}
  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
  title="Download PDF"
>
  <Download size={18} />
</a>
                              <button 
                                  onClick={() => setIsPdfModalOpen(false)} 
                                  className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              >
                                  <X size={18} />
                              </button>
                          </div>
                      </div>
                      
                      <div className="flex-1 bg-[#0a0a0f] relative w-full h-full p-2">
                          <iframe 
                              src={`${selectedPdfUrl}#toolbar=0`} 
                              className="w-full h-full rounded-xl border border-white/5 bg-white" 
                              title="PDF Viewer"
                          />
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

    </motion.div>
  );
}