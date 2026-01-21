import React from 'react';
import { Phone, Mail, FileText, CheckCircle, Clock } from 'lucide-react';

const Activities = () => {
    const activities = [
        { id: 1, type: 'call', title: 'Call with Floyd Miles', description: 'Discussed Q3 requirements and pricing for the new enterprise plan.', time: '10:30 AM', date: 'Today', status: 'Completed' },
        { id: 2, type: 'email', title: 'Sent proposal to Barone LLC', description: 'Attached the updated PDF with the 15% discount applied.', time: '09:15 AM', date: 'Today', status: 'Sent' },
        { id: 3, type: 'meeting', title: 'Demo with TechSprit', description: 'Product demo with the engineering team. Focus on API integration.', time: '02:00 PM', date: 'Today', status: 'Scheduled' },
        { id: 4, type: 'task', title: 'Follow up with Jane Cooper', description: 'She asked for a callback regarding the invoice #INV-2024-001.', time: '04:45 PM', date: 'Yesterday', status: 'Pending' },
        { id: 5, type: 'email', title: 'Weekly Newsletter', description: 'Sent out the weekly update to all subscribed leads.', time: '11:00 AM', date: 'Yesterday', status: 'Sent' },
    ];

    const getIcon = (type) => {
        switch(type) {
            case 'call': return <Phone size={18} className="text-blue-600"/>;
            case 'email': return <Mail size={18} className="text-purple-600"/>;
            case 'meeting': return <Clock size={18} className="text-orange-600"/>;
            case 'task': return <CheckCircle size={18} className="text-green-600"/>;
            default: return <FileText size={18} className="text-slate-600"/>;
        }
    };

    const getBgColor = (type) => {
         switch(type) {
            case 'call': return 'bg-blue-100 border-blue-200';
            case 'email': return 'bg-purple-100 border-purple-200';
            case 'meeting': return 'bg-orange-100 border-orange-200';
            case 'task': return 'bg-green-100 border-green-200';
            default: return 'bg-slate-100 border-slate-200';
        }
    };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Activity Timeline</h1>
      
      <div className="relative border-l-2 border-slate-200 ml-4 space-y-10 pb-10">
        {activities.map((act) => (
            <div key={act.id} className="relative pl-10">
                {/* Timeline Dot with Icon */}
                <div className={`absolute -left-[19px] top-0 w-10 h-10 rounded-full border-4 border-white ${getBgColor(act.type)} flex items-center justify-center shadow-sm`}>
                    {getIcon(act.type)}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{act.date} • {act.time}</span>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${act.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                {act.status}
                             </span>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{act.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{act.description}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
