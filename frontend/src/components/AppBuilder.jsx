import { useState, useEffect, useRef, useCallback } from "react";
import TopBar from "./TopBar";
import ChatPanel from "./ChatPanel";
import CodeEditor from "./CodeEditor";
import EmergentPreview from "./EmergentPreview";
import CostPreviewModal from "./CostPreviewModal";
import { AGENT_STEPS, CODE_BY_PROJECT, CHAT_RESPONSES, MOCK_LOGS } from "../data/mockData";

const AGENT_META = {
  planner:   { label: "Planner",   steps: ["Parsing requirements...", "Identifying core features", "Architecture plan ready"] },
  architect: { label: "Architect", steps: ["Designing component tree", "Setting up data models", "API contracts defined"] },
  coder:     { label: "Coder",     steps: ["Writing App.tsx", "Implementing state management", "Styling components"] },
  debugger:  { label: "Debugger",  steps: ["Running test suite", "0 errors found", "Performance optimized"] },
};

function detectProjectType(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes("todo") || p.includes("task") || p.includes("list")) return "todo";
  if (p.includes("dashboard") || p.includes("analytics") || p.includes("chart")) return "dashboard";
  if (p.includes("shop") || p.includes("store") || p.includes("commerce") || p.includes("product")) return "ecommerce";
  const types = ["todo", "dashboard", "ecommerce"];
  return types[Math.floor(Date.now() / 10000) % 3];
}

function getProjectName(type) {
  return { todo: "task-manager", dashboard: "analytics-dash", ecommerce: "tech-store" }[type] || "my-app";
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

export default function AppBuilder({ initialPrompt, onReset }) {
  const [selectedModel, setSelectedModel] = useState(window.__sonarInitModel || "gpt-4o");
  const [mode, setMode] = useState(window.__sonarInitMode || "E-1");
  const [credits, setCredits] = useState(1240);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [projectType, setProjectType] = useState(null);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState("$0.00");
  const [showCostModal, setShowCostModal] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState("");
  const [projectName, setProjectName] = useState("untitled-app");
  const [activeTab, setActiveTab] = useState("preview"); // "preview" | "code"
  const [previewReady, setPreviewReady] = useState(false);

  const timerRef = useRef(null);
  const hasStarted = useRef(false);

  const addMsg = (msg) => setMessages(prev => [...prev, msg]);

  const startGeneration = useCallback((prompt) => {
    const type = detectProjectType(prompt);
    setProjectType(type);
    setProjectName(getProjectName(type));
    setIsGenerating(true);
    setIsTyping(false);
    setCurrentCode("");
    setTerminalLogs([]);
    setTimeElapsed(0);
    setEstimatedCost("$0.00");
    setPreviewReady(false);
    setMessages([]);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeElapsed(t => {
        const next = t + 1;
        setEstimatedCost(`$${(next * 0.002).toFixed(3)}`);
        return next;
      });
    }, 1000);

    runFlow(type, prompt);
  }, []);

  const runFlow = async (type, prompt) => {
    const responses = CHAT_RESPONSES[type] || CHAT_RESPONSES.todo;

    // User message
    addMsg({ role: "user", content: prompt });
    await delay(700);

    // Welcome assistant message
    setIsTyping(true);
    await delay(1000);
    setIsTyping(false);
    addMsg({ role: "assistant", content: responses[0].content });
    await delay(500);

    // Agent steps inline in chat
    for (let i = 0; i < AGENT_STEPS.length; i++) {
      const step = AGENT_STEPS[i];
      const meta = AGENT_META[step.id];

      // Agent "working" system message
      addMsg({ role: "agent", agentId: step.id, label: meta.label, status: "working", steps: [] });
      await delay(400);

      // Feed steps into the agent message progressively
      for (let j = 0; j < meta.steps.length; j++) {
        await delay(500);
        setMessages(prev => prev.map(m =>
          m.role === "agent" && m.agentId === step.id
            ? { ...m, steps: [...m.steps, meta.steps[j]] }
            : m
        ));
      }

      await delay(400);
      // Mark done
      setMessages(prev => prev.map(m =>
        m.role === "agent" && m.agentId === step.id
          ? { ...m, status: "done" }
          : m
      ));

      // Assistant response after architect
      if (i === 1 && responses[1]) {
        await delay(600);
        setIsTyping(true);
        await delay(900);
        setIsTyping(false);
        addMsg({ role: "assistant", content: responses[1].content });
      }
    }

    // Code generation
    setCurrentCode(CODE_BY_PROJECT[type] || CODE_BY_PROJECT.todo);

    // Terminal logs
    await delay(400);
    for (let i = 0; i < MOCK_LOGS.length; i++) {
      await delay(110);
      setTerminalLogs(prev => [...prev, MOCK_LOGS[i]]);
    }

    // Preview ready
    setPreviewReady(true);
    setActiveTab("preview");

    // Final message
    await delay(500);
    setIsTyping(true);
    await delay(1000);
    setIsTyping(false);
    addMsg({ role: "assistant", content: responses[responses.length - 1].content });

    if (timerRef.current) clearInterval(timerRef.current);
    setIsGenerating(false);
    setCredits(c => c - Math.floor(Math.random() * 15 + 5));
  };

  useEffect(() => {
    if (initialPrompt && !hasStarted.current) {
      hasStarted.current = true;
      setPendingPrompt(initialPrompt);
      setShowCostModal(true);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [initialPrompt]);

  const handleConfirmGenerate = () => {
    setShowCostModal(false);
    startGeneration(pendingPrompt);
  };

  const handleSendMessage = (msg) => {
    if (isGenerating) return;
    addMsg({ role: "user", content: msg });
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMsg({ role: "assistant", content: "Got it! Making those changes now..." });
    }, 1500);
  };

  const handleDeploy = () => {
    setTerminalLogs(prev => [
      ...prev,
      "$ sonar deploy --env=production",
      "Packaging artifacts...",
      "Uploading to edge network...",
      "✓ Deployed to https://my-app.sonar.sh",
      "✓ Live in 1.2s",
    ]);
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    hasStarted.current = false;
    onReset();
  };

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "100vh", background: "#0a0a0a" }}>
      <TopBar
        isGenerating={isGenerating}
        onDeploy={handleDeploy}
        projectName={projectName}
      />

      {/* 2-panel layout like Emergent */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Full chat */}
        <div
          className="flex flex-col overflow-hidden flex-shrink-0"
          style={{ width: "50%", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          <ChatPanel
            messages={messages}
            isTyping={isTyping}
            isGenerating={isGenerating}
            onSendMessage={handleSendMessage}
            onReset={handleReset}
          />
        </div>

        {/* RIGHT — Preview / Code tabs */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <EmergentPreview
            projectType={projectType}
            isGenerating={isGenerating}
            previewReady={previewReady}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            code={currentCode}
            terminalLogs={terminalLogs}
            projectName={projectName}
          />
        </div>
      </div>

      <CostPreviewModal
        isOpen={showCostModal}
        onClose={() => { setShowCostModal(false); handleReset(); }}
        onConfirm={handleConfirmGenerate}
        prompt={pendingPrompt}
        selectedModel={selectedModel}
        mode={mode}
      />
    </div>
  );
}
