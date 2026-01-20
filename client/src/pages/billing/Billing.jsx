import React from 'react';

const Billing = () => {
  return (
    <div className="ml-64 bg-slate-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Billing & Subscription</h1>

      {/* Current Plan Card */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-[2rem] p-10 text-white mb-10 flex justify-between items-center shadow-xl shadow-blue-200">
        <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Current Plan</p>
            <h2 className="text-4xl font-black mb-4">PRO PLAN (Monthly)</h2>
            <div className="flex gap-4 text-xs font-bold">
                <span className="bg-blue-800/40 px-3 py-1 rounded-full uppercase">Active Since June 2025</span>
                <span className="bg-blue-800/40 px-3 py-1 rounded-full uppercase">Renews July 15, 2025</span>
            </div>
        </div>
        <div className="flex flex-col gap-3">
            <button className="bg-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 shadow-lg">Upgrade Plan</button>
            <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-xl border border-white/20">Cancel Subscription</button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-6">Choose a plan that fits your growth</h3>
      
      <div className="grid grid-cols-2 gap-8 max-w-4xl">
        {/* Free Plan */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="text-2xl font-bold text-slate-800 mb-2">Free</h4>
            <div className="text-5xl font-black mb-8">₹ 0 <span className="text-lg text-slate-400 font-normal">/ month</span></div>
            <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-slate-600 font-medium">✅ 100 Leads/mo</li>
                <li className="flex items-center gap-3 text-slate-600 font-medium">✅ Basic CRM Reports</li>
                <li className="flex items-center gap-3 text-slate-600 font-medium">✅ 1 User Seat</li>
            </ul>
            <button className="w-full py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 cursor-not-allowed">Current Plan</button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white p-10 rounded-[2.5rem] border-4 border-orange-400 shadow-2xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-400 text-white px-4 py-1 rounded-full text-xs font-black uppercase">Best Value</div>
            <h4 className="text-2xl font-bold text-slate-800 mb-2">Pro</h4>
            <div className="text-5xl font-black mb-8 text-blue-600">₹ 999 <span className="text-lg text-slate-400 font-normal">/ month</span></div>
            <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-slate-600 font-medium">✅ Unlimited Leads</li>
                <li className="flex items-center gap-3 text-slate-600 font-medium">✅ Advanced Sales Funnels</li>
                <li className="flex items-center gap-3 text-slate-600 font-medium">✅ Up to 10 Team Seats</li>
                <li className="flex items-center gap-3 text-slate-600 font-medium">✅ 24/7 Priority Support</li>
            </ul>
            <button className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold shadow-lg transition-all">Go Pro Now</button>
        </div>
      </div>
    </div>
  );
};


export default Billing