// Multi-backend AI Service (Gemini API, OpenAI API, and Offline Smart Simulator)
import { StorageService } from './storage.js';

export class AIService {
  static async sendMessage({ scenario, conversationHistory, userMessage }) {
    const settings = StorageService.getSettings();
    const provider = settings.aiProvider || 'mock';

    if (provider === 'gemini' && settings.apiKeyGemini) {
      return await this.callGeminiAPI({ scenario, conversationHistory, userMessage, settings });
    } else if (provider === 'openai' && settings.apiKeyOpenAI) {
      return await this.callOpenAIAPI({ scenario, conversationHistory, userMessage, settings });
    } else {
      return await this.callMockSimulator({ scenario, conversationHistory, userMessage });
    }
  }

  static async callGeminiAPI({ scenario, conversationHistory, userMessage, settings }) {
    const model = settings.geminiModel || 'gemini-1.5-flash';
    const apiKey = settings.apiKeyGemini.trim();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const formattedContents = [];
    conversationHistory.forEach(item => {
      formattedContents.push({
        role: item.sender === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }]
      });
    });
    formattedContents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const payload = {
      contents: formattedContents,
      systemInstruction: {
        parts: [{
          text: `${scenario.systemPrompt}
Always reply in character as ${scenario.aiRole}.
Keep response under 3 sentences in English.
Then on a new line, add "💡 Native Tip: " followed by feedback or better natural phrasing in Japanese.`
        }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      return this.parseAIResponse(rawText);
    } catch (err) {
      console.warn("Gemini API call failed, falling back to mock:", err);
      const fallback = await this.callMockSimulator({ scenario, conversationHistory, userMessage });
      fallback.warning = `⚠️ Gemini APIエラー (${err.message})。デモAIが代わりに応答しました。`;
      return fallback;
    }
  }

  static async callOpenAIAPI({ scenario, conversationHistory, userMessage, settings }) {
    const model = settings.openaiModel || 'gpt-4o-mini';
    const apiKey = settings.apiKeyOpenAI.trim();
    const url = 'https://api.openai.com/v1/chat/completions';

    const messages = [
      {
        role: 'system',
        content: `${scenario.systemPrompt}
Always reply in character as ${scenario.aiRole}.
Keep response under 3 sentences in English.
Then on a new line, add "💡 Native Tip: " followed by feedback or better natural phrasing in Japanese.`
      }
    ];

    conversationHistory.forEach(item => {
      messages.push({
        role: item.sender === 'user' ? 'user' : 'assistant',
        content: item.text + (item.tip ? `\n💡 Native Tip: ${item.tip}` : '')
      });
    });

    messages.push({
      role: 'user',
      content: userMessage
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `OpenAI API returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
      return this.parseAIResponse(rawText);
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to mock:", err);
      const fallback = await this.callMockSimulator({ scenario, conversationHistory, userMessage });
      fallback.warning = `⚠️ OpenAI APIエラー (${err.message})。デモAIが代わりに応答しました。`;
      return fallback;
    }
  }

  static async callMockSimulator({ scenario, conversationHistory, userMessage }) {
    // Artificial delay to feel natural
    await new Promise(r => setTimeout(r, 650));

    const lower = userMessage.toLowerCase();
    const flow = scenario.mockFlow || [];

    // Find first matching rule
    for (const step of flow) {
      const matched = step.trigger.some(keyword => lower.includes(keyword.toLowerCase()));
      if (matched) {
        return {
          reply: step.response,
          translationJa: step.responseJa || '',
          tip: step.tip || ''
        };
      }
    }

    // Default fallback
    const fb = scenario.mockFallback || {
      response: "That's interesting! Could you tell me more about that?",
      responseJa: "興味深いですね！それについてもう少し詳しく聞かせてもらえますか？",
      tip: "「For instance, ...」「To give an example, ...」など具体例を添えると話が弾みます。"
    };

    return {
      reply: fb.response,
      translationJa: fb.responseJa || '',
      tip: fb.tip || ''
    };
  }

  static parseAIResponse(rawText) {
    let reply = rawText;
    let tip = '';

    const tipMatch = rawText.match(/💡\s*Native Tip:\s*([\s\S]+)$/i);
    if (tipMatch) {
      tip = tipMatch[1].trim();
      reply = rawText.replace(/💡\s*Native Tip:\s*[\s\S]+$/i, '').trim();
    }

    return {
      reply,
      tip
    };
  }
}
