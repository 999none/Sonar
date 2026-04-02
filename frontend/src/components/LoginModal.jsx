import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Lock } from "lucide-react";

export default function LoginModal({ open, onClose, onGoToAuth }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            data-testid="login-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 999,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Card */}
          <motion.div
            key="modal"
            data-testid="login-modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              width: "100%",
              maxWidth: "380px",
              background: "#0a0c14",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              boxShadow: "0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(167,139,250,0.07)",
              padding: "40px 36px 36px",
              textAlign: "center",
            }}
          >
            {/* Close */}
            <button
              data-testid="login-modal-close"
              onClick={onClose}
              style={{
                position: "absolute", top: 14, right: 14,
                width: 28, height: 28, borderRadius: "8px",
                border: "none", background: "rgba(255,255,255,0.06)",
                cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", color: "rgba(255,255,255,0.4)",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
            >
              <X style={{ width: 12, height: 12 }} />
            </button>

            {/* Icon */}
            <div style={{
              width: 52, height: 52, borderRadius: "14px",
              background: "rgba(167,139,250,0.1)",
              border: "1px solid rgba(167,139,250,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 22px",
            }}>
              <Lock style={{ width: 22, height: 22, color: "#a78bfa" }} />
            </div>

            {/* Text */}
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: "1.25rem",
              letterSpacing: "-0.03em", color: "#fff",
              marginBottom: 10,
            }}>
              Connectez-vous pour continuer
            </h2>
            <p style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "13.5px",
              color: "rgba(160,178,200,0.65)",
              lineHeight: 1.6,
              marginBottom: 28,
            }}>
              Sonar est réservé aux membres. Créez un compte gratuit ou connectez-vous pour commencer à builder.
            </p>

            {/* CTA */}
            <motion.button
              data-testid="login-modal-cta"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { onClose(); onGoToAuth(); }}
              style={{
                width: "100%", padding: "13px 0",
                borderRadius: "12px", border: "none",
                background: "linear-gradient(90deg, #7c3aed 0%, #a855f7 60%, #c084fc 100%)",
                color: "#fff", fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: "14px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, boxShadow: "0 4px 24px rgba(124,58,237,0.4)",
                marginBottom: 12,
              }}
            >
              Se connecter <ArrowRight style={{ width: 15, height: 15 }} />
            </motion.button>

            <p style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "12px",
              color: "rgba(255,255,255,0.25)",
            }}>
              Gratuit · Aucune carte bancaire requise
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
