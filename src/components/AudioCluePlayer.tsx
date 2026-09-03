import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { ttsService } from '../services/ttsService';
import { t } from '../i18n/translations';

interface AudioCluePlayerProps {
  audioNotes?: number[];
  clueText: string;
  speechEnabled?: boolean;
  primaryColor?: string;
  autoPlayOnNewQuestion?: boolean;
  youtubeVideoId?: string;
  gameMode?: string;
  language?: string;
  volume?: number;
}

export const AudioCluePlayer: React.FC<AudioCluePlayerProps> = ({
  audioNotes,
  clueText,
  primaryColor = '#9333ea',
  language = 'fr',
  volume = 80,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBar, setActiveBar] = useState(0);

  // Sync volume with TTSService
  useEffect(() => {
    const normalizedVol = Math.max(0.1, Math.min(1.0, volume / 100));
    ttsService.setVolume(normalizedVol);
  }, [volume]);

  // Stop playing when moving to next question or unmounting
  useEffect(() => {
    setIsPlaying(false);
    try {
      ttsService.stop();
    } catch {}

    return () => {
      try {
        ttsService.stop();
      } catch {}
    };
  }, [clueText]);

  // Equalizer visual animation when playing
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setActiveBar((prev) => (prev + 1) % 12);
      }, 90);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Play TTS of the clue from the "indice" card
  const toggleAudio = async () => {
    if (isPlaying) {
      try {
        ttsService.stop();
      } catch {}
      setIsPlaying(false);
      return;
    }

    const textToSpeak = clueText?.trim();
    if (!textToSpeak) {
      // Fallback: If no clue text, play the melodic audio notes
      if (audioNotes && audioNotes.length > 0) {
        soundEngine.unlockAudio();
        soundEngine.playAudioClue(audioNotes);
        setIsPlaying(true);
        const duration = (audioNotes.length * 140) + 400;
        setTimeout(() => setIsPlaying(false), duration);
      }
      return;
    }

    setIsPlaying(true);
    soundEngine.unlockAudio();

    const normalizedVol = Math.max(0.1, Math.min(1.0, volume / 100));
    ttsService.setVolume(normalizedVol);

    // Play introductory audio chime if notes are defined
    if (audioNotes && audioNotes.length > 0) {
      try {
        soundEngine.playAudioClue(audioNotes);
      } catch {}
      // Short 300ms pause so the melodic cue precedes the voice
      await new Promise((r) => setTimeout(r, 300));
    }

    try {
      // Launch TTS reading of the clue from the "Indice" frame
      await ttsService.speak(textToSpeak, language);
    } catch (err) {
      console.warn('TTS clue playback error:', err);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div
      className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-md w-full"
      id="audio-clue-player"
    >
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleAudio}
          id="btn-play-audio-clue"
          type="button"
          className="w-8 h-8 sm:w-9 sm:h-9 relative rounded-full text-white shadow-md transition-all duration-200 transform active:scale-95 hover:scale-105 cursor-pointer flex items-center justify-center shrink-0"
          style={{
            backgroundColor: primaryColor,
            boxShadow: `0 0 15px ${primaryColor}70`,
          }}
          title={isPlaying ? t('playing_clue', language) : t('listen_sound_clue', language)}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current animate-pulse" />
          ) : (
            <Play className="w-4 h-4 ml-0.5 fill-current" />
          )}
        </button>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-purple-300">
              {t('audio_vocal_clue', language)}
            </span>
            {isPlaying && (
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-pink-500"></span>
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-white/60 line-clamp-1">
            {isPlaying ? t('playing_clue', language) : t('listen_sound_clue', language)}
          </p>
        </div>
      </div>

      {/* Waveform Equalizer Bars */}
      <div className="flex items-end gap-1 h-5 px-1">
        {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85].map((heightPct, idx) => {
          const isHigh = isPlaying && (activeBar % 4 === idx % 4 || activeBar % 3 === idx % 3);
          const height = isPlaying ? (isHigh ? heightPct : Math.max(20, heightPct * 0.4)) : 12;

          return (
            <div
              key={idx}
              className="w-1 rounded-full transition-all duration-150"
              style={{
                height: `${height}%`,
                backgroundColor: isPlaying ? primaryColor : 'rgba(255, 255, 255, 0.2)',
                boxShadow: isPlaying && isHigh ? `0 0 8px ${primaryColor}` : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
