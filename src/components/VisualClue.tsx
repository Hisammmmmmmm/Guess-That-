import React, { useState, useEffect, useMemo } from 'react';
import { Maximize2, Sparkles, Image as ImageIcon, ZoomIn, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { t } from '../i18n/translations';

interface VisualClueProps {
  language?: string;
  imageUrl: string;
  secondaryImageUrl?: string;
  secondaryImageSource?: string;
  tertiaryImageUrl?: string;
  images?: string[];
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

interface ImageCandidate {
  id: number;
  url: string;
  label: string;
  source: string;
  fallbackTried?: boolean;
}

export const VisualClue: React.FC<VisualClueProps> = ({
  language = 'fr',
  imageUrl,
  secondaryImageUrl,
  secondaryImageSource = 'Wikidata Canonique',
  tertiaryImageUrl,
  images,
  imagePrompt,
  category,
  clue,
  timeLeft = 15,
  totalTime = 15,
  progressiveBlurEnabled = false,
  isAnswered = false,
  questionIndex,
  totalQuestions,
  primaryColor = '#9333ea',
  onPlayClickSound,
  showTextClue = true,
  fullHeight = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeZoomIndex, setActiveZoomIndex] = useState<number | 'all'>('all');
  
  // Track failed image URLs so broken links are automatically proxied or excluded
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());
  const [proxiedUrls, setProxiedUrls] = useState<Map<string, string>>(new Map());
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());

  // Build candidate image list from all 10 distinct logics
  const rawCandidates: ImageCandidate[] = useMemo(() => {
    const list: ImageCandidate[] = [];
    const knownUrls = new Set<string>();

    const addCandidate = (url: string | undefined, defaultSource: string, viewNum: number) => {
      if (!url || typeof url !== 'string' || !url.startsWith('http') || url.includes('Wikipedia-logo')) return;
      if (knownUrls.has(url)) return;
      knownUrls.add(url);

      const labelKey = `view_${viewNum}`;
      const localizedLabel = t(labelKey, language) || `Vue ${viewNum}`;

      list.push({
        id: list.length,
        url,
        label: localizedLabel,
        source: defaultSource,
      });
    };

    // If a full array of multi-logic images was passed from backend
    if (Array.isArray(images) && images.length > 0) {
      images.forEach((img, idx) => {
        let sourceName = 'Web HD';
        if (img.includes('openverse')) {
          sourceName = 'Openverse CC';
        } else if (img.includes('pithumbsize=1200') || img.includes('pageimages') || img.includes('upload.wikimedia.org/wikipedia/commons/thumb')) {
          sourceName = 'MediaWiki HD';
        } else if (img.includes('commons.wikimedia.org') || img.includes('upload.wikimedia.org/wikipedia/commons')) {
          sourceName = img.includes('rest_v1') || img.includes('wiki_lead') ? 'Encyclopédie HD' : 'Wikimedia Commons';
        } else if (img.includes('wikidata')) {
          sourceName = 'Wikidata Canonique';
        } else if (img.includes('wallpaper') || img.includes('fanart') || img.includes('4k')) {
          sourceName = 'Scène 4K';
        } else if (img.includes('bing.com')) {
          sourceName = 'Recherche Web HD';
        } else if (img.includes('duckduckgo')) {
          sourceName = idx === 0 ? 'DuckDuckGo FR' : 'DuckDuckGo EN';
        } else {
          sourceName = `Source ${idx + 1}`;
        }

        addCandidate(img, sourceName, idx + 1);
      });
    }

    // Ensure primary, secondary, and tertiary images are registered if not yet in list
    if (imageUrl) {
      addCandidate(imageUrl, 'DuckDuckGo FR', list.length + 1);
    }
    if (secondaryImageUrl) {
      addCandidate(secondaryImageUrl, secondaryImageSource || 'Recherche Web HD', list.length + 1);
    }
    if (tertiaryImageUrl) {
      addCandidate(tertiaryImageUrl, 'Wikidata HD', list.length + 1);
    }

    return list;
  }, [imageUrl, secondaryImageUrl, secondaryImageSource, tertiaryImageUrl, images, language]);

  // Reset tracking state when question changes
  useEffect(() => {
    setFailedUrls(new Set());
    setProxiedUrls(new Map());
    setLoadedUrls(new Set());
    setActiveZoomIndex('all');
  }, [questionIndex, imageUrl]);

  // Compute available, working images
  const validCandidates = useMemo(() => {
    return rawCandidates
      .map((c) => {
        const activeUrl = proxiedUrls.get(c.url) || c.url;
        return {
          ...c,
          effectiveUrl: activeUrl,
        };
      })
      .filter((c) => !failedUrls.has(c.effectiveUrl));
  }, [rawCandidates, failedUrls, proxiedUrls]);

  // Handle image loading failure: try proxying first, then safely filter out if upstream is dead
  const handleImageError = (originalUrl: string, effectiveUrl: string) => {
    if (!proxiedUrls.has(originalUrl) && !effectiveUrl.startsWith('/api/image-proxy')) {
      const proxied = `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
      setProxiedUrls((prev) => new Map(prev).set(originalUrl, proxied));
    } else {
      setFailedUrls((prev) => new Set(prev).add(effectiveUrl).add(originalUrl));
    }
  };

  const handleImageLoaded = (url: string) => {
    setLoadedUrls((prev) => new Set(prev).add(url));
  };

  // Optional mystery blur filter if progressive blur is active and answer not yet revealed
  const getBlurStyle = (): React.CSSProperties => {
    if (isAnswered || !progressiveBlurEnabled) {
      return { filter: 'none', transition: 'filter 0.5s ease-out' };
    }
    const ratio = Math.max(0, Math.min(1, timeLeft / Math.max(1, totalTime)));
    const blurPx = Math.round(ratio * 18);
    return {
      filter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
      transition: 'filter 0.25s linear',
    };
  };

  // Grid column calculation for simultaneous display of ALL images
  const getGridClasses = (count: number) => {
    switch (count) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-2 sm:grid-cols-4';
      case 5:
        return 'grid-cols-3 sm:grid-cols-5';
      case 6:
        return 'grid-cols-3 sm:grid-cols-3 md:grid-cols-6';
      case 7:
      case 8:
        return 'grid-cols-4 sm:grid-cols-4 md:grid-cols-4';
      case 9:
      case 10:
      default:
        return 'grid-cols-3 sm:grid-cols-5';
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden group select-none ${
        fullHeight
          ? 'h-full flex-1 flex flex-col min-h-0 p-0 border-0 rounded-none bg-transparent shadow-none'
          : 'rounded-2xl sm:rounded-3xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-2 sm:p-2.5 bg-white/5 backdrop-blur-md'
      }`}
    >
      {/* Main Display Container */}
      <div
        className={`relative w-full h-full overflow-hidden bg-neutral-950 flex items-center justify-center ${
          fullHeight ? 'flex-1 min-h-0 rounded-none' : 'rounded-xl sm:rounded-2xl aspect-video sm:aspect-[16/9]'
        }`}
      >
        {/* Top Header Badge */}
        <div className="absolute top-2 left-2 z-30 flex items-center gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full bg-black/80 text-white/90 border border-white/20 backdrop-blur-md shadow-sm">
            {t('clue', language)} #{questionIndex + 1}/{totalQuestions}
          </span>
          {validCandidates.length > 0 && (
            <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-purple-600/80 text-purple-100 border border-purple-400/40 backdrop-blur-md shadow-sm flex items-center gap-1">
              <Layers className="w-2.5 h-2.5" />
              {validCandidates.length} {validCandidates.length > 1 ? 'images' : 'image'}
            </span>
          )}
          {category && (
            <span
              className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md hidden md:inline-block shadow-sm"
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

        {/* Top Right Controls: Fullscreen Zoom */}
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5">
          <button
            onClick={() => {
              onPlayClickSound?.();
              setActiveZoomIndex('all');
              setIsFullscreen(true);
            }}
            id="btn-fullscreen-clue"
            className="p-1.5 rounded-full bg-black/80 hover:bg-purple-600 text-slate-200 hover:text-white border border-white/20 transition-all backdrop-blur-md shadow-md cursor-pointer flex items-center gap-1 text-[10px] font-bold px-2.5"
            title={t('zoom_images', language)}
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">{t('zoom_images', language) || 'Agrandir'}</span>
          </button>
        </div>

        {/* SIMULTANEOUS ALL-IMAGES GRID BODY */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-1 sm:p-1.5">
          {validCandidates.length > 0 ? (
            <div
              className={`w-full h-full grid gap-1 sm:gap-1.5 ${getGridClasses(validCandidates.length)}`}
            >
              {validCandidates.map((item, idx) => (
                <div
                  key={`${item.id}-${item.effectiveUrl}`}
                  onClick={() => {
                    onPlayClickSound?.();
                    setActiveZoomIndex(idx);
                    setIsFullscreen(true);
                  }}
                  className="relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden bg-black/60 border border-white/10 hover:border-purple-400/80 transition-all duration-200 group/item cursor-pointer flex items-center justify-center"
                >
                  <img
                    src={item.effectiveUrl}
                    alt={imagePrompt || `${t('visual_clue', language)} ${item.id + 1}`}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    onLoad={() => handleImageLoaded(item.effectiveUrl)}
                    onError={() => handleImageError(item.url, item.effectiveUrl)}
                    style={getBlurStyle()}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                  />
                  
                  {/* Subtle hover overlay with zoom icon */}
                  <div className="absolute inset-0 bg-purple-950/20 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="p-1 rounded-full bg-black/70 border border-white/30 text-white shadow-md">
                      <ZoomIn className="w-3 h-3 text-purple-300" />
                    </div>
                  </div>

                  {/* Badge at Bottom of each image */}
                  <div className="absolute bottom-1 left-1 z-20 flex items-center gap-0.5 max-w-[95%] pointer-events-none">
                    <span className="px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-wider bg-black/85 text-white/95 border border-white/20 backdrop-blur-md shadow-md truncate">
                      {item.label} • {item.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Fallback if all image queries returned no result */
            <div className="flex flex-col items-center justify-center p-6 text-center text-white/80 gap-3 z-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 animate-pulse">
                <ImageIcon className="w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1 max-w-xs">
                <span className="text-sm font-bold text-white">Indice Visuel</span>
                <p className="text-xs text-white/60 line-clamp-3 italic">
                  {imagePrompt || "Devinez l'élément correspondant à la question !"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1F]/40 via-transparent to-black/20 pointer-events-none" />

        {/* Text Clue Overlay Banner at Bottom (Hidden in pure visual blind test) */}
        {showTextClue && clue && (
          <div className="absolute bottom-0 inset-x-0 p-2 sm:p-3 bg-gradient-to-t from-[#0F0A1F] via-[#0F0A1F]/85 to-transparent flex items-center gap-2 z-10">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <p className="text-[11px] sm:text-xs font-medium text-slate-200 line-clamp-2">
              <span className="text-yellow-400 font-bold uppercase tracking-wider text-[10px] mr-1">{t('clue', language)} :</span> {clue}
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Modal displaying all images simultaneously or selected view */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0F0A1F]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-2 sm:p-4"
          >
            <div className="relative max-w-6xl w-full max-h-[92vh] rounded-3xl overflow-hidden border-2 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-neutral-950 p-3 sm:p-4 flex flex-col">
              {/* Header with Switcher Tabs for all candidate images */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0 gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-400" />
                    {t('riddle_label', language)} #{questionIndex + 1}
                  </span>
                  {validCandidates.length > 1 && (
                    <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/15 flex-wrap max-h-24 overflow-y-auto">
                      <button
                        onClick={() => {
                          onPlayClickSound?.();
                          setActiveZoomIndex('all');
                        }}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          activeZoomIndex === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {t('all_views', language) || 'Toutes les Vues'} ({validCandidates.length})
                      </button>
                      {validCandidates.map((c, idx) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            onPlayClickSound?.();
                            setActiveZoomIndex(idx);
                          }}
                          className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            activeZoomIndex === idx ? 'bg-purple-600 text-white shadow-sm' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          {c.label} ({c.source})
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    onPlayClickSound?.();
                    setIsFullscreen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                >
                  {t('close', language)}
                </button>
              </div>

              {/* Large Image Preview Body (Grille de toutes les images ou vue individuelle détaillée) */}
              <div className="flex-1 min-h-0 py-3 flex items-center justify-center overflow-y-auto">
                {activeZoomIndex === 'all' ? (
                  <div className={`w-full h-full grid gap-2.5 ${validCandidates.length >= 7 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : validCandidates.length >= 5 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3' : validCandidates.length >= 3 ? 'grid-cols-2 md:grid-cols-3' : validCandidates.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {validCandidates.map((c, idx) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onPlayClickSound?.();
                          setActiveZoomIndex(idx);
                        }}
                        className="relative h-full min-h-[140px] max-h-[35vh] rounded-2xl overflow-hidden bg-black/60 border border-white/10 hover:border-purple-400/80 transition-all flex items-center justify-center cursor-pointer group/modal"
                      >
                        <img
                          src={c.effectiveUrl}
                          alt={`${imagePrompt} (${c.label})`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain group-hover/modal:scale-105 transition-transform"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/85 text-white border border-white/20 shadow-md">
                          {c.label} • {c.source}
                        </span>
                        <div className="absolute bottom-2 right-2 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover/modal:opacity-100 transition-opacity">
                          <ZoomIn className="w-3.5 h-3.5 text-purple-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  validCandidates[activeZoomIndex] && (
                    <div className="relative w-full h-full max-h-[70vh] rounded-2xl overflow-hidden bg-black/70 border border-white/15 flex items-center justify-center p-2">
                      <img
                        src={validCandidates[activeZoomIndex].effectiveUrl}
                        alt={`${imagePrompt} (${validCandidates[activeZoomIndex].label})`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain max-h-[68vh]"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-black/85 text-white border border-white/20 shadow-md">
                        {validCandidates[activeZoomIndex].label} • {validCandidates[activeZoomIndex].source}
                      </span>
                    </div>
                  )
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
