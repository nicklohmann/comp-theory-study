import { useParams, Link, useNavigate } from 'react-router-dom';
import { TOPICS, TOPIC_COLORS } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import { StatusSelector } from '../components/StatusSelector';
import { DifficultyBadge } from '../components/DifficultyBadge';

export function TopicDetail({ progress, setTopicStatus }) {
  const { topicId } = useParams();
  const navigate    = useNavigate();
  const topic       = TOPICS.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">Topic not found.</p>
        <Link to="/topics" className="btn-primary mt-4 inline-block">Back to Topics</Link>
      </div>
    );
  }

  const colors   = TOPIC_COLORS[topic.color];
  const status   = progress[topic.id] ?? 'not-started';
  const topicQs  = QUESTIONS.filter((q) => q.topicId === topic.id);
  const topicIdx = TOPICS.findIndex((t) => t.id === topicId);
  const prevTopic = TOPICS[topicIdx - 1];
  const nextTopic = TOPICS[topicIdx + 1];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/topics" className="hover:text-brand-600 dark:hover:text-brand-400">Topics</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium truncate">{topic.title}</span>
      </nav>

      {/* Header card */}
      <div className={`card p-6 border-l-4 ${colors.border}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${colors.bg}`}>
              {topic.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{topic.title}</h1>
              <p className={`text-sm font-medium mt-0.5 ${colors.text}`}>{topic.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <StatusSelector topicId={topic.id} currentStatus={status} onChange={setTopicStatus} />
            <Link to={`/quiz?topic=${topic.id}`} className="btn-primary text-sm">
              Quiz This Topic
            </Link>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-brand-500">📖</span> Overview
        </h2>
        <div className="space-y-3">
          {topic.summary.map((para, i) => (
            <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Key definitions */}
      <section className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-brand-500">📌</span> Key Definitions
        </h2>
        <div className="space-y-3">
          {topic.definitions.map(({ term, def }) => (
            <div key={term} className="flex gap-3 text-sm">
              <div className={`font-mono font-semibold px-2 py-0.5 rounded text-xs h-fit flex-shrink-0 ${colors.bg} ${colors.text}`}>
                {term}
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{def}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Worked example */}
      <section className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-brand-500">🔍</span> Worked Example
        </h2>
        <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm">{topic.example.title}</h3>
        <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-x-auto leading-relaxed border border-gray-200 dark:border-gray-700">
          {topic.example.body}
        </pre>
      </section>

      {/* Sample questions */}
      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-brand-500">🧠</span> Sample Questions ({topicQs.length})
          </h2>
          <Link to={`/quiz?topic=${topic.id}`} className="btn-primary text-xs">
            Full Quiz
          </Link>
        </div>
        <div className="space-y-3">
          {topicQs.slice(0, 3).map((q) => (
            <div key={q.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-medium text-gray-800 dark:text-gray-200">{q.question}</p>
                <DifficultyBadge difficulty={q.difficulty} />
              </div>
              <ul className="space-y-1">
                {q.options.map((opt, i) => (
                  <li key={i} className={`text-xs flex items-start gap-2 ${i === q.answer ? 'text-green-700 dark:text-green-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                    <span className={`mt-0.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center flex-shrink-0 ${i === q.answer ? 'bg-green-100 dark:bg-green-900/40' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {topicQs.length > 3 && (
          <p className="text-xs text-gray-400 text-center">+ {topicQs.length - 3} more questions in the quiz</p>
        )}
      </section>

      {/* External resources */}
      <section className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-brand-500">🔗</span> Curated Resources
        </h2>
        <ul className="space-y-2">
          {topic.links.map(({ label, url }) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 hover:underline"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Prev / Next nav */}
      <div className="flex justify-between gap-4 pt-2">
        {prevTopic ? (
          <Link to={`/topics/${prevTopic.id}`} className="btn-secondary flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {prevTopic.title}
          </Link>
        ) : <div />}
        {nextTopic ? (
          <Link to={`/topics/${nextTopic.id}`} className="btn-secondary flex items-center gap-2 text-sm ml-auto">
            {nextTopic.title}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
