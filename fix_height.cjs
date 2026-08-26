const fs = require('fs');
let code = fs.readFileSync('src/components/QuestionCard.tsx', 'utf8');

code = code.replace(
  /h-\[280px\]/g,
  'h-[300px]'
);

fs.writeFileSync('src/components/QuestionCard.tsx', code);
