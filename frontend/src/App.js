import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LandingPage from "./components/LandingPage";
import AppBuilder from "./components/AppBuilder";
import AuthPage from "./components/AuthPage";
import "./App.css";

const DEMO_TASKS = [
  { id: "demo-1", projectType: "todo", projectName: "task-manager", prompt: "Build a beautiful todo app with priority levels, due dates, and categories", timestamp: Date.now() - 420000 },
  { id: "demo-2", projectType: "dashboard", projectName: "analytics-dash", prompt: "Create a real-time analytics dashboard with interactive charts and KPI cards", timestamp: Date.now() - 2700000 },
  { id: "demo-3", projectType: "ecommerce", projectName: "tech-store", prompt: "Build a modern e-commerce store with product grid, cart, and checkout flow", timestamp: Date.now() - 7200000 },
];

function saveHistory(tasks) {
  try { localStorage.setItem("sonar-tasks", JSON.stringify(tasks.slice(0, 20))); } catch {}
}

function SonarApp() {
  const [view, setView] = useState("landing");
  const [initialPrompt, setInitialPrompt] = useState("");
  const [initialTask, setInitialTask] = useState(null);
  const { user, logout, loading } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem("sonar-theme") === "dark"; } catch { return false; }
  });

  const handleToggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      try { localStorage.setItem("sonar-theme", next ? "dark" : "light"); } catch {}
      return next;
    });
  };
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sonar-tasks") || "null");
      if (saved && saved.length > 0) return saved;
      saveHistory(DEMO_TASKS);
      return DEMO_TASKS;
    } catch { return DEMO_TASKS; }
  });

  const handleStart = (prompt, model, mode, attachedFiles = []) => {
    setInitialTask(null);
    setInitialPrompt(prompt);
    setView("builder");
    window.__sonarInitModel = model || "gpt-4o";
    window.__sonarInitMode = mode || "S-1";
    window.__sonarInitFiles = attachedFiles || [];
  };

  const handleSelectTaskFromHome = (task) => {
    setInitialPrompt("");
    setInitialTask(task);
    setView("builder");
  };

  const handleCloseTaskFromHome = (taskId) => {
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
    saveHistory(updated);
  };

  const handleReset = () => {
    setInitialPrompt("");
    setInitialTask(null);
    setView("landing");
  };

  // Show loading screen while restoring auth session
  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isDark ? "#060c14" : "linear-gradient(135deg, #7cc0e6 0%, #a8d4ef 100%)",
      }}>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 900,
          fontSize: "2rem",
          letterSpacing: "-0.05em",
          color: isDark ? "#fff" : "#0a2a5e",
          opacity: 0.6,
        }}>
          sonar
        </span>
      </div>
    );
  }

  if (view === "auth") {
    return <AuthPage onBack={() => setView("landing")} isDark={isDark} />;
  }

  if (view === "builder") {
    return (
      <AppBuilder
        initialPrompt={initialPrompt}
        initialTask={initialTask}
        onReset={handleReset}
        externalTasks={tasks}
        onTasksChange={setTasks}
        isDark={isDark}
        user={user}
      />
    );
  }

  return (
    <LandingPage
      onStart={handleStart}
      tasks={tasks}
      onSelectTask={handleSelectTaskFromHome}
      onCloseTask={handleCloseTaskFromHome}
      onShowAuth={() => setView("auth")}
      user={user}
      onLogout={logout}
      isDark={isDark}
      onToggleTheme={handleToggleTheme}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<SonarApp />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
