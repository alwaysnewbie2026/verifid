import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Loader2, ArrowRight, AlertCircle, RefreshCw, Zap, FileCheck, 
  UserCheck, Globe, Award, CheckCircle2, GraduationCap, BookOpen, 
  Calendar, Clock, ChevronRight, Download 
} from 'lucide-react';

export default function HeroSection({ 
  searchId, 
  setSearchId, 
  searchStatus, 
  searchResult, 
  errorMessage, 
  handleSearch, 
  resetSearch, 
  searchInputRef 
}) {
  const fadeInLeft = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } } };
  const wordReveal = { hidden: { y: 100, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
  const fadeInUp = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } } };
  const scaleIn = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } };
  const pulseAnimation = { animate: { boxShadow: ['0 0 20px rgba(139, 92, 246, 0.3)', '0 0 40px rgba(34, 211, 238, 0.3)', '0 0 20px rgba(139, 92, 246, 0.3)'], transition: { duration: 3, repeat: Infinity } } };

  return (
    <section id="beranda" className="min-h-screen flex items-center pt-20 container mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-20 items-center w-full">
        <div className="max-w-2xl">
          <motion.div variants={fadeInLeft} initial="hidden" animate="visible" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold tracking-wide uppercase mb-8 backdrop-blur-sm">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-cyan-400">
              <Award size={14} />
            </motion.div>
            <span>Platform Verifikasi Terpercaya</span>
          </motion.div>
          
          <h1 className="font-bold text-5xl lg:text-7xl xl:text-8xl leading-[1.1] mb-8 overflow-hidden">
            <motion.div className="overflow-hidden"><motion.span variants={wordReveal} initial="hidden" animate="visible" className="inline-block">Verifikasi</motion.span></motion.div>
            <motion.div className="overflow-hidden"><motion.span variants={wordReveal} initial="hidden" animate="visible" className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400">Keaslian</motion.span></motion.div>
            <motion.div className="overflow-hidden"><motion.span variants={wordReveal} initial="hidden" animate="visible" className="inline-block">Sertifikat</motion.span></motion.div>
          </h1>
          
          <motion.p variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg">
            Sistem verifikasi digital terintegrasi untuk memastikan keaslian sertifikat dan keanggotaan peserta kursus. Cepat, akurat, dan dapat diakses 24/7.
          </motion.p>
          
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.6 }} className="relative">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative bg-[#12121a] rounded-2xl p-2 border border-white/10">
                <div className="flex items-center">
                  <div className="pl-4 text-violet-400"><Search size={24} /></div>
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    value={searchId} 
                    onChange={(e) => { 
                      setSearchId(e.target.value); 
                      if (searchStatus === 'error') resetSearch(); 
                    }} 
                    placeholder="Masukkan ID Peserta (STD-2024-8892)" 
                    className="w-full py-5 px-4 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 font-medium text-lg outline-none" 
                    disabled={searchStatus === 'loading'} 
                  />
                  <motion.button 
                    type="submit" 
                    disabled={searchStatus === 'loading' || !searchId.trim()} 
                    className="mr-2 px-6 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    {searchStatus === 'loading' ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Memverifikasi...</span>
                      </>
                    ) : (
                      <>
                        <span>Cari</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
            
            <AnimatePresence>
              {searchStatus === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  className="mt-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                >
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                  <motion.button 
                    onClick={resetSearch} 
                    className="ml-auto text-red-400 hover:text-red-300" 
                    whileHover={{ rotate: 180 }} 
                    transition={{ duration: 0.3 }}
                  >
                    <RefreshCw size={14} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {searchStatus === 'idle' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 1 }} 
                className="mt-4 flex items-center gap-2 text-sm text-gray-500"
              >
                <Zap size={14} className="text-cyan-400" />
                <span>Coba ID: <motion.code 
                  className="bg-white/5 px-2 py-1 rounded text-violet-300 cursor-pointer hover:text-violet-200" 
                  whileHover={{ scale: 1.05 }} 
                  onClick={() => setSearchId('STD-2024-8892')}
                >STD-2024-8892</motion.code></span>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible" 
            transition={{ delay: 0.8 }} 
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            {[ 
              { num: "10k+", label: "Sertifikat", icon: FileCheck, color: "text-emerald-400" }, 
              { num: "50+", label: "Mitra", icon: UserCheck, color: "text-violet-400" }, 
              { num: "99.9%", label: "Uptime", icon: Globe, color: "text-cyan-400" } 
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp} 
                className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5" 
                whileHover={{ scale: 1.05, borderColor: 'rgba(139, 92, 246, 0.3)' }}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <div>
                  <p className="font-bold text-white text-sm">{item.num}</p>
                  <p className="text-xs text-gray-400">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <div className="relative h-[600px] lg:h-[700px] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="w-[500px] h-[500px] border border-violet-500/10 rounded-full" 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
            />
            <motion.div 
              className="w-[400px] h-[400px] border border-cyan-500/10 rounded-full" 
              animate={{ rotate: -360 }} 
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
            />
          </div>
          
          <AnimatePresence mode="wait">
            {searchStatus === 'idle' || searchStatus === 'loading' ? (
              <motion.div 
                key="initial" 
                variants={scaleIn} 
                initial="hidden" 
                animate="visible" 
                exit={{ opacity: 0, scale: 0.8, rotateY: 10 }} 
                className="relative w-full max-w-md"
              >
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-cyan-600/20 to-emerald-600/20 rounded-3xl blur-xl" />
                  <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <motion.div 
                      className="w-32 h-32 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-white/10" 
                      variants={pulseAnimation} 
                      animate="animate"
                    >
                      {searchStatus === 'loading' ? (
                        <Loader2 className="animate-spin text-white w-16 h-16" />
                      ) : (
                        <Award className="text-white w-16 h-16" />
                      )}
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-2xl mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        {searchStatus === 'loading' ? 'Memverifikasi...' : 'Verifikasi Sertifikat'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {searchStatus === 'loading' 
                          ? 'Sedang mencari data peserta...' 
                          : 'Masukkan ID unik untuk memverifikasi keaslian sertifikat.'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : searchStatus === 'success' && searchResult ? (
              // ✅ HASIL VERIFIKASI TANPA FOTO PROFIL
              <motion.div 
                key="result" 
                initial={{ opacity: 0, scale: 0.5, rotateY: -30 }} 
                animate={{ opacity: 1, scale: 1, rotateY: 0 }} 
                exit={{ opacity: 0, scale: 0.8 }} 
                transition={{ type: "spring", stiffness: 100, damping: 20 }} 
                className="relative w-full max-w-md verification-result" // ✅ Class untuk scroll smooth
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 rounded-3xl blur-2xl opacity-40" />
                <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <div className="bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 p-6 relative">
                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <GraduationCap className="text-white w-5 h-5" />
                          </div>
                          <span className="text-white/80 text-xs font-bold tracking-widest uppercase">Certificate</span>
                        </div>
                        <h2 className="text-white font-bold text-2xl">Verified Member</h2>
                      </div>
                      <motion.div 
                        className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold" 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        transition={{ type: "spring", delay: 0.5 }}
                      >
                        <CheckCircle2 size={14} /> Verified
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* ✅ FOTO DIHAPUS - LANGSUNG TAMPILKAN NAMA DAN ID */}
                    <div className="mb-6 pb-6 border-b border-white/5">
                      <h3 className="text-xl font-bold text-white mb-1">{searchResult.name}</h3>
                      <p className="text-violet-400 text-sm font-mono">{searchResult.id}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {searchResult.certificate || 'Sertifikat Tersedia'}
                      </p>
                      
                      {/* ✅ TOMBOL DOWNLOAD SERTIFIKAT JIKA ADA */}
                      {searchResult.has_certificate && searchResult.certificate_url && (
                        <a
                          href={searchResult.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={`${searchResult.name.replace(/[<>:"/\\|?*]/g, '_')} - ${searchResult.id} - sertifikat.pdf`}
                          className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/30"
                        >
                          <Download size={14} />
                          Download Sertifikat PDF
                        </a>
                      )}
                    </div>
                    
                    <motion.div 
                      variants={staggerContainer} 
                      initial="hidden" 
                      animate="visible" 
                      className="grid grid-cols-2 gap-4 mb-6"
                    >
                      {[ 
                        { icon: BookOpen, label: "Program", value: searchResult.program, color: "text-cyan-400" }, 
                        { icon: Award, label: "Nilai", value: searchResult.grade, color: "text-emerald-400" }, 
                        { icon: Calendar, label: "Tanggal", value: searchResult.date, color: "text-violet-400" }, 
                        { icon: Clock, label: "Durasi", value: searchResult.hours, color: "text-amber-400" } 
                      ].map((item, idx) => (
                        <motion.div 
                          key={idx} 
                          variants={fadeInUp} 
                          className="bg-white/5 rounded-xl p-3 border border-white/5"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <item.icon className={`${item.color} w-3 h-3`} />
                            <span className="text-gray-400 text-[10px]">{item.label}</span>
                          </div>
                          <p className="text-white text-xs font-medium line-clamp-2">{item.value}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                      <div className="text-[10px] text-gray-500">
                        <p>Diverifikasi oleh</p>
                        <p className="text-gray-300 font-medium">{searchResult.instructor}</p>
                      </div>
                      <motion.button 
                        onClick={resetSearch} 
                        className="text-violet-400 hover:text-violet-300 text-xs font-medium flex items-center gap-1" 
                        whileHover={{ x: 5 }}
                      >
                        Cari Lagi <ChevronRight size={14} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}