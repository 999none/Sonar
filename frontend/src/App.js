import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AppBuilder from "./components/AppBuilder";
import "./App.css";

function SonarApp() {
  const [view, setView] = useState("landing");
  const [initialPrompt, setInitialPrompt] = useState("");

  const handleStart = (prompt, model, mode) => {
    setInitialPrompt(prompt);
    setView("builder");
    // Pass model/mode as state
    window.__sonarInitModel = model || "gpt-4o";
    window.__sonarInitMode = mode || "E-1";
  };

  const handleReset = () => {
    setInitialPrompt("");
    setView("landing");
  };

  if (view === "builder") {
    return <AppBuilder initialPrompt={initialPrompt} onReset={handleReset} />;
  }

  return <LandingPage onStart={handleStart} />;
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
