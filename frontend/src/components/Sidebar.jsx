import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Plus, CheckSquare, BarChart2, ShoppingBag, FileText, ChevronLeft, ChevronRight } from "lucide-react";

const TYPE_ICONS = {
  todo:       CheckSquare,
  dashboard:  BarChart2,
  ecommerce:  ShoppingBag,
};

function relativeTime(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Sidebar({ tasks, activeTaskId, onSelectTask, onNewTask, onHome, collapsed, onToggleCollapse }) {
  return (
    <motion.div
      animate={{ width: collapsed ? 52 : 210 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col h-full flex-shrink-0 overflow-hidden"
      style={{
        background: "#06090f",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Top: logo + collapse */}
      <div className="flex items-center justify-between px-3 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", minHeight: 48 }}>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="font-black text-white text-base tracking-tighter select-none"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              sonar
            </motion.span>
          )}
        </AnimatePresence>
        <button
          data-testid="sidebar-collapse"
          onClick={onToggleCollapse}
          className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors hover:bg-white/5 flex-shrink-0"
          style={{ color: "rgba(100,116,139,0.6)", marginLeft: collapsed ? "auto" : 0 }}
        >
          {collapsed ? <ChevronRight style={{ width: 13, height: 13 }} /> : <ChevronLeft style={{ width: 13, height: 13 }} />}
        </button>
      </div>

      {/* New task button */}
      <div className="px-2 pt-3 pb-2 flex-shrink-0">
        <button
          data-testid="new-task-btn"
          onClick={onNewTask}
          className="flex items-center gap-2 w-full rounded-lg transition-all px-2 py-2"
          style={{
            background: "rgba(6,182,212,0.1)",
            border: "1px solid rgba(6,182,212,0.2)",
            color: "#06b6d4",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(6,182,212,0.16)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(6,182,212,0.1)"}
        >
          <Plus style={{ width: 14, height: 14, flexShrink: 0 }} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="text-xs font-semibold overflow-hidden whitespace-nowrap"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                New task
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Home nav */}
      <div className="px-2 pb-2 flex-shrink-0">
        <button
          data-testid="nav-home"
          onClick={onHome}
          className="flex items-center gap-2 w-full rounded-lg transition-all px-2 py-2"
          style={{ color: "rgba(100,116,139,0.7)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#e2e8f0"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(100,116,139,0.7)"; }}
        >
          <Home style={{ width: 14, height: 14, flexShrink: 0 }} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="text-xs overflow-hidden whitespace-nowrap"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Home
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Divider + History label */}
      {!collapsed && (
        <div className="px-3 pb-1.5 flex-shrink-0">
          <p style={{ fontSize: "10px", color: "rgba(100,116,139,0.45)", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Manrope', sans-serif" }}>
            History
          </p>
        </div>
      )}
      <div style={{ height: 1, background: "rgba(255,255,255,0.04)", marginBottom: 4, flexShrink: 0 }} />

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
        {tasks.length === 0 && !collapsed && (
          <p className="text-center pt-6" style={{ fontSize: "11px", color: "rgba(100,116,139,0.4)", fontFamily: "'Manrope', sans-serif" }}>
            No tasks yet
          </p>
        )}
        {tasks.map(task => {
          const Icon = TYPE_ICONS[task.projectType] || FileText;
          const isActive = task.id === activeTaskId;
          return (
            <button
              key={task.id}
              data-testid={`task-item-${task.id}`}
              onClick={() => onSelectTask(task)}
              className="flex items-center gap-2 w-full rounded-lg px-2 py-2 text-left transition-all"
              style={{
                background: isActive ? "rgba(6,182,212,0.1)" : "transparent",
                border: isActive ? "1px solid rgba(6,182,212,0.2)" : "1px solid transparent",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon
                style={{
                  width: 13, height: 13, flexShrink: 0,
                  color: isActive ? "#06b6d4" : "rgba(100,116,139,0.6)",
                }}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 min-w-0 overflow-hidden"
                  >
                    <p className="text-xs truncate" style={{ color: isActive ? "#e2e8f0" : "rgba(180,195,215,0.7)", fontFamily: "'Manrope', sans-serif" }}>
                      {task.projectName}
                    </p>
                    <p style={{ fontSize: "10px", color: "rgba(100,116,139,0.5)", fontFamily: "'Manrope', sans-serif" }}>
                      {relativeTime(task.timestamp)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
