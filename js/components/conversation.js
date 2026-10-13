// AI Conversation Partner Component with Voice Input/Output and Grammar Feedback
import { conversationScenarios } from '../data/scenarios.js';
import { AIService } from '../services/ai.js';
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';

export class ConversationComponent {
  static currentScenario = null;
  static messages = []; // { id, sender: 'ai' | 'user', text, translationJa, tip, warning }
  static isRecording = false;
  static isThinking = false;
  static viewMode = 'scenarios'; // 'scenarios' | 'chat'

  static render(container, onExpGained) {
    if (this.viewMode === 'chat' && this.currentScenario) {
      this.renderChat(container, onExpGained);
    } else {
      this.renderScenarioList(container, onExpGained);
    }
  }

  static renderScenarioList(container, onExpGained) {
    const settings = StorageService.getSettings();
    let providerLabel = "デモ用AIシミュレータ（オフライン対応）";
    if (settings.aiProvider === 'gemini' && settings.apiKeyGemini) {
      providerLabel = `Gemini (${settings.geminiModel || 'gemini-1.5-flash'})`;
    } else if (settings.aiProvider === 'openai' && settings.apiKeyOpenAI) {
      providerLabel = `OpenAI (${settings.openaiModel || 'gpt-4o-mini'})`;
    }

    container.innerHTML = `
      <div class="space-y-6 pb-20">
        <div>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">AI英会話パートナー</h2>
            <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              ${providerLabel}
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">シチュエーションを選んで、音声またはテキストでネイティブAIと英会話を実践</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${conversationScenarios.map(sc => `
            <div class="scenario-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:border-purple-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between" data-id="${sc.id}">
              <div>
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-2xl flex items-center justify-center">
                    ${sc.icon}
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900 dark:text-white text-base">${sc.title}</h3>
                    <div class="text-[11px] text-purple-600 dark:text-purple-400 font-medium">相手: ${sc.aiRole}</div>
                  </div>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">${sc.description}</p>
              </div>

              <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                <span>会話を始める</span>
                <span>→</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.scenario-card').forEach(elem => {
      elem.addEventListener('click', () => {
        const id = elem.getAttribute('data-id');
        this.startConversation(id, container, onExpGained);
      });
    });
  }

  static startConversation(scenarioId, container, onExpGained) {
    const sc = conversationScenarios.find(s => s.id === scenarioId);
    if (!sc) return;

    this.currentScenario = sc;
    this.messages = [
      {
        id: 'msg_0',
        sender: 'ai',
        text: sc.initialMessage,
        translationJa: sc.initialMessageJa || '',
        tip: ''
      }
    ];
    this.isRecording = false;
    this.isThinking = false;
    this.viewMode = 'chat';
    this.renderChat(container, onExpGained);

    // Speak initial AI message
    const settings = StorageService.getSettings();
    if (settings.autoSpeak) {
      SpeechService.speak(sc.initialMessage);
    }
  }

  static renderChat(container, onExpGained) {
    const sc = this.currentScenario;

    container.innerHTML = `
      <div class="flex flex-col h-[calc(100vh-160px)] max-w-2xl mx-auto">
        <!-- Chat Header -->
        <div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-10">
          <div class="flex items-center space-x-3">
            <button id="btn-back-scenarios" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold p-1">
              ← 戻る
            </button>
            <div class="flex items-center space-x-2">
              <span class="text-2xl">${sc.icon}</span>
              <div>
                <h3 class="font-bold text-sm text-gray-900 dark:text-white">${sc.title}</h3>
                <div class="text-[10px] text-gray-500">${sc.aiRole} との会話</div>
              </div>
            </div>
          </div>

          <button id="btn-clear-chat" class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium">
            リセット
          </button>
        </div>

        <!-- Messages scroll container -->
        <div id="messages-container" class="flex-1 overflow-y-auto py-4 space-y-4 px-1">
          ${this.messages.map(m => this.renderMessageBubble(m)).join('')}

          ${this.isThinking ? `
            <div class="flex items-center space-x-2 text-gray-400 text-xs italic py-2">
              <div class="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-xs animate-pulse">🤖</div>
              <span>AIが考え中...</span>
            </div>
          ` : ''}
        </div>

        <!-- Input Bar -->
        <div class="pt-3 pb-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky bottom-0">
          <!-- Voice recording indicator -->
          <div id="recording-banner" class="${this.isRecording ? 'flex' : 'hidden'} items-center justify-between px-3 py-1.5 mb-2 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs animate-pulse">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
              <span>🎙️ 音声を聞き取っています... 英語でお話しください</span>
            </div>
            <button id="btn-cancel-recording" class="text-xs underline font-semibold">停止</button>
          </div>

          <form id="form-chat" class="flex items-center gap-2">
            <!-- Mic button -->
            <button type="button" id="btn-toggle-mic" class="p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${this.isRecording ? 'bg-rose-500 text-white border-rose-500 animate-pulse' : ''}" title="音声で入力">
              🎙️
            </button>

            <!-- Text input -->
            <input type="text" id="input-chat-text" placeholder="英語で返答を入力、またはマイクでお話しください..." class="flex-1 px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" autocomplete="off" />

            <!-- Send button -->
            <button type="submit" id="btn-send-message" class="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow transition active:scale-95 disabled:opacity-50">
              送信
            </button>
          </form>
        </div>
      </div>
    `;

    // Auto-scroll to bottom
    const msgContainer = container.querySelector('#messages-container');
    if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;

    // Attach listeners
    container.querySelector('#btn-back-scenarios')?.addEventListener('click', () => {
      this.viewMode = 'scenarios';
      SpeechService.stopSpeaking();
      SpeechService.stopListening();
      this.renderScenarioList(container, onExpGained);
    });

    container.querySelector('#btn-clear-chat')?.addEventListener('click', () => {
      this.startConversation(sc.id, container, onExpGained);
    });

    // Speak buttons inside bubbles
    container.querySelectorAll('.btn-speak-bubble').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        SpeechService.speak(text);
      });
    });

    // Translation toggles
    container.querySelectorAll('.btn-toggle-trans').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const elem = container.querySelector(`#${targetId}`);
        if (elem) elem.classList.toggle('hidden');
      });
    });

    // Microphone setup
    const micBtn = container.querySelector('#btn-toggle-mic');
    const inputField = container.querySelector('#input-chat-text');
    const recordingBanner = container.querySelector('#recording-banner');

    SpeechService.initSpeechRecognition(
      (transcript, isFinal) => {
        inputField.value = transcript;
        if (isFinal) {
          this.isRecording = false;
          micBtn.classList.remove('bg-rose-500', 'text-white', 'border-rose-500', 'animate-pulse');
          recordingBanner.classList.add('hidden');
        }
      },
      (error) => {
        console.warn('Speech recognition error:', error);
        this.isRecording = false;
        micBtn.classList.remove('bg-rose-500', 'text-white', 'border-rose-500', 'animate-pulse');
        recordingBanner.classList.add('hidden');
      },
      () => {
        this.isRecording = false;
        micBtn.classList.remove('bg-rose-500', 'text-white', 'border-rose-500', 'animate-pulse');
        recordingBanner.classList.add('hidden');
      }
    );

    micBtn?.addEventListener('click', () => {
      if (!this.isRecording) {
        const started = SpeechService.startListening();
        if (started) {
          this.isRecording = true;
          micBtn.classList.add('bg-rose-500', 'text-white', 'border-rose-500', 'animate-pulse');
          recordingBanner.classList.remove('hidden');
        } else {
          alert('お使いのブラウザでは音声認識がサポートされていないか、マイクの許可が必要です。');
        }
      } else {
        SpeechService.stopListening();
        this.isRecording = false;
        micBtn.classList.remove('bg-rose-500', 'text-white', 'border-rose-500', 'animate-pulse');
        recordingBanner.classList.add('hidden');
      }
    });

    container.querySelector('#btn-cancel-recording')?.addEventListener('click', () => {
      SpeechService.stopListening();
      this.isRecording = false;
      micBtn.classList.remove('bg-rose-500', 'text-white', 'border-rose-500', 'animate-pulse');
      recordingBanner.classList.add('hidden');
    });

    // Chat submit
    const chatForm = container.querySelector('#form-chat');
    chatForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = inputField.value.trim();
      if (!text || this.isThinking) return;

      inputField.value = '';
      this.messages.push({
        id: 'msg_' + Date.now(),
        sender: 'user',
        text
      });

      this.isThinking = true;
      this.renderChat(container, onExpGained);

      // Award EXP for speaking/chatting
      if (onExpGained) onExpGained(10);
      const stats = StorageService.getStats();
      stats.conversationsCompleted = (stats.conversationsCompleted || 0) + 1;
      StorageService.saveStats(stats);

      try {
        const response = await AIService.sendMessage({
          scenario: sc,
          conversationHistory: this.messages,
          userMessage: text
        });

        this.messages.push({
          id: 'msg_' + Date.now(),
          sender: 'ai',
          text: response.reply,
          translationJa: response.translationJa || '',
          tip: response.tip || '',
          warning: response.warning || ''
        });

        const settings = StorageService.getSettings();
        if (settings.autoSpeak) {
          SpeechService.speak(response.reply);
        }
      } catch (err) {
        console.error(err);
        this.messages.push({
          id: 'msg_' + Date.now(),
          sender: 'ai',
          text: "I didn't quite catch that. Could you say that again?",
          tip: "通信エラーが発生しました。"
        });
      } finally {
        this.isThinking = false;
        this.renderChat(container, onExpGained);
      }
    });
  }

  static renderMessageBubble(msg) {
    const isUser = msg.sender === 'user';

    if (isUser) {
      return `
        <div class="flex justify-end">
          <div class="max-w-[85%] bg-purple-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm space-y-1">
            <p class="text-sm font-medium leading-relaxed">${msg.text}</p>
          </div>
        </div>
      `;
    }

    // AI message
    const transId = 'trans_' + msg.id;
    return `
      <div class="flex items-start space-x-2.5 max-w-[90%]">
        <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center text-sm flex-shrink-0 mt-1">
          🤖
        </div>

        <div class="space-y-2 flex-1">
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm p-4 shadow-sm space-y-2">
            ${msg.warning ? `
              <div class="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md">
                ${msg.warning}
              </div>
            ` : ''}

            <p class="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
              ${msg.text}
            </p>

            <div class="flex items-center space-x-3 pt-1 border-t border-gray-100 dark:border-gray-700/60 text-xs">
              <button class="btn-speak-bubble text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-1 font-semibold" data-text="${encodeURIComponent(msg.text)}">
                🔊 音声
              </button>
              ${msg.translationJa ? `
                <button class="btn-toggle-trans text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium" data-target="${transId}">
                  🌐 日本語訳
                </button>
              ` : ''}
            </div>

            ${msg.translationJa ? `
              <div id="${transId}" class="hidden text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
                ${msg.translationJa}
              </div>
            ` : ''}
          </div>

          <!-- Native Tip Box -->
          ${msg.tip ? `
            <div class="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200 shadow-sm flex items-start space-x-2">
              <span class="text-base flex-shrink-0">💡</span>
              <div class="leading-relaxed">
                <span class="font-bold">ネイティブ表現アドバイス:</span> ${msg.tip}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}
