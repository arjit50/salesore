import React from 'react';

const Analytics = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
          <p className="text-slate-500 text-sm">Performance metrics and growth insights.</p>
        </div>
        <select className="bg-white border border-slate-200 text-slate-600 text-sm font-bold px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white text-center">
            <p className="text-blue-100 text-xs font-bold uppercase mb-2">Total Revenue</p>
            <h2 className="text-4xl font-black mb-1">₹ 24.5L</h2>
            <p className="text-sm opacity-80">↑ 15% vs last month</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-6 text-white text-center">
            <p className="text-purple-100 text-xs font-bold uppercase mb-2">Active Users</p>
            <h2 className="text-4xl font-black mb-1">1,240</h2>
            <p className="text-sm opacity-80">↑ 8% vs last month</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 text-white text-center">
            <p className="text-orange-100 text-xs font-bold uppercase mb-2">Conversion Rate</p>
            <h2 className="text-4xl font-black mb-1">2.4%</h2>
            <p className="text-sm opacity-80">↓ 0.5% vs last month</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Simple Bar Chart Implementation */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-8">Revenue Growth</h3>
            <div className="flex items-end justify-between h-64 gap-4">
                {[40, 65, 45, 80, 55, 90].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div 
                            className="w-full bg-blue-100 rounded-t-xl group-hover:bg-blue-600 transition-colors relative" 
                            style={{ height: `${h}%` }}
                        >
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {h}%
                             </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400">{'JFMAMJ'[i]}</span>
                    </div>
                ))}
            </div>
        </div>

         {/* Sales Pipeline Funnel */}
         <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-8">Pipeline Funnel</h3>
             <div className="space-y-4">
                <div className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold text-slate-600">Leads (1000)</span>
                        <span className="font-bold text-slate-400">100%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-full rounded-full"></div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold text-slate-600">Qualified (650)</span>
                        <span className="font-bold text-slate-400">65%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[65%] rounded-full"></div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold text-slate-600">Proposals (300)</span>
                        <span className="font-bold text-slate-400">30%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[30%] rounded-full"></div>
                    </div>
                </div>
                 <div className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold text-slate-600">Closed (120)</span>
                        <span className="font-bold text-slate-400">12%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[12%] rounded-full"></div>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
