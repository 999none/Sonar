import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, ExternalLink, Code2, Eye, Terminal, Copy, Check, ExternalLink as OpenIcon } from "lucide-react";

const SONAR_ICON = "https://customer-assets.emergentagent.com/job_emergent-mock-2/artifacts/bocxbvjv_66af99839e55f1ee29f117ac.png";

// ── Matrix rain background ──
function MatrixBg() {
  const chars = "01アイウエオカキクケコサシスセソタチツテト";
  const columns = 28;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ opacity: 0.08 }}>
      {Array.from({ length: columns }, (_, col) => (
        <motion.div
          key={col}
          className="absolute top-0 flex flex-col"
          style={{
            left: `${(col / columns) * 100}%`,
            fontSize: "11px",
            fontFamily: "'JetBrains Mono', monospace",
            color: "#06b6d4",
            lineHeight: "1.6",
            width: "20px",
          }}
          animate={{ y: ["-100%", "110%"] }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: "linear",
          }}
        >
          {Array.from({ length: 20 }, (_, r) => (
            <span key={r}>{chars[Math.floor(Math.random() * chars.length)]}</span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

// ── Green pulse loading state (nouveau design) ──
function GreenPulseLoading({ projectName }) {
  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      {/* Background radial gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(16,185,129,0.08) 0%, transparent 70%)",
        }}
      />
      
      {/* Central green dot with glow */}
      <div className="relative z-10">
        <motion.div
          animate={{
            boxShadow: [
              "0 0 40px rgba(16,185,129,0.4), 0 0 80px rgba(16,185,129,0.2)",
              "0 0 60px rgba(16,185,129,0.6), 0 0 120px rgba(16,185,129,0.3)",
              "0 0 40px rgba(16,185,129,0.4), 0 0 80px rgba(16,185,129,0.2)",
            ],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full"
          style={{
            background: "radial-gradient(circle, #10b981 0%, #059669 100%)",
          }}
        />
        
        {/* Outer pulse ring */}
        <motion.div
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid #10b981",
          }}
        />
      </div>
      
      {/* Status text */}
      <motion.p
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          color: "rgba(16,185,129,0.8)",
          fontSize: "14px",
          fontFamily: "'Manrope',sans-serif",
          fontWeight: 500,
          marginTop: 40,
        }}
      >
        Building {projectName}...
      </motion.p>
    </div>
  );
}

// ── Spinning up loading state (ancien design - conservé pour compatibilité) ──
function SpinningUpState({ projectName }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <MatrixBg />
      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Sonar logo glowing */}
        <motion.div
          animate={{ boxShadow: ["0 0 20px rgba(6,182,212,0.3)", "0 0 50px rgba(6,182,212,0.6)", "0 0 20px rgba(6,182,212,0.3)"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(6,182,212,0.1)", border: "2px solid rgba(6,182,212,0.35)" }}
        >
          <img src={SONAR_ICON} alt="Sonar" width={42} height={42} style={{ objectFit: "contain" }} />
        </motion.div>

        <div className="text-center">
          <p style={{ color: "rgba(180,200,220,0.7)", fontSize: "13px", fontFamily: "'Manrope',sans-serif", marginBottom: 4 }}>
            One-click deploy with custom domains
          </p>
        </div>

        {/* Spinning up button */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
          style={{
            background: "rgba(6,182,212,0.15)",
            border: "1px solid rgba(6,182,212,0.35)",
            color: "#06b6d4",
            fontSize: "13px",
            fontFamily: "'Manrope',sans-serif",
            fontWeight: 500,
          }}
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-3.5 h-3.5 rounded-full border-2"
            style={{ borderColor: "rgba(6,182,212,0.3)", borderTopColor: "#06b6d4" }}
          />
          Spinning up the Preview
        </motion.div>
      </div>
    </div>
  );
}

// ─── Live app previews ───
function TodoPreview() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Design system architecture", done: false, priority: "High" },
    { id: 2, text: "Set up CI/CD pipeline", done: true, priority: "Medium" },
    { id: 3, text: "Write unit tests", done: false, priority: "High" },
    { id: 4, text: "Deploy to production", done: false, priority: "Low" },
  ]);
  const [input, setInput] = useState("");
  const toggle = (id) => setTodos(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const add = () => { if (!input.trim()) return; setTodos(t => [...t, { id: Date.now(), text: input, done: false, priority: "Medium" }]); setInput(""); };
  return (
    <div style={{ background: "#030712", minHeight: "100%", padding: "20px", fontFamily: "system-ui,sans-serif" }}>
      <h1 style={{ color: "#22d3ee", fontSize: "20px", fontWeight: 700, marginBottom: 4 }}>My Tasks</h1>
      <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: 16 }}>{todos.filter(t => !t.done).length} remaining</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&add()} placeholder="Add task..."
          style={{ flex:1, padding:"8px 12px", borderRadius:8, background:"#1f2937", color:"#f9fafb", border:"1px solid #374151", outline:"none", fontSize:13 }} />
        <button onClick={add} style={{ padding:"8px 14px", borderRadius:8, background:"#0e7490", color:"#fff", fontWeight:600, fontSize:12, border:"none", cursor:"pointer" }}>Add</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {todos.map(t => (
          <div key={t.id} onClick={()=>toggle(t.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:12, background:"#111827", cursor:"pointer", opacity:t.done?0.5:1 }}>
            <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${t.done?"#22d3ee":"#374151"}`, background:t.done?"#22d3ee":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {t.done && <span style={{color:"#000",fontSize:"9px"}}>✓</span>}
            </div>
            <span style={{ flex:1, fontSize:13, color:"#d1d5db", textDecoration:t.done?"line-through":"none" }}>{t.text}</span>
            <span style={{ fontSize:11, padding:"2px 8px", borderRadius:99, background:t.priority==="High"?"#450a0a":t.priority==="Medium"?"#422006":"#052e16", color:t.priority==="High"?"#f87171":t.priority==="Medium"?"#fb923c":"#4ade80" }}>{t.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardPreview() {
  const kpis = [{ label: "Revenue", value: "$378K", change: "+18%", up: true }, { label: "Users", value: "24.8K", change: "+5%", up: true }, { label: "Conv.", value: "3.24%", change: "-0.8%", up: false }, { label: "Session", value: "4m 32s", change: "+12%", up: true }];
  const bars = [42, 53, 48, 61, 79, 95];
  const months = ["Jan","Feb","Mar","Apr","May","Jun"];
  return (
    <div style={{ background: "#030712", minHeight: "100%", padding: "20px", fontFamily: "system-ui,sans-serif" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h1 style={{ color:"#f9fafb", fontSize:20, fontWeight:700 }}>Analytics</h1>
        <span style={{ fontSize:11, padding:"4px 10px", borderRadius:8, background:"#1f2937", color:"#6b7280" }}>Last 6 months</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ padding:"14px", borderRadius:12, background:"#111827" }}>
            <p style={{ fontSize:11, color:"#6b7280", marginBottom:4 }}>{k.label}</p>
            <p style={{ fontSize:20, fontWeight:700, color:"#f9fafb", marginBottom:2 }}>{k.value}</p>
            <span style={{ fontSize:11, color:k.up?"#4ade80":"#f87171" }}>{k.change}</span>
          </div>
        ))}
      </div>
      <div style={{ padding:"14px", borderRadius:12, background:"#111827" }}>
        <p style={{ fontSize:11, color:"#6b7280", marginBottom:12 }}>Monthly Revenue</p>
        <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:80 }}>
          {bars.map((b,i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <motion.div initial={{ height:0 }} animate={{ height:`${(b/100)*70}px` }} transition={{ delay:i*0.06, duration:0.5 }}
                style={{ width:"100%", background:"#0e7490", borderRadius:"3px 3px 0 0", minHeight:4 }} />
              <span style={{ fontSize:9, color:"#4b5563" }}>{months[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EcommercePreview() {
  const [cart, setCart] = useState([]);
  const products = [{ id:1, name:"Headphones", price:149, emoji:"🎧" },{ id:2, name:"Keyboard", price:229, emoji:"⌨️" },{ id:3, name:"Webcam", price:99, emoji:"📷" },{ id:4, name:"Desk Lamp", price:59, emoji:"💡" }];
  return (
    <div style={{ background:"#fff", minHeight:"100%", padding:"20px", fontFamily:"system-ui,sans-serif" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h1 style={{ color:"#111827", fontSize:20, fontWeight:700 }}>TechStore</h1>
        <div style={{ position:"relative" }}>
          <span style={{ fontSize:22 }}>🛒</span>
          {cart.length>0 && <span style={{ position:"absolute", top:-4, right:-4, width:16, height:16, borderRadius:"50%", background:"#2563eb", color:"#fff", fontSize:9, display:"flex", alignItems:"center", justifyContent:"center" }}>{cart.length}</span>}
        </div>
      </div>
      {cart.length>0 && <div style={{ padding:"8px 12px", borderRadius:10, marginBottom:12, background:"#eff6ff", display:"flex", justifyContent:"space-between" }}><span style={{ fontSize:12, color:"#1d4ed8" }}>{cart.length} items</span><span style={{ fontWeight:700, fontSize:12, color:"#1d4ed8" }}>${cart.reduce((s,p)=>s+p.price,0)}</span></div>}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {products.map(p => (
          <div key={p.id} style={{ padding:"14px", borderRadius:12, border:"1px solid #e5e7eb" }}>
            <div style={{ fontSize:32, textAlign:"center", marginBottom:8 }}>{p.emoji}</div>
            <p style={{ fontWeight:600, fontSize:13, color:"#111827", marginBottom:8 }}>{p.name}</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontWeight:700, fontSize:13, color:"#111827" }}>${p.price}</span>
              <button onClick={()=>setCart(c=>[...c,p])} style={{ padding:"4px 10px", borderRadius:8, background:"#2563eb", color:"#fff", fontSize:11, border:"none", cursor:"pointer" }}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PREVIEWS = { todo: TodoPreview, dashboard: DashboardPreview, ecommerce: EcommercePreview };

// ── Code viewer (simplified) ──
function CodeView({ code, terminalLogs }) {
  const [tab, setTab] = useState("code");
  return (
    <div className="flex flex-col h-full" style={{ background: "#0d1117" }}>
      {/* Tabs */}
      <div className="flex items-center gap-0 flex-shrink-0" style={{ background: "#010409", borderBottom: "1px solid #21262d" }}>
        {[{ id: "code", Icon: Code2, label: "App.tsx" }, { id: "terminal", Icon: Terminal, label: "Terminal" }].map(({ id, Icon, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs transition-colors border-b-2"
            style={{ background: tab===id?"#0d1117":"transparent", color: tab===id?"#e6edf3":"#848d97", borderBottomColor: tab===id?"#58a6ff":"transparent" }}>
            <Icon style={{ width: 11, height: 11 }} /> {label}
          </button>
        ))}
      </div>
      {tab === "code" ? (
        <div className="flex-1 overflow-auto" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <tbody>
              {(code || "// waiting for generation...").split("\n").map((line, i) => (
                <tr key={i} style={{ background: "transparent" }}>
                  <td style={{ padding:"1px 16px", color:"#3d444d", fontSize:11, textAlign:"right", userSelect:"none", width:40, verticalAlign:"top" }}>{i+1}</td>
                  <td style={{ padding:"1px 16px 1px 0", color:"#e6edf3", fontSize:11, whiteSpace:"pre" }}>{line || " "}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
          {terminalLogs.length === 0
            ? <p style={{ color:"#3d444d", fontSize:12 }}>No output yet.</p>
            : terminalLogs.map((line, i) => (
                <div key={i} style={{ fontSize:11, marginBottom:2, color: line.startsWith("✓")?"#4ade80":line.startsWith("$")?"#60a5fa":"#6b7280" }}>{line}</div>
              ))
          }
        </div>
      )}
    </div>
  );
}

// ── Coder.com codespace modal ──
function CoderModal({ onClose, projectName, isDark = false }) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPwd, setCopiedPwd] = useState(false);
  const dk = isDark;

  const url = `https://coder.sonar.sh/workspaces/${projectName || "my-app"}`;
  const password = "snr-" + Math.random().toString(36).slice(2, 10).toUpperCase();

  const copy = (text, setCopied) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{
        background: dk ? "rgba(0,0,0,0.75)" : "rgba(100,140,210,0.3)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 16 }}
        transition={{ duration: 0.2, type: "spring", bounce: 0.25 }}
        onClick={e => e.stopPropagation()}
        className="w-full mx-6 rounded-2xl overflow-hidden"
        style={{
          maxWidth: "420px",
          background: dk ? "#0d1117" : "linear-gradient(160deg, rgba(248,252,255,0.99) 0%, rgba(255,255,255,1) 100%)",
          border: dk ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(80,140,220,0.18)",
          boxShadow: dk ? "0 32px 64px rgba(0,0,0,0.7)" : "0 32px 64px rgba(20,60,140,0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: dk ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(80,140,220,0.12)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}>
              <Code2 style={{ width: 15, height: 15, color: "#06b6d4" }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: dk ? "#fff" : "#0a1a3e" }}>Codespace</p>
              <p style={{ fontSize: "11px", color: dk ? "rgba(100,116,139,0.7)" : "rgba(40,70,130,0.5)" }}>Powered by coder.com</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
            style={{ color: dk ? "#64748b" : "rgba(40,70,130,0.4)" }}
            onMouseEnter={e => e.currentTarget.style.background = dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p style={{ fontSize: "13px", color: dk ? "rgba(180,195,215,0.7)" : "rgba(30,60,120,0.6)", lineHeight: 1.6 }}>
            Your codespace is ready. Open the link below in your browser and enter the password to access the full VS Code environment.
          </p>

          {/* URL */}
          <div>
            <p style={{ fontSize: "11px", color: dk ? "rgba(100,116,139,0.8)" : "rgba(40,70,130,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Workspace URL</p>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{
                background: dk ? "#060c14" : "rgba(0,0,0,0.03)",
                border: dk ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(80,140,220,0.12)",
              }}>
              <span className="flex-1 text-xs truncate" style={{ color: "#06b6d4", fontFamily: "'JetBrains Mono',monospace" }}>
                {url}
              </span>
              <button onClick={() => copy(url, setCopiedUrl)}
                className="flex-shrink-0 p-1 rounded transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {copiedUrl
                  ? <Check style={{ width: 12, height: 12, color: "#4ade80" }} />
                  : <Copy style={{ width: 12, height: 12, color: dk ? "#64748b" : "rgba(40,70,130,0.4)" }} />}
              </button>
            </div>
          </div>

          {/* Password */}
          <div>
            <p style={{ fontSize: "11px", color: dk ? "rgba(100,116,139,0.8)" : "rgba(40,70,130,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</p>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{
                background: dk ? "#060c14" : "rgba(0,0,0,0.03)",
                border: dk ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(80,140,220,0.12)",
              }}>
              <span className="flex-1 text-xs tracking-widest" style={{ color: dk ? "#e2e8f0" : "#0a1a3e", fontFamily: "'JetBrains Mono',monospace" }}>
                {password}
              </span>
              <button onClick={() => copy(password, setCopiedPwd)}
                className="flex-shrink-0 p-1 rounded transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {copiedPwd
                  ? <Check style={{ width: 12, height: 12, color: "#4ade80" }} />
                  : <Copy style={{ width: 12, height: 12, color: dk ? "#64748b" : "rgba(40,70,130,0.4)" }} />}
              </button>
            </div>
          </div>

          <p style={{ fontSize: "11px", color: dk ? "rgba(100,116,139,0.5)" : "rgba(40,70,130,0.35)", lineHeight: 1.5 }}>
            The codespace integration with coder.com will be set up later. This is a preview of the future experience.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <a href="https://coder.com" target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #0ea5e9)",
              color: "#000",
              boxShadow: "0 0 18px rgba(6,182,212,0.25)",
              textDecoration: "none",
            }}>
            Open Codespace <ExternalLink style={{ width: 13, height: 13 }} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function EmergentPreview({ projectType, isGenerating, previewReady, activeTab, onTabChange, code, terminalLogs, projectName, isDark = false, onClose, openCoderExternal, onCoderExternalClosed }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCoderModal, setShowCoderModal] = useState(false);
  const PreviewComp = PREVIEWS[projectType];
  const dk = isDark;

  // Open coder modal from external trigger (TopBar Code button)
  useEffect(() => {
    if (openCoderExternal) {
      setShowCoderModal(true);
    }
  }, [openCoderExternal]);

  const handleCloseCoder = () => {
    setShowCoderModal(false);
    if (onCoderExternalClosed) onCoderExternalClosed();
  };

  // Open coder modal when "Code" tab is clicked
  const handleTabChange = (id) => {
    if (id === "code") {
      setShowCoderModal(true);
    } else {
      onTabChange(id);
    }
  };

  return (
    <div className="flex flex-col h-full relative" style={{ background: dk ? "#060c14" : "rgba(215,235,252,0.5)", backdropFilter: dk ? "none" : "blur(8px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
        style={{
          background: dk ? "#06090f" : "rgba(255,255,255,0.5)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: dk ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.5)",
          boxShadow: dk ? "none" : "0 2px 12px rgba(20,80,160,0.05), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}>
        <div className="flex items-center gap-1">
          {[
            { id: "preview", Icon: Eye, label: "App Preview" },
            { id: "code", Icon: Code2, label: "Code" },
          ].map(({ id, Icon, label }) => (
            <button key={id} onClick={() => handleTabChange(id)}
              data-testid={`tab-${id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
              style={{
                color: activeTab===id ? (dk ? "#e2e8f0" : "#0a1a3e") : (dk ? "rgba(100,116,139,0.7)" : "rgba(40,70,130,0.45)"),
                background: activeTab===id ? (dk ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.6)") : "transparent",
                border: activeTab===id ? (dk ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.5)") : "1px solid transparent",
                boxShadow: activeTab===id && !dk ? "0 1px 4px rgba(20,80,160,0.06)" : "none",
              }}>
              <Icon style={{ width: 11, height: 11 }} /> {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button data-testid="refresh-preview" onClick={() => setRefreshKey(k=>k+1)}
            className="p-1.5 rounded transition-colors" style={{ color: dk ? "rgba(100,116,139,0.5)" : "rgba(40,70,130,0.4)" }}>
            <RefreshCw style={{ width: 12, height: 12 }} />
          </button>
          <button data-testid="open-external"
            className="p-1.5 rounded transition-colors" style={{ color: dk ? "rgba(100,116,139,0.5)" : "rgba(40,70,130,0.4)" }}>
            <ExternalLink style={{ width: 12, height: 12 }} />
          </button>
          {onClose && (
            <button
              data-testid="close-preview"
              onClick={onClose}
              className="p-1.5 rounded-lg transition-all ml-0.5"
              style={{
                color: dk ? "rgba(100,116,139,0.5)" : "rgba(40,70,130,0.4)",
                background: "transparent",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = dk ? "rgba(248,113,113,0.12)" : "rgba(248,113,113,0.1)";
                e.currentTarget.style.color = "#f87171";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = dk ? "rgba(100,116,139,0.5)" : "rgba(40,70,130,0.4)";
              }}
            >
              <X style={{ width: 13, height: 13 }} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {isGenerating || !previewReady ? (
            <motion.div key="spinning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <GreenPulseLoading projectName={projectName} />
            </motion.div>
          ) : PreviewComp ? (
            <motion.div key={`${projectType}-${refreshKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="h-full overflow-auto">
              <PreviewComp key={refreshKey} />
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center">
              <MatrixBg />
              <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(6,182,212,0.08)", border:"1px solid rgba(6,182,212,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <img src={SONAR_ICON} alt="" width={32} height={32} style={{ objectFit:"contain", opacity:0.5 }} />
                </div>
                <p style={{ fontSize:13, color:"rgba(100,120,150,0.6)", fontFamily:"'Manrope',sans-serif" }}>Start building to see the preview</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coder Modal */}
        <AnimatePresence>
          {showCoderModal && (
            <CoderModal onClose={handleCloseCoder} projectName={projectName} isDark={isDark} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
