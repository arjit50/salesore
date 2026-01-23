import React from 'react';

const Billing = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Billing & Subscription</h1>

      {/* Current Plan Card - Made more compact */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-6 text-white mb-8 flex justify-between items-center shadow-lg shadow-blue-200">
        <div>
            <p className="text-blue-100 text-xs font-medium mb-1">Current Plan</p>
            <h2 className="text-2xl font-black mb-2">PRO PLAN (Monthly)</h2>
            <div className="flex gap-3 text-[10px] font-bold">
                <span className="bg-blue-800/40 px-2 py-0.5 rounded-full uppercase">Active Since June 2025</span>
                <span className="bg-blue-800/40 px-2 py-0.5 rounded-full uppercase">Renews July 15, 2025</span>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <button className="bg-orange-500 text-white text-sm font-bold px-6 py-2 rounded-xl hover:bg-orange-600 shadow-md cursor-pointer">Upgrade Plan</button>
            <button className="bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-6 py-2 rounded-xl border border-white/20 cursor-pointer">Cancel</button>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-4">Choose a plan that fits your growth</h3>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h4 className="text-xl font-bold text-slate-800 mb-1">Free</h4>
            <div className="text-3xl font-black mb-6">₹ 0 <span className="text-sm text-slate-400 font-normal">/ month</span></div>
            <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2 text-slate-600 font-medium">✅ 100 Leads/mo</li>
                <li className="flex items-center gap-2 text-slate-600 font-medium">✅ Basic CRM Reports</li>
                <li className="flex items-center gap-2 text-slate-600 font-medium">✅ 1 User Seat</li>
            </ul>
            <button className="w-full py-3 border border-slate-100 rounded-xl font-bold text-slate-400 cursor-not-allowed text-sm">Current Plan</button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white p-6 rounded-2xl border-2 border-orange-400 shadow-xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-400 text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">Best Value</div>
            <h4 className="text-xl font-bold text-slate-800 mb-1">Pro</h4>
            <div className="text-3xl font-black mb-6 text-blue-600">₹ 999 <span className="text-sm text-slate-400 font-normal">/ month</span></div>
            <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2 text-slate-600 font-medium">✅ Unlimited Leads</li>
                <li className="flex items-center gap-2 text-slate-600 font-medium">✅ Advanced Sales Funnels</li>
                <li className="flex items-center gap-2 text-slate-600 font-medium">✅ 24/7 Priority Support</li>
            </ul>
            <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md transition-all text-sm cursor-pointer">Go Pro Now</button>
        </div>
      </div>
    </div>
  );
};

export default Billing;