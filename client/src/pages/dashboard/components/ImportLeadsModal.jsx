import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ImportLeadsModal = ({ isOpen, onClose, onImportSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
            parseExcel(selectedFile);
        }
    };

    const parseExcel = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                
                if (json.length > 0) {
                    const headers = Object.keys(json[0]).map(h => h.toString().trim().toLowerCase());
                    
                    const nameKey = headers.find(h => h === 'name' || h === 'full name' || h === 'customer name');
                    const emailKey = headers.find(h => h === 'email' || h === 'mail' || h === 'email address');
                    
                    if (!nameKey || !emailKey) {
                        const missing = [];
                        if (!nameKey) missing.push('name');
                        if (!emailKey) missing.push('email (or mail)');
                        setError(`Missing required columns: ${missing.join(', ')}`);
                        setPreview([]);
                    } else {
                        setPreview(json.slice(0, 5));
                    }
                } else {
                    setError('Excel file is empty');
                    setPreview([]);
                }
            } catch (err) {
                setError('Failed to parse Excel file');
                setPreview([]);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleImport = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(new Uint8Array(e.target.result));
                reader.onerror = (err) => reject(err);
                reader.readAsArrayBuffer(file);
            });

            const workbook = XLSX.read(data, { type: 'array' });
            const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            
            const formattedData = json.map(item => {
                const newItem = {};
                Object.keys(item).forEach(key => {
                    const cleanKey = key.toString().trim().toLowerCase();
                    
                    if (cleanKey === 'name' || cleanKey === 'full name' || cleanKey === 'customer name') {
                        newItem['name'] = item[key];
                    } else if (cleanKey === 'email' || cleanKey === 'mail' || cleanKey === 'email address') {
                        newItem['email'] = item[key];
                    } else if (cleanKey.includes('phone') || cleanKey.includes('mobile') || cleanKey.includes('contact')) {
                        newItem['phone'] = item[key]?.toString();
                    } else if (cleanKey.includes('status')) {
                        const val = item[key]?.toString().trim();
                        // Map common variations to match enum Exactly
                        if (val && ['New', 'Contacted', 'Qualified', 'Proposal', 'Lost', 'Won'].includes(val)) {
                            newItem['status'] = val;
                        } else if (val?.toLowerCase() === 'won') {
                            newItem['status'] = 'Won';
                        } else {
                            newItem['status'] = 'New';
                        }
                    } else if (cleanKey.includes('source')) {
                        newItem['source'] = item[key];
                    } else if (cleanKey.includes('value')) {
                        const val = item[key]?.toString().replace(/[^0-9.]/g, '');
                        newItem['value'] = parseFloat(val) || 0;
                    } else if (cleanKey.includes('company') || cleanKey.includes('org')) {
                        newItem['company'] = item[key];
                    }
                });
                return newItem;
            });

            await axios.post('http://localhost:5000/leads/bulk', formattedData);
            setSuccess(true);
            setTimeout(() => {
                onImportSuccess();
                handleClose();
            }, 1500);
        } catch (err) {
            console.error('Import error:', err);
            setError(err.response?.data?.message || 'Error importing leads. Please try again.');
            setLoading(false); // Reset loading only on error, otherwise success timeout handles it
        }
    };

    const handleClose = () => {
        setFile(null);
        setPreview([]);
        setError(null);
        setSuccess(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose}></div>
            
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Import Leads</h3>
                            <p className="text-xs text-slate-500 font-medium tracking-tight">Upload .xlsx or .xls file</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {!file ? (
                        <div 
                            onClick={() => fileInputRef.current.click()}
                            className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                        >
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                                <Upload size={32} />
                            </div>
                            <p className="text-slate-700 font-bold mb-1">Click to upload file</p>
                            <p className="text-slate-400 text-sm">or drag and drop it here</p>
                            <input 
                                type="file" 
                                className="hidden" 
                                ref={fileInputRef} 
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                            />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                        <FileSpreadsheet size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{file.name}</p>
                                        <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setFile(null)}
                                    className="text-xs font-bold text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-700 text-sm">
                                    <AlertCircle size={18} />
                                    <span className="font-bold">{error}</span>
                                </div>
                            )}

                            {preview.length > 0 && !error && (
                                <div className="space-y-3">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Preview (First 5 rows)</p>
                                    <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                        <table className="w-full text-xs">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    {Object.keys(preview[0]).map(key => (
                                                        <th key={key} className="text-left px-4 py-3 font-black text-slate-500 uppercase">{key}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {preview.map((row, i) => (
                                                    <tr key={i}>
                                                        {Object.values(row).map((val, j) => (
                                                            <td key={j} className="px-4 py-3 text-slate-700 font-medium">{val}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                        onClick={handleClose}
                        className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={!file || loading || !!error || success}
                        onClick={handleImport}
                        className="min-w-[140px] px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : success ? (
                            <CheckCircle2 size={18} />
                        ) : (
                            'Import Leads'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportLeadsModal;
