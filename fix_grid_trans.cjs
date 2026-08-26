const fs = require('fs');
let code = fs.readFileSync('src/components/QuestionCard.tsx', 'utf8');

code = code.replace(
  /<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 flex-1 min-h-0" id="options-grid">/,
  '<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 flex-1 min-h-0 transition-all duration-300" id="options-grid">'
);

fs.writeFileSync('src/components/QuestionCard.tsx', code);
