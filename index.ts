/**
 * store/index.ts
 *
 * Zustand global state composed of three slices:
 *   - UserSlice    — authenticated user profile
 *   - ExamSlice    — active exam session state (with immer for mutations)
 *   - UISlice      — sidebar open/close and theme
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { ExamQuestion, UserProfile } from '@/types';

// ─── User Slice ───────────────────────────────────────────────────────────────

interface UserSlice {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
}

// ─── Exam Slice ───────────────────────────────────────────────────────────────

interface ExamSlice {
  currentExam: ExamQuestion[] | null;
  currentAnswers: Record<string, string>;
  setExam: (questions: ExamQuestion[]) => void;
  setAnswer: (questionId: string, answer: string) => void;
  clearExam: () => void;
}

// ─── UI Slice ─────────────────────────────────────────────────────────────────

interface UISlice {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// ─── Combined Store Type ──────────────────────────────────────────────────────

type StoreState = UserSlice & ExamSlice & UISlice;

// ─── Store Implementation ─────────────────────────────────────────────────────

export const useStore = create<StoreState>()(
  immer((set) => ({
    // ── User ──────────────────────────────────────────────────────────────────
    user: null,

    setUser: (user) =>
      set((state) => {
        state.user = user;
      }),

    clearUser: () =>
      set((state) => {
        state.user = null;
      }),

    // ── Exam ──────────────────────────────────────────────────────────────────
    currentExam: null,
    currentAnswers: {},

    setExam: (questions) =>
      set((state) => {
        state.currentExam = questions;
        state.currentAnswers = {};
      }),

    setAnswer: (questionId, answer) =>
      set((state) => {
        state.currentAnswers[questionId] = answer;
      }),

    clearExam: () =>
      set((state) => {
        state.currentExam = null;
        state.currentAnswers = {};
      }),

    // ── UI ────────────────────────────────────────────────────────────────────
    sidebarOpen: false,

    toggleSidebar: () =>
      set((state) => {
        state.sidebarOpen = !state.sidebarOpen;
      }),

    theme: 'light',

    toggleTheme: () =>
      set((state) => {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
      }),
  })),
);

// Convenience selectors (optional but useful for consumers)
export const selectUser = (s: StoreState) => s.user;
export const selectCurrentExam = (s: StoreState) => s.currentExam;
export const selectCurrentAnswers = (s: StoreState) => s.currentAnswers;
export const selectSidebarOpen = (s: StoreState) => s.sidebarOpen;
export const selectTheme = (s: StoreState) => s.theme;
