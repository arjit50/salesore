import React from 'react';

const Dashboard = () => {
  return (
    <>
      {/* Top Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome, Rahul!</h1>
          <p className="text-slate-500 text-sm">Here's what's happening with your sales today.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative">
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64" />
                <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-1 pr-4 rounded-full border border-slate-200 shadow-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">R</div>
                <div className="text-xs">
                    <p className="font-bold text-slate-800">Rahul</p>
                    <p className="text-slate-400">Admin</p>
                </div>
            </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase mb-4">New Leads</p>
            <div className="flex items-end justify-between">
                <h2 className="text-4xl font-black text-blue-900">120</h2>
                <div className="h-10 w-24 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 text-xs font-bold">+12%</div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase mb-4">Converted Leads</p>
            <div className="flex items-end justify-between">
                <h2 className="text-4xl font-black text-blue-900">45</h2>
                <div className="h-10 w-24 bg-green-50 rounded-lg flex items-center justify-center text-green-500 text-xs font-bold">37% rate</div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase mb-4">Total Revenue</p>
            <div className="flex items-end justify-between">
                <h2 className="text-4xl font-black text-blue-900">₹ 560k</h2>
                <div className="h-10 w-24 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 text-xs font-bold">Target: 80%</div>
            </div>
        </div>
      </div>

      {/* Main Grid: Graph and Recent Activities */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-800">Leads Conversion Over Time</h3>
                <select className="text-xs font-bold text-slate-400 bg-slate-50 p-2 rounded-lg outline-none">
                    <option>Last 7 Days</option>
                    <option>Last Month</option>
                </select>
            </div>
            {/* Mock Chart Area */}
            <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Chart Visualization Area</p>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Recent Activities</h3>
            <div className="space-y-6">
                {[
                    { name: 'Client One', status: 'In Review', color: 'blue' },
                    { name: 'Client Two', status: 'Interested', color: 'orange' },
                    { name: 'Client Three', status: 'Qualified', color: 'green' },
                    { name: 'Client Four', status: 'Lost', color: 'red' },
                ].map((act, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full bg-${act.color}-100 flex items-center justify-center text-sm font-bold text-${act.color}-600`}>
                                {act.name[0]}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{act.name}</p>
                                <p className="text-[10px] text-slate-400">Today, 10:24 AM</p>
                            </div>
                        </div>
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-${act.color}-50 text-${act.color}-600`}>
                            {act.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </>
  );
};


export default Dashboard;