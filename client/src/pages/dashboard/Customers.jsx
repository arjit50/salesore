import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Mail, Star, Plus, Upload, Download, Loader2, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import AddCustomerModal from './components/AddCustomerModal';
import ImportCustomersModal from './components/ImportCustomersModal';
import ExportConfirmModal from './components/ExportConfirmModal';
import EditCustomerModal from './components/EditCustomerModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/customers');
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCustomerAdded = (newCustomer) => {
    setCustomers([newCustomer, ...customers]);
  };

  const handleCustomerUpdated = (updatedCustomer) => {
    setCustomers(customers.map(c => c._id === updatedCustomer._id ? updatedCustomer : c));
  };

  const handleCustomerDeleted = (customerId) => {
    setCustomers(customers.filter(c => c._id !== customerId));
  };

  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = 
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || cust.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const exportData = filteredCustomers.map(cust => ({
      Name: cust.name,
      Email: cust.email,
      Company: cust.company || 'N/A',
      Status: cust.status,
      'Total Spent': cust.totalSpent || 0,
      'Last Order': cust.lastOrderDate ? new Date(cust.lastOrderDate).toLocaleDateString() : 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, "Customers_Export.xlsx");
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
          <p className="text-slate-500 text-sm">View and manage your loyal customer base.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload size={18}/> Import
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 cursor-pointer"
          >
            <Plus size={18} /> Add New Customer
          </button>
        </div>
      </div>

       <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or company..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              className="w-full appearance-none flex items-center gap-2 px-10 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 focus:outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <Filter size={16} className="absolute left-4 top-2.5 text-slate-400 pointer-events-none" />
          </div>
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
          <div key={customer._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                    {customer.name.charAt(0)}
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${customer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {customer.status}
                </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1">{customer.name}</h3>
            <p className="text-xs font-medium text-slate-400 mb-4">{customer.company || 'Independent'}</p>

            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail size={14} className="text-slate-400" />
                    {customer.email}
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Total Spent</span>
                    <span className="font-black text-slate-800 text-sm">₹ {customer.totalSpent?.toLocaleString() || 0}</span>
                </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-50">
                <button 
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsEditModalOpen(true);
                  }}
                  className="flex-1 py-3 text-xs font-bold text-indigo-600 bg-indigo-50/50 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                >
                    <Edit size={14} /> Edit
                </button>
                <button 
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <Trash2 size={18} />
                </button>
                <button className="p-3 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-colors">
                    <Star size={18} />
                </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
             No customers found matching your criteria.
          </div>
        )}
      </div>

      <AddCustomerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onCustomerAdded={handleCustomerAdded}
      />

      <ImportCustomersModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImportSuccess={fetchCustomers}
      />

      <ExportConfirmModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        onConfirm={handleExport}
        count={filteredCustomers.length}
      />

      <EditCustomerModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onCustomerUpdated={handleCustomerUpdated}
        customer={selectedCustomer}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onDeleteSuccess={handleCustomerDeleted}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default Customers;
