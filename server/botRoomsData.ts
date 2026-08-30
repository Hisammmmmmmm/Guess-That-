export interface BotQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  wikiSearchQuery?: string;
  youtubeSearchQuery?: string;
  clue?: string;
  audioNotes?: number[];
  imageUrl?: string;
  imagePrompt?: string;
  trivia?: string;
  category?: string;
}

export interface BotRoomConfig {
  code: string;
  themeTitle: string;
  topic: string;
  gameMode: 'quiz' | 'music_blind_test' | 'visual_blind_test';
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  primaryColor: string;
  accentColor: string;
  themeBgImage: string;
  ambientSound: string;
  bots: {
    id: string;
    name: string;
    avatar: string;
    accuracy: number; // 0.6 to 0.95
    speedMin: number; // seconds
    speedMax: number; // seconds
  }[];
  questions: BotQuestion[];
}

export const BOT_ROOMS_DATA: BotRoomConfig[] = [
  // 1. Blind Test Musical - Français / International Hits
  {
    code: 'HITS88',
    themeTitle: 'Hits Radio & Pop Star 2000-2024',
    topic: 'Hits Radio & Légendes de la Musique',
    gameMode: 'music_blind_test',
    difficulty: 'medium',
    language: 'fr',
    primaryColor: '#ec4899',
    accentColor: '#8b5cf6',
    themeBgImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    ambientSound: 'retro80s',
    bots: [
      { id: 'bot_thomas', name: 'Thomas', avatar: '🎸', accuracy: 0.88, speedMin: 2.5, speedMax: 7 },
      { id: 'bot_emma', name: 'Emma', avatar: '🎧', accuracy: 0.92, speedMin: 1.8, speedMax: 6 },
      { id: 'bot_lucas', name: 'Lucas', avatar: '⚡', accuracy: 0.75, speedMin: 3.5, speedMax: 9 },
      { id: 'bot_chloe', name: 'Chloé', avatar: '🌟', accuracy: 0.82, speedMin: 2.8, speedMax: 8 },
    ],
    questions: [
      {
        id: 1,
        question: "Quel groupe français de musique électronique casqué a sorti le tube planétaire 'Get Lucky' avec Pharrell Williams ?",
        options: ["Daft Punk", "Justice", "Air", "Cassius"],
        correctAnswer: "Daft Punk",
        youtubeSearchQuery: "Daft Punk Get Lucky Official Audio",
        clue: "Deux robots musiciens et l'album légendaire Random Access Memories.",
        audioNotes: [392.0, 440.0, 523.25, 659.25],
        trivia: "Get Lucky a remporté le Grammy Award de l'enregistrement de l'année en 2014.",
        category: "Electro Pop"
      },
      {
        id: 2,
        question: "Quelle superstar pop chante le célèbre morceau 'Bad Romance' et 'Poker Face' ?",
        options: ["Lady Gaga", "Katy Perry", "Rihanna", "Dua Lipa"],
        correctAnswer: "Lady Gaga",
        youtubeSearchQuery: "Lady Gaga Bad Romance Audio",
        clue: "« Rah-rah-ah-ah-ah, Roma-roma-ma... »",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        trivia: "Le clip de Bad Romance a été l'une des premières vidéos YouTube à dépasser 200 millions de vues.",
        category: "Pop Mondiale"
      },
      {
        id: 3,
        question: "Quel chanteur belge a connu un immense succès international avec 'Alors on danse' et 'Papaoutai' ?",
        options: ["Stromae", "Angèle", "Damso", "Hamza"],
        correctAnswer: "Stromae",
        youtubeSearchQuery: "Stromae Alors on danse Official Audio",
        clue: "Le maestro Paul Van Haver et son album Racine Carrée.",
        audioNotes: [220.0, 277.18, 329.63, 440.0],
        trivia: "Son nom de scène Stromae est une anagramme en verlan de Maestro.",
        category: "Chanson & Electro"
      },
      {
        id: 4,
        question: "Quel groupe britannique mené par Chris Martin a chanté 'Viva La Vida' et 'Yellow' ?",
        options: ["Coldplay", "Muse", "Oasis", "Radiohead"],
        correctAnswer: "Coldplay",
        youtubeSearchQuery: "Coldplay Viva La Vida Official Audio",
        clue: "Des cloches, des violons orchestraux et une révolution en peinture.",
        audioNotes: [349.23, 440.0, 523.25, 698.46],
        trivia: "Le titre Viva La Vida est inspiré d'une peinture de la célèbre artiste mexicaine Frida Kahlo.",
        category: "Pop Rock"
      },
      {
        id: 5,
        question: "Quel artiste canadien a enflammé les charts mondiaux avec son tube rétro synthwave 'Blinding Lights' ?",
        options: ["The Weeknd", "Drake", "Justin Bieber", "Post Malone"],
        correctAnswer: "The Weeknd",
        youtubeSearchQuery: "The Weeknd Blinding Lights Official Audio",
        clue: "Un costume rouge à paillettes et le concert du Super Bowl.",
        audioNotes: [440.0, 523.25, 659.25, 880.0],
        trivia: "Blinding Lights est devenue la chanson la plus écoutée de toute l'histoire de Spotify.",
        category: "Synthpop"
      },
      {
        id: 6,
        question: "Quelle artiste britannique a ému la planète avec 'Rolling in the Deep' et 'Someone Like You' ?",
        options: ["Adele", "Amy Winehouse", "Dua Lipa", "Ellie Goulding"],
        correctAnswer: "Adele",
        youtubeSearchQuery: "Adele Rolling in the Deep Official Audio",
        clue: "Une voix soul puissante et des albums nommés d'après ses âges (19, 21, 25, 30).",
        audioNotes: [261.63, 311.13, 392.0, 523.25],
        trivia: "Son album '21' s'est vendu à plus de 31 millions d'exemplaires à travers le monde.",
        category: "Soul Pop"
      },
      {
        id: 7,
        question: "Quel DJ français superstar a fait danser le monde avec 'Titanium' (ft. Sia) et 'Memories' ?",
        options: ["David Guetta", "DJ Snake", "Bob Sinclar", "Kungs"],
        correctAnswer: "David Guetta",
        youtubeSearchQuery: "David Guetta Titanium ft Sia Audio",
        clue: "« I'm bulletproof, nothing to lose, fire away, fire away ! »",
        audioNotes: [329.63, 392.0, 493.88, 587.33],
        trivia: "David Guetta a été élu plusieurs fois meilleur DJ du monde par le prestigieux magazine DJ Mag.",
        category: "EDM Dance"
      },
      {
        id: 8,
        question: "Quel groupe de rock californien mené par Anthony Kiedis chante 'Californication' et 'Can't Stop' ?",
        options: ["Red Hot Chili Peppers", "Green Day", "Foo Fighters", "Blink-182"],
        correctAnswer: "Red Hot Chili Peppers",
        youtubeSearchQuery: "Red Hot Chili Peppers Californication Audio",
        clue: "Flea à la basse et un style funk rock reconnaissable entre mille.",
        audioNotes: [220.0, 261.63, 329.63, 440.0],
        trivia: "Le groupe a été intronisé au Rock and Roll Hall of Fame en 2012.",
        category: "Funk Rock"
      }
    ]
  },

  // 2. Blind Test Musical - International / English Rock & Pop
  {
    code: 'ROCK99',
    themeTitle: 'Legendary Rock & Billboard Anthems',
    topic: 'World Rock, Pop & Timeless Anthems',
    gameMode: 'music_blind_test',
    difficulty: 'medium',
    language: 'en',
    primaryColor: '#f97316',
    accentColor: '#e11d48',
    themeBgImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    ambientSound: 'synthwave',
    bots: [
      { id: 'bot_axel', name: 'Axel', avatar: '🥁', accuracy: 0.9, speedMin: 2.2, speedMax: 6.5 },
      { id: 'bot_sarah', name: 'Sarah', avatar: '🎤', accuracy: 0.85, speedMin: 2.8, speedMax: 7.5 },
      { id: 'bot_jack', name: 'Jack', avatar: '🔥', accuracy: 0.78, speedMin: 3.2, speedMax: 8 },
      { id: 'bot_luna', name: 'Luna', avatar: '⚡', accuracy: 0.88, speedMin: 2.0, speedMax: 6 },
    ],
    questions: [
      {
        id: 1,
        question: "Which legendary British band performed 'Bohemian Rhapsody' and 'Don't Stop Me Now'?",
        options: ["Queen", "The Beatles", "The Rolling Stones", "Led Zeppelin"],
        correctAnswer: "Queen",
        youtubeSearchQuery: "Queen Bohemian Rhapsody Official Audio",
        clue: "Freddie Mercury's unforgettable 4-octave vocal range and Brian May's guitar.",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        trivia: "Bohemian Rhapsody stayed at the top of the UK Singles Chart for nine weeks in 1975.",
        category: "Classic Rock"
      },
      {
        id: 2,
        question: "Which American rock band fronted by Kurt Cobain launched the grunge revolution with 'Smells Like Teen Spirit'?",
        options: ["Nirvana", "Pearl Jam", "Soundgarden", "Alice in Chains"],
        correctAnswer: "Nirvana",
        youtubeSearchQuery: "Nirvana Smells Like Teen Spirit Audio",
        clue: "The 1991 masterpiece album 'Nevermind' featuring a baby underwater.",
        audioNotes: [196.0, 261.63, 329.63, 392.0],
        trivia: "The song's title came from a deodorant brand called 'Teen Spirit'.",
        category: "Grunge Rock"
      },
      {
        id: 3,
        question: "Which Australian hard rock band rocked the world with 'Highway to Hell' and 'Back in Black'?",
        options: ["AC/DC", "Guns N' Roses", "Aerosmith", "Kiss"],
        correctAnswer: "AC/DC",
        youtubeSearchQuery: "AC/DC Highway to Hell Official Audio",
        clue: "Angus Young performing in a schoolboy uniform with a Gibson SG guitar.",
        audioNotes: [220.0, 277.18, 329.63, 440.0],
        trivia: "The album 'Back in Black' is the second highest-selling album of all time worldwide.",
        category: "Hard Rock"
      },
      {
        id: 4,
        question: "Which pop icon earned the title 'King of Pop' with mega-hits 'Billie Jean' and 'Thriller'?",
        options: ["Michael Jackson", "Prince", "George Michael", "Stevie Wonder"],
        correctAnswer: "Michael Jackson",
        youtubeSearchQuery: "Michael Jackson Billie Jean Official Audio",
        clue: "The famous moonwalk and the signature white sequined glove.",
        audioNotes: [329.63, 392.0, 440.0, 523.25],
        trivia: "Thriller remains the best-selling music album in history with over 70 million copies sold.",
        category: "Pop Legend"
      },
      {
        id: 5,
        question: "Which legendary British band featured John Lennon, Paul McCartney, George Harrison, and Ringo Starr?",
        options: ["The Beatles", "The Who", "The Kinks", "The Animals"],
        correctAnswer: "The Beatles",
        youtubeSearchQuery: "The Beatles Hey Jude Official Audio",
        clue: "Abbey Road zebra crossing and the Yellow Submarine.",
        audioNotes: [261.63, 329.63, 392.0, 440.0],
        trivia: "The Beatles hold the record for the most number-one hits on the Billboard Hot 100 chart (20).",
        category: "British Invasion"
      },
      {
        id: 6,
        question: "Which pop superstar released the record-shattering albums '1989' and 'Midnights' with hits like 'Shake It Off'?",
        options: ["Taylor Swift", "Ariana Grande", "Katy Perry", "Billie Eilish"],
        correctAnswer: "Taylor Swift",
        youtubeSearchQuery: "Taylor Swift Shake It Off Official Audio",
        clue: "The Eras Tour which became the highest-grossing music tour in history.",
        audioNotes: [392.0, 440.0, 523.25, 659.25],
        trivia: "Taylor Swift has won four Grammy Awards for Album of the Year, more than any other artist.",
        category: "Modern Pop"
      },
      {
        id: 7,
        question: "Which band recorded the hypnotic rock track 'Hotel California' in 1976?",
        options: ["Eagles", "Fleetwood Mac", "The Doors", "Chicago"],
        correctAnswer: "Eagles",
        youtubeSearchQuery: "Eagles Hotel California Official Audio",
        clue: "« You can check out any time you like, but you can never leave! »",
        audioNotes: [246.94, 293.66, 370.0, 440.0],
        trivia: "The iconic dual guitar solo at the end was performed by Don Felder and Joe Walsh.",
        category: "Classic Rock"
      },
      {
        id: 8,
        question: "Which dynamic French duo composed 'One More Time', 'Harder Better Faster Stronger', and 'Around the World'?",
        options: ["Daft Punk", "Justice", "Air", "Phoenix"],
        correctAnswer: "Daft Punk",
        youtubeSearchQuery: "Daft Punk One More Time Official Audio",
        clue: "Thomas Bangalter and Guy-Manuel de Homem-Christo wearing robotic helmets.",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        trivia: "Their anime film Interstella 5555 was supervised by legendary manga creator Leiji Matsumoto.",
        category: "Electronic Anthem"
      }
    ]
  },

  // 3. Quiz Classique - Cinéma & Pop Culture Culte (Français)
  {
    code: 'CULT77',
    themeTitle: 'Cinéma Culte & Pop Culture',
    topic: 'Cinéma, Séries & Pop Culture',
    gameMode: 'quiz',
    difficulty: 'medium',
    language: 'fr',
    primaryColor: '#f59e0b',
    accentColor: '#ef4444',
    themeBgImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
    ambientSound: 'cinema',
    bots: [
      { id: 'bot_maxime', name: 'Maxime', avatar: '🎬', accuracy: 0.9, speedMin: 3.0, speedMax: 8.0 },
      { id: 'bot_lea', name: 'Léa', avatar: '🍿', accuracy: 0.84, speedMin: 2.2, speedMax: 6.5 },
      { id: 'bot_hugo', name: 'Hugo', avatar: '👑', accuracy: 0.77, speedMin: 3.5, speedMax: 9.0 },
      { id: 'bot_manon', name: 'Manon', avatar: '🦊', accuracy: 0.86, speedMin: 2.6, speedMax: 7.2 },
    ],
    questions: [
      {
        id: 1,
        question: "Dans quel film de science-fiction culte une DeLorean volante voyage-t-elle dans le temps à 88 mph ?",
        options: ["Retour vers le Futur", "Blade Runner", "Terminator", "Matrix"],
        correctAnswer: "Retour vers le Futur",
        wikiSearchQuery: "Back to the Future DeLorean",
        clue: "Nom de Zeus ! Doc Brown et Marty McFly en 1985 et 1955.",
        audioNotes: [392.0, 523.25, 659.25, 783.99],
        trivia: "Le rôle de Marty McFly avait d'abord été tourné pendant plusieurs semaines par Eric Stoltz avant d'être confié à Michael J. Fox.",
        category: "Cinéma Culte"
      },
      {
        id: 2,
        question: "Quel sorcier à lunettes combat Lord Voldemort avec ses amis Ron et Hermione à Poudlard ?",
        options: ["Harry Potter", "Percy Jackson", "Frodon Sacquet", "Eragon"],
        correctAnswer: "Harry Potter",
        wikiSearchQuery: "Harry Potter Hogwarts",
        clue: "La cicatrice en forme d'éclair et la maison Gryffondor.",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        trivia: "La saga littéraire de J.K. Rowling s'est vendue à plus de 500 millions d'exemplaires dans le monde.",
        category: "Fantastique"
      },
      {
        id: 3,
        question: "Dans Star Wars, quel Maître Jedi verdâtre enseigne la Force à Luke Skywalker sur Dagobah ?",
        options: ["Yoda", "Obi-Wan Kenobi", "Mace Windu", "Qui-Gon Jinn"],
        correctAnswer: "Yoda",
        wikiSearchQuery: "Yoda Star Wars Dagobah",
        clue: "« Que la Force soit avec toi », il dit toujours ses phrases à l'envers.",
        audioNotes: [220.0, 277.18, 329.63, 440.0],
        trivia: "Yoda a été conçu par le marionnettiste légendaire Frank Oz, qui lui a aussi prêté sa voix.",
        category: "Science-Fiction"
      },
      {
        id: 4,
        question: "Quel super-héros milliardaire sans pouvoir fabrique l'armure Mark et s'écrie 'I am Iron Man' ?",
        options: ["Tony Stark", "Bruce Wayne", "Peter Parker", "Steve Rogers"],
        correctAnswer: "Tony Stark",
        wikiSearchQuery: "Iron Man Tony Stark Marvel",
        clue: "Le réacteur Arc dans sa poitrine et Jarvis son intelligence artificielle.",
        audioNotes: [293.66, 349.23, 440.0, 523.25],
        trivia: "Robert Downey Jr. a lancé l'univers cinématographique Marvel (MCU) en 2008 avec le film Iron Man.",
        category: "Marvel Super-Héros"
      },
      {
        id: 5,
        question: "Quel film d'animation Pixar met en scène les émotions Joie, Tristesse, Colère, Peur et Dégoût ?",
        options: ["Vice-Versa", "Soul", "Coco", "Toy Story"],
        correctAnswer: "Vice-Versa",
        wikiSearchQuery: "Inside Out Pixar Riley emotions",
        clue: "Le quartier général dans le cerveau de la jeune Riley.",
        audioNotes: [329.63, 392.0, 440.0, 523.25],
        trivia: "Le réalisateur Pete Docter s'est inspiré de sa propre fille pour concevoir l'histoire de Vice-Versa.",
        category: "Pixar Animation"
      },
      {
        id: 6,
        question: "Dans Le Seigneur des Anneaux, quel Hobbit porte l'Anneau Unique jusqu'à la Montagne du Destin ?",
        options: ["Frodon Sacquet", "Sam Gamegie", "Merry", "Pippin"],
        correctAnswer: "Frodon Sacquet",
        wikiSearchQuery: "Frodo Baggins One Ring Lord of the Rings",
        clue: "Le Mordor, la Comté et Gollum qui crie « Mon Précieux ! ».",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        trivia: "La trilogie de Peter Jackson a remporté un total combiné de 17 Oscars.",
        category: "Fantasy Épique"
      },
      {
        id: 7,
        question: "Dans Matrix, quelle pilule Neo choisit-il de prendre pour découvrir la vérité sur le monde réel ?",
        options: ["La pilule rouge", "La pilule bleue", "La pilule verte", "La pilule dorée"],
        correctAnswer: "La pilule rouge",
        wikiSearchQuery: "Matrix Red pill and blue pill Neo Morpheus",
        clue: "Morpheus lui tend les deux gélules dans un vieux fauteuil en cuir.",
        audioNotes: [220.0, 261.63, 329.63, 440.0],
        trivia: "Le code vert iconique qui défile au début du film est composé de recettes de sushis japonaises !",
        category: "Cyberpunk Culte"
      },
      {
        id: 8,
        question: "Quel célèbre détective privé londonien vit au 221B Baker Street avec le Docteur Watson ?",
        options: ["Sherlock Holmes", "Hercule Poirot", "Columbo", "Arsène Lupin"],
        correctAnswer: "Sherlock Holmes",
        wikiSearchQuery: "Sherlock Holmes Baker Street Arthur Conan Doyle",
        clue: "Une loupe, une pipe courbée, un chapeau de chasseur et une logique infaillible.",
        audioNotes: [293.66, 369.99, 440.0, 587.33],
        trivia: "Créé par Sir Arthur Conan Doyle, Sherlock Holmes est le personnage de fiction le plus représenté au cinéma.",
        category: "Enquête & Mystère"
      }
    ]
  },

  // 4. Quiz Classique - Tech, Gaming & Science Trivia (English)
  {
    code: 'GEEK42',
    themeTitle: 'Tech, Gaming & Science Trivia',
    topic: 'Video Games, Universe & Scientific Breakthroughs',
    gameMode: 'quiz',
    difficulty: 'medium',
    language: 'en',
    primaryColor: '#06b6d4',
    accentColor: '#3b82f6',
    themeBgImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    ambientSound: 'space',
    bots: [
      { id: 'bot_alan', name: 'Alan', avatar: '🤖', accuracy: 0.94, speedMin: 2.1, speedMax: 6.0 },
      { id: 'bot_neo', name: 'Neo', avatar: '🚀', accuracy: 0.85, speedMin: 2.7, speedMax: 7.0 },
      { id: 'bot_maya', name: 'Maya', avatar: '🎮', accuracy: 0.88, speedMin: 2.3, speedMax: 6.5 },
      { id: 'bot_david', name: 'David', avatar: '🧠', accuracy: 0.79, speedMin: 3.4, speedMax: 8.5 },
    ],
    questions: [
      {
        id: 1,
        question: "What was the very first video game console released for home television sets in 1972?",
        options: ["Magnavox Odyssey", "Atari 2600", "Nintendo Entertainment System", "ColecoVision"],
        correctAnswer: "Magnavox Odyssey",
        wikiSearchQuery: "Magnavox Odyssey Ralph Baer 1972",
        clue: "Invented by Ralph Baer, often called the 'Father of Video Games'.",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        trivia: "The Odyssey used translucent plastic overlays attached to the TV screen with static electricity for graphics.",
        category: "Gaming History"
      },
      {
        id: 2,
        question: "What is the closest celestial star system to our Solar System at about 4.24 light-years away?",
        options: ["Alpha Centauri", "Sirius", "Betelgeuse", "Procyon"],
        correctAnswer: "Alpha Centauri",
        wikiSearchQuery: "Alpha Centauri Proxima Centauri star system",
        clue: "A triple-star system containing Proxima Centauri and rocky exoplanets.",
        audioNotes: [220.0, 277.18, 329.63, 440.0],
        trivia: "Proxima Centauri b is a terrestrial exoplanet orbiting within the habitable zone of its star.",
        category: "Astronomy"
      },
      {
        id: 3,
        question: "Which Nintendo plumber made his debut in the 1981 arcade game Donkey Kong under the name 'Jumpman'?",
        options: ["Mario", "Luigi", "Wario", "Toad"],
        correctAnswer: "Mario",
        wikiSearchQuery: "Mario Donkey Kong Jumpman Shigeru Miyamoto",
        clue: "Red cap, mustache, blue overalls, designed by Shigeru Miyamoto.",
        audioNotes: [329.63, 392.0, 523.25, 659.25],
        trivia: "Mario was originally named Jumpman, but Nintendo of America renamed him after their landlord Mario Segale.",
        category: "Gaming Icons"
      },
      {
        id: 4,
        question: "What element on the periodic table has the chemical symbol 'Au' and atomic number 79?",
        options: ["Gold", "Silver", "Copper", "Platinum"],
        correctAnswer: "Gold",
        wikiSearchQuery: "Gold chemical element Au",
        clue: "Derived from the Latin word 'Aurum' meaning shining dawn.",
        audioNotes: [293.66, 369.99, 440.0, 587.33],
        trivia: "All the gold ever mined in human history could fit into a cube roughly 21 meters on each side.",
        category: "Chemistry"
      },
      {
        id: 5,
        question: "In computer programming, what does the acronym 'HTML' stand for?",
        options: ["HyperText Markup Language", "High-Tech Machine Language", "Home Tool Markup Language", "Hyperlink Text Manipulation Logic"],
        correctAnswer: "HyperText Markup Language",
        wikiSearchQuery: "HTML HyperText Markup Language Tim Berners-Lee",
        clue: "Created by Tim Berners-Lee at CERN to structure web documents.",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        trivia: "Tim Berners-Lee published the first website in history on August 6, 1991.",
        category: "Computer Science"
      },
      {
        id: 6,
        question: "Which blockbuster RPG created by CD Projekt Red stars the monster hunter Geralt of Rivia?",
        options: ["The Witcher 3: Wild Hunt", "Cyberpunk 2077", "Skyrim", "Dragon Age"],
        correctAnswer: "The Witcher 3: Wild Hunt",
        wikiSearchQuery: "The Witcher 3 Wild Hunt Geralt of Rivia",
        clue: "Silver sword for monsters, steel sword for humans, and the hunt for Ciri.",
        audioNotes: [220.0, 261.63, 329.63, 440.0],
        trivia: "The Witcher games are based on the fantasy novel series written by Polish author Andrzej Sapkowski.",
        category: "Video Games"
      },
      {
        id: 7,
        question: "Which subatomic particle carries a negative electric charge and orbits the nucleus of an atom?",
        options: ["Electron", "Proton", "Neutron", "Positron"],
        correctAnswer: "Electron",
        wikiSearchQuery: "Electron subatomic particle JJ Thomson",
        clue: "Discovered in 1897 by British physicist J.J. Thomson during cathode ray experiments.",
        audioNotes: [349.23, 440.0, 523.25, 698.46],
        trivia: "Electrons are fundamental elementary particles; unlike protons and neutrons, they have no known smaller components.",
        category: "Physics"
      },
      {
        id: 8,
        question: "What sandbox game featuring cubic blocks and Creepers became the best-selling video game of all time?",
        options: ["Minecraft", "Roblox", "Terraria", "Fortnite"],
        correctAnswer: "Minecraft",
        wikiSearchQuery: "Minecraft Markus Persson Mojang",
        clue: "Created by Markus 'Notch' Persson in 2009 with diamond pickaxes and the Nether.",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        trivia: "Minecraft has sold over 300 million copies across dozens of platforms worldwide.",
        category: "Sandbox Gaming"
      }
    ]
  },

  // 5. Blind Test Visuel - Monuments & Merveilles du Monde (Français)
  {
    code: 'WRLD33',
    themeTitle: 'Monuments & Merveilles du Monde',
    topic: 'Monuments Célèbres & Patrimoine Mondial',
    gameMode: 'visual_blind_test',
    difficulty: 'medium',
    language: 'fr',
    primaryColor: '#3b82f6',
    accentColor: '#10b981',
    themeBgImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80',
    ambientSound: 'fantasy',
    bots: [
      { id: 'bot_julie', name: 'Julie', avatar: '🗺️', accuracy: 0.91, speedMin: 2.4, speedMax: 6.8 },
      { id: 'bot_antoine', name: 'Antoine', avatar: '🏛️', accuracy: 0.86, speedMin: 2.9, speedMax: 7.5 },
      { id: 'bot_camille', name: 'Camille', avatar: '✈️', accuracy: 0.8, speedMin: 3.3, speedMax: 8.2 },
      { id: 'bot_romain', name: 'Romain', avatar: '🌍', accuracy: 0.88, speedMin: 2.1, speedMax: 6.2 },
    ],
    questions: [
      {
        id: 1,
        question: "Dans quelle ville peut-on admirer cette célèbre tour de fer puddlé de 330 mètres construite par Gustave Eiffel ?",
        options: ["Paris", "Lyon", "Marseille", "Bordeaux"],
        correctAnswer: "Paris",
        wikiSearchQuery: "Tour Eiffel Paris Gustave Eiffel",
        clue: "La Dame de Fer sur le Champ-de-Mars, érigée pour l'Exposition universelle de 1889.",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
        imagePrompt: "Iconic Eiffel Tower in Paris standing tall under sunset golden sky with Champ de Mars gardens",
        trivia: "La Tour Eiffel devait initialement être démontée au bout de 20 ans après sa construction !",
        category: "Monuments Cultes"
      },
      {
        id: 2,
        question: "Quel splendide mausolée de marbre blanc a été bâti par l'empereur moghol Shah Jahan à Agra en Inde ?",
        options: ["Taj Mahal", "Fort Rouge", "Qutub Minar", "Hawa Mahal"],
        correctAnswer: "Taj Mahal",
        wikiSearchQuery: "Taj Mahal Agra Shah Jahan",
        clue: "Un joyau architectural en hommage à son épouse Mumtaz Mahal.",
        audioNotes: [220.0, 277.18, 329.63, 440.0],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg",
        imagePrompt: "Majestic Taj Mahal white marble palace reflecting in water pool under blue sky in Agra India",
        trivia: "La couleur du marbre du Taj Mahal change subtilement selon les heures de la journée et la lumière du soleil.",
        category: "Merveilles du Monde"
      },
      {
        id: 3,
        question: "Dans quelle ville italienne trouve-t-on le célèbre amphithéâtre flavien antique où combattaient les gladiateurs ?",
        options: ["Rome", "Florence", "Venise", "Milan"],
        correctAnswer: "Rome",
        wikiSearchQuery: "Colosseum Rome Italy",
        clue: "Le Colisée antique et les empereurs romains.",
        audioNotes: [293.66, 349.23, 440.0, 523.25],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg",
        imagePrompt: "Ancient Colosseum amphitheater in Rome Italy with golden sunlight hitting ancient stone arches",
        trivia: "Le Colisée pouvait accueillir jusqu'à 50 000 spectateurs et pouvait même être inondé pour des batailles navales.",
        category: "Antiquité"
      },
      {
        id: 4,
        question: "Quel site archéologique inca perché à 2430 mètres d'altitude se trouve dans les Andes péruviennes ?",
        options: ["Machu Picchu", "Cuzco", "Tiahuanaco", "Chichen Itza"],
        correctAnswer: "Machu Picchu",
        wikiSearchQuery: "Machu Picchu Peru Andes Inca",
        clue: "La 'Cité Perdue' des Incas découverte par Hiram Bingham en 1911.",
        audioNotes: [329.63, 392.0, 440.0, 523.25],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/800px-Machu_Picchu%2C_Peru.jpg",
        imagePrompt: "Mystical Machu Picchu stone ruins perched on green Andean mountain peaks under soft clouds",
        trivia: "Les pierres des murs incas sont taillées avec une telle précision qu'on ne peut pas y glisser une lame de couteau.",
        category: "Civilisations Anciennes"
      },
      {
        id: 5,
        question: "Quelle immense fortification militaire en pierre serpente sur plus de 21 000 kilomètres au nord de la Chine ?",
        options: ["La Grande Muraille de Chine", "La Cité Interdite", "L'Armée de terre cuite", "Le Temple du Ciel"],
        correctAnswer: "La Grande Muraille de Chine",
        wikiSearchQuery: "Great Wall of China Beijing Mutianyu",
        clue: "Des tours de guet en pierre s'étendant à travers les montagnes.",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/800px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg",
        imagePrompt: "Majestic Great Wall of China winding endlessly across green mountain ridges at sunrise",
        trivia: "Contrairement au mythe populaire, la Grande Muraille n'est pas visible à l'œil nu depuis l'orbite terrestre basse.",
        category: "Architecture Mondiale"
      },
      {
        id: 6,
        question: "Quelle statue colossale de 93 mètres représentant la Liberté éclairant le monde accueille les navires à New York ?",
        options: ["La Statue de la Liberté", "Le Mont Rushmore", "Le Golden Gate", "Le Lincoln Memorial"],
        correctAnswer: "La Statue de la Liberté",
        wikiSearchQuery: "Statue of Liberty New York Harbor Bartholdi",
        clue: "Sculptée par Auguste Bartholdi et offerte par la France aux États-Unis.",
        audioNotes: [392.0, 440.0, 523.25, 659.25],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/800px-Statue_of_Liberty_7.jpg",
        imagePrompt: "Statue of Liberty in New York Harbor holding torch high under bright blue sky with Manhattan in background",
        trivia: "La couleur verte de la statue est due à l'oxydation naturelle de ses 31 tonnes de cuivre.",
        category: "Monuments Américains"
      },
      {
        id: 7,
        question: "Quelle célèbre cité troglodytique taillée dans la roche rose du désert se trouve en Jordanie ?",
        options: ["Pétra", "Palmyre", "Jerash", "Wadi Rum"],
        correctAnswer: "Pétra",
        wikiSearchQuery: "Petra Jordan Al-Khazneh Treasury",
        clue: "Le Trésor d'Al-Khazneh visible après avoir traversé le canyon étroit du Sîq.",
        audioNotes: [220.0, 277.18, 329.63, 440.0],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Treasury_petra_crop.jpeg/800px-Treasury_petra_crop.jpeg",
        imagePrompt: "Iconic Al-Khazneh Treasury of Petra carved into red rose sandstone cliffs in Jordan desert",
        trivia: "Pétra a servi de décor pour le temple du Graal dans le film culte 'Indiana Jones et la Dernière Croisade'.",
        category: "Sites Historiques"
      },
      {
        id: 8,
        question: "Quel opéra spectaculaire aux toits en forme de voiles blanches et de coquillages domine la baie de Sydney ?",
        options: ["L'Opéra de Sydney", "Le Harbour Bridge", "La Tour de Sydney", "L'Opéra de Melbourne"],
        correctAnswer: "L'Opéra de Sydney",
        wikiSearchQuery: "Sydney Opera House Australia Jorn Utzon",
        clue: "Conçu par l'architecte danois Jørn Utzon dans le port de Sydney en Australie.",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sydney_Opera_House_-_Dec_2008.jpg/800px-Sydney_Opera_House_-_Dec_2008.jpg",
        imagePrompt: "Iconic Sydney Opera House white sail roofs reflecting in deep blue harbor waters at dusk",
        trivia: "Les toits de l'Opéra de Sydney sont recouverts de plus d'un million de tuiles en céramique blanche et crème.",
        category: "Architecture Moderne"
      }
    ]
  },

  // 6. Blind Test Visuel - Famous Logos & Global Icons (English)
  {
    code: 'FLAG55',
    themeTitle: 'Global Landmarks & Famous Flags',
    topic: 'World Flags, Iconic Symbols & Wonders',
    gameMode: 'visual_blind_test',
    difficulty: 'medium',
    language: 'en',
    primaryColor: '#10b981',
    accentColor: '#f59e0b',
    themeBgImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&auto=format&fit=crop&q=80',
    ambientSound: 'synthwave',
    bots: [
      { id: 'bot_oliver', name: 'Oliver', avatar: '🎨', accuracy: 0.93, speedMin: 2.1, speedMax: 6.1 },
      { id: 'bot_sophia', name: 'Sophia', avatar: '🎯', accuracy: 0.87, speedMin: 2.5, speedMax: 6.9 },
      { id: 'bot_leo', name: 'Leo', avatar: '🦁', accuracy: 0.81, speedMin: 3.2, speedMax: 8.0 },
      { id: 'bot_elena', name: 'Elena', avatar: '💎', accuracy: 0.89, speedMin: 2.2, speedMax: 6.4 },
    ],
    questions: [
      {
        id: 1,
        question: "Which iconic clock tower stands at the north end of the Palace of Westminster in London?",
        options: ["Big Ben", "Tower Bridge", "The Shard", "St Paul's Cathedral"],
        correctAnswer: "Big Ben",
        wikiSearchQuery: "Big Ben Elizabeth Tower London",
        clue: "Officially named Elizabeth Tower, overlooking the River Thames.",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg/800px-Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg",
        imagePrompt: "Famous Big Ben clock tower and Westminster Palace in London beside River Thames",
        trivia: "Strictly speaking, 'Big Ben' is the nickname of the Great Bell inside the tower, not the tower itself.",
        category: "Landmarks"
      },
      {
        id: 2,
        question: "Which country's national flag features a central red maple leaf on a white background between two red stripes?",
        options: ["Canada", "Switzerland", "Denmark", "Austria"],
        correctAnswer: "Canada",
        wikiSearchQuery: "Flag of Canada maple leaf red and white",
        clue: "From the Atlantic to the Pacific, Ottawa is its capital.",
        audioNotes: [220.0, 277.18, 329.63, 440.0],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/800px-Flag_of_Canada_%28Pantone%29.svg.png",
        imagePrompt: "National flag of Canada with bold red maple leaf in center waving in wind",
        trivia: "The National Flag of Canada with the single 11-pointed maple leaf was officially adopted in 1965.",
        category: "World Flags"
      },
      {
        id: 3,
        question: "Which suspension bridge with its signature International Orange color spans the Golden Gate strait in California?",
        options: ["Golden Gate Bridge", "Brooklyn Bridge", "Sydney Harbour Bridge", "Tower Bridge"],
        correctAnswer: "Golden Gate Bridge",
        wikiSearchQuery: "Golden Gate Bridge San Francisco California",
        clue: "Connecting San Francisco to Marin County across rolling fog.",
        audioNotes: [293.66, 369.99, 440.0, 587.33],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/800px-GoldenGateBridge-001.jpg",
        imagePrompt: "Iconic Golden Gate Bridge in San Francisco spanning across water with beautiful golden hour sunlight",
        trivia: "The distinctive orange color was originally only a temporary primer coat, but locals loved it so much it was kept permanently!",
        category: "Engineering Marvels"
      },
      {
        id: 4,
        question: "Which country flies this distinctive blue and yellow cross flag?",
        options: ["Sweden", "Ukraine", "Finland", "Norway"],
        correctAnswer: "Sweden",
        wikiSearchQuery: "Flag of Sweden blue and yellow Nordic cross",
        clue: "The Scandinavian homeland of ABBA, IKEA, and the Nobel Prizes.",
        audioNotes: [329.63, 392.0, 440.0, 523.25],
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Flag_of_Sweden.svg/800px-Flag_of_Sweden.svg.png",
        imagePrompt: "National flag of Sweden with bright yellow Nordic cross on deep blue background",
        trivia: "The design is based on the Danish Dannebrog, the oldest continuously used national flag in the world.",
        category: "World Flags"
      },
      {
        id: 5,
        question: "Which ancient Mayan stepped pyramid temple dominates the archaeological ruins of Chichén Itzá in Mexico?",
        options: ["El Castillo", "Tikal", "Palenque", "Teotihuacan"],
        correctAnswer: "El Castillo",
        wikiSearchQuery: "El Castillo Chichen Itza Temple of Kukulcan",
        clue: "The Temple of Kukulcán, creating a serpent shadow illusion during equinoxes.",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Chichen_Itza_3.jpg/800px-Chichen_Itza_3.jpg",
        imagePrompt: "Ancient Mayan pyramid El Castillo at Chichen Itza under bright sunny Mexican sky",
        trivia: "The pyramid has 91 steps on each of its 4 sides, plus the top platform, totaling 365 steps—one for each day of the year.",
        category: "Ancient Wonders"
      },
      {
        id: 6,
        question: "Which country has a solid red flag featuring a large yellow star surrounded by four smaller stars in the canton?",
        options: ["China", "Vietnam", "North Korea", "Singapore"],
        correctAnswer: "China",
        wikiSearchQuery: "Flag of China five star red flag",
        clue: "The Five-star Red Flag of the most populous East Asian nation.",
        audioNotes: [392.0, 440.0, 523.25, 659.25],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/800px-Flag_of_the_People%27s_Republic_of_China.svg.png",
        imagePrompt: "National flag of China with five golden stars on vibrant red background",
        trivia: "The flag was designed by Zeng Liansong and first raised in Tiananmen Square on October 1, 1949.",
        category: "World Flags"
      },
      {
        id: 7,
        question: "Which dramatic 38-meter Art Deco statue of Jesus Christ stands atop Mount Corcovado overlooking Rio de Janeiro?",
        options: ["Christ the Redeemer", "Christ the King", "Cristo de la Concordia", "Statue of Unity"],
        correctAnswer: "Christ the Redeemer",
        wikiSearchQuery: "Christ the Redeemer statue Rio de Janeiro Brazil",
        clue: "With outstretched arms over Guanabara Bay in Brazil.",
        audioNotes: [220.0, 277.18, 329.63, 440.0],
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Christ_the_Redeemer_-_Rio_de_Janeiro%2C_Brazil.jpg/800px-Christ_the_Redeemer_-_Rio_de_Janeiro%2C_Brazil.jpg",
        imagePrompt: "Christ the Redeemer statue on top of Corcovado mountain overlooking Rio de Janeiro Brazil",
        trivia: "Voted one of the New Seven Wonders of the World in 2007, it was designed by French sculptor Paul Landowski.",
        category: "World Monuments"
      },
      {
        id: 8,
        question: "Which country's flag is famously known as the 'Union Jack' or 'Union Flag'?",
        options: ["United Kingdom", "Australia", "New Zealand", "Fiji"],
        correctAnswer: "United Kingdom",
        wikiSearchQuery: "Union Jack Flag of the United Kingdom",
        clue: "Combines the crosses of St George (England), St Andrew (Scotland), and St Patrick (Ireland).",
        audioNotes: [261.63, 329.63, 392.0, 523.25],
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/800px-Flag_of_the_United_Kingdom.svg.png",
        imagePrompt: "Union Jack flag of the United Kingdom waving with bold red white and blue crosses",
        trivia: "The current design of the Union Flag dates from a union proclamation in 1801.",
        category: "World Flags"
      }
    ]
  }
];
