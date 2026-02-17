import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Mail } from 'lucide-react';
import SendEmailModal from './components/SendEmailModal';
import SendWhatsAppModal from './components/SendWhatsAppModal';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingTarget, setIsUpdatingTarget] = useState(false);
  const [targetValue, setTargetValue] = useState(user?.salesTarget || 100000);

  // Modal states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

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

  const handleEmailClick = (lead) => {
    setSelectedLead(lead);
    setIsEmailModalOpen(true);
  };

  const handleWhatsAppClick = (lead) => {
    setSelectedLead(lead);
    setIsWhatsAppModalOpen(true);
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

      {/* Stagnant Leads - Action Required */}
      {/* Stagnant Leads - Action Required */}
      <div className={`p-6 rounded-[2rem] border shadow-sm mb-8 transition-colors ${stats?.inactiveLeads?.length > 0
          ? 'bg-red-50/50 border-red-100'
          : 'bg-emerald-50/50 border-emerald-100'
        }`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className={`font-bold flex items-center gap-2 ${stats?.inactiveLeads?.length > 0 ? 'text-red-800' : 'text-emerald-800'
              }`}>
              <span className="text-xl">{stats?.inactiveLeads?.length > 0 ? '⚠️' : '✅'}</span>
              {stats?.inactiveLeads?.length > 0 ? 'Action Required: Stagnant Leads' : 'Lead Activity Status'}
            </h3>
            <p className={`text-xs font-medium mt-1 ${stats?.inactiveLeads?.length > 0 ? 'text-red-600/70' : 'text-emerald-600/70'
              }`}>
              {stats?.inactiveLeads?.length > 0
                ? "These leads haven't been engaged with for over 3 days."
                : "Great job! All active leads have been engaged with recently."}
            </p>
          </div>
        </div>

        {stats?.inactiveLeads?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.inactiveLeads.map((lead, i) => {
              const lastEngaged = lead.lastEngagementDate || lead.createdAt;
              const daysInactive = Math.floor((new Date() - new Date(lastEngaged)) / (1000 * 60 * 60 * 24));

              return (
                <motion.div
                  key={lead._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{lead.name}</h4>
                      <p className="text-[10px] font-medium text-slate-400">
                        {lead.email}
                      </p>
                    </div>
                    <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-1 rounded-lg whitespace-nowrap">
                      {daysInactive} DAYS
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${lead.status === 'New' ? 'bg-blue-50 text-blue-600' :
                        lead.status === 'Contacted' ? 'bg-orange-50 text-orange-600' :
                          'bg-slate-50 text-slate-500'
                      }`}>
                      {lead.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEmailClick(lead)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                        title="Send Email"
                      >
                        <Mail size={14} />
                      </button>
                      <button
                        onClick={() => handleWhatsAppClick(lead)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Send WhatsApp"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lead Scoring System - Replaces Sales Performance Overview */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="text-xl">🎯</span> Lead Scoring System
            </h3>
            <p className="text-slate-500 text-xs font-medium mt-1">AI-powered ranking based on engagement & budget</p>
          </div>
          <div className="flex gap-2">
            <Link to="/dashboard/leads" className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors">
              VIEW ALL LEADS
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider w-[30%]">Lead Details</th>
                <th className="text-center py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Engagement</th>
                <th className="text-right py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Budget</th>
                <th className="text-left py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider w-[30%]">Lead Score</th>
                <th className="text-right py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {stats?.topScoredLeads?.map((lead, index) => (
                <motion.tr
                  key={lead._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md
                          ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                          index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400' :
                            index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400' :
                              'bg-gradient-to-br from-blue-400 to-blue-600'}`}
                      >
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{lead.name}</p>
                        <p className="text-xs text-slate-500">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-4">
                      <div className="text-center group/tooltip relative">
                        <div className="text-lg font-black text-slate-700">{lead.emailOpens || 0}</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Opens</div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {(lead.scoreBreakdown?.openScore || 0)} pts
                        </div>
                      </div>
                      <div className="text-center group/tooltip relative">
                        <div className="text-lg font-black text-indigo-600">{lead.emailReplies || 0}</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Replies</div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {(lead.scoreBreakdown?.replyScore || 0)} pts
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-bold text-slate-700">₹ {(lead.value || 0).toLocaleString()}</span>
                    <div className="text-[9px] text-slate-400">{(lead.scoreBreakdown?.valueScore || 0)} pts</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${lead.score >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-600' :
                            lead.score >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                              'bg-gradient-to-r from-slate-400 to-slate-600'
                            }`}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                      <div className={`text-lg font-black ${lead.score >= 80 ? 'text-emerald-600' :
                        lead.score >= 50 ? 'text-orange-500' :
                          'text-slate-500'
                        }`}>
                        {lead.score}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEmailClick(lead)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                        title="Send Email"
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        onClick={() => handleWhatsAppClick(lead)}
                        className="p-2 hover:bg-emerald-50 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Send WhatsApp"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}

              {(!stats?.topScoredLeads || stats.topScoredLeads.length === 0) && (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <span className="text-4xl mb-2">📊</span>
                      <p className="font-medium">No lead data available for scoring yet.</p>
                      <p className="text-xs mt-1">Engage with leads to generate scores.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

      <SendEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onSuccess={() => {
          // Optionally refresh dashboard stats if needed
          fetchStats();
        }}
      />

      <SendWhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => {
          setIsWhatsAppModalOpen(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onSuccess={() => {
          // Optionally refresh dashboard stats if needed
          fetchStats();
        }}
      />
    </motion.div >
  );
};

export default Dashboard;