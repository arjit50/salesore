import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Phone, Mail } from 'lucide-react';

const Leads = () => {
  const [leads] = useState([
    { id: 1, name: 'Esther Howard', company: 'Barone LLC', email: 'esther@barone.com', status: 'New', value: '₹ 12,000', source: 'Website', phone: '+91 98765 43210' },
    { id: 2, name: 'Cameron Williamson', company: 'Gislason and Sons', email: 'cameron@gislason.com', status: 'Contacted', value: '₹ 8,500', source: 'LinkedIn', phone: '+91 98765 43211' },
    { id: 3, name: 'Robert Fox', company: 'Thiel-Hauck', email: 'robert@thiel.com', status: 'Qualified', value: '₹ 24,000', source: 'Referral', phone: '+91 98765 43212' },
    { id: 4, name: 'Jacob Jones', company: 'Kirlin and Sons', email: 'jacob@kirlin.com', status: 'Proposal', value: '₹ 15,000', source: 'Website', phone: '+91 98765 43213' },
    { id: 5, name: 'Courtney Henry', company: 'Denesik Group', email: 'courtney@denesik.com', status: 'Lost', value: '₹ 5,000', source: 'Cold Call', phone: '+91 98765 43214' },
    { id: 6, name: 'Arlene McCoy', company: 'Feest-O\'Kon', email: 'arlene@feest.com', status: 'New', value: '₹ 9,200', source: 'Website', phone: '+91 98765 43215' },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Contacted': return 'bg-orange-100 text-orange-700';
      case 'Qualified': return 'bg-purple-100 text-purple-700';
      case 'Proposal': return 'bg-yellow-100 text-yellow-700';
      case 'Lost': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
          <p className="text-slate-500 text-sm">Manage your potential customers and opportunities.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-200">
          <Plus size={18} /> Add New Lead
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search leads..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Value</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
              <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.company}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="py-4 px-6 font-medium text-slate-700 text-sm">
                  {lead.value}
                </td>
                <td className="py-4 px-6 text-slate-500 text-sm">
                  {lead.source}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                      <Phone size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                      <Mail size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center">
            <p className="text-xs text-slate-400">Showing 6 of 24 leads</p>
            <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50">Prev</button>
                <button className="px-3 py-1 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Leads;
