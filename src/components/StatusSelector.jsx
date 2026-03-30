const OPTIONS = [
  { value: 'not-started', label: 'Not Started', color: 'text-gray-500 dark:text-gray-400' },
  { value: 'in-progress', label: 'In Progress', color: 'text-blue-600 dark:text-blue-400' },
  { value: 'mastered',    label: 'Mastered',    color: 'text-green-600 dark:text-green-400' },
];

export function StatusSelector({ topicId, currentStatus, onChange }) {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onChange(topicId, e.target.value)}
      className="text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function StatusDot({ status }) {
  const colors = {
    'not-started': 'bg-gray-300 dark:bg-gray-600',
    'in-progress': 'bg-blue-500',
    'mastered':    'bg-green-500',
  };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status] ?? colors['not-started']}`} />;
}
