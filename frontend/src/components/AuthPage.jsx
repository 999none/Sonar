import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="#5865F2">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.044.03.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  );
}

const inputBase = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.09)",
  color: "#e2e8f0",
  fontSize: "14px",
  fontFamily: "'Manrope', sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
  caretColor: "#a78bfa",
};

export default function AuthPage({ onBack }) {
  const [tab, setTab] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock — navigate back to home (or to builder)
    onBack();
  };

  return (
    <div
      data-testid="auth-page"
      style={{
        display: "grid",
        gridTemplateColumns: "46fr 54fr",
        minHeight: "100vh",
        background: "#000",
      }}
    >
      {/* ── Left panel: form ── */}
      <div
        style={{
          background: "#0a0c12",
          display: "flex",
          flexDirection: "column",
          padding: "52px 56px 48px",
          position: "relative",
        }}
      >
        {/* Logo */}
        <button
          onClick={onBack}
          data-testid="auth-logo-home"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            alignSelf: "flex-start",
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 900,
              fontSize: "1.1rem",
              letterSpacing: "-0.05em",
              color: "#fff",
            }}
          >
            sonar
          </span>
        </button>

        {/* Tab toggle */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: 28,
            gap: 4,
          }}
        >
          {["signup", "signin"].map((t) => (
            <button
              key={t}
              data-testid={`auth-tab-${t}`}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                transition: "all 0.18s",
                background: tab === t ? "rgba(255,255,255,0.12)" : "transparent",
                color: tab === t ? "#fff" : "rgba(255,255,255,0.38)",
                boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.4)" : "none",
              }}
            >
              {t === "signup" ? "Sign up" : "Sign in"}
            </button>
          ))}
        </div>

        {/* Social buttons */}
        <button
          data-testid="auth-google"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "13px 0",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#e2e8f0",
            fontSize: "14px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            cursor: "pointer",
            marginBottom: 10,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[
            { id: "github", label: "GitHub", Icon: Github, iconColor: "rgba(255,255,255,0.85)" },
            { id: "discord", label: "Discord", Icon: DiscordIcon, iconColor: "#5865F2" },
          ].map(({ id, label, Icon, iconColor }) => (
            <button
              key={id}
              data-testid={`auth-${id}`}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 0",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "#e2e8f0",
                fontSize: "14px",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
            >
              <Icon style={{ width: 17, height: 17, color: iconColor }} />
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
            or continue with email
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <AnimatePresence initial={false}>
            {tab === "signup" && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                <label style={{ display: "block", fontFamily: "'Manrope', sans-serif", fontSize: "13px", fontWeight: 600, color: "rgba(200,215,235,0.7)", marginBottom: 7 }}>
                  Full name
                </label>
                <input
                  data-testid="auth-input-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputBase}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(167,139,250,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: "'Manrope', sans-serif", fontSize: "13px", fontWeight: 600, color: "rgba(200,215,235,0.7)", marginBottom: 7 }}>
              Email
            </label>
            <input
              data-testid="auth-input-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputBase}
              onFocus={(e) => (e.target.style.borderColor = "rgba(167,139,250,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontFamily: "'Manrope', sans-serif", fontSize: "13px", fontWeight: 600, color: "rgba(200,215,235,0.7)", marginBottom: 7 }}>
              Password
            </label>
            <input
              data-testid="auth-input-password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputBase}
              onFocus={(e) => (e.target.style.borderColor = "rgba(167,139,250,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
            />
          </div>

          <button
            data-testid="auth-submit"
            type="submit"
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: "12px",
              background: "linear-gradient(90deg, #7c3aed 0%, #a855f7 60%, #c084fc 100%)",
              color: "#fff",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 24px rgba(124,58,237,0.45), 0 0 0 1px rgba(124,58,237,0.2)",
              transition: "opacity 0.15s, box-shadow 0.15s",
              marginBottom: 18,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(124,58,237,0.6), 0 0 0 1px rgba(124,58,237,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(124,58,237,0.45), 0 0 0 1px rgba(124,58,237,0.2)";
            }}
          >
            {tab === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontFamily: "'Manrope', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.38)", marginBottom: 10 }}>
          {tab === "signup" ? "Already have an account? " : "No account yet? "}
          <span
            data-testid="auth-switch-tab"
            onClick={() => setTab(tab === "signup" ? "signin" : "signup")}
            style={{ color: "#a78bfa", cursor: "pointer", fontWeight: 600 }}
          >
            {tab === "signup" ? "Sign in" : "Sign up"}
          </span>
        </p>

        {tab === "signup" && (
          <p style={{ textAlign: "center", fontFamily: "'Manrope', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.22)", lineHeight: 1.5 }}>
            By continuing you agree to our{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer", color: "rgba(255,255,255,0.38)" }}>Terms</span>
            {" & "}
            <span style={{ textDecoration: "underline", cursor: "pointer", color: "rgba(255,255,255,0.38)" }}>Privacy</span>
          </p>
        )}
      </div>

      {/* ── Right panel: branding ── */}
      <div
        style={{
          background: "linear-gradient(160deg, #0c1f4a 0%, #070e28 40%, #03080f 75%, #000 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            height: "60%",
            background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(14,60,160,0.55) 0%, rgba(6,20,70,0.2) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Scan lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
            pointerEvents: "none",
          }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(5rem, 12vw, 9rem)",
            fontWeight: 900,
            letterSpacing: "-0.055em",
            color: "#ffffff",
            lineHeight: 0.9,
            marginBottom: 22,
            position: "relative",
            textShadow: "0 0 80px rgba(20,60,160,0.4), 0 4px 32px rgba(0,0,0,0.8)",
          }}
        >
          sonar
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.025em",
            marginBottom: 12,
            position: "relative",
          }}
        >
          The future is here
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
            fontWeight: 400,
            color: "rgba(180,195,215,0.55)",
            lineHeight: 1.55,
            maxWidth: 280,
            position: "relative",
          }}
        >
          Create your own app without coding a line.
        </motion.p>
      </div>
    </div>
  );
}
