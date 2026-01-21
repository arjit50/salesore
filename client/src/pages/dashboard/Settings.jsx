import React from 'react';
import { User, Bell, Lock, Globe } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 text-sm">Manage your profile and preferences.</p>
        </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <nav className="flex flex-col p-2 space-y-1">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm">
                        <User size={18}/> Profile
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors">
                        <Bell size={18}/> Notifications
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors">
                        <Lock size={18}/> Security
                    </button>
                     <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-sm transition-colors">
                        <Globe size={18}/> Language
                    </button>
                </nav>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-3 space-y-6">
            {/* Profile Section */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Profile Information</h3>
                
                <div className="flex items-center gap-6 mb-8">
                     <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">R</div>
                     <div>
                         <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">Change Photo</button>
                         <p className="text-xs text-slate-400 mt-2">JPG, GIF or PNG. Max 800K.</p>
                     </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">First Name</label>
                        <input type="text" defaultValue="Rahul" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Last Name</label>
                        <input type="text" defaultValue="Kumar" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                         <input type="email" defaultValue="rahul@salesor.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                     <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bio</label>
                         <textarea rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="Sales Manager at Salesor. Loves coffee and closing deals."></textarea>
                    </div>
                </div>

                <div className="flex justify-end mt-8 pt-6 border-t border-slate-100">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-shadow shadow-lg shadow-blue-200">Save Changes</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
