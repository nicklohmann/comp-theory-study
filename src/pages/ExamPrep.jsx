import { useNavigate } from 'react-router-dom';
import { EXAM_OBJECTIVES, REGULAR_OBJECTIVES, CFL_OBJECTIVES } from '../data/examObjectives';
import { QUESTIONS } from '../data/questions';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SECTION_META = {
  regular: {
    label: 'Regular Languages',
    color: 'blue',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    ring: 'ring-blue-400',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  cfl: {
    label: 'Context-Free Languages',
    color: 'green',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    ring: 'ring-green-400',
    btn: 'bg-green-600 hover:bg-green-700 text-white',
  },
};

function ObjectiveCard({ objective, onPractice, practiced }) {
  const meta = SECTION_META[objective.section];
  const qCount = objective.questionIds.filter(
    id => QUESTIONS.find(q => q.id === id)
  ).length;

  return (
    <div className={`card border ${meta.border} flex flex-col gap-3 p-4 ${practiced ? 'opacity-90' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>
            {objective.id}
          </span>
          {practiced && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Practiced
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
          {qCount} question{qCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">
        {objective.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
        {objective.description}
      </p>

      {/* Tip */}
      <div className={`rounded-lg px-3 py-2 text-xs ${meta.bg} border ${meta.border}`}>
        <span className="font-semibold text-gray-700 dark:text-gray-300">Tip: </span>
        <span className="text-gray-600 dark:text-gray-400">{objective.tip}</span>
      </div>

      {/* Practice button */}
      <button
        onClick={() => onPractice(objective)}
        disabled={qCount === 0}
        className={`mt-auto w-full py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${meta.btn}`}
      >
        Practice {objective.id} →
      </button>
    </div>
  );
}

function SectionHeader({ section, objectives, onPracticeAll }) {
  const meta = SECTION_META[section];
  const totalQs = [...new Set(objectives.flatMap(o => o.questionIds))]
    .filter(id => QUESTIONS.find(q => q.id === id)).length;

  return (
    <div className={`rounded-xl p-4 border ${meta.border} ${meta.bg} flex flex-wrap items-center justify-between gap-3`}>
      <div>
        <h2 className="font-bold text-gray-900 dark:text-white text-base">
          {meta.label}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {objectives.length} objectives · {totalQs} unique questions
        </p>
      </div>
      <button
        onClick={() => onPracticeAll(objectives)}
        className={`px-4 py-2 rounded-lg text-sm font-medium ${meta.btn}`}
      >
        Practice All {meta.label.split(' ')[0]} →
      </button>
    </div>
  );
}

export function ExamPrep() {
  const navigate = useNavigate();
  const [practiced, setPracticed] = useLocalStorage('ct-exam-practiced', {});

  const handlePractice = (objective) => {
    const ids = objective.questionIds;
    setPracticed(prev => ({ ...prev, [objective.id]: true }));
    navigate('/quiz', { state: { questionIds: ids, label: `${objective.id}: ${objective.title}` } });
  };

  const handlePracticeAll = (objectives) => {
    const ids = [...new Set(objectives.flatMap(o => o.questionIds))];
    navigate('/quiz', { state: { questionIds: ids, label: objectives[0].section === 'regular' ? 'All Regular Language Objectives' : 'All CFL Objectives' } });
  };

  const handlePracticeEverything = () => {
    const ids = [...new Set(EXAM_OBJECTIVES.flatMap(o => o.questionIds))];
    navigate('/quiz', { state: { questionIds: ids, label: 'Full Exam Prep' } });
  };

  const practicedCount = Object.keys(practiced).length;
  const totalObjectives = EXAM_OBJECTIVES.length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Prep</h1>
            <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full font-semibold">
              Quiz Mode
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Practice by specific learning objective. Covers exactly what's on your exam.
          </p>
        </div>
        <button
          onClick={handlePracticeEverything}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Full Exam Practice
        </button>
      </div>

      {/* Overall progress */}
      <div className="card p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Objectives practiced</span>
            <span className="font-bold text-brand-600 dark:text-brand-400">{practicedCount} / {totalObjectives}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 bg-brand-600 rounded-full transition-all duration-500"
              style={{ width: `${(practicedCount / totalObjectives) * 100}%` }}
            />
          </div>
        </div>
        {practicedCount > 0 && (
          <button
            onClick={() => setPracticed({})}
            className="btn-ghost text-xs text-gray-400 whitespace-nowrap"
          >
            Reset
          </button>
        )}
      </div>

      {/* Exam coverage notice */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm">
        <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">What's on your exam</p>
        <div className="text-amber-700 dark:text-amber-400 space-y-1">
          <p><span className="font-medium">Regular Languages:</span> R1, R2, R4, R5, R6, R7, R10, R11, R12</p>
          <p><span className="font-medium">Context-Free Languages:</span> C1, C2, C5, C6, C7, C8, C9, C10, C11 (C3, C4, C12 excluded)</p>
        </div>
      </div>

      {/* Regular Languages section */}
      <div className="space-y-4">
        <SectionHeader
          section="regular"
          objectives={REGULAR_OBJECTIVES}
          onPracticeAll={handlePracticeAll}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REGULAR_OBJECTIVES.map(obj => (
            <ObjectiveCard
              key={obj.id}
              objective={obj}
              practiced={!!practiced[obj.id]}
              onPractice={handlePractice}
            />
          ))}
        </div>
      </div>

      {/* CFL section */}
      <div className="space-y-4">
        <SectionHeader
          section="cfl"
          objectives={CFL_OBJECTIVES}
          onPracticeAll={handlePracticeAll}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CFL_OBJECTIVES.map(obj => (
            <ObjectiveCard
              key={obj.id}
              objective={obj}
              practiced={!!practiced[obj.id]}
              onPractice={handlePractice}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
