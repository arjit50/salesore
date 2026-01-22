import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const mockChartData = [
    { name: 'Mon', leads: 400, conv: 240 },
    { name: 'Tue', leads: 300, conv: 139 },
    { name: 'Wed', leads: 200, conv: 980 },
    { name: 'Thu', leads: 278, conv: 390 },
    { name: 'Fri', leads: 189, conv: 480 },
    { name: 'Sat', leads: 239, conv: 380 },
    { name: 'Sun', leads: 349, conv: 430 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/analytics/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-8"
    >
      {/* Top Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name || 'User'}!</h1>
          <p className="text-slate-500 text-sm font-medium">Here's what's happening with your sales today.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative group">
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all" />
                <span className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-500">🔍</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-1 pr-4 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-inner">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="text-xs">
                    <p className="font-bold text-slate-800">{user?.name || 'User'}</p>
                    <p className="text-slate-400 font-medium">{user?.role || 'Member'}</p>
                </div>
            </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'New Leads Today', val: stats?.newLeadsToday || 0, sub: `Total: ${stats?.totalLeads || 0}`, bg: 'blue' },
          { label: 'Conversion Rate', val: `${Math.round(stats?.conversionRate || 0)}%`, sub: 'Target: 30%', bg: 'emerald' },
          { label: 'Total Revenue', val: `₹ ${(stats?.totalRevenue || 0) / 1000}k`, sub: 'Won Leads', bg: 'orange' }
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all group"
          >
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-4 group-hover:text-blue-500 transition-colors">{card.label}</p>
            <div className="flex items-end justify-between">
                <h2 className="text-4xl font-black text-slate-800 tabular-nums">{card.val}</h2>
                <div className={`h-8 px-3 bg-${card.bg}-50 rounded-lg flex items-center justify-center text-${card.bg}-600 text-[10px] font-black border border-${card.bg}-100`}>
                  {card.sub}
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Graph and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-800">Sales Performance Overview</h3>
                <div className="flex gap-2">
                  <div className="flex items-center gap-4 mr-4 text-[10px] font-bold">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Leads</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Conversion</div>
                  </div>
                  <select className="text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg outline-none border border-slate-100 cursor-pointer">
                      <option>WEEKLY VIEW</option>
                      <option>MONTHLY VIEW</option>
                  </select>
                </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
                  <YAxis hide />
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                  <Area type="monotone" dataKey="conv" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorConv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
            <h3 className="font-bold text-slate-800 mb-6">Live Feed</h3>
            <div className="space-y-6 flex-1">
                {stats?.recentActivities?.length > 0 ? (
                  stats.recentActivities.map((act, i) => {
                    const colors = {
                      'New': 'blue',
                      'Contacted': 'orange',
                      'Qualified': 'purple',
                      'Lost': 'red',
                      'Won': 'emerald'
                    };
                    const color = colors[act.status] || 'slate';
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={act._id} 
                        className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-2xl transition-all"
                      >
                          <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-2xl bg-${color}-50 flex items-center justify-center text-sm font-bold text-${color}-600 border border-${color}-100 shadow-sm`}>
                                  {act.name[0]}
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{act.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold">{new Date(act.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                          </div>
                          <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-${color}-100 text-${color}-700 border border-${color}-200`}>
                              {act.status}
                          </span>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-10">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center">
                        <span className="text-2xl">⚡</span>
                    </div>
                    <p className="text-slate-400 text-xs font-bold text-center">No recent updates yet.</p>
                  </div>
                )}
            </div>
            <button className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-all border border-slate-100">
                View All Activity
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;