import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, GitFork, Square, ChevronDown, Github, Zap } from "lucide-react";

const SONAR_ICON = "https://customer-assets.emergentagent.com/job_emergent-mock-2/artifacts/0t6vl8pn_image.png";

// Timestamp formatter
function formatTime() {
  const now = new Date();
  return now.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

// Sonar avatar icon
function SonarAvatar({ size = 22 }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0 rounded-full overflow-hidden"
      style={{
        width: size, height: size,
        background: "rgba(200,100,70,0.12)",
        border: "1px solid rgba(200,100,70,0.25)",
      }}
    >
      <img src={SONAR_ICON} alt="Sonar" width={size - 6} height={size - 6} style={{ objectFit: "contain" }} />
    </div>
  );
}

// User message — teal/green bubble
function UserMessage({ content, isNew }) {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-5"
    >
      <div
        className="text-sm leading-relaxed px-4 py-3 rounded-2xl"
        style={{
          background: "rgba(22, 101, 78, 0.55)",
          border: "1px solid rgba(34,197,94,0.15)",
          color: "#e2f5ec",
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 400,
          lineHeight: 1.65,
        }}
      >
        {content}
      </div>
      <p
        className="text-right mt-1.5 pr-1"
        style={{ fontSize: "11px", color: "rgba(100,120,100,0.6)", fontFamily: "'Manrope', sans-serif" }}
      >
        {formatTime()}
      </p>
    </motion.div>
  );
}

// AI message — plain text with icon
function AIMessage({ content, isNew }) {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 mb-5"
    >
      <div className="mt-0.5 flex-shrink-0">
        <SonarAvatar size={24} />
      </div>
      <p
        className="text-sm leading-relaxed flex-1"
        style={{
          color: "rgba(220,228,240,0.88)",
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 400,
          lineHeight: 1.7,
        }}
      >
        {content}
      </p>
    </motion.div>
  );
}

// Processing indicator
function ProcessingRow({ label = "Processing next step" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 mb-4"
    >
      <div className="flex-shrink-0">
        <SonarAvatar size={24} />
      </div>
      <div className="flex items-center gap-1.5">
        <span style={{ fontSize: "13px", color: "rgba(150,160,180,0.7)", fontFamily: "'Manrope', sans-serif" }}>
          {label}
        </span>
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            style={{ fontSize: "13px", color: "rgba(150,160,180,0.6)" }}
          >
            .
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function ChatPanel({ messages, isTyping, isGenerating, onSendMessage, onReset }) {
  const [inputVal, setInputVal] = useState("");
  const [ultraOn, setUltraOn] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 120);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!inputVal.trim() || isGenerating) return;
    onSendMessage(inputVal.trim());
    setInputVal("");
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#0a0a0a" }}>

      {/* Messages area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto relative"
        style={{ padding: "24px 20px 12px" }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) =>
            msg.role === "user"
              ? <UserMessage key={i} content={msg.content} isNew={i === messages.length - 1} />
              : <AIMessage key={i} content={msg.content} isNew={i === messages.length - 1} />
          )}
        </AnimatePresence>

        {isTyping && <ProcessingRow label="Processing next step" />}

        <div ref={bottomRef} />

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              data-testid="scroll-to-bottom"
              className="sticky bottom-4 mx-auto flex items-center justify-center rounded-full transition-all"
              style={{
                width: "34px", height: "34px",
                background: "rgba(30,35,45,0.95)",
                border: "1px solid rgba(60,70,90,0.7)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                display: "flex",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <ChevronDown className="w-4 h-4" style={{ color: "#94a3b8" }} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "#0a0a0a" }}
      >
        {isGenerating ? (
          <>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"
            />
            <span style={{ fontSize: "12px", color: "#4ade80", fontFamily: "'Manrope', sans-serif" }}>
              Agent is running...
            </span>
          </>
        ) : messages.length > 0 ? (
          <>
            <div className="w-2 h-2 rounded-full bg-slate-600 flex-shrink-0" />
            <span style={{ fontSize: "12px", color: "rgba(100,116,139,0.8)", fontFamily: "'Manrope', sans-serif" }}>
              Agent ready
            </span>
          </>
        ) : null}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-3 pb-2" style={{ background: "#0a0a0a" }}>
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "#111318",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <textarea
            data-testid="chat-input"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Message Sonar"
            rows={2}
            className="w-full bg-transparent outline-none resize-none"
            style={{
              padding: "12px 14px 6px",
              color: "#e2e8f0",
              fontSize: "13px",
              fontFamily: "'Manrope', sans-serif",
              caretColor: "#06b6d4",
              lineHeight: 1.6,
            }}
          />

          {/* Bottom action row */}
          <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
            <div className="flex items-center gap-1">
              {/* Mic */}
              <button
                data-testid="chat-mic-btn"
                className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                style={{ color: "rgba(100,116,139,0.7)" }}
                onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(100,116,139,0.7)"}
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              {/* Save to GitHub */}
              <button
                data-testid="chat-github-btn"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  color: "rgba(100,116,139,0.8)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#e2e8f0"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(100,116,139,0.8)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              >
                <Github className="w-3 h-3" /> Save
              </button>

              {/* Fork */}
              <button
                data-testid="chat-fork-btn"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  color: "rgba(100,116,139,0.8)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#e2e8f0"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(100,116,139,0.8)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              >
                <GitFork className="w-3 h-3" /> Fork
              </button>

              {/* Ultra toggle */}
              <button
                data-testid="chat-ultra-btn"
                onClick={() => setUltraOn(o => !o)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  color: ultraOn ? "#f59e0b" : "rgba(100,116,139,0.8)",
                  background: ultraOn ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${ultraOn ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <Zap className="w-3 h-3" /> Ultra
                {/* Toggle pill */}
                <div
                  className="relative inline-flex items-center ml-0.5"
                  style={{
                    width: "22px", height: "12px",
                    borderRadius: "6px",
                    background: ultraOn ? "rgba(245,158,11,0.6)" : "rgba(60,70,90,0.6)",
                    transition: "background 0.2s",
                  }}
                >
                  <motion.div
                    animate={{ x: ultraOn ? 11 : 1 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      width: "10px", height: "10px",
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                    }}
                  />
                </div>
              </button>
            </div>

            {/* Stop / Send button */}
            {isGenerating ? (
              <motion.button
                data-testid="chat-stop-btn"
                onClick={onReset}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="flex items-center justify-center rounded-full transition-all"
                style={{
                  width: "30px", height: "30px",
                  background: "#fff",
                  boxShadow: "0 0 12px rgba(255,255,255,0.15)",
                }}
              >
                <Square className="w-3 h-3" style={{ color: "#000", fill: "#000" }} />
              </motion.button>
            ) : (
              <motion.button
                data-testid="chat-send-btn"
                onClick={handleSend}
                disabled={!inputVal.trim()}
                whileHover={inputVal.trim() ? { scale: 1.06 } : {}}
                whileTap={inputVal.trim() ? { scale: 0.94 } : {}}
                className="flex items-center justify-center rounded-full transition-all"
                style={{
                  width: "30px", height: "30px",
                  background: inputVal.trim() ? "#fff" : "rgba(40,50,65,0.8)",
                  cursor: inputVal.trim() ? "pointer" : "not-allowed",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
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
