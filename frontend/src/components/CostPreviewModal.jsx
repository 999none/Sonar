import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";
import { MODELS } from "../data/mockData";
import { ChatGPTIcon, ClaudeIcon, GeminiIcon } from "./AIIcons";

const LOADING_STEPS = [
  { label: "Loading cloud environment", duration: 800 },
  { label: "Allocating resources",      duration: 700 },
  { label: "Configuring environment",   duration: 900 },
  { label: "Starting agents",           duration: 600 },
];

function ModelBigIcon({ provider, size = 72 }) {
  if (provider === "openai")     return <span style={{ color: "#fff", opacity: 0.92, display: "flex" }}><ChatGPTIcon size={size} /></span>;
  if (provider === "anthropic")  return <span style={{ color: "#D97757", display: "flex" }}><ClaudeIcon size={size} /></span>;
  return <GeminiIcon size={size} />;
}

export default function CostPreviewModal({ isOpen, onClose, onConfirm, prompt, selectedModel }) {
  const model = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  const [stepIndex, setStepIndex] = useState(-1);  // -1 = not started
  const [doneSteps, setDoneSteps] = useState([]);
  const [ready, setReady] = useState(false);

  // Reset + start loading sequence when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setStepIndex(-1);
    setDoneSteps([]);
    setReady(false);

    let total = 0;
    LOADING_STEPS.forEach((step, i) => {
      // Mark step as "active"
      setTimeout(() => setStepIndex(i), total);
      total += step.duration;
      // Mark step as "done"
      setTimeout(() => setDoneSteps(prev => [...prev, i]), total);
    });
    // All done — enable button
    setTimeout(() => { setStepIndex(-1); setReady(true); }, total + 200);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.22, type: "spring", bounce: 0.28 }}
            className="w-full rounded-2xl overflow-hidden"
            style={{
              maxWidth: "380px",
              background: "#0a0d14",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.7)",
            }}
          >
            {/* Close */}
            <div className="flex justify-end px-5 pt-4">
              <button onClick={onClose} className="p-1 rounded-lg transition-colors hover:bg-white/5">
                <X style={{ width: 14, height: 14, color: "#64748b" }} />
              </button>
            </div>

            {/* Model icon — big */}
            <div className="flex flex-col items-center px-6 pb-2 pt-1">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.35, type: "spring", bounce: 0.4 }}
                className="flex items-center justify-center mb-4"
                style={{
                  width: 100, height: 100,
                  borderRadius: "24px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <ModelBigIcon provider={model.provider} size={60} />
              </motion.div>

              <p className="text-white font-bold text-xl mb-1" style={{ fontFamily: "'Cabinet Grotesk',sans-serif", letterSpacing: "-0.01em" }}>
                {model.label}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(100,116,139,0.7)", fontFamily: "'Manrope',sans-serif", marginBottom: 20 }}>
                {model.provider === "openai" ? "OpenAI" : model.provider === "anthropic" ? "Anthropic" : "Google DeepMind"}
              </p>

              {/* Prompt pill */}
              <div className="w-full px-4 py-2.5 rounded-xl mb-6"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-xs leading-relaxed line-clamp-2"
                  style={{ color: "rgba(180,195,215,0.7)", fontFamily: "'Manrope',sans-serif" }}>
                  {prompt}
                </p>
              </div>
            </div>

            {/* Loading steps */}
            <div className="px-6 pb-5 space-y-2">
              {LOADING_STEPS.map((step, i) => {
                const isDone    = doneSteps.includes(i);
                const isActive  = stepIndex === i;
                const isPending = stepIndex < i && !isDone;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: isPending ? 0.35 : 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.2 }}
                    className="flex items-center gap-3"
                  >
                    {/* Status dot / spinner / check */}
                    <div style={{ width: 18, height: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isDone ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                          <Check style={{ width: 14, height: 14, color: "#4ade80" }} />
                        </motion.div>
                      ) : isActive ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                          style={{
                            width: 14, height: 14, borderRadius: "50%",
                            border: "2px solid rgba(6,182,212,0.2)",
                            borderTopColor: "#06b6d4",
                          }}
                        />
                      ) : (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(100,116,139,0.35)" }} />
                      )}
                    </div>

                    {/* Label */}
                    <span style={{
                      fontSize: "13px",
                      fontFamily: "'Manrope',sans-serif",
                      color: isDone ? "#4ade80" : isActive ? "#e2e8f0" : "rgba(100,116,139,0.5)",
                      transition: "color 0.3s",
                    }}>
                      {step.label}
                    </span>

                    {/* Active progress bar */}
                    {isActive && (
                      <motion.div
                        className="flex-1 h-px rounded-full ml-2"
                        style={{ background: "rgba(255,255,255,0.06)", overflow: "hidden" }}
                      >
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: step.duration / 1000, ease: "linear" }}
                          style={{ height: "100%", background: "linear-gradient(90deg, #06b6d4, #0ea5e9)" }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748b" }}
              >
                Cancel
              </button>
              <motion.button
                data-testid="confirm-generate-btn"
                onClick={ready ? onConfirm : undefined}
                animate={ready ? { opacity: 1 } : { opacity: 0.4 }}
                transition={{ duration: 0.4 }}
                whileHover={ready ? { scale: 1.02 } : {}}
                whileTap={ready ? { scale: 0.98 } : {}}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, #06b6d4, #0ea5e9)",
                  color: "#000",
                  boxShadow: ready ? "0 0 20px rgba(6,182,212,0.35)" : "none",
                  cursor: ready ? "pointer" : "not-allowed",
                }}
              >
                {ready ? (
                  <> Generate <ArrowRight style={{ width: 14, height: 14 }} /> </>
                ) : (
                  <span style={{ color: "rgba(0,0,0,0.5)" }}>Preparing...</span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
