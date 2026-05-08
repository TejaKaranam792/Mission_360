// useStore.js - Central state management with localStorage persistence
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';

// Maps JS getDay() (0=Sun) to weeklyData index (0=Mon ... 6=Sun)
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function todayDayLabel() {
  const d = new Date().getDay(); // 0=Sun,1=Mon,...
  return DAY_LABELS[d === 0 ? 6 : d - 1];
}

// Returns updated weeklyData with today's hours and tasks count
function syncWeeklyDay(weeklyData, hours, completedTasks) {
  const label = todayDayLabel();
  return weeklyData.map(entry =>
    entry.day === label
      ? { ...entry, hours: +hours.toFixed(1), tasks: completedTasks }
      : entry
  );
}

const STORAGE_KEY = 'mission160_data';

const defaultTimetable = [
  { id: 1, start: '06:00', end: '09:00', subject: 'Quant', color: '#3b82f6', completed: false },
  { id: 2, start: '09:45', end: '11:15', subject: 'Reasoning', color: '#8b5cf6', completed: false },
  { id: 3, start: '11:15', end: '13:15', subject: 'English', color: '#10b981', completed: false },
  { id: 4, start: '14:15', end: '15:45', subject: 'GA', color: '#f59e0b', completed: false },
  { id: 5, start: '16:00', end: '17:00', subject: 'Mock Test', color: '#f97316', completed: false },
  { id: 6, start: '17:00', end: '18:00', subject: 'Mock Analysis', color: '#ef4444', completed: false },
  { id: 7, start: '19:00', end: '20:00', subject: 'Revision', color: '#06b6d4', completed: false },
];

const defaultTasks = [
  { id: 1, label: '100 Quant Questions', icon: '📐', done: false },
  { id: 2, label: '60 Reasoning Questions', icon: '🧠', done: false },
  { id: 3, label: '50 English Questions', icon: '📖', done: false },
  { id: 4, label: '50 GA MCQs', icon: '🌍', done: false },
  { id: 5, label: '1 Mock Test', icon: '📝', done: false },
  { id: 6, label: 'Mock Analysis', icon: '🔍', done: false },
  { id: 7, label: 'Revision Completed', icon: '🔄', done: false },
  { id: 8, label: 'Formula Revision', icon: '📋', done: false },
  { id: 9, label: 'Vocabulary Revision', icon: '📚', done: false },
];

const defaultHabits = [
  { id: 1, label: 'Sleep before 11 PM', icon: '🌙', streak: 0, done: false },
  { id: 2, label: 'No reels in morning', icon: '📵', streak: 0, done: false },
  { id: 3, label: '10 study hours', icon: '⏱️', streak: 0, done: false },
  { id: 4, label: 'Workout', icon: '💪', streak: 0, done: false },
  { id: 5, label: 'Water intake (8 glasses)', icon: '💧', streak: 0, done: false },
  { id: 6, label: 'Revision done', icon: '✅', streak: 0, done: false },
];

const getDefaultData = () => ({
  lastResetDate: format(new Date(), 'yyyy-MM-dd'),
  streak: 0,
  totalHoursToday: 0,
  weeklyData: [
    { day: 'Mon', hours: 0, tasks: 0 },
    { day: 'Tue', hours: 0, tasks: 0 },
    { day: 'Wed', hours: 0, tasks: 0 },
    { day: 'Thu', hours: 0, tasks: 0 },
    { day: 'Fri', hours: 0, tasks: 0 },
    { day: 'Sat', hours: 0, tasks: 0 },
    { day: 'Sun', hours: 0, tasks: 0 },
  ],
  heatmap: {},
  timetable: defaultTimetable,
  tasks: defaultTasks,
  habits: defaultHabits,
  mockTests: [],
  mistakes: [],
  settings: { musicOn: false, lightMode: false },
  pomodoroStats: { sessionsToday: 0 },
  allCompletedToday: false,
});

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const data = JSON.parse(raw);
    // Check if we need to reset daily data
    const today = format(new Date(), 'yyyy-MM-dd');
    if (data.lastResetDate !== today) {
      // New day — reset daily items but keep streaks / history
      const wasAllDone = data.tasks && data.tasks.every(t => t.done);
      return {
        ...data,
        lastResetDate: today,
        totalHoursToday: 0,
        tasks: defaultTasks,
        habits: data.habits ? data.habits.map(h => ({
          ...h,
          done: false,
          streak: h.done ? h.streak + 1 : Math.max(0, h.streak - 1),
        })) : defaultHabits,
        timetable: data.timetable ? data.timetable.map(b => ({ ...b, completed: false })) : defaultTimetable,
        streak: wasAllDone ? (data.streak || 0) + 1 : data.streak || 0,
        allCompletedToday: false,
      };
    }
    return { ...getDefaultData(), ...data };
  } catch {
    return getDefaultData();
  }
}

export function useStore() {
  const [data, setData] = useState(loadData);

  const save = useCallback((newData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const update = useCallback((updates) => {
    setData(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Timetable
  const updateTimetable = useCallback((timetable) => update({ timetable }), [update]);
  const toggleTimetableBlock = useCallback((id) => {
    setData(prev => {
      const timetable = prev.timetable.map(b =>
        b.id === id ? { ...b, completed: !b.completed } : b
      );
      const totalHoursToday = timetable
        .filter(b => b.completed)
        .reduce((acc, b) => {
          const [sh, sm] = b.start.split(':').map(Number);
          const [eh, em] = b.end.split(':').map(Number);
          return acc + (eh * 60 + em - sh * 60 - sm) / 60;
        }, 0);
      const completedTasks = prev.tasks.filter(t => t.done).length;
      const weeklyData = syncWeeklyDay(prev.weeklyData, totalHoursToday, completedTasks);
      const next = { ...prev, timetable, totalHoursToday: +totalHoursToday.toFixed(1), weeklyData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Tasks
  const toggleTask = useCallback((id) => {
    setData(prev => {
      const tasks = prev.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
      const allDone = tasks.every(t => t.done);
      const today = format(new Date(), 'yyyy-MM-dd');
      const completedTasks = tasks.filter(t => t.done).length;
      const heatmap = { ...prev.heatmap, [today]: completedTasks };
      const weeklyData = syncWeeklyDay(prev.weeklyData, prev.totalHoursToday, completedTasks);
      const next = { ...prev, tasks, allCompletedToday: allDone, heatmap, weeklyData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Habits
  const toggleHabit = useCallback((id) => {
    setData(prev => {
      const habits = prev.habits.map(h => h.id === id ? { ...h, done: !h.done } : h);
      const next = { ...prev, habits };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Mock tests
  const addMockTest = useCallback((entry) => {
    setData(prev => {
      const mockTests = [{ ...entry, id: Date.now() }, ...prev.mockTests];
      const next = { ...prev, mockTests };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const deleteMockTest = useCallback((id) => {
    setData(prev => {
      const mockTests = prev.mockTests.filter(m => m.id !== id);
      const next = { ...prev, mockTests };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Mistakes
  const addMistake = useCallback((entry) => {
    setData(prev => {
      const mistakes = [{ ...entry, id: Date.now(), revised: false }, ...prev.mistakes];
      const next = { ...prev, mistakes };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const toggleMistakeRevised = useCallback((id) => {
    setData(prev => {
      const mistakes = prev.mistakes.map(m => m.id === id ? { ...m, revised: !m.revised } : m);
      const next = { ...prev, mistakes };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const deleteMistake = useCallback((id) => {
    setData(prev => {
      const mistakes = prev.mistakes.filter(m => m.id !== id);
      const next = { ...prev, mistakes };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Settings
  const toggleMusic = useCallback(() => update({ settings: { ...data.settings, musicOn: !data.settings.musicOn } }), [data.settings, update]);
  const updateWeeklyData = useCallback((weeklyData) => update({ weeklyData }), [update]);

  return {
    data,
    update,
    updateTimetable,
    toggleTimetableBlock,
    toggleTask,
    toggleHabit,
    addMockTest,
    deleteMockTest,
    addMistake,
    toggleMistakeRevised,
    deleteMistake,
    toggleMusic,
    updateWeeklyData,
  };
}

export { defaultTimetable, defaultTasks, defaultHabits };
