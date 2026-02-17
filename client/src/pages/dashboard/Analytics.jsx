import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/analytics/dashboard');
        setStats(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const chartData = stats?.weeklyPerformance?.map(p => ({
    name: new Date(p._id).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    revenue: p.revenue || 0,
    leads: p.leads || 0
  })) || [];

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f97316'];
  const pieData = stats?.sourceBreakdown?.map((s, i) => ({
    name: s._id,
    value: s.value,
    color: COLORS[i % COLORS.length]
  })) || [];


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-10"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Advanced Analytics</h1>
          <p className="text-slate-500 text-sm font-medium">Deep dive into your sales and growth metrics.</p>
        </div>
        <select className="bg-white border border-slate-200 text-slate-500 text-[10px] font-black px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm">
          <option>LAST 30 DAYS</option>
          <option>LAST QUARTER</option>
          <option>LAST YEAR</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', val: `₹ ${(stats?.totalRevenue / 100000).toFixed(1)}L`, trend: 'Active', color: 'from-blue-600 to-indigo-700' },
          { label: 'Total Leads', val: stats?.totalLeads || 0, trend: '↑ Today', color: 'from-violet-600 to-purple-700' },
          { label: 'Conversion', val: `${(stats?.conversionRate || 0).toFixed(1)}%`, trend: 'Win Rate', color: 'from-rose-500 to-orange-600' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className={`bg-gradient-to-br ${stat.color} rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <h2 className="text-4xl font-black mb-2">{stat.val}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 bg-white/20 rounded-lg">{stat.trend}</span>
              <span className="text-[10px] text-white/50 font-bold">Real-time Data</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Revenue Trend (Last 7 Days)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`₹ ${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Lead Sources
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 pr-8">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs font-bold text-slate-600">{d.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{((d.value / (stats?.totalLeads || 1)) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Source Conversion Performance Table */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> Source Conversion Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Source</th>
                <th className="text-center py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Total Leads</th>
                <th className="text-center py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Won Leads</th>
                <th className="text-center py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Conversion Rate</th>
                <th className="text-right py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats?.sourceConversion?.map((source, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-bold text-slate-700 text-sm">{source._id || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-bold text-slate-600">{source.totalLeads}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-bold text-green-600">{source.wonLeads || 0}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(source.conversionRate || 0, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-black text-slate-700 min-w-[3rem]">
                        {(source.conversionRate || 0).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-bold text-blue-600">
                      ₹ {(source.totalRevenue || 0).toLocaleString()}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {(!stats?.sourceConversion || stats.sourceConversion.length === 0) && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 text-sm font-medium">
                    No conversion data available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
