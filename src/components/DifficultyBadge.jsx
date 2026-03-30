const styles = {
  easy:   'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  hard:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800',
};

const labels = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

export function DifficultyBadge({ difficulty }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${styles[difficulty] ?? styles.medium}`}>
      {labels[difficulty] ?? difficulty}
    </span>
  );
}
