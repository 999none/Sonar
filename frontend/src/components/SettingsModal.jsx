import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Bell, Sliders, Github, ChevronDown, Check, Sun, Moon, Globe, LogOut, Edit2, Upload } from "lucide-react";

const LANGS = ["Français", "English", "Español", "Deutsch", "日本語", "中文"];

// ── Theme tokens ──────────────────────────────────────────────────────
const TH = {
  dark: {
    backdrop: "rgba(0,0,0,0.7)",
    modalBg: "linear-gradient(160deg, rgba(12,20,45,0.98) 0%, rgba(4,6,16,0.99) 100%)",
    modalBorder: "1px solid rgba(255,255,255,0.09)",
    modalShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 50px 120px rgba(0,0,0,0.9)",
    
    // Sidebar
    sidebarBg: "rgba(255,255,255,0.02)",
    sidebarBorder: "1px solid rgba(255,255,255,0.06)",
    sidebarTitle: "rgba(140,160,200,0.45)",
    
    tabBg: "transparent",
    tabBgHover: "rgba(255,255,255,0.04)",
    tabBgActive: "rgba(56,189,248,0.1)",
    tabBorder: "1px solid transparent",
    tabBorderActive: "1px solid rgba(56,189,248,0.25)",
    tabText: "rgba(180,200,230,0.7)",
    tabTextActive: "#38bdf8",
    tabIcon: "rgba(140,165,210,0.5)",
    tabIconActive: "#38bdf8",
    
    // Content
    contentBg: "transparent",
    headerTitle: "#fff",
    closeBg: "rgba(255,255,255,0.05)",
    closeHoverBg: "rgba(255,255,255,0.1)",
    closeColor: "rgba(255,255,255,0.4)",
    closeHoverColor: "#fff",
    
    sectionTitle: "rgba(140,160,200,0.5)",
    
    fieldLabel: "rgba(200,220,245,0.7)",
    fieldValue: "#e8ecf4",
    fieldBg: "rgba(255,255,255,0.04)",
    fieldBorder: "1px solid rgba(255,255,255,0.08)",
    fieldHoverBg: "rgba(255,255,255,0.06)",
    
    avatarBg: "linear-gradient(135deg, #7dd3fc, #38bdf8, #0ea5e9)",
    
    toggleOff: "rgba(255,255,255,0.12)",
    toggleOn: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
    toggleOnShadow: "0 0 12px rgba(14,165,233,0.4)",
    
    btnPrimaryBg: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
    btnPrimaryText: "#000",
    btnPrimaryShadow: "0 0 16px rgba(14,165,233,0.3)",
    
    btnSecondaryBg: "rgba(255,255,255,0.06)",
    btnSecondaryBorder: "1px solid rgba(255,255,255,0.1)",
    btnSecondaryText: "rgba(200,220,245,0.85)",
    btnSecondaryHoverBg: "rgba(255,255,255,0.1)",
    
    githubConnectedBg: "rgba(255,255,255,0.04)",
    githubConnectedBorder: "1px solid rgba(255,255,255,0.08)",
  },
  light: {
    backdrop: "rgba(100,130,200,0.3)",
    modalBg: "linear-gradient(160deg, rgba(248,252,255,0.99) 0%, rgba(255,255,255,1) 100%)",
    modalBorder: "1px solid rgba(80,120,200,0.15)",
    modalShadow: "inset 0 1px 0 rgba(255,255,255,0.95), 0 50px 120px rgba(40,80,180,0.15)",
    
    // Sidebar
    sidebarBg: "rgba(0,0,0,0.02)",
    sidebarBorder: "1px solid rgba(80,120,200,0.1)",
    sidebarTitle: "rgba(40,60,120,0.4)",
    
    tabBg: "transparent",
    tabBgHover: "rgba(0,0,0,0.03)",
    tabBgActive: "rgba(14,165,233,0.08)",
    tabBorder: "1px solid transparent",
    tabBorderActive: "1px solid rgba(14,165,233,0.2)",
    tabText: "rgba(30,60,120,0.7)",
    tabTextActive: "#0ea5e9",
    tabIcon: "rgba(60,90,160,0.45)",
    tabIconActive: "#0ea5e9",
    
    // Content
    contentBg: "transparent",
    headerTitle: "#080f28",
    closeBg: "rgba(0,0,0,0.04)",
    closeHoverBg: "rgba(0,0,0,0.08)",
    closeColor: "rgba(40,60,120,0.4)",
    closeHoverColor: "#1e3264",
    
    sectionTitle: "rgba(40,60,120,0.4)",
    
    fieldLabel: "rgba(30,50,100,0.65)",
    fieldValue: "#0a1a3e",
    fieldBg: "rgba(0,0,0,0.02)",
    fieldBorder: "1px solid rgba(80,120,200,0.12)",
    fieldHoverBg: "rgba(0,0,0,0.04)",
    
    avatarBg: "linear-gradient(135deg, #7dd3fc, #38bdf8, #0ea5e9)",
    
    toggleOff: "rgba(0,0,0,0.1)",
    toggleOn: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
    toggleOnShadow: "0 0 12px rgba(14,165,233,0.25)",
    
    btnPrimaryBg: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
    btnPrimaryText: "#000",
    btnPrimaryShadow: "0 0 16px rgba(14,165,233,0.2)",
    
    btnSecondaryBg: "rgba(0,0,0,0.04)",
    btnSecondaryBorder: "1px solid rgba(80,120,200,0.15)",
    btnSecondaryText: "#1e3264",
    btnSecondaryHoverBg: "rgba(0,0,0,0.08)",
    
    githubConnectedBg: "rgba(0,0,0,0.02)",
    githubConnectedBorder: "1px solid rgba(80,120,200,0.12)",
  },
};

function Toggle({ on, onChange, isDark = true }) {
  const t = TH[isDark ? "dark" : "light"];
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 42, height: 24, borderRadius: 99,
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
          width: 20, height: 20, borderRadius: "50%",
          background: "#fff",
          position: "absolute", top: 2,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

const TABS = [
  { id: "account", label: "Compte", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "preferences", label: "Préférences", icon: Sliders },
  { id: "github", label: "Github", icon: Github },
];

export default function SettingsModal({ open, onClose, user, isDark, onToggleTheme, initialTab = "account", profilePhoto, onProfilePhotoChange }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [lang, setLang] = useState("Français");
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [notifApp, setNotifApp] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  
  // Editable account fields
  const [editingName, setEditingName] = useState(false);
  const [userName, setUserName] = useState(user?.name || "");
  const fileInputRef = useRef(null);
  
  const t = TH[isDark ? "dark" : "light"];

  // Update activeTab when initialTab changes
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  // Sync userName with user prop
  useEffect(() => {
    setUserName(user?.name || "");
  }, [user]);

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image before storing
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 200; // Max dimension
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG at 0.7 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          onProfilePhotoChange(compressedDataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  // Mock GitHub data (when connected)
  const githubUser = {
    name: "Jean Dupont",
    username: "jeandupont",
    avatar: "https://github.com/github.png",
  };

  const githubRepos = [
    { id: 1, name: "sonar-landing", visibility: "public", stars: 42 },
    { id: 2, name: "chatbot-ai", visibility: "private", stars: 8 },
    { id: 3, name: "react-components", visibility: "public", stars: 156 },
  ];

  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

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
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          />

          {/* Modal */}
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1101,
              pointerEvents: "none",
            }}
          >
            <motion.div
              key="settings-modal"
              data-testid="settings-modal"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: "90%", maxWidth: "920px",
                height: "85vh", maxHeight: "680px",
                background: t.modalBg,
                backdropFilter: "blur(60px)",
                WebkitBackdropFilter: "blur(60px)",
                border: t.modalBorder,
                borderRadius: "24px",
                boxShadow: t.modalShadow,
                overflow: "hidden",
                display: "flex",
                pointerEvents: "all",
              }}
            >
            {/* Sidebar */}
            <div
              style={{
                width: "240px",
                flexShrink: 0,
                background: t.sidebarBg,
                borderRight: t.sidebarBorder,
                padding: "24px 16px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px", fontWeight: 700,
                color: t.sidebarTitle,
                textTransform: "uppercase", letterSpacing: "0.12em",
                marginBottom: 16,
                paddingLeft: 12,
              }}>
                Paramètres personnels
              </p>

              {/* Tabs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: activeTab === id ? t.tabBorderActive : t.tabBorder,
                      background: activeTab === id ? t.tabBgActive : t.tabBg,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      color: activeTab === id ? t.tabTextActive : t.tabText,
                    }}
                    onMouseEnter={e => {
                      if (activeTab !== id) e.currentTarget.style.background = t.tabBgHover;
                    }}
                    onMouseLeave={e => {
                      if (activeTab !== id) e.currentTarget.style.background = t.tabBg;
                    }}
                  >
                    <Icon style={{ width: 16, height: 16, color: activeTab === id ? t.tabIconActive : t.tabIcon }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500 }}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "24px 28px 20px",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(80,120,200,0.1)"}`,
              }}>
                <h2 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700, fontSize: "18px",
                  color: t.headerTitle, letterSpacing: "-0.025em",
                }}>
                  {TABS.find(tab => tab.id === activeTab)?.label}
                </h2>
                <button
                  data-testid="settings-close"
                  onClick={onClose}
                  style={{
                    width: 32, height: 32, borderRadius: "10px", border: "none",
                    background: t.closeBg, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: t.closeColor, transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.closeHoverBg; e.currentTarget.style.color = t.closeHoverColor; }}
                  onMouseLeave={e => { e.currentTarget.style.background = t.closeBg; e.currentTarget.style.color = t.closeColor; }}
                >
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
                
                {/* COMPTE TAB */}
                {activeTab === "account" && (
                  <div>
                    {/* Photo de profil */}
                    <div style={{ marginBottom: 32 }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: t.sectionTitle, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                        Photo de profil
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{
                          width: 64, height: 64, borderRadius: "50%",
                          background: profilePhoto ? `url(${profilePhoto}) center/cover` : t.avatarBg,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 4px 16px rgba(14,165,233,0.25)",
                          overflow: "hidden",
                        }}>
                          {!profilePhoto && (
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "20px", color: "#fff" }}>
                              {initials}
                            </span>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: t.fieldLabel, marginBottom: 8 }}>
                            Cette image sera affichée publiquement
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleProfilePhotoUpload}
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              padding: "6px 14px",
                              borderRadius: "8px",
                              border: t.btnSecondaryBorder,
                              background: t.btnSecondaryBg,
                              color: t.btnSecondaryText,
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "12px", fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 0.15s",
                              display: "flex", alignItems: "center", gap: 6,
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = t.btnSecondaryHoverBg}
                            onMouseLeave={e => e.currentTarget.style.background = t.btnSecondaryBg}
                          >
                            <Upload style={{ width: 12, height: 12 }} />
                            Changer la photo
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Nom */}
                    <div style={{ marginBottom: 24 }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: t.sectionTitle, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                        Nom
                      </p>
                      <div style={{
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: t.fieldBg,
                        border: t.fieldBorder,
                        display: "flex", alignItems: "center", gap: 12,
                      }}>
                        {editingName ? (
                          <>
                            <input
                              type="text"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              autoFocus
                              style={{
                                flex: 1,
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "13px",
                                color: t.fieldValue,
                              }}
                            />
                            <button
                              onClick={() => {
                                setEditingName(false);
                                console.log("Nom sauvegardé:", userName);
                                // Here you would save the name
                              }}
                              style={{
                                padding: "4px 12px",
                                borderRadius: "6px",
                                border: "none",
                                background: t.btnPrimaryBg,
                                color: t.btnPrimaryText,
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "11px", fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Sauvegarder
                            </button>
                          </>
                        ) : (
                          <>
                            <p style={{ flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: t.fieldValue }}>
                              {userName || "Non défini"}
                            </p>
                            <button
                              onClick={() => setEditingName(true)}
                              style={{
                                padding: "4px 8px",
                                borderRadius: "6px",
                                border: t.btnSecondaryBorder,
                                background: t.btnSecondaryBg,
                                cursor: "pointer",
                                display: "flex", alignItems: "center",
                                transition: "all 0.15s",
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = t.btnSecondaryHoverBg}
                              onMouseLeave={e => e.currentTarget.style.background = t.btnSecondaryBg}
                            >
                              <Edit2 style={{ width: 12, height: 12, color: t.btnSecondaryText }} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: 24 }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: t.sectionTitle, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                        E-mail
                      </p>
                      <div style={{
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: t.fieldBg,
                        border: t.fieldBorder,
                      }}>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: t.fieldValue }}>
                          {user?.email || "—"}
                        </p>
                      </div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: t.fieldLabel, marginTop: 6 }}>
                        L'adresse e-mail liée à votre compte actuel
                      </p>
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                  <div>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 18px",
                      borderRadius: "12px",
                      background: t.fieldBg,
                      border: t.fieldBorder,
                      marginBottom: 12,
                    }}>
                      <div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, color: t.fieldValue, marginBottom: 2 }}>
                          Notifications dans l'app
                        </p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: t.fieldLabel }}>
                          Recevoir des alertes pour les mises à jour importantes
                        </p>
                      </div>
                      <Toggle on={notifApp} onChange={setNotifApp} isDark={isDark} />
                    </div>

                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 18px",
                      borderRadius: "12px",
                      background: t.fieldBg,
                      border: t.fieldBorder,
                    }}>
                      <div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, color: t.fieldValue, marginBottom: 2 }}>
                          Emails de mise à jour
                        </p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: t.fieldLabel }}>
                          Recevoir des emails pour les nouvelles fonctionnalités
                        </p>
                      </div>
                      <Toggle on={notifEmail} onChange={setNotifEmail} isDark={isDark} />
                    </div>
                  </div>
                )}

                {/* PRÉFÉRENCES TAB */}
                {activeTab === "preferences" && (
                  <div>
                    {/* Thème */}
                    <div style={{ marginBottom: 24 }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: t.sectionTitle, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                        Thème
                      </p>
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        background: t.fieldBg,
                        border: t.fieldBorder,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {isDark ? <Moon style={{ width: 18, height: 18, color: t.tabIconActive }} /> : <Sun style={{ width: 18, height: 18, color: t.tabIconActive }} />}
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, color: t.fieldValue }}>
                            {isDark ? "Mode sombre" : "Mode clair"}
                          </span>
                        </div>
                        <Toggle on={isDark} onChange={() => onToggleTheme()} isDark={isDark} />
                      </div>
                    </div>

                    {/* Langue */}
                    <div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: t.sectionTitle, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                        Langue
                      </p>
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        background: t.fieldBg,
                        border: t.fieldBorder,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <Globe style={{ width: 18, height: 18, color: t.tabIcon }} />
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, color: t.fieldValue }}>
                            Langue de l'interface
                          </span>
                        </div>

                        <div style={{ position: "relative" }}>
                          <button
                            data-testid="settings-lang-btn"
                            onClick={() => setShowLangPicker(v => !v)}
                            style={{
                              display: "flex", alignItems: "center", gap: 6,
                              padding: "6px 12px",
                              borderRadius: "8px",
                              border: t.btnSecondaryBorder,
                              background: t.btnSecondaryBg,
                              cursor: "pointer",
                              color: t.btnSecondaryText,
                              fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500,
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = t.btnSecondaryHoverBg}
                            onMouseLeave={e => e.currentTarget.style.background = t.btnSecondaryBg}
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
                                  background: isDark ? "linear-gradient(160deg, rgba(16,26,60,0.98) 0%, rgba(6,9,20,0.99) 100%)" : "linear-gradient(160deg, rgba(245,250,255,0.99) 0%, rgba(255,255,255,1) 100%)",
                                  backdropFilter: "blur(24px)",
                                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(80,120,200,0.18)",
                                  borderRadius: "12px",
                                  boxShadow: isDark ? "0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)" : "0 16px 40px rgba(40,80,180,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
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
                                      color: l === lang ? (isDark ? "#38bdf8" : "#0ea5e9") : (isDark ? "rgba(200,220,245,0.8)" : "#1e3264"),
                                      borderBottom: i < LANGS.length - 1 ? (isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(80,120,200,0.08)") : "none",
                                      transition: "background 0.1s",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                  >
                                    {l}
                                    {l === lang && <Check style={{ width: 12, height: 12 }} />}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* GITHUB TAB */}
                {activeTab === "github" && (
                  <div>
                    {!githubConnected ? (
                      <div style={{ textAlign: "center", paddingTop: 40 }}>
                        <Github style={{ width: 48, height: 48, color: t.tabIcon, margin: "0 auto 20px" }} />
                        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", fontWeight: 600, color: t.fieldValue, marginBottom: 8 }}>
                          Connectez votre compte GitHub
                        </p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: t.fieldLabel, marginBottom: 24 }}>
                          Accédez à vos repos et déployez facilement vos projets
                        </p>
                        <button
                          onClick={() => setGithubConnected(true)}
                          style={{
                            padding: "10px 24px",
                            borderRadius: "10px",
                            border: "none",
                            background: t.btnPrimaryBg,
                            color: t.btnPrimaryText,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: "13px", fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: t.btnPrimaryShadow,
                          }}
                        >
                          Se connecter à GitHub
                        </button>
                      </div>
                    ) : (
                      <div>
                        {/* Connected account */}
                        <div style={{ marginBottom: 32 }}>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: t.sectionTitle, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                            Compte connecté
                          </p>
                          <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "16px",
                            borderRadius: "12px",
                            background: t.githubConnectedBg,
                            border: t.githubConnectedBorder,
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <img src={githubUser.avatar} alt="GitHub avatar" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                              <div>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, color: t.fieldValue }}>
                                  {githubUser.name}
                                </p>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: t.fieldLabel }}>
                                  @{githubUser.username}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setGithubConnected(false)}
                              style={{
                                padding: "6px 14px",
                                borderRadius: "8px",
                                border: t.btnSecondaryBorder,
                                background: t.btnSecondaryBg,
                                color: t.btnSecondaryText,
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "11px", fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.15s",
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = t.btnSecondaryHoverBg}
                              onMouseLeave={e => e.currentTarget.style.background = t.btnSecondaryBg}
                            >
                              <LogOut style={{ width: 11, height: 11, display: "inline", marginRight: 4 }} />
                              Déconnecter
                            </button>
                          </div>
                        </div>

                        {/* Repos */}
                        <div>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, color: t.sectionTitle, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                            Repos disponibles
                          </p>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {githubRepos.map(repo => (
                              <div
                                key={repo.id}
                                style={{
                                  display: "flex", alignItems: "center", justifyContent: "space-between",
                                  padding: "12px 14px",
                                  borderRadius: "10px",
                                  background: t.fieldBg,
                                  border: t.fieldBorder,
                                  cursor: "pointer",
                                  transition: "all 0.15s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = t.fieldHoverBg}
                                onMouseLeave={e => e.currentTarget.style.background = t.fieldBg}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <Github style={{ width: 14, height: 14, color: t.tabIcon }} />
                                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500, color: t.fieldValue }}>
                                    {repo.name}
                                  </span>
                                  <span style={{
                                    fontFamily: "'DM Sans', sans-serif", fontSize: "10px",
                                    color: repo.visibility === "public" ? (isDark ? "#10b981" : "#059669") : (isDark ? "rgba(200,220,245,0.5)" : "rgba(40,60,120,0.5)"),
                                    background: repo.visibility === "public" ? (isDark ? "rgba(16,185,129,0.12)" : "rgba(5,150,105,0.1)") : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"),
                                    padding: "2px 7px", borderRadius: "6px",
                                  }}>
                                    {repo.visibility}
                                  </span>
                                </div>
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: t.fieldLabel }}>
                                  ★ {repo.stars}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
