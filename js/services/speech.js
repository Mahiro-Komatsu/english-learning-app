// Web Speech API wrapper for Text-to-Speech (TTS) and Speech-to-Text (STT)
import { StorageService } from './storage.js';

export class SpeechService {
  static synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  static recognition = null;
  static isListening = false;

  static initSpeechRecognition(onResult, onError, onEnd) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition is not supported in this browser.');
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        const isFinal = event.results[event.results.length - 1].isFinal;
        if (onResult) onResult(transcript, isFinal);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        console.error('Speech recognition error:', event.error);
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      return true;
    } catch (e) {
      console.error('Failed to init SpeechRecognition', e);
      return false;
    }
  }

  static startListening() {
    if (!this.recognition) return false;
    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('Recognition already started or error:', e);
      return false;
    }
  }

  static stopListening() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
      this.isListening = false;
    } catch (e) {
      console.error(e);
    }
  }

  static speak(text, onEndCallback) {
    if (!this.synth) return;

    this.synth.cancel(); // Stop any ongoing speech

    const cleanText = text.replace(/💡.*$/gs, '').trim(); // Don't speak tip section if mixed
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const settings = StorageService.getSettings();

    utterance.lang = settings.voiceLang || 'en-US';
    utterance.rate = settings.voiceRate || 1.0;

    // Pick best matching English voice if available
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(settings.voiceLang || 'en') && !v.name.includes('Google'));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    if (onEndCallback) {
      utterance.onend = onEndCallback;
    }

    this.synth.speak(utterance);
  }

  static stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  static playSound(type) {
    const settings = StorageService.getSettings();
    if (!settings.soundEffects) return;

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.setValueAtTime(200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'levelup') {
        // celebratory chime
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);
          o.start(ctx.currentTime + idx * 0.08);
          o.stop(ctx.currentTime + idx * 0.08 + 0.4);
        });
      }
    } catch (e) {
      // AudioContext could be blocked by autoplay policies until user clicks
    }
  }
}
