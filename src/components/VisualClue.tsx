import React, { useState } from 'react';
import { Maximize2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VisualClueProps {
  imageUrl: string;
  secondaryImageUrl?: string;
  secondaryImageSource?: string;
  imagePrompt: string;
  category?: string;
  clue: string;
  timeLeft?: number;
  totalTime?: number;
  progressiveBlurEnabled?: boolean;
  isAnswered?: boolean;
  questionIndex: number;
  totalQuestions: number;
  primaryColor?: string;
  onPlayClickSound?: () => void;
  showTextClue?: boolean;
  fullHeight?: boolean;
}

export const VisualClue: React.FC<VisualClueProps> = ({
  imageUrl,
  secondaryImageUrl,
  secondaryImageSource = 'Wikipedia',
  imagePrompt,
  category,
  clue,
  questionIndex,
  totalQuestions,
  primaryColor = '#9333ea',
  onPlayClickSound,
  showTextClue = true,
  fullHeight = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeZoomIndex, setActiveZoomIndex] = useState<0 | 1 | 'both'>('both');
  const [img1Loaded, setImg1Loaded] = useState(false);
  const [img2Loaded, setImg2Loaded] = useState(false);
  const [img1Error, setImg1Error] = useState(false);
  const [img2Error, setImg2Error] = useState(false);

  const hasTwoImages = Boolean(secondaryImageUrl && secondaryImageUrl !== imageUrl && !img2Error);

  return (
    <div
      className={`relative w-full overflow-hidden group select-none ${
        fullHeight
          ? 'h-full flex-1 flex flex-col min-h-0 p-0 border-0 rounded-none bg-transparent shadow-none'
          : 'rounded-2xl sm:rounded-3xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-2 sm:p-2.5 bg-white/5 backdrop-blur-md'
      }`}
    >
      {/* Inner Container spanning entire frame */}
      <div
        className={`relative w-full h-full overflow-hidden bg-neutral-950 flex items-center justify-center ${
          fullHeight ? 'flex-1 min-h-0 rounded-none' : 'rounded-xl sm:rounded-2xl aspect-video sm:aspect-[16/9]'
        }`}
      >
        {/* Top Header Badge */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full bg-black/70 text-white/90 border border-white/20 backdrop-blur-md shadow-sm">
            Indice #{questionIndex + 1}/{totalQuestions}
          </span>
          {category && (
            <span
              className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md hidden sm:inline-block shadow-sm"
              style={{
                borderColor: `${primaryColor}50`,
                backgroundColor: `${primaryColor}25`,
                color: primaryColor,
              }}
            >
              {category}
            </span>
          )}
        </div>

        {/* Action Controls (Zoom) */}
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
          <button
            onClick={() => {
              onPlayClickSound?.();
              setIsFullscreen(true);
            }}
            id="btn-fullscreen-clue"
            className="p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-slate-200 hover:text-white border border-white/20 transition-all backdrop-blur-md shadow-md cursor-pointer"
            title="Agrandir les 2 images"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>

        {/* Loading skeleton */}
        {!img1Loaded && !img2Loaded && !img1Error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-300/70 gap-2 z-10 bg-neutral-950">
            <ImageIcon className="w-7 h-7 animate-pulse text-purple-400" />
            <span className="text-[11px] sm:text-xs font-medium">Chargement des visuels de l'énigme...</span>
          </div>
        )}

        {/* DUAL IMAGE GRID OR SINGLE IMAGE */}
        <div className={`w-full h-full ${hasTwoImages && !img1Error ? 'grid grid-cols-2 gap-1 p-0.5' : 'flex'}`}>
          {/* Image 1 (Source Web) */}
          <div className="relative w-full h-full overflow-hidden bg-black/50 rounded-lg flex items-center justify-center group/img1">
            <img
              src={imageUrl}
              alt={imagePrompt || 'Indice visuel 1'}
              referrerPolicy="no-referrer"
              onLoad={() => setImg1Loaded(true)}
              onError={() => setImg1Error(true)}
              className={`w-full h-full object-cover transition-all duration-500 transform group-hover/img1:scale-105 ${
                img1Loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {hasTwoImages && (
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-black/75 text-white/90 border border-white/15 backdrop-blur-md pointer-events-none z-10">
                Vue 1 • Web
              </span>
            )}
          </div>

          {/* Image 2 (Source Wikipedia / Alternate) */}
          {hasTwoImages && (
            <div className="relative w-full h-full overflow-hidden bg-black/50 rounded-lg flex items-center justify-center group/img2">
              <img
                src={secondaryImageUrl}
                alt={`${imagePrompt || 'Indice visuel'} (${secondaryImageSource})`}
                referrerPolicy="no-referrer"
                onLoad={() => setImg2Loaded(true)}
                onError={() => setImg2Error(true)}
                className={`w-full h-full object-cover transition-all duration-500 transform group-hover/img2:scale-105 ${
                  img2Loaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-black/75 text-purple-200 border border-purple-400/20 backdrop-blur-md pointer-events-none z-10">
                Vue 2 • {secondaryImageSource}
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Scanline & Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1F]/80 via-transparent to-black/20 pointer-events-none" />

        {/* Text Clue Overlay Banner at Bottom (Hidden in pure visual blind test) */}
        {showTextClue && clue && (
          <div className="absolute bottom-0 inset-x-0 p-2 sm:p-3 bg-gradient-to-t from-[#0F0A1F] via-[#0F0A1F]/85 to-transparent flex items-center gap-2 z-10">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <p className="text-[11px] sm:text-xs font-medium text-slate-200 line-clamp-2">
              <span className="text-yellow-400 font-bold uppercase tracking-wider text-[10px] mr-1">Indice :</span> {clue}
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Modal with Dual Image Viewing */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0F0A1F]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-3 sm:p-5"
          >
            <div className="relative max-w-5xl w-full max-h-[90vh] rounded-3xl overflow-hidden border-2 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-neutral-950 p-3 sm:p-4 flex flex-col">
              {/* Header with Switcher Tabs if two images exist */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Énigme #{questionIndex + 1}
                  </span>
                  {hasTwoImages && (
                    <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/15">
                      <button
                        onClick={() => setActiveZoomIndex('both')}
                        className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-colors ${
                          activeZoomIndex === 'both' ? 'bg-purple-600 text-white shadow-sm' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Les 2 Vues
                      </button>
                      <button
                        onClick={() => setActiveZoomIndex(0)}
                        className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-colors ${
                          activeZoomIndex === 0 ? 'bg-purple-600 text-white shadow-sm' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Vue 1 (Web)
                      </button>
                      <button
                        onClick={() => setActiveZoomIndex(1)}
                        className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-colors ${
                          activeZoomIndex === 1 ? 'bg-purple-600 text-white shadow-sm' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Vue 2 ({secondaryImageSource})
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-3 py-1 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                >
                  Fermer
                </button>
              </div>

              {/* Large Image Preview Body */}
              <div className="flex-1 min-h-0 py-3 flex items-center justify-center gap-3 overflow-hidden">
                {(activeZoomIndex === 'both' || activeZoomIndex === 0) && (
                  <div className="relative flex-1 h-full max-h-[65vh] rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt={imagePrompt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/80 text-white border border-white/20">
                      Vue 1 • Web
                    </span>
                  </div>
                )}

                {hasTwoImages && (activeZoomIndex === 'both' || activeZoomIndex === 1) && (
                  <div className="relative flex-1 h-full max-h-[65vh] rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                    <img
                      src={secondaryImageUrl}
                      alt={`${imagePrompt} (${secondaryImageSource})`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-950/80 text-purple-200 border border-purple-500/30">
                      Vue 2 • {secondaryImageSource}
                    </span>
                  </div>
                )}
              </div>

              {clue && (
                <div className="p-2.5 bg-white/5 border-t border-white/10 text-center rounded-b-2xl shrink-0">
                  <p className="text-xs sm:text-sm font-semibold text-white/90">{clue}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

