import React from 'react';

interface DynamicBackgroundProps {
  bgImage?: string;
  primaryColor?: string;
  accentColor?: string;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  bgImage,
  primaryColor = '#9333ea',
  accentColor = '#ec4899',
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#0F0A1F]">
      {/* Background Image with Dark Tint Overlay if available */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 opacity-15 filter blur-sm"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        />
      )}

      {/* Deep Immersive Gradient Veil */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F0A1F]/80 via-[#0F0A1F]/95 to-[#0F0A1F]" />

      {/* Immersive UI Ambient Glowing Blur Orbs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 opacity-25 blur-[130px] rounded-full animate-pulse-glow"
        style={{
          backgroundColor: primaryColor,
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600 opacity-20 blur-[130px] rounded-full animate-pulse-glow"
        style={{
          backgroundColor: accentColor,
          animationDelay: '2.5s',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] bg-purple-900 opacity-15 blur-[100px] rounded-full"
      />

      {/* Subtle Noise / Radial Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
};

