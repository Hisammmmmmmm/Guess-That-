// Text-to-speech service with streaming audio support and SpeechSynthesis fallback

const LANG_LOCALE_MAP: Record<string, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-PT',
  nl: 'nl-NL',
  ru: 'ru-RU',
  ja: 'ja-JP',
  zh: 'zh-CN',
  ar: 'ar-SA',
};

class TTSService {
  private currentAudio: HTMLAudioElement | null = null;
  private isSynthesizing = false;

  public stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    this.isSynthesizing = false;
  }

  public async speak(text: string, language: string = 'fr'): Promise<void> {
    if (!text || !text.trim()) return;

    this.stop();
    this.isSynthesizing = true;

    const cleanText = text.slice(0, 280).trim();
    const targetLang = (language || 'fr').toLowerCase();
    const locale = LANG_LOCALE_MAP[targetLang] || 'fr-FR';

    // Primary: High-fidelity natural voice streaming via proxy endpoint
    const streamUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=${encodeURIComponent(targetLang)}`;

    return new Promise(async (resolve) => {
      try {
        const response = await fetch(streamUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (!data.url) throw new Error('No audio URL in response');

        const audio = new Audio();
        this.currentAudio = audio;

        audio.onended = () => {
          this.isSynthesizing = false;
          this.currentAudio = null;
          resolve();
        };

        audio.onerror = () => {
          // Fallback to local SpeechSynthesis if network fails
          this.fallbackSpeechSynthesis(cleanText, locale).finally(() => {
            this.isSynthesizing = false;
            resolve();
          });
        };

        audio.src = data.url;
        audio.play().catch(() => {
          // In case autoplay is restricted or network failed, fallback to SpeechSynthesis
          this.fallbackSpeechSynthesis(cleanText, locale).finally(() => {
            this.isSynthesizing = false;
            resolve();
          });
        });
      } catch {
        this.fallbackSpeechSynthesis(cleanText, locale).finally(() => {
          this.isSynthesizing = false;
          resolve();
        });
      }
    });
  }

  private fallbackSpeechSynthesis(text: string, locale: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = locale;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to match matching voice
        const voices = window.speechSynthesis.getVoices();
        const matchedVoice = voices.find((v) => v.lang.startsWith(locale.slice(0, 2)));
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();

        window.speechSynthesis.speak(utterance);
      } catch {
        resolve();
      }
    });
  }

  public isSpeaking(): boolean {
    return this.isSynthesizing;
  }
}

export const ttsService = new TTSService();
