import { Link } from 'react-router-dom';
import { TOPICS, TOPIC_COLORS } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import { ProgressBar } from '../components/ProgressBar';
import { StatusSelector, StatusDot } from '../components/StatusSelector';

const STATUS_META = {
  'not-started': { label: 'Not Started', ring: 'ring-gray-300 dark:ring-gray-600',  bg: 'bg-gray-50 dark:bg-gray-800/50' },
  'in-progress':  { label: 'In Progress', ring: 'ring-blue-400 dark:ring-blue-600',  bg: 'bg-blue-50 dark:bg-blue-900/20' },
  'mastered':     { label: 'Mastered',    ring: 'ring-green-400 dark:ring-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
};

export function Dashboard({ progress, setTopicStatus }) {
  const masteredCount  = Object.values(progress).filter((s) => s === 'mastered').length;
  const inProgCount    = Object.values(progress).filter((s) => s === 'in-progress').length;
  const notStarted     = Object.values(progress).filter((s) => s === 'not-started').length;
  const totalTopics    = TOPICS.length;
  const overallPct     = Math.round((masteredCount / totalTopics) * 100);
  const totalQuestions = QUESTIONS.length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track your progress through Computational Theory
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Topics',    value: totalTopics,    color: 'text-brand-600 dark:text-brand-400' },
          { label: 'Mastered',        value: masteredCount,  color: 'text-green-600 dark:text-green-400' },
          { label: 'In Progress',     value: inProgCount,    color: 'text-blue-600 dark:text-blue-400'   },
          { label: 'Quiz Questions',  value: totalQuestions, color: 'text-purple-600 dark:text-purple-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">Overall Progress</h2>
          <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">{overallPct}%</span>
        </div>
        <ProgressBar
          percent={overallPct}
          height="h-3"
          colorClass={overallPct === 100 ? 'bg-green-500' : 'bg-brand-600'}
        />
        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"/> {masteredCount} mastered</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/> {inProgCount} in progress</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 inline-block"/> {notStarted} not started</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/quiz" className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Start Quiz
        </Link>
        <Link to="/topics" className="btn-secondary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Browse Topics
        </Link>
      </div>

      {/* Topic checklist */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-900 dark:text-white">Topic Checklist</h2>
        <div className="space-y-2">
          {TOPICS.map((topic) => {
            const status = progress[topic.id] ?? 'not-started';
            const meta   = STATUS_META[status];
            const colors = TOPIC_COLORS[topic.color];
            const topicQs = QUESTIONS.filter((q) => q.topicId === topic.id).length;

            return (
              <div
                key={topic.id}
                className={`card ring-1 ${meta.ring} ${meta.bg} p-4 flex items-center gap-4 transition-all`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${colors.bg}`}>
                  {topic.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <StatusDot status={status} />
                    <Link
                      to={`/topics/${topic.id}`}
                      className="font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 truncate"
                    >
                      {topic.title}
                    </Link>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{topic.subtitle}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <ProgressBar
                      percent={status === 'mastered' ? 100 : status === 'in-progress' ? 50 : 0}
                      height="h-1"
                      colorClass={status === 'mastered' ? 'bg-green-500' : 'bg-blue-500'}
                    />
                    <span className="text-xs text-gray-400 whitespace-nowrap">{topicQs} Qs</span>
                  </div>
                </div>

                {/* Status selector */}
                <div className="flex-shrink-0">
                  <StatusSelector
                    topicId={topic.id}
                    currentStatus={status}
                    onChange={setTopicStatus}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
