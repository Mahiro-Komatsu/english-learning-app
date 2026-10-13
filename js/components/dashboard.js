// Dashboard Component: Streaks, EXP Progress, Quick Actions, and Activity Chart
import { StorageService } from '../services/storage.js';

export class DashboardComponent {
  static quotes = [
    { en: "A different language is a different vision of life.", ja: "異なる言語は、異なる人生の展望である。（フェデリコ・フェリーニ）" },
    { en: "To have another language is to possess a second soul.", ja: "もう一つの言語を持つことは、第二の魂を持つことである。（カール大帝）" },
    { en: "Language is the road map of a culture.", ja: "言語は文化のロードマップである。（リタ・メイ・ブラウン）" },
    { en: "Small daily improvements over time lead to stunning results.", ja: "日々の小さな積み重ねが、やがて目覚ましい成果へとつながる。" },
    { en: "The limits of my language mean the limits of my world.", ja: "私の言語の限界が、私の世界の限界を意味する。（ヴィトゲンシュタイン）" }
  ];

  static render(container, onNavigate) {
    const stats = StorageService.getStats();
    const currentExp = stats.exp % 100;
    const currentLevel = stats.level;
    const streak = stats.streak || 1;
    let reviewCount = 0;
    try {
      if (typeof StorageService.getReviewCount === 'function') {
        reviewCount = StorageService.getReviewCount();
      }
    } catch (e) {}
    if (reviewCount === 0) {
      try {
        const raw = localStorage.getItem('lingua_card_progress');
        if (raw) {
          const parsed = JSON.parse(raw);
          const isReview = (val) => val === 'review' || (val && typeof val === 'object' && val.status && val.status.toLowerCase() === 'review');
          reviewCount = Object.keys(parsed).filter(k => isReview(parsed[k])).length;
        }
      } catch (e) {}
    }

    // Pick random or daily quote
    const quoteIndex = new Date().getDate() % this.quotes.length;
    const dailyQuote = this.quotes[quoteIndex];

    // Compute weekly history
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
      const exp = (stats.activityHistory && stats.activityHistory[dateStr]) || 0;
      last7Days.push({ date: dateStr, dayLabel, exp });
    }

    const maxExp = Math.max(...last7Days.map(d => d.exp), 50);

    container.innerHTML = `
      <div class="space-y-6 pb-20">
        <!-- Top Banner: Streak & Level -->
        <div class="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm shadow-inner">
                🌟
              </div>
              <div>
                <div class="text-xs text-indigo-200 font-medium tracking-wide uppercase">Current Level</div>
                <div class="text-2xl font-bold flex items-center gap-2">
                  Lv.${currentLevel}
                  <span class="text-xs bg-indigo-500/60 px-2 py-0.5 rounded-full font-normal border border-indigo-400/30">Mastery</span>
                </div>
              </div>
            </div>

            <!-- Streak badge -->
            <div class="flex items-center space-x-2 bg-black/25 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
              <span class="text-xl animate-bounce">🔥</span>
              <div class="text-right">
                <div class="text-xs text-orange-200 font-semibold leading-tight">${streak}日連続</div>
                <div class="text-[10px] text-indigo-200">Streak</div>
              </div>
            </div>
          </div>

          <!-- XP Progress Bar -->
          <div>
            <div class="flex justify-between text-xs mb-1.5 font-medium">
              <span class="text-indigo-200">次のレベルまで</span>
              <span><strong class="text-white">${currentExp}</strong> / 100 XP</span>
            </div>
            <div class="w-full bg-black/30 rounded-full h-3.5 p-0.5 overflow-hidden border border-white/10">
              <div class="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-700 shadow-sm" style="width: ${currentExp}%;"></div>
            </div>
          </div>
        </div>

        <!-- Daily Quote Card -->
        <div class="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 shadow-sm">
          <div class="flex items-start space-x-3">
            <span class="text-xl mt-0.5">💬</span>
            <div class="space-y-1">
              <p class="text-sm font-medium text-amber-900 dark:text-amber-100 italic leading-snug">"${dailyQuote.en}"</p>
              <p class="text-xs text-amber-700 dark:text-amber-300">${dailyQuote.ja}</p>
            </div>
          </div>
        </div>

        ${reviewCount > 0 ? `
          <!-- Review Alert Banner -->
          <div id="btn-dash-review" class="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-4 text-white shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition active:scale-[0.99]">
            <div class="flex items-center space-x-3">
              <span class="text-2xl animate-bounce">🔥</span>
              <div>
                <div class="font-extrabold text-sm">要復習の単語が ${reviewCount} 語あります</div>
                <div class="text-xs text-amber-100">忘れる前に再学習して苦手単語を完全克服しましょう</div>
              </div>
            </div>
            <span class="text-xs bg-white text-orange-600 font-bold px-3 py-1.5 rounded-xl shadow-sm whitespace-nowrap">
              復習する →
            </span>
          </div>
        ` : ''}

        <!-- Quick Action Grid -->
        <div>
          <h2 class="text-base font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span>⚡ 今日の学習をスタート</span>
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- Flashcards Button -->
            <button id="btn-quick-flashcard" class="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-indigo-500 hover:shadow-md transition text-left">
              <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
                  📚
                </div>
                <div>
                  <div class="font-bold text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 transition">単語フラッシュカード</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">記憶定着・反復学習</div>
                </div>
              </div>
              <span class="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition">→</span>
            </button>

            <!-- Grammar Quiz Button -->
            <button id="btn-quick-grammar" class="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-indigo-500 hover:shadow-md transition text-left">
              <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl">
                  📝
                </div>
                <div>
                  <div class="font-bold text-gray-900 dark:text-white text-sm group-hover:text-emerald-600 transition">文法・穴埋めテスト</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">即時解説＆弱点克服</div>
                </div>
              </div>
              <span class="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition">→</span>
            </button>

            <!-- AI Talk Button -->
            <button id="btn-quick-ai" class="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-indigo-500 hover:shadow-md transition text-left">
              <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <div class="font-bold text-gray-900 dark:text-white text-sm group-hover:text-purple-600 transition">AI英会話パートナー</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">音声対話＆リアルタイム添削</div>
                </div>
              </div>
              <span class="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition">→</span>
            </button>
          </div>
        </div>

        <!-- Weekly Activity Heatmap/Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>📊 過去7日間の学習実績</span>
            </h3>
            <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">合計: ${last7Days.reduce((a, b) => a + b.exp, 0)} XP</span>
          </div>

          <div class="flex items-end justify-between h-32 pt-4 px-2">
            ${last7Days.map(item => {
              const heightPercent = Math.max(8, Math.round((item.exp / maxExp) * 100));
              const isToday = item.date === new Date().toISOString().split('T')[0];
              return `
                <div class="flex flex-col items-center flex-1">
                  <div class="text-[10px] text-gray-400 font-semibold mb-1">${item.exp > 0 ? item.exp : ''}</div>
                  <div class="w-7 sm:w-10 bg-gray-100 dark:bg-gray-700 rounded-t-lg relative flex items-end justify-center overflow-hidden h-24">
                    <div class="w-full ${isToday ? 'bg-gradient-to-t from-indigo-600 to-indigo-400' : 'bg-gradient-to-t from-indigo-400/80 to-indigo-300'} rounded-t-lg transition-all duration-500" style="height: ${heightPercent}%;"></div>
                  </div>
                  <div class="mt-2 text-xs font-medium ${isToday ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-500 dark:text-gray-400'}">${item.dayLabel}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Stats Overview Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
            <div class="text-xs text-gray-500 dark:text-gray-400">覚えた単語</div>
            <div class="text-xl font-bold text-gray-900 dark:text-white mt-1">${stats.totalWordsStudied || 0} <span class="text-xs font-normal">語</span></div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
            <div class="text-xs text-gray-500 dark:text-gray-400">受験したテスト</div>
            <div class="text-xl font-bold text-gray-900 dark:text-white mt-1">${stats.quizzesTaken || 0} <span class="text-xs font-normal">回</span></div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
            <div class="text-xs text-gray-500 dark:text-gray-400">AI英会話</div>
            <div class="text-xl font-bold text-gray-900 dark:text-white mt-1">${stats.conversationsCompleted || 0} <span class="text-xs font-normal">回</span></div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
            <div class="text-xs text-gray-500 dark:text-gray-400">トータルXP</div>
            <div class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">${stats.exp || 0} <span class="text-xs font-normal">XP</span></div>
          </div>
        </div>
      </div>
    `;

    // Event listeners for quick navigation
    container.querySelector('#btn-dash-review')?.addEventListener('click', () => onNavigate('flashcards', { view: 'review_list' }));
    container.querySelector('#btn-quick-flashcard')?.addEventListener('click', () => onNavigate('flashcards'));
    container.querySelector('#btn-quick-grammar')?.addEventListener('click', () => onNavigate('grammar'));
    container.querySelector('#btn-quick-ai')?.addEventListener('click', () => onNavigate('conversation'));
  }
}
