// Grammar & Practice Quiz Component with Stage Progression (Stages 1-4, 20 questions each)
import { grammarCategories, loadGrammarQuestions } from '../data/grammar.js';
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';

export class GrammarComponent {
  static currentCategory = 'all';
  static currentStage = 1;
  static questions = [];
  static currentIndex = 0;
  static userAnswers = []; // { question, selectedIdx, isCorrect }
  static isAnswered = false;
  static viewMode = 'menu'; // 'menu' | 'stages' | 'quiz' | 'result'

  static render(container, onExpGained) {
    if (this.viewMode === 'stages') {
      this.renderStageSelector(container, onExpGained);
    } else if (this.viewMode === 'quiz') {
      this.renderQuizQuestion(container, onExpGained);
    } else if (this.viewMode === 'result') {
      this.renderQuizResult(container, onExpGained);
    } else {
      this.renderMenu(container, onExpGained);
    }
  }

  // 1. Menu: Category List
  static renderMenu(container, onExpGained) {
    this.viewMode = 'menu';
    const history = StorageService.getQuizHistory();
    const mistakesCount = (history.mistakes || []).length;
    const recentScores = history.scores || [];
    const stageProgress = StorageService.getGrammarStageProgress();

    // Count total passed stages across all categories
    let totalStagesPassed = 0;
    Object.values(stageProgress).forEach(st => {
      if (st.passed) totalStagesPassed++;
    });

    container.innerHTML = `
      <div class="space-y-6 pb-20">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">英文法・穴埋め実戦テスト</h2>
            <span class="text-[11px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 px-2.5 py-0.5 rounded-full font-bold">
              全14単元・全56ステージ (1,120問)
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            TOEIC・IELTS高得点に必要な文法項目を完全網羅。Stage 1からStage 4まで段階別に約20問ずつ着実に制覇できます。
          </p>
        </div>

        <!-- Mastery Overview Banner -->
        <div class="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-5 text-white shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[11px] uppercase tracking-wider text-indigo-200 font-bold">文法制覇ステータス</span>
              <div class="text-2xl font-black mt-0.5">${totalStagesPassed} / 56 <span class="text-xs font-semibold text-indigo-200">ステージクリア</span></div>
            </div>
            <div class="text-right">
              <span class="text-xs text-indigo-200">全体の進捗率</span>
              <div class="text-lg font-bold">${Math.round((totalStagesPassed / 56) * 100)}%</div>
            </div>
          </div>
          <div class="w-full bg-white/20 h-2 rounded-full mt-3 overflow-hidden">
            <div class="bg-emerald-400 h-full rounded-full transition-all duration-500" style="width: ${Math.round((totalStagesPassed / 56) * 100)}%;"></div>
          </div>
        </div>

        <!-- Review Mistakes Banner (if any) -->
        ${mistakesCount > 0 ? `
          <div class="bg-gradient-to-r from-rose-500 to-amber-500 rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
            <div>
              <div class="text-xs text-rose-100 font-medium">弱点克服モード</div>
              <div class="text-base font-bold mt-0.5">${mistakesCount} 問の復習問題があります</div>
            </div>
            <button id="btn-start-mistakes" class="bg-white text-rose-600 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow hover:bg-rose-50 transition active:scale-95">
              間違えた問題を復習
            </button>
          </div>
        ` : ''}

        <!-- Category Grid -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200">単元別カテゴリ（全14分野）</h3>
            <span class="text-[11px] text-gray-500 dark:text-gray-400">各単元 4ステージ（計80問）</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${grammarCategories.map(cat => {
              const isAll = cat.id === 'all';
              if (isAll) {
                return `
                  <div class="category-card bg-white dark:bg-gray-800 border border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/20 rounded-xl p-4 shadow-sm hover:border-indigo-500 hover:shadow-md transition cursor-pointer flex items-center justify-between sm:col-span-2" data-category="${cat.id}">
                    <div class="flex items-center space-x-3.5 flex-1 min-w-0 pr-2">
                      <div class="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl flex-shrink-0">
                        ${cat.icon || '🌐'}
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                          <span>${cat.name}</span>
                          <span class="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">実戦形式20問</span>
                        </div>
                        <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">${cat.desc}</div>
                        <div class="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">全単元からランダム出題で実力判定</div>
                      </div>
                    </div>
                    <span class="text-xs text-white font-bold bg-indigo-600 px-3.5 py-2 rounded-xl shadow-sm hover:bg-indigo-700 transition flex-shrink-0">
                      総合テスト開始 →
                    </span>
                  </div>
                `;
              }

              const prog = StorageService.getGrammarCategoryProgress(cat.id);
              const isFinished = prog.isCompleted;

              return `
                <div class="category-card bg-white dark:bg-gray-800 border ${isFinished ? 'border-emerald-300 dark:border-emerald-700/80 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-gray-200 dark:border-gray-700'} rounded-xl p-4 shadow-sm hover:border-indigo-500 hover:shadow-md transition cursor-pointer flex items-center justify-between" data-category="${cat.id}">
                  <div class="flex items-center space-x-3.5 flex-1 min-w-0 pr-2">
                    <div class="w-11 h-11 rounded-xl ${isFinished ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'} flex items-center justify-center text-xl flex-shrink-0">
                      ${isFinished ? '👑' : (cat.icon || '📝')}
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 truncate">
                        <span>${cat.name}</span>
                        ${isFinished ? '<span class="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">全制覇</span>' : ''}
                      </div>
                      <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">${cat.desc || ''}</div>
                      <div class="flex items-center gap-2 mt-1.5">
                        <div class="w-20 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                          <div class="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full" style="width: ${(prog.passedStages / 4) * 100}%;"></div>
                        </div>
                        <span class="text-[10px] text-gray-600 dark:text-gray-400 font-semibold">${prog.passedStages}/4 クリア (全80問)</span>
                      </div>
                    </div>
                  </div>
                  <span class="text-xs text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1.5 rounded-lg flex-shrink-0">
                    選択 →
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Recent Scores -->
        ${recentScores.length > 0 ? `
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3">最近の受験履歴</h3>
            <div class="space-y-2">
              ${recentScores.slice(0, 3).map(s => `
                <div class="flex items-center justify-between text-xs py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span class="text-gray-600 dark:text-gray-300 font-medium">${grammarCategories.find(c => c.id === s.category)?.name || '総合'}</span>
                  <div class="flex items-center gap-3">
                    <span class="font-bold text-gray-900 dark:text-white">${s.score} / ${s.total} (${s.percentage}%)</span>
                    <span class="text-[11px] px-2 py-0.5 rounded font-bold ${s.percentage >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}">${s.percentage >= 80 ? '合格 🎉' : '復習推奨'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Category click handler
    container.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const catId = card.getAttribute('data-category');
        if (catId === 'all') {
          this.startQuiz('all', null, container, onExpGained);
        } else {
          this.openCategoryStages(catId, container, onExpGained);
        }
      });
    });

    // Mistakes handler
    container.querySelector('#btn-start-mistakes')?.addEventListener('click', () => {
      if (!history.mistakes || history.mistakes.length === 0) return;
      this.currentCategory = 'mistakes';
      this.currentStage = null;
      this.questions = [...history.mistakes];
      this.currentIndex = 0;
      this.userAnswers = [];
      this.isAnswered = false;
      this.viewMode = 'quiz';
      window.history.pushState({ tab: 'grammar', view: 'quiz', category: 'mistakes' }, '', '#grammar');
      this.renderQuizQuestion(container, onExpGained);
    });
  }

  // 2. Stages Selector View: 4 Stages for chosen category
  static openCategoryStages(categoryId, container, onExpGained, pushState = true) {
    this.currentCategory = categoryId;
    this.viewMode = 'stages';
    if (pushState) {
      window.history.pushState({ tab: 'grammar', view: 'stages', category: categoryId }, '', '#grammar');
    }
    this.renderStageSelector(container, onExpGained);
  }

  static renderStageSelector(container, onExpGained) {
    const cat = grammarCategories.find(c => c.id === this.currentCategory);
    if (!cat) {
      this.exitToMenu(container, onExpGained);
      return;
    }

    const stageProgress = StorageService.getGrammarStageProgress();
    const catProg = StorageService.getGrammarCategoryProgress(cat.id);

    container.innerHTML = `
      <div class="space-y-6 pb-20 max-w-2xl mx-auto">
        <!-- Back Navigation & Title -->
        <div class="flex items-center justify-between">
          <button id="btn-back-to-categories" class="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition py-1 px-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
            <span>←</span>
            <span>単元一覧に戻る</span>
          </button>
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">4ステージ（全80問）</span>
        </div>

        <!-- Category Header Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center space-x-4">
            <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
              ${cat.icon || '📖'}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white truncate">${cat.name}</h2>
                ${catProg.isCompleted ? '<span class="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">全制覇 👑</span>' : ''}
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">${cat.desc}</p>
            </div>
          </div>

          <!-- Progress summary inside header -->
          <div class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/80 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="font-bold text-gray-700 dark:text-gray-300">達成度:</span>
              <span class="font-bold text-indigo-600 dark:text-indigo-400">${catProg.passedStages} / 4 ステージクリア</span>
            </div>
            <div class="w-32 bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div class="bg-indigo-600 h-full rounded-full transition-all duration-300" style="width: ${(catProg.passedStages / 4) * 100}%;"></div>
            </div>
          </div>
        </div>

        <!-- Stages List (1 to 4) -->
        <div class="space-y-3.5">
          ${(cat.stages || []).map(stg => {
            const stageKey = `${cat.id}_s${stg.stage}`;
            const prog = stageProgress[stageKey];
            const isPassed = prog && prog.passed;
            const isPerfect = prog && prog.perfect;

            let badgeHtml = '';
            if (isPerfect) {
              badgeHtml = `<span class="text-[11px] bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">👑 満点 (20/20)</span>`;
            } else if (isPassed) {
              badgeHtml = `<span class="text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">✅ 合格 (${prog.score}/${prog.total})</span>`;
            } else if (prog) {
              badgeHtml = `<span class="text-[11px] bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 px-2.5 py-0.5 rounded-full font-bold">要復習 (${prog.score}/${prog.total})</span>`;
            } else {
              badgeHtml = `<span class="text-[11px] bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2.5 py-0.5 rounded-full font-medium">未挑戦</span>`;
            }

            return `
              <div class="stage-card bg-white dark:bg-gray-800 border ${isPassed ? 'border-emerald-300 dark:border-emerald-800/80 shadow-xs' : 'border-gray-200 dark:border-gray-700'} rounded-2xl p-5 hover:border-indigo-400 hover:shadow-md transition cursor-pointer" data-stage="${stg.stage}">
                <div class="flex items-start justify-between gap-3">
                  <div class="space-y-1.5 flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="w-6 h-6 rounded-md bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                        ${stg.stage}
                      </span>
                      <h3 class="font-bold text-gray-900 dark:text-white text-base">${stg.name}</h3>
                      ${badgeHtml}
                    </div>
                    <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">${stg.desc}</p>
                    <div class="flex items-center gap-3 pt-1">
                      <span class="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded">
                        🎯 目標: ${stg.target}
                      </span>
                      <span class="text-[11px] text-gray-400 font-medium">約20問 / 即時解説つき</span>
                    </div>
                  </div>

                  <button class="btn-start-stage bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition active:scale-95 flex-shrink-0 mt-1">
                    ${isPassed ? '再挑戦 →' : '開始する →'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Back button
    container.querySelector('#btn-back-to-categories')?.addEventListener('click', () => {
      this.exitToMenu(container, onExpGained);
    });

    // Stage cards click
    container.querySelectorAll('.stage-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const stageNum = parseInt(card.getAttribute('data-stage'));
        this.startQuiz(this.currentCategory, stageNum, container, onExpGained);
      });
    });
  }

  // 3. Start Quiz: loads questions and enters quiz mode
  static async startQuiz(categoryId, stageNum, container, onExpGained, pushState = true) {
    this.currentCategory = categoryId;
    this.currentStage = stageNum;

    // Show temporary loading UI if network fetch takes a split second
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-24 space-y-4">
        <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs text-gray-500 font-bold">問題を読み込んでいます...</p>
      </div>
    `;

    try {
      let pool = await loadGrammarQuestions(categoryId, stageNum);

      if (categoryId === 'all') {
        // Select 20 questions randomly for comprehensive test
        pool = [...pool].sort(() => Math.random() - 0.5).slice(0, 20);
      } else {
        // Stage test: exactly 20 questions
        pool = [...pool];
      }

      this.questions = pool;
      this.currentIndex = 0;
      this.userAnswers = [];
      this.isAnswered = false;
      this.viewMode = 'quiz';

      if (pushState) {
        window.history.pushState({
          tab: 'grammar',
          view: 'quiz',
          category: categoryId,
          stage: stageNum
        }, '', '#grammar');
      }

      this.renderQuizQuestion(container, onExpGained);
    } catch (err) {
      console.error('Failed to start grammar quiz:', err);
      container.innerHTML = `
        <div class="text-center py-20 space-y-4">
          <p class="text-sm text-rose-500 font-bold">問題データの取得に失敗しました。</p>
          <button id="btn-reload-quiz" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">再試行</button>
        </div>
      `;
      container.querySelector('#btn-reload-quiz')?.addEventListener('click', () => {
        this.startQuiz(categoryId, stageNum, container, onExpGained);
      });
    }
  }

  // 4. Render Quiz Question
  static renderQuizQuestion(container, onExpGained) {
    if (!this.questions || this.questions.length === 0) {
      this.exitToMenu(container, onExpGained);
      return;
    }

    const q = this.questions[this.currentIndex];
    const total = this.questions.length;
    const progressPercent = Math.round((this.currentIndex / total) * 100);

    const cat = grammarCategories.find(c => c.id === this.currentCategory);
    const catName = cat ? cat.name : (this.currentCategory === 'mistakes' ? '弱点復習' : '総合実戦');
    const stageLabel = this.currentStage ? `Stage ${this.currentStage}` : '';

    container.innerHTML = `
      <div class="space-y-5 pb-20 max-w-lg mx-auto">
        <!-- Top Navigation -->
        <div class="flex items-center justify-between">
          <button id="btn-exit-quiz" class="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1">
            <span>✕</span>
            <span>中断</span>
          </button>
          <div class="text-xs font-bold text-gray-700 dark:text-gray-300">
            <span class="text-indigo-600 dark:text-indigo-400 mr-1">${catName}${stageLabel ? ' ' + stageLabel : ''}</span>
            <span>第 ${this.currentIndex + 1} / ${total} 問</span>
          </div>
          <button id="btn-speak-question" class="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition" title="英文音声を聴く">
            🔊
          </button>
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
          <div class="bg-indigo-600 h-full rounded-full transition-all duration-300" style="width: ${progressPercent}%;"></div>
        </div>

        <!-- Question Box -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md">
              ${q.title || '英文法・空欄補充'}
            </span>
            <span class="text-[11px] text-gray-400 font-semibold uppercase">
              ${q.level || 'Standard'}
            </span>
          </div>

          <p class="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">
            ${q.question}
          </p>
        </div>

        <!-- Options List -->
        <div class="space-y-2.5" id="options-container">
          ${q.options.map((opt, idx) => `
            <button class="option-btn w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-left flex items-center justify-between transition hover:border-indigo-400" data-idx="${idx}">
              <div class="flex items-center space-x-3">
                <span class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                  ${String.fromCharCode(65 + idx)}
                </span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">${opt}</span>
              </div>
              <span class="option-icon text-lg hidden"></span>
            </button>
          `).join('')}
        </div>

        <!-- Feedback & Explanation (revealed after answering) -->
        <div id="explanation-box" class="hidden bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5 space-y-3">
          <div class="flex items-center justify-between">
            <span id="explanation-badge" class="font-bold text-sm"></span>
            <span class="text-xs text-indigo-600 dark:text-indigo-400 font-bold bg-white dark:bg-gray-800 px-2.5 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-700 shadow-2xs">💡 試験攻略・文法解説</span>
          </div>

          <div class="space-y-2 text-xs text-gray-700 dark:text-gray-300">
            <div class="bg-white/90 dark:bg-black/30 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <span class="font-bold text-indigo-900 dark:text-indigo-200">日本語訳:</span>
              <p class="mt-0.5 text-gray-900 dark:text-white leading-relaxed font-medium">${q.translation || ''}</p>
            </div>
            <div class="p-1 leading-relaxed text-gray-800 dark:text-gray-200 text-xs">
              ${q.explanation || ''}
            </div>
          </div>

          <div class="pt-2">
            <button id="btn-next-question" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow transition active:scale-95">
              ${this.currentIndex + 1 >= total ? '結果を見る 📊' : '次の問題へ →'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Exit handler
    container.querySelector('#btn-exit-quiz')?.addEventListener('click', () => {
      this.exitCurrentQuiz(container, onExpGained);
    });

    // TTS Speak Question
    container.querySelector('#btn-speak-question')?.addEventListener('click', () => {
      const readable = q.question.replace(/_{2,}/g, 'blank');
      SpeechService.speak(readable);
    });

    // Option Clicks
    const optionButtons = container.querySelectorAll('.option-btn');
    const explanationBox = container.querySelector('#explanation-box');
    const explanationBadge = container.querySelector('#explanation-badge');

    const correctIndex = q.correctIndex !== undefined ? q.correctIndex : q.answer;

    optionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isAnswered) return;
        this.isAnswered = true;

        const selectedIdx = parseInt(btn.getAttribute('data-idx'));
        const isCorrect = selectedIdx === correctIndex;

        this.userAnswers.push({
          question: q,
          selectedIdx,
          isCorrect
        });

        // Style buttons
        optionButtons.forEach((b, idx) => {
          b.disabled = true;
          const iconSpan = b.querySelector('.option-icon');
          iconSpan.classList.remove('hidden');

          if (idx === correctIndex) {
            b.classList.remove('bg-white', 'dark:bg-gray-800', 'border-gray-200', 'dark:border-gray-700');
            b.classList.add('bg-emerald-50', 'dark:bg-emerald-950/60', 'border-emerald-500', 'text-emerald-800', 'dark:text-emerald-200');
            iconSpan.textContent = '✅';
          } else if (idx === selectedIdx && !isCorrect) {
            b.classList.remove('bg-white', 'dark:bg-gray-800', 'border-gray-200', 'dark:border-gray-700');
            b.classList.add('bg-rose-50', 'dark:bg-rose-950/60', 'border-rose-500', 'text-rose-800', 'dark:text-rose-200');
            iconSpan.textContent = '❌';
          }
        });

        // Sound & EXP
        if (isCorrect) {
          SpeechService.playSound('correct');
          explanationBadge.className = 'font-bold text-sm text-emerald-600 dark:text-emerald-400';
          explanationBadge.textContent = '🎉 正解！ (+10 XP)';
          if (onExpGained) onExpGained(10);

          if (this.currentCategory === 'mistakes') {
            StorageService.removeMistake(q.id);
          }
        } else {
          SpeechService.playSound('wrong');
          explanationBadge.className = 'font-bold text-sm text-rose-600 dark:text-rose-400';
          explanationBadge.textContent = '😢 不正解';
        }

        explanationBox.classList.remove('hidden');
      });
    });

    // Next Question Button
    container.querySelector('#btn-next-question')?.addEventListener('click', () => {
      this.currentIndex++;
      this.isAnswered = false;
      if (this.currentIndex >= total) {
        this.viewMode = 'result';
        this.renderQuizResult(container, onExpGained);
      } else {
        this.renderQuizQuestion(container, onExpGained);
      }
    });
  }

  // 5. Render Quiz Result: saves stage result and offers next actions
  static renderQuizResult(container, onExpGained) {
    const total = this.questions.length;
    const correctCount = this.userAnswers.filter(a => a.isCorrect).length;
    const percentage = Math.round((correctCount / total) * 100);
    const wrongQuestions = this.userAnswers.filter(a => !a.isCorrect).map(a => a.question);
    const isPassed = percentage >= 70;
    const isPerfect = percentage === 100;

    // Save stage result if playing a specific stage
    if (this.currentCategory !== 'all' && this.currentCategory !== 'mistakes' && this.currentStage) {
      StorageService.saveGrammarStageResult(this.currentCategory, this.currentStage, correctCount, total);
    }

    // Save to global history for statistics & mistakes
    StorageService.saveQuizResult({
      category: this.currentCategory,
      total,
      score: correctCount,
      wrongQuestions
    });

    // Bonus EXP for completing 20 questions
    if (onExpGained) onExpGained(20);

    if (isPassed && typeof window.confetti === 'function') {
      window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }

    const cat = grammarCategories.find(c => c.id === this.currentCategory);
    const catName = cat ? cat.name : (this.currentCategory === 'mistakes' ? '弱点復習' : '総合実戦');
    const stageLabel = this.currentStage ? `Stage ${this.currentStage}` : '';

    container.innerHTML = `
      <div class="max-w-md mx-auto text-center space-y-6 pb-20 pt-4">
        <!-- Result Icon Badge -->
        <div class="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div class="absolute inset-0 ${isPassed ? 'bg-amber-500/25 animate-pulse' : 'bg-rose-500/25'} rounded-2xl blur-lg"></div>
          <div class="relative w-20 h-20 rounded-2xl bg-gradient-to-tr ${isPassed ? 'from-amber-500 via-amber-400 to-yellow-300' : 'from-gray-600 to-gray-400'} flex items-center justify-center shadow-lg">
            <span class="text-4xl">${isPerfect ? '👑' : (isPassed ? '🎉' : '📖')}</span>
          </div>
        </div>

        <div>
          <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
            ${catName} ${stageLabel}
          </span>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            ${isPerfect ? 'パーフェクト達成！' : (isPassed ? 'ステージ合格！' : 'テスト終了')}
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ${isPassed ? '合格基準（70%以上）をクリアしました！' : '合格基準は70%です。間違えた問題を見直して再挑戦しましょう！'}
          </p>
        </div>

        <!-- Score Box -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div class="text-4xl font-extrabold ${isPassed ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}">
            ${percentage}%
          </div>

          <div class="flex justify-around border-t border-gray-100 dark:border-gray-700 pt-3 text-sm">
            <div>
              <div class="text-xs text-gray-400">正解数</div>
              <div class="font-bold text-emerald-600 mt-0.5">${correctCount} / ${total} 問</div>
            </div>
            <div>
              <div class="text-xs text-gray-400">不正解</div>
              <div class="font-bold text-rose-500 mt-0.5">${total - correctCount} 問</div>
            </div>
            <div>
              <div class="text-xs text-gray-400">獲得経験値</div>
              <div class="font-bold text-indigo-600 mt-0.5">+${correctCount * 10 + 20} XP</div>
            </div>
          </div>
        </div>

        <!-- Wrong questions summary if any -->
        ${wrongQuestions.length > 0 ? `
          <div class="text-left bg-rose-50/50 dark:bg-rose-950/20 rounded-xl p-4 border border-rose-200 dark:border-rose-900">
            <div class="text-xs font-bold text-rose-700 dark:text-rose-300 mb-2">間違えた問題（弱点克服リストに追加されました）:</div>
            <ul class="text-xs space-y-2 text-gray-700 dark:text-gray-300">
              ${wrongQuestions.map(w => `
                <li class="border-b border-rose-100 dark:border-rose-900/40 pb-1.5 last:border-0">
                  <div class="font-bold text-gray-900 dark:text-white">${w.title}</div>
                  <div class="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">${w.question}</div>
                  <div class="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">正解: ${w.options[w.correctIndex !== undefined ? w.correctIndex : w.answer]}</div>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Actions -->
        <div class="space-y-2 pt-2">
          ${this.currentStage && this.currentStage < 4 && isPassed ? `
            <button id="btn-next-stage" class="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:opacity-95 transition shadow-md active:scale-98">
              次のステージ (Stage ${this.currentStage + 1}) へ進む 🚀
            </button>
          ` : ''}

          <div class="flex gap-2">
            <button id="btn-retry" class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold text-xs hover:bg-gray-200 transition">
              もう一度挑戦 🔄
            </button>

            ${this.currentCategory !== 'all' && this.currentCategory !== 'mistakes' ? `
              <button id="btn-back-stages" class="flex-1 py-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl font-bold text-xs hover:bg-indigo-100 transition">
                ステージ一覧 📋
              </button>
            ` : ''}

            <button id="btn-back-menu" class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition shadow">
              単元一覧 🏠
            </button>
          </div>
        </div>
      </div>
    `;

    // Next Stage
    container.querySelector('#btn-next-stage')?.addEventListener('click', () => {
      this.startQuiz(this.currentCategory, this.currentStage + 1, container, onExpGained);
    });

    // Retry
    container.querySelector('#btn-retry')?.addEventListener('click', () => {
      this.startQuiz(this.currentCategory, this.currentStage, container, onExpGained);
    });

    // Back to Stages
    container.querySelector('#btn-back-stages')?.addEventListener('click', () => {
      this.openCategoryStages(this.currentCategory, container, onExpGained);
    });

    // Back to Menu
    container.querySelector('#btn-back-menu')?.addEventListener('click', () => {
      this.exitToMenu(container, onExpGained);
    });
  }

  // Navigation exits
  static exitCurrentQuiz(container, onExpGained) {
    if (this.currentCategory && this.currentCategory !== 'all' && this.currentCategory !== 'mistakes') {
      this.exitToStages(container, onExpGained);
    } else {
      this.exitToMenu(container, onExpGained);
    }
  }

  static exitToStages(container, onExpGained) {
    if (this.currentCategory && this.currentCategory !== 'all' && this.currentCategory !== 'mistakes') {
      this.viewMode = 'stages';
      this.renderStageSelector(container, onExpGained);
    } else {
      this.exitToMenu(container, onExpGained);
    }
  }

  static exitToMenu(container, onExpGained) {
    this.viewMode = 'menu';
    this.currentCategory = 'all';
    this.currentStage = 1;
    this.renderMenu(container, onExpGained);
  }
}
