const fs = require('fs');
let code = fs.readFileSync('src/data/fallbackGenerator.ts', 'utf8');

const defaultAnswers = [
  "El concepto original",
  "El emblema oficial",
  "El logro principal",
  "La figura legendaria",
  "El secreto oculto",
  "El duelo épico",
  "El artefacto legendario",
  "El santuario principal",
  "El récord mundial",
  "El legado universal",
  "El lema inolvidable",
  "La prueba final",
  "La ley fundamental",
  "La verdad oculta",
  "El estatus de obra maestra"
];

let counter = 0;
code = code.replace(/ans: \(\) => `Respuesta Correcta`/g, (match) => {
  const ans = defaultAnswers[counter % 15];
  counter++;
  return `ans: () => \`${ans}\``;
});

fs.writeFileSync('src/data/fallbackGenerator.ts', code);
