import React from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';

const Pipeline = () => {
  const columns = [
    { id: 'new', title: 'New Leads', color: 'blue', items: [
        { id: 1, title: 'Barone LLC', value: '₹ 12,000', contact: 'Esther Howard' },
        { id: 2, title: 'Abstergo Ltd', value: '₹ 45,000', contact: 'Warren Buffet' },
    ]},
    { id: 'contacted', title: 'Contacted', color: 'orange', items: [
        { id: 3, title: 'Gislason and Sons', value: '₹ 8,500', contact: 'Cameron W.' },
    ]},
    { id: 'proposal', title: 'Proposal Sent', color: 'purple', items: [
        { id: 4, title: 'Kirlin and Sons', value: '₹ 15,000', contact: 'Jacob Jones' },
        { id: 5, title: 'Acme Corp', value: '₹ 1,20,000', contact: 'Road Runner' },
        { id: 6, title: 'Stark Ind', value: '₹ 5,00,000', contact: 'Tony Stark' },
    ]},
    { id: 'negotiation', title: 'Negotiation', color: 'yellow', items: [
        { id: 7, title: 'Thiel-Hauck', value: '₹ 24,000', contact: 'Robert Fox' },
    ]},
     { id: 'won', title: 'Closed Won', color: 'green', items: [
        { id: 8, title: 'Wayne Ent', value: '₹ 85,000', contact: 'Bruce Wayne' },
    ]},
  ];

  return (
    <div className="h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pipeline</h1>
          <p className="text-slate-500 text-sm">Drag and drop details to move them through stages.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-200">
          <Plus size={18} /> Add Deal
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 h-full">
        {columns.map((col) => (
            <div key={col.id} className="min-w-[280px] flex-1 flex flex-col max-w-xs">
                <div className={`flex justify-between items-center mb-4 pb-2 border-b-2 border-${col.color}-500`}>
                    <h3 className="font-bold text-slate-700 text-sm uppercase">{col.title}</h3>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-md">{col.items.length}</span>
                </div>
                
                <div className="flex-1 bg-slate-100/50 rounded-2xl p-2 space-y-3">
                    {col.items.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`w-8 h-1 bg-${col.color}-500 rounded-full`}></span>
                                <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal size={14}/></button>
                            </div>
                            <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                            <p className="text-xs text-slate-500 mb-3">{item.contact}</p>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                <span className="font-black text-slate-700 text-sm">{item.value}</span>
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                    {item.contact.charAt(0)}
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="w-full py-2 text-xs font-bold text-slate-400 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-300 hover:text-blue-500 transition-colors">
                        + Add Deal
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Pipeline;
