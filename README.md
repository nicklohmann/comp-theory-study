# Computational Theory Study App

An interactive web app for studying a university-level Computational Theory course. Built with React + Vite and Tailwind CSS — no backend required, all state persists in `localStorage`.

> **Note:** This project was scaffolded with the help of Claude (Anthropic AI) as a personal study tool for my CS Theory course. I'm using it as a base to learn the material and intend to extend it over time.

---

## Features

### Dashboard
- Checklist of all 10 major course topics
- Mark each topic as **Not Started**, **In Progress**, or **Mastered**
- Overall progress bar + per-topic status indicators
- Stats: total topics, mastered count, total quiz questions

### Practice Quiz
- 70+ multiple-choice questions across all topics
- Filter by topic and/or difficulty (Easy / Medium / Hard)
- Questions and answer choices are **shuffled on every attempt**
- Immediate feedback with explanations after each answer
- End-of-quiz results summary with score and breakdown
- **"Review Missed Questions"** mode to retry only wrong answers

### Topic Explorer
- Dedicated page for each of the 10 topics containing:
  - Plain-English summary (2–3 paragraphs)
  - Key definitions and notation
  - A worked example
  - 3–5 curated external links (Wikipedia, MIT OCW, YouTube, GeeksforGeeks, etc.)
  - Sample quiz questions with answers revealed

### UI
- Sidebar navigation with per-topic progress indicators
- Dark mode toggle (persisted across sessions)
- Color-coded difficulty badges
- Responsive layout (mobile-friendly)

---

## Topics Covered

| # | Topic |
|---|-------|
| 1 | Automata Theory — DFA, NFA, ε-NFA |
| 2 | Regular Languages & Regular Expressions |
| 3 | Context-Free Grammars (CFG) & Pushdown Automata (PDA) |
| 4 | Pumping Lemma (regular and context-free) |
| 5 | Turing Machines (basic, multi-tape, nondeterministic) |
| 6 | Decidability & Recognizability |
| 7 | Reductions & Undecidability (Halting Problem, Rice's Theorem) |
| 8 | Complexity Theory (P, NP, NP-Complete, NP-Hard) |
| 9 | Time & Space Complexity Classes (PSPACE, L, NL, hierarchy theorems) |
| 10 | Cook-Levin Theorem & NP-Completeness Proofs |

---

## Tech Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router v6](https://reactrouter.com/)
- `localStorage` for persistence — no backend or API needed

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── data/
│   ├── topics.js        # Topic content: summaries, definitions, examples, links
│   └── questions.js     # 70+ quiz questions with explanations
├── hooks/
│   ├── useLocalStorage.js
│   ├── useProgress.js   # Per-topic status (localStorage)
│   └── useTheme.js      # Dark mode (localStorage)
├── components/
│   ├── Sidebar.jsx
│   ├── ProgressBar.jsx
│   ├── DifficultyBadge.jsx
│   ├── StatusSelector.jsx
│   └── DarkModeToggle.jsx
└── pages/
    ├── Dashboard.jsx
    ├── TopicExplorer.jsx
    ├── TopicDetail.jsx
    └── Quiz.jsx
```

---

## Learning Objectives Addressed

Questions and topic content are aligned to the following course learning objectives:

- **General:** Language hierarchy relationships; transforming problems into decision problems
- **Regular Languages:** FA tracing, DFA/NFA/RE design and conversion, Myhill-Nerode, pumping lemma
- **Context-Free Languages:** CFG/PDA design, ambiguity, CNF conversion, CFL pumping lemma
- **Turing Machines:** TM design, variant equivalence, decidability proofs, reductions, Rice's Theorem
