import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Radio, Music, Maximize2, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';
import { soundEngine } from '../services/soundEngine';
import { t } from '../i18n/translations';

interface BlindTestMusicPlayerProps {
  question: Question;
  isAnswered: boolean;
  primaryColor?: string;
  accentColor?: string;
  language?: string;
  masterVolume?: number;
  questionMusicVolume?: number;
  onPlayClickSound?: () => void;
}

export const BlindTestMusicPlayer: React.FC<BlindTestMusicPlayerProps> = ({
  question,
  isAnswered,
  primaryColor = '#9333ea',
  accentColor = '#ec4899',
  language = 'fr',
  masterVolume = 1.0,
  questionMusicVolume = 0.85,
  onPlayClickSound,
}) => {
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(85);
  // Default to YouTube as priority 1
  const [activeSource, setActiveSource] = useState<'youtube' | 'audio_preview' | 'synth'>('youtube');
  const [ytCandidateIndex, setYtCandidateIndex] = useState(0);
  const [dynamicYtVideoIds, setDynamicYtVideoIds] = useState<string[]>([]);
  
  // Image & Metadata State for answer reveal
  const [revealedImageUrl, setRevealedImageUrl] = useState<string | null>(
    question.imageUrl && !question.imageUrl.includes('Wikipedia-logo') ? question.imageUrl : null
  );
  const [revealedSecondaryImageUrl, setRevealedSecondaryImageUrl] = useState<string | null>(
    question.secondaryImageUrl || null
  );
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(question.audioPreviewUrl || null);
  const [trackMetadata, setTrackMetadata] = useState<{ trackName?: string; artistName?: string; artworkUrl?: string } | null>(
    question.audioTrackName || question.audioArtistName
      ? { trackName: question.audioTrackName, artistName: question.audioArtistName }
      : null
  );
  
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [activeEqBar, setActiveEqBar] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // References
  const ytPlayerRef = useRef<YouTubePlayer | null>(null);
  const audioTagRef = useRef<HTMLAudioElement | null>(null);
  const synthTimerRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  // Consolidated candidate video IDs (Props + dynamically fetched)
  const propVideoIds = question.youtubeVideoIds && question.youtubeVideoIds.length > 0
    ? question.youtubeVideoIds
    : question.youtubeVideoId
    ? [question.youtubeVideoId]
    : [];
  const videoIds = propVideoIds.length > 0 ? propVideoIds : dynamicYtVideoIds;
  const currentVideoId = videoIds[ytCandidateIndex] || question.youtubeVideoId || (dynamicYtVideoIds[0] || null);

  // Calculate combined volume (0..100)
  const computedVolume = Math.min(100, Math.max(0, Math.round(questionMusicVolume * masterVolume * (volume / 100) * 100)));

  // Sync volume with players
  useEffect(() => {
    const finalVol = isMuted ? 0 : computedVolume;
    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      try {
        if (activeSource === 'youtube') {
          ytPlayerRef.current.setVolume(finalVol);
          if (isMuted) ytPlayerRef.current.mute();
          else ytPlayerRef.current.unMute();
        } else {
          ytPlayerRef.current.mute();
        }
      } catch {}
    }
    if (audioTagRef.current) {
      if (activeSource === 'audio_preview') {
        audioTagRef.current.volume = finalVol / 100;
        audioTagRef.current.muted = isMuted;
      } else {
        audioTagRef.current.muted = true;
        audioTagRef.current.pause();
      }
    }
  }, [computedVolume, isMuted, activeSource]);

  // Fetch YouTube video candidates dynamically if none exist on question (to ensure YouTube priority)
  useEffect(() => {
    let isSubscribed = true;
    if (propVideoIds.length > 0) return;

    const query = question.youtubeSearchQuery || `${question.correctAnswer} audio`;
    fetch(`/api/search-youtube?q=${encodeURIComponent(query)}`)
      .then((res) => (res.ok ? res.json().catch(() => null) : null))
      .then((data) => {
        if (isSubscribed && data) {
          const ids = data.videoIds && data.videoIds.length > 0 ? data.videoIds : (data.videoId ? [data.videoId] : []);
          if (ids.length > 0) {
            setDynamicYtVideoIds(ids);
            setActiveSource('youtube');
          }
        }
      })
      .catch(() => {});

    return () => {
      isSubscribed = false;
    };
  }, [question.id, question.youtubeSearchQuery, question.correctAnswer, propVideoIds.length]);

  // Fetch Wikipedia Answer Image & Audio preview if missing
  useEffect(() => {
    let isSubscribed = true;
    setImageLoaded(false);

    // Initial image from question prop
    if (question.imageUrl && !question.imageUrl.includes('Wikipedia-logo')) {
      setRevealedImageUrl(question.imageUrl);
      setRevealedSecondaryImageUrl(question.secondaryImageUrl || null);
    } else {
      // Fetch high resolution Wikipedia image of the artist/band
      const wikiQuery = question.wikiSearchQuery || question.correctAnswer;
      fetch(`/api/wiki-image?q=${encodeURIComponent(wikiQuery)}&fallback=${encodeURIComponent(question.correctAnswer)}&category=${encodeURIComponent(question.category || '')}`)
        .then((res) => (res.ok ? res.json().catch(() => null) : null))
        .then((data) => {
          if (isSubscribed && data?.imageUrl && !data.imageUrl.includes('Wikipedia-logo')) {
            setRevealedImageUrl(data.imageUrl);
            if (data.secondaryImageUrl) setRevealedSecondaryImageUrl(data.secondaryImageUrl);
          }
        })
        .catch(() => {});
    }

    // Audio Preview (iTunes / Deezer)
    if (question.audioPreviewUrl) {
      setAudioPreviewUrl(question.audioPreviewUrl);
      if (question.audioTrackName || question.audioArtistName) {
        setTrackMetadata({
          trackName: question.audioTrackName,
          artistName: question.audioArtistName,
        });
      }
      return;
    }

    const searchQuery = question.youtubeSearchQuery || `${question.correctAnswer}`;
    fetch(`/api/audio-preview?q=${encodeURIComponent(searchQuery)}&answer=${encodeURIComponent(question.correctAnswer)}`)
      .then((res) => (res.ok ? res.json().catch(() => null) : null))
      .then((data) => {
        if (isSubscribed && data?.previewUrl) {
          setAudioPreviewUrl(data.previewUrl);
          setTrackMetadata({
            trackName: data.trackName,
            artistName: data.artistName,
            artworkUrl: data.artworkUrl,
          });
          // Also set image if no wiki image is available yet
          setRevealedImageUrl((prev) => prev || data.artworkUrl || null);
        }
      })
      .catch(() => {});

    return () => {
      isSubscribed = false;
    };
  }, [question.id, question.imageUrl, question.secondaryImageUrl, question.wikiSearchQuery, question.youtubeSearchQuery, question.correctAnswer, question.audioPreviewUrl, question.category]);

  // Reset & restart playback on question change (always prioritize YouTube)
  useEffect(() => {
    setIsPlaying(false);
    setProgressPct(0);
    setPlaybackError(null);
    setYtCandidateIndex(0);
    setIsFullscreenImage(false);
    
    // Always start with YouTube as priority 1
    setActiveSource('youtube');

    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }

    if (audioTagRef.current) {
      audioTagRef.current.pause();
      audioTagRef.current.currentTime = 0;
    }

    // Auto-start attempt after small delay
    const autoPlayTimer = setTimeout(() => {
      startPlayback('youtube');
    }, 350);

    return () => {
      clearTimeout(autoPlayTimer);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (audioTagRef.current) audioTagRef.current.pause();
    };
  }, [question.id]);

  // Animate Equalizer & Track Progress
  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      setActiveEqBar((prev) => (prev + 1) % 16);
      setProgressPct((prev) => (prev >= 100 ? 0 : prev + 0.6));
    }, 100);

    progressTimerRef.current = interval;
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Stable YouTube player options so changing isAnswered doesn't re-render/interrupt the player
  const ytPlayerOpts = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        start: 3,
        vq: 'large', // 480p high quality playback
        enablejsapi: 1,
      },
    }),
    []
  );

  // Ensure YouTube video and audio keep playing continuously without stopping when answering
  useEffect(() => {
    if (isAnswered && activeSource === 'youtube' && ytPlayerRef.current) {
      try {
        ytPlayerRef.current.playVideo();
        if (!isMuted) {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(computedVolume);
        }
      } catch (err) {
        console.warn('Continuous YouTube playback on answer error:', err);
      }
    }
  }, [isAnswered, activeSource, isMuted, computedVolume]);

  // Start Playback across active source with YouTube first
  const startPlayback = useCallback((forcedSource?: 'youtube' | 'audio_preview' | 'synth') => {
    const targetSource = forcedSource || activeSource;
    soundEngine.unlockAudio();

    // Priority 1: YouTube video
    if (targetSource === 'youtube') {
      // Ensure audio preview is stopped and muted
      if (audioTagRef.current) {
        audioTagRef.current.pause();
        audioTagRef.current.muted = true;
      }

      if (currentVideoId && ytPlayerRef.current) {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(isMuted ? 0 : computedVolume);
          ytPlayerRef.current.seekTo(3, true);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          setPlaybackError(null);
          return;
        } catch (err) {
          console.warn('YouTube play attempt failed', err);
        }
      }
      return;
    }

    // Priority 2: Audio preview HQ MP3
    if (targetSource === 'audio_preview') {
      // Ensure YouTube is paused and muted
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.pauseVideo();
          ytPlayerRef.current.mute();
        } catch {}
      }

      if (audioPreviewUrl && audioTagRef.current) {
        audioTagRef.current.muted = isMuted;
        audioTagRef.current.volume = isMuted ? 0 : computedVolume / 100;
        audioTagRef.current.currentTime = 0;
        audioTagRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setPlaybackError(null);
          })
          .catch((err) => {
            console.warn('Audio tag autoplay prevented, waiting for user click:', err);
            setIsPlaying(false);
            setPlaybackError(t('click_to_play', language) || 'Cliquez pour écouter');
          });
        return;
      }
    }

    // Priority 3: Web Audio Synth Melody
    if (targetSource === 'synth') {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.pauseVideo();
          ytPlayerRef.current.mute();
        } catch {}
      }
      if (audioTagRef.current) {
        audioTagRef.current.pause();
        audioTagRef.current.muted = true;
      }
      soundEngine.playAudioClue(question.audioNotes || [330, 392, 440, 523.25, 659.25]);
      setIsPlaying(true);
      const duration = ((question.audioNotes?.length || 6) * 160) + 600;
      if (synthTimerRef.current) clearTimeout(synthTimerRef.current);
      synthTimerRef.current = window.setTimeout(() => {
        setIsPlaying(false);
      }, duration);
    }
  }, [activeSource, currentVideoId, audioPreviewUrl, computedVolume, isMuted, question.audioNotes, language]);

  const pausePlayback = useCallback(() => {
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch {}
    }
    if (audioTagRef.current) {
      audioTagRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const togglePlayPause = () => {
    onPlayClickSound?.();
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  const handleReplay = () => {
    onPlayClickSound?.();
    setProgressPct(0);
    if (activeSource === 'youtube' && ytPlayerRef.current) {
      try {
        if (audioTagRef.current) {
          audioTagRef.current.pause();
          audioTagRef.current.muted = true;
        }
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(isMuted ? 0 : computedVolume);
        ytPlayerRef.current.seekTo(3, true);
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
        return;
      } catch {}
    }
    if (activeSource === 'audio_preview' && audioTagRef.current) {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.pauseVideo();
          ytPlayerRef.current.mute();
        } catch {}
      }
      audioTagRef.current.muted = isMuted;
      audioTagRef.current.volume = isMuted ? 0 : computedVolume / 100;
      audioTagRef.current.currentTime = 0;
      audioTagRef.current.play().catch(() => {});
      setIsPlaying(true);
      return;
    }
    startPlayback();
  };

  // Switch to specific audio source (YouTube HQ or Extrait Audio HQ)
  const selectSource = (source: 'youtube' | 'audio_preview') => {
    onPlayClickSound?.();
    if (source === activeSource) {
      togglePlayPause();
      return;
    }

    setActiveSource(source);
    setPlaybackError(null);

    if (source === 'youtube') {
      // Mute and pause audio preview
      if (audioTagRef.current) {
        audioTagRef.current.pause();
        audioTagRef.current.muted = true;
      }
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(isMuted ? 0 : computedVolume);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        } catch (err) {
          console.warn('YouTube play on select error:', err);
        }
      } else {
        setTimeout(() => startPlayback('youtube'), 100);
      }
    } else if (source === 'audio_preview') {
      // Mute and pause YouTube
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.pauseVideo();
          ytPlayerRef.current.mute();
        } catch {}
      }
      if (audioTagRef.current) {
        audioTagRef.current.muted = isMuted;
        audioTagRef.current.volume = isMuted ? 0 : computedVolume / 100;
        audioTagRef.current.currentTime = 0;
        audioTagRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Audio tag play error on switch:', err);
            setIsPlaying(false);
            setPlaybackError(t('click_to_play', language) || 'Cliquez pour écouter');
          });
      } else {
        setTimeout(() => startPlayback('audio_preview'), 100);
      }
    }
  };

  // YouTube player event handlers
  const handleYtReady = (e: any) => {
    ytPlayerRef.current = e.target;
    try {
      if (typeof e.target.setPlaybackQuality === 'function') {
        e.target.setPlaybackQuality('large'); // 480p
      }
      if (activeSource === 'youtube') {
        if (typeof e.target.setVolume === 'function') {
          e.target.setVolume(isMuted ? 0 : computedVolume);
        }
        if (typeof e.target.unMute === 'function') {
          if (!isMuted) e.target.unMute();
        }
        if (typeof e.target.playVideo === 'function') {
          e.target.playVideo();
        }
        setIsPlaying(true);
        // Ensure audio preview is strictly muted & paused
        if (audioTagRef.current) {
          audioTagRef.current.pause();
          audioTagRef.current.muted = true;
        }
      } else {
        if (typeof e.target.mute === 'function') {
          e.target.mute();
        }
        if (typeof e.target.pauseVideo === 'function') {
          e.target.pauseVideo();
        }
      }
    } catch {}
  };

  const handleYtStateChange = (e: any) => {
    // 1 = playing, 2 = paused, 0 = ended, -1 = unstarted
    if (activeSource !== 'youtube') return;
    if (e.data === 1) {
      setIsPlaying(true);
      setPlaybackError(null);
    } else if (e.data === 2) {
      setIsPlaying(false);
    } else if (e.data === 0) {
      // Loop playback from second 3
      try {
        e.target.seekTo(3, true);
        e.target.playVideo();
      } catch {}
    }
  };

  const handleYtError = (e: any) => {
    console.warn(`YouTube Player Error (${e?.data}) on video ${currentVideoId}. Cycling candidate...`);
    // Prioritize remaining YouTube video candidates first
    if (videoIds.length > 1 && ytCandidateIndex < videoIds.length - 1) {
      setYtCandidateIndex((prev) => prev + 1);
      return;
    }

    // Otherwise transition to HTML5 audio preview
    if (audioPreviewUrl) {
      setActiveSource('audio_preview');
      setTimeout(() => startPlayback('audio_preview'), 100);
    } else {
      setActiveSource('synth');
      setTimeout(() => startPlayback('synth'), 100);
    }
  };

  // Final image to display upon answer reveal when not in YouTube video mode
  const finalAnswerImage = revealedImageUrl || revealedSecondaryImageUrl || trackMetadata?.artworkUrl;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none" id="blind-test-music-player">
      {/* Background Ambient Glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700 blur-2xl"
        style={{
          background: `radial-gradient(circle at center, ${primaryColor} 0%, transparent 75%)`,
        }}
      />

      {/* HTML5 Audio Tag Engine */}
      {audioPreviewUrl && (
        <audio
          ref={audioTagRef}
          src={audioPreviewUrl}
          loop
          preload="auto"
          muted={activeSource !== 'audio_preview' || isMuted}
          onPlay={() => {
            if (activeSource === 'audio_preview') setIsPlaying(true);
          }}
          onPause={() => {
            if (activeSource === 'audio_preview') setIsPlaying(false);
          }}
          onError={() => {
            console.warn('Audio tag playback error, switching to synth melody');
            if (activeSource === 'audio_preview') {
              setActiveSource('synth');
              startPlayback('synth');
            }
          }}
        />
      )}

      {/* Embedded YouTube Player (High Priority, full frame video when answered) */}
      {currentVideoId && (
        <div
          className={`absolute inset-0 w-full h-full z-20 transition-opacity duration-700 ${
            isAnswered && activeSource === 'youtube'
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <YouTube
            videoId={currentVideoId}
            opts={ytPlayerOpts}
            className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:rounded-xl sm:[&>iframe]:rounded-2xl"
            onReady={handleYtReady}
            onStateChange={handleYtStateChange}
            onError={handleYtError}
          />
        </div>
      )}

      {/* REVEALED ANSWER IMAGE STAGE (When answered in Audio Preview or Synth mode) */}
      {isAnswered && activeSource !== 'youtube' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in overflow-hidden">
          {finalAnswerImage ? (
            <div className="relative w-full h-full group flex items-center justify-center overflow-hidden">
              {/* Full Bleed Image */}
              <img
                src={finalAnswerImage}
                alt={question.correctAnswer}
                referrerPolicy="no-referrer"
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

              {/* Floating Top Badge */}
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 pointer-events-none">
                <span
                  className="px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-full shadow-md backdrop-blur-md border border-white/20 text-white"
                  style={{
                    backgroundColor: `${primaryColor}cc`,
                  }}
                >
                  {question.category || t('revealed_track', language) || 'Réponse'}
                </span>
              </div>

              {/* Zoom Button */}
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={() => {
                    onPlayClickSound?.();
                    setIsFullscreenImage(true);
                  }}
                  className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 transition-all backdrop-blur-md shadow-md cursor-pointer"
                  title="Agrandir l'image"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>

              {/* Bottom Caption Pill */}
              <div className="absolute bottom-2 inset-x-2 z-10 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 shadow-lg">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
                  >
                    <Music className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-white truncate">
                      {question.correctAnswer}
                    </h4>
                    {trackMetadata?.trackName && trackMetadata.trackName !== question.correctAnswer && (
                      <p className="text-[10px] text-white/70 truncate">{trackMetadata.trackName}</p>
                    )}
                  </div>
                </div>
                {trackMetadata?.artistName && (
                  <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider shrink-0 hidden sm:inline-block">
                    {trackMetadata.artistName}
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Fallback Card if image is loading or completely unavailable */
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-xl border border-white/20 mb-2"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
              >
                <ImageIcon className="w-8 h-8 text-white animate-pulse" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400 mb-0.5">
                {t('revealed_track', language) || 'Artiste / Morceau'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white line-clamp-1">
                {question.correctAnswer}
              </h3>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE BLIND TEST VINYL & EQUALIZER STAGE (Visible before answering) */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-between p-2 sm:p-3 transition-opacity duration-500 z-10 ${
          isAnswered && activeSource === 'youtube' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Top Bar: Dual Source Buttons (YouTube HQ & Extrait audio HQ) & Replay/Mute Controls */}
        <div className="w-full flex items-center justify-between px-1 shrink-0 gap-1.5">
          {/* Side-by-side Source Selector Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {/* YouTube HQ Button */}
            <button
              id="btn-source-youtube"
              type="button"
              onClick={() => selectSource('youtube')}
              className={`flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold transition-all backdrop-blur-sm active:scale-95 cursor-pointer shrink-0 ${
                activeSource === 'youtube'
                  ? 'bg-red-600/90 text-white shadow-md shadow-red-600/30 border border-red-400 ring-1 ring-red-400/50'
                  : 'bg-white/10 hover:bg-white/20 text-white/60 hover:text-white border border-white/10'
              }`}
              title="Écouter la piste YouTube HQ"
            >
              <Radio className={`w-3 h-3 ${activeSource === 'youtube' ? 'text-white animate-pulse' : 'text-white/50'}`} />
              <span className="whitespace-nowrap">YouTube HQ</span>
            </button>

            {/* Extrait audio HQ Button */}
            <button
              id="btn-source-audio-preview"
              type="button"
              onClick={() => selectSource('audio_preview')}
              className={`flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold transition-all backdrop-blur-sm active:scale-95 cursor-pointer shrink-0 ${
                activeSource === 'audio_preview'
                  ? 'bg-purple-600/90 text-white shadow-md shadow-purple-600/30 border border-purple-400 ring-1 ring-purple-400/50'
                  : 'bg-white/10 hover:bg-white/20 text-white/60 hover:text-white border border-white/10'
              }`}
              title="Écouter l'extrait audio HQ"
            >
              <Music className={`w-3 h-3 ${activeSource === 'audio_preview' ? 'text-white animate-pulse' : 'text-white/50'}`} />
              <span className="whitespace-nowrap">Extrait audio HQ</span>
            </button>
          </div>

          {/* Right Controls: Mute & Replay */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              id="btn-toggle-blindtest-mute"
              onClick={() => setIsMuted((prev) => !prev)}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-all cursor-pointer"
              title={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button
              id="btn-blindtest-replay"
              onClick={handleReplay}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-[9px] sm:text-[10px] text-white/80 font-medium transition-all active:scale-95 cursor-pointer"
              title="Réécouter depuis le début"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span className="hidden xs:inline">{t('replay', language) || 'Rejouer'}</span>
            </button>
          </div>
        </div>

        {/* Center: Turntable Vinyl with Interactive Big Play/Pause Button */}
        <div className="relative flex flex-col items-center justify-center my-auto">
          {/* Animated Neon Ripple Rings */}
          {isPlaying && (
            <>
              <div
                className="absolute inset-0 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none opacity-40"
                style={{ border: `2px solid ${primaryColor}` }}
              />
              <div
                className="absolute inset-0 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite_1.2s] pointer-events-none opacity-20"
                style={{ border: `1.5px solid ${accentColor}` }}
              />
            </>
          )}

          {/* Vinyl Record Body */}
          <div
            className={`relative rounded-full border-2 border-white/25 shadow-2xl flex items-center justify-center transition-all duration-300 ${
              isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
            } w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24`}
            style={{
              background: 'radial-gradient(circle, #2a2a2a 20%, #111111 60%, #050505 100%)',
              boxShadow: isPlaying ? `0 0 35px ${primaryColor}80` : '0 10px 25px rgba(0,0,0,0.6)',
            }}
          >
            {/* Vinyl Grooves */}
            <div className="absolute inset-1 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute inset-3 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute inset-5 rounded-full border border-white/10 pointer-events-none" />

            {/* Center Label / Game Logo Center Disc */}
            <button
              onClick={togglePlayPause}
              id="btn-toggle-blindtest-music"
              className="relative w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transform active:scale-90 hover:scale-105 transition-all z-20 overflow-hidden group p-0.5 border border-white/30"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
              }}
              title={isPlaying ? 'Mettre en pause' : 'Lancer l’écoute'}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0F0A1F] flex items-center justify-center relative">
                <img
                  src="/logo5.png"
                  alt="Guess That! Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full select-none pointer-events-none"
                />
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center transition-all">
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 text-white fill-current animate-pulse drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Status Label */}
          <div className="mt-1 text-center">
            <span
              className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors ${
                isPlaying ? 'text-green-400' : 'text-purple-300 animate-pulse'
              }`}
            >
              {isPlaying
                ? (t('music_playing', language) || 'Écoute en cours 🎵')
                : (playbackError || (t('click_to_listen', language) || 'Cliquer pour écouter ▶'))}
            </span>
          </div>
        </div>

        {/* Bottom Bar: Waveform Equalizer & Progress Bar */}
        <div className="w-full flex flex-col items-center gap-1 px-2 shrink-0">
          {/* Waveform Equalizer Bars */}
          <div className="flex items-end justify-center gap-0.5 sm:gap-1 h-4 sm:h-5 w-full max-w-xs">
            {[25, 60, 45, 90, 70, 85, 40, 100, 65, 80, 50, 75, 35, 90, 60, 40].map((heightPct, idx) => {
              const isPeak = isPlaying && (activeEqBar % 4 === idx % 4 || activeEqBar % 3 === idx % 3);
              const height = isPlaying ? (isPeak ? heightPct : Math.max(20, heightPct * 0.45)) : 15;

              return (
                <div
                  key={idx}
                  className="w-1 sm:w-1.5 rounded-full transition-all duration-150"
                  style={{
                    height: `${height}%`,
                    backgroundColor: isPlaying ? (isPeak ? accentColor : primaryColor) : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: isPlaying && isPeak ? `0 0 8px ${accentColor}` : 'none',
                  }}
                />
              );
            })}
          </div>

          {/* Track Progress Bar */}
          <div className="w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progressPct}%`,
                background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {isFullscreenImage && finalAnswerImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
            onClick={() => setIsFullscreenImage(false)}
          >
            <button
              onClick={() => setIsFullscreenImage(false)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer z-50"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={finalAnswerImage}
                alt={question.correctAnswer}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[80vh]"
              />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400 block mb-0.5">
                  {question.category || 'Réponse'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">{question.correctAnswer}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
