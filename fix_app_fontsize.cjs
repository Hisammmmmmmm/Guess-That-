const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white leading-tight font-heading drop-shadow-2xl whitespace-nowrap overflow-hidden text-ellipsis max-w-full inline-block px-1" style=\{\{ textShadow: '0 4px 15px rgba\(0,0,0,0.8\)' \}\} title=\{currentQuestion\.question\}>/;

code = code.replace(
  regex,
  '<h2 className={`font-black text-white leading-tight font-heading drop-shadow-2xl whitespace-nowrap overflow-hidden text-ellipsis max-w-full inline-block px-1 ${currentQuestion.question.length > 50 ? \'text-sm sm:text-base md:text-lg\' : \'text-base sm:text-lg md:text-xl lg:text-2xl\'}`} style={{ textShadow: \'0 4px 15px rgba(0,0,0,0.8)\' }} title={currentQuestion.question}>'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Font size conditional applied');
