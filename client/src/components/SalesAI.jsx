import React, { useState } from 'react';
import { Bot, X, Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SalesAI = () => {
  const [isOpen, setIsOpen] = useState(false);

  const insights = [
    {
      title: "Pipeline Strength",
      desc: "Your pipeline value has increased by 12% this week. Strong momentum in Tech Sector.",
      icon: TrendingUp,
      color: "blue"
    },
    {
      title: "Follow-up Alert",
      desc: "3 leads in 'Proposal' stage haven't been contacted in 48 hours. High risk of churn.",
      icon: AlertCircle,
      color: "orange"
    },
    {
      title: "Win Probability",
      desc: "Lead 'Acme Corp' has an 85% match with your ideal customer profile. Prioritize closing.",
      icon: Sparkles,
      color: "purple"
    }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                    <Bot size={20} />
                  </div>
                  <h3 className="font-bold">Salesor AI</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>
              <p className="text-blue-50 text-xs">I've analyzed your sales data. Here are some smart insights for today.</p>
            </div>

            <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl bg-${insight.color}-100 text-${insight.color}-600`}>
                      <insight.icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">{insight.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{insight.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <button className="w-full py-3 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                <Sparkles size={14} /> Generate Full Report
              </button>
            </div>
            
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-center text-slate-400 font-bold">
              AI insights are based on historical lead behavior and trends.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={28} /> : <Bot size={28} />}
      </motion.button>
    </div>
  );
};

export default SalesAI;
