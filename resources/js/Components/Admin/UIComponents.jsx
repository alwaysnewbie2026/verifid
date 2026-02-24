import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

export const Card = ({ children, className = "" }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-[#12121a] border border-white/5 rounded-2xl p-6 shadow-xl ${className}`}>
    {children}
  </motion.div>
);

export const Button = ({ children, variant = "primary", className = "", onClick, icon: Icon, type = "button", form, ...props }) => {
  const baseStyle = "px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-violet-500/25 hover:scale-[1.02]",
    secondary: "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5"
  };
  return (
    <motion.button type={type} form={form} whileTap={{ scale: 0.96 }} className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick} {...props}>
      {Icon && <Icon size={18} />}
      {children}
    </motion.button>
  );
};

export const Input = ({ label, error, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>}
    <input 
      className={`w-full bg-[#0a0a0f] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer`} 
      {...props} 
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

export const Select = ({ label, options, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>}
    <div className="relative">
      <select className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" {...props}>
        {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
    </div>
  </div>
);

export const Badge = ({ status }) => {
  const styles = { Lulus: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "Tidak Lulus": "bg-red-500/10 text-red-400 border-red-500/20", Proses: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" };
  const icons = { Lulus: CheckCircle, "Tidak Lulus": XCircle, Proses: Activity };
  const Icon = icons[status] || Activity;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.Proses}`}>
      <Icon size={12} />{status}
    </span>
  );
};