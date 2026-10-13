// Settings Component: AI Keys, Speech Audio Options, Data Export/Import, and Theme
import { StorageService } from '../services/storage.js';
import { SpeechService } from '../services/speech.js';

export class SettingsComponent {
  static render(container, onSettingsChanged) {
    const settings = StorageService.getSettings();

    container.innerHTML = `
      <div class="space-y-6 pb-20 max-w-xl mx-auto">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">設定 (Settings)</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">AIモデルの連携、発音音声のカスタマイズ、学習データの管理</p>
        </div>

        <!-- AI Configuration Section -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div class="flex items-center space-x-2 border-b border-gray-100 dark:border-gray-700 pb-3">
            <span class="text-xl">🤖</span>
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">AI英会話エンジン設定</h3>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">利用するAIバックエンド</label>
            <select id="select-ai-provider" class="w-full px-3 py-2 text-sm border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="mock" ${settings.aiProvider === 'mock' ? 'selected' : ''}>デモAIシミュレータ（APIキー不要・即座にお試し）</option>
              <option value="gemini" ${settings.aiProvider === 'gemini' ? 'selected' : ''}>Google Gemini API (推奨・無料枠充実)</option>
              <option value="openai" ${settings.aiProvider === 'openai' ? 'selected' : ''}>OpenAI API (GPT-4o mini 等)</option>
            </select>
          </div>

          <!-- Gemini Settings -->
          <div id="gemini-fields" class="space-y-3 ${settings.aiProvider === 'gemini' ? '' : 'hidden'} bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Gemini API Key</label>
              <div class="relative">
                <input type="password" id="input-gemini-key" value="${settings.apiKeyGemini || ''}" placeholder="AIzaSy..." class="w-full px-3 py-2 pr-10 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                <button type="button" class="btn-toggle-eye absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs" data-target="input-gemini-key">👁️</button>
              </div>
              <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                ※ Google AI Studio (aistudio.google.com) で無料取得できます。キーはブラウザ内(LocalStorage)にのみ保存されます。
              </p>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">使用モデル</label>
              <select id="select-gemini-model" class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none">
                <option value="gemini-1.5-flash" ${settings.geminiModel === 'gemini-1.5-flash' ? 'selected' : ''}>gemini-1.5-flash (高速・推奨)</option>
                <option value="gemini-2.0-flash" ${settings.geminiModel === 'gemini-2.0-flash' ? 'selected' : ''}>gemini-2.0-flash (最新)</option>
              </select>
            </div>
          </div>

          <!-- OpenAI Settings -->
          <div id="openai-fields" class="space-y-3 ${settings.aiProvider === 'openai' ? '' : 'hidden'} bg-purple-50/50 dark:bg-purple-950/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/50">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">OpenAI API Key</label>
              <div class="relative">
                <input type="password" id="input-openai-key" value="${settings.apiKeyOpenAI || ''}" placeholder="sk-..." class="w-full px-3 py-2 pr-10 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                <button type="button" class="btn-toggle-eye absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs" data-target="input-openai-key">👁️</button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">使用モデル</label>
              <select id="select-openai-model" class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none">
                <option value="gpt-4o-mini" ${settings.openaiModel === 'gpt-4o-mini' ? 'selected' : ''}>gpt-4o-mini (安価・高速)</option>
                <option value="gpt-4o" ${settings.openaiModel === 'gpt-4o' ? 'selected' : ''}>gpt-4o</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Speech & Audio Section -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div class="flex items-center space-x-2 border-b border-gray-100 dark:border-gray-700 pb-3">
            <span class="text-xl">🔊</span>
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">ネイティブ音声・発音設定</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">英語アクセント</label>
              <select id="select-voice-lang" class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none">
                <option value="en-US" ${settings.voiceLang === 'en-US' ? 'selected' : ''}>🇺🇸 アメリカ英語 (en-US)</option>
                <option value="en-GB" ${settings.voiceLang === 'en-GB' ? 'selected' : ''}>🇬🇧 イギリス英語 (en-GB)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">再生スピード</label>
              <select id="select-voice-rate" class="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none">
                <option value="0.8" ${settings.voiceRate === 0.8 ? 'selected' : ''}>0.8x (ゆっくり聞き取り)</option>
                <option value="1.0" ${settings.voiceRate === 1.0 ? 'selected' : ''}>1.0x (標準スピード)</option>
                <option value="1.2" ${settings.voiceRate === 1.2 ? 'selected' : ''}>1.2x (ネイティブ実戦)</option>
              </select>
            </div>
          </div>

          <div class="space-y-3 pt-2">
            <label class="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              <span>カードめくり時・AIメッセージの自動読み上げ</span>
              <input type="checkbox" id="check-auto-speak" ${settings.autoSpeak ? 'checked' : ''} class="w-4 h-4 accent-indigo-600 rounded" />
            </label>
            <label class="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              <span>正解・不正解の効果音</span>
              <input type="checkbox" id="check-sound-effects" ${settings.soundEffects ? 'checked' : ''} class="w-4 h-4 accent-indigo-600 rounded" />
            </label>
          </div>

          <div class="pt-2">
            <button id="btn-test-speech" class="w-full py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition">
              🔊 音声テスト: "Welcome to your English learning app!"
            </button>
          </div>
        </div>

        <!-- Data Management Section -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div class="flex items-center space-x-2 border-b border-gray-100 dark:border-gray-700 pb-3">
            <span class="text-xl">💾</span>
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">学習データのバックアップ</h3>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            学習履歴や自作単語帳、ストリーク記録をJSONファイルとして書き出したり、別の端末へ引き継ぐことができます。
          </p>

          <div class="flex flex-wrap gap-2.5">
            <button id="btn-export-data" class="px-3.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-lg transition">
              📤 データをエクスポート (保存)
            </button>
            <label class="px-3.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-lg transition cursor-pointer">
              📥 データをインポート (復元)
              <input type="file" id="file-import-data" accept=".json" class="hidden" />
            </label>
            <button id="btn-reset-data" class="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-semibold rounded-lg transition ml-auto">
              ⚠️ 初期化
            </button>
          </div>
        </div>

        <!-- Save Button -->
        <div class="pt-2">
          <button id="btn-save-settings" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition active:scale-95">
            設定を保存する
          </button>
        </div>
      </div>
    `;

    // Toggle password eye
    container.querySelectorAll('.btn-toggle-eye').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = container.querySelector(`#${targetId}`);
        if (input) {
          input.type = input.type === 'password' ? 'text' : 'password';
        }
      });
    });

    // Provider change toggle
    const providerSelect = container.querySelector('#select-ai-provider');
    const geminiFields = container.querySelector('#gemini-fields');
    const openaiFields = container.querySelector('#openai-fields');

    providerSelect?.addEventListener('change', () => {
      const val = providerSelect.value;
      geminiFields?.classList.toggle('hidden', val !== 'gemini');
      openaiFields?.classList.toggle('hidden', val !== 'openai');
    });

    // Speech test
    container.querySelector('#btn-test-speech')?.addEventListener('click', () => {
      SpeechService.speak("Welcome to your English learning app! Practice makes perfect.");
    });

    // Export
    container.querySelector('#btn-export-data')?.addEventListener('click', () => {
      const dataStr = StorageService.exportAllData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `linguaflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Import
    container.querySelector('#file-import-data')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const success = StorageService.importAllData(event.target.result);
        if (success) {
          alert('学習データを正常にインポートしました！');
          if (onSettingsChanged) onSettingsChanged();
        } else {
          alert('データの読み込みに失敗しました。正しいJSONファイルかご確認ください。');
        }
      };
      reader.readAsText(file);
    });

    // Reset
    container.querySelector('#btn-reset-data')?.addEventListener('click', () => {
      if (confirm('本当にすべての学習進捗・自作単語・設定をリセットしますか？この操作は取り消せません。')) {
        StorageService.resetAllData();
        alert('データをリセットしました。');
        if (onSettingsChanged) onSettingsChanged();
      }
    });

    // Save
    container.querySelector('#btn-save-settings')?.addEventListener('click', () => {
      const updated = {
        aiProvider: providerSelect.value,
        apiKeyGemini: container.querySelector('#input-gemini-key').value.trim(),
        geminiModel: container.querySelector('#select-gemini-model').value,
        apiKeyOpenAI: container.querySelector('#input-openai-key').value.trim(),
        openaiModel: container.querySelector('#select-openai-model').value,
        voiceLang: container.querySelector('#select-voice-lang').value,
        voiceRate: parseFloat(container.querySelector('#select-voice-rate').value),
        autoSpeak: container.querySelector('#check-auto-speak').checked,
        soundEffects: container.querySelector('#check-sound-effects').checked
      };

      StorageService.saveSettings(updated);
      alert('設定を保存しました！');
      if (onSettingsChanged) onSettingsChanged();
    });
  }
}
