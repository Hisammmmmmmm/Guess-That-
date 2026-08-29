import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, Disc, Sparkles, Mic, Square } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { ttsService } from '../services/ttsService';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { t } from '../i18n/translations';

interface AudioCluePlayerProps {
  audioNotes?: number[];
  clueText: string;
  speechEnabled: boolean;
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
  speechEnabled,
  primaryColor = '#9333ea',
  autoPlayOnNewQuestion = true,
  youtubeVideoId,
  gameMode,
  language = 'fr',
  volume = 80,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBar, setActiveBar] = useState(0);
  const playerRef = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try {
        playerRef.current.setVolume(Math.min(100, Math.max(0, volume)));
      } catch {
        // ignore
      }
    }
  }, [volume]);

  const toggleAudio = () => {
    if (isPlaying || isMusicMode) {
      if (playerRef.current) {
        playerRef.current.pauseVideo();
      }
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    
    if (youtubeVideoId) {
      if (playerRef.current) {
        playerRef.current.playVideo();
      }
    } else {
      // Fallback to synthetic melody
      soundEngine.unlockAudio();
      soundEngine.playAudioClue(audioNotes);

      // Voice synthesis of clue in selected language
      if (speechEnabled && clueText) {
        ttsService.speak(clueText, language);
      }

      const duration = ((audioNotes?.length || 6) * 140) + 400;
      setTimeout(() => {
        setIsPlaying(false);
      }, duration);
    }
  };

  // Stop playing when moving to next question
  useEffect(() => {
    setIsPlaying(false);
    ttsService.stop();
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
    return () => {
      ttsService.stop();
    };
  }, [youtubeVideoId, clueText]);

  useEffect(() => {
    let interval: number;
    if (isPlaying || isMusicMode) {
      interval = window.setInterval(() => {
        setActiveBar((prev) => (prev + 1) % 12);
      }, 90);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const onReady = (event: any) => {
    playerRef.current = event.target;
    // Set volume to question audio volume (defaults to 80%)
    event.target.setVolume(Math.min(100, Math.max(0, volume)));
    if (isMusicMode) {
      event.target.playVideo();
      setIsPlaying(true);
    }
  };

  const onEnd = () => {
    setIsPlaying(false);
  };
  
  const isMusicMode = gameMode === 'music_blind_test';

  return (
    <div
      className={`flex items-center justify-between gap-2 px-3 sm:px-4 py-3 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-md w-full ${isMusicMode ? 'min-h-[100px] sm:min-h-[120px] flex-col justify-center gap-4' : ''}`}
      id="audio-clue-player"
    >
      <div className={`flex items-center gap-2.5 ${isMusicMode ? 'flex-col gap-2 text-center' : ''}`}>
        <button
          onClick={toggleAudio}
          id="btn-play-audio-clue"
          className={`relative rounded-full text-white shadow-md transition-all duration-200 transform active:scale-95 hover:scale-105 cursor-pointer flex items-center justify-center shrink-0 ${isMusicMode ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-8 h-8 sm:w-9 sm:h-9'}`}
          style={{
            backgroundColor: primaryColor,
            boxShadow: `0 0 ${isMusicMode ? '30px' : '15px'} ${primaryColor}70`,
          }}
          title={isMusicMode ? t('listen_music', language) : t('listen_sound_voice_clue', language)}
        >
          {isMusicMode ? (
            <Disc className="w-6 h-6 sm:w-8 sm:h-8 animate-[spin_3s_linear_infinite]" />
          ) : isPlaying ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <Play className="w-4 h-4 ml-0.5 fill-current" />
          )}
        </button>

        <div>
          <div className={`flex items-center gap-1.5 ${isMusicMode ? 'justify-center mb-1' : ''}`}>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-purple-300">
              {isMusicMode ? t('listen_attentively', language) : t('audio_vocal_clue', language)}
            </span>
            {isPlaying && (
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-pink-500"></span>
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-white/60 line-clamp-1">
            {isMusicMode ? t('playing_music', language) : (isPlaying ? t('playing_clue', language) : t('auto_voice_enabled', language))}
          </p>
        </div>
      </div>

      {/* Waveform Equalizer Bars */}
      <div className={`flex items-end gap-1 ${isMusicMode ? 'h-8 sm:h-10 px-4 w-full max-w-xs justify-center' : 'h-5 px-1'}`}>
        {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85, 50, 70].slice(0, isMusicMode ? 12 : 10).map((heightPct, idx) => {
          const isHigh = (isPlaying || isMusicMode) && (activeBar % 4 === idx % 4 || activeBar % 3 === idx % 3);
          const height = (isPlaying || isMusicMode) ? (isHigh ? heightPct : Math.max(20, heightPct * 0.4)) : 10;

          return (
            <div
              key={idx}
              className={`rounded-full transition-all duration-150 ${isMusicMode ? 'w-2 sm:w-3' : 'w-1'}`}
              style={{
                height: `${height}%`,
                backgroundColor: (isPlaying || isMusicMode) ? primaryColor : 'rgba(255, 255, 255, 0.2)',
                boxShadow: (isPlaying || isMusicMode) && isHigh ? `0 0 10px ${primaryColor}` : 'none',
              }}
            />
          );
        })}
      </div>
      
      {youtubeVideoId && !isMusicMode && (
         <div className="hidden">
           <YouTube
             videoId={youtubeVideoId}
             opts={{
               height: '0',
               width: '0',
               playerVars: {
                 autoplay: 0,
                 controls: 0,
                 disablekb: 1,
                 fs: 0,
                 start: 0,
                 vq: 'small', // Low resource for audio-only
               },
             }}
             onReady={(e) => {
               try {
                 if (e.target && typeof e.target.setPlaybackQuality === 'function') {
                   e.target.setPlaybackQuality('small');
                 }
               } catch (err) {
                 // ignore
               }
               onReady(e);
             }}
             onEnd={onEnd}
             onError={(e) => console.error("Youtube Player Error:", e)}
           />
         </div>
      )}
    </div>
  );
};
