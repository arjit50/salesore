import React, { useState } from 'react';
import { User, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    salesTarget: user?.salesTarget || 100000,
    bio: 'Sales Manager at Salesor. Loves coffee and closing deals.'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await updateProfile({
      name: formData.name,
      email: formData.email,
      salesTarget: formData.salesTarget
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your profile and preferences.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Profile Information</h3>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex items-center gap-6 mb-8">
             <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
               {formData.name?.charAt(0) || 'U'}
             </div>
             <div>
                 <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">Change Photo</button>
                 <p className="text-xs text-slate-400 mt-2">JPG, GIF or PNG. Max 800K.</p>
             </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Display Name</label>
                <input 
                  name="name"
                  type="text" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </div>
            <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                 <input 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-200 cursor-not-allowed border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
               disabled />
            </div>
            <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Monthly Sales Target (₹)</label>
                 <input 
                  name="salesTarget"
                  type="number" 
                  value={formData.salesTarget}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </div>
             <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bio</label>
                 <textarea 
                  name="bio"
                  rows="4" 
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                ></textarea>
            </div>

            <div className="col-span-2 flex justify-end mt-4 pt-6 border-t border-slate-100">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-70"
                >
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    Save Changes
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
