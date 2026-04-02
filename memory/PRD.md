# Sonar – AI App Builder Mock (PRD)

## Overview
A fully functional, production-looking frontend mock of an AI-powered app builder platform called "Sonar". Pure frontend, no backend required. All data is mocked/simulated.

## Architecture
- **Framework**: React 19 + Tailwind CSS + Framer Motion
- **Routing**: React Router DOM
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **State**: Local React state (no Redux/Zustand needed)
- **Backend**: None (pure frontend mock)

## Pages / Views

### 1. Landing Page (`LandingPage.jsx`)
- Giant "sonar" headline with navy glow effect
- "The future is here" subtitle
- "Create your own app without coding a line." subtext
- Animated typing input (cycles through 5 example prompts)
- Suggestion pills: Todo App, Analytics Dashboard, E-Commerce Store
- Stats bar: 120K+ apps, 4.9s build time, 99.9% uptime, $0.12 avg cost
- Feature cards: Instant Generation, Production Code, Auto Deploy, Enterprise Grade
- Top nav: sonar logo, Features/Pricing/Docs links, Sign in, Get Started

### 2. Cost Preview Modal (`CostPreviewModal.jsx`)
- Shows before generation starts
- Displays: Est. Time, Est. Cost, Tokens Used, Output Quality
- Shows current model (GPT-4o/Claude/Gemini) and mode (E-1/E-2)
- Cancel / Generate buttons

### 3. App Builder Workspace (`AppBuilder.jsx`)
Full IDE-like layout:

#### Top Bar (`TopBar.jsx`)
- sonar logo + project name breadcrumb
- Model selector dropdown (GPT-4o, Claude 4 Sonnet, Gemini 3 Pro)
- E-1/E-2 mode toggle with help tooltip
- Time elapsed counter (during generation)
- Estimated cost counter
- Credits counter
- Deploy button (glows cyan)

#### Left Panel (3-column layout: Sidebar | Chat | Preview)
- **Project Sidebar** (`ProjectSidebar.jsx`): 188px left panel — "Nouveau projet" button, Active Tasks section (animated dot), Historique section (past tasks with timestamps)
- **Chat Panel** (`ChatPanel.jsx`): Message thread with user/AI bubbles, typing indicator, follow-up input
- **Agent Panel** (`AgentPanel.jsx`): Timeline with Planner → Architect → Coder → Debugger; each shows status (waiting/active/done) with animated indicators and log snippets

#### Center Panel
- **Code Editor** (`CodeEditor.jsx`): VS Code dark theme with file tabs (App.tsx, styles.css, package.json, README.md), line numbers, syntax highlighting (purple keywords, green strings, blue JSX, orange numbers), streaming animation, copy button, VS Code status bar

#### Right Panel
- **Preview Panel** (`PreviewPanel.jsx`): Browser chrome with traffic light buttons, address bar (localhost:3000), responsive viewport toggle (mobile/tablet/desktop), interactive live previews for all 3 project types

#### Bottom Panel
- **Logs Panel** (`LogsPanel.jsx`): Terminal with collapsible header, colored build output, line numbers, running indicator

## Mock Data (`mockData.js`)
- 3 project types: Todo App, Analytics Dashboard, E-Commerce Store
- Full React code for each (300+ lines each)
- Chat response sequences per project type
- Agent timeline log messages
- Terminal build log sequence
- 3 AI model definitions

## Project Types & Detection
Prompt analysis detects keywords:
- "todo/task/list" → Todo App
- "dashboard/analytics/chart" → Analytics Dashboard  
- "shop/store/commerce/product" → E-Commerce Store
- Fallback: cycles by timestamp

## Implementation Status
✅ Landing page with typing animation
✅ Cost preview modal
✅ App builder full layout
✅ Agent timeline with animated status
✅ Code streaming with syntax highlighting
✅ Live interactive previews (all 3 types)
✅ Terminal/logs streaming
✅ Model selector dropdown
✅ E-1/E-2 toggle with tooltip
✅ Credits/cost/time counters
✅ Deploy flow with terminal logs
✅ Chat panel with typing indicator

## Prioritized Backlog
### P0 (Done)
- All features above

### P1 (Next)
- Mobile responsive layout
- Dark/light theme toggle
- Project history sidebar
- Share/export generated code

### P2 (Future)
- Onboarding tutorial overlay
- Multiple file support in editor
- Real-time collaboration simulation
- Screenshot/recording of preview

## Dates
- Initial build: 2026-04-02
