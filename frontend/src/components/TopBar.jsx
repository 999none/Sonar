import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Share2, LayoutGrid, Zap } from "lucide-react";

export default function TopBar({ isGenerating, onDeploy, onShare, onHome, projectName }) {
  const [deployed, setDeployed] = useState(false);

  const handleDeploy = () => {
    setDeployed(true);
    onDeploy();
    setTimeout(() => setDeployed(false), 3000);
  };

  return (
    <div
      className="h-11 flex items-center flex-shrink-0 z-20"
      style={{
        background: "#06090f",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Home */}
      <button
        data-testid="nav-home"
        onClick={onHome}
        className="flex items-center gap-2 px-4 h-full flex-shrink-0 transition-colors"
        style={{ color: "rgba(180,195,215,0.7)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        onMouseEnter={e => e.currentTarget.style.color = "#e2e8f0"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(180,195,215,0.7)"}
      >
        <LayoutGrid style={{ width: 14, height: 14 }} />
        <span style={{ fontSize: "13px", fontFamily: "'Manrope', sans-serif", fontWeight: 500 }}>Home</span>
      </button>

      {/* Project name — center */}
      <div className="flex-1 flex items-center justify-center gap-2">
        {projectName && projectName !== "untitled-app" && (
          <>
            <span style={{ fontSize: "12px", color: "rgba(100,116,139,0.4)", fontFamily: "'Manrope',sans-serif" }}>/</span>
            <span style={{ fontSize: "13px", color: "rgba(180,195,215,0.75)", fontFamily: "'Manrope',sans-serif", fontWeight: 500 }}>
              {projectName}
            </span>
            {isGenerating && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
                className="flex items-center gap-1"
              >
                <Zap style={{ width: 11, height: 11, color: "#4ade80" }} />
                <span style={{ fontSize: "11px", color: "rgba(74,222,128,0.7)", fontFamily: "'Manrope',sans-serif" }}>
                  generating
                </span>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Share + Deploy */}
      <div className="flex items-center gap-2 px-3 flex-shrink-0" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
        <motion.button
          data-testid="share-button"
          onClick={onShare}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(180,195,215,0.85)",
          }}
        >
          <Share2 style={{ width: 13, height: 13 }} /> Share
        </motion.button>

        <motion.button
          data-testid="deploy-button"
          onClick={handleDeploy}
          disabled={isGenerating}
          whileHover={!isGenerating ? { scale: 1.03 } : {}}
          whileTap={!isGenerating ? { scale: 0.97 } : {}}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: deployed
              ? "linear-gradient(135deg,#10b981,#059669)"
              : isGenerating
              ? "rgba(30,41,59,0.5)"
              : "linear-gradient(135deg,#06b6d4,#0ea5e9)",
            color: isGenerating ? "#475569" : "#000",
            boxShadow: !isGenerating && !deployed ? "0 0 16px rgba(6,182,212,0.3)" : "none",
            cursor: isGenerating ? "not-allowed" : "pointer",
          }}
        >
          <Rocket style={{ width: 13, height: 13 }} />
          {deployed ? "Deployed!" : "Deploy"}
        </motion.button>
      </div>
    </div>
  );
}
