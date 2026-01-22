import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Plus, Search, GripVertical } from 'lucide-react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const SortableItem = ({ item, color }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
           <div {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-300 hover:text-slate-500 transition-colors">
              <GripVertical size={14} />
           </div>
           <span className={`w-8 h-1 bg-${color}-500 rounded-full`}></span>
        </div>
        <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal size={14}/></button>
      </div>
      <h4 className="font-bold text-slate-800 mb-1 text-sm">{item.name}</h4>
      <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase">{item.company || 'Private'}</p>
      <div className="flex justify-between items-center pt-3 border-t border-slate-50">
          <span className="font-black text-slate-700 text-xs">₹ {item.value?.toLocaleString()}</span>
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-white shadow-sm">
              {item.name?.charAt(0)}
          </div>
      </div>
    </div>
  );
};

const Pipeline = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const columns = [
    { id: 'New', title: 'New Leads', color: 'blue' },
    { id: 'Contacted', title: 'Contacted', color: 'orange' },
    { id: 'Qualified', title: 'Qualified', color: 'purple' },
    { id: 'Proposal', title: 'Proposal', color: 'yellow' },
    { id: 'Won', title: 'Won', color: 'emerald' },
  ];

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/leads');
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeLead = leads.find(l => l._id === active.id);
    const overId = over.id;

    // Logic for moving between columns or sorting
    // For simplicity in this demo, we'll handle column moves if dropped on a column/item in another column
    const overLead = leads.find(l => l._id === overId);
    let newStatus = overId; // Default if dropped on column container
    
    if (overLead) {
      newStatus = overLead.status;
    }

    if (activeLead.status !== newStatus && columns.some(c => c.id === newStatus)) {
      setLeads(prev => prev.map(l => l._id === active.id ? { ...l, status: newStatus } : l));
      try {
        await axios.put(`http://localhost:5000/leads/${active.id}`, { status: newStatus });
      } catch (error) {
        console.error('Failed to update lead status:', error);
      }
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
    <div className="h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales Pipeline</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and track your deals through every stage.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
              <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-500" size={16} />
              <input type="text" placeholder="Search deals..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 w-48 transition-all" />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-200">
            <Plus size={18} /> Add Deal
          </button>
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragStart={(e) => setActiveId(e.active.id)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6 h-full min-h-[500px]">
          {columns.map((col) => (
            <div key={col.id} className="min-w-[280px] flex-1 flex flex-col max-w-xs">
              <div className="flex justify-between items-center mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${col.color}-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]`}></div>
                  <h3 className="font-black text-slate-700 text-[10px] uppercase tracking-widest">{col.title}</h3>
                </div>
                <span className="bg-white border border-slate-100 text-slate-400 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                  {leads.filter(l => l.status === col.id).length}
                </span>
              </div>
              
              <div className="flex-1 bg-slate-50/50 rounded-3xl p-3 space-y-3 border border-slate-100 shadow-inner">
                <SortableContext items={leads.filter(l => l.status === col.id).map(l => l._id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3 min-h-[100px]">
                    <AnimatePresence>
                      {leads.filter(l => l.status === col.id).map((item) => (
                        <motion.div
                          key={item._id}
                          layoutId={item._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <SortableItem item={item} color={col.color} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </SortableContext>
                
                <button className="w-full py-3 text-[10px] font-black text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-200 hover:text-blue-500 hover:bg-white transition-all group">
                    <Plus size={14} className="inline mr-1 group-hover:scale-110 transition-transform" /> ADD TO {col.title.toUpperCase()}
                </button>
              </div>
            </div>
          ))}
        </div>

        <DragOverlay adjustScale={true}>
          {activeId ? (
            <div className="bg-white p-4 rounded-2xl border-2 border-blue-500 shadow-2xl opacity-90 rotate-2 scale-105">
              <h4 className="font-bold text-slate-800 text-sm">{leads.find(l => l._id === activeId)?.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{leads.find(l => l._id === activeId)?.company}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Pipeline;
