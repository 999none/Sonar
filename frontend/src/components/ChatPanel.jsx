import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, RotateCcw } from "lucide-react";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          className="w-1.5 h-1.5 rounded-full bg-cyan-400"
        />
      ))}
    </div>
  );
}

function Message({ msg, isNew }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: isUser ? "rgba(6,182,212,0.2)" : "rgba(139,92,246,0.2)",
          border: `1px solid ${isUser ? "rgba(6,182,212,0.3)" : "rgba(139,92,246,0.3)"}`,
        }}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-cyan-400" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-purple-400" />
        )}
      </div>

      {/* Bubble */}
      <div
        className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
        style={{
          background: isUser
            ? "rgba(6,182,212,0.12)"
            : "rgba(15,23,42,0.8)",
          border: `1px solid ${isUser ? "rgba(6,182,212,0.2)" : "rgba(30,41,59,0.6)"}`,
          color: "#e2e8f0",
        }}
      >
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function ChatPanel({ messages, isTyping, onSendMessage, projectPrompt, onReset }) {
  const [inputVal, setInputVal] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    onSendMessage(inputVal.trim());
    setInputVal("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 flex-shrink-0 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(30,41,59,0.6)" }}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Chat</span>
        </div>
        <button
          data-testid="reset-btn"
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> New
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} isNew={i === messages.length - 1} />
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex gap-3 mb-4">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}>
              <Bot className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="px-4 py-2 rounded-2xl"
              style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(30,41,59,0.6)" }}>
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(30,41,59,0.6)" }}>
        <div
          className="flex items-end gap-2 rounded-xl px-3 py-2"
          style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(30,41,59,0.6)" }}
        >
          <textarea
            ref={inputRef}
            data-testid="chat-input"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask a follow-up..."
            rows={2}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none resize-none"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          />
          <button
            data-testid="chat-send-btn"
            onClick={handleSend}
            disabled={!inputVal.trim()}
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: inputVal.trim() ? "rgba(6,182,212,0.2)" : "rgba(30,41,59,0.4)",
              border: `1px solid ${inputVal.trim() ? "rgba(6,182,212,0.4)" : "rgba(30,41,59,0.6)"}`,
            }}
          >
            <Send className="w-3.5 h-3.5" style={{ color: inputVal.trim() ? "#06b6d4" : "#334155" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
