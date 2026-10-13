// LocalStorage Data Management and State Persistence
import { defaultDecks } from '../data/flashcards.js';

const STORAGE_KEYS = {
  STATS: 'lingua_stats',
  DECKS: 'lingua_custom_decks',
  CARD_PROGRESS: 'lingua_card_progress',
  QUIZ_HISTORY: 'lingua_quiz_history',
  GRAMMAR_STAGES: 'lingua_grammar_stages',
  SETTINGS: 'lingua_settings'
};

const DEFAULT_SETTINGS = {
  aiProvider: 'mock', // 'gemini' | 'openai' | 'mock'
  apiKeyGemini: '',
  apiKeyOpenAI: '',
  geminiModel: 'gemini-1.5-flash',
  openaiModel: 'gpt-4o-mini',
  voiceLang: 'en-US',
  voiceRate: 1.0,
  autoSpeak: true,
  soundEffects: true
};

export class StorageService {
  static getStats() {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) {
      const initial = {
        exp: 0,
        level: 1,
        streak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        totalWordsStudied: 0,
        quizzesTaken: 0,
        conversationsCompleted: 0,
        activityHistory: {} // 'YYYY-MM-DD': expGained
      };
      this.saveStats(initial);
      return initial;
    }
    const stats = JSON.parse(raw);
    this.checkAndUpdateStreak(stats);
    return stats;
  }

  static saveStats(stats) {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }

  static checkAndUpdateStreak(stats) {
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastActiveDate === today) {
      return;
    }

    const last = new Date(stats.lastActiveDate);
    const curr = new Date(today);
    const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day!
      stats.streak += 1;
    } else if (diffDays > 1) {
      // Missed a day
      stats.streak = 1;
    }
    stats.lastActiveDate = today;
    this.saveStats(stats);
  }

  static addExp(amount) {
    const stats = this.getStats();
    const oldLevel = Math.floor(stats.exp / 100) + 1;
    stats.exp += amount;
    const newLevel = Math.floor(stats.exp / 100) + 1;
    stats.level = newLevel;

    const today = new Date().toISOString().split('T')[0];
    stats.activityHistory = stats.activityHistory || {};
    stats.activityHistory[today] = (stats.activityHistory[today] || 0) + amount;

    this.saveStats(stats);
    return {
      stats,
      leveledUp: newLevel > oldLevel,
      newLevel
    };
  }

  static getDecks() {
    const raw = localStorage.getItem(STORAGE_KEYS.DECKS);
    let customDecks = [];
    if (raw) {
      try {
        customDecks = JSON.parse(raw);
      } catch (e) {
        customDecks = [];
      }
    }
    return [...defaultDecks, ...customDecks];
  }

  static saveCustomDeck(deck) {
    const raw = localStorage.getItem(STORAGE_KEYS.DECKS);
    let customDecks = raw ? JSON.parse(raw) : [];
    const index = customDecks.findIndex(d => d.id === deck.id);
    if (index >= 0) {
      customDecks[index] = deck;
    } else {
      customDecks.push(deck);
    }
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(customDecks));
  }

  static deleteCustomDeck(deckId) {
    const raw = localStorage.getItem(STORAGE_KEYS.DECKS);
    if (!raw) return;
    let customDecks = JSON.parse(raw);
    customDecks = customDecks.filter(d => d.id !== deckId);
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(customDecks));
  }

  static getCardProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CARD_PROGRESS);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn('Failed to parse card progress from localStorage:', e);
      return {};
    }
  }

  static setCardStatus(cardId, status) { // 'known' | 'review'
    try {
      const progress = this.getCardProgress();
      const prev = progress[cardId] || { status: 'new', reviews: 0 };
      progress[cardId] = {
        status,
        reviews: (prev.reviews || 0) + 1,
        lastReviewed: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.CARD_PROGRESS, JSON.stringify(progress));

      if (status === 'known' && prev.status !== 'known') {
        const stats = this.getStats();
        stats.totalWordsStudied = (stats.totalWordsStudied || 0) + 1;
        this.saveStats(stats);
      }
    } catch (e) {
      console.error('Failed to set card status:', e);
    }
  }

  static getReviewCount(deckIdFilter = null) {
    try {
      const progress = StorageService.getCardProgress();
      if (!progress || typeof progress !== 'object') return 0;
      const isReviewStatus = (val) => {
        if (!val) return false;
        if (typeof val === 'string') return val.toLowerCase() === 'review';
        return val.status && val.status.toLowerCase() === 'review';
      };
      const keys = Object.keys(progress).filter(k => isReviewStatus(progress[k]));
      if (!deckIdFilter) return keys.length;
      if (deckIdFilter === 'toeic') return keys.filter(k => k.startsWith('toeic_')).length;
      if (deckIdFilter === 'ielts') return keys.filter(k => k.startsWith('ielts_')).length;
      return keys.filter(k => !k.startsWith('toeic_') && !k.startsWith('ielts_')).length;
    } catch (e) {
      console.warn('Failed to calculate review count:', e);
      return 0;
    }
  }

  static getQuizHistory() {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    return raw ? JSON.parse(raw) : { mistakes: [], scores: [] };
  }

  static saveQuizResult({ category, total, score, wrongQuestions }) {
    const history = this.getQuizHistory();
    history.scores.unshift({
      date: new Date().toISOString(),
      category,
      total,
      score,
      percentage: Math.round((score / total) * 100)
    });

    // Update mistake list
    if (wrongQuestions && wrongQuestions.length > 0) {
      wrongQuestions.forEach(q => {
        if (!history.mistakes.find(m => m.id === q.id)) {
          history.mistakes.push(q);
        }
      });
    }

    // Keep recent 30 scores
    if (history.scores.length > 30) {
      history.scores = history.scores.slice(0, 30);
    }

    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));

    const stats = this.getStats();
    stats.quizzesTaken = (stats.quizzesTaken || 0) + 1;
    this.saveStats(stats);
  }

  static removeMistake(questionId) {
    const history = this.getQuizHistory();
    history.mistakes = history.mistakes.filter(m => m.id !== questionId);
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));
  }

  static getSettings() {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return { ...DEFAULT_SETTINGS };
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  static saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  static getGrammarStageProgress() {
    const raw = localStorage.getItem(STORAGE_KEYS.GRAMMAR_STAGES);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  static saveGrammarStageResult(categoryId, stageNum, score, total) {
    const progress = this.getGrammarStageProgress();
    const stageKey = `${categoryId}_s${stageNum}`;
    const percentage = Math.round((score / total) * 100);
    const existing = progress[stageKey];

    const bestScore = existing ? Math.max(existing.score, score) : score;
    const bestPercentage = Math.round((bestScore / total) * 100);

    progress[stageKey] = {
      score: bestScore,
      total,
      percentage: bestPercentage,
      passed: bestPercentage >= 70,
      perfect: bestScore === total,
      lastPlayed: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.GRAMMAR_STAGES, JSON.stringify(progress));
    return progress[stageKey];
  }

  static getGrammarCategoryProgress(categoryId) {
    const progress = this.getGrammarStageProgress();
    let passedStages = 0;
    let totalScore = 0;
    let totalQuestions = 0;
    for (let s = 1; s <= 4; s++) {
      const key = `${categoryId}_s${s}`;
      if (progress[key]) {
        if (progress[key].passed) passedStages++;
        totalScore += progress[key].score;
        totalQuestions += progress[key].total;
      }
    }
    return {
      passedStages,
      totalStages: 4,
      isCompleted: passedStages === 4,
      totalScore,
      totalQuestions
    };
  }

  static exportAllData() {
    return JSON.stringify({
      stats: this.getStats(),
      customDecks: localStorage.getItem(STORAGE_KEYS.DECKS) ? JSON.parse(localStorage.getItem(STORAGE_KEYS.DECKS)) : [],
      cardProgress: this.getCardProgress(),
      quizHistory: this.getQuizHistory(),
      grammarStages: this.getGrammarStageProgress(),
      settings: this.getSettings()
    }, null, 2);
  }

  static importAllData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.stats) localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(data.stats));
      if (data.customDecks) localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(data.customDecks));
      if (data.cardProgress) localStorage.setItem(STORAGE_KEYS.CARD_PROGRESS, JSON.stringify(data.cardProgress));
      if (data.quizHistory) localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(data.quizHistory));
      if (data.grammarStages) localStorage.setItem(STORAGE_KEYS.GRAMMAR_STAGES, JSON.stringify(data.grammarStages));
      if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      return true;
    } catch (e) {
      console.error("Import failed:", e);
      return false;
    }
  }

  static resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.DECKS);
    localStorage.removeItem(STORAGE_KEYS.CARD_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.GRAMMAR_STAGES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
}
