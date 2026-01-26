import React, { useState, useEffect } from 'react';
import { Phone, Mail, FileText, CheckCircle, Clock, RefreshCcw } from 'lucide-react';
import axios from 'axios';

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/analytics/dashboard');
                // Map lead updates to activity format
                const mappedActivities = data.recentActivities.map(activity => ({
                    id: activity._id,
                    type: activity.type.toLowerCase(),
                    title: `${activity.type}: ${activity.leadName}`,
                    description: activity.content,
                    time: new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    date: new Date(activity.date).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : new Date(activity.date).toLocaleDateString(),
                    status: 'Completed'
                }));
                setActivities(mappedActivities);
            } catch (error) {
                console.error('Error fetching activities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const getIcon = (type) => {
        switch(type) {
            case 'call': return <Phone size={18} className="text-blue-600"/>;
            case 'email': return <Mail size={18} className="text-purple-600"/>;
            case 'statuschange': return <RefreshCcw size={18} className="text-emerald-600"/>;
            case 'note': return <FileText size={18} className="text-slate-600"/>;
            case 'task': return <CheckCircle size={18} className="text-green-600"/>;
            default: return <FileText size={18} className="text-slate-600"/>;
        }
    };

    const getBgColor = (type) => {
         switch(type) {
            case 'call': return 'bg-blue-100 border-blue-200';
            case 'email': return 'bg-purple-100 border-purple-200';
            case 'statuschange': return 'bg-emerald-100 border-emerald-200';
            case 'note': return 'bg-slate-100 border-slate-200';
            case 'task': return 'bg-green-100 border-green-200';
            default: return 'bg-slate-100 border-slate-200';
        }
    };

    if (loading) {
        return (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        );
    }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Activity Timeline</h1>
      
      <div className="relative border-l-2 border-slate-200 ml-4 space-y-10 pb-10">
        {activities.length > 0 ? (
            activities.map((act) => (
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
            ))
        ) : (
            <p className="text-slate-400 text-sm text-center py-10">No activities found.</p>
        )}
      </div>
    </div>
  );
};

export default Activities;
