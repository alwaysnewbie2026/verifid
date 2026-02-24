import React, { useState, useMemo, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, Button } from '@/Components/Admin/UIComponents';
import DashboardView from '@/Components/Admin/DashboardView';
import ParticipantsView from '@/Components/Admin/ParticipantsView';
import ParticipantModal from '@/Components/Admin/ParticipantModal';
import ImportBulkModal from '@/Components/Admin/ImportBulkModal';
import SettingsView from '@/Components/Admin/SettingsView';

export default function AdminPanel({ dbParticipants = [], dbLogs = [] }) {
  const page = usePage();
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // ✅ STATE UNTUK PAGINATION LOGS
  const [logsLimit, setLogsLimit] = useState(20);
  
  // ✅ RESET PAGINATION SAAT GANTI VIEW KE LOGS
  useEffect(() => {
    if (currentView === 'logs') {
      setLogsLimit(20);
    }
  }, [currentView]);

  // ✅ LOGS YANG DITAMPILKAN (dipaginasi)
  const displayedLogs = useMemo(() => {
    return dbLogs.slice(0, logsLimit);
  }, [dbLogs, logsLimit]);

  // Modal & Search States (tidak berubah)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Flash messages handler (tidak berubah)
  useEffect(() => {
    const flash = page.props.flash;
    if (flash?.message) console.log('Success:', flash.message);
    if (flash?.error) console.log('Error:', flash.error);
  }, [page.props.flash]);

  const handleOpenModal = (participant = null) => {
    setEditingParticipant(participant);
    setIsModalOpen(true);
  };

  const handleDeleteParticipant = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus data ${name}?`)) {
      router.delete(`/admin-panel/participants/${id}`, { preserveScroll: true });
    }
  };

  const filteredParticipants = useMemo(() => {
    return dbParticipants.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.participant_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [dbParticipants, searchTerm, filterStatus]);

  return (
    <AdminLayout 
      currentView={currentView} 
      setCurrentView={setCurrentView} 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen} 
      logs={dbLogs.slice(0, 5)} // Hanya 5 terbaru untuk notifikasi dropdown
    >
      <Head title="Admin Dashboard - VerifID" />
      
      {currentView === 'dashboard' && <DashboardView participants={dbParticipants} logs={dbLogs.slice(0, 20)} />}
      
      {currentView === 'participants' && (
        <ParticipantsView
          filteredParticipants={filteredParticipants}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          handleOpenModal={handleOpenModal}
          handleDeleteParticipant={handleDeleteParticipant}
          openImportModal={() => setIsImportModalOpen(true)}
        />
      )}
      
      {/* ✅ VIEW LOGS DENGAN PAGINATION */}
      {currentView === 'logs' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="max-w-4xl mx-auto"
        >
          <Card>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white">Log Aktivitas Admin</h3>
              {dbLogs.length > 20 && (
                <span className="text-sm text-gray-400 bg-black/20 px-3 py-1 rounded-full">
                  {displayedLogs.length} dari {dbLogs.length} entri
                </span>
              )}
            </div>
            
            <div className="relative border-l border-white/10 ml-3 space-y-6 pb-8">
              <AnimatePresence mode="popLayout">
                {displayedLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    layout
                    className="relative pl-8"
                  >
                    <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-[#12121a] ${
                      log.type === 'auth' ? 'bg-violet-500' : 
                      log.type === 'create' ? 'bg-emerald-500' : 
                      log.type === 'delete' ? 'bg-rose-500' : 'bg-cyan-500'
                    }`} />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                      <div>
                        <p className="text-white font-medium group-hover:text-violet-400 transition-colors">
                          {log.action}
                        </p>
                        <p className="text-sm text-gray-400 mt-0.5">
                          oleh <span className="text-violet-400 font-medium">{log.user}</span>
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 font-mono bg-black/30 px-2.5 py-1.5 rounded whitespace-nowrap flex-shrink-0">
                        {log.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* ✅ TOMBOL "LOAD MORE" DENGAN ANIMASI */}
            <AnimatePresence>
              {logsLimit < dbLogs.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="text-center mt-6 pt-6 border-t border-white/5"
                >
                  <Button
                    onClick={() => setLogsLimit(prev => Math.min(prev + 20, dbLogs.length))}
                    className="px-6 py-3 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 hover:from-violet-600/30 hover:to-cyan-600/30 text-violet-300 hover:text-white border border-violet-500/20 hover:border-violet-500/40 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20"
                  >
                    <span className="flex items-center justify-center gap-2 mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Tampilkan {Math.min(20, dbLogs.length - logsLimit)} Lagi
                    </span>
                  </Button>
                  <p className="text-xs text-gray-500 mt-3">
                    Menampilkan {displayedLogs.length} dari {dbLogs.length} aktivitas terbaru
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* ✅ STATE "SEMUA DATA DITAMPILKAN" */}
            {logsLimit >= dbLogs.length && dbLogs.length > 20 && (
              <div className="text-center mt-6 pt-6 border-t border-white/5 text-green-400/80 text-sm font-medium">
                ✅ Semua {dbLogs.length} aktivitas telah ditampilkan
              </div>
            )}
            
            {/* ✅ STATE "TIDAK ADA DATA" */}
            {dbLogs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-lg font-medium mt-2">Belum ada aktivitas</p>
                <p className="text-gray-400 mt-1">Aktivitas admin akan muncul di sini saat terjadi perubahan data</p>
              </div>
            )}
          </Card>
        </motion.div>
      )}
      
      {currentView === 'settings' && <SettingsView />}
      
      <ParticipantModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingParticipant={editingParticipant}
      />
      <ImportBulkModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
    </AdminLayout>
  );
}