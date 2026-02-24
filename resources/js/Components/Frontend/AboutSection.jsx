import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Globe, FileCheck, BookOpen, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const fadeInUp = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

  return (
    <section id="tentang" className="py-24 container mx-auto px-6 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-block px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-bold mb-4">Tentang Kami</span>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Mengapa Memilih <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">VerifID?</span></h2>
        <p className="text-gray-400 text-lg">Platform verifikasi modern dengan teknologi terkini untuk pengalaman yang cepat, aman, dan terpercaya bagi seluruh peserta kursus.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {[{ icon: Zap, title: "Verifikasi Instant", desc: "Hasil pencarian muncul dalam hitungan detik dengan akurasi data 100% real-time.", gradient: "from-violet-500 to-purple-500", delay: 0 }, { icon: ShieldCheck, title: "Keamanan Terjamin", desc: "Data peserta terenkripsi dengan standar keamanan tingkat enterprise.", gradient: "from-cyan-500 to-blue-500", delay: 0.2 }, { icon: Globe, title: "Akses Global 24/7", desc: "Dapat diakses dari mana saja, kapan saja, tanpa batasan waktu dan lokasi.", gradient: "from-emerald-500 to-green-500", delay: 0.4 }].map((feature, idx) => (
          <motion.div key={idx} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: feature.delay }} className="group relative bg-gradient-to-br from-white/5 to-white/0 rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden" whileHover={{ y: -5 }}>
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            <motion.div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`} whileHover={{ rotate: 5 }}><feature.icon className="text-white w-7 h-7" /></motion.div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-cyan-400 transition-all">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12">
        {[{ number: "10,000+", label: "Sertifikat", icon: FileCheck }, { number: "500+", label: "Program", icon: BookOpen }, { number: "50+", label: "Mitra", icon: Globe }, { number: "99.9%", label: "Akurasi", icon: CheckCircle2 }].map((stat, idx) => (
          <motion.div key={idx} className="text-center group" whileHover={{ scale: 1.05 }}>
            <stat.icon className="w-8 h-8 mx-auto mb-4 text-gray-500 group-hover:text-violet-400 transition-colors" />
            <h3 className="text-3xl font-bold mb-1 text-white">{stat.number}</h3>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}