import { useLocalStorage } from './useLocalStorage';
import { TOPICS } from '../data/topics';

// status: 'not-started' | 'in-progress' | 'mastered'
const initialProgress = Object.fromEntries(
  TOPICS.map((t) => [t.id, 'not-started'])
);

export function useProgress() {
  const [progress, setProgress] = useLocalStorage('ct-progress', initialProgress);

  const setTopicStatus = (topicId, status) => {
    setProgress((prev) => ({ ...prev, [topicId]: status }));
  };

  const masteredCount = Object.values(progress).filter((s) => s === 'mastered').length;
  const inProgressCount = Object.values(progress).filter((s) => s === 'in-progress').length;
  const totalTopics = TOPICS.length;
  const overallPercent = Math.round((masteredCount / totalTopics) * 100);

  return { progress, setTopicStatus, masteredCount, inProgressCount, totalTopics, overallPercent };
}
