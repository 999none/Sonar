import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#5865F2">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.044.03.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  );
}

const fieldStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "9px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.09)",
  color: "#e2e8f0",
  fontSize: "13.5px",
  fontFamily: "'Manrope', sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
  caretColor: "#a78bfa",
};

export default function LoginModal({ open, onClose, onLogin }) {
  const [tab, setTab] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    // Simulate async login (mock)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLogin({ name: name || email.split("@")[0], email });
        onClose();
        setSuccess(false);
        setName(""); setEmail(""); setPassword("");
      }, 700);
    }, 900);
  };

  const handleSocial = (provider) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLogin({ name: provider + " User", email: `user@${provider.toLowerCase()}.com` });
        onClose();
        setSuccess(false);
      }, 700);
    }, 700);
  };

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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 999,
              background: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            data-testid="login-modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              width: "100%",
              maxWidth: "440px",
              background: "#0a0c12",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(167,139,250,0.08)",
              padding: "36px 36px 32px",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.05em", color: "#fff" }}>
                sonar
              </span>
              <button
                data-testid="login-modal-close"
                onClick={onClose}
                style={{
                  width: 30, height: 30, borderRadius: "8px", border: "none",
                  background: "rgba(255,255,255,0.06)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.5)", transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
              >
                <X style={{ width: 13, height: 13 }} />
              </button>
            </div>

            {/* Tab toggle */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "3px", marginBottom: 22, gap: 3 }}>
              {["signup", "signin"].map(t => (
                <button
                  key={t}
                  data-testid={`modal-tab-${t}`}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: "8px", border: "none",
                    cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600, fontSize: "13px", transition: "all 0.18s",
                    background: tab === t ? "rgba(255,255,255,0.11)" : "transparent",
                    color: tab === t ? "#fff" : "rgba(255,255,255,0.35)",
                    boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.4)" : "none",
                  }}
                >
                  {t === "signup" ? "Sign up" : "Sign in"}
                </button>
              ))}
            </div>

            {/* Social */}
            <button
              data-testid="modal-google"
              onClick={() => handleSocial("Google")}
              disabled={loading}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 10, padding: "11px 0", borderRadius: "9px",
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)",
                color: "#e2e8f0", fontSize: "13.5px", fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500, cursor: "pointer", marginBottom: 8, transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
            >
              <GoogleIcon /> Continue with Google
            </button>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {[
                { id: "github", label: "GitHub", Icon: Github, col: "rgba(255,255,255,0.85)" },
                { id: "discord", label: "Discord", Icon: DiscordIcon, col: "#5865F2" },
              ].map(({ id, label, Icon, col }) => (
                <button
                  key={id}
                  data-testid={`modal-${id}`}
                  onClick={() => handleSocial(label)}
                  disabled={loading}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 7, padding: "10px 0", borderRadius: "9px",
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)",
                    color: "#e2e8f0", fontSize: "13px", fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500, cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                >
                  <Icon style={{ width: 16, height: 16, color: col }} /> {label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.28)", whiteSpace: "nowrap" }}>
                or continue with email
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <AnimatePresence initial={false}>
                {tab === "signup" && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ overflow: "hidden" }}
                  >
                    <label style={{ display: "block", fontFamily: "'Manrope', sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(200,215,235,0.65)", marginBottom: 6 }}>
                      Full name
                    </label>
                    <input
                      data-testid="modal-input-name"
                      type="text" placeholder="John Doe"
                      value={name} onChange={e => setName(e.target.value)}
                      style={fieldStyle}
                      onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.5)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontFamily: "'Manrope', sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(200,215,235,0.65)", marginBottom: 6 }}>
                  Email
                </label>
                <input
                  data-testid="modal-input-email"
                  type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  required style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontFamily: "'Manrope', sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(200,215,235,0.65)", marginBottom: 6 }}>
                  Password
                </label>
                <input
                  data-testid="modal-input-password"
                  type="password" placeholder="Min. 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
                />
              </div>

              <button
                data-testid="modal-submit"
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "13px 0", borderRadius: "11px", border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px",
                  transition: "opacity 0.15s, box-shadow 0.15s",
                  background: success
                    ? "linear-gradient(90deg, #059669, #10b981)"
                    : "linear-gradient(90deg, #7c3aed 0%, #a855f7 60%, #c084fc 100%)",
                  color: "#fff",
                  boxShadow: success
                    ? "0 4px 24px rgba(16,185,129,0.4)"
                    : "0 4px 24px rgba(124,58,237,0.4)",
                  marginBottom: 14,
                  opacity: loading ? 0.75 : 1,
                }}
              >
                {success ? "✓ Connecté !" : loading ? "Connexion…" : (tab === "signup" ? "Create account" : "Sign in")}
              </button>
            </form>

            <p style={{ textAlign: "center", fontFamily: "'Manrope', sans-serif", fontSize: "12.5px", color: "rgba(255,255,255,0.35)" }}>
              {tab === "signup" ? "Already have an account? " : "No account yet? "}
              <span
                data-testid="modal-switch"
                onClick={() => setTab(tab === "signup" ? "signin" : "signup")}
                style={{ color: "#a78bfa", cursor: "pointer", fontWeight: 600 }}
              >
                {tab === "signup" ? "Sign in" : "Sign up"}
              </span>
            </p>

            {tab === "signup" && (
              <p style={{ textAlign: "center", marginTop: 8, fontFamily: "'Manrope', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
                By continuing you agree to our{" "}
                <span style={{ textDecoration: "underline", cursor: "pointer", color: "rgba(255,255,255,0.35)" }}>Terms</span>
                {" & "}
                <span style={{ textDecoration: "underline", cursor: "pointer", color: "rgba(255,255,255,0.35)" }}>Privacy</span>
              </p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
