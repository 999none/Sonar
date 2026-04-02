import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Rocket, Coins, Clock, DollarSign, Info, HelpCircle, X } from "lucide-react";
import { MODELS } from "../data/mockData";

const ModelIcon = ({ provider }) => {
  const colors = { openai: "#10B981", anthropic: "#8B5CF6", google: "#3B82F6" };
  const labels = { openai: "GPT", anthropic: "C", google: "G" };
  return (
    <span className="w-4 h-4 rounded text-xs font-black flex items-center justify-center"
      style={{ background: colors[provider], color: "#000", fontSize: "9px" }}>
      {labels[provider]}
    </span>
  );
};

export default function TopBar({
  selectedModel, setSelectedModel,
  mode, setMode,
  isGenerating, onDeploy,
  credits, timeElapsed, estimatedCost,
  projectName,
}) {
  const [modelOpen, setModelOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  const handleDeploy = () => {
    setDeployed(true);
    onDeploy();
    setTimeout(() => setDeployed(false), 3000);
  };

  return (
    <div
      className="h-14 flex items-center justify-between px-4 flex-shrink-0 z-20"
      style={{
        background: "rgba(2,4,10,0.95)",
        borderBottom: "1px solid rgba(30,41,59,0.8)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Left: Logo + Project */}
      <div className="flex items-center gap-3">
        <span className="text-white font-black text-lg tracking-tighter" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          sonar
        </span>
        <span className="text-slate-700">/</span>
        <span className="text-sm text-slate-400 font-medium">{projectName || "untitled-app"}</span>
      </div>

      {/* Center: Controls */}
      <div className="flex items-center gap-2">
        {/* Model Selector */}
        <div className="relative">
          <button
            data-testid="model-selector"
            onClick={() => setModelOpen(o => !o)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{
              background: "rgba(15,23,42,0.8)",
              border: "1px solid rgba(30,41,59,0.8)",
              color: "#cbd5e1",
            }}
          >
            <ModelIcon provider={currentModel.provider} />
            <span>{currentModel.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <AnimatePresence>
            {modelOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 left-0 w-52 rounded-xl overflow-hidden z-50 shadow-2xl"
                style={{
                  background: "#0F172A",
                  border: "1px solid rgba(30,41,59,0.9)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                }}
              >
                {MODELS.map(m => (
                  <button
                    key={m.id}
                    data-testid={`model-option-${m.id}`}
                    onClick={() => { setSelectedModel(m.id); setModelOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-slate-800/60"
                    style={{ color: selectedModel === m.id ? "#06b6d4" : "#94a3b8" }}
                  >
                    <ModelIcon provider={m.provider} />
                    <span>{m.label}</span>
                    {selectedModel === m.id && <span className="ml-auto text-cyan-400">✓</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* E-1 / E-2 Toggle */}
        <div className="relative flex items-center">
          <div
            className="flex items-center rounded-lg p-0.5 gap-0.5"
            style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(30,41,59,0.8)" }}
          >
            {["E-1", "E-2"].map(m => (
              <button
                key={m}
                data-testid={`mode-${m.toLowerCase().replace("-", "")}`}
                onClick={() => setMode(m)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
                style={{
                  background: mode === m ? "rgba(6,182,212,0.15)" : "transparent",
                  color: mode === m ? "#06b6d4" : "#64748b",
                  border: mode === m ? "1px solid rgba(6,182,212,0.3)" : "1px solid transparent",
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            data-testid="mode-tooltip-btn"
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            className="ml-1 text-slate-600 hover:text-slate-400 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
          <AnimatePresence>
            {tooltipOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute top-full mt-2 left-0 w-64 rounded-xl p-4 z-50 text-xs"
                style={{
                  background: "#0F172A",
                  border: "1px solid rgba(30,41,59,0.9)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                }}
              >
                <p className="text-cyan-400 font-semibold mb-2">E-1 vs E-2</p>
                <p className="text-slate-400 mb-2"><span className="text-white font-medium">E-1:</span> Fast generation, optimized for speed. Best for prototypes and MVPs.</p>
                <p className="text-slate-400"><span className="text-white font-medium">E-2:</span> Deep reasoning mode. Better architecture decisions, production-grade output.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Metrics + Deploy */}
      <div className="flex items-center gap-3">
        {/* Time Elapsed */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-xs text-slate-400"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-500" />
            <span data-testid="time-elapsed">{timeElapsed}s</span>
          </motion.div>
        )}

        {/* Estimated Cost */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <DollarSign className="w-3.5 h-3.5 text-green-500" />
          <span data-testid="estimated-cost">{estimatedCost || "$0.00"}</span>
        </div>

        {/* Credits */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(30,41,59,0.8)" }}
        >
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span data-testid="credits-counter" className="text-slate-300 font-medium">{credits}</span>
          <span className="text-slate-600">credits</span>
        </div>

        {/* Deploy Button */}
        <motion.button
          data-testid="deploy-button"
          onClick={handleDeploy}
          disabled={isGenerating}
          whileHover={!isGenerating ? { scale: 1.03 } : {}}
          whileTap={!isGenerating ? { scale: 0.97 } : {}}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
          style={{
            background: deployed
              ? "linear-gradient(135deg, #10b981, #059669)"
              : isGenerating
              ? "rgba(30,41,59,0.6)"
              : "linear-gradient(135deg, #06b6d4, #0ea5e9)",
            color: isGenerating ? "#475569" : "#000",
            boxShadow: !isGenerating && !deployed ? "0 0 20px rgba(6,182,212,0.35)" : "none",
            cursor: isGenerating ? "not-allowed" : "pointer",
          }}
        >
          <Rocket className="w-3.5 h-3.5" />
          {deployed ? "Deployed!" : "Deploy"}
        </motion.button>
      </div>
    </div>
  );
}
