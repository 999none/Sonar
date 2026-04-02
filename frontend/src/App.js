import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false); // Light mode (sky/water) by default
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sonar-tasks") || "null");
      if (saved && saved.length > 0) return saved;
      saveHistory(DEMO_TASKS);
      return DEMO_TASKS;
    } catch { return DEMO_TASKS; }
  });

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleStart = (prompt, model, mode) => {
    setInitialTask(null);
    setInitialPrompt(prompt);
    setView("builder");
    window.__sonarInitModel = model || "gpt-4o";
    window.__sonarInitMode = mode || "S-1";
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

  if (view === "auth") {
    return <AuthPage onBack={() => setView("landing")} onLogin={handleLogin} isDark={isDark} />;
  }

  if (view === "builder") {
    return (
      <AppBuilder
        initialPrompt={initialPrompt}
        initialTask={initialTask}
        onReset={handleReset}
        externalTasks={tasks}
        onTasksChange={setTasks}
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
      onLogin={handleLogin}
      onLogout={handleLogout}
      isDark={isDark}
      onToggleTheme={() => setIsDark(d => !d)}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<SonarApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
