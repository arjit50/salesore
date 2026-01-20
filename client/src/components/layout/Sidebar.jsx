import React from 'react';
import { LayoutDashboard, Users, UserSquare2, Activity, BarChart3, CreditCard, Settings, Plus, LogOut } from 'lucide-react';

const Sidebar = ({ activePage }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
    { name: 'Leads', icon: <UserSquare2 size={20} />, id: 'leads' },
    { name: 'Customers', icon: <Users size={20} />, id: 'customers' },
    { name: 'Activities', icon: <Activity size={20} />, id: 'activities' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, id: 'analytics' },
    { name: 'Billing', icon: <CreditCard size={20} />, id: 'billing' },
    { name: 'Team', icon: <Users size={20} />, id: 'team' },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-[#1e3a8a] to-[#1e40af] text-white flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 px-4 mb-10">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl italic">S</div>
        <span className="text-xl font-bold tracking-tight">Salesor</span>
      </div>

      <nav className="flex-grow space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
              activePage === item.id ? 'bg-blue-600 shadow-lg' : 'hover:bg-blue-800/50 text-blue-100'
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>

      <div className="pt-4 border-t border-blue-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-blue-800/50 font-medium text-sm">
          <Settings size={20} /> Settings
        </button>
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4 transition-all shadow-lg">
          <Plus size={18} /> Add Lead
        </button>
      </div>
    </div>
  );
};

export default Sidebar