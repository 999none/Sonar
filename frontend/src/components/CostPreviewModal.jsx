import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Clock, DollarSign, Cpu, ArrowRight } from "lucide-react";
import { MODELS } from "../data/mockData";

export default function CostPreviewModal({ isOpen, onClose, onConfirm, prompt, selectedModel, mode }) {
  const model = MODELS.find(m => m.id === selectedModel) || MODELS[0];
  const isE2 = mode === "E-2";

  const estimates = {
    time: isE2 ? "52-68s" : "28-40s",
    cost: isE2 ? "$0.18" : "$0.09",
    tokens: isE2 ? "~12,400" : "~6,200",
    quality: isE2 ? "Production-grade" : "Prototype-ready",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, type: "spring", bounce: 0.3 }}
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: "#0F172A",
              border: "1px solid rgba(30,41,59,0.9)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(6,182,212,0.05)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid rgba(30,41,59,0.6)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}>
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Generation Preview</p>
                  <p className="text-xs text-slate-500">Estimated resources</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prompt Preview */}
            <div className="mx-6 mt-4 px-4 py-3 rounded-xl"
              style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(30,41,59,0.6)" }}>
              <p className="text-xs text-slate-500 mb-1">Your prompt</p>
              <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{prompt}</p>
            </div>

            {/* Estimates Grid */}
            <div className="grid grid-cols-2 gap-3 p-6">
              {[
                { icon: Clock, label: "Est. Time", value: estimates.time, color: "#06b6d4" },
                { icon: DollarSign, label: "Est. Cost", value: estimates.cost, color: "#10b981" },
                { icon: Cpu, label: "Tokens Used", value: estimates.tokens, color: "#8b5cf6" },
                { icon: Zap, label: "Output Quality", value: estimates.quality, color: "#f59e0b" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="p-4 rounded-xl"
                  style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(30,41,59,0.6)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                    <span className="text-xs text-slate-500">{label}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            {/* Model + Mode info */}
            <div className="mx-6 mb-4 px-4 py-3 rounded-xl flex items-center justify-between"
              style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.1)" }}>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Model:</span>
                <span className="text-xs font-medium text-cyan-400">{model.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Mode:</span>
                <span className="text-xs font-medium text-cyan-400">{mode}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "rgba(30,41,59,0.5)",
                  border: "1px solid rgba(30,41,59,0.6)",
                  color: "#64748b",
                }}
              >
                Cancel
              </button>
              <button
                data-testid="confirm-generate-btn"
                onClick={onConfirm}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg, #06b6d4, #0ea5e9)",
                  color: "#000",
                  boxShadow: "0 0 20px rgba(6,182,212,0.3)",
                }}
              >
                Generate <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
