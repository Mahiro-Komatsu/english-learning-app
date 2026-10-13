// Flashcards Component: SRS Flashcards, 3D Flip Card, Native Speech Audio, TOEIC 8000 & IELTS 8000 Stage Management
import { defaultDecks, loadDeckCards, getReviewCards } from '../data/flashcards.js';
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';

export class FlashcardsComponent {
  static currentDeckId = 'daily';
  static currentStage = 1;
  static currentBatchSize = 25;
  static currentIndex = 0;
  static isFlipped = false;
  static sessionCards = [];
  static sessionKnown = 0;
  static sessionReview = 0;
  static viewMode = 'decks'; // 'decks' | 'stages' | 'study' | 'summary' | 'review_list'
  static returnViewMode = 'decks'; // 'decks' | 'stages' | 'review_list'
  static isReviewSession = false;
  static reviewFilter = 'all';
  static reviewCardsData = [];
  static activeDeckData = null; // currently loaded full deck list

  static render(container, onExpGained) {
    if (this.viewMode === 'stages') {
      this.renderStageSelector(container, onExpGained);
    } else if (this.viewMode === 'study') {
      this.renderStudyMode(container, onExpGained);
    } else if (this.viewMode === 'summary') {
      this.renderSummaryMode(container, onExpGained);
    } else if (this.viewMode === 'review_list') {
      this.renderReviewListView(container, onExpGained);
    } else {
      this.renderDeckList(container, onExpGained);
    }
  }

  static renderDeckList(container, onExpGained) {
    const decks = (typeof StorageService.getDecks === 'function' ? StorageService.getDecks() : []) || [];
    
    // Get progress with multiple fallbacks
    let progress = {};
    try {
      if (typeof StorageService.getCardProgress === 'function') {
        progress = StorageService.getCardProgress() || {};
      }
    } catch (e) {}
    if (!progress || Object.keys(progress).length === 0) {
      try {
        const raw = localStorage.getItem('lingua_card_progress');
        if (raw) progress = JSON.parse(raw);
      } catch (e) {}
    }

    const isReview = (val) => {
      if (!val) return false;
      if (typeof val === 'string') return val.toLowerCase() === 'review';
      return val.status && val.status.toLowerCase() === 'review';
    };

    // Calculate total review count with triple-layer verification
    let totalReviewCount = 0;
    if (progress && typeof progress === 'object') {
      totalReviewCount = Object.keys(progress).filter(k => isReview(progress[k])).length;
    }
    if (totalReviewCount === 0 && typeof StorageService.getReviewCount === 'function') {
      try {
        totalReviewCount = StorageService.getReviewCount();
      } catch (e) {}
    }
    if (totalReviewCount === 0) {
      try {
        const raw = localStorage.getItem('lingua_card_progress');
        if (raw) {
          const parsed = JSON.parse(raw);
          totalReviewCount = Object.keys(parsed).filter(k => isReview(parsed[k])).length;
        }
      } catch (e) {}
    }
    if (totalReviewCount === 0 && this.reviewCardsData && Array.isArray(this.reviewCardsData) && this.reviewCardsData.length > 0) {
      totalReviewCount = this.reviewCardsData.length;
    }

    container.innerHTML = `
      <div class="space-y-6 pb-20">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">単語帳・フラッシュカード</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">TOEIC 8,000語・IELTS 8,000語を重要度順に完全収録</p>
          </div>
          <button id="btn-create-word" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1 shadow-sm transition">
            <span>＋</span> 単語を追加
          </button>
        </div>

        <!-- Review List Banner / Special Deck Card -->
        <div id="review-list-banner" class="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-5 text-white shadow-md relative overflow-hidden cursor-pointer hover:shadow-lg transition">
          <div class="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-lg pointer-events-none"></div>
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-2xl animate-bounce">🔥</span>
                <h3 class="text-base font-extrabold">要復習リスト (苦手克服デッキ)</h3>
                <span class="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                  ${totalReviewCount.toLocaleString()} 語
                </span>
              </div>
              <p class="text-xs text-amber-100 mt-1">
                ${totalReviewCount > 0 
                  ? '「要復習」に選んだ苦手単語だけを集約！忘れる前に集中特訓して完全定着させましょう' 
                  : '学習中に「要復習 (❌)」を押した単語が自動でここに集まります（現在は0語です 🎉）'}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button id="btn-view-review-list" class="px-3.5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition active:scale-95 flex items-center gap-1.5" title="要復習単語の一覧・管理">
                <span>📋</span> 一覧を見る
              </button>
              ${totalReviewCount > 0 ? `
                <button id="btn-start-review-study" class="px-4 py-2.5 bg-white text-orange-600 hover:bg-amber-50 font-bold text-xs rounded-xl shadow transition active:scale-95 flex items-center gap-1.5 whitespace-nowrap">
                  <span>✍️</span> 今すぐ復習する
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Decks List Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${decks.map(deck => {
            const isLarge = deck.isLargeDeck;
            const total = deck.totalWords || (deck.cards ? deck.cards.length : 0);
            let knownCount = 0;

            if (isLarge) {
              const prefix = deck.id + '_';
              for (const k in progress) {
                if (k.startsWith(prefix) && progress[k]?.status === 'known') {
                  knownCount++;
                }
              }
            } else if (deck.cards) {
              knownCount = deck.cards.filter(c => progress[c.id]?.status === 'known').length;
            }

            const percent = total > 0 ? ((knownCount / total) * 100).toFixed(1) : '0';

            return `
              <div class="deck-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:border-indigo-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between" data-deck-id="${deck.id}">
                <div>
                  <div class="flex items-start justify-between">
                    <div class="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-2xl flex items-center justify-center">
                      ${deck.icon || '📖'}
                    </div>
                    <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${percent >= 100 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'}">
                      習得率: ${percent}%
                    </span>
                  </div>

                  <h3 class="text-base font-bold text-gray-900 dark:text-white mt-3 flex items-center gap-2">
                    ${deck.name}
                    ${isLarge ? '<span class="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">重要度順 8,000語</span>' : ''}
                  </h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">${deck.description}</p>
                </div>

                <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60">
                  <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                    <span>${knownCount.toLocaleString()} / ${total.toLocaleString()} 語 習得</span>
                    <span class="font-bold text-indigo-600 dark:text-indigo-400">${total.toLocaleString()} 語収録</span>
                  </div>
                  <div class="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div class="bg-indigo-600 h-full rounded-full transition-all duration-500" style="width: ${Math.min(100, percent)}%;"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Add Word Modal Container (hidden by default) -->
      <div id="add-word-modal" class="fixed inset-0 bg-black/60 z-50 hidden backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-base font-bold text-gray-900 dark:text-white">新しい英単語を追加</h3>
            <button id="close-modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg">✕</button>
          </div>

          <form id="form-add-word" class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">英単語 / フレーズ *</label>
              <input type="text" id="input-term" required placeholder="例: Resilient" class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">日本語の意味 *</label>
              <input type="text" id="input-meaning" required placeholder="例: 回復力のある、立ち直りの早い" class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">例文 (英語)</label>
              <input type="text" id="input-example" placeholder="例: Humans are remarkably resilient." class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">例文 (日本語訳)</label>
              <input type="text" id="input-example-ja" placeholder="例: 人間は驚くほど立ち直りが早い。" class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div class="pt-2 flex justify-end gap-2">
              <button type="button" id="cancel-modal" class="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">キャンセル</button>
              <button type="submit" class="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow">保存する</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Review Banner Handlers
    container.querySelector('#review-list-banner')?.addEventListener('click', (e) => {
      if (e.target.closest('#btn-start-review-study')) return;
      this.openReviewList(container, onExpGained);
    });

    container.querySelector('#btn-view-review-list')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openReviewList(container, onExpGained);
    });

    container.querySelector('#btn-start-review-study')?.addEventListener('click', async () => {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 space-y-3">
          <div class="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <div class="text-sm font-semibold text-gray-700 dark:text-gray-300">要復習の単語を読み込み中...</div>
        </div>
      `;
      const cards = await getReviewCards();
      if (cards.length === 0) {
        this.renderDeckList(container, onExpGained);
        return;
      }
      this.returnViewMode = 'decks';
      this.currentDeckId = 'review_deck';
      this.startStudyCards(cards.slice(0, 25), container, onExpGained, 'review');
    });

    // Click Deck
    container.querySelectorAll('.deck-card').forEach(elem => {
      elem.addEventListener('click', () => {
        const deckId = elem.getAttribute('data-deck-id');
        this.selectDeck(deckId, container, onExpGained);
      });
    });

    // Modal Handlers
    const modal = container.querySelector('#add-word-modal');
    container.querySelector('#btn-create-word')?.addEventListener('click', () => modal?.classList.remove('hidden'));
    container.querySelector('#close-modal')?.addEventListener('click', () => modal?.classList.add('hidden'));
    container.querySelector('#cancel-modal')?.addEventListener('click', () => modal?.classList.add('hidden'));

    container.querySelector('#form-add-word')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const term = container.querySelector('#input-term').value.trim();
      const meaning = container.querySelector('#input-meaning').value.trim();
      const example = container.querySelector('#input-example').value.trim();
      const exampleJa = container.querySelector('#input-example-ja').value.trim();

      if (!term || !meaning) return;

      const decks = StorageService.getDecks();
      let customDeck = decks.find(d => d.id === 'custom_my_deck');
      if (!customDeck) {
        customDeck = {
          id: 'custom_my_deck',
          name: 'マイ単語帳 (My Custom Words)',
          icon: '⭐',
          description: '自分で登録したオリジナル単語リスト',
          totalWords: 0,
          cards: []
        };
      }

      customDeck.cards.push({
        id: 'c_' + Date.now(),
        term,
        meaning,
        example: example || `This is how you use "${term}".`,
        exampleJa: exampleJa || `これは「${term}」の使い方の例です。`
      });
      customDeck.totalWords = customDeck.cards.length;

      StorageService.saveCustomDeck(customDeck);
      modal.classList.add('hidden');
      this.renderDeckList(container, onExpGained);
    });
  }

  static async openReviewList(container, onExpGained, filter = 'all') {
    this.reviewFilter = filter;
    this.viewMode = 'review_list';
    if (window.history.state?.view !== 'review_list') {
      window.history.pushState({ tab: 'flashcards', view: 'review_list' }, '');
    }

    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 space-y-3">
        <div class="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <div class="text-sm font-semibold text-gray-700 dark:text-gray-300">要復習の単語を読み込み中...</div>
      </div>
    `;

    try {
      this.reviewCardsData = await getReviewCards();
    } catch (e) {
      console.error('Failed to get review cards:', e);
      this.reviewCardsData = [];
    }
    this.renderReviewListView(container, onExpGained);
  }

  static exitToReviewList(container, onExpGained) {
    this.removeKeyboardListener();
    this.isReviewSession = false;
    this.openReviewList(container, onExpGained, this.reviewFilter || 'all');
  }

  static renderReviewListView(container, onExpGained) {
    const allCards = this.reviewCardsData || [];
    const filter = this.reviewFilter || 'all';

    const toeicCards = allCards.filter(c => c.deckId === 'toeic');
    const ieltsCards = allCards.filter(c => c.deckId === 'ielts');
    const otherCards = allCards.filter(c => c.deckId !== 'toeic' && c.deckId !== 'ielts');

    let displayedCards = allCards;
    if (filter === 'toeic') displayedCards = toeicCards;
    else if (filter === 'ielts') displayedCards = ieltsCards;
    else if (filter === 'other') displayedCards = otherCards;

    container.innerHTML = `
      <div class="space-y-6 pb-20 max-w-2xl mx-auto">
        <!-- Top Navigation Bar -->
        <div class="flex items-center justify-between">
          <button id="btn-back-to-decks" class="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1">
            ← 単語帳一覧に戻る
          </button>
          <span class="text-xs text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            要復習: ${allCards.length} 語
          </span>
        </div>

        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-5 text-white shadow-md">
          <div class="flex items-center space-x-3 mb-2">
            <span class="text-3xl">🔥</span>
            <div>
              <h2 class="text-xl font-extrabold">要復習単語リスト</h2>
              <div class="text-xs text-amber-100 font-medium">苦手単語を集中的に克服・完全記憶</div>
            </div>
          </div>
          <p class="text-xs text-amber-100/90 leading-relaxed mt-2">
            学習中に「要復習」を選んだ単語です。再学習して「覚えた！」を押すと自動的にリストからクリアされます。
          </p>

          ${displayedCards.length > 0 ? `
            <!-- Action Buttons -->
            <div class="mt-4 pt-3 border-t border-white/20 flex flex-wrap gap-2">
              <button id="btn-study-review-all" class="px-4 py-2 bg-white text-orange-600 font-bold text-xs rounded-xl shadow hover:bg-amber-50 transition active:scale-95 flex items-center gap-1.5">
                <span>▶</span> すべて復習スタート (${displayedCards.length}語)
              </button>
              ${displayedCards.length > 25 ? `
                <button id="btn-study-review-batch" class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition border border-white/20 active:scale-95 flex items-center gap-1.5">
                  <span>⚡</span> 25語ずつ特訓
                </button>
              ` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button class="filter-tab-btn px-3.5 py-1.5 rounded-xl font-bold transition ${filter === 'all' ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}" data-filter="all">
            すべて (${allCards.length})
          </button>
          <button class="filter-tab-btn px-3.5 py-1.5 rounded-xl font-bold transition ${filter === 'toeic' ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}" data-filter="toeic">
            TOEIC (${toeicCards.length})
          </button>
          <button class="filter-tab-btn px-3.5 py-1.5 rounded-xl font-bold transition ${filter === 'ielts' ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}" data-filter="ielts">
            IELTS (${ieltsCards.length})
          </button>
          <button class="filter-tab-btn px-3.5 py-1.5 rounded-xl font-bold transition ${filter === 'other' ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}" data-filter="other">
            日常・その他 (${otherCards.length})
          </button>
        </div>

        <!-- Word List / Empty State -->
        ${displayedCards.length === 0 ? `
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-10 text-center space-y-4">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-3xl flex items-center justify-center">
              🎉
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">このカテゴリに要復習の単語はありません</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">苦手な単語はすべて克服されています。素晴らしい成果です！</p>
            </div>
            <button id="btn-back-to-decks-empty" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition">
              単語帳一覧に戻る
            </button>
          </div>
        ` : `
          <div class="space-y-3" id="review-words-container">
            ${displayedCards.map(card => `
              <div class="review-card-item bg-white dark:bg-gray-800 border border-amber-200/80 dark:border-amber-900/60 rounded-xl p-4 shadow-sm hover:border-amber-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3" data-card-id="${card.id}">
                <div class="space-y-1 flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">${card.term}</span>
                    ${card.partOfSpeech ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono">${card.partOfSpeech}</span>` : ''}
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      ${card.deckName || '単語'} ${card.rank ? `#${card.rank}` : ''}
                    </span>
                    ${card.reviewsCount > 1 ? `<span class="text-[10px] text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-950/50 px-1.5 py-0.5 rounded">復習 ${card.reviewsCount}回</span>` : ''}
                  </div>
                  <div class="text-sm font-bold text-gray-800 dark:text-gray-200">
                    ${card.meaning}
                  </div>
                  ${card.coreImage ? `
                    <div class="text-xs text-amber-800 dark:text-amber-300/90 font-medium flex items-start gap-1 mt-0.5">
                      <span class="shrink-0">💡</span>
                      <span class="line-clamp-2">${card.coreImage}</span>
                    </div>
                  ` : ''}
                </div>

                <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button class="btn-voice-speak p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition" data-term="${card.term}" title="発音を聞く">
                    🔊
                  </button>
                  <button class="btn-mark-known px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition flex items-center gap-1 active:scale-95" data-id="${card.id}" title="覚えた！として復習リストから除外">
                    <span>✅</span> <span>覚えた (除外)</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    // Handlers
    container.querySelector('#btn-back-to-decks')?.addEventListener('click', () => {
      this.exitToDecks(container, onExpGained);
    });

    container.querySelector('#btn-back-to-decks-empty')?.addEventListener('click', () => {
      this.exitToDecks(container, onExpGained);
    });

    // Filter clicks
    container.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedFilter = btn.getAttribute('data-filter');
        this.reviewFilter = selectedFilter;
        this.renderReviewListView(container, onExpGained);
      });
    });

    // Start all
    container.querySelector('#btn-study-review-all')?.addEventListener('click', () => {
      this.returnViewMode = 'review_list';
      this.currentDeckId = 'review_deck';
      this.startStudyCards(displayedCards, container, onExpGained, 'review');
    });

    // Start batch
    container.querySelector('#btn-study-review-batch')?.addEventListener('click', () => {
      this.returnViewMode = 'review_list';
      this.currentDeckId = 'review_deck';
      this.startStudyCards(displayedCards.slice(0, 25), container, onExpGained, 'review');
    });

    // Voice speak
    container.querySelectorAll('.btn-voice-speak').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const term = btn.getAttribute('data-term');
        if (term) SpeechService.speak(term);
      });
    });

    // Mark Known and remove from list
    container.querySelectorAll('.btn-mark-known').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardId = btn.getAttribute('data-id');
        StorageService.setCardStatus(cardId, 'known');
        SpeechService.playSound('correct');
        if (onExpGained) onExpGained(5);

        // Remove from local review data
        this.reviewCardsData = this.reviewCardsData.filter(c => c.id !== cardId);
        
        // Remove element from DOM
        const elem = container.querySelector(`.review-card-item[data-card-id="${cardId}"]`);
        if (elem) {
          elem.style.transition = 'all 0.25s ease';
          elem.style.opacity = '0';
          elem.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.renderReviewListView(container, onExpGained);
          }, 250);
        }
      });
    });
  }

  static async selectDeck(deckId, container, onExpGained) {
    this.currentDeckId = deckId;
    const decks = (typeof StorageService.getDecks === 'function' ? StorageService.getDecks() : []) || [];
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;

    if (deck.isLargeDeck) {
      // Show loading indicator then stage selector
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 space-y-4">
          <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div class="text-sm font-semibold text-gray-700 dark:text-gray-300">${deck.name} 8,000語を読み込み中...</div>
        </div>
      `;
      try {
        this.activeDeckData = await loadDeckCards(deckId);
        this.viewMode = 'stages';
        if (window.history.state?.view !== 'stages') {
          window.history.pushState({ tab: 'flashcards', view: 'stages', deckId }, '');
        }
        this.renderStageSelector(container, onExpGained);
      } catch (err) {
        console.error('Failed to load deck cards:', err);
        container.innerHTML = `
          <div class="bg-white dark:bg-gray-800 border border-rose-200 dark:border-rose-900 rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto my-12 shadow-sm">
            <div class="w-12 h-12 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/60 text-2xl flex items-center justify-center">⚠️</div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">単語データの読み込みに失敗しました</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">通信状態をご確認の上、もう一度お試しください。</p>
            <div class="flex justify-center gap-3 pt-2">
              <button id="btn-retry-deck" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition active:scale-95">
                再試行
              </button>
              <button id="btn-back-decks-error" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl transition active:scale-95">
                一覧に戻る
              </button>
            </div>
          </div>
        `;
        container.querySelector('#btn-retry-deck')?.addEventListener('click', () => {
          this.selectDeck(deckId, container, onExpGained);
        });
        container.querySelector('#btn-back-decks-error')?.addEventListener('click', () => {
          this.exitToDecks(container, onExpGained);
        });
      }
    } else {
      this.activeDeckData = deck.cards || [];
      this.sessionCards = [...this.activeDeckData];
      this.currentIndex = 0;
      this.isFlipped = false;
      this.sessionKnown = 0;
      this.sessionReview = 0;
      this.viewMode = 'study';
      if (window.history.state?.view !== 'study') {
        window.history.pushState({ tab: 'flashcards', view: 'study', deckId }, '');
      }
      this.renderStudyMode(container, onExpGained);
    }
  }

  static renderStageSelector(container, onExpGained) {
    const deck = StorageService.getDecks().find(d => d.id === this.currentDeckId);
    if (!deck || !this.activeDeckData) return;

    const progress = StorageService.getCardProgress();
    const stages = deck.stages || [];

    // Calculate total known
    const prefix = deck.id + '_';
    let totalKnown = 0;
    for (const k in progress) {
      if (k.startsWith(prefix) && progress[k]?.status === 'known') {
        totalKnown++;
      }
    }
    const overallPercent = ((totalKnown / deck.totalWords) * 100).toFixed(1);

    const deckReviewCards = this.activeDeckData.filter(c => progress[c.id]?.status === 'review');

    container.innerHTML = `
      <div class="space-y-6 pb-20 max-w-2xl mx-auto">
        <!-- Top bar -->
        <div class="flex items-center justify-between">
          <button id="btn-back-to-decks" class="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1">
            ← 単語帳一覧に戻る
          </button>
          <span class="text-xs text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
            習得: ${totalKnown.toLocaleString()} / ${deck.totalWords.toLocaleString()} 語 (${overallPercent}%)
          </span>
        </div>

        <!-- Header banner -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-md">
          <div class="flex items-center space-x-3 mb-2">
            <span class="text-3xl">${deck.icon}</span>
            <div>
              <h2 class="text-xl font-extrabold">${deck.name}</h2>
              <div class="text-xs text-indigo-200 font-medium">重要度順にソートされた全8,000単語</div>
            </div>
          </div>
          <p class="text-xs text-indigo-100/90 leading-relaxed mt-2">${deck.description}</p>

          <!-- Quick Action Buttons -->
          <div class="mt-4 pt-3 border-t border-white/20 flex flex-wrap gap-2">
            ${deckReviewCards.length > 0 ? `
              <button id="btn-quick-deck-review" class="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow transition active:scale-95 flex items-center gap-1.5">
                <span>🔥</span> 要復習の単語だけ学習 (${deckReviewCards.length}語)
              </button>
            ` : ''}
            <button id="btn-quick-unlearned" class="px-4 py-2 bg-white text-indigo-600 font-bold text-xs rounded-xl shadow hover:bg-indigo-50 transition active:scale-95 flex items-center gap-1.5">
              <span>🚀</span> 未習得の単語からスタート (25語)
            </button>
            <button id="btn-quick-top" class="px-4 py-2 bg-indigo-500/50 hover:bg-indigo-500/70 text-white font-bold text-xs rounded-xl transition border border-white/20 active:scale-95">
              最重要 1位からスタート (25語)
            </button>
          </div>
        </div>

        <!-- Stage List -->
        <div>
          <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
            <span>🎯 目標レベル別ステージを選択 (各1,000語)</span>
          </h3>

          <div class="space-y-3">
            ${stages.map(st => {
              const startRank = (st.stage - 1) * 1000 + 1;
              const endRank = st.stage * 1000;
              
              // Count known in this stage
              let stageKnown = 0;
              for (let i = startRank; i <= endRank; i++) {
                const cardId = `${deck.id}_${i}`;
                if (progress[cardId]?.status === 'known') {
                  stageKnown++;
                }
              }
              const stagePercent = ((stageKnown / 1000) * 100).toFixed(0);

              return `
                <div class="stage-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:border-indigo-400 hover:shadow-md transition cursor-pointer flex items-center justify-between" data-stage="${st.stage}">
                  <div class="flex items-center space-x-3.5 flex-1">
                    <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      ${st.stage}
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <h4 class="font-bold text-sm text-gray-900 dark:text-white">${st.label}</h4>
                        <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">${stageKnown} / 1,000 語 (${stagePercent}%)</span>
                      </div>
                      <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">${st.desc} (Rank ${st.range})</div>
                      <div class="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden mt-2">
                        <div class="bg-indigo-600 h-full rounded-full transition-all duration-300" style="width: ${stagePercent}%;"></div>
                      </div>
                    </div>
                  </div>
                  <span class="text-xs text-indigo-600 dark:text-indigo-400 font-bold ml-4">学習 →</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    // Handlers
    container.querySelector('#btn-back-to-decks')?.addEventListener('click', () => {
      this.exitToDecks(container, onExpGained);
    });

    container.querySelector('#btn-quick-deck-review')?.addEventListener('click', () => {
      this.returnViewMode = 'stages';
      this.startStudyCards(deckReviewCards.slice(0, 25), container, onExpGained, 'review');
    });

    container.querySelector('#btn-quick-unlearned')?.addEventListener('click', () => {
      const unlearned = this.activeDeckData.filter(c => progress[c.id]?.status !== 'known');
      this.startStudyCards(unlearned.slice(0, 25), container, onExpGained);
    });

    container.querySelector('#btn-quick-top')?.addEventListener('click', () => {
      this.startStudyCards(this.activeDeckData.slice(0, 25), container, onExpGained);
    });

    container.querySelectorAll('.stage-card').forEach(elem => {
      elem.addEventListener('click', () => {
        const stageNum = parseInt(elem.getAttribute('data-stage'));
        this.currentStage = stageNum;
        const startIdx = (stageNum - 1) * 1000;
        const stageCards = this.activeDeckData.slice(startIdx, startIdx + 1000);
        
        // Pick first 25 or unlearned in stage
        const unlearnedInStage = stageCards.filter(c => progress[c.id]?.status !== 'known');
        const batch = unlearnedInStage.length >= 25 ? unlearnedInStage.slice(0, 25) : stageCards.slice(0, 25);
        this.startStudyCards(batch, container, onExpGained);
      });
    });
  }

  static exitToStages(container, onExpGained) {
    this.removeKeyboardListener();
    this.isReviewSession = false;
    this.viewMode = 'stages';
    this.renderStageSelector(container, onExpGained);
  }

  static exitToDecks(container, onExpGained) {
    this.removeKeyboardListener();
    this.isReviewSession = false;
    this.viewMode = 'decks';
    this.renderDeckList(container, onExpGained);
  }

  static startStudyCards(cards, container, onExpGained, mode = 'normal') {
    if (!cards || cards.length === 0) return;
    this.isReviewSession = (mode === 'review' || this.currentDeckId === 'review_deck');
    this.sessionCards = cards;
    this.currentIndex = 0;
    this.isFlipped = false;
    this.sessionKnown = 0;
    this.sessionReview = 0;
    this.viewMode = 'study';
    if (window.history.state?.view !== 'study') {
      window.history.pushState({ tab: 'flashcards', view: 'study', deckId: this.currentDeckId }, '');
    }
    this.renderStudyMode(container, onExpGained);
  }

  static renderStudyMode(container, onExpGained) {
    const card = this.sessionCards[this.currentIndex];
    const total = this.sessionCards.length;
    const progressPercent = Math.round(((this.currentIndex) / total) * 100);

    const isReview = this.isReviewSession || this.currentDeckId === 'review_deck';
    const isLarge = !isReview && (this.currentDeckId === 'toeic' || this.currentDeckId === 'ielts');
    const rankBadge = isReview 
      ? `<span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1"><span>🔥</span> 要復習特訓</span>`
      : (card.rank ? `<span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">重要度 #${card.rank}</span>` : '');

    container.innerHTML = `
      <div class="space-y-4 pb-20 max-w-md mx-auto">
        <!-- Top bar -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <button id="btn-exit-study" class="text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/80 px-2.5 py-1.5 rounded-xl flex items-center gap-1 active:scale-95 transition shadow-sm" title="学習を終了して一覧に戻る (Esc)">
              <span>✕</span><span>終了</span>
            </button>
            <button id="btn-prev-top" class="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-2.5 py-1.5 rounded-xl flex items-center gap-1 active:scale-95 transition shadow-sm" title="一単語前に戻る (← / Backspace)">
              <span>←</span><span>前の単語</span>
            </button>
          </div>
          <div class="flex items-center gap-2">
            ${rankBadge}
            <div class="text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
              ${this.currentIndex + 1} / ${total}
            </div>
          </div>
          <button id="btn-audio-speak" class="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition shadow-sm active:scale-95" title="ネイティブ音声で再生">
            🔊
          </button>
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
          <div class="bg-indigo-600 h-full rounded-full transition-all duration-300" style="width: ${progressPercent}%;"></div>
        </div>

        <!-- Flip Card Container (Reliable, zero-glitch display) -->
        <div id="flashcard-container" class="relative w-full h-[390px] sm:h-[420px] min-h-[380px] cursor-pointer select-none">
          <!-- Card Front (English) -->
          <div id="card-front-face" class="${this.isFlipped ? 'hidden' : 'flex'} absolute inset-0 w-full h-full bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex-col justify-between select-none animate-card-flip overflow-y-auto no-scrollbar">
            <div class="flex justify-between items-center text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              <span class="uppercase font-bold tracking-wider ${isReview ? 'text-amber-600 dark:text-amber-400 font-extrabold' : ''}">
                ${isReview ? `🔥 REVIEW - ${card.deckName || '苦手克服'}` : `${this.currentDeckId} VOCABULARY`}
              </span>
              <span class="bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded-full">タップしてめくる 🔄</span>
            </div>

            <div class="text-center my-auto space-y-2 py-4">
              <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">${card.term}</h2>
              ${card.phonetic ? `<div class="text-sm text-gray-400 dark:text-gray-500 font-mono">${card.phonetic}</div>` : ''}
              ${card.partOfSpeech ? `<span class="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 font-mono">${card.partOfSpeech}</span>` : ''}
            </div>

            <div class="text-center text-xs text-gray-400 dark:text-gray-500">
              🔊 右上のスピーカーで発音を確認できます
            </div>
          </div>

          <!-- Card Back (Japanese, Core Image & Example) -->
          <div id="card-back-face" class="${this.isFlipped ? 'flex' : 'hidden'} absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-50/90 to-purple-50/90 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-5 rounded-2xl shadow-xl border-2 border-indigo-200 dark:border-indigo-800 flex-col justify-between select-none animate-card-flip overflow-y-auto no-scrollbar">
            <div class="flex justify-between items-center text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
              <span class="font-bold tracking-wider">MEANING & CORE IMAGE</span>
              <span class="bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full text-[11px]">タップして戻す 🔄</span>
            </div>

            <div class="my-auto space-y-2.5 py-1">
              <div class="text-center">
                <div class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-snug">${card.meaning}</div>
              </div>

              ${(card.coreImage || card.etymology) ? `
                <div class="bg-amber-50/95 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/60 rounded-xl p-3 text-left space-y-1.5 shadow-xs">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <span>💡</span>
                    <span>コアイメージ・語源</span>
                  </div>
                  ${card.etymology ? `
                    <div class="text-[11px] font-semibold text-amber-900 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-900/60 px-2.5 py-1 rounded-lg leading-normal flex items-start gap-1.5">
                      <span class="shrink-0">🧩</span>
                      <span>${card.etymology}</span>
                    </div>
                  ` : ''}
                  ${card.coreImage ? `
                    <p class="text-xs text-amber-950 dark:text-amber-100 leading-relaxed font-medium">
                      ${card.coreImage}
                    </p>
                  ` : ''}
                </div>
              ` : ''}

              ${card.example ? `
                <div class="bg-white/90 dark:bg-black/40 p-3 rounded-xl border border-indigo-100 dark:border-gray-700 text-left space-y-1 shadow-xs">
                  <p class="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">"${card.example}"</p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400 font-medium">${card.exampleJa || ''}</p>
                </div>
              ` : ''}
            </div>

            <div class="text-center text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
              覚えたら「覚えた！」を押しましょう
            </div>
          </div>
        </div>

        <!-- Mobile Touch Guide Hint -->
        <div class="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 px-1 select-none">
          <span>👉 右スワイプ: 前の単語</span>
          <span>タップ: めくる 🔄</span>
          <span>左スワイプ: 覚えた 👈</span>
        </div>

        <!-- Action Controls -->
        <div class="flex items-center gap-2 pt-1">
          <!-- 前の単語に戻るボタン -->
          <button id="btn-prev-card" class="py-3 px-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold text-sm shadow-sm transition active:scale-95 flex items-center justify-center gap-1" title="一単語前に戻る (← / Backspace)">
            <span>←</span> <span>前の単語</span>
          </button>
          <button id="btn-review" class="flex-1 py-3 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-bold text-sm shadow-sm hover:bg-amber-100 transition active:scale-95 flex items-center justify-center gap-1">
            <span>❌</span> ${isReview ? 'まだ要復習' : '要復習'}
          </button>
          <button id="btn-flip" class="py-3 px-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 font-bold text-sm hover:bg-indigo-100 transition active:scale-95">
            めくる 🔄
          </button>
          <button id="btn-know" class="flex-1 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-1">
            <span>✅</span> ${isReview ? '克服！ (+5 XP)' : '覚えた！ (+5 XP)'}
          </button>
        </div>
      </div>
    `;

    // Auto speak
    const settings = StorageService.getSettings();
    if (settings.autoSpeak) {
      SpeechService.speak(card.term);
    }

    // Handlers
    const cardContainer = container.querySelector('#flashcard-container');
    const frontFace = container.querySelector('#card-front-face');
    const backFace = container.querySelector('#card-back-face');

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let wasSwiped = false;

    // Mobile Swipe Gestures
    cardContainer?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      touchStartTime = Date.now();
      wasSwiped = false;
    }, { passive: true });

    cardContainer?.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      const elapsed = Date.now() - touchStartTime;

      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.2 && elapsed < 600) {
        wasSwiped = true;
        if (diffX > 0) {
          // Swipe Right: Go back to previous card
          if (this.currentIndex > 0) {
            this.prevCard(container, onExpGained);
          }
        } else {
          // Swipe Left: Mark Known & Next card
          StorageService.setCardStatus(card.id, 'known');
          SpeechService.playSound('correct');
          this.sessionKnown++;
          if (onExpGained) onExpGained(5);
          this.nextCard(container, onExpGained);
        }
      }
    }, { passive: true });

    const toggleFlip = () => {
      if (wasSwiped) {
        wasSwiped = false;
        return;
      }
      this.isFlipped = !this.isFlipped;
      if (frontFace && backFace) {
        if (this.isFlipped) {
          frontFace.classList.add('hidden');
          frontFace.classList.remove('flex');
          backFace.classList.remove('hidden');
          backFace.classList.add('flex', 'animate-card-flip');
        } else {
          backFace.classList.add('hidden');
          backFace.classList.remove('flex');
          frontFace.classList.remove('hidden');
          frontFace.classList.add('flex', 'animate-card-flip');
        }
      }
    };

    cardContainer?.addEventListener('click', toggleFlip);
    container.querySelector('#btn-flip')?.addEventListener('click', toggleFlip);

    container.querySelector('#btn-audio-speak')?.addEventListener('click', (e) => {
      e.stopPropagation();
      SpeechService.speak(card.term);
    });

    container.querySelector('#btn-prev-card')?.addEventListener('click', () => {
      this.prevCard(container, onExpGained);
    });

    container.querySelector('#btn-prev-top')?.addEventListener('click', () => {
      this.prevCard(container, onExpGained);
    });

    container.querySelector('#btn-exit-study')?.addEventListener('click', () => {
      this.removeKeyboardListener();
      if (this.returnViewMode === 'review_list') {
        this.exitToReviewList(container, onExpGained);
      } else if (isLarge) {
        this.exitToStages(container, onExpGained);
      } else {
        this.exitToDecks(container, onExpGained);
      }
    });

    container.querySelector('#btn-review')?.addEventListener('click', () => {
      StorageService.setCardStatus(card.id, 'review');
      SpeechService.playSound('wrong');
      this.sessionReview++;
      this.nextCard(container, onExpGained);
    });

    container.querySelector('#btn-know')?.addEventListener('click', () => {
      StorageService.setCardStatus(card.id, 'known');
      SpeechService.playSound('correct');
      this.sessionKnown++;
      if (onExpGained) onExpGained(5);
      this.nextCard(container, onExpGained);
    });

    this.attachKeyboardListener(container, onExpGained);
  }

  static keyHandler = null;

  static attachKeyboardListener(container, onExpGained) {
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
    }

    this.keyHandler = (e) => {
      if (this.viewMode !== 'study') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        this.prevCard(container, onExpGained);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        container.querySelector('#btn-exit-study')?.click();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        container.querySelector('#btn-flip')?.click();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        container.querySelector('#btn-know')?.click();
      } else if (e.key === '1' || e.key === 'ArrowDown') {
        e.preventDefault();
        container.querySelector('#btn-review')?.click();
      }
    };

    window.addEventListener('keydown', this.keyHandler);
  }

  static removeKeyboardListener() {
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }

  static prevCard(container, onExpGained) {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.isFlipped = false;
      this.renderStudyMode(container, onExpGained);
      return;
    }

    // 1問目 (currentIndex === 0) で「前の単語」が押された時:
    // デッキ内に前の単語が存在していれば、セッションの先頭に追加してスムーズに前の単語を表示する
    const currentCard = this.sessionCards && this.sessionCards[0];
    if (currentCard && this.activeDeckData && this.activeDeckData.length > 0) {
      const fullIdx = this.activeDeckData.findIndex(c => c.id === currentCard.id);
      if (fullIdx > 0) {
        const prevDeckCard = this.activeDeckData[fullIdx - 1];
        this.sessionCards.unshift(prevDeckCard);
        this.currentIndex = 0;
        this.isFlipped = false;
        this.renderStudyMode(container, onExpGained);
        return;
      }
    }

    // デッキの完全な先頭（第1問目）の場合のみ通知（勝手に一覧に戻ったりしない）
    if (window.linguaApp?.showToast) {
      window.linguaApp.showToast('これが最初の単語です 📖');
    }
  }

  static nextCard(container, onExpGained) {
    this.isFlipped = false;
    this.currentIndex++;
    if (this.currentIndex >= this.sessionCards.length) {
      this.removeKeyboardListener();
      this.viewMode = 'summary';
      this.renderSummaryMode(container, onExpGained);
    } else {
      this.renderStudyMode(container, onExpGained);
    }
  }

  static renderSummaryMode(container, onExpGained) {
    const total = this.sessionCards.length;
    const bonusExp = this.sessionKnown * 5 + 10;
    if (onExpGained) onExpGained(10);

    if (typeof window.confetti === 'function') {
      window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }

    const isReview = this.isReviewSession || this.currentDeckId === 'review_deck';
    const isLarge = !isReview && (this.currentDeckId === 'toeic' || this.currentDeckId === 'ielts');

    const progress = StorageService.getCardProgress();
    const sessionReviewCards = this.sessionCards.filter(c => progress[c.id]?.status === 'review');

    container.innerHTML = `
      <div class="max-w-md mx-auto text-center space-y-6 pb-20 pt-6">
        <div class="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div class="absolute inset-0 bg-emerald-500/25 rounded-2xl blur-lg animate-pulse"></div>
          <div class="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <svg class="w-10 h-10 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">学習セッション完了！お疲れ様でした</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">日々の継続が合格・ハイスコアへの一番の近道です！</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-500 dark:text-gray-400">学習したカード数</span>
            <span class="font-bold text-gray-900 dark:text-white">${total} 語</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-emerald-600 font-semibold">✅ 覚えた！</span>
            <span class="font-bold text-emerald-600">${this.sessionKnown} 語</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-amber-600 font-semibold">❌ 要復習</span>
            <span class="font-bold text-amber-600">${this.sessionReview} 語</span>
          </div>
          <div class="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm">
            <span class="font-semibold text-indigo-600 dark:text-indigo-400">獲得経験値</span>
            <span class="font-bold text-indigo-600 dark:text-indigo-400 text-base">+${bonusExp} XP 🌟</span>
          </div>
        </div>

        ${sessionReviewCards.length > 0 ? `
          <button id="btn-study-session-reviews" class="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2">
            <span>🔥</span> 今回「要復習」にした ${sessionReviewCards.length} 語だけを今すぐ再特訓
          </button>
        ` : ''}

        <div class="flex gap-3">
          <button id="btn-restart" class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold text-sm hover:bg-gray-200 transition">
            全問もう一度学習
          </button>
          <button id="btn-next-action" class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow">
            ${this.returnViewMode === 'review_list' ? '要復習リストに戻る' : (isLarge ? 'ステージ選択に戻る' : '単語帳一覧に戻る')}
          </button>
        </div>
      </div>
    `;

    container.querySelector('#btn-study-session-reviews')?.addEventListener('click', () => {
      this.startStudyCards(sessionReviewCards, container, onExpGained, 'review');
    });

    container.querySelector('#btn-restart')?.addEventListener('click', () => {
      this.currentIndex = 0;
      this.sessionKnown = 0;
      this.sessionReview = 0;
      this.viewMode = 'study';
      this.renderStudyMode(container, onExpGained);
    });

    container.querySelector('#btn-next-action')?.addEventListener('click', () => {
      if (this.returnViewMode === 'review_list') {
        this.exitToReviewList(container, onExpGained);
      } else if (isLarge) {
        this.viewMode = 'stages';
        this.renderStageSelector(container, onExpGained);
      } else {
        this.viewMode = 'decks';
        this.renderDeckList(container, onExpGained);
      }
    });
  }
}
