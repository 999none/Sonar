import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Globe, Bell, CreditCard, Sun, Moon, ChevronDown, Check } from "lucide-react";

const LANGS = ["Français", "English", "Español", "Deutsch", "日本語", "中文"];

// ── Theme tokens ──────────────────────────────────────────────────────
const TH = {
  dark: {
    backdrop: "rgba(0,0,0,0.65)",
    modalBg: "linear-gradient(160deg, rgba(14,22,55,0.97) 0%, rgba(5,7,18,0.99) 100%)",
    modalBorder: "1px solid rgba(255,255,255,0.1)",
    modalShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.85)",
    headerBorder: "1px solid rgba(255,255,255,0.07)",
    headerTitle: "#fff",
    closeBg: "rgba(255,255,255,0.06)",
    closeHoverBg: "rgba(255,255,255,0.12)",
    closeColor: "rgba(255,255,255,0.45)",
    closeHoverColor: "#fff",
    sectionLabel: "rgba(140,160,200,0.5)",
    sectionBg: "rgba(255,255,255,0.03)",
    sectionBorder: "rgba(255,255,255,0.08)",
    rowBorder: "rgba(255,255,255,0.05)",
    rowIcon: "rgba(140,165,210,0.6)",
    rowText: "rgba(210,225,245,0.85)",
    rowSubtext: "rgba(120,145,185,0.6)",
    toggleOff: "rgba(255,255,255,0.12)",
    toggleOn: "linear-gradient(90deg, #7c3aed, #a855f7)",
    toggleOnShadow: "0 0 12px rgba(124,58,237,0.4)",
    themeLabel: "rgba(140,165,200,0.6)",
    planBadgeBg: "rgba(167,139,250,0.12)",
    planBadgeText: "#a78bfa",
    creditText: "#10b981",
    langBtnBg: "rgba(255,255,255,0.06)",
    langBtnBorder: "1px solid rgba(255,255,255,0.1)",
    langBtnText: "rgba(200,220,245,0.85)",
    langBtnHoverBg: "rgba(255,255,255,0.1)",
    langDropBg: "linear-gradient(160deg, rgba(16,26,60,0.98) 0%, rgba(6,9,20,0.99) 100%)",
    langDropBorder: "1px solid rgba(255,255,255,0.1)",
    langDropShadow: "0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
    langDropItemBorder: "1px solid rgba(255,255,255,0.05)",
    langDropItemText: "rgba(200,220,245,0.8)",
    langDropItemHoverBg: "rgba(255,255,255,0.07)",
    langDropItemActive: "#a78bfa",
  },
  light: {
    backdrop: "rgba(100,130,200,0.25)",
    modalBg: "linear-gradient(160deg, rgba(245,250,255,0.99) 0%, rgba(255,255,255,1) 100%)",
    modalBorder: "1px solid rgba(80,120,200,0.18)",
    modalShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 40px 100px rgba(40,80,180,0.18)",
    headerBorder: "1px solid rgba(80,120,200,0.12)",
    headerTitle: "#080f28",
    closeBg: "rgba(0,0,0,0.04)",
    closeHoverBg: "rgba(0,0,0,0.1)",
    closeColor: "rgba(40,60,120,0.4)",
    closeHoverColor: "#1e3264",
    sectionLabel: "rgba(40,60,120,0.4)",
    sectionBg: "rgba(0,0,0,0.02)",
    sectionBorder: "rgba(80,120,200,0.12)",
    rowBorder: "rgba(80,120,200,0.08)",
    rowIcon: "rgba(60,90,160,0.5)",
    rowText: "#1e3264",
    rowSubtext: "rgba(40,60,120,0.5)",
    toggleOff: "rgba(0,0,0,0.1)",
    toggleOn: "linear-gradient(90deg, #7c3aed, #a855f7)",
    toggleOnShadow: "0 0 12px rgba(124,58,237,0.25)",
    themeLabel: "rgba(40,60,120,0.5)",
    planBadgeBg: "rgba(124,58,237,0.1)",
    planBadgeText: "#7c3aed",
    creditText: "#059669",
    langBtnBg: "rgba(0,0,0,0.03)",
    langBtnBorder: "1px solid rgba(80,120,200,0.18)",
    langBtnText: "#1e3264",
    langBtnHoverBg: "rgba(0,0,0,0.06)",
    langDropBg: "linear-gradient(160deg, rgba(245,250,255,0.99) 0%, rgba(255,255,255,1) 100%)",
    langDropBorder: "1px solid rgba(80,120,200,0.18)",
    langDropShadow: "0 16px 40px rgba(40,80,180,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
    langDropItemBorder: "1px solid rgba(80,120,200,0.08)",
    langDropItemText: "#1e3264",
    langDropItemHoverBg: "rgba(0,0,0,0.04)",
    langDropItemActive: "#7c3aed",
  },
};

function Toggle({ on, onChange, isDark = true }) {
  const t = TH[isDark ? "dark" : "light"];
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 40, height: 22, borderRadius: 99,
        background: on ? t.toggleOn : t.toggleOff,
        border: "none", cursor: "pointer", position: "relative",
        transition: "background 0.2s", flexShrink: 0, padding: 0,
        boxShadow: on ? t.toggleOnShadow : "none",
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

function Section({ title, children, isDark = true }) {
  const t = TH[isDark ? "dark" : "light"];
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "10.5px", fontWeight: 700,
        color: t.sectionLabel,
        textTransform: "uppercase", letterSpacing: "0.1em",
        marginBottom: 10,
      }}>
        {title}
      </p>
      <div style={{
        borderRadius: "14px",
        border: `1px solid ${t.sectionBorder}`,
        overflow: "hidden",
        background: t.sectionBg,
      }}>
        {children}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, children, last, isDark = true }) {
  const t = TH[isDark ? "dark" : "light"];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 16px",
      borderBottom: last ? "none" : `1px solid ${t.rowBorder}`,
    }}>
      {Icon && <Icon style={{ width: 15, height: 15, color: t.rowIcon, flexShrink: 0 }} />}
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: t.rowText, flex: 1 }}>
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
  const t = TH[isDark ? "dark" : "light"];

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
              background: t.backdrop,
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
                background: t.modalBg,
                backdropFilter: "blur(48px)",
                WebkitBackdropFilter: "blur(48px)",
                border: t.modalBorder,
                borderRadius: "24px",
                boxShadow: t.modalShadow,
                pointerEvents: "all",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "22px 24px 18px",
                borderBottom: t.headerBorder,
              }}>
                <h2 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700, fontSize: "16px",
                  color: t.headerTitle, letterSpacing: "-0.02em",
                }}>
                  Paramètres
                </h2>
                <button
                  data-testid="settings-close"
                  onClick={onClose}
                  style={{
                    width: 30, height: 30, borderRadius: "8px", border: "none",
                    background: t.closeBg, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: t.closeColor, transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.closeHoverBg; e.currentTarget.style.color = t.closeHoverColor; }}
                  onMouseLeave={e => { e.currentTarget.style.background = t.closeBg; e.currentTarget.style.color = t.closeColor; }}
                >
                  <X style={{ width: 13, height: 13 }} />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: "22px 24px 24px", maxHeight: "70vh", overflowY: "auto" }}>

                {/* Profil */}
                <Section title="Profil" isDark={isDark}>
                  <Row icon={User} label={user?.name || "Utilisateur"} isDark={isDark}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: t.rowSubtext }}>
                      {user?.email || "—"}
                    </span>
                  </Row>
                  <Row icon={null} label="Plan actuel" last isDark={isDark}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600,
                      color: t.planBadgeText, background: t.planBadgeBg,
                      padding: "3px 10px", borderRadius: "99px",
                    }}>
                      Free
                    </span>
                  </Row>
                </Section>

                {/* Apparence */}
                <Section title="Apparence" isDark={isDark}>
                  <Row icon={isDark ? Moon : Sun} label="Thème" last isDark={isDark}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: t.themeLabel }}>
                        {isDark ? "Sombre" : "Clair"}
                      </span>
                      <Toggle on={isDark} onChange={() => onToggleTheme()} isDark={isDark} />
                    </div>
                  </Row>
                </Section>

                {/* Langue */}
                <Section title="Langue" isDark={isDark}>
                  <Row icon={Globe} label="Langue de l'interface" last isDark={isDark}>
                    <div style={{ position: "relative" }}>
                      <button
                        data-testid="settings-lang-btn"
                        onClick={() => setShowLangPicker(v => !v)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "5px 10px 5px 12px",
                          borderRadius: "8px", border: t.langBtnBorder,
                          background: t.langBtnBg, cursor: "pointer",
                          color: t.langBtnText,
                          fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = t.langBtnHoverBg}
                        onMouseLeave={e => e.currentTarget.style.background = t.langBtnBg}
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
                              background: t.langDropBg,
                              backdropFilter: "blur(24px)",
                              border: t.langDropBorder,
                              borderRadius: "12px",
                              boxShadow: t.langDropShadow,
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
                                  color: l === lang ? t.langDropItemActive : t.langDropItemText,
                                  borderBottom: i < LANGS.length - 1 ? t.langDropItemBorder : "none",
                                  transition: "background 0.1s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = t.langDropItemHoverBg}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              >
                                {l}
                                {l === lang && <Check style={{ width: 12, height: 12, color: t.langDropItemActive }} />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Row>
                </Section>

                {/* Notifications */}
                <Section title="Notifications" isDark={isDark}>
                  <Row icon={Bell} label="Notifications dans l'app" isDark={isDark}>
                    <Toggle on={notifApp} onChange={setNotifApp} isDark={isDark} />
                  </Row>
                  <Row icon={null} label="Emails de mise à jour" last isDark={isDark}>
                    <Toggle on={notifEmail} onChange={setNotifEmail} isDark={isDark} />
                  </Row>
                </Section>

                {/* Compte */}
                <Section title="Compte" isDark={isDark}>
                  <Row icon={CreditCard} label="Crédits restants" isDark={isDark}>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: t.creditText }}>
                      $2.40
                    </span>
                  </Row>
                  <Row icon={null} label="Recharger" last isDark={isDark}>
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
