import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingTarget, setIsUpdatingTarget] = useState(false);
  const [targetValue, setTargetValue] = useState(user?.salesTarget || 100000);

  useEffect(() => {
    setTargetValue(user?.salesTarget || 100000);
  }, [user]);

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

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateTarget = async () => {
    setIsUpdatingTarget(true);
    try {
        await updateProfile({
            ...user,
            salesTarget: targetValue
        });
        // Success feedback could be added here
    } catch (error) {
        console.error('Error updating target:', error);
    } finally {
        setIsUpdatingTarget(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const revenue = stats?.totalRevenue || 0;
  const target = user?.salesTarget || 100000;
  const progressPercent = Math.min(Math.round((revenue / target) * 100), 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-8"
    >
      {/* Top Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales Overview</h1>
          <p className="text-slate-500 text-sm font-medium">Real-time performance tracking and targets.</p>
        </div>
        <div className="flex items-center gap-4">
             {/* Target Input */}
             <div className="bg-white p-2 pl-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Monthly Target</div>
                <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-bold">₹</span>
                    <input 
                        type="number" 
                        value={targetValue}
                        onChange={(e) => setTargetValue(Number(e.target.value))}
                        className="w-24 bg-transparent font-bold text-slate-700 outline-none border-none text-sm"
                    />
                </div>
                <button 
                    onClick={handleUpdateTarget}
                    disabled={isUpdatingTarget || targetValue === user?.salesTarget}
                    className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:bg-slate-300"
                >
                    {isUpdatingTarget ? '...' : 'SET'}
                </button>
             </div>

            <Link to="/dashboard/settings" className="flex items-center gap-3 bg-white p-1 pr-4 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-inner">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="text-xs">
                    <p className="font-bold text-slate-800">{user?.name || 'User'}</p>
                </div>
            </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'New Leads Today', val: stats?.newLeadsToday || 0, sub: `Total: ${stats?.totalLeads || 0}`, bg: 'blue' },
          { label: 'Conversion Rate', val: `${Math.round(stats?.conversionRate || 0)}%`, sub: 'Target: 30%', bg: 'emerald' },
          { label: 'Total Revenue', val: `₹ ${(revenue / 1000).toFixed(1)}k`, sub: 'Won Leads', bg: 'orange' },
          { 
            label: 'Target Progress', 
            val: `${progressPercent}%`, 
            sub: `₹ ${revenue.toLocaleString()} / ₹ ${target.toLocaleString()}`, 
            bg: 'indigo' 
          }
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
                <h2 className="text-3xl font-black text-slate-800 tabular-nums">{card.val}</h2>
                <div className={`h-8 px-3 bg-${card.bg}-50 rounded-lg flex items-center justify-center text-${card.bg}-600 text-[10px] font-black border border-${card.bg}-100 whitespace-nowrap`}>
                  {card.sub}
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Performance Graph - Now Full Width */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-800">Sales Performance Overview</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-4 mr-4 text-[10px] font-bold">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Leads</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Won</div>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    LAST 7 DAYS
                </div>
              </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.weeklyPerformance || []}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                  labelStyle={{ marginBottom: '8px', color: '#64748b' }}
                />
                <XAxis 
                  dataKey="_id" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                  dy={10} 
                  tickFormatter={(val) => new Date(val).toLocaleDateString([], { weekday: 'short' })}
                />
                <YAxis hide />
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <Area type="monotone" dataKey="leads" name="New Leads" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="won" name="Won Deals" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorWon)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Breakdown */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Lead Source Breakdown</h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.sourceBreakdown || []} layout="vertical">
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="_id" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }}
                          width={100}
                        />
                        <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                        />
                        <Bar dataKey="value" name="Total Leads" radius={[0, 8, 8, 0]}>
                            {stats?.sourceBreakdown?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'][index % 4]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Motivation Card */}
        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 text-2xl font-bold">
                🚀
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">You're doing great!</h3>
            <p className="text-slate-500 font-medium mb-8 max-w-xs">
                {progressPercent >= 100 
                  ? "Target achieved! You're crushing it this month. Keep up the amazing work." 
                  : `You've achieved ${progressPercent}% of your goal. Only ₹ ${(target - revenue).toLocaleString()} more to go!`}
            </p>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress towards target</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;