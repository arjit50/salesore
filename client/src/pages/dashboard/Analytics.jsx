import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const Analytics = () => {
  const data = [
    { name: 'Jan', revenue: 4000, users: 400 },
    { name: 'Feb', revenue: 3000, users: 300 },
    { name: 'Mar', revenue: 5000, users: 500 },
    { name: 'Apr', revenue: 4500, users: 450 },
    { name: 'May', revenue: 6000, users: 600 },
    { name: 'Jun', revenue: 5500, users: 550 },
  ];

  const pieData = [
    { name: 'Direct', value: 400, color: '#3b82f6' },
    { name: 'Social', value: 300, color: '#6366f1' },
    { name: 'Email', value: 200, color: '#8b5cf6' },
    { name: 'Other', value: 100, color: '#ec4899' },
  ];

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
          { label: 'Total Revenue', val: '₹ 24.5L', trend: '↑ 15%', color: 'from-blue-600 to-indigo-700' },
          { label: 'Active Users', val: '1,240', trend: '↑ 8%', color: 'from-violet-600 to-purple-700' },
          { label: 'Conversion', val: '2.4%', trend: '↓ 0.5%', color: 'from-rose-500 to-orange-600' }
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
              <span className="text-[10px] text-white/50 font-bold">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Revenue Trend
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
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
                    <span className="text-[10px] text-slate-400 font-bold">{((d.value/1000)*100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
