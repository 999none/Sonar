import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, Lock, Globe, ChevronDown, Check, ChevronUp, Plus } from "lucide-react";

export default function GitHubModal({ open, onClose, isDark = true }) {
  const [activeTab, setActiveTab] = useState("private"); // "private" or "public"
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [showRepoDropdown, setShowRepoDropdown] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [isGithubConnected, setIsGithubConnected] = useState(false); // État déconnecté par défaut
  const [orgExpanded, setOrgExpanded] = useState(false);
  const [repoInputValue, setRepoInputValue] = useState(""); // Pour le lien manuel

  // Mock data - À remplacer par de vraies données GitHub plus tard
  const connectedOrgs = [
    { id: 1, name: "networkchannel", role: "Collaborator", connected: true }
  ];

  const repos = [
    { id: 1, name: "sonar-landing", private: true },
    { id: 2, name: "chatbot-ai", private: true },
    { id: 3, name: "react-components", private: false },
  ];

  const branches = [
    { id: 1, name: "main" },
    { id: 2, name: "develop" },
    { id: 3, name: "feature/new-ui" },
  ];

  const dk = isDark;
  
  const colors = {
    backdrop: dk ? "rgba(0,0,0,0.75)" : "rgba(100,130,200,0.35)",
    modalBg: dk 
      ? "linear-gradient(160deg, rgba(12,20,45,0.98) 0%, rgba(4,6,16,0.99) 100%)"
      : "linear-gradient(160deg, rgba(248,252,255,0.99) 0%, rgba(255,255,255,1) 100%)",
    modalBorder: dk ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(80,120,200,0.15)",
    
    headerText: dk ? "#fff" : "#080f28",
    closeBtn: dk ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
    closeBtnHover: dk ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
    closeIcon: dk ? "rgba(255,255,255,0.5)" : "rgba(40,60,120,0.5)",
    
    tabBg: dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    tabActiveBg: dk ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
    tabText: dk ? "rgba(200,220,245,0.7)" : "rgba(30,60,120,0.7)",
    tabActiveText: dk ? "#fff" : "#0a1a3e",
    
    sectionTitle: dk ? "rgba(140,160,200,0.5)" : "rgba(40,60,120,0.5)",
    orgBg: dk ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
    orgBorder: dk ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(80,120,200,0.12)",
    orgText: dk ? "rgba(220,235,250,0.9)" : "#0a1a3e",
    
    connectedBadgeBg: "rgba(16,185,129,0.15)",
    connectedBadgeText: "#10b981",
    connectedBadgeBorder: "1px solid rgba(16,185,129,0.3)",
    
    dropdownBg: dk ? "rgba(30,35,50,0.98)" : "rgba(255,255,255,0.98)",
    dropdownBorder: dk ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(80,120,200,0.18)",
    dropdownItemHover: dk ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1200,
              background: colors.backdrop,
              backdropFilter: "blur(12px)",
            }}
          />

          {/* Modal */}
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1201,
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: "90%",
                maxWidth: "720px",
                background: colors.modalBg,
                backdropFilter: "blur(60px)",
                border: colors.modalBorder,
                borderRadius: "24px",
                boxShadow: dk 
                  ? "inset 0 1px 0 rgba(255,255,255,0.08), 0 50px 120px rgba(0,0,0,0.9)"
                  : "inset 0 1px 0 rgba(255,255,255,0.95), 0 50px 120px rgba(40,80,180,0.15)",
                overflow: "hidden",
                pointerEvents: "all",
              }}
            >
              {/* Header */}
              <div style={{
                padding: "24px 28px",
                borderBottom: dk ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(80,120,200,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Github style={{ width: 24, height: 24, color: colors.headerText }} />
                  <h2 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: colors.headerText,
                    letterSpacing: "-0.025em",
                  }}>
                    Add from Github
                  </h2>
                </div>
                
                <button
                  onClick={onClose}
                  style={{
                    width: 32, height: 32,
                    borderRadius: "10px",
                    border: "none",
                    background: colors.closeBtn,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = colors.closeBtnHover}
                  onMouseLeave={e => e.currentTarget.style.background = colors.closeBtn}
                >
                  <X style={{ width: 14, height: 14, color: colors.closeIcon }} />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: "28px" }}>
                
                {/* Tabs */}
                <div style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 24,
                }}>
                  <button
                    onClick={() => setActiveTab("private")}
                    style={{
                      flex: 1,
                      padding: "12px 20px",
                      borderRadius: "12px",
                      border: "none",
                      background: activeTab === "private" ? colors.tabActiveBg : colors.tabBg,
                      color: activeTab === "private" ? colors.tabActiveText : colors.tabText,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <Lock style={{ width: 14, height: 14 }} />
                    Dépôt privé
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("public")}
                    style={{
                      flex: 1,
                      padding: "12px 20px",
                      borderRadius: "12px",
                      border: "none",
                      background: activeTab === "public" ? colors.tabActiveBg : colors.tabBg,
                      color: activeTab === "public" ? colors.tabActiveText : colors.tabText,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <Globe style={{ width: 14, height: 14 }} />
                    Dépôt public
                  </button>
                </div>

                {/* Organisations connectées */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Github style={{ width: 16, height: 16, color: colors.sectionTitle }} />
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: colors.sectionTitle,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}>
                      Organisations connectées
                    </p>
                  </div>

                  {!isGithubConnected ? (
                    <div style={{
                      padding: "20px",
                      borderRadius: "12px",
                      background: colors.orgBg,
                      border: colors.orgBorder,
                      textAlign: "center",
                    }}>
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "13px",
                        color: colors.orgText,
                        marginBottom: 16,
                      }}>
                        Connectez-vous à Github pour obtenir l'accès direct à vos repo
                      </p>
                      <button
                        onClick={() => setIsGithubConnected(true)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "10px",
                          border: "none",
                          background: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
                          color: "#000",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Github style={{ width: 14, height: 14 }} />
                        Se connecter à GitHub
                      </button>
                    </div>
                  ) : (
                    <>
                      {connectedOrgs.map(org => (
                        <div key={org.id} style={{ marginBottom: 12 }}>
                          <div
                            onClick={() => setOrgExpanded(v => !v)}
                            style={{
                              padding: "14px 16px",
                              borderRadius: "12px",
                              background: colors.orgBg,
                              border: colors.orgBorder,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              cursor: "pointer",
                            }}
                          >
                            <span style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "14px",
                              fontWeight: 500,
                              color: colors.orgText,
                            }}>
                              {org.name}
                            </span>

                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              {org.connected && (
                                <div style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  padding: "4px 12px",
                                  borderRadius: "8px",
                                  background: colors.connectedBadgeBg,
                                  border: colors.connectedBadgeBorder,
                                }}>
                                  <div style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: colors.connectedBadgeText,
                                  }} />
                                  <span style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: colors.connectedBadgeText,
                                  }}>
                                    Connected
                                  </span>
                                </div>
                              )}
                              <ChevronUp style={{
                                width: 16,
                                height: 16,
                                color: colors.sectionTitle,
                                transform: orgExpanded ? "rotate(0deg)" : "rotate(180deg)",
                                transition: "transform 0.2s",
                              }} />
                            </div>
                          </div>

                          <AnimatePresence>
                            {orgExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ overflow: "hidden" }}
                              >
                                {/* Organisation details */}
                                <div
                                  style={{
                                    marginTop: 8,
                                    padding: "12px 16px",
                                    borderRadius: "12px",
                                    background: dk ? "rgba(14,165,233,0.08)" : "rgba(14,165,233,0.06)",
                                    border: dk ? "1px solid rgba(14,165,233,0.2)" : "1px solid rgba(14,165,233,0.15)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div>
                                    <p style={{
                                      fontFamily: "'DM Sans', sans-serif",
                                      fontSize: "13px",
                                      fontWeight: 600,
                                      color: "#38bdf8",
                                      marginBottom: 2,
                                    }}>
                                      {org.name}
                                    </p>
                                    <p style={{
                                      fontFamily: "'DM Sans', sans-serif",
                                      fontSize: "11px",
                                      color: dk ? "rgba(140,160,200,0.6)" : "rgba(40,70,130,0.6)",
                                    }}>
                                      {org.role}
                                    </p>
                                  </div>
                                  <Check style={{ width: 16, height: 16, color: "#38bdf8" }} />
                                </div>

                                {/* Bouton ajouter organisation (dans le dropdown) */}
                                <button
                                  style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    marginTop: 8,
                                    borderRadius: "12px",
                                    border: "none",
                                    background: "transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    color: "#10b981",
                                    transition: "all 0.15s",
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = colors.orgBg}
                                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                  <Plus style={{ width: 14, height: 14 }} />
                                  Ajouter de nouvelles organisations GitHub
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Sélecteurs */}
                <div style={{ display: "flex", gap: 16 }}>
                  
                  {/* Sélectionner un dépôt */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Github style={{ width: 14, height: 14, color: colors.sectionTitle }} />
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: colors.sectionTitle,
                      }}>
                        Sélectionner un dépôt
                      </p>
                    </div>

                    <div style={{ position: "relative" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "12px",
                        background: colors.orgBg,
                        border: colors.orgBorder,
                        overflow: "hidden",
                      }}>
                        {/* Input pour coller un lien */}
                        <input
                          type="text"
                          placeholder="Coller un lien de repo ou sélectionner"
                          value={repoInputValue || selectedRepo}
                          onChange={(e) => {
                            setRepoInputValue(e.target.value);
                            setSelectedRepo("");
                          }}
                          style={{
                            flex: 1,
                            padding: "12px 16px",
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "13px",
                            color: colors.orgText,
                          }}
                        />
                        
                        {/* Bouton flèche pour ouvrir dropdown */}
                        <button
                          onClick={() => setShowRepoDropdown(v => !v)}
                          style={{
                            padding: "12px 14px",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderLeft: colors.orgBorder,
                          }}
                        >
                          <ChevronDown style={{ 
                            width: 14, 
                            height: 14, 
                            color: colors.sectionTitle,
                            transform: showRepoDropdown ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {showRepoDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            style={{
                              position: "absolute",
                              top: "calc(100% + 6px)",
                              left: 0,
                              right: 0,
                              background: colors.dropdownBg,
                              border: colors.dropdownBorder,
                              borderRadius: "12px",
                              boxShadow: dk ? "0 16px 40px rgba(0,0,0,0.6)" : "0 16px 40px rgba(40,80,180,0.12)",
                              overflow: "hidden",
                              zIndex: 10,
                            }}
                          >
                            {repos.map((repo, i) => (
                              <button
                                key={repo.id}
                                onClick={() => { 
                                  setSelectedRepo(repo.name); 
                                  setRepoInputValue("");
                                  setShowRepoDropdown(false); 
                                }}
                                style={{
                                  width: "100%",
                                  padding: "10px 14px",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "left",
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontSize: "13px",
                                  color: colors.orgText,
                                  cursor: "pointer",
                                  borderBottom: i < repos.length - 1 ? (dk ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(80,120,200,0.08)") : "none",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = colors.dropdownItemHover}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              >
                                {repo.name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Sélectionner une branche */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: colors.sectionTitle }}>
                        <path d="M11.75 2.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zm-7.5 8a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zM4.25 8a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 4.25 8zm6.5-3.25a.75.75 0 0 0-1.5 0v4.69L8 10.69a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 0 0-1.06-1.06l-1.25 1.25V4.75z" fill="currentColor"/>
                      </svg>
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: colors.sectionTitle,
                      }}>
                        Sélectionner une branche
                      </p>
                    </div>

                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => setShowBranchDropdown(v => !v)}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          background: colors.orgBg,
                          border: colors.orgBorder,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "13px",
                          color: selectedBranch || colors.tabText,
                        }}
                      >
                        <span>{selectedBranch || "Sélectionnez d'abord un dépôt"}</span>
                        <ChevronDown style={{ width: 14, height: 14 }} />
                      </button>

                      <AnimatePresence>
                        {showBranchDropdown && selectedRepo && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            style={{
                              position: "absolute",
                              top: "calc(100% + 6px)",
                              left: 0,
                              right: 0,
                              background: colors.dropdownBg,
                              border: colors.dropdownBorder,
                              borderRadius: "12px",
                              boxShadow: dk ? "0 16px 40px rgba(0,0,0,0.6)" : "0 16px 40px rgba(40,80,180,0.12)",
                              overflow: "hidden",
                              zIndex: 10,
                            }}
                          >
                            {branches.map((branch, i) => (
                              <button
                                key={branch.id}
                                onClick={() => { setSelectedBranch(branch.name); setShowBranchDropdown(false); }}
                                style={{
                                  width: "100%",
                                  padding: "10px 14px",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "left",
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontSize: "13px",
                                  color: colors.orgText,
                                  cursor: "pointer",
                                  borderBottom: i < branches.length - 1 ? (dk ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(80,120,200,0.08)") : "none",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = colors.dropdownItemHover}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              >
                                {branch.name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
