import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Mail, ExternalLink, Star } from 'lucide-react';

const Customers = () => {
  const [customers] = useState([
    { id: 1, name: 'Darlene Robertson', company: 'Yost and Sons', email: 'darlene@yost.com', status: 'Active', spent: '₹ 1,24,000', lastOrder: '2 days ago' },
    { id: 2, name: 'Floyd Miles', company: 'Vandervort Group', email: 'floyd@vandervort.com', status: 'Active', spent: '₹ 8,50,000', lastOrder: '5 hours ago' },
    { id: 3, name: 'Ronald Richards', company: 'Gleason, Kub and Marquardt', email: 'ronald@gleason.com', status: 'Inactive', spent: '₹ 45,000', lastOrder: '2 months ago' },
    { id: 4, name: 'Kathryn Murphy', company: 'Zieme, Cummings and Torphy', email: 'kathryn@zieme.com', status: 'Active', spent: '₹ 2,10,000', lastOrder: '1 week ago' },
    { id: 5, name: 'Jane Cooper', company: 'Bayer-Gislason', email: 'jane@bayer.com', status: 'Active', spent: '₹ 95,000', lastOrder: '3 days ago' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
          <p className="text-slate-500 text-sm">View and manage your loyal customer base.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-all flex items-center gap-2">
           <Mail size={18}/> Email All
        </button>
      </div>

       <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
         <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
            <Filter size={16} /> Filter
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {customer.name.charAt(0)}
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-bold ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {customer.status}
                </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1">{customer.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{customer.company}</p>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Spent</span>
                    <span className="font-bold text-slate-800">{customer.spent}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Last Order</span>
                    <span className="font-medium text-slate-600">{customer.lastOrder}</span>
                </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-50">
                <button className="flex-1 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">View Profile</button>
                <button className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors">
                    <Star size={20} />
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;
