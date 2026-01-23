import React from 'react';
import { X, Download, AlertCircle, FileSpreadsheet } from 'lucide-react';

const ExportConfirmModal = ({ isOpen, onClose, onConfirm, count }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <Download size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Confirm Export</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <FileSpreadsheet size={40} />
                    </div>
                    <h4 className="text-xl font-black text-slate-800 mb-2">Ready to Export?</h4>
                    <p className="text-slate-500 font-medium mb-6">
                        You are about to export <span className="text-blue-600 font-bold">{count}</span> lead{count !== 1 ? 's' : ''} to an Excel file (.xlsx) based on your current filters.
                    </p>
                    
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 text-left mb-2">
                        <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-amber-700 text-xs font-bold leading-relaxed">
                            Only the leads currently visible in your filtered list will be exported.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Download size={18} />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportConfirmModal;
