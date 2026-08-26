import { QuizTheme, QuizData } from '../types';

export const PRESET_THEMES: QuizTheme[] = [
  {
    id: 'cinema',
    title: 'Cinéma & Blockbusters Cultes',
    description: '15 films légendaires, répliques iconiques et scènes d\'anthologie du 7ème art.',
    icon: 'Clapperboard',
    primaryColor: '#f59e0b', // Amber / Gold
    accentColor: '#ec4899',  // Pink
    badgeBg: 'from-amber-500/20 to-pink-500/20 text-amber-300 border-amber-500/30',
    interfaceImage: 'https://image.pollinations.ai/prompt/Cinematic%20movie%20theater%20hall%20with%20glowing%20gold%20lights%20and%20red%20curtains?width=1920&height=1080&nologo=true',
    ambientSound: 'cinema',
    tag: 'Populaire',
    suggestedPrompt: 'Cinéma des années 80 et 90',
  },
  {
    id: 'gaming',
    title: 'Jeux Vidéo & Rétrogaming',
    description: 'De Mario à Cyberpunk : 15 pépites, mondes ouverts et héros légendaires.',
    icon: 'Gamepad2',
    primaryColor: '#8b5cf6', // Purple
    accentColor: '#06b6d4',  // Cyan
    badgeBg: 'from-purple-500/20 to-cyan-500/20 text-purple-300 border-purple-500/30',
    interfaceImage: 'https://image.pollinations.ai/prompt/Retro%20cyberpunk%20arcade%20room%20with%20neon%20violet%20and%20cyan%20consoles?width=1920&height=1080&nologo=true',
    ambientSound: 'synthwave',
    tag: 'Geek',
    suggestedPrompt: 'Jeux vidéo PlayStation et Nintendo',
  },
  {
    id: 'animes',
    title: 'Animés & Dessins Animés',
    description: 'De Dragon Ball au Studio Ghibli, sauras-tu reconnaître ces 15 univers animés ?',
    icon: 'Sparkles',
    primaryColor: '#ec4899', // Pink
    accentColor: '#f97316',  // Orange
    badgeBg: 'from-pink-500/20 to-orange-500/20 text-pink-300 border-pink-500/30',
    interfaceImage: 'https://image.pollinations.ai/prompt/Vibrant%20Japanese%20anime%20sky%20with%20cherry%20blossoms%20and%20floating%20islands?width=1920&height=1080&nologo=true',
    ambientSound: 'fantasy',
    tag: 'Animation',
    suggestedPrompt: 'Animés shonen cultes et Ghibli',
  },
  {
    id: 'music',
    title: 'Hits & Légendes de la Musique',
    description: 'Pop, Rock, Électro : 15 morceaux et artistes inoubliables qui ont marqué l\'histoire.',
    icon: 'Disc3',
    primaryColor: '#10b981', // Emerald
    accentColor: '#6366f1',  // Indigo
    badgeBg: 'from-emerald-500/20 to-indigo-500/20 text-emerald-300 border-emerald-500/30',
    interfaceImage: 'https://image.pollinations.ai/prompt/Concert%20stage%20with%20emerald%20lasers%20and%20vintage%20vinyl%20records?width=1920&height=1080&nologo=true',
    ambientSound: 'retro80s',
    tag: 'Rythme',
    suggestedPrompt: 'Hits pop et rock des années 80 à 2000',
  },
  {
    id: 'series',
    title: 'Séries TV Incontournables',
    description: 'Trônes, braquages et mondes à l\'envers : devine ces 15 chefs-d\'œuvre du streaming.',
    icon: 'Tv',
    primaryColor: '#ef4444', // Red
    accentColor: '#f59e0b',  // Amber
    badgeBg: 'from-red-500/20 to-amber-500/20 text-red-300 border-red-500/30',
    interfaceImage: 'https://image.pollinations.ai/prompt/Dark%20cinematic%20television%20studio%20with%20red%20dramatic%20lighting?width=1920&height=1080&nologo=true',
    ambientSound: 'cinema',
    tag: 'Binge-watch',
    suggestedPrompt: 'Séries Netflix et HBO cultes',
  },
  {
    id: 'world',
    title: 'Merveilles & Monuments du Monde',
    description: 'Voyage autour du globe à travers 15 monuments et paysages spectaculaires.',
    icon: 'Globe2',
    primaryColor: '#3b82f6', // Blue
    accentColor: '#10b981',  // Emerald
    badgeBg: 'from-blue-500/20 to-emerald-500/20 text-blue-300 border-blue-500/30',
    interfaceImage: 'https://image.pollinations.ai/prompt/Spectacular%20view%20of%20Earth%20from%20orbit%20with%20golden%20sunrise%20and%20clouds?width=1920&height=1080&nologo=true',
    ambientSound: 'space',
    tag: 'Voyage',
    suggestedPrompt: 'Monuments célèbres et capitales du monde',
  },
];

export const PRESET_QUIZ_DATA: Record<string, QuizData> = {
  cinema: {
    topic: 'Cinéma & Blockbusters Cultes',
    themeTitle: 'Cinéma Culte & 7ème Art',
    themeDescription: '15 énigmes visuelles et sonores sur les plus grands chefs-d\'œuvre du cinéma.',
    primaryColor: '#f59e0b',
    accentColor: '#ec4899',
    themeBgImage: 'https://image.pollinations.ai/prompt/Cinematic%20gold%20and%20dark%20movie%20theater%20background?width=1920&height=1080&nologo=true',
    ambientSound: 'cinema',
    questions: [
      {
        id: 1,
        question: "Dans quel film culte de science-fiction une DeLorean modifiée voyage-t-elle dans le temps à 88 miles/heure ?",
        options: ["Blade Runner", "Retour vers le Futur", "Terminator", "L'Effet Papillon"],
        correctAnswer: "Retour vers le Futur",
        clue: "Nom de Zeus ! Une vitesse de 88 mph et 2,21 gigowatts d'électricité !",
        audioNotes: [392, 523.25, 659.25, 783.99, 659.25, 783.99],
        imagePrompt: "Photorealistic cinematic DeLorean car with gullwing doors open and blue electric sparks at night leaving fire tracks on asphalt",
        imageUrl: "https://image.pollinations.ai/prompt/Photorealistic%20cinematic%20DeLorean%20car%20with%20gullwing%20doors%20open%20and%20blue%20electric%20sparks%20at%20night%20leaving%20fire%20tracks%20on%20asphalt?width=800&height=450&nologo=true",
        trivia: "Dans la première version du scénario, la machine à voyager dans le temps était un simple réfrigérateur !",
        category: "Sci-Fi Culte"
      },
      {
        id: 2,
        question: "Quel chef-d'œuvre de James Cameron met en scène Jack Dawson et Rose DeWitt Bukater en 1912 ?",
        options: ["Avatar", "Abyss", "Titanic", "Poséidon"],
        correctAnswer: "Titanic",
        clue: "« Je suis le roi du monde ! » sur la proue d'un paquebot géant.",
        audioNotes: [440, 493.88, 523.25, 493.88, 440, 392],
        imagePrompt: "Cinematic majestic Titanic ocean liner sailing across a dark ocean under starry night sky with golden lit windows",
        imageUrl: "https://image.pollinations.ai/prompt/Cinematic%20majestic%20Titanic%20ocean%20liner%20sailing%20across%20a%20dark%20ocean%20under%20starry%20night%20sky%20with%20golden%20lit%20windows?width=800&height=450&nologo=true",
        trivia: "Titanic a remporté 11 Oscars, égalant le record historique de Ben-Hur et du Seigneur des Anneaux : Le Retour du Roi.",
        category: "Drame Romantique"
      },
      {
        id: 3,
        question: "Quel film de Christopher Nolan explore l'extraction de secrets dans les rêves et met en scène une toupie qui tourne sans fin ?",
        options: ["Inception", "Interstellar", "Tenet", "Memento"],
        correctAnswer: "Inception",
        clue: "Un totem personnel, des architectes du subconscient et le son mythique du 'Braaam'.",
        audioNotes: [130.81, 164.81, 196.0, 130.81, 98.0],
        imagePrompt: "Close-up of a chrome metallic spinning top spinning endlessly on a dark polished mahogany table in dramatic lighting",
        imageUrl: "https://image.pollinations.ai/prompt/Close-up%20of%20a%20chrome%20metallic%20spinning%20top%20spinning%20endlessly%20on%20a%20dark%20polished%20mahogany%20table%20in%20dramatic%20lighting?width=800&height=450&nologo=true",
        trivia: "Le célèbre thème musical 'Non, je ne regrette rien' d'Édith Piaf a été ralenti pour former le motif orchestral de Hans Zimmer.",
        category: "Thriller Psychologique"
      },
      {
        id: 4,
        question: "Dans quel film d'animation Disney de 1994 Simba doit-il reprendre sa place légitime de roi sur la Terre des Lions ?",
        options: ["Aladdin", "Tarzan", "Le Roi Lion", "Le Livre de la Jungle"],
        correctAnswer: "Le Roi Lion",
        clue: "« Hakuna Matata » et le Rocher des Lions surplombant la savane.",
        audioNotes: [261.63, 329.63, 392.0, 523.25, 440, 392.0],
        imagePrompt: "Majestic lion silhouette standing on Pride Rock overlooking an African savannah at sunset with warm orange and red glow",
        imageUrl: "https://image.pollinations.ai/prompt/Majestic%20lion%20silhouette%20standing%20on%20Pride%20Rock%20overlooking%20an%20African%20savannah%20at%20sunset%20with%20warm%20orange%20and%20red%20glow?width=800&height=450&nologo=true",
        trivia: "Le rugissement des lions dans le film a en réalité été créé en mixant des sons de tigres, de jaguars et la voix d'un comédien dans une poubelle métallique !",
        category: "Animation"
      },
      {
        id: 5,
        question: "Dans quel film de Quentin Tarantino Vincent Vega et Mia Wallace dansent-ils le twist au Jack Rabbit Slim's ?",
        options: ["Kill Bill", "Django Unchained", "Reservoir Dogs", "Pulp Fiction"],
        correctAnswer: "Pulp Fiction",
        clue: "Une mallette mystérieuse à la lueur dorée et une montre en or.",
        audioNotes: [293.66, 349.23, 440.0, 392.0, 349.23],
        imagePrompt: "Retro 1950s American diner with red vinyl booth seats and neon lights glowing in purple and amber",
        imageUrl: "https://image.pollinations.ai/prompt/Retro%201950s%20American%20diner%20with%20red%20vinyl%20booth%20seats%20and%20neon%20lights%20glowing%20in%20purple%20and%20amber?width=800&height=450&nologo=true",
        trivia: "Le contenu lumineux de la fameuse mallette n'a jamais été révélé par Quentin Tarantino.",
        category: "Film Noir Culte"
      },
      {
        id: 6,
        question: "Quel film de Steven Spielberg de 1993 a ressuscité des dinosaures grâce à de l'ADN fossilisé dans de l'ambre ?",
        options: ["Jurassic Park", "King Kong", "Godzilla", "Le Monde Perdu"],
        correctAnswer: "Jurassic Park",
        clue: "Une onde dans un verre d'eau signalant l'arrivée d'un T-Rex géant.",
        audioNotes: [523.25, 493.88, 523.25, 392.0, 329.63, 523.25],
        imagePrompt: "Colossal wooden park gates in dense tropical rain jungle surrounded by flaming torches and electric fence",
        imageUrl: "https://image.pollinations.ai/prompt/Colossal%20wooden%20park%20gates%20in%20dense%20tropical%20rain%20jungle%20surrounded%20by%20flaming%20torches%20and%20electric%20fence?width=800&height=450&nologo=true",
        trivia: "Les rugissements du T-Rex étaient un mélange de sons d'éléphants, d'alligators, de tigres et d'un petit chien.",
        category: "Aventure"
      },
      {
        id: 7,
        question: "Quelle trilogie fantastique de Peter Jackson suit le hobbit Frodon Sacquet dans sa quête pour détruire l'Anneau Unique ?",
        options: ["Le Hobbit", "Le Seigneur des Anneaux", "Harry Potter", "Eragon"],
        correctAnswer: "Le Seigneur des Anneaux",
        clue: "« Mon Précieux ! » au sommet de la Montagne du Destin.",
        audioNotes: [329.63, 392.0, 440.0, 493.88, 440.0, 392.0],
        imagePrompt: "Golden One Ring with glowing fiery Elvish inscriptions resting on volcanic dark rock",
        imageUrl: "https://image.pollinations.ai/prompt/Golden%20One%20Ring%20with%20glowing%20fiery%20Elvish%20inscriptions%20resting%20on%20volcanic%20dark%20rock?width=800&height=450&nologo=true",
        trivia: "L'ensemble de la trilogie a été tourné simultanément en Nouvelle-Zélande sur une période de 438 jours.",
        category: "Fantasy Épique"
      },
      {
        id: 8,
        question: "Quel film culte des Wachowski met en scène Thomas Anderson choisissant entre la pilule rouge et la pilule bleue ?",
        options: ["Equilibrium", "Tron", "Matrix", "Ghost in the Shell"],
        correctAnswer: "Matrix",
        clue: "Le code vert vertical tombant sur écran noir et l'esquive de balles au ralenti.",
        audioNotes: [174.61, 220.0, 261.63, 329.63, 261.63],
        imagePrompt: "Digital matrix green rain cascading code on pure black background with glowing green characters",
        imageUrl: "https://image.pollinations.ai/prompt/Digital%20matrix%20green%20rain%20cascading%20code%20on%20pure%20black%20background%20with%20glowing%20green%20characters?width=800&height=450&nologo=true",
        trivia: "Le code numérique vert de Matrix provient en partie de symboles de recettes de sushi japonaises scannés par le designer !",
        category: "Cyberpunk"
      },
      {
        id: 9,
        question: "Dans quel film de Ridley Scott sorti en 2000 Russell Crowe incarne-t-il Maximus Decimus Meridius ?",
        options: ["Gladiator", "Troie", "Spartacus", "Kingdom of Heaven"],
        correctAnswer: "Gladiator",
        clue: "« Ce que nous faisons dans notre vie résonne dans l'éternité ! » dans l'arène du Colisée.",
        audioNotes: [220.0, 246.94, 261.63, 293.66, 261.63, 220.0],
        imagePrompt: "Ancient Roman bronze gladiator helmet lying on golden arena sand under bright Mediterranean sun",
        imageUrl: "https://image.pollinations.ai/prompt/Ancient%20Roman%20bronze%20gladiator%20helmet%20lying%20on%20golden%20arena%20sand%20under%20bright%20Mediterranean%20sun?width=800&height=450&nologo=true",
        trivia: "La fameuse scène où Maximus caresse les épis de blé a été réalisée avec la doublure de Russell Crowe.",
        category: "Péplum"
      },
      {
        id: 10,
        question: "Quel film de super-héros réalisé par Christopher Nolan oppose Christian Bale à Heath Ledger en Joker ?",
        options: ["The Batman", "The Dark Knight", "Batman Begins", "Justice League"],
        correctAnswer: "The Dark Knight",
        clue: "« Why so serious ? » et un masque de clown lors d'un braquage de banque.",
        audioNotes: [110.0, 116.54, 123.47, 130.81, 110.0],
        imagePrompt: "Burning Joker playing card with purple and green flames on wet dark Gotham street asphalt",
        imageUrl: "https://image.pollinations.ai/prompt/Burning%20Joker%20playing%20card%20with%20purple%20and%20green%20flames%20on%20wet%20dark%20Gotham%20street%20asphalt?width=800&height=450&nologo=true",
        trivia: "Heath Ledger a remporté l'Oscar du meilleur acteur dans un second rôle à titre posthume.",
        category: "Super-Héros"
      },
      {
        id: 11,
        question: "Dans quel film d'animation Pixar un vieux veuf nommé Carl Fredricksen attache des milliers de ballons à sa maison ?",
        options: ["Toy Story", "Wall-E", "Coco", "Là-haut"],
        correctAnswer: "Là-haut",
        clue: "Des Chutes du Paradis, un scout bavard nommé Russell et un oiseau exotique.",
        audioNotes: [523.25, 587.33, 659.25, 698.46, 783.99],
        imagePrompt: "Charming Victorian house lifted in the sky by a giant bouquet of colorful helium balloons against blue sky",
        imageUrl: "https://image.pollinations.ai/prompt/Charming%20Victorian%20house%20lifted%20in%20the%20sky%20by%20a%20giant%20bouquet%20of%20colorful%20helium%20balloons%20against%20blue%20sky?width=800&height=450&nologo=true",
        trivia: "Les ingénieurs de Pixar ont calculé qu'il faudrait plus de 9,4 millions de ballons pour soulever une maison de cette taille.",
        category: "Animation Pixar"
      },
      {
        id: 12,
        question: "Dans quelle saga cinématographique créée par George Lucas retrouve-t-on Luke Skywalker, Han Solo et Dark Vador ?",
        options: ["Star Trek", "Dune", "Star Wars", "Stargate"],
        correctAnswer: "Star Wars",
        clue: "« Que la Force soit avec toi » et des sabres laser rouge et bleu.",
        audioNotes: [261.63, 392.0, 349.23, 329.63, 293.66, 523.25],
        imagePrompt: "Blue laser lightsaber clashing against red laser lightsaber in a futuristic dark industrial hangar",
        imageUrl: "https://image.pollinations.ai/prompt/Blue%20laser%20lightsaber%20clashing%20against%20red%20laser%20lightsaber%20in%20a%20futuristic%20dark%20industrial%20hangar?width=800&height=450&nologo=true",
        trivia: "Le célèbre son de respiration de Dark Vador a été créé à l'aide d'un détendeur de plongée sous-marine.",
        category: "Space Opera"
      },
      {
        id: 13,
        question: "Quel film de science-fiction de James Cameron nous plonge sur la planète Pandora parmi le peuple Na'vi à la peau bleue ?",
        options: ["Valérian", "Avatar", "Prometheus", "Interstellar"],
        correctAnswer: "Avatar",
        clue: "Des montagnes flottantes et la connexion avec les Ikran volants.",
        audioNotes: [392.0, 440.0, 523.25, 587.33, 659.25],
        imagePrompt: "Lush bioluminescent extraterrestrial jungle on Pandora with glowing blue and purple flora at night",
        imageUrl: "https://image.pollinations.ai/prompt/Lush%20bioluminescent%20extraterrestrial%20jungle%20on%20Pandora%20with%20glowing%20blue%20and%20purple%20flora%20at%20night?width=800&height=450&nologo=true",
        trivia: "Avatar demeure à ce jour le film ayant rapporté le plus d'argent au box-office mondial de l'histoire du cinéma.",
        category: "Sci-Fi"
      },
      {
        id: 14,
        question: "Dans quel film d'horreur de Stanley Kubrick Jack Torrance perd-il la raison dans l'hôtel isolé Overlook ?",
        options: ["Psychose", "L'Exorciste", "Shining", "Misery"],
        correctAnswer: "Shining",
        clue: "« Redrum », une hache à travers une porte et un labyrinthe enneigé.",
        audioNotes: [110.0, 116.54, 110.0, 103.83, 98.0],
        imagePrompt: "Eerie empty hotel hallway with iconic orange and brown hexagonal geometric carpet pattern under dim lighting",
        imageUrl: "https://image.pollinations.ai/prompt/Eerie%20empty%20hotel%20hallway%20with%20iconic%20orange%20and%20brown%20hexagonal%20geometric%20carpet%20pattern%20under%20dim%20lighting?width=800&height=450&nologo=true",
        trivia: "La célèbre réplique improvisée « Here's Johnny! » est un clin d'œil à Johnny Carson.",
        category: "Horreur Culte"
      },
      {
        id: 15,
        question: "Quel chef-d'œuvre de Francis Ford Coppola raconte l'histoire de la famille mafieuse Corleone menée par Don Vito ?",
        options: ["Les Affranchis", "Le Parrain", "Scarface", "Casino"],
        correctAnswer: "Le Parrain",
        clue: "« Une offre qu'il ne pourra pas refuser » et une rose rouge au revers du smoking.",
        audioNotes: [220.0, 246.94, 261.63, 293.66, 246.94, 220.0],
        imagePrompt: "Vintage black fedora hat beside a glass of amber scotch whisky and a red rose in moody chiaroscuro lighting",
        imageUrl: "https://image.pollinations.ai/prompt/Vintage%20black%20fedora%20hat%20beside%20a%20glass%20of%20amber%20scotch%20whisky%20and%20a%20red%20rose%20in%20moody%20chiaroscuro%20lighting?width=800&height=450&nologo=true",
        trivia: "Marlon Brando a utilisé des morceaux de coton dans ses joues pour donner à Don Corleone sa mâchoire lourde.",
        category: "Classique du Cinéma"
      }
    ]
  },
  gaming: {
    topic: 'Jeux Vidéo & Rétrogaming',
    themeTitle: 'Jeux Vidéo & Mondes Virtuels',
    themeDescription: '15 questions mythiques sur les consoles, héros de pixels et univers de jeux cultes.',
    primaryColor: '#8b5cf6',
    accentColor: '#06b6d4',
    themeBgImage: 'https://image.pollinations.ai/prompt/Futuristic%20gaming%20room%20with%20purple%20neon%20strips%20and%20arcade%20consoles?width=1920&height=1080&nologo=true',
    ambientSound: 'synthwave',
    questions: [
      {
        id: 1,
        question: "Quel plombier moustachu de Nintendo doit sauver la princesse Peach des griffes de Bowser dans le Royaume Champignon ?",
        options: ["Luigi", "Wario", "Sonic", "Mario"],
        correctAnswer: "Mario",
        clue: "Une casquette rouge frappée d'un 'M' et un saut sonore sur des briques mystères.",
        audioNotes: [659.25, 659.25, 659.25, 523.25, 659.25, 783.99],
        imagePrompt: "Iconic red plumber cap with white M logo resting on a green warp pipe in Mushroom Kingdom landscape",
        imageUrl: "https://image.pollinations.ai/prompt/Iconic%20red%20plumber%20cap%20with%20white%20M%20logo%20resting%20on%20a%20green%20warp%20pipe%20in%20Mushroom%20Kingdom%20landscape?width=800&height=450&nologo=true",
        trivia: "À l'origine dans Donkey Kong en 1981, Mario s'appelait 'Jumpman' et était charpentier !",
        category: "Rétro Nintendo"
      },
      {
        id: 2,
        question: "Dans quelle saga de jeux de rôle héroïque Link brandit-il l'épée de légende pour protéger le royaume d'Hyrule ?",
        options: ["Final Fantasy", "The Legend of Zelda", "Dragon Quest", "Dark Souls"],
        correctAnswer: "The Legend of Zelda",
        clue: "La Triforce d'or et un Ocarina magique traversant les âges.",
        audioNotes: [440.0, 493.88, 523.25, 587.33, 659.25, 783.99],
        imagePrompt: "The glowing Master Sword embedded in a stone pedestal surrounded by mystic blue light and flowers in a sacred forest",
        imageUrl: "https://image.pollinations.ai/prompt/The%20glowing%20Master%20Sword%20embedded%20in%20a%20stone%20pedestal%20surrounded%20by%20mystic%20blue%20light%20and%20flowers%20in%20a%20sacred%20forest?width=800&height=450&nologo=true",
        trivia: "Shigeru Miyamoto a nommé la princesse Zelda en hommage à Zelda Fitzgerald.",
        category: "Aventure Action"
      },
      {
        id: 3,
        question: "Quel jeu sandbox de Mojang aux graphismes cubiques permet d'extraire des ressources, miner et bâtir à l'infini ?",
        options: ["Roblox", "Terraria", "Minecraft", "Fortnite"],
        correctAnswer: "Minecraft",
        clue: "Des blocs de terre, une pioche en diamant et la menace explosive d'un Creeper vert.",
        audioNotes: [329.63, 392.0, 440.0, 493.88, 392.0],
        imagePrompt: "Stylized voxel 3D blocky landscape at sunset with pixelated grass block, diamond pickaxe and square clouds",
        imageUrl: "https://image.pollinations.ai/prompt/Stylized%20voxel%203D%20blocky%20landscape%20at%20sunset%20with%20pixelated%20grass%20block%20diamond%20pickaxe%20and%20square%20clouds?width=800&height=450&nologo=true",
        trivia: "Minecraft est le jeu vidéo le plus vendu de tous les temps avec plus de 300 millions d'exemplaires.",
        category: "Sandbox"
      },
      {
        id: 4,
        question: "Quel hérisson bleu ultra-rapide de SEGA collecte des anneaux dorés pour contrecarrer le Dr Robotnik ?",
        options: ["Knuckles", "Sonic", "Tails", "Shadow"],
        correctAnswer: "Sonic",
        clue: "Une vitesse supersonique et des loopings dans Green Hill Zone.",
        audioNotes: [523.25, 659.25, 783.99, 1046.5, 783.99],
        imagePrompt: "Blue streak of supersonic speed with sparkling golden spinning rings floating above green checkerboard hills",
        imageUrl: "https://image.pollinations.ai/prompt/Blue%20streak%20of%20supersonic%20speed%20with%20sparkling%20golden%20spinning%20rings%20floating%20above%20green%20checkerboard%20hills?width=800&height=450&nologo=true",
        trivia: "Sonic a été créé pour rivaliser directement avec Mario de Nintendo.",
        category: "Plateforme Rétro"
      },
      {
        id: 5,
        question: "Dans quel RPG de CD Projekt Red incarne-t-on le sorceleur mutant Geralt de Riv à la recherche de Ciri ?",
        options: ["Cyberpunk 2077", "Skyrim", "The Witcher 3: Wild Hunt", "Elden Ring"],
        correctAnswer: "The Witcher 3: Wild Hunt",
        clue: "Deux épées dans le dos (une en acier, une en argent) et des parties de Gwent à la taverne.",
        audioNotes: [220.0, 261.63, 293.66, 329.63, 220.0],
        imagePrompt: "Silver wolf head medallion with glowing red ruby eyes resting on weathered leather armor with two swords",
        imageUrl: "https://image.pollinations.ai/prompt/Silver%20wolf%20head%20medallion%20with%20glowing%20red%20ruby%20eyes%20resting%20on%20weathered%20leather%20armor%20with%20two%20swords?width=800&height=450&nologo=true",
        trivia: "Le jeu comporte plus de 36 fins différentes selon les choix du joueur.",
        category: "Action RPG"
      },
      {
        id: 6,
        question: "Quel FPS pionnier d'id Software sorti en 1993 plonge le joueur dans la peau d'un Doom Slayer exterminant des démons sur Mars ?",
        options: ["DOOM", "Quake", "Duke Nukem 3D", "Wolfenstein 3D"],
        correctAnswer: "DOOM",
        clue: "Le BFG 9000, du métal lourd en bande-son et des portails vers l'Enfer.",
        audioNotes: [110.0, 110.0, 220.0, 110.0, 116.54, 110.0],
        imagePrompt: "Futuristic green heavy combat armor helmet glowing with green visor amidst fiery Martian demonic inferno",
        imageUrl: "https://image.pollinations.ai/prompt/Futuristic%20green%20heavy%20combat%20armor%20helmet%20glowing%20with%20green%20visor%20amidst%20fiery%20Martian%20demonic%20inferno?width=800&height=450&nologo=true",
        trivia: "DOOM a été porté sur des centaines d'appareils insolites, y compris des calculatrices et des montres.",
        category: "FPS Culte"
      },
      {
        id: 7,
        question: "Dans quel jeu d'action en monde ouvert de Rockstar Games explore-t-on la ville de Los Santos à travers Franklin, Michael et Trevor ?",
        options: ["Grand Theft Auto V", "Red Dead Redemption 2", "Watch Dogs", "Saints Row"],
        correctAnswer: "Grand Theft Auto V",
        clue: "Des braquages de grande envergure sous le soleil de la côte ouest californienne.",
        audioNotes: [261.63, 329.63, 392.0, 349.23, 261.63],
        imagePrompt: "Cinematic sunset over Los Angeles style city skyline with tall palm trees and luxury sports cars",
        imageUrl: "https://image.pollinations.ai/prompt/Cinematic%20sunset%20over%20Los%20Angeles%20style%20city%20skyline%20with%20tall%20palm%20trees%20and%20luxury%20sports%20cars?width=800&height=450&nologo=true",
        trivia: "GTA V a généré plus de 1 milliard de dollars en seulement 3 jours après son lancement.",
        category: "Monde Ouvert"
      },
      {
        id: 8,
        question: "Quelle franchise de jeux de combat de Capcom oppose Ryu, Ken, Chun-Li et Guile dans des duels aux 'Hadoken' ?",
        options: ["Tekken", "Street Fighter", "Mortal Kombat", "Soulcalibur"],
        correctAnswer: "Street Fighter",
        clue: "« Shoryuken ! » et des bornes d'arcade des années 90.",
        audioNotes: [440.0, 523.25, 659.25, 587.33, 440.0],
        imagePrompt: "Red martial arts headband and white karate gi with blue glowing energy fireball Hadoken charging in hands",
        imageUrl: "https://image.pollinations.ai/prompt/Red%20martial%20arts%20headband%20and%20white%20karate%20gi%20with%20blue%20glowing%20energy%20fireball%20Hadoken%20charging%20in%20hands?width=800&height=450&nologo=true",
        trivia: "Le système de combos a été découvert par accident comme un bug dans Street Fighter II.",
        category: "Combat"
      },
      {
        id: 9,
        question: "Quel jeu d'infiltration de Konami créé par Hideo Kojima met en scène Solid Snake s'infiltrant dans Shadow Moses ?",
        options: ["Metal Gear Solid", "Splinter Cell", "Hitman", "Deus Ex"],
        correctAnswer: "Metal Gear Solid",
        clue: "Un point d'exclamation rouge retentissant et un carton de dissimulation.",
        audioNotes: [880.0, 1760.0, 880.0],
        imagePrompt: "Cardboard box on snowy military base floor with red exclamation mark icon hovering above it",
        imageUrl: "https://image.pollinations.ai/prompt/Cardboard%20box%20on%20snowy%20military%20base%20floor%20with%20red%20exclamation%20mark%20icon%20hovering%20above%20it?width=800&height=450&nologo=true",
        trivia: "Dans MGS sur PS1, le combat contre Psycho Mantis obligeait le joueur à changer de port de manette !",
        category: "Infiltration"
      },
      {
        id: 10,
        question: "Dans quel jeu FromSoftware explore-t-on l'Entre-Terre en tant que Sans-Éclat sous l'Arbre-Monde doré ?",
        options: ["Bloodborne", "Dark Souls III", "Elden Ring", "Sekiro"],
        correctAnswer: "Elden Ring",
        clue: "Un monde sombre et impitoyable conçu en collaboration avec George R. R. Martin.",
        audioNotes: [130.81, 164.81, 196.0, 174.61, 130.81],
        imagePrompt: "Colossal glowing golden Erdtree dominating a dark mystical fantasy sky above ruins and mist",
        imageUrl: "https://image.pollinations.ai/prompt/Colossal%20glowing%20golden%20Erdtree%20dominating%20a%20dark%20mystical%20fantasy%20sky%20above%20ruins%20and%20mist?width=800&height=450&nologo=true",
        trivia: "Elden Ring a été sacré Jeu de l'Année (GOTY) en 2022.",
        category: "Souls-like"
      },
      {
        id: 11,
        question: "Quel jeu d'arcade classique de Namco de 1980 met en scène un camembert jaune engloutissant des pac-gommes en fuyant 4 fantômes ?",
        options: ["Space Invaders", "Pac-Man", "Galaga", "Dig Dug"],
        correctAnswer: "Pac-Man",
        clue: "Blinky, Pinky, Inky et Clyde dans un labyrinthe bleu fluo.",
        audioNotes: [493.88, 987.77, 783.99, 659.25, 493.88],
        imagePrompt: "Glowing yellow Pac-Man in dark neon blue maze eating yellow dots with colorful ghost silhouettes",
        imageUrl: "https://image.pollinations.ai/prompt/Glowing%20yellow%20Pac-Man%20in%20dark%20neon%20blue%20maze%20eating%20yellow%20dots%20with%20colorful%20ghost%20silhouettes?width=800&height=450&nologo=true",
        trivia: "Toru Iwatani s'est inspiré d'une pizza entamée pour créer la forme de Pac-Man.",
        category: "Arcade Culte"
      },
      {
        id: 12,
        question: "Dans quelle saga de science-fiction de Valve incarne-t-on le physicien Gordon Freeman armé d'un pied-de-biche ?",
        options: ["Half-Life", "Portal", "BioShock", "System Shock"],
        correctAnswer: "Half-Life",
        clue: "Le complexe de recherche de Black Mesa et la combinaison HEV.",
        audioNotes: [196.0, 220.0, 246.94, 261.63, 196.0],
        imagePrompt: "Iconic red steel crowbar resting on concrete floor in futuristic research facility with lambda orange logo",
        imageUrl: "https://image.pollinations.ai/prompt/Iconic%20red%20steel%20crowbar%20resting%20on%20concrete%20floor%20in%20futuristic%20research%20facility%20with%20lambda%20orange%20logo?width=800&height=450&nologo=true",
        trivia: "Le pistolet anti-gravité de Half-Life 2 a révolutionné la physique dans les jeux vidéo.",
        category: "Sci-Fi FPS"
      },
      {
        id: 13,
        question: "Quel jeu de cartes et monstres de poche de Game Freak a lancé la chasse aux créatures avec Pikachu et Salamèche en 1996 ?",
        options: ["Digimon", "Yu-Gi-Oh!", "Monster Hunter", "Pokémon"],
        correctAnswer: "Pokémon",
        clue: "« Attrapez-les tous ! » et une Pokéball rouge et blanche.",
        audioNotes: [392.0, 440.0, 493.88, 587.33, 523.25, 493.88],
        imagePrompt: "Photorealistic red and white Pokeball resting in lush green grass with electric yellow lightning sparks around it",
        imageUrl: "https://image.pollinations.ai/prompt/Photorealistic%20red%20and%20white%20Pokeball%20resting%20in%20lush%20green%20grass%20with%20electric%20yellow%20lightning%20sparks%20around%20it?width=800&height=450&nologo=true",
        trivia: "Pokémon est la franchise multimédia la plus rentable de toute l'histoire.",
        category: "RPG Créatures"
      },
      {
        id: 14,
        question: "Dans quel jeu de tir tactique d'Epic Games 100 joueurs sautent d'un bus de combat volant pour construire et survivre ?",
        options: ["PUBG", "Fortnite", "Apex Legends", "Call of Duty: Warzone"],
        correctAnswer: "Fortnite",
        clue: "Des constructions instantanées, un lama de ravitaillement et une tempête violette.",
        audioNotes: [329.63, 392.0, 440.0, 523.25, 659.25],
        imagePrompt: "Blue Battle Bus with hot air balloon flying over colorful island landscape with purple storm wall in background",
        imageUrl: "https://image.pollinations.ai/prompt/Blue%20Battle%20Bus%20with%20hot%20air%20balloon%20flying%20over%20colorful%20island%20landscape%20with%20purple%20storm%20wall%20in%20background?width=800&height=450&nologo=true",
        trivia: "Fortnite a accueilli des concerts virtuels géants de Travis Scott et Ariana Grande.",
        category: "Battle Royale"
      },
      {
        id: 15,
        question: "Quel jeu de réflexion culte soviétique conçu par Alekseï Pajitnov en 1984 consiste à emboîter des tétraminos qui tombent ?",
        options: ["Puyo Puyo", "Columns", "Tetris", "Dr. Mario"],
        correctAnswer: "Tetris",
        clue: "La musique russe 'Korobeiniki' et des lignes géométriques qui s'effacent.",
        audioNotes: [659.25, 493.88, 523.25, 587.33, 523.25, 493.88, 440.0],
        imagePrompt: "Brightly colored glowing 3D tetromino geometric blocks falling into grid matrix against dark cyber grid background",
        imageUrl: "https://image.pollinations.ai/prompt/Brightly%20colored%20glowing%203D%20tetromino%20geometric%20blocks%20falling%20into%20grid%20matrix%20against%20dark%20cyber%20grid%20background?width=800&height=450&nologo=true",
        trivia: "Tetris a été le premier jeu vidéo joué dans l'espace, à bord de la station Mir en 1993.",
        category: "Puzzle Rétro"
      }
    ]
  }
};
