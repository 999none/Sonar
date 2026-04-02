import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "./TopBar";
import ChatPanel from "./ChatPanel";
import EmergentPreview from "./EmergentPreview";
import CostPreviewModal from "./CostPreviewModal";
import ShareModal from "./ShareModal";
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

function loadHistory() {
  try { return JSON.parse(localStorage.getItem("sonar-tasks") || "[]"); } catch { return []; }
}
function saveHistory(tasks) {
  try { localStorage.setItem("sonar-tasks", JSON.stringify(tasks.slice(0, 20))); } catch {}
}

export default function AppBuilder({ initialPrompt, initialTask, onReset, externalTasks, onTasksChange }) {
  const [selectedModel] = useState(window.__sonarInitModel || "gpt-4o");
  const [mode] = useState(window.__sonarInitMode || "E-1");
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [projectType, setProjectType] = useState(null);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [showCostModal, setShowCostModal] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState("");
  const [projectName, setProjectName] = useState("untitled-app");
  const [activeTab, setActiveTab] = useState("preview");
  const [previewReady, setPreviewReady] = useState(false);
  const [showPreviewPanel, setShowPreviewPanel] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [tasks, setTasks] = useState(externalTasks || loadHistory());

  const timerRef = useRef(null);
  const hasStarted = useRef(false);

  const addMsg = (msg) => setMessages(prev => [...prev, msg]);

  const pushTask = (id, type, name, prompt) => {
    const newTask = { id, projectType: type, projectName: name, prompt, timestamp: Date.now() };
    setTasks(prev => {
      const updated = [newTask, ...prev.filter(t => t.id !== id)];
      saveHistory(updated);
      onTasksChange?.(updated);
      return updated;
    });
    setActiveTaskId(id);
  };

  const startGeneration = useCallback((prompt) => {
    const type = detectProjectType(prompt);
    const name = getProjectName(type);
    const id = `task-${Date.now()}`;

    setProjectType(type);
    setProjectName(name);
    setIsGenerating(true);
    setIsTyping(false);
    setCurrentCode("");
    setTerminalLogs([]);
    setPreviewReady(false);
    setShowPreviewPanel(false);
    setMessages([]);
    setActiveTab("preview");
    pushTask(id, type, name, prompt);

    if (timerRef.current) clearInterval(timerRef.current);
    runFlow(type, name, prompt);
  }, []);

  const runFlow = async (type, name, prompt) => {
    const responses = CHAT_RESPONSES[type] || CHAT_RESPONSES.todo;
    addMsg({ role: "user", content: prompt });
    await delay(700);
    setIsTyping(true);
    await delay(1000);
    setIsTyping(false);
    addMsg({ role: "assistant", content: responses[0].content });
    await delay(500);

    for (let i = 0; i < AGENT_STEPS.length; i++) {
      const step = AGENT_STEPS[i];
      const meta = AGENT_META[step.id];
      addMsg({ role: "agent", agentId: step.id, label: meta.label, status: "working", steps: [] });

      // Preview slides in when the Coder starts writing files
      if (step.id === "coder") {
        setShowPreviewPanel(true);
      }

      await delay(400);
      for (let j = 0; j < meta.steps.length; j++) {
        await delay(500);
        setMessages(prev => prev.map(m =>
          m.role === "agent" && m.agentId === step.id ? { ...m, steps: [...m.steps, meta.steps[j]] } : m
        ));
      }
      await delay(400);
      setMessages(prev => prev.map(m =>
        m.role === "agent" && m.agentId === step.id ? { ...m, status: "done" } : m
      ));
      if (i === 1 && responses[1]) {
        await delay(600);
        setIsTyping(true);
        await delay(900);
        setIsTyping(false);
        addMsg({ role: "assistant", content: responses[1].content });
      }
    }

    setCurrentCode(CODE_BY_PROJECT[type] || CODE_BY_PROJECT.todo);
    await delay(400);
    for (let i = 0; i < MOCK_LOGS.length; i++) {
      await delay(110);
      setTerminalLogs(prev => [...prev, MOCK_LOGS[i]]);
    }
    setPreviewReady(true);
    setActiveTab("preview");
    await delay(500);
    setIsTyping(true);
    await delay(1000);
    setIsTyping(false);
    addMsg({ role: "assistant", content: responses[responses.length - 1].content });
    if (timerRef.current) clearInterval(timerRef.current);
    setIsGenerating(false);
  };

  useEffect(() => {
    // Load existing task from home history
    if (initialTask) {
      handleSelectTask(initialTask);
      return;
    }
    // New generation from landing page prompt
    if (initialPrompt && !hasStarted.current) {
      hasStarted.current = true;
      setPendingPrompt(initialPrompt);
      setShowCostModal(true);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [initialPrompt, initialTask]);

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
    setTerminalLogs(prev => [...prev,
      "$ sonar deploy --env=production",
      "Packaging artifacts...",
      "✓ Deployed to https://my-app.sonar.sh",
    ]);
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    hasStarted.current = false;
    onReset();
  };

  const handleNewTask = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    hasStarted.current = false;
    onReset();
  };

  const handleSelectTask = (task) => {
    setActiveTaskId(task.id);
    setProjectName(task.projectName);
    setProjectType(task.projectType);
    setPreviewReady(true);
    setShowPreviewPanel(true);
    setActiveTab("preview");
    setMessages([
      { role: "user", content: task.prompt },
      { role: "assistant", content: `Here's your ${task.projectName} — loaded from history.` },
    ]);
    setIsGenerating(false);
    setCurrentCode(CODE_BY_PROJECT[task.projectType] || "");
  };

  const handleCloseTask = (taskId) => {
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== taskId);
      saveHistory(updated);
      onTasksChange?.(updated);
      if (taskId === activeTaskId) {
        if (updated.length > 0) handleSelectTask(updated[0]);
        else handleReset();
      }
      return updated;
    });
  };

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "100vh", background: "#0a0a0a" }}>
      <TopBar
        isGenerating={isGenerating}
        onDeploy={handleDeploy}
        onShare={() => setShowShare(true)}
        onHome={handleReset}
        projectName={projectName}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Chat — full width until coder starts, then 50% */}
        <div
          className="flex flex-col overflow-hidden flex-shrink-0"
          style={{
            width: showPreviewPanel ? "50%" : "100%",
            transition: "width 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
            borderRight: showPreviewPanel ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}
        >
          <ChatPanel
            messages={messages}
            isTyping={isTyping}
            isGenerating={isGenerating}
            onSendMessage={handleSendMessage}
            onReset={handleReset}
          />
        </div>

        {/* Preview — slides in when coder starts */}
        <AnimatePresence>
          {showPreviewPanel && (
            <motion.div
              key="preview-panel"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 32 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CostPreviewModal
        isOpen={showCostModal}
        onClose={() => { setShowCostModal(false); handleReset(); }}
        onConfirm={handleConfirmGenerate}
        prompt={pendingPrompt}
        selectedModel={selectedModel}
        mode={mode}
      />

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        projectName={projectName}
      />
    </div>
  );
}
