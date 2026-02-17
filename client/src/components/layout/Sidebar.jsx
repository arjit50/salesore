import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserSquare2, Activity, BarChart3, CreditCard, Settings, Plus, LogOut, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LogoutModal from './LogoutModal';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Leads', icon: <UserSquare2 size={20} />, path: '/dashboard/leads' },
    { name: 'Pipeline', icon: <LayoutDashboard size={20} />, path: '/dashboard/pipeline' }, // Reusing icon for now or change to Kanban
    { name: 'Customers', icon: <Users size={20} />, path: '/dashboard/customers' },
    { name: 'Activities', icon: <Activity size={20} />, path: '/dashboard/activities' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/dashboard/analytics' },
    { name: 'Web Forms', icon: <Globe size={20} />, path: '/dashboard/web-to-lead' },
    { name: 'Billing', icon: <CreditCard size={20} />, path: '/dashboard/billing' },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-gradient-to-b from-[#1e3a8a] to-[#1e40af] text-white flex flex-col p-4 fixed left-0 top-0 z-50 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-10 px-2">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl italic">S</div>
            <Link to="/" className="text-xl font-bold tracking-tight">Salesor</Link>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl italic mx-auto">S</div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg bg-blue-800/50 hover:bg-blue-700 transition-colors ${isCollapsed ? 'absolute -right-3 top-20 bg-blue-600 shadow-lg' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-grow space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'} // Only exact match for root dashboard
            className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive ? 'bg-blue-600 shadow-lg' : 'hover:bg-blue-800/50 text-blue-100'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
            title={isCollapsed ? item.name : ''}
          >
            {item.icon}
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t border-blue-800 space-y-1">
        <NavLink to="/dashboard/settings" title={isCollapsed ? "Settings" : ""} className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive ? 'bg-blue-600 shadow-lg' : 'text-blue-100 hover:bg-blue-800/50'
          } ${isCollapsed ? 'justify-center px-2' : ''}`}>
          <Settings size={20} /> {!isCollapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          title={isCollapsed ? "Logout" : ""}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-red-100 hover:bg-red-800/50 mt-1 cursor-pointer ${isCollapsed ? 'justify-center px-2' : ''}`}
        >
          <LogOut size={20} /> {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Sidebar