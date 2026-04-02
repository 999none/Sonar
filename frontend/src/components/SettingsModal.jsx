import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Globe, Bell, CreditCard, Sun, Moon, ChevronDown, Check } from "lucide-react";

const LANGS = ["Français", "English", "Español", "Deutsch", "日本語", "中文"];

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 40, height: 22, borderRadius: 99,
        background: on
          ? "linear-gradient(90deg, #7c3aed, #a855f7)"
          : "rgba(255,255,255,0.12)",
        border: "none", cursor: "pointer", position: "relative",
        transition: "background 0.2s", flexShrink: 0, padding: 0,
        boxShadow: on ? "0 0 12px rgba(124,58,237,0.4)" : "none",
      }}
    >
      <motion.div
        animate={{ x: on ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff",
          position: "absolute", top: 2,
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "10.5px", fontWeight: 700,
        color: "rgba(140,160,200,0.5)",
        textTransform: "uppercase", letterSpacing: "0.1em",
        marginBottom: 10,
      }}>
        {title}
      </p>
      <div style={{
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
      }}>
        {children}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, children, last }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 16px",
      borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.05)",
    }}>
      {Icon && <Icon style={{ width: 15, height: 15, color: "rgba(140,165,210,0.6)", flexShrink: 0 }} />}
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(210,225,245,0.85)", flex: 1 }}>
        {label}
      </span>
      {children}
    </div>
  );
}

export default function SettingsModal({ open, onClose, user, isDark, onToggleTheme }) {
  const [lang, setLang] = useState("Français");
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [notifApp, setNotifApp] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 1100,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Modal */}
          <motion.div
            key="settings-modal"
            data-testid="settings-modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1101, pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "100%", maxWidth: "480px",
                background: "linear-gradient(160deg, rgba(14,22,55,0.97) 0%, rgba(5,7,18,0.99) 100%)",
                backdropFilter: "blur(48px)",
                WebkitBackdropFilter: "blur(48px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "24px",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.85)",
                pointerEvents: "all",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "22px 24px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}>
                <h2 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700, fontSize: "16px",
                  color: "#fff", letterSpacing: "-0.02em",
                }}>
                  Paramètres
                </h2>
                <button
                  data-testid="settings-close"
                  onClick={onClose}
                  style={{
                    width: 30, height: 30, borderRadius: "8px", border: "none",
                    background: "rgba(255,255,255,0.06)", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.45)", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
                >
                  <X style={{ width: 13, height: 13 }} />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: "22px 24px 24px", maxHeight: "70vh", overflowY: "auto" }}>

                {/* Profil */}
                <Section title="Profil">
                  <Row icon={User} label={user?.name || "Utilisateur"}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(120,145,185,0.6)" }}>
                      {user?.email || "—"}
                    </span>
                  </Row>
                  <Row icon={null} label="Plan actuel" last>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600,
                      color: "#a78bfa", background: "rgba(167,139,250,0.12)",
                      padding: "3px 10px", borderRadius: "99px",
                    }}>
                      Free
                    </span>
                  </Row>
                </Section>

                {/* Apparence */}
                <Section title="Apparence">
                  <Row icon={isDark ? Moon : Sun} label="Thème" last>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(140,165,200,0.6)" }}>
                        {isDark ? "Sombre" : "Clair"}
                      </span>
                      <Toggle on={isDark} onChange={() => onToggleTheme()} />
                    </div>
                  </Row>
                </Section>

                {/* Langue */}
                <Section title="Langue">
                  <Row icon={Globe} label="Langue de l'interface" last>
                    <div style={{ position: "relative" }}>
                      <button
                        data-testid="settings-lang-btn"
                        onClick={() => setShowLangPicker(v => !v)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "5px 10px 5px 12px",
                          borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)",
                          background: "rgba(255,255,255,0.06)", cursor: "pointer",
                          color: "rgba(200,220,245,0.85)",
                          fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                      >
                        {lang}
                        <ChevronDown style={{ width: 12, height: 12, transition: "transform 0.2s", transform: showLangPicker ? "rotate(180deg)" : "none" }} />
                      </button>

                      <AnimatePresence>
                        {showLangPicker && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            style={{
                              position: "absolute", right: 0, top: "calc(100% + 6px)",
                              width: 150, zIndex: 10,
                              background: "linear-gradient(160deg, rgba(16,26,60,0.98) 0%, rgba(6,9,20,0.99) 100%)",
                              backdropFilter: "blur(24px)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "12px",
                              boxShadow: "0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
                              overflow: "hidden",
                            }}
                          >
                            {LANGS.map((l, i) => (
                              <button
                                key={l}
                                onClick={() => { setLang(l); setShowLangPicker(false); }}
                                style={{
                                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                                  padding: "9px 14px", border: "none",
                                  background: "transparent", cursor: "pointer",
                                  fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
                                  color: l === lang ? "#a78bfa" : "rgba(200,220,245,0.8)",
                                  borderBottom: i < LANGS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                                  transition: "background 0.1s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              >
                                {l}
                                {l === lang && <Check style={{ width: 12, height: 12, color: "#a78bfa" }} />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Row>
                </Section>

                {/* Notifications */}
                <Section title="Notifications">
                  <Row icon={Bell} label="Notifications dans l'app">
                    <Toggle on={notifApp} onChange={setNotifApp} />
                  </Row>
                  <Row icon={null} label="Emails de mise à jour" last>
                    <Toggle on={notifEmail} onChange={setNotifEmail} />
                  </Row>
                </Section>

                {/* Compte */}
                <Section title="Compte">
                  <Row icon={CreditCard} label="Crédits restants">
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#10b981" }}>
                      $2.40
                    </span>
                  </Row>
                  <Row icon={null} label="Recharger" last>
                    <button
                      style={{
                        padding: "5px 14px", borderRadius: "8px", border: "none",
                        background: "linear-gradient(90deg, #7c3aed, #a855f7)",
                        color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "12px", fontWeight: 600, cursor: "pointer",
                        boxShadow: "0 2px 12px rgba(124,58,237,0.3)",
                      }}
                    >
                      Ajouter des crédits
                    </button>
                  </Row>
                </Section>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
