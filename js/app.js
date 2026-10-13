// Main Application Controller & Router
import { StorageService } from './services/storage.js';
import { SpeechService } from './services/speech.js';
import { DashboardComponent } from './components/dashboard.js';
import { FlashcardsComponent } from './components/flashcards.js';
import { GrammarComponent } from './components/grammar.js';
import { ConversationComponent } from './components/conversation.js';
import { SettingsComponent } from './components/settings.js';

class App {
  constructor() {
    this.currentTab = 'dashboard';
    this.mainContainer = document.getElementById('main-content');
    this.streakElem = document.getElementById('header-streak-count');
    this.levelElem = document.getElementById('header-level-badge');
    this.navButtons = document.querySelectorAll('.nav-tab-btn');

    this.init();
  }

  init() {
    this.updateHeaderStats();
    this.bindEvents();
    const initialHash = window.location.hash.replace('#', '') || 'dashboard';
    const validTabs = ['dashboard', 'flashcards', 'grammar', 'conversation', 'settings'];
    const initialTab = validTabs.includes(initialHash) ? initialHash : 'dashboard';
    window.history.replaceState({ tab: initialTab, view: 'root' }, '', `#${initialTab}`);
    this.switchTab(initialTab, false);
    this.registerServiceWorker();
  }

  updateHeaderStats() {
    const stats = StorageService.getStats();
    if (this.streakElem) this.streakElem.textContent = `${stats.streak}日`;
    if (this.levelElem) this.levelElem.textContent = `Lv.${stats.level}`;
  }

  bindEvents() {
    // Navigation tabs
    this.navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab) this.switchTab(tab);
      });
    });

    // Dark mode toggle
    const themeBtn = document.getElementById('btn-toggle-theme');
    themeBtn?.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('lingua_theme', isDark ? 'dark' : 'light');
    });

    // Load initial theme
    const savedTheme = localStorage.getItem('lingua_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }

    // Smartphone / Browser back button (popstate) handling
    window.addEventListener('popstate', (e) => {
      this.handlePopState(e.state);
    });
  }

  handlePopState(state) {
    SpeechService.stopSpeaking();
    SpeechService.stopListening();

    const handleExpGained = (amount) => this.handleExpGained(amount);

    if (!state) {
      this.switchTab('dashboard', false);
      return;
    }

    if (this.currentTab === 'flashcards') {
      if (state.view === 'study') {
        // Already in study
      } else if (state.view === 'stages') {
        if (FlashcardsComponent.viewMode === 'study') {
          FlashcardsComponent.exitToStages(this.mainContainer, handleExpGained);
          return;
        }
      } else if (state.view === 'review_list') {
        if (FlashcardsComponent.viewMode === 'study') {
          FlashcardsComponent.exitToReviewList(this.mainContainer, handleExpGained);
          return;
        }
      } else {
        if (FlashcardsComponent.viewMode !== 'decks') {
          FlashcardsComponent.exitToDecks(this.mainContainer, handleExpGained);
          return;
        }
      }
    } else if (this.currentTab === 'grammar') {
      if (state.view === 'stages') {
        if (GrammarComponent.viewMode === 'quiz' || GrammarComponent.viewMode === 'result') {
          GrammarComponent.exitToStages(this.mainContainer, handleExpGained);
          return;
        }
      } else {
        if (GrammarComponent.viewMode !== 'menu') {
          GrammarComponent.exitToMenu(this.mainContainer, handleExpGained);
          return;
        }
      }
    } else if (this.currentTab === 'conversation') {
      if (ConversationComponent.viewMode !== 'scenarios') {
        ConversationComponent.viewMode = 'scenarios';
        ConversationComponent.render(this.mainContainer, handleExpGained);
        return;
      }
    }

    if (state.tab && state.tab !== this.currentTab) {
      this.switchTab(state.tab, false);
    }
  }

  switchTab(tabName, pushState = true, options = {}) {
    this.currentTab = tabName;
    SpeechService.stopSpeaking();
    SpeechService.stopListening();

    if (pushState) {
      window.history.pushState({ tab: tabName, view: options.view || 'root' }, '', `#${tabName}`);
    }

    // Update active nav styling
    this.navButtons.forEach(btn => {
      const isCurrent = btn.getAttribute('data-tab') === tabName;
      if (isCurrent) {
        btn.classList.add('text-indigo-600', 'dark:text-indigo-400');
        btn.classList.remove('text-gray-400', 'dark:text-gray-500');
      } else {
        btn.classList.remove('text-indigo-600', 'dark:text-indigo-400');
        btn.classList.add('text-gray-400', 'dark:text-gray-500');
      }
    });

    // Render tab content
    const handleExpGained = (amount) => this.handleExpGained(amount);

    switch (tabName) {
      case 'dashboard':
        DashboardComponent.render(this.mainContainer, (tab, opts) => this.switchTab(tab, true, opts));
        break;
      case 'flashcards':
        if (options.view === 'review_list') {
          FlashcardsComponent.openReviewList(this.mainContainer, handleExpGained);
        } else {
          FlashcardsComponent.viewMode = 'decks';
          FlashcardsComponent.render(this.mainContainer, handleExpGained);
        }
        break;
      case 'grammar':
        GrammarComponent.viewMode = 'menu';
        GrammarComponent.render(this.mainContainer, handleExpGained);
        break;
      case 'conversation':
        ConversationComponent.viewMode = 'scenarios';
        ConversationComponent.render(this.mainContainer, handleExpGained);
        break;
      case 'settings':
        SettingsComponent.render(this.mainContainer, () => {
          this.updateHeaderStats();
          this.switchTab('settings');
        });
        break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleExpGained(amount) {
    const result = StorageService.addExp(amount);
    this.updateHeaderStats();
    this.showToast(`+${amount} XP 獲得！🌟`);

    if (result.leveledUp) {
      SpeechService.playSound('levelup');
      if (typeof window.confetti === 'function') {
        window.confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      }
      this.showToast(`🎉 レベルアップ！ Lv.${result.newLevel} に到達しました！`, 4000);
    }
  }

  showToast(message, duration = 2500) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white dark:bg-white/90 dark:text-gray-900 px-4 py-2 rounded-full text-xs font-bold shadow-xl backdrop-blur transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-none flex items-center space-x-2 border border-white/10';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', '-translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        reg.update();
      }).catch(err => {
        console.log('ServiceWorker registration skipped or failed:', err);
      });
    }
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.linguaApp = new App();
});
