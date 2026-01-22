import React, { useState } from 'react';
import { User, Bell, Lock, Globe, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Sales Manager at Salesor. Loves coffee and closing deals.' // Mock bio as it's not in schema yet
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
      email: formData.email
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setLoading(false);
  };

  const navItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Lock, label: 'Security' },
    { id: 'language', icon: Globe, label: 'Language' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 text-sm">Manage your profile and preferences.</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <nav className="flex flex-col p-2 space-y-1">
                    {navItems.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                          activeTab === item.id 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                          <item.icon size={18}/> {item.label}
                      </button>
                    ))}
                </nav>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-3 space-y-6">
            {activeTab === 'profile' && (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
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
            )}

            {activeTab !== 'profile' && (
              <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="text-slate-400" size={24} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{navItems.find(i => i.id === activeTab).label} Settings</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">This section is coming soon. We're working hard to bring you more control over your experience.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
