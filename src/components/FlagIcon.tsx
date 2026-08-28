import React from 'react';

interface FlagIconProps {
  code: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FlagIcon: React.FC<FlagIconProps> = ({
  code,
  className = 'w-5 h-3.5',
}) => {
  const c = (code || 'fr').toLowerCase().trim();

  switch (c) {
    case 'fr':
      return (
        <svg
          viewBox="0 0 900 600"
          className={`${className} inline-block rounded-xs overflow-hidden shrink-0 shadow-xs`}
          aria-label="Français"
        >
          <rect width="300" height="600" fill="#002654" />
          <rect x="300" width="300" height="600" fill="#FFFFFF" />
          <rect x="600" width="300" height="600" fill="#CE1126" />
        </svg>
      );

    case 'en':
    case 'gb':
    case 'uk':
      return (
        <svg
          viewBox="0 0 60 30"
          className={`${className} inline-block rounded-xs overflow-hidden shrink-0 shadow-xs`}
          aria-label="English"
        >
          <clipPath id="s">
            <path d="M0,0 v30 h60 v-30 z" />
          </clipPath>
          <clipPath id="t">
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
          </clipPath>
          <g clipPath="url(#s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
          </g>
        </svg>
      );

    case 'es':
      return (
        <svg
          viewBox="0 0 750 500"
          className={`${className} inline-block rounded-xs overflow-hidden shrink-0 shadow-xs`}
          aria-label="Español"
        >
          <rect width="750" height="500" fill="#AA151B" />
          <rect y="125" width="750" height="250" fill="#F1BF00" />
          <circle cx="210" cy="250" r="45" fill="#AA151B" opacity="0.85" />
          <circle cx="210" cy="250" r="30" fill="#F1BF00" />
        </svg>
      );

    case 'de':
      return (
        <svg
          viewBox="0 0 5 3"
          className={`${className} inline-block rounded-xs overflow-hidden shrink-0 shadow-xs`}
          aria-label="Deutsch"
        >
          <rect width="5" height="1" y="0" fill="#000000" />
          <rect width="5" height="1" y="1" fill="#DD0000" />
          <rect width="5" height="1" y="2" fill="#FFCE00" />
        </svg>
      );

    case 'it':
      return (
        <svg
          viewBox="0 0 900 600"
          className={`${className} inline-block rounded-xs overflow-hidden shrink-0 shadow-xs`}
          aria-label="Italiano"
        >
          <rect width="300" height="600" fill="#009246" />
          <rect x="300" width="300" height="600" fill="#FFFFFF" />
          <rect x="600" width="300" height="600" fill="#CE2B37" />
        </svg>
      );

    case 'pt':
      return (
        <svg
          viewBox="0 0 600 400"
          className={`${className} inline-block rounded-xs overflow-hidden shrink-0 shadow-xs`}
          aria-label="Português"
        >
          <rect width="240" height="400" fill="#006600" />
          <rect x="240" width="360" height="400" fill="#FF0000" />
          <circle cx="240" cy="200" r="60" fill="#FFFF00" />
          <circle cx="240" cy="200" r="45" fill="#FFFFFF" stroke="#0000FF" strokeWidth="4" />
        </svg>
      );

    case 'nl':
      return (
        <svg
          viewBox="0 0 9 6"
          className={`${className} inline-block rounded-xs overflow-hidden shrink-0 shadow-xs`}
          aria-label="Nederlands"
        >
          <rect width="9" height="2" y="0" fill="#AE1C28" />
          <rect width="9" height="2" y="2" fill="#FFFFFF" />
          <rect width="9" height="2" y="4" fill="#21468B" />
        </svg>
      );

    case 'ru':
      return (
        <svg
          viewBox="0 0 9 6"
          className={`${className} inline-block rounded-xs overflow-hidden shrink-0 shadow-xs`}
          aria-label="Русский"
        >
          <rect width="9" height="2" y="0" fill="#FFFFFF" />
          <rect width="9" height="2" y="2" fill="#0039A6" />
          <rect width="9" height="2" y="4" fill="#D52B1E" />
        </svg>
      );

    case 'ja':
    case 'jp':
      return (
        <svg
          viewBox="0 0 900 600"
          className={`${className} inline-block rounded-xs overflow-hidden shrink-0 shadow-xs bg-white`}
          aria-label="日本語"
        >
          <rect width="900" height="600" fill="#FFFFFF" />
          <circle cx="450" cy="300" r="180" fill="#BC002D" />
        </svg>
      );

    case 'zh':
    case 'cn':
      return (
        <svg
          viewBox="0 0 900 600"
          className={`${className} inline-block rounded-xs overflow-hidden shrink-0 shadow-xs`}
          aria-label="中文"
        >
          <rect width="900" height="600" fill="#DE2910" />
          {/* Big star */}
          <polygon
            points="150,75 168,131 226,131 179,165 197,221 150,187 103,221 121,165 74,131 132,131"
            fill="#FFDE00"
          />
          {/* 4 small stars */}
          <circle cx="300" cy="60" r="15" fill="#FFDE00" />
          <circle cx="360" cy="120" r="15" fill="#FFDE00" />
          <circle cx="360" cy="210" r="15" fill="#FFDE00" />
          <circle cx="300" cy="270" r="15" fill="#FFDE00" />
        </svg>
      );

    case 'ko':
    case 'kr':
      return (
        <svg
          viewBox="0 0 900 600"
          className={`${className} inline-block rounded-xs overflow-hidden shrink-0 shadow-xs bg-white`}
          aria-label="한국어"
        >
          <rect width="900" height="600" fill="#FFFFFF" />
          <circle cx="450" cy="300" r="150" fill="#C60C30" />
          <path d="M450,450 A150,150 0 0,0 450,150 A75,75 0 0,1 450,300 A75,75 0 0,0 450,450 Z" fill="#003478" />
        </svg>
      );

    case 'ar':
    case 'sa':
      return (
        <svg
          viewBox="0 0 900 600"
          className={`${className} inline-block rounded-xs overflow-hidden shrink-0 shadow-xs`}
          aria-label="العربية"
        >
          <rect width="900" height="600" fill="#006C35" />
          <rect x="250" y="380" width="400" height="25" rx="10" fill="#FFFFFF" />
          <circle cx="450" cy="250" r="60" fill="none" stroke="#FFFFFF" strokeWidth="18" />
        </svg>
      );

    default:
      return (
        <span className={`${className} inline-flex items-center justify-center font-bold text-xs bg-purple-900/60 text-white rounded-xs border border-white/20`}>
          {c.toUpperCase().slice(0, 2)}
        </span>
      );
  }
};
