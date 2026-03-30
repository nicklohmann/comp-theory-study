import { Link } from 'react-router-dom';
import { TOPICS, TOPIC_COLORS } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import { StatusSelector, StatusDot } from '../components/StatusSelector';
import { ProgressBar } from '../components/ProgressBar';

export function TopicExplorer({ progress, setTopicStatus }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Topic Explorer</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Click any topic for deep-dive notes, definitions, examples, and curated resources.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TOPICS.map((topic) => {
          const status   = progress[topic.id] ?? 'not-started';
          const colors   = TOPIC_COLORS[topic.color];
          const topicQs  = QUESTIONS.filter((q) => q.topicId === topic.id);
          const easyCount   = topicQs.filter((q) => q.difficulty === 'easy').length;
          const medCount    = topicQs.filter((q) => q.difficulty === 'medium').length;
          const hardCount   = topicQs.filter((q) => q.difficulty === 'hard').length;

          return (
            <div key={topic.id} className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${colors.bg}`}>
                  {topic.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <StatusDot status={status} />
                    <h2 className="font-semibold text-gray-900 dark:text-white leading-tight truncate">
                      {topic.title}
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{topic.subtitle}</p>
                </div>
              </div>

              {/* Preview */}
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {topic.summary[0]}
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-3 text-xs">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                  {easyCount} easy
                </span>
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">
                  {medCount} medium
                </span>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
                  {hardCount} hard
                </span>
                <span className="ml-auto text-gray-400">{topicQs.length} questions</span>
              </div>

              {/* Progress bar */}
              <ProgressBar
                percent={status === 'mastered' ? 100 : status === 'in-progress' ? 50 : 0}
                height="h-1.5"
                colorClass={status === 'mastered' ? 'bg-green-500' : 'bg-blue-500'}
              />

              {/* Footer */}
              <div className="flex items-center gap-2 pt-1">
                <Link
                  to={`/topics/${topic.id}`}
                  className="btn-primary text-xs flex-1 text-center"
                >
                  Study Topic
                </Link>
                <Link
                  to={`/quiz?topic=${topic.id}`}
                  className="btn-secondary text-xs flex-1 text-center"
                >
                  Quiz This Topic
                </Link>
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
  );
}
