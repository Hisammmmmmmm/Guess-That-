const fs = require('fs');
let code = fs.readFileSync('src/services/soundEngine.ts', 'utf8');

// Change the base multiplier for SFX Volume to make it louder
// private sfxVol = 0.85; -> private sfxVol = 1.5;
code = code.replace(/private sfxVol = 0\.85;/, 'private sfxVol = 1.7;');

// Update the setSfxVolume method
code = code.replace(
  /this\.sfxVol = Math\.max\(0, Math\.min\(1, val\)\);/g,
  'this.sfxVol = Math.max(0, Math.min(1, val)) * 2; // Made much louder by default'
);

// We need to also check if we pass val down, wait:
// The settings state from App.tsx might pass 0.8 or 1.0. If it passes 1.0, it will be 2.0.

fs.writeFileSync('src/services/soundEngine.ts', code);
console.log('SFX volume increased');
