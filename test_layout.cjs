const fs = require('fs');
let code = fs.readFileSync('src/components/QuestionCard.tsx', 'utf8');

// Container fixed height
code = code.replace(
  /<div className="flex flex-col gap-3 sm:gap-3.5 w-full" id="question-card-container">/,
  '<div className="flex flex-col gap-2 sm:gap-3 w-full h-[280px] sm:h-[180px]" id="question-card-container">'
);

// Options grid takes flex-1
code = code.replace(
  /<div className="grid grid-cols-1 sm:grid-cols-2 gap-2\.5 sm:gap-3" id="options-grid">/,
  '<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 flex-1 min-h-0" id="options-grid">'
);

// Remove fixed height from buttons, make them h-full
code = code.replace(
  /className=\{`group relative \$\{isAnswered \? 'h-10 sm:h-11' : 'h-13 sm:h-15'\} border/g,
  'className={`group relative h-full border'
);

// The trivia box should have shrink-0 so it doesn't get squashed
code = code.replace(
  /className="p-3 sm:p-4 rounded-2xl border border-white\/15 bg-white\/5 backdrop-blur-2xl shadow-lg/g,
  'className="p-3 sm:p-4 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-2xl shadow-lg shrink-0'
);

fs.writeFileSync('src/components/QuestionCard.tsx', code);
