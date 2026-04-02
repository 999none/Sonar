import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Clock, Zap, X } from "lucide-react";

function relativeTime(ts) {
  if (!ts) return "";
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `${m}m`;
  if (m < 1440) return `${Math.floor(m / 60)}h`;
  return `${Math.floor(m / 1440)}j`;
}

const TYPE_COLORS = {
  todo: "#10b981",
  dashboard: "#06b6d4",
  ecommerce: "#f59e0b",
};

const TYPE_LABELS = {
  todo: "Todo",
  dashboard: "Dashboard",
  ecommerce: "Store",
};

function TaskItem({ task, isActive, isRunning, onSelect, onClose }) {
  const [hovered, setHovered] = useState(false);
  const color = TYPE_COLORS[task.projectType] || "#64748b";
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.16 }}
      data-testid={`sidebar-task-${task.id}`}
      onClick={() => onSelect(task)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2 px-2 py-1.5 mx-2 rounded-lg cursor-pointer relative"
      style={{
        background: isActive ? "rgba(255,255,255,0.06)" : hovered ? "rgba(255,255,255,0.035)" : "transparent",
        marginBottom: 1,
        transition: "background 0.15s",
      }}
    >
      {/* Color bar */}
      <div style={{
        width: 3, height: 30, borderRadius: 2, flexShrink: 0,
        background: isActive ? color : "rgba(100,116,139,0.18)",
        transition: "background 0.2s",
      }} />

      <div className="flex-1 min-w-0">
        <p style={{
          fontSize: 12,
          fontFamily: "'Manrope', sans-serif",
          fontWeight: isActive ? 600 : 400,
          color: isActive ? "#e2e8f0" : "rgba(140,158,180,0.7)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginBottom: 1,
        }}>
          {task.projectName}
        </p>
        <p style={{
          fontSize: 10,
          fontFamily: "'Manrope', sans-serif",
          color: isRunning ? "rgba(74,222,128,0.6)" : "rgba(100,116,139,0.45)",
        }}>
          {isRunning ? "En cours..." : relativeTime(task.timestamp)}
        </p>
      </div>

      {/* Close */}
      <button
        data-testid={`sidebar-close-${task.id}`}
        onClick={e => { e.stopPropagation(); onClose(task.id); }}
        className="flex-shrink-0 rounded"
        style={{
          width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center",
          opacity: hovered ? 1 : 0,
          color: "rgba(100,116,139,0.6)",
          transition: "opacity 0.15s, color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#e2e8f0"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(100,116,139,0.6)"}
      >
        <X style={{ width: 9, height: 9 }} />
      </button>
    </motion.div>
  );
}

export default function ProjectSidebar({ tasks, activeTaskId, isGenerating, onSelectTask, onCloseTask, onNewTask }) {
  const activeTask = isGenerating ? tasks.find(t => t.id === activeTaskId) : null;
  const historyTasks = activeTask
    ? tasks.filter(t => t.id !== activeTaskId)
    : tasks;

  return (
    <div
      className="flex flex-col flex-shrink-0 overflow-hidden"
      style={{
        width: 188,
        background: "#07090e",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* New task */}
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
        <button
          data-testid="sidebar-new-task"
          onClick={onNewTask}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all"
          style={{
            background: "rgba(6,182,212,0.07)",
            border: "1px solid rgba(6,182,212,0.14)",
            color: "rgba(6,182,212,0.8)",
            fontSize: 12,
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 500,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(6,182,212,0.13)"; e.currentTarget.style.borderColor = "rgba(6,182,212,0.25)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(6,182,212,0.07)"; e.currentTarget.style.borderColor = "rgba(6,182,212,0.14)"; }}
        >
          <Plus style={{ width: 12, height: 12 }} />
          Nouveau projet
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "0 12px 4px" }} />

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

        {/* Active section */}
        {activeTask && (
          <div className="mb-1">
            <div className="flex items-center gap-1.5 px-3 pt-3 pb-1">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }}
              />
              <span style={{
                fontSize: 9, color: "rgba(74,222,128,0.65)", fontFamily: "'Manrope',sans-serif",
                fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
              }}>
                Active
              </span>
            </div>
            <TaskItem
              task={activeTask}
              isActive={true}
              isRunning={true}
              onSelect={onSelectTask}
              onClose={onCloseTask}
            />
          </div>
        )}

        {/* History section */}
        {historyTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 px-3 pb-1" style={{ paddingTop: activeTask ? 10 : 12 }}>
              <Clock style={{ width: 9, height: 9, color: "rgba(100,116,139,0.5)", flexShrink: 0 }} />
              <span style={{
                fontSize: 9, color: "rgba(100,116,139,0.5)", fontFamily: "'Manrope',sans-serif",
                fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
              }}>
                Historique
              </span>
            </div>
            <AnimatePresence>
              {historyTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isActive={task.id === activeTaskId && !isGenerating}
                  isRunning={false}
                  onSelect={onSelectTask}
                  onClose={onCloseTask}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-10">
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(100,116,139,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <Zap style={{ width: 14, height: 14, color: "rgba(100,116,139,0.25)" }} />
            </div>
            <p style={{ fontSize: 11, color: "rgba(100,116,139,0.35)", textAlign: "center", fontFamily: "'Manrope',sans-serif", lineHeight: 1.6 }}>
              Aucun projet<br />pour l'instant
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
