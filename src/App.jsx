import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { TopicExplorer } from './pages/TopicExplorer';
import { TopicDetail } from './pages/TopicDetail';
import { Quiz } from './pages/Quiz';
import { ExamPrep } from './pages/ExamPrep';
import { useProgress } from './hooks/useProgress';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { dark, toggleDark } = useTheme();
  const { progress, setTopicStatus } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar
        dark={dark}
        onToggleDark={toggleDark}
        progress={progress}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-sm text-gray-900 dark:text-white">CompTheory Study</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={
              <Dashboard progress={progress} setTopicStatus={setTopicStatus} />
            } />
            <Route path="/topics" element={
              <TopicExplorer progress={progress} setTopicStatus={setTopicStatus} />
            } />
            <Route path="/topics/:topicId" element={
              <TopicDetail progress={progress} setTopicStatus={setTopicStatus} />
            } />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/exam-prep" element={<ExamPrep />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
