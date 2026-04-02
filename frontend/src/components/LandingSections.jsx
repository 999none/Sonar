import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Code2, Rocket, Check, Shield, Users, Sparkles, Github, ArrowRight, ChevronRight } from "lucide-react";

// ─── Icons ────────────────────────────────────────────────────────────────────

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
    <svg width="17" height="17" viewBox="0 0 24 24" fill="#5865F2">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.044.03.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Zap,       color: "#06b6d4", title: "Ship 10x faster",       desc: "De l'idée à la production en minutes. Zero setup, zero boilerplate — décrivez et construisez." },
  { icon: Code2,     color: "#0ea5e9", title: "Zéro code requis",       desc: "Le langage naturel devient du code production-ready. TypeScript, React, FastAPI — votre stack, vos règles." },
  { icon: Rocket,    color: "#10b981", title: "Déployez en 1 clic",     desc: "URLs de preview instantanées, domaines custom, et auto-scaling. Shippez sans DevOps." },
  { icon: Shield,    color: "#a78bfa", title: "Sécurisé par défaut",    desc: "Auth enterprise, données chiffrées, audit logs. Production-ready dès le premier jour." },
  { icon: Users,     color: "#f59e0b", title: "Fait pour les équipes",  desc: "Partagez des projets, collaborez en temps réel, et reviewez les changements avant de les déployer." },
  { icon: Sparkles,  color: "#ec4899", title: "Multi-modèles AI",       desc: "GPT-4o, Claude Sonnet, Gemini Pro. Sonar choisit automatiquement le meilleur modèle pour chaque tâche." },
];

const STEPS = [
  { num: "01", title: "Décrivez votre idée",   desc: "Tapez ce que vous voulez construire en français ou anglais. Aucune compétence en prompt engineering requise.", color: "#06b6d4" },
  { num: "02", title: "L'IA construit live",    desc: "Sonar écrit, teste et débogue le code en temps réel. Vous observez chaque étape de la génération.", color: "#0ea5e9" },
  { num: "03", title: "Déployez instantanément",desc: "Un clic pour mettre en ligne. Votre app est accessible avec une URL publique en quelques secondes.", color: "#10b981" },
];

const PLANS = [
  {
    name: "Starter",    price: "Gratuit", period: "",       desc: "Pour explorer et prototyper",
    features: ["5 projets", "GPT-4o mini", "Support communauté", "Preview URLs"],
    cta: "Commencer",   highlight: false, color: "#64748b",
  },
  {
    name: "Pro",        price: "20€",     period: "/mois",  desc: "Pour les builders & indie hackers",
    features: ["Projets illimités", "GPT-4o + Claude Sonnet", "Support prioritaire", "Domaines custom", "3 seats inclus"],
    cta: "Essayer gratuitement", highlight: true, color: "#06b6d4",
  },
  {
    name: "Enterprise", price: "Sur devis", period: "",     desc: "Pour les équipes à grande échelle",
    features: ["Tout de Pro", "Tous les modèles AI", "SSO / SAML", "Support dédié", "SLA garanti"],
    cta: "Contacter l'équipe", highlight: false, color: "#a78bfa",
  },
];

// ─── Section heading helper ────────────────────────────────────────────────────

function SectionHead({ label, title, sub, center = true }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 56 }}>
      {label && (
        <p style={{ fontSize: "11px", color: "rgba(6,182,212,0.75)", fontFamily: "'Manrope',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>
          {label}
        </p>
      )}
      <h2 style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: "clamp(1.9rem, 4vw, 2.9rem)", fontWeight: 700, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.1, marginBottom: 14 }}>
        {title}
      </h2>
      {sub && (
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.05rem", color: "rgba(180,195,215,0.6)", fontWeight: 400, maxWidth: 520, margin: center ? "0 auto" : undefined }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Features section ─────────────────────────────────────────────────────────

function FeatureCard({ f, index }) {
  const [hovered, setHovered] = useState(false);
  const Icon = f.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "28px 28px 24px",
        borderRadius: "16px",
        background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? `${f.color}28` : "rgba(255,255,255,0.07)"}`,
        transition: "all 0.2s",
        boxShadow: hovered ? `0 8px 32px ${f.color}12` : "none",
        cursor: "default",
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${f.color}15`, border: `1px solid ${f.color}28`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <Icon style={{ width: 18, height: 18, color: f.color }} />
      </div>
      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "15px", fontWeight: 600, color: "#e2e8f0", marginBottom: 8, letterSpacing: "-0.02em" }}>
        {f.title}
      </p>
      <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: "13px", color: "rgba(140,158,180,0.7)", lineHeight: 1.6 }}>
        {f.desc}
      </p>
    </motion.div>
  );
}

function FeaturesSection() {
  return (
    <section style={{ padding: "110px 40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <SectionHead
          label="Pourquoi Sonar"
          title={<>Construisez n&apos;importe quoi,<br />en quelques secondes.</>}
          sub="Sonar transforme vos idées en applications production-ready — sans jamais toucher à une ligne de code."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {FEATURES.map((f, i) => <FeatureCard key={f.title} f={f} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────

function StepCard({ step, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.35 }}
      style={{ textAlign: "center" }}
    >
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", border: `1.5px solid ${step.color}40`, background: `${step.color}10`, marginBottom: 20 }}>
        <span style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 900, color: step.color, letterSpacing: "-0.03em" }}>
          {step.num}
        </span>
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "16px", fontWeight: 600, color: "#e2e8f0", marginBottom: 10, letterSpacing: "-0.025em" }}>
        {step.title}
      </h3>
      <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: "13px", color: "rgba(140,158,180,0.65)", lineHeight: 1.65 }}>
        {step.desc}
      </p>
    </motion.div>
  );
}

function HowItWorksSection() {
  return (
    <section style={{ padding: "80px 40px 110px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <SectionHead label="Comment ça marche" title="Trois étapes. C'est tout." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 32px 1fr 32px 1fr", gap: 0, alignItems: "start" }}>
          {STEPS.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} />
          ))}
          <div style={{ gridColumn: "2", gridRow: "1", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 27 }}>
            <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>
          <div style={{ gridColumn: "4", gridRow: "1", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 27 }}>
            <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function PlanCard({ plan, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.35 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "32px 28px",
        borderRadius: "20px",
        background: plan.highlight ? "rgba(6,182,212,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${plan.highlight ? "rgba(6,182,212,0.35)" : "rgba(255,255,255,0.07)"}`,
        position: "relative",
        transition: "all 0.2s",
        boxShadow: plan.highlight ? "0 0 48px rgba(6,182,212,0.08)" : (hovered ? "0 8px 32px rgba(0,0,0,0.4)" : "none"),
      }}
    >
      {plan.highlight && (
        <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,#06b6d4,#0ea5e9)", color: "#000", fontSize: "10px", fontWeight: 700, padding: "3px 12px", borderRadius: 99, letterSpacing: "0.06em", fontFamily: "'Manrope',sans-serif", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Populaire
        </div>
      )}
      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "13px", fontWeight: 600, color: plan.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
        {plan.name}
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
        <span style={{ fontFamily: "'Sora',sans-serif", fontSize: "2.4rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>
          {plan.price}
        </span>
        {plan.period && (
          <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: "14px", color: "rgba(140,158,180,0.6)" }}>
            {plan.period}
          </span>
        )}
      </div>
      <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: "12px", color: "rgba(140,158,180,0.55)", marginBottom: 24 }}>
        {plan.desc}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: `${plan.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check style={{ width: 9, height: 9, color: plan.color }} />
            </div>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: "13px", color: "rgba(180,195,215,0.75)" }}>{f}</span>
          </div>
        ))}
      </div>
      <button
        style={{
          width: "100%", padding: "11px 0", borderRadius: "12px", fontFamily: "'Space Grotesk',sans-serif",
          fontWeight: 600, fontSize: "14px", cursor: "pointer", transition: "all 0.18s",
          background: plan.highlight ? "linear-gradient(90deg,#06b6d4,#0ea5e9)" : "rgba(255,255,255,0.06)",
          border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
          color: plan.highlight ? "#000" : "#e2e8f0",
          boxShadow: plan.highlight ? "0 4px 24px rgba(6,182,212,0.3)" : "none",
        }}
        onMouseEnter={e => { if (!plan.highlight) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
        onMouseLeave={e => { if (!plan.highlight) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
      >
        {plan.cta}
      </button>
    </motion.div>
  );
}

function PricingSection() {
  return (
    <section id="pricing" style={{ padding: "110px 40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <SectionHead
          label="Tarifs"
          title="Simple. Transparent."
          sub="Pas de surprise, pas de frais cachés. Upgradez ou downgrade à tout moment."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {PLANS.map((plan, i) => <PlanCard key={plan.name} plan={plan} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Auth / Get started section (from reference screenshot) ──────────────────

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
  color: "#e2e8f0", fontSize: "14px", fontFamily: "'Manrope',sans-serif",
  outline: "none", boxSizing: "border-box", marginBottom: 14,
  transition: "border 0.15s",
};

function AuthSection() {
  const [tab, setTab] = useState("signup");
  return (
    <section id="get-started" style={{ padding: "110px 40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        style={{
          maxWidth: "900px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "45fr 55fr",
          borderRadius: "24px", overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── Left: Form ── */}
        <div style={{ background: "#0c0f16", padding: "44px 40px 40px" }}>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.05em", color: "#fff" }}>
            sonar
          </span>

          {/* Toggle */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: "10px", padding: 3, margin: "22px 0 26px", gap: 2 }}>
            {["signup", "signin"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: "8px", border: "none", cursor: "pointer",
                  fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: "13px",
                  background: tab === t ? "#fff" : "transparent",
                  color: tab === t ? "#000" : "rgba(255,255,255,0.45)",
                  transition: "all 0.18s",
                }}
              >
                {t === "signup" ? "Sign up" : "Sign in"}
              </button>
            ))}
          </div>

          {/* Social buttons */}
          <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "11px 0", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: "14px", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 500, cursor: "pointer", marginBottom: 10, transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {[
              { label: "GitHub",  Icon: Github,      color: "rgba(255,255,255,0.85)" },
              { label: "Discord", Icon: DiscordIcon,  color: "#5865F2" },
            ].map(({ label, Icon, color }) => (
              <button key={label} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 0", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", fontSize: "13px", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 500, cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              >
                <Icon style={{ width: 16, height: 16, color }} /> {label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Form */}
          {tab === "signup" && (
            <div>
              <label style={{ fontFamily: "'Manrope',sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(180,195,215,0.75)", display: "block", marginBottom: 6 }}>Full name</label>
              <input style={inputStyle} placeholder="John Doe"
                onFocus={e => e.target.style.borderColor = "rgba(6,182,212,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
          )}
          <div>
            <label style={{ fontFamily: "'Manrope',sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(180,195,215,0.75)", display: "block", marginBottom: 6 }}>Email</label>
            <input style={inputStyle} placeholder="you@example.com" type="email"
              onFocus={e => e.target.style.borderColor = "rgba(6,182,212,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          <div>
            <label style={{ fontFamily: "'Manrope',sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(180,195,215,0.75)", display: "block", marginBottom: 6 }}>Password</label>
            <input style={{ ...inputStyle, marginBottom: 20 }} placeholder="Min. 8 characters" type="password"
              onFocus={e => e.target.style.borderColor = "rgba(6,182,212,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          <button style={{ width: "100%", padding: "13px 0", borderRadius: "12px", background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "15px", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.4)", transition: "opacity 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {tab === "signup" ? "Create account" : "Sign in"}
          </button>

          <p style={{ textAlign: "center", marginTop: 14, fontFamily: "'Manrope',sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
            {tab === "signup" ? "Already have an account? " : "No account yet? "}
            <span onClick={() => setTab(tab === "signup" ? "signin" : "signup")} style={{ color: "#a78bfa", cursor: "pointer" }}>
              {tab === "signup" ? "Sign in" : "Sign up"}
            </span>
          </p>
          {tab === "signup" && (
            <p style={{ textAlign: "center", marginTop: 8, fontFamily: "'Manrope',sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
              By continuing you agree to our <u style={{ cursor: "pointer" }}>Terms</u> & <u style={{ cursor: "pointer" }}>Privacy</u>
            </p>
          )}
        </div>

        {/* ── Right: Branding ── */}
        <div style={{
          background: "linear-gradient(140deg, #0c1f4a 0%, #060d1e 50%, #010408 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "48px", textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          {/* Glow */}
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 200, background: "radial-gradient(ellipse, rgba(14,165,233,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(3.5rem, 8vw, 6rem)", fontWeight: 900, letterSpacing: "-0.055em", color: "#fff", lineHeight: 0.9, marginBottom: 20, position: "relative" }}>
            sonar
          </h2>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", marginBottom: 10, position: "relative" }}>
            The future is here
          </p>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.95rem", fontWeight: 400, color: "rgba(180,195,215,0.6)", lineHeight: 1.55, maxWidth: 240, position: "relative" }}>
            Create your own app without coding a line.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const links = {
    Produit:   ["Fonctionnalités", "Tarifs", "Roadmap", "Changelog"],
    Ressources:["Documentation", "Tutoriels", "Blog", "Status"],
    Société:   ["À propos", "Carrières", "Presse", "Contact"],
    Légal:     ["Conditions", "Confidentialité", "Sécurité", "Cookies"],
  };
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "64px 40px 40px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "32px", marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.05em", color: "#fff", display: "block", marginBottom: 12 }}>sonar</span>
            <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: "13px", color: "rgba(140,158,180,0.55)", lineHeight: 1.7, maxWidth: 220 }}>
              Construisez des applications production-ready en quelques minutes grâce à l'IA.
            </p>
          </div>
          {/* Link columns */}
          {Object.entries(links).map(([cat, items]) => (
            <div key={cat}>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>{cat}</p>
              {items.map(item => (
                <a key={item} href="#" style={{ display: "block", fontFamily: "'Manrope',sans-serif", fontSize: "13px", color: "rgba(140,158,180,0.55)", marginBottom: 10, textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => e.target.style.color = "rgba(180,195,215,0.85)"}
                  onMouseLeave={e => e.target.style.color = "rgba(140,158,180,0.55)"}
                >
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>
        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: "12px", color: "rgba(100,116,139,0.45)" }}>
            © 2025 Sonar. Tous droits réservés.
          </p>
          <p style={{ fontFamily: "'Manrope',sans-serif", fontSize: "12px", color: "rgba(100,116,139,0.35)" }}>
            Propulsé par l'IA
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function LandingSections() {
  return (
    <div style={{ background: "#000308" }}>
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <AuthSection />
      <Footer />
    </div>
  );
}
