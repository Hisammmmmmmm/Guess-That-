const fs = require('fs');
let code = fs.readFileSync('src/components/ScoreBoard.tsx', 'utf8');

const newReturn = `  return (
    <div className="fixed top-16 left-0 right-0 z-40 w-full" id="hud-scoreboard">
      {/* Thin Sleek Progress Bar with Ambient Glow */}
      <div className="w-full bg-white/10 h-1.5 overflow-hidden backdrop-blur-sm">
        <div
          className="h-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(147,51,234,0.8)]"
          style={{
            width: \`\${progressPct}%\`,
            backgroundColor: primaryColor || '#ef4444', // Default to red to match 'ligne rouge'
          }}
        />
      </div>
    </div>
  );`;

code = code.replace(/return \([\s\S]*\);/m, newReturn);
fs.writeFileSync('src/components/ScoreBoard.tsx', code);
