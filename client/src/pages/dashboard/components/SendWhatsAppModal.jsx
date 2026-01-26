import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import axios from 'axios';

const SendWhatsAppModal = ({ isOpen, onClose, lead, leads = [], onSuccess }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });

    const isBulk = leads.length > 0;
    const targetName = isBulk ? `${leads.length} recipients` : lead?.name;
    const targetPhone = !isBulk ? lead?.whatsappNumber : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', text: '' });

        try {
            if (isBulk) {
                // Bulk WhatsApp (Log only)
                const response = await axios.post('http://localhost:5000/leads/bulk-whatsapp', {
                    leadIds: leads,
                    message,
                });
                setStatus({ type: 'success', text: response.data.message });
            } else {
                // Single WhatsApp
                // 1. Open WhatsApp Web
                if (targetPhone) {
                    const encodedMessage = encodeURIComponent(message);
                    window.open(`https://wa.me/${targetPhone}?text=${encodedMessage}`, '_blank');
                } else {
                    setStatus({ type: 'error', text: 'Lead has no WhatsApp number' });
                    setLoading(false);
                    return;
                }

                // 2. Log to backend
                await axios.post('http://localhost:5000/leads/bulk-whatsapp', {
                    leadIds: [lead._id],
                    message,
                });

                setStatus({ type: 'success', text: 'WhatsApp opened and logged!' });
                if (onSuccess) onSuccess();
            }

            setTimeout(() => {
                onClose();
                setMessage('');
                setStatus({ type: '', text: '' });
            }, 2000);
        } catch (error) {
            setStatus({
                type: 'error',
                text: error.response?.data?.message || 'Failed to process request'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <svg className="text-emerald-600" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            WhatsApp Message
                        </h2>
                        <p className="text-slate-500 text-xs font-medium">
                            Sending to: {targetName} {targetPhone && `(${targetPhone})`}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {status.text && (
                        <div className={`p-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                            {status.text}
                        </div>
                    )}

                    {!isBulk && !targetPhone && (
                        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl text-sm font-bold border border-yellow-100">
                            Warning: This lead does not have a WhatsApp number.
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                        <textarea
                            required
                            rows="6"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your WhatsApp message here..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none"
                        ></textarea>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (!isBulk && !targetPhone)}
                            className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            {loading ? 'Processing...' : (isBulk ? 'Log Activity' : 'Open WhatsApp')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendWhatsAppModal;
