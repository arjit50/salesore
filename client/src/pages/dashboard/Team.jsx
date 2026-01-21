import React from 'react';
import { Mail, Shield, Trash2, Plus } from 'lucide-react';

const Team = () => {
  const members = [
    { id: 1, name: 'Rahul', role: 'Admin', email: 'rahul@salesor.com', status: 'Active', color: 'blue' },
    { id: 2, name: 'Esther Howard', role: 'Sales Manager', email: 'esther@salesor.com', status: 'Active', color: 'purple' },
    { id: 3, name: 'Floyd Miles', role: 'Sales Rep', email: 'floyd@salesor.com', status: 'On Leave', color: 'orange' },
    { id: 4, name: 'Jenny Wilson', role: 'Sales Rep', email: 'jenny@salesor.com', status: 'Active', color: 'pink' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Team Members</h1>
          <p className="text-slate-500 text-sm">Manage your team and their access permissions.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-200">
          <Plus size={18} /> Invite Member
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-${member.color}-100 flex items-center justify-center font-bold text-${member.color}-600`}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{member.role}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                   <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {member.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                   <div className="flex justify-end gap-2">
                     <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors" title="Email">
                      <Mail size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors" title="Remove">
                      <Trash2 size={16} />
                    </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Team;
