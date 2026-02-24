import React from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Award, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, Select } from './UIComponents';

const CHART_DATA = [
    { name: 'Jan', lulus: 40, tidak: 24 }, { name: 'Feb', lulus: 30, tidak: 13 },
    { name: 'Mar', lulus: 20, tidak: 58 }, { name: 'Apr', lulus: 27, tidak: 39 },
    { name: 'May', lulus: 18, tidak: 48 }, { name: 'Jun', lulus: 23, tidak: 38 },
    { name: 'Jul', lulus: 34, tidak: 43 },
];

const PIE_DATA = [
    { name: 'Lulus', value: 400, color: '#8b5cf6' },
    { name: 'Tidak Lulus', value: 100, color: '#ef4444' },
    { name: 'Proses', value: 50, color: '#06b6d4' },
];

export default function DashboardView({ participants, logs }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Peserta", value: participants.length, icon: Users, color: "from-violet-500 to-purple-500" },
                    { label: "Lulus", value: participants.filter(p => p.status === 'Lulus').length, icon: GraduationCap, color: "from-emerald-500 to-green-500" },
                    { label: "Sertifikat Terbit", value: participants.filter(p => p.certificate).length, icon: Award, color: "from-cyan-500 to-blue-500" },
                    { label: "Aktivitas Hari Ini", value: logs.filter(l => l.time.includes(new Date().toLocaleDateString('id-ID').split('/')[2])).length, icon: Activity, color: "from-amber-500 to-orange-500" },
                ].map((stat, idx) => (
                    <Card key={idx} className="relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                <stat.icon className="text-white w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Statistik Kelulusan</h3>
                        <Select options={[{value: 'year', label: 'Tahun Ini'}]} className="w-32" />
                    </div>
                    {/* ✅ FIX: Tambahkan wrapper dengan height pasti */}
                    <div className="h-[300px] w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={CHART_DATA}>
                                <defs>
                                    <linearGradient id="colorLulus" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                                    <linearGradient id="colorTidak" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                                <Area type="monotone" dataKey="lulus" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorLulus)" />
                                <Area type="monotone" dataKey="tidak" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorTidak)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="min-h-[400px]">
                    <h3 className="text-lg font-bold text-white mb-6">Distribusi Status</h3>
                    {/* ✅ FIX: Tambahkan wrapper dengan height pasti */}
                    <div className="h-[300px] w-full min-h-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                                    {PIE_DATA.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke="none" />))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-white">{participants.length}</span>
                                <span className="text-xs text-gray-400 uppercase">Total</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3 mt-4">
                        {PIE_DATA.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-gray-300">{item.name}</span>
                                </div>
                                <span className="font-bold text-white">{Math.round((item.value / 550) * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </motion.div>
    );
}