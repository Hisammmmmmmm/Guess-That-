const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. In startQuiz, do not start ambience for music_blind_test
code = code.replace(
  /if \(settings\.musicEnabled\) \{\n\s*soundEngine\.startAmbience\(preparedData\.ambientSound \|\| 'synthwave'\);\n\s*\}/,
  `if (settings.musicEnabled && settings.gameMode !== 'music_blind_test') {
      soundEngine.startAmbience(preparedData.ambientSound || 'synthwave');
    }`
);

// 2. Hide "Audio Player" and "Category" frames for music_blind_test
// We find Frame 3 and Frame 5.

// Frame 3
code = code.replace(
  /\{\/\* Frame 3: Audio Player \*\/\}[\s\S]*?<AudioCluePlayer[\s\S]*?\/>\n\s*<\/div>/,
  `{settings.gameMode !== 'music_blind_test' && (
                    {/* Frame 3: Audio Player */}
                    <div className="bg-black/20 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl flex flex-col items-center justify-center min-h-[100px] shrink-0">
                       <AudioCluePlayer
                         audioNotes={currentQuestion.audioNotes}
                         clueText={currentQuestion.clue}
                         speechEnabled={settings.speechCluesEnabled}
                         primaryColor={quizData.primaryColor}
                         youtubeVideoId={activeVideoId}
                         gameMode={settings.gameMode}
                       />
                    </div>
                    )}`
);

// Frame 5
code = code.replace(
  /\{\/\* Frame 5: Category \*\/\}[\s\S]*?<span className="text-sm lg:text-base font-bold text-white capitalize">\{currentQuestion\.category\}<\/span>\n\s*<\/div>/,
  `{settings.gameMode !== 'music_blind_test' && (
                     {/* Frame 5: Category */}
                     <div className="bg-black/20 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl text-center flex flex-col items-center justify-center gap-2 h-28 shrink-0">
                       <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Catégorie</span>
                       <span className="text-sm lg:text-base font-bold text-white capitalize">{currentQuestion.category}</span>
                     </div>
                     )}`
);

// And hide the fallback "AudioCluePlayer" on mobile too if it's music_blind_test
code = code.replace(
  /<div className="bg-black\/20 backdrop-blur-md p-2 rounded-2xl border border-white\/10 flex items-center justify-center">\n\s*<AudioCluePlayer[\s\S]*?\/>\n\s*<\/div>/,
  `{settings.gameMode !== 'music_blind_test' && (
                  <div className="bg-black/20 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex items-center justify-center">
                     <AudioCluePlayer
                       audioNotes={currentQuestion.audioNotes}
                       clueText={currentQuestion.clue}
                       speechEnabled={settings.speechCluesEnabled}
                       primaryColor={quizData.primaryColor}
                       youtubeVideoId={activeVideoId}
                       gameMode={settings.gameMode}
                     />
                  </div>
                  )}`
);

// Remove "Écoutez attentivement" text inside the center panel
code = code.replace(
  /<div className="text-center">\n\s*<span className="text-white\/60 font-bold tracking-\[0\.3em\] uppercase text-sm md:text-base">Écoutez attentivement<\/span>\n\s*<\/div>/,
  ''
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated for layout and sound fixes.');
