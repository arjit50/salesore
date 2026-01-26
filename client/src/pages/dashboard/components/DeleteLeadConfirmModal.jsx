import React, { useState } from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';

const DeleteLeadConfirmModal = ({ isOpen, onClose, onDeleteSuccess, lead, leads = [] }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;
    const isBulk = leads.length > 0;
    const targetName = isBulk ? `${leads.length} leads` : lead?.name;

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            if (isBulk) {
                await axios.post('http://localhost:5000/leads/bulk-delete', { leadIds: leads });
                onDeleteSuccess(leads);
            } else {
                await axios.delete(`http://localhost:5000/leads/${lead._id}`);
                onDeleteSuccess(lead._id);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting lead(s)');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                        <Trash2 size={40} />
                    </div>
                    <h4 className="text-xl font-black text-slate-800 mb-2">Are you sure?</h4>
                    <p className="text-slate-500 font-medium mb-6">
                        You are about to delete <span className="text-slate-800 font-bold">{targetName}</span>. This action cannot be undone.
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 text-xs font-bold mb-6 flex items-center gap-2">
                            <AlertTriangle size={16} /> {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            onClick={handleDelete}
                            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteLeadConfirmModal;
