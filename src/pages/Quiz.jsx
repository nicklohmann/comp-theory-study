import { useState, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { QUESTIONS } from '../data/questions';
import { TOPICS } from '../data/topics';
import { DifficultyBadge } from '../components/DifficultyBadge';
import { ProgressBar } from '../components/ProgressBar';

// ── Helpers ─────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuizItems(questions) {
  return shuffle(questions).map((q) => {
    // Build shuffled answer list, track where the correct answer ended up
    const indexed = q.options.map((opt, i) => ({ opt, orig: i }));
    const shuffled = shuffle(indexed);
    const newAnswerIdx = shuffled.findIndex((x) => x.orig === q.answer);
    return {
      ...q,
      shuffledOptions: shuffled.map((x) => x.opt),
      shuffledAnswer: newAnswerIdx,
    };
  });
}

// ── Sub-components ───────────────────────────────────────────────────────────

function QuestionCard({ item, idx, total, onAnswer, userAnswer }) {
  const answered = userAnswer !== null && userAnswer !== undefined;
  const correct  = userAnswer === item.shuffledAnswer;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Question {idx + 1} of {total}</span>
          <DifficultyBadge difficulty={item.difficulty} />
        </div>
        <ProgressBar percent={Math.round(((idx + 1) / total) * 100)} height="h-1.5" />
      </div>

      {/* Question */}
      <div className="card p-6 space-y-5">
        <p className="font-medium text-gray-900 dark:text-white text-base leading-relaxed">
          {item.question}
        </p>

        {/* Options */}
        <div className="space-y-2.5">
          {item.shuffledOptions.map((opt, i) => {
            const isCorrect  = i === item.shuffledAnswer;
            const isSelected = i === userAnswer;

            let base = 'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150 flex items-start gap-3';
            if (!answered) {
              base += ' border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-gray-700 dark:text-gray-300 cursor-pointer';
            } else if (isCorrect) {
              base += ' border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200';
            } else if (isSelected && !isCorrect) {
              base += ' border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200';
            } else {
              base += ' border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-500 opacity-60';
            }

            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => onAnswer(i)}
                className={base}
              >
                <span className={`mt-0.5 w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                  answered && isCorrect ? 'border-green-500 bg-green-500 text-white' :
                  answered && isSelected ? 'border-red-500 bg-red-500 text-white' :
                  'border-current'
                }`}>
                  {answered && isCorrect ? '✓' : answered && isSelected ? '✗' : String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className={`rounded-lg p-4 text-sm ${correct ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'}`}>
            <p className={`font-semibold mb-1 ${correct ? 'text-green-800 dark:text-green-300' : 'text-amber-800 dark:text-amber-300'}`}>
              {correct ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsSummary({ items, userAnswers, onRetry, onReviewMissed, onNewQuiz }) {
  const total   = items.length;
  const correct = items.filter((_, i) => userAnswers[i] === items[i].shuffledAnswer).length;
  const pct     = Math.round((correct / total) * 100);
  const missed  = items.filter((_, i) => userAnswers[i] !== items[i].shuffledAnswer);

  const grade = pct >= 90 ? { label: 'Excellent!', color: 'text-green-600 dark:text-green-400' }
              : pct >= 75 ? { label: 'Good job!',  color: 'text-blue-600 dark:text-blue-400'   }
              : pct >= 60 ? { label: 'Keep going!', color: 'text-amber-600 dark:text-amber-400' }
              :              { label: 'Keep studying!', color: 'text-red-600 dark:text-red-400' };

  return (
    <div className="space-y-6">
      {/* Score card */}
      <div className="card p-8 text-center space-y-4">
        <div className="text-5xl font-bold text-brand-600 dark:text-brand-400">{pct}%</div>
        <div className={`text-xl font-semibold ${grade.color}`}>{grade.label}</div>
        <p className="text-gray-500 dark:text-gray-400">
          You got <span className="font-semibold text-gray-900 dark:text-white">{correct}</span> out of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{total}</span> correct
        </p>
        <ProgressBar percent={pct} height="h-3" colorClass={pct >= 75 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={onRetry} className="btn-primary">Retry Quiz</button>
        {missed.length > 0 && (
          <button onClick={onReviewMissed} className="btn-secondary">
            Review {missed.length} Missed Question{missed.length !== 1 ? 's' : ''}
          </button>
        )}
        <button onClick={onNewQuiz} className="btn-ghost">New Quiz</button>
      </div>

      {/* Per-question breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">Question Breakdown</h3>
        {items.map((item, i) => {
          const wasCorrect = userAnswers[i] === item.shuffledAnswer;
          return (
            <div key={item.id} className={`card p-4 border-l-4 ${wasCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{item.question}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <DifficultyBadge difficulty={item.difficulty} />
                  <span className={`text-lg ${wasCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {wasCorrect ? '✓' : '✗'}
                  </span>
                </div>
              </div>
              {!wasCorrect && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p><span className="text-red-500 font-medium">Your answer:</span> {item.shuffledOptions[userAnswers[i]] ?? '—'}</p>
                  <p><span className="text-green-600 font-medium">Correct:</span> {item.shuffledOptions[item.shuffledAnswer]}</p>
                  <p className="text-gray-500 italic">{item.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Quiz setup screen ────────────────────────────────────────────────────────

function QuizSetup({ onStart, initialTopicId }) {
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId ?? 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [questionCount, setQuestionCount] = useState(10);

  const filtered = useMemo(() => {
    return QUESTIONS.filter((q) => {
      const topicMatch = selectedTopicId === 'all' || q.topicId === selectedTopicId;
      const diffMatch  = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      return topicMatch && diffMatch;
    });
  }, [selectedTopicId, selectedDifficulty]);

  const available = filtered.length;
  const count     = Math.min(questionCount, available);

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Practice Quiz</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Customize your quiz session below.</p>
      </div>

      <div className="card p-6 space-y-5">
        {/* Topic filter */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Topic</label>
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Topics ({QUESTIONS.length} questions)</option>
            {TOPICS.map((t) => {
              const n = QUESTIONS.filter((q) => q.topicId === t.id).length;
              return <option key={t.id} value={t.id}>{t.title} ({n} questions)</option>;
            })}
          </select>
        </div>

        {/* Difficulty filter */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty</label>
          <div className="flex gap-2">
            {['all', 'easy', 'medium', 'hard'].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  selectedDifficulty === d
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-400'
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Question count */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Number of Questions: <span className="text-brand-600 dark:text-brand-400 font-bold">{count}</span>
            {count < questionCount && <span className="text-xs text-amber-500 ml-2">(max available)</span>}
          </label>
          <input
            type="range"
            min={1}
            max={Math.max(1, available)}
            value={Math.min(questionCount, available)}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>1</span><span>{available}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {available} question{available !== 1 ? 's' : ''} available. Questions and answers are shuffled each attempt.
        </p>

        <button
          disabled={available === 0}
          onClick={() => onStart(filtered, count)}
          className="btn-primary w-full py-2.5 text-base disabled:opacity-50"
        >
          Start Quiz ({count} questions)
        </button>
      </div>
    </div>
  );
}

// ── Main Quiz page ───────────────────────────────────────────────────────────

export function Quiz() {
  const [searchParams] = useSearchParams();
  const initialTopicId = searchParams.get('topic') ?? undefined;

  const [phase, setPhase]       = useState('setup');   // 'setup' | 'active' | 'results'
  const [items, setItems]       = useState([]);
  const [current, setCurrent]   = useState(0);
  const [userAnswers, setUA]    = useState([]);

  const startQuiz = useCallback((pool, count) => {
    const selected = buildQuizItems(pool.slice(0, count === pool.length ? pool.length : count));
    // reshuffle to pick `count` from pool
    const picked = buildQuizItems(shuffle(pool).slice(0, count));
    setItems(picked);
    setUA(new Array(count).fill(null));
    setCurrent(0);
    setPhase('active');
  }, []);

  const handleAnswer = (answerIdx) => {
    setUA((prev) => {
      const next = [...prev];
      next[current] = answerIdx;
      return next;
    });
  };

  const handleNext = () => {
    if (current < items.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setPhase('results');
    }
  };

  const handlePrev = () => setCurrent((c) => Math.max(0, c - 1));

  const retryQuiz = () => {
    const reshuffled = buildQuizItems(items.map((item) => {
      // reconstruct original q from QUESTIONS
      return QUESTIONS.find((q) => q.id === item.id) ?? item;
    }));
    setItems(reshuffled);
    setUA(new Array(reshuffled.length).fill(null));
    setCurrent(0);
    setPhase('active');
  };

  const reviewMissed = () => {
    const missed = items
      .filter((_, i) => userAnswers[i] !== items[i].shuffledAnswer)
      .map((item) => QUESTIONS.find((q) => q.id === item.id) ?? item);
    const reshuffled = buildQuizItems(missed);
    setItems(reshuffled);
    setUA(new Array(reshuffled.length).fill(null));
    setCurrent(0);
    setPhase('active');
  };

  if (phase === 'setup') {
    return <QuizSetup onStart={startQuiz} initialTopicId={initialTopicId} />;
  }

  if (phase === 'results') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ResultsSummary
          items={items}
          userAnswers={userAnswers}
          onRetry={retryQuiz}
          onReviewMissed={reviewMissed}
          onNewQuiz={() => setPhase('setup')}
        />
      </div>
    );
  }

  // Active quiz
  const item     = items[current];
  const answered = userAnswers[current] !== null;
  const isLast   = current === items.length - 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => setPhase('setup')} className="btn-ghost text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Exit
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Score: {userAnswers.filter((a, i) => a !== null && a === items[i].shuffledAnswer).length} / {userAnswers.filter((a) => a !== null).length}
        </span>
      </div>

      {/* Topic label */}
      {item && (() => {
        const topic = TOPICS.find((t) => t.id === item.topicId);
        return topic ? (
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {topic.icon} {topic.title}
          </p>
        ) : null;
      })()}

      {/* Question */}
      {item && (
        <QuestionCard
          item={item}
          idx={current}
          total={items.length}
          onAnswer={handleAnswer}
          userAnswer={userAnswers[current]}
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-3">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className="btn-secondary disabled:opacity-40"
        >
          ← Previous
        </button>
        {answered ? (
          <button onClick={handleNext} className="btn-primary">
            {isLast ? 'Finish Quiz' : 'Next Question →'}
          </button>
        ) : (
          <button disabled className="btn-secondary opacity-40 cursor-not-allowed">
            Select an answer
          </button>
        )}
      </div>
    </div>
  );
}
