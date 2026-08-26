const fs = require('fs');
let code = fs.readFileSync('src/components/AudioCluePlayer.tsx', 'utf8');

code = code.replace(/const isHigh = isPlaying &&/g, 'const isHigh = (isPlaying || isMusicMode) &&');
code = code.replace(/const height = isPlaying \?/g, 'const height = (isPlaying || isMusicMode) ?');
code = code.replace(/backgroundColor: isPlaying \? primaryColor/g, 'backgroundColor: (isPlaying || isMusicMode) ? primaryColor');
code = code.replace(/boxShadow: isPlaying && isHigh \?/g, 'boxShadow: (isPlaying || isMusicMode) && isHigh ?');

// Also update the text "Lecture de l'indice en cours..." vs "Musique prête, écoute attentive..."
// It currently uses `isPlaying` to decide. Let's make it always say 'Lecture de la musique...' in isMusicMode
code = code.replace(
  /{isPlaying \? \(isMusicMode \? 'Lecture de la musique\.\.\.' : 'Lecture de l\\'indice en cours\.\.\.'\) : \(isMusicMode \? 'Musique prête, écoute attentive\.\.\.' : 'Lecture vocale automatique activée'\)}/g,
  "{isMusicMode ? 'Lecture de la musique...' : (isPlaying ? 'Lecture de l\\'indice en cours...' : 'Lecture vocale automatique activée')}"
);

// We need to make the interval run if isMusicMode is true so activeBar increments
code = code.replace(/if \(isPlaying\) \{/g, 'if (isPlaying || isMusicMode) {');

fs.writeFileSync('src/components/AudioCluePlayer.tsx', code);
