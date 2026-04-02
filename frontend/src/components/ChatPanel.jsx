import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, GitFork, Square, ChevronDown, Github, Zap, Brain, GitBranch, Code2, Bug, CheckCircle } from "lucide-react";

const SONAR_ICON = "https://customer-assets.emergentagent.com/job_emergent-mock-2/artifacts/bocxbvjv_66af99839e55f1ee29f117ac.png";

const AGENT_ICONS = { planner: Brain, architect: GitBranch, coder: Code2, debugger: Bug };

function formatTime() {
  return new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function SonarAvatar({ size = 24 }) {
  return (
    <div className="flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center"
      style={{ width: size, height: size, background: "rgba(200,100,70,0.1)", border: "1px solid rgba(200,100,70,0.2)" }}>
      <img src={SONAR_ICON} alt="" width={size - 6} height={size - 6} style={{ objectFit: "contain" }} />
    </div>
  );
}

/* ── User message ── */
function UserMsg({ content, isNew }) {
  return (
    <motion.div initial={isNew ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="mb-5">
      <div className="text-sm leading-relaxed px-4 py-3 rounded-2xl"
        style={{ background: "rgba(22,101,78,0.5)", border: "1px solid rgba(34,197,94,0.13)", color: "#dff5ea", fontFamily: "'Manrope',sans-serif", lineHeight: 1.65 }}>
        {content}
      </div>
      <p className="text-right mt-1 pr-1" style={{ fontSize: "11px", color: "rgba(80,110,90,0.55)", fontFamily: "'Manrope',sans-serif" }}>
        {formatTime()}
      </p>
    </motion.div>
  );
}

/* ── AI message ── */
function AIMsg({ content, isNew }) {
  return (
    <motion.div initial={isNew ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="flex gap-3 mb-5">
      <SonarAvatar size={24} />
      <p className="text-sm leading-relaxed flex-1 pt-0.5"
        style={{ color: "rgba(215,225,240,0.88)", fontFamily: "'Manrope',sans-serif", lineHeight: 1.7 }}>
        {content}
      </p>
    </motion.div>
  );
}

/* ── Agent inline step ── */
function AgentMsg({ agentId, label, status, steps, isNew }) {
  const Icon = AGENT_ICONS[agentId] || Code2;
  const isDone = status === "done";
  return (
    <motion.div initial={isNew ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
      className="flex gap-3 mb-4">
      {/* Icon */}
      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
        style={{
          background: isDone ? "rgba(16,185,129,0.12)" : "rgba(6,182,212,0.1)",
          border: `1px solid ${isDone ? "rgba(16,185,129,0.3)" : "rgba(6,182,212,0.25)"}`,
        }}>
        {isDone
          ? <CheckCircle style={{ width: 12, height: 12, color: "#10b981" }} />
          : <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
              <Icon style={{ width: 11, height: 11, color: "#06b6d4" }} />
            </motion.div>
        }
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span style={{ fontSize: "12px", fontWeight: 600, color: isDone ? "#10b981" : "#06b6d4", fontFamily: "'Manrope',sans-serif" }}>
            {label}
          </span>
          <span style={{ fontSize: "11px", color: isDone ? "rgba(16,185,129,0.6)" : "rgba(6,182,212,0.5)", fontFamily: "'Manrope',sans-serif" }}>
            {isDone ? "· Done" : "· Working"}
          </span>
        </div>
        <div className="space-y-0.5">
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(100,120,150,0.75)", fontFamily: "'Manrope',sans-serif" }}>
              <span style={{ color: isDone ? "rgba(16,185,129,0.5)" : "rgba(6,182,212,0.4)" }}>›</span> {s}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Processing dots ── */
function ProcessingRow() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-4">
      <SonarAvatar size={24} />
      <div className="flex items-center gap-1" style={{ fontFamily: "'Manrope',sans-serif", fontSize: "13px", color: "rgba(140,155,175,0.7)" }}>
        Processing next step
        {[0,1,2].map(i => (
          <motion.span key={i} animate={{ opacity: [0.2,1,0.2] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}>.</motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function ChatPanel({ messages, isTyping, isGenerating, onSendMessage, onReset }) {
  const [inputVal, setInputVal] = useState("");
  const [ultraOn, setUltraOn] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };

  const handleSend = () => {
    if (!inputVal.trim() || isGenerating) return;
    onSendMessage(inputVal.trim());
    setInputVal("");
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#0a0a0a" }}>

      {/* Messages */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto relative" style={{ padding: "24px 22px 12px" }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isNew = i === messages.length - 1;
            if (msg.role === "user") return <UserMsg key={i} content={msg.content} isNew={isNew} />;
            if (msg.role === "assistant") return <AIMsg key={i} content={msg.content} isNew={isNew} />;
            if (msg.role === "agent") return <AgentMsg key={i} agentId={msg.agentId} label={msg.label} status={msg.status} steps={msg.steps} isNew={isNew} />;
            return null;
          })}
        </AnimatePresence>
        {isTyping && <ProcessingRow />}
        <div ref={bottomRef} />

        {/* Scroll btn */}
        <AnimatePresence>
          {showScroll && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
              data-testid="scroll-to-bottom"
              className="sticky bottom-3 flex items-center justify-center rounded-full mx-auto"
              style={{ width: 32, height: 32, background: "rgba(28,35,48,0.95)", border: "1px solid rgba(60,75,100,0.6)", boxShadow: "0 4px 16px rgba(0,0,0,0.5)", display: "flex" }}>
              <ChevronDown style={{ width: 15, height: 15, color: "#94a3b8" }} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Status bar */}
      {(isGenerating || messages.length > 0) && (
        <div className="flex items-center gap-2 px-4 py-1.5 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {isGenerating ? (
            <>
              <motion.div animate={{ opacity: [1,0.3,1] }} transition={{ duration: 1.1, repeat: Infinity }} className="w-2 h-2 rounded-full bg-green-400" />
              <span style={{ fontSize: "12px", color: "#4ade80", fontFamily: "'Manrope',sans-serif" }}>Agent is running...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full" style={{ background: "rgba(100,116,139,0.5)" }} />
              <span style={{ fontSize: "12px", color: "rgba(100,116,139,0.7)", fontFamily: "'Manrope',sans-serif" }}>Agent ready</span>
            </>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 px-3 pb-3 pt-1" style={{ background: "#0a0a0a" }}>
        <div className="rounded-xl overflow-hidden" style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.07)" }}>
          <textarea
            data-testid="chat-input"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Message Sonar"
            rows={2}
            className="w-full bg-transparent outline-none resize-none"
            style={{ padding: "12px 14px 6px", color: "#e2e8f0", fontSize: "13px", fontFamily: "'Manrope',sans-serif", caretColor: "#06b6d4", lineHeight: 1.6 }}
          />
          <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
            <div className="flex items-center gap-1">
              <button data-testid="chat-mic-btn" className="w-7 h-7 flex items-center justify-center rounded-lg"
                style={{ color: "rgba(100,116,139,0.6)" }}>
                <Mic style={{ width: 13, height: 13 }} />
              </button>
              {[
                { id: "chat-github-btn", icon: Github, label: "Save" },
                { id: "chat-fork-btn", icon: GitFork, label: "Fork" },
              ].map(({ id, icon: Ic, label }) => (
                <button key={id} data-testid={id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                  style={{ color: "rgba(100,116,139,0.75)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  onMouseEnter={e => { e.currentTarget.style.color="#e2e8f0"; e.currentTarget.style.background="rgba(255,255,255,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color="rgba(100,116,139,0.75)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}>
                  <Ic style={{ width: 11, height: 11 }} /> {label}
                </button>
              ))}
              <button data-testid="chat-ultra-btn" onClick={() => setUltraOn(o => !o)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{ color: ultraOn ? "#f59e0b" : "rgba(100,116,139,0.75)", background: ultraOn ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${ultraOn ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                <Zap style={{ width: 11, height: 11 }} /> Ultra
                <div style={{ width: 22, height: 12, borderRadius: 6, background: ultraOn ? "rgba(245,158,11,0.55)" : "rgba(60,70,90,0.55)", position: "relative", transition: "background 0.2s" }}>
                  <motion.div animate={{ x: ultraOn ? 11 : 1 }} transition={{ duration: 0.15 }}
                    style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff", position: "absolute", top: 1 }} />
                </div>
              </button>
            </div>

            {/* Stop / Send */}
            {isGenerating ? (
              <motion.button data-testid="chat-stop-btn" onClick={onReset} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                className="flex items-center justify-center rounded-full"
                style={{ width: 30, height: 30, background: "#fff", boxShadow: "0 0 10px rgba(255,255,255,0.12)" }}>
                <Square style={{ width: 11, height: 11, color: "#000", fill: "#000" }} />
              </motion.button>
            ) : (
              <motion.button data-testid="chat-send-btn" onClick={handleSend} disabled={!inputVal.trim()}
                whileHover={inputVal.trim() ? { scale: 1.06 } : {}} whileTap={inputVal.trim() ? { scale: 0.94 } : {}}
                className="flex items-center justify-center rounded-full transition-all"
                style={{ width: 30, height: 30, background: inputVal.trim() ? "#fff" : "rgba(40,50,65,0.8)", cursor: inputVal.trim() ? "pointer" : "not-allowed" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4l8 8-8 8M4 12h16" stroke={inputVal.trim() ? "#000" : "#334155"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
