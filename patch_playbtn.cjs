const fs = require('fs');
let code = fs.readFileSync('src/components/AudioCluePlayer.tsx', 'utf8');

code = code.replace(
  /\{isPlaying \? \(\\n            isMusicMode \? <Square className="w-5 h-5 sm:w-6 sm:h-6 fill-current" \/> : <Volume2 className="w-4 h-4 animate-pulse" \/>\\n          \) : \(\\n            <Play className=\{`\$\{isMusicMode \? 'w-6 h-6 sm:w-8 sm:h-8 ml-1 sm:ml-2' : 'w-4 h-4 ml-0.5'\} fill-current`\} \/>\\n          \)\}/g,
  `{isMusicMode ? (
            <Disc className="w-6 h-6 sm:w-8 sm:h-8 animate-spin-slow" />
          ) : isPlaying ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <Play className="w-4 h-4 ml-0.5 fill-current" />
          )}`
);

fs.writeFileSync('src/components/AudioCluePlayer.tsx', code);
