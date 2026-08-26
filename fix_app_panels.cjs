const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const leftPanel = `                  {/* LEFT PANEL: Info & Audio Player */}
                  <div className="hidden md:flex w-56 lg:w-64 shrink-0 flex-col gap-3">
                    {/* Frame 1: Question Number */}
                    <div className="bg-black/20 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl flex flex-col items-center justify-center gap-1 min-h-[90px] shrink-0">
                      <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">Question</span>
                      <span className="text-xl font-black text-white leading-tight">
                        {(currentQuestionIndex + 1).toString().padStart(2, '0')} <span className="text-white/30 text-base">/ {quizData.questions.length.toString().padStart(2, '0')}</span>
                      </span>
                    </div>
                    {/* Frame 2: Circular Countdown */}
                    <div className="bg-black/20 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl flex flex-col items-center justify-center gap-3 flex-1 min-h-0">
                      <CircularCountdown
                        timeLeft={timeLeft}
                        totalTime={settings.durationPerQuestion}
                        primaryColor={quizData.primaryColor}
                        size={80}
                      />
                      <div className="flex flex-col text-center">
                        <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Gain potentiel</span>
                        <span className="text-lg font-black text-yellow-400 font-mono-tech drop-shadow-md">
                          +{Math.round(100 + Math.max(0, timeLeft) * 10)} pts
                        </span>
                      </div>
                    </div>
                    {/* Frame 3: Audio Player */}
                    <div className="bg-black/20 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl flex flex-col items-center justify-center min-h-[100px] shrink-0">
                       <AudioCluePlayer
                         audioNotes={currentQuestion.audioNotes}
                         clueText={currentQuestion.clue}
                         speechEnabled={settings.speechCluesEnabled}
                         primaryColor={quizData.primaryColor}
                         youtubeVideoId={currentQuestion.youtubeVideoId}
                         gameMode={settings.gameMode}
                       />
                    </div>
                  </div>`;

const rightPanel = `                  {/* RIGHT PANEL: Category & Text Clue */}
                  <div className="hidden md:flex w-56 lg:w-64 shrink-0 flex-col gap-3">
                     {/* Frame 4: Score */}
                     <div className="bg-black/20 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl flex flex-col items-center justify-center gap-1 min-h-[90px] shrink-0 relative overflow-hidden">
                       {stats.streak >= 3 && (
                         <div className="absolute top-0 right-0 bg-orange-500/20 px-2 py-0.5 rounded-bl-lg border-b border-l border-orange-500/30 text-[9px] font-bold text-orange-400 flex items-center gap-1">
                           <Flame className="w-3 h-3" /> x{stats.streak >= 5 ? '3.0' : '2.0'}
                         </div>
                       )}
                       <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">Score</span>
                       <span className="text-xl font-black text-yellow-400 tracking-tight leading-tight">
                         {stats.score.toLocaleString()}
                       </span>
                     </div>
                     {/* Frame 5: Category */}
                     <div className="bg-black/20 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl text-center flex flex-col items-center justify-center gap-2 h-28 shrink-0">
                       <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Catégorie</span>
                       <span className="text-sm lg:text-base font-bold text-white capitalize">{currentQuestion.category}</span>
                     </div>
                     {/* Frame 6: Text Clue */}
                     <div className="bg-black/20 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl text-center flex-1 min-h-0 flex flex-col items-center justify-center overflow-hidden">
                       <span className="text-[10px] uppercase text-white/50 font-bold mb-2 block shrink-0">Indice</span>
                       <span className="text-xs lg:text-sm text-white/90 italic leading-relaxed overflow-y-auto w-full custom-scrollbar pr-1">
                         « {currentQuestion.clue} »
                       </span>
                     </div>
                  </div>`;

const mobileFallback = `                {/* MOBILE FALLBACK: Info & Audio Player */}
                <div className="md:hidden flex flex-col gap-2">
                  <div className="flex flex-row items-center justify-between gap-2 bg-black/20 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                     <div className="flex items-center gap-2">
                       <CircularCountdown
                          timeLeft={timeLeft}
                          totalTime={settings.durationPerQuestion}
                          primaryColor={quizData.primaryColor}
                          size={40}
                        />
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-purple-400">
                            Q{(currentQuestionIndex + 1)}/{quizData.questions.length}
                          </span>
                        </div>
                     </div>
                     <div className="flex flex-col items-end">
                       <span className="text-[9px] uppercase tracking-wider text-white/50 font-bold">Score</span>
                       <span className="text-sm font-black text-yellow-400">{stats.score.toLocaleString()}</span>
                     </div>
                  </div>
                  <div className="bg-black/20 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex items-center justify-center">
                     <AudioCluePlayer
                       audioNotes={currentQuestion.audioNotes}
                       clueText={currentQuestion.clue}
                       speechEnabled={settings.speechCluesEnabled}
                       primaryColor={quizData.primaryColor}
                       youtubeVideoId={currentQuestion.youtubeVideoId}
                       gameMode={settings.gameMode}
                     />
                  </div>
                </div>`;

const leftPanelRegex = /\{\/\* LEFT PANEL: Info & Audio Player \*\/\}[\s\S]*?(?=\{\/\* CENTER PANEL: Image \/ Music Visualizer \*\/\}|$)/;
const rightPanelRegex = /\{\/\* RIGHT PANEL: Category & Text Clue \*\/\}[\s\S]*?(?=\{\/\* MOBILE FALLBACK: Info & Audio Player \*\/\}|$)/;
const mobileRegex = /\{\/\* MOBILE FALLBACK: Info & Audio Player \*\/\}[\s\S]*?(?=\{\/\* BOTTOM AREA: Question Text & Answers \*\/\}|$)/;

code = code.replace(leftPanelRegex, leftPanel + '\n\n                  ');
code = code.replace(rightPanelRegex, rightPanel + '\n                </div>\n\n');
code = code.replace(mobileRegex, mobileFallback + '\n\n');

fs.writeFileSync('src/App.tsx', code);
console.log('Panels updated');
