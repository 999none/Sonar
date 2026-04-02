import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export default function TopBar({ isGenerating, onDeploy, projectName }) {
  const [deployed, setDeployed] = useState(false);

  const handleDeploy = () => {
    setDeployed(true);
    onDeploy();
    setTimeout(() => setDeployed(false), 3000);
  };

  return (
    <div
      className="h-12 flex items-center justify-between px-5 flex-shrink-0 z-20"
      style={{
        background: "#06090f",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Left: Logo + Project */}
      <div className="flex items-center gap-3">
        <span className="text-white font-black text-lg tracking-tighter" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          sonar
        </span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <span className="text-sm font-medium" style={{ color: "rgba(148,163,184,0.8)" }}>
          {projectName || "untitled-app"}
        </span>
      </div>

      {/* Right: Deploy only */}
      <motion.button
        data-testid="deploy-button"
        onClick={handleDeploy}
        disabled={isGenerating}
        whileHover={!isGenerating ? { scale: 1.03 } : {}}
        whileTap={!isGenerating ? { scale: 0.97 } : {}}
        className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300"
        style={{
          background: deployed
            ? "linear-gradient(135deg, #10b981, #059669)"
            : isGenerating
            ? "rgba(30,41,59,0.5)"
            : "linear-gradient(135deg, #06b6d4, #0ea5e9)",
          color: isGenerating ? "#475569" : "#000",
          boxShadow: !isGenerating && !deployed ? "0 0 18px rgba(6,182,212,0.3)" : "none",
          cursor: isGenerating ? "not-allowed" : "pointer",
        }}
      >
        <Rocket className="w-3.5 h-3.5" />
        {deployed ? "Deployed!" : "Deploy"}
      </motion.button>
    </div>
  );
}
