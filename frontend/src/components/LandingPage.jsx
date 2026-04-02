import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, ChevronDown, Check } from "lucide-react";
import { PROJECT_TEMPLATES, MODELS } from "../data/mockData";

const MODE_INFO = {
  "E-1": { label: "E-1", desc: "Fast · Prototype-ready", cost: { todo: "$0.08", dashboard: "$0.12", ecommerce: "$0.16", default: "$0.09" } },
  "E-2": { label: "E-2", desc: "Deep · Production-grade", cost: { todo: "$0.14", dashboard: "$0.19", ecommerce: "$0.24", default: "$0.18" } },
};

const TYPING_PROMPTS = [
  "Build a todo app with priorities and deadlines",
  "Create an analytics dashboard with real-time charts",
  "Make an e-commerce store with cart and checkout",
  "Design a SaaS landing page with pricing tiers",
  "Build a blog platform with markdown support",
];

export default function LandingPage({ onStart }) {
  const [inputValue, setInputValue] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // Options state
  const [selectedMode, setSelectedMode] = useState("E-1");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [modelOpen, setModelOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const inputRef = useRef(null);
  const modelRef = useRef(null);
  const modeRef = useRef(null);

  const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  // Estimate cost based on mode
  const estimatedCost = MODE_INFO[selectedMode].cost.default;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (modelRef.current && !modelRef.current.contains(e.target)) setModelOpen(false);
      if (modeRef.current && !modeRef.current.contains(e.target)) setModeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isFocused) return;
    const currentPrompt = TYPING_PROMPTS[typingIndex];
    const speed = isDeleting ? 28 : 55;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentPrompt.length) {
        setCharIndex(c => c + 1);
        setInputValue(currentPrompt.slice(0, charIndex + 1));
      } else if (isDeleting && charIndex > 0) {
        setCharIndex(c => c - 1);
        setInputValue(currentPrompt.slice(0, charIndex - 1));
      } else if (!isDeleting && charIndex === currentPrompt.length) {
        setTimeout(() => setIsDeleting(true), 2200);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTypingIndex(i => (i + 1) % TYPING_PROMPTS.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, typingIndex, isFocused]);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onStart(inputValue.trim(), selectedModel, selectedMode);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleSuggestion = (template) => {
    setIsFocused(true);
    setInputValue(template.prompt);
    setTimeout(() => onStart(template.prompt, selectedModel, selectedMode), 300);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #0c1f4a 0%, #060d1e 35%, #010408 65%, #000000 100%)",
      }}
    >
      {/* Subtle horizontal scan lines for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
        }}
      />

      {/* Blue glow at top center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 55% at 50% 5%, rgba(12,60,150,0.65) 0%, rgba(5,20,70,0.3) 45%, transparent 100%)",
          filter: "blur(2px)",
        }}
      />

      {/* Minimal top nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative z-20 flex items-center justify-between px-10 py-5"
      >
        <span
          className="text-white font-black text-lg tracking-tight select-none"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif", letterSpacing: "-0.02em" }}
        >
          sonar
        </span>
        <div className="flex items-center gap-7">
          <a href="#" className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={e => e.target.style.color="rgba(255,255,255,0.85)"}
            onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.45)"}>
            Docs
          </a>
          <a href="#" className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={e => e.target.style.color="rgba(255,255,255,0.85)"}
            onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.45)"}>
            Pricing
          </a>
          <button
            data-testid="nav-sign-in"
            className="text-sm px-5 py-2 rounded-lg transition-all"
            style={{
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
            }}
            onMouseEnter={e => { e.currentTarget.style.color="rgba(255,255,255,0.9)"; e.currentTarget.style.background="rgba(255,255,255,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,0.6)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
          >
            Sign in
          </button>
        </div>
      </motion.nav>

      {/* HERO — centered vertically in the viewport */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10" style={{ minHeight: "80vh" }}>

        {/* Giant SONAR text */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Cabinet Grotesk', 'Inter', sans-serif",
            fontSize: "clamp(7rem, 22vw, 18rem)",
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            textShadow: [
              "0 2px 4px rgba(0,0,0,0.9)",
              "0 8px 32px rgba(0,0,0,0.7)",
              "0 0 120px rgba(20,60,160,0.35)",
            ].join(", "),
            userSelect: "none",
          }}
        >
          sonar
        </motion.h1>

        {/* Subtitle block — slightly overlapping, matching reference */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-1"
        >
          <p
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: "clamp(1.6rem, 4.5vw, 3.2rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            The future is here
          </p>
          <p
            className="mt-2"
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "clamp(1rem, 2.5vw, 1.55rem)",
              fontWeight: 500,
              color: "rgba(180,190,210,0.75)",
              letterSpacing: "-0.01em",
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}
          >
            Create your own app without coding a line.
          </p>
        </motion.div>

        {/* Input box — large, centered, below text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full px-6 mt-12"
          style={{ maxWidth: "680px" }}
        >
          <div
            className="relative transition-all duration-300"
            style={{
              background: "rgba(22,28,40,0.92)",
              border: isFocused
                ? "1px solid rgba(6,182,212,0.5)"
                : "1px solid rgba(60,75,100,0.5)",
              borderRadius: "16px",
              boxShadow: isFocused
                ? "0 0 0 3px rgba(6,182,212,0.08), 0 8px 40px rgba(0,0,0,0.6)"
                : "0 4px 30px rgba(0,0,0,0.5)",
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
              placeholder=""
              rows={3}
              className="w-full bg-transparent outline-none resize-none"
              style={{
                padding: "22px 24px 56px",
                color: "#e8ecf4",
                fontSize: "1rem",
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            />

            {/* Animated placeholder when not focused */}
            {!isFocused && !inputValue && (
              <div
                className="absolute pointer-events-none flex items-center gap-0.5"
                style={{ top: "22px", left: "24px", color: "rgba(120,135,160,0.7)", fontSize: "1rem", fontFamily: "'Manrope', sans-serif" }}
              >
                <span>{inputValue}</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  style={{ width: "2px", height: "18px", background: "rgba(6,182,212,0.8)", display: "inline-block", borderRadius: "1px", marginLeft: "1px", verticalAlign: "text-bottom" }}
                />
              </div>
            )}

            {/* Bottom row of input */}
            <div
              className="absolute flex items-center justify-between"
              style={{ bottom: "12px", left: "16px", right: "16px" }}
            >
              <div className="flex items-center gap-1.5">

                {/* Mode selector */}
                <div ref={modeRef} className="relative">
                  <button
                    data-testid="landing-mode-selector"
                    onClick={() => { setModeOpen(o => !o); setModelOpen(false); }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md transition-all"
                    style={{
                      fontSize: "11px",
                      fontFamily: "'Manrope', sans-serif",
                      color: modeOpen ? "#06b6d4" : "rgba(110,130,165,0.9)",
                      background: modeOpen ? "rgba(6,182,212,0.08)" : "rgba(255,255,255,0.04)",
                      border: modeOpen ? "1px solid rgba(6,182,212,0.25)" : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span className="font-semibold">{selectedMode}</span>
                    <ChevronDown style={{ width: "10px", height: "10px", opacity: 0.6 }} />
                  </button>
                  <AnimatePresence>
                    {modeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 left-0 rounded-xl overflow-hidden z-50"
                        style={{
                          width: "200px",
                          background: "#0d1424",
                          border: "1px solid rgba(40,60,100,0.7)",
                          boxShadow: "0 16px 40px rgba(0,0,0,0.7)",
                        }}
                      >
                        {Object.entries(MODE_INFO).map(([key, info]) => (
                          <button
                            key={key}
                            data-testid={`landing-mode-${key.toLowerCase().replace("-","")}`}
                            onClick={() => { setSelectedMode(key); setModeOpen(false); }}
                            className="w-full flex items-start justify-between px-4 py-3 transition-colors text-left"
                            style={{ background: selectedMode === key ? "rgba(6,182,212,0.07)" : "transparent" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                            onMouseLeave={e => e.currentTarget.style.background = selectedMode === key ? "rgba(6,182,212,0.07)" : "transparent"}
                          >
                            <div>
                              <p className="font-semibold" style={{ fontSize: "12px", color: selectedMode === key ? "#06b6d4" : "#e2e8f0" }}>{info.label}</p>
                              <p style={{ fontSize: "11px", color: "rgba(100,120,160,0.8)", marginTop: "1px" }}>{info.desc}</p>
                            </div>
                            {selectedMode === key && <Check style={{ width: "12px", height: "12px", color: "#06b6d4", marginTop: "2px", flexShrink: 0 }} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <span style={{ color: "rgba(50,70,100,0.7)", fontSize: "12px" }}>·</span>

                {/* Model selector */}
                <div ref={modelRef} className="relative">
                  <button
                    data-testid="landing-model-selector"
                    onClick={() => { setModelOpen(o => !o); setModeOpen(false); }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md transition-all"
                    style={{
                      fontSize: "11px",
                      fontFamily: "'Manrope', sans-serif",
                      color: modelOpen ? "#06b6d4" : "rgba(110,130,165,0.9)",
                      background: modelOpen ? "rgba(6,182,212,0.08)" : "rgba(255,255,255,0.04)",
                      border: modelOpen ? "1px solid rgba(6,182,212,0.25)" : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      className="font-black flex items-center justify-center"
                      style={{
                        width: "14px", height: "14px", borderRadius: "3px", fontSize: "8px",
                        background: currentModel.color, color: "#000", flexShrink: 0,
                      }}
                    >
                      {currentModel.provider === "openai" ? "G" : currentModel.provider === "anthropic" ? "C" : "G"}
                    </span>
                    <span>{currentModel.label}</span>
                    <ChevronDown style={{ width: "10px", height: "10px", opacity: 0.6 }} />
                  </button>
                  <AnimatePresence>
                    {modelOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 left-0 rounded-xl overflow-hidden z-50"
                        style={{
                          width: "210px",
                          background: "#0d1424",
                          border: "1px solid rgba(40,60,100,0.7)",
                          boxShadow: "0 16px 40px rgba(0,0,0,0.7)",
                        }}
                      >
                        <p style={{ fontSize: "10px", color: "rgba(80,110,150,0.8)", padding: "10px 14px 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Model</p>
                        {MODELS.map(m => (
                          <button
                            key={m.id}
                            data-testid={`landing-model-${m.id}`}
                            onClick={() => { setSelectedModel(m.id); setModelOpen(false); }}
                            className="w-full flex items-center justify-between px-4 py-2.5 transition-colors"
                            style={{ background: selectedModel === m.id ? "rgba(6,182,212,0.07)" : "transparent" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                            onMouseLeave={e => e.currentTarget.style.background = selectedModel === m.id ? "rgba(6,182,212,0.07)" : "transparent"}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className="font-black flex items-center justify-center"
                                style={{ width: "18px", height: "18px", borderRadius: "4px", fontSize: "9px", background: m.color, color: "#000", flexShrink: 0 }}
                              >
                                {m.provider === "openai" ? "G" : m.provider === "anthropic" ? "C" : "G"}
                              </span>
                              <span style={{ fontSize: "12px", color: selectedModel === m.id ? "#06b6d4" : "#e2e8f0" }}>{m.label}</span>
                            </div>
                            {selectedModel === m.id && <Check style={{ width: "12px", height: "12px", color: "#06b6d4", flexShrink: 0 }} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <span style={{ color: "rgba(50,70,100,0.7)", fontSize: "12px" }}>·</span>

                {/* Cost estimate — updates with mode */}
                <span
                  data-testid="landing-cost-estimate"
                  style={{ fontSize: "11px", color: "rgba(110,130,165,0.8)", fontFamily: "'Manrope', sans-serif" }}
                >
                  Est. ~{estimatedCost}
                </span>
              </div>

              {/* Build button */}
              <motion.button
                data-testid="landing-submit-btn"
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                whileHover={inputValue.trim() ? { scale: 1.04 } : {}}
                whileTap={inputValue.trim() ? { scale: 0.97 } : {}}
                className="flex items-center gap-2 font-semibold transition-all duration-300"
                style={{
                  padding: "7px 16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  background: inputValue.trim()
                    ? "linear-gradient(135deg, #06b6d4, #0ea5e9)"
                    : "rgba(40,55,80,0.6)",
                  color: inputValue.trim() ? "#000" : "rgba(80,100,130,0.7)",
                  boxShadow: inputValue.trim() ? "0 0 18px rgba(6,182,212,0.35)" : "none",
                  cursor: inputValue.trim() ? "pointer" : "not-allowed",
                  border: "none",
                }}
              >
                Build <ArrowRight style={{ width: "13px", height: "13px" }} />
              </motion.button>
            </div>
          </div>

          {/* Suggestion pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="flex flex-wrap gap-2 justify-center mt-4"
          >
            {Object.values(PROJECT_TEMPLATES).map((t) => (
              <button
                key={t.name}
                data-testid={`suggestion-${t.preview}`}
                onClick={() => handleSuggestion(t)}
                className="flex items-center gap-1 transition-all duration-200"
                style={{
                  padding: "5px 12px",
                  borderRadius: "99px",
                  fontSize: "12px",
                  color: "rgba(140,160,190,0.8)",
                  border: "1px solid rgba(60,80,110,0.4)",
                  background: "rgba(15,25,45,0.5)",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "rgba(6,182,212,0.9)";
                  e.currentTarget.style.borderColor = "rgba(6,182,212,0.35)";
                  e.currentTarget.style.background = "rgba(6,182,212,0.06)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "rgba(140,160,190,0.8)";
                  e.currentTarget.style.borderColor = "rgba(60,80,110,0.4)";
                  e.currentTarget.style.background = "rgba(15,25,45,0.5)";
                }}
              >
                <ChevronRight style={{ width: "11px", height: "11px" }} /> {t.name}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
