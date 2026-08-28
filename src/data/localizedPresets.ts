import { Question } from '../types';

export interface LocalizedPresetCategory {
  title: string;
  desc: string;
  questions: Question[];
}

export const LOCALIZED_CINEMA_EN: Question[] = [
  {
    id: 1,
    question: "In which cult sci-fi movie does a modified DeLorean time-travel at 88 miles per hour?",
    options: ["Blade Runner", "Back to the Future", "The Terminator", "The Butterfly Effect"],
    correctAnswer: "Back to the Future",
    wikiSearchQuery: "DeLorean Back to the Future",
    youtubeSearchQuery: "Back to the Future Theme Alan Silvestri",
    clue: "Great Scott! 88 mph and 1.21 gigawatts of electricity!",
    audioNotes: [392, 523.25, 659.25, 783.99],
    trivia: "In the initial script, the time machine was actually a refrigerator!",
    category: "Cult Sci-Fi",
    imageUrl: "https://image.pollinations.ai/prompt/Cinematic%20DeLorean%20car%20with%20gullwing%20doors%20open%20and%20electric%20sparks%20at%20night?width=800&height=450&nologo=true"
  },
  {
    id: 2,
    question: "Which James Cameron masterpiece features Jack Dawson and Rose DeWitt Bukater in 1912?",
    options: ["Avatar", "The Abyss", "Titanic", "Poseidon"],
    correctAnswer: "Titanic",
    wikiSearchQuery: "RMS Titanic movie James Cameron",
    youtubeSearchQuery: "My Heart Will Go On Titanic James Horner",
    clue: "'I'm the king of the world!' on the bow of a gigantic luxury liner.",
    audioNotes: [440, 493.88, 523.25, 493.88],
    trivia: "Titanic won 11 Academy Awards, tying Ben-Hur and The Lord of the Rings.",
    category: "Romantic Drama",
    imageUrl: "https://image.pollinations.ai/prompt/Cinematic%20Titanic%20ocean%20liner%20sailing%20across%20a%20dark%20ocean%20under%20starry%20night?width=800&height=450&nologo=true"
  },
  {
    id: 3,
    question: "Which Christopher Nolan film explores dream heist infiltration and features an endless spinning top?",
    options: ["Inception", "Interstellar", "Tenet", "Memento"],
    correctAnswer: "Inception",
    wikiSearchQuery: "Inception spinning top totem",
    youtubeSearchQuery: "Inception Time Hans Zimmer OST",
    clue: "A personal totem, subconscious dream architects, and the iconic brass horn BRAAAM.",
    audioNotes: [130.81, 164.81, 196.0, 130.81],
    trivia: "Hans Zimmer based the movie soundtrack on a slowed-down version of Édith Piaf's song.",
    category: "Mind-Bending Thriller",
    imageUrl: "https://image.pollinations.ai/prompt/Chrome%20metallic%20spinning%20top%20spinning%20on%20dark%20wood%20table?width=800&height=450&nologo=true"
  },
  {
    id: 4,
    question: "In which 1994 Disney animated classic must Simba reclaim his rightful place as king?",
    options: ["Aladdin", "Tarzan", "The Lion King", "The Jungle Book"],
    correctAnswer: "The Lion King",
    wikiSearchQuery: "The Lion King Pride Rock Disney",
    youtubeSearchQuery: "Circle of Life The Lion King OST",
    clue: "'Hakuna Matata' and Pride Rock looking over the savannah.",
    audioNotes: [261.63, 329.63, 392.0, 523.25],
    trivia: "The lion roars were created by voice actor Frank Welker roaring into an iron trash can!",
    category: "Animation Classic",
    imageUrl: "https://image.pollinations.ai/prompt/Majestic%20lion%20silhouette%20on%20Pride%20Rock%20overlooking%20African%20savannah%20at%20sunset?width=800&height=450&nologo=true"
  },
  {
    id: 5,
    question: "In which Quentin Tarantino film do Vincent Vega and Mia Wallace dance the twist at Jack Rabbit Slim's?",
    options: ["Kill Bill", "Django Unchained", "Reservoir Dogs", "Pulp Fiction"],
    correctAnswer: "Pulp Fiction",
    wikiSearchQuery: "Pulp Fiction Jack Rabbit Slims dance",
    youtubeSearchQuery: "Misirlou Pulp Fiction Dick Dale OST",
    clue: "A mysterious glowing gold briefcase and a gold watch.",
    audioNotes: [293.66, 349.23, 440.0, 392.0],
    trivia: "The exact contents of the glowing briefcase were never revealed by Tarantino.",
    category: "Neo-Noir Cult",
    imageUrl: "https://image.pollinations.ai/prompt/Retro%20American%20diner%20with%20red%20vinyl%20booth%20seats%20and%20neon%20lights?width=800&height=450&nologo=true"
  },
  {
    id: 6,
    question: "Which 1993 Steven Spielberg masterpiece cloned prehistoric dinosaurs from fossilized amber DNA?",
    options: ["Jurassic Park", "King Kong", "Godzilla", "The Lost World"],
    correctAnswer: "Jurassic Park",
    wikiSearchQuery: "Jurassic Park T-Rex gates",
    youtubeSearchQuery: "Jurassic Park Main Theme John Williams",
    clue: "Ripples in a cup of water announcing the arrival of a colossal Tyrannosaurus Rex.",
    audioNotes: [523.25, 493.88, 523.25, 392.0],
    trivia: "The T-Rex roar was synthesized by combining sounds of an elephant calf, tiger, and alligator.",
    category: "Epic Adventure",
    imageUrl: "https://image.pollinations.ai/prompt/Colossal%20wooden%20park%20gates%20in%20dense%20tropical%20rain%20jungle%20with%20torches?width=800&height=450&nologo=true"
  },
  {
    id: 7,
    question: "Which epic fantasy trilogy by Peter Jackson follows Frodo Baggins on a journey to Mount Doom?",
    options: ["The Hobbit", "The Lord of the Rings", "Harry Potter", "Eragon"],
    correctAnswer: "The Lord of the Rings",
    wikiSearchQuery: "The One Ring Mount Doom Lord of the Rings",
    youtubeSearchQuery: "Concerning Hobbits Lord of the Rings Howard Shore",
    clue: "'My Precious!' and the forging of the One Ring.",
    audioNotes: [329.63, 392.0, 440.0, 493.88],
    trivia: "The entire trilogy was filmed simultaneously in New Zealand across 438 days.",
    category: "High Fantasy",
    imageUrl: "https://image.pollinations.ai/prompt/Golden%20One%20Ring%20with%20glowing%20fiery%20inscriptions%20resting%20on%20dark%20rock?width=800&height=450&nologo=true"
  },
  {
    id: 8,
    question: "Which Wachowski sisters cyberpunk film features Neo choosing between the red and blue pills?",
    options: ["Equilibrium", "Tron", "The Matrix", "Ghost in the Shell"],
    correctAnswer: "The Matrix",
    wikiSearchQuery: "The Matrix digital rain code Neo",
    youtubeSearchQuery: "Clubbed to Death Matrix Rob Dougan OST",
    clue: "Vertical falling green digital code and slow-motion bullet dodging.",
    audioNotes: [174.61, 220.0, 261.63, 329.63],
    trivia: "The green digital rain code was sampled from Japanese sushi recipe book symbols!",
    category: "Cyberpunk",
    imageUrl: "https://image.pollinations.ai/prompt/Digital%20matrix%20green%20rain%20cascading%20code%20on%20pure%20black%20background?width=800&height=450&nologo=true"
  },
  {
    id: 9,
    question: "In which 2000 Ridley Scott film does Russell Crowe star as General Maximus Decimus Meridius?",
    options: ["Gladiator", "Troy", "Spartacus", "Kingdom of Heaven"],
    correctAnswer: "Gladiator",
    wikiSearchQuery: "Maximus Decimus Meridius Gladiator Colosseum",
    youtubeSearchQuery: "Now We Are Free Gladiator Hans Zimmer OST",
    clue: "'What we do in life echoes in eternity!' in the Colosseum.",
    audioNotes: [220.0, 246.94, 261.63, 293.66],
    trivia: "The famous opening wheat field hand brushing shot featured Russell Crowe's stunt double.",
    category: "Historical Epic",
    imageUrl: "https://image.pollinations.ai/prompt/Ancient%20Roman%20bronze%20gladiator%20helmet%20lying%20on%20golden%20arena%20sand?width=800&height=450&nologo=true"
  },
  {
    id: 10,
    question: "Which Christopher Nolan superhero film pits Christian Bale against Heath Ledger's Joker?",
    options: ["The Batman", "The Dark Knight", "Batman Begins", "Justice League"],
    correctAnswer: "The Dark Knight",
    wikiSearchQuery: "The Dark Knight Joker Batman",
    youtubeSearchQuery: "Why So Serious The Dark Knight Hans Zimmer OST",
    clue: "'Why so serious?' and a clown mask during a daring bank heist.",
    audioNotes: [110.0, 116.54, 123.47, 130.81],
    trivia: "Heath Ledger was posthumously awarded the Academy Award for Best Supporting Actor.",
    category: "Superhero Noir",
    imageUrl: "https://image.pollinations.ai/prompt/Burning%20Joker%20playing%20card%20with%20purple%20and%20green%20flames%20on%20dark%20street?width=800&height=450&nologo=true"
  },
  {
    id: 11,
    question: "In which Pixar film does elderly widower Carl Fredricksen attach thousands of balloons to his house?",
    options: ["Toy Story", "Wall-E", "Coco", "Up"],
    correctAnswer: "Up",
    wikiSearchQuery: "Carl Fredricksen house floating balloons Up Pixar",
    youtubeSearchQuery: "Married Life Up Michael Giacchino OST",
    clue: "Paradise Falls, a wilderness explorer named Russell, and a colorful bird.",
    audioNotes: [523.25, 587.33, 659.25, 698.46],
    trivia: "Pixar animators calculated that lifting a real house would require 9.4 million helium balloons!",
    category: "Pixar Classic",
    imageUrl: "https://image.pollinations.ai/prompt/Victorian%20colorful%20house%20flying%20in%20sky%20lifted%20by%20thousands%20of%20balloons?width=800&height=450&nologo=true"
  },
  {
    id: 12,
    question: "In which 1980 Star Wars film is the legendary reveal 'No, I am your father' spoken?",
    options: ["A New Hope", "The Empire Strikes Back", "Return of the Jedi", "Revenge of the Sith"],
    correctAnswer: "The Empire Strikes Back",
    wikiSearchQuery: "Darth Vader Cloud City Empire Strikes Back",
    youtubeSearchQuery: "The Imperial March Darth Vader Star Wars John Williams",
    clue: "Cloud City, carbonite freezing, and a duel over the reactor shaft.",
    audioNotes: [220.0, 220.0, 220.0, 174.61],
    trivia: "The plot twist was kept so secret that David Prowse was given fake dialogue on set!",
    category: "Space Opera",
    imageUrl: "https://image.pollinations.ai/prompt/Darth%20Vader%20holding%20glowing%20red%20lightsaber%20in%20dark%20foggy%20corridor?width=800&height=450&nologo=true"
  },
  {
    id: 13,
    question: "Which Christopher Nolan space odyssey travels through a wormhole near Saturn to save humanity?",
    options: ["Gravity", "Interstellar", "Ad Astra", "The Martian"],
    correctAnswer: "Interstellar",
    wikiSearchQuery: "Gargantua black hole Interstellar Cooper",
    youtubeSearchQuery: "Cornfield Chase Interstellar Hans Zimmer OST",
    clue: "The Gargantua black hole, a water planet with giant waves, and the Endurance spacecraft.",
    audioNotes: [329.63, 392.0, 493.88, 659.25],
    trivia: "Astrophysicist Kip Thorne calculated scientific equations to accurately render the black hole.",
    category: "Hard Sci-Fi",
    imageUrl: "https://image.pollinations.ai/prompt/Majestic%20black%20hole%20Gargantua%20with%20glowing%20golden%20accretion%20disk?width=800&height=450&nologo=true"
  },
  {
    id: 14,
    question: "Which David Fincher cult film follows Tyler Durden and the rules of an underground fight club?",
    options: ["Seven", "Fight Club", "The Game", "Gone Girl"],
    correctAnswer: "Fight Club",
    wikiSearchQuery: "Fight Club soap Tyler Durden Brad Pitt",
    youtubeSearchQuery: "Where Is My Mind Pixies Fight Club OST",
    clue: "'The first rule is: you do not talk about it.'",
    audioNotes: [164.81, 196.0, 246.94, 293.66],
    trivia: "Brad Pitt and Edward Norton took boxing and taekwondo lessons to prepare for the roles.",
    category: "Psychological Cult",
    imageUrl: "https://image.pollinations.ai/prompt/Pink%20bar%20of%20soap%20with%20embossed%20letters%20on%20dark%20grungy%20table?width=800&height=450&nologo=true"
  },
  {
    id: 15,
    question: "Which Francis Ford Coppola masterpiece chronicles the Corleone mafia family under Don Vito Corleone?",
    options: ["Goodfellas", "Scarface", "The Godfather", "Casino"],
    correctAnswer: "The Godfather",
    wikiSearchQuery: "Don Vito Corleone Marlon Brando Godfather",
    youtubeSearchQuery: "Speak Softly Love The Godfather Nino Rota",
    clue: "'I'm gonna make him an offer he can't refuse' and a red rose lapel.",
    audioNotes: [220.0, 293.66, 329.63, 349.23],
    trivia: "Marlon Brando used cotton balls in his cheeks during the screen test to give Don Corleone his bulldog jawline.",
    category: "Mob Classic",
    imageUrl: "https://image.pollinations.ai/prompt/Vintage%201940s%20mafia%20office%20with%20dim%20golden%20lamp%20and%20red%20rose?width=800&height=450&nologo=true"
  }
];

export const LOCALIZED_GAMING_EN: Question[] = [
  {
    id: 1,
    question: "Which Nintendo plumber must rescue Princess Peach from Bowser in the Mushroom Kingdom?",
    options: ["Sonic", "Mario", "Crash Bandicoot", "Rayman"],
    correctAnswer: "Mario",
    wikiSearchQuery: "Super Mario Bros Nintendo Peach",
    youtubeSearchQuery: "Super Mario Bros Theme Koji Kondo",
    clue: "Super Mushrooms, green warp pipes, and red overalls.",
    audioNotes: [329.63, 329.63, 329.63, 261.63, 329.63, 392.0],
    trivia: "Mario was originally named 'Jumpman' in the 1981 arcade game Donkey Kong!",
    category: "Platforming Icon",
    imageUrl: "https://image.pollinations.ai/prompt/Vibrant%20Mushroom%20Kingdom%20with%20green%20hills%20and%20floating%20question%20blocks?width=800&height=450&nologo=true"
  },
  {
    id: 2,
    question: "In which franchise does Link wield the Master Sword to protect the land of Hyrule?",
    options: ["The Legend of Zelda", "Final Fantasy", "Dragon Quest", "Kingdom Hearts"],
    correctAnswer: "The Legend of Zelda",
    wikiSearchQuery: "The Legend of Zelda Master Sword Link",
    youtubeSearchQuery: "Zelda Main Theme Koji Kondo",
    clue: "The Triforce, Princess Zelda, and the green tunic.",
    audioNotes: [440, 493.88, 523.25, 587.33, 659.25],
    trivia: "The creator Shigeru Miyamoto based Zelda on his childhood explorations of caves and forests.",
    category: "Action-Adventure",
    imageUrl: "https://image.pollinations.ai/prompt/Master%20Sword%20resting%20in%20a%20stone%20pedestal%20in%20a%20sunlit%20ancient%20forest?width=800&height=450&nologo=true"
  },
  {
    id: 3,
    question: "Which Bethesda RPG begins with 'Hey, you. You're finally awake' as a Dragonborn prisoner?",
    options: ["Fallout 4", "The Witcher 3", "Skyrim", "Dark Souls"],
    correctAnswer: "Skyrim",
    wikiSearchQuery: "The Elder Scrolls V Skyrim Dragonborn",
    youtubeSearchQuery: "Skyrim Dragonborn Theme Jeremy Soule",
    clue: "'Fus Ro Dah!' and fighting Alduin the World-Eater.",
    audioNotes: [130.81, 196.0, 261.63, 329.63],
    trivia: "Skyrim has sold over 60 million copies across numerous platforms.",
    category: "Open World RPG",
    imageUrl: "https://image.pollinations.ai/prompt/Snowy%20nordic%20mountain%20with%20ancient%20dragon%20perched%20on%20rock%20peak?width=800&height=450&nologo=true"
  },
  {
    id: 4,
    question: "Which block-building sandbox game created by Markus 'Notch' Persson features the Ender Dragon?",
    options: ["Terraria", "Roblox", "Minecraft", "Lego Worlds"],
    correctAnswer: "Minecraft",
    wikiSearchQuery: "Minecraft Creeper Steve Ender Dragon",
    youtubeSearchQuery: "Minecraft Sweden C418 OST",
    clue: "Creepers, diamond pickaxes, crafting tables, and the Nether.",
    audioNotes: [261.63, 329.63, 392.0, 523.25],
    trivia: "Minecraft is the best-selling video game of all time with over 300 million copies sold.",
    category: "Sandbox Survival",
    imageUrl: "https://image.pollinations.ai/prompt/Voxel%20blocky%20landscape%20with%20green%20hills%20and%20pixel%20sunset?width=800&height=450&nologo=true"
  },
  {
    id: 5,
    question: "Which Spartan supersoldier is known as Master Chief Petty Officer John-117?",
    options: ["Gears of War", "Halo", "Doom", "Mass Effect"],
    correctAnswer: "Halo",
    wikiSearchQuery: "Master Chief Halo Spartan Cortana",
    youtubeSearchQuery: "Halo Theme Song Martin O'Donnell",
    clue: "MJOLNIR armor, AI Cortana, and the alien Covenant.",
    audioNotes: [220.0, 261.63, 293.66, 329.63],
    trivia: "The iconic monk chant opening theme was composed in just three days by Martin O'Donnell.",
    category: "Sci-Fi Shooter",
    imageUrl: "https://image.pollinations.ai/prompt/Futuristic%20green%20Spartan%20helmet%20with%20golden%20visor%20in%20sci-fi%20space%20ring?width=800&height=450&nologo=true"
  }
];
