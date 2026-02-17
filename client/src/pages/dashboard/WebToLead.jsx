import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Copy, Check, Globe, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const WebToLead = () => {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('html');

    const formUrl = `http://localhost:5000/leads/public/${user?._id}`;

    const htmlCode = `<!-- Salesor Web-to-Lead Form -->
<form action="${formUrl}" method="POST" style="max-width: 400px; margin: 0 auto; font-family: sans-serif;">
  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Name</label>
    <input type="text" name="name" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
  </div>
  
  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Email</label>
    <input type="email" name="email" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
  </div>

  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Phone</label>
    <input type="tel" name="phone" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
  </div>

  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Message</label>
    <textarea name="message" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
  </div>

  <button type="submit" style="background-color: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
    Contact Us
  </button>
</form>`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(htmlCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-800 mb-2">Web-to-Lead Integration</h1>
                <p className="text-slate-500 font-medium">Embed a contact form on your website and automatically capture leads.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Preview Section */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm order-2 lg:order-1">
                    <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Globe size={20} className="text-blue-500" />
                        Live Preview
                    </h2>

                    <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300">
                        <form action={formUrl} method="POST" className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                                <input type="text" name="name" placeholder="John Doe" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                <input type="email" name="email" placeholder="john@example.com" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                                <input type="tel" name="phone" placeholder="+1 (555) 000-0000" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
                                <textarea name="message" rows="3" placeholder="I'm interested in your services..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                            <button type="button" className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-colors w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-200">
                                Contact Us
                            </button>
                        </form>
                        <p className="text-center text-xs text-slate-400 mt-4 font-medium">Preview only - submissions here won't work locally easily due to CORS/Redirects outside iframe context</p>
                    </div>
                </div>

                {/* Code Section */}
                <div className="space-y-6 order-1 lg:order-2">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <Code size={20} className="text-purple-500" />
                                Integration Code
                            </h2>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied!' : 'Copy Code'}
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute top-0 right-0 p-2">
                                <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-1 rounded">HTML</span>
                            </div>
                            <pre className="bg-slate-900 text-slate-300 p-6 rounded-2xl overflow-x-auto text-xs font-mono leading-relaxed shadow-inner">
                                {htmlCode}
                            </pre>
                        </div>

                        <div className="mt-6 flex flex-col gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h4 className="font-bold text-blue-800 text-sm mb-1">💡 Integration Tip</h4>
                                <p className="text-sm text-blue-600/80">
                                    Copy and paste this code anywhere in your website's <code>&lt;body&gt;</code> section. You can customize the CSS styles to match your branding.
                                </p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                <h4 className="font-bold text-amber-800 text-sm mb-1">⚠️ Important</h4>
                                <p className="text-sm text-amber-600/80">
                                    Leads submitted through this form will automatically appear in your dashboard with the source <strong>"Web Form"</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebToLead;
