import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Code2, Globe, Shield, ChevronRight, Star } from "lucide-react";
import { PROJECT_TEMPLATES } from "../data/mockData";

const TYPING_PROMPTS = [
  "Build a todo app with priorities and deadlines",
  "Create an analytics dashboard with real-time charts",
  "Make an e-commerce store with cart and checkout",
  "Design a SaaS landing page with pricing tiers",
  "Build a blog platform with markdown support",
];

const FEATURES = [
  { icon: Zap, title: "Instant Generation", desc: "From idea to deployed app in under 60 seconds" },
  { icon: Code2, title: "Production Code", desc: "Clean, maintainable React + TypeScript output" },
  { icon: Globe, title: "Auto Deploy", desc: "Deployed globally on edge infrastructure instantly" },
  { icon: Shield, title: "Enterprise Grade", desc: "Secure, scalable, and always-on applications" },
];

const STATS = [
  { value: "120K+", label: "Apps Built" },
  { value: "4.9s", label: "Avg Build Time" },
  { value: "99.9%", label: "Uptime" },
  { value: "$0.12", label: "Avg Cost" },
];

export default function LandingPage({ onStart }) {
  const [inputValue, setInputValue] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isFocused) return;
    const currentPrompt = TYPING_PROMPTS[typingIndex];
    const speed = isDeleting ? 30 : 60;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentPrompt.length) {
        setCharIndex(c => c + 1);
        setInputValue(currentPrompt.slice(0, charIndex + 1));
      } else if (isDeleting && charIndex > 0) {
        setCharIndex(c => c - 1);
        setInputValue(currentPrompt.slice(0, charIndex - 1));
      } else if (!isDeleting && charIndex === currentPrompt.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTypingIndex(i => (i + 1) % TYPING_PROMPTS.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, typingIndex, isFocused]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const val = isFocused ? inputValue : inputValue;
    if (!val.trim()) return;
    onStart(val.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSuggestion = (template) => {
    setIsFocused(true);
    setInputValue(template.prompt);
    setTimeout(() => onStart(template.prompt), 300);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 20%, #0a1628 0%, #02040A 50%, #000000 100%)",
      }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #1e40af 0%, transparent 70%)" }} />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "#7c3aed" }} />

      {/* Top nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: "rgba(2,4,10,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(30,41,59,0.5)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-xl tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            sonar
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full text-cyan-400 border border-cyan-500/30 bg-cyan-500/10">BETA</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-slate-400 hover:text-white text-sm transition-colors">Features</a>
          <a href="#pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</a>
          <a href="#docs" className="text-slate-400 hover:text-white text-sm transition-colors">Docs</a>
          <button
            data-testid="nav-sign-in"
            className="text-sm px-4 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all"
          >
            Sign in
          </button>
          <button
            data-testid="nav-get-started"
            onClick={() => onStart("Build me an amazing app")}
            className="text-sm px-4 py-1.5 rounded-lg font-semibold text-black transition-all"
            style={{ background: "linear-gradient(135deg, #06b6d4, #0ea5e9)", boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}
          >
            Get Started
          </button>
        </div>
      </motion.nav>

      {/* Hero */}
      <div className="flex flex-col items-center text-center px-4 pt-16 pb-8 max-w-4xl w-full z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-slate-700/60 bg-slate-900/40 backdrop-blur-sm"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-slate-400">120,000+ apps built this month</span>
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-slate-400">4.9/5</span>
        </motion.div>

        {/* Giant Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-black tracking-tighter mb-4 leading-none"
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: "clamp(5rem, 18vw, 12rem)",
            color: "#ffffff",
            textShadow: "0 0 80px rgba(30,64,175,0.6), 0 0 160px rgba(30,64,175,0.3)",
          }}
        >
          sonar
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-bold text-white mb-3"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontFamily: "'Cabinet Grotesk', sans-serif" }}
        >
          The future is here
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-slate-400 text-lg mb-12 max-w-xl"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Create your own app without coding a line.
        </motion.p>

        {/* Chat Input */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full max-w-2xl mb-8"
        >
          <div
            className="relative rounded-2xl transition-all duration-300"
            style={{
              background: "rgba(15,23,42,0.8)",
              border: isFocused ? "1px solid rgba(6,182,212,0.6)" : "1px solid rgba(30,41,59,0.8)",
              boxShadow: isFocused ? "0 0 30px rgba(6,182,212,0.15), inset 0 0 20px rgba(6,182,212,0.05)" : "none",
              backdropFilter: "blur(16px)",
            }}
          >
            <textarea
              ref={inputRef}
              data-testid="landing-idea-input"
              value={inputValue}
              onChange={e => { setInputValue(e.target.value); setIsFocused(true); }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => { if (!inputValue) setIsFocused(false); }}
              onKeyDown={handleKeyDown}
              placeholder={isFocused ? "Type your idea..." : ""}
              rows={3}
              className="w-full bg-transparent px-6 pt-5 pb-14 text-white text-base outline-none resize-none placeholder-slate-500"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            />
            {!isFocused && !inputValue && (
              <div className="absolute inset-x-6 top-5 text-slate-500 pointer-events-none text-base flex items-center gap-0.5">
                <span>{inputValue}</span>
                <span className="w-0.5 h-4 bg-cyan-400 animate-pulse ml-0.5" />
              </div>
            )}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">E-1</span>
                <span className="text-slate-700">·</span>
                <span className="text-xs text-slate-500">GPT-4o</span>
                <span className="text-slate-700">·</span>
                <span className="text-xs text-slate-500">Est. ~$0.12</span>
              </div>
              <button
                data-testid="landing-submit-btn"
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: inputValue.trim() ? "linear-gradient(135deg, #06b6d4, #0ea5e9)" : "rgba(30,41,59,0.5)",
                  color: inputValue.trim() ? "#000" : "#64748b",
                  boxShadow: inputValue.trim() ? "0 0 20px rgba(6,182,212,0.4)" : "none",
                }}
              >
                Build <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Suggestion pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-wrap gap-2 justify-center mb-16"
        >
          {Object.values(PROJECT_TEMPLATES).map((t) => (
            <button
              key={t.name}
              data-testid={`suggestion-${t.preview}`}
              onClick={() => handleSuggestion(t)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-slate-400 border border-slate-700/60 hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
              style={{ background: "rgba(15,23,42,0.6)" }}
            >
              <ChevronRight className="w-3 h-3" /> {t.name}
            </button>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="grid grid-cols-4 gap-8 mb-20 w-full max-w-xl"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-black text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Features */}
      <motion.div
        id="features"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.7 }}
        className="w-full max-w-4xl px-8 pb-24 z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
              className="p-4 rounded-xl border border-slate-800/60 group hover:border-cyan-500/20 transition-all duration-300 cursor-default"
              style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(8px)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}>
                <f.icon className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">{f.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
