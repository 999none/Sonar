# Sonar – AI App Builder Mock (PRD)

## Overview
A fully functional, production-looking frontend mock of an AI-powered app builder platform called "Sonar". Pure frontend, no backend required. All data is mocked/simulated.

## Architecture
- **Framework**: React 19 + Tailwind CSS + Framer Motion
- **Routing**: React Router DOM (single SPA route)
- **Animation**: Framer Motion (useInView, Counter, motion divs)
- **Icons**: Lucide React
- **Fonts**: Bunny Fonts (Sora 900 for logo/numbers, Space Grotesk 700 for titles, Manrope for UI)
- **State**: Local React state (no Redux/Zustand needed)
- **Backend**: None (pure frontend mock)

## Pages / Views

### 1. Home / Landing Hero (`LandingPage.jsx`)
- Giant "sonar" headline (Sora, clamp 7rem→18rem) with navy glow
- "The future is here" subtitle
- Animated typing input (cycles through 5 example prompts)
- Mode selector (E-1 / E-2) + Model selector (GPT-4o / Claude / Gemini) + Cost estimate
- Suggestion pills: Todo App, Analytics Dashboard, E-Commerce Store
- Inline "Projets Récents" grid (3 columns, below the chat input, no background)
- Top nav: sonar logo, Docs/Pricing links, Sign in button

### 2. Scrollable Landing Sections (`LandingSections.jsx`)
Sections below the fold (scroll down from hero):

#### Stats Section
- 4 animated counter stats: 120K+ apps, 49k devs, 99.9% uptime, 10¢ avg cost
- Horizontal layout with subtle dividers

#### Demo Section
- "Voyez-le en action / De l'idée au code, en temps réel."
- Fully animated fake browser window showing the app builder:
  - Left: Chat panel with user message + agent steps (check/spinner icons)
  - Right: Code editor tab with streaming code animation + syntax highlighting
  - Browser chrome: traffic lights, URL bar (lock icon), E-1 + Deploy buttons

#### Value Props Section ("Pourquoi les devs choisissent Sonar")
- 3 horizontal cards (Vitesse / Production / Contrôle)
- Each with icon, eyebrow label, bold h3, descriptive text, glow blob on hover

#### Testimonials Section ("Ce qu'ils disent")
- "Des équipes qui livrent deux fois plus vite."
- 3 cards: Jordan M. (Indie Hacker), Sarah C. (Product Designer), Thomas K. (CTO @ Startup)
- Avatar with initials, name, handle

#### CTA Section
- "Votre prochaine app commence ici."
- "Commencer gratuitement" (cyan gradient) + "Voir sur GitHub" (ghost)
- Radial glow behind the card

#### Footer
- sonar brand + tagline
- 4 link columns: Produit, Ressources, Société, Légal
- Bottom bar: copyright + "Propulsé par l'IA"

### 3. Cost Preview Modal (`CostPreviewModal.jsx`)
- Shows before generation starts
- Displays: Est. Time, Est. Cost, Tokens Used, Output Quality
- Cancel / Generate buttons

### 4. App Builder Workspace (`AppBuilder.jsx`)
Full IDE-like layout with:
- **TopBar** (`TopBar.jsx`): sonar logo breadcrumb, model selector, E-1/E-2 toggle, time/cost/credits, Deploy button
- **Chat Panel** (`ChatPanel.jsx`): messages + agent timeline with animated statuses
- **Code Editor** (`CodeEditor.jsx`): VS Code dark theme, file tabs, streaming code
- **Preview Panel** (`EmergentPreview.jsx`): Browser chrome, responsive viewport toggle, live previews
- **Share Modal** (`ShareModal.jsx`)

## Mock Data (`mockData.js`)
- 3 project types: Todo App, Analytics Dashboard, E-Commerce Store
- Full React code for each
- Chat response sequences, agent log messages, build terminal output
- 3 AI model definitions (GPT-4o, Claude Sonnet, Gemini Pro)

## Implementation Status

### ✅ Done
- Landing page hero + typing animation
- Model/mode selectors (E-1, E-2 / GPT-4o, Claude, Gemini)
- Inline recent projects grid
- Bunny Fonts integration (Sora, Space Grotesk, Manrope)
- Scrollable page (overflow fixed in App.css)
- Stats section with animated counters
- Live demo mockup (streaming code + agent steps)
- Value props section (3 cards with glow)
- Testimonials section
- CTA final section
- Footer
- Cost preview modal
- App builder workspace (full layout)
- Agent timeline with animated status
- Code streaming with syntax highlighting
- Live interactive previews (all 3 types)
- Terminal/logs streaming
- Deploy flow

### P1 – Next
- Mobile responsive layout
- coder.com codespace integration (user said "on mettra en place après")

### P2 – Future
- Dark/light theme toggle
- Share/export generated code
- Onboarding tutorial overlay
- Real-time collaboration simulation

## Dates
- Initial build: 2026-04-02
- Landing sections redesign (remove Features/HowItWorks/Pricing, add Demo+Stats+Testimonials+CTA): 2026-04-02
