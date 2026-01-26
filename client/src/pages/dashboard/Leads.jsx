import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Mail, Upload, Pencil, Trash2, RefreshCw, X, MessageCircle } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import AddLeadModal from './components/AddLeadModal';
import EditLeadModal from './components/EditLeadModal';
import DeleteLeadConfirmModal from './components/DeleteLeadConfirmModal';
import ImportLeadsModal from './components/ImportLeadsModal';
import ExportConfirmModal from './components/ExportConfirmModal';
import SendEmailModal from './components/SendEmailModal';
import SendWhatsAppModal from './components/SendWhatsAppModal';
import LeadHistoryModal from './components/LeadHistoryModal';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedLeadForHistory, setSelectedLeadForHistory] = useState(null);
  const [emailLead, setEmailLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppLead, setWhatsAppLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const fetchLeads = async (refresh = false, background = false) => {
    try {
      if (!background) setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/leads${refresh ? '?refresh=true' : ''}`);
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      if (!background) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    // Poll for updates every 5 seconds
    const intervalId = setInterval(() => {
      fetchLeads(true, true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLeadAdded = (newLead) => {
    setLeads([newLead, ...leads]);
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setIsEditModalOpen(true);
  };

  const handleLeadUpdated = (updatedLead) => {
    setLeads(prevLeads => prevLeads.map(l => l._id === updatedLead._id ? updatedLead : l));
    // Also update history view if it's open for this lead
    if (selectedLeadForHistory?._id === updatedLead._id) {
      setSelectedLeadForHistory(updatedLead);
    }
  };

  const handleDeleteClick = (lead) => {
    setLeadToDelete(lead);
    setIsDeleteModalOpen(true);
  };

  const handleLeadDeleted = (leadId) => {
    setLeads(leads.filter(l => l._id !== leadId));
  };

  const handleLeadUpdate = handleLeadUpdated;

  const handleEmailClick = (lead) => {
    setEmailLead(lead);
    setIsEmailModalOpen(true);
  };

  const handleLeadClick = (lead) => {
    if (selectedLeads.length > 0) {
      handleSelectLead(lead._id);
      return;
    }
    setSelectedLeadForHistory(lead);
    setIsHistoryModalOpen(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads(paginatedLeads.map(l => l._id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };

  const handleBulkDeleteSuccess = (deletedIds) => {
    setLeads(leads.filter(l => !deletedIds.includes(l._id)));
    setSelectedLeads([]);
  };

  const handleBulkEmailSuccess = () => {
    setSelectedLeads([]);
    fetchLeads(true); // Refresh to update status/history
  };

  const handleWhatsAppClick = (lead) => {
    setWhatsAppLead(lead);
    setIsWhatsAppModalOpen(true);
  };

  const handleBulkWhatsAppSuccess = () => {
    setSelectedLeads([]);
    fetchLeads(true);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleExport = () => {
    const exportData = filteredLeads.map(lead => ({
      Name: lead.name,
      Email: lead.email,
      Company: lead.company || 'N/A',
      Phone: lead.phone || 'N/A',
      'WhatsApp Number': lead.whatsappNumber || 'N/A',
      Status: lead.status,
      Value: lead.value || 0,
      Source: lead.source || 'N/A',
      Date: new Date(lead.createdAt).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "Leads_Export.xlsx");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Contacted': return 'bg-orange-100 text-orange-700';
      case 'Qualified': return 'bg-purple-100 text-purple-700';
      case 'Proposal': return 'bg-yellow-100 text-yellow-700';
      case 'Lost': return 'bg-red-100 text-red-700';
      case 'Won': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
          <p className="text-slate-500 text-sm">Manage your potential customers and opportunities.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchLeads(true)}
            className="bg-white border border-slate-200 text-slate-700 px-3 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
            title="Refresh Leads"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
          >
            <Upload size={18} /> Import
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-200 cursor-pointer"
          >
            <Plus size={18} /> Add New Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search leads by name, email or company..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              className="appearance-none flex items-center gap-2 px-10 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 focus:outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
            <Filter size={16} className="absolute left-4 top-2.5 text-slate-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all cursor-pointer"
          >
            Export
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedLeads.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-4">
          <span className="font-bold text-sm">{selectedLeads.length} selected</span>
          <div className="h-4 w-px bg-slate-700"></div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsBulkEmailModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
            >
              <Mail size={16} /> Email
            </button>
            <button
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-emerald-900/50 text-emerald-400 hover:text-emerald-300 rounded-lg transition-colors text-sm font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </button>
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-900/50 text-red-400 hover:text-red-300 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
          <button
            onClick={() => setSelectedLeads([])}
            className="ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-4 px-6 w-10">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Value</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
              <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedLeads.length > 0 ? (
              paginatedLeads.map((lead) => (
                <tr key={lead._id} className={`hover:bg-slate-50/50 transition-colors group ${selectedLeads.includes(lead._id) ? 'bg-blue-50/30' : ''}`}>
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedLeads.includes(lead._id)}
                      onChange={() => handleSelectLead(lead._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleLeadClick(lead)}>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{lead.name}</p>
                        <p className="text-xs text-slate-500">{lead.email || 'No Email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700 text-sm">
                    ₹ {lead.value?.toLocaleString() || 0}
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-sm">
                    {lead.source || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(lead)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleEmailClick(lead)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        onClick={() => handleWhatsAppClick(lead)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(lead)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-400 text-sm">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs text-slate-400">
            Showing {paginatedLeads.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
          </p>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-500 mr-2">Page {currentPage} of {totalPages || 1}</span>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-3 py-1 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 cursor-pointer"
            >
              Prev
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLeadAdded={handleLeadAdded}
      />

      <EditLeadModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingLead(null);
        }}
        onLeadUpdated={handleLeadUpdated}
        lead={editingLead}
      />

      <DeleteLeadConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setLeadToDelete(null);
        }}
        onDeleteSuccess={handleLeadDeleted}
        lead={leadToDelete}
      />

      <DeleteLeadConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onDeleteSuccess={handleBulkDeleteSuccess}
        leads={selectedLeads}
      />

      <ImportLeadsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={fetchLeads}
      />

      <ExportConfirmModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={handleExport}
        count={filteredLeads.length}
      />

      <SendEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setEmailLead(null);
        }}
        lead={emailLead}
        onSuccess={handleLeadUpdated}
      />

      <SendEmailModal
        isOpen={isBulkEmailModalOpen}
        onClose={() => setIsBulkEmailModalOpen(false)}
        leads={selectedLeads}
        onSuccess={handleBulkEmailSuccess}
      />

      <SendWhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => {
          setIsWhatsAppModalOpen(false);
          setWhatsAppLead(null);
        }}
        lead={whatsAppLead}
        leads={selectedLeads}
        onSuccess={handleBulkWhatsAppSuccess}
      />

      <LeadHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedLeadForHistory(null);
        }}
        lead={selectedLeadForHistory}
      />
    </div>
  );
};

export default Leads;
