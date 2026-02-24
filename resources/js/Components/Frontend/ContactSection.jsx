import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactSection() {
  const fadeInLeft = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } } };
  const fadeInRight = { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } } };
  const scaleIn = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } };

  return (
    <>
      <section id="kontak" className="py-24 container mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-bold mb-4">Hubungi Kami</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Butuh Bantuan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Verifikasi?</span></h2>
            <p className="text-gray-400 text-lg mb-8">Tim support kami siap membantu Anda jika mengalami kendala dalam melakukan verifikasi sertifikat atau keanggotaan.</p>
            <div className="space-y-6">
              {[{ icon: Mail, label: "Email", value: "support@verifid.com" }, { icon: Phone, label: "Telepon", value: "+62 812 3456 7890" }, { icon: MapPin, label: "Alamat", value: "Jakarta Selatan, Indonesia" }].map((item, idx) => (
                <motion.div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5" whileHover={{ scale: 1.02, borderColor: 'rgba(34, 211, 238, 0.3)' }}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400"><item.icon size={20} /></div>
                  <div><p className="text-xs text-gray-500 uppercase font-bold">{item.label}</p><p className="text-white font-medium">{item.value}</p></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-gradient-to-br from-white/5 to-white/0 rounded-3xl p-8 border border-white/10">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm text-gray-400">Nama Lengkap</label><input type="text" className="w-full bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none" placeholder="John Doe" /></div>
                <div className="space-y-2"><label className="text-sm text-gray-400">Email</label><input type="email" className="w-full bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none" placeholder="john@example.com" /></div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Subjek</label>
                <select className="w-full bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none">
                  <option>Kendala Verifikasi</option><option>Kerjasama Institusi</option><option>Lainnya</option>
                </select>
              </div>
              <div className="space-y-2"><label className="text-sm text-gray-400">Pesan</label><textarea rows={4} className="w-full bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none" placeholder="Tuliskan pesan Anda disini..."></textarea></div>
              <motion.button type="button" className="w-full py-4 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl font-bold text-white flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Kirim Pesan <Send size={18} /></motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative bg-gradient-to-r from-violet-900/50 via-cyan-900/50 to-emerald-900/50 rounded-3xl p-12 md:p-20 overflow-hidden border border-white/10 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Siap Memverifikasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Sertifikat Anda?</span></h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">Akses sekarang juga untuk memverifikasi keaslian sertifikat dan data kepesertaan Anda dengan cepat dan mudah.</p>
            <motion.button onClick={() => document.getElementById('beranda').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white text-[#0a0a0f] rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Verifikasi Sekarang</motion.button>
          </div>
        </motion.div>
      </section>
    </>
  );
}