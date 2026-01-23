import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ImportCustomersModal = ({ isOpen, onClose, onImportSuccess }) => {
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
                const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                
                if (json.length > 0) {
                    const headers = Object.keys(json[0]).map(h => h.toString().trim().toLowerCase());
                    const nameKey = headers.find(h => h === 'name' || h === 'full name' || h === 'customer name');
                    const emailKey = headers.find(h => h === 'email' || h === 'mail' || h === 'email address');
                    
                    if (!nameKey || !emailKey) {
                        setError('Required columns missing: Name and Email');
                        setPreview([]);
                    } else {
                        setPreview(json.slice(0, 5));
                    }
                } else {
                    setError('File is empty');
                }
            } catch (err) {
                setError('Failed to parse Excel file');
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
                    if (cleanKey === 'name' || cleanKey === 'full name' || cleanKey === 'customer name') newItem['name'] = item[key];
                    else if (cleanKey === 'email' || cleanKey === 'mail' || cleanKey === 'email address') newItem['email'] = item[key];
                    else if (cleanKey.includes('phone') || cleanKey.includes('mobile')) newItem['phone'] = item[key]?.toString();
                    else if (cleanKey.includes('company') || cleanKey.includes('org')) newItem['company'] = item[key];
                    else if (cleanKey.includes('spent') || cleanKey.includes('value')) {
                        const val = item[key]?.toString().replace(/[^0-9.]/g, '');
                        newItem['totalSpent'] = parseFloat(val) || 0;
                    }
                    else if (cleanKey.includes('status')) newItem['status'] = item[key];
                });
                return newItem;
            });

            await axios.post('http://localhost:5000/customers/bulk', formattedData);
            setSuccess(true);
            setTimeout(() => {
                onImportSuccess();
                handleClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error importing customers');
            setLoading(false);
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
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Import Customers</h3>
                            <p className="text-xs text-slate-500 font-medium tracking-tight">Upload .xlsx or .xls file</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-8">
                    {!file ? (
                        <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group">
                            <Upload className="w-16 h-16 text-slate-400 mb-4 group-hover:scale-110 group-hover:text-indigo-600 transition-all" size={32} />
                            <p className="text-slate-700 font-bold mb-1">Click to upload file</p>
                            <input type="file" className="hidden" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileChange} />
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
                                <button onClick={() => setFile(null)} className="text-xs font-bold text-red-500 hover:underline">Remove</button>
                            </div>
                            {error && <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-700 text-sm font-bold flex items-center gap-2"><AlertCircle size={18} /> {error}</div>}
                            {preview.length > 0 && (
                                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-50 text-slate-500 uppercase font-black">
                                            <tr>{Object.keys(preview[0]).map(k => <th key={k} className="px-4 py-3">{k}</th>)}</tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {preview.map((row, i) => <tr key={i}>{Object.values(row).map((v, j) => <td key={j} className="px-4 py-3 text-slate-700 font-medium">{v}</td>)}</tr>)}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={handleClose} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all cursor-pointer">Cancel</button>
                    <button disabled={!file || loading || !!error || success} onClick={handleImport} className="min-w-[140px] px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : success ? <CheckCircle2 size={18} /> : 'Import Customers'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportCustomersModal;
