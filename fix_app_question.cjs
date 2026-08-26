const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight font-heading drop-shadow-2xl" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>\s*\{currentQuestion.question\}\s*<\/h2>/,
  '<h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white leading-tight font-heading drop-shadow-2xl whitespace-nowrap overflow-hidden text-ellipsis w-full px-4" style={{ textShadow: \'0 4px 15px rgba(0,0,0,0.8)\' }} title={currentQuestion.question}>\n                      {currentQuestion.question}\n                    </h2>'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Question updated');
