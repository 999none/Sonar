import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Twitter, Link } from "lucide-react";

export default function ShareModal({ isOpen, onClose, projectName }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://share.sonar.sh/${projectName || "my-app"}-${Math.random().toString(36).slice(2, 7)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const text = `I just built an app with Sonar AI in seconds! Check it out 👇`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ duration: 0.2, type: "spring", bounce: 0.3 }}
            onClick={e => e.stopPropagation()}
            className="w-full rounded-2xl overflow-hidden"
            style={{
              maxWidth: "400px",
              background: "#0a0d14",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 32px 64px rgba(0,0,0,0.7)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  Share your app
                </p>
                <p style={{ fontSize: "11px", color: "rgba(100,116,139,0.6)", fontFamily: "'Manrope', sans-serif" }}>
                  Anyone with this link can view your app
                </p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <X style={{ width: 14, height: 14, color: "#64748b" }} />
              </button>
            </div>

            {/* Share URL */}
            <div className="p-5">
              <div className="flex items-center gap-2 px-3 py-3 rounded-xl mb-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Link style={{ width: 13, height: 13, color: "#64748b", flexShrink: 0 }} />
                <span className="flex-1 text-xs truncate" style={{ color: "#06b6d4", fontFamily: "'JetBrains Mono', monospace" }}>
                  {shareUrl}
                </span>
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0"
                  style={{
                    background: copied ? "rgba(74,222,128,0.12)" : "rgba(6,182,212,0.12)",
                    border: `1px solid ${copied ? "rgba(74,222,128,0.25)" : "rgba(6,182,212,0.25)"}`,
                    color: copied ? "#4ade80" : "#06b6d4",
                  }}
                >
                  {copied ? <Check style={{ width: 11, height: 11 }} /> : <Copy style={{ width: 11, height: 11 }} />}
                  {copied ? "Copied!" : "Copy"}
                </motion.button>
              </div>

              {/* Share options */}
              <p style={{ fontSize: "11px", color: "rgba(100,116,139,0.5)", marginBottom: 10, fontFamily: "'Manrope', sans-serif" }}>
                Share on
              </p>
              <div className="flex gap-2">
                <button
                  onClick={shareTwitter}
                  data-testid="share-twitter"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(180,195,215,0.8)",
                    fontFamily: "'Manrope', sans-serif",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                >
                  <Twitter style={{ width: 12, height: 12 }} /> Twitter / X
                </button>
                <button
                  data-testid="share-link"
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(180,195,215,0.8)",
                    fontFamily: "'Manrope', sans-serif",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                >
                  <Copy style={{ width: 12, height: 12 }} /> Copy link
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
