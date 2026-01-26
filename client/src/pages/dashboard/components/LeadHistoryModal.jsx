import React from 'react';
import { X, Mail, RefreshCcw, Calendar, User as UserIcon, MessageSquare, Phone } from 'lucide-react';

const LeadHistoryModal = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  const history = [...(lead.history || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  const getIcon = (type) => {
    switch (type) {
      case 'Email': return <Mail size={14} className="text-blue-500" />;
      case 'StatusChange': return <RefreshCcw size={14} className="text-emerald-500" />;
      case 'Note': return <MessageSquare size={14} className="text-purple-500" />;
      case 'Call': return <Phone size={14} className="text-orange-500" />;
      default: return <Calendar size={14} className="text-slate-400" />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'Email': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'StatusChange': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Note': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Call': return 'bg-orange-50 text-orange-700 border-orange-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Lead Interaction History</h2>
            <p className="text-slate-500 text-xs font-medium">Timeline for {lead.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {history.length > 0 ? (
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
              {history.map((item, index) => (
                <div key={index} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${getBadgeColor(item.type).split(' ')[0]}`}>
                    {getIcon(item.type)}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${getBadgeColor(item.type)}`}>
                        {item.type}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(item.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 mt-1">{item.content}</p>
                    {item.performedBy && (
                       <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1 uppercase tracking-tighter">
                         <UserIcon size={10} /> Record added
                       </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-slate-300" size={24} />
              </div>
              <p className="text-slate-500 font-bold">No interaction history found.</p>
              <p className="text-slate-400 text-xs font-medium mt-1">Start by sending an email or changing the lead status.</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
           >
             Close
           </button>
        </div>
      </div>
    </div>
  );
};

export default LeadHistoryModal;
