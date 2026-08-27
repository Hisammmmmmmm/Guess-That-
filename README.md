# 🎵 Guess That — Jeu de Quiz & Blind Test Multijoueur IA

> **Guess That** est une plateforme de jeu de quiz et de blind test en temps réel, propulsée par l'intelligence artificielle **Google Gemini**, avec prise en charge audio YouTube, reconnaissance d'images, salons multijoueurs synchronisés par WebSocket et génération dynamique sur n'importe quel sujet.

---

## ✨ Points Forts & Fonctionnalités

### 🤖 Génération Instantanée par IA (Google Gemini)
- **N'importe quel sujet** : Saisissez un thème (ex. *"Années 80"*, *"Anime & Manga"*, *"Cinéma Français"*, *"Jeux Vidéo Rétro"*, *"Géographie insolite"*) et l'IA génère instantanément un quiz complet de 15 questions calibrées.
- **Extraction Multimédia** : Recherche automatique de pistes sonores YouTube, d'illustrations et d'indices sonores text-to-speech.
- **Niveaux de Difficulté** : Facile, Moyen, Difficile, ou mode Expert.

### 👥 Multijoueur en Temps Réel (WebSocket)
- **Création de Salon & Partage Facile** : Code de salle court (ex. `ABCD`) et QR Code interactif pour rejoindre instantanément depuis un smartphone.
- **Synchronisation Parfaite** : Décompte synchronisé, affichage simultané des questions et révélations en direct.
- **Réactions & Emojis en direct** : Envoyez des flammes 🔥, des rires 😂 ou des applaudissements 👏 pendant la partie.
- **Enchaînement Continu** : À la fin de la partie, l'hôte peut saisir un nouveau sujet pour relancer directement un match avec les mêmes joueurs sans recréer de salon.

### 🎮 Modes de Jeu Variés
- **🎵 Blind Test Audio** : Écoutez un extrait musical ou sonore et devinez le titre, l'artiste ou la provenance.
- **🖼️ Quiz Visuel** : Identifiez une image, une affiche de film, un lieu ou une célébrité.
- **🧠 QCM & Culture Générale** : 4 choix de réponse, calcul de points basé sur la rapidité et séries de victoires (*streaks*).
- **🕹️ Mode Solo & Mode Entraînement** : Jouez seul pour battre votre meilleur score personnel.

### 🔊 Immersion Sonore & Visuelle
- **Moteur Audio Web Audio API** : Effets sonores procéduraux (buzzer, bonne réponse, compte à rebours sous tension, victoire).
- **Lecteur Audio/Vidéo discret** : Intégration YouTube synchronisée avec contrôle du volume.
- **Animations Fluides** : Interface moderne conçue avec React, Tailwind CSS et Motion (Framer Motion).
- **Podium & Statistiques** : Récapitulatif détaillé en fin de partie avec podium animé et confettis.

---

## 🛠️ Stack Technique

- **Frontend** :
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/) pour un design moderne et responsive
  - [Motion (Framer Motion)](https://motion.dev/) pour les transitions et animations
  - [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) pour les célébrations de fin de partie
  - [Lucide React](https://lucide.dev/) pour les icônes

- **Backend & Temps Réel** :
  - [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
  - [WebSockets (ws)](https://github.com/websockets/ws) pour le multijoueur bidirectionnel à faible latence
  - [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini SDK) pour la génération de contenu par IA
  - `yt-search` & `google-tts-api` pour les indices sonores et extraits audio

---

## 🚀 Démarrage Rapide

### 1. Prérequis
- [Node.js](https://nodejs.org/) version 18 ou supérieure
- Un gestionnaire de paquets (`npm`, `pnpm` ou `yarn`)
- Une clé API Google Gemini ([Google AI Studio](https://aistudio.google.com/))

### 2. Installation

Clonez le dépôt :
```bash
git clone https://github.com/votre-nom-utilisateur/guess-that.git
cd guess-that
```

Installez les dépendances :
```bash
npm install
```

### 3. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet (en vous basant sur `.env.example`) :
```env
# Clé API Google Gemini (obligatoire pour la génération IA de quiz)
GEMINI_API_KEY="votre_cle_api_gemini"

# Port d'écoute du serveur (optionnel, 3000 par défaut)
PORT=3000
```

### 4. Lancer l'application

#### Mode Développement :
```bash
npm run dev
```

#### Mode Production (Build & Start) :
```bash
npm run build
npm start
```

L'application et le serveur WebSocket seront accessibles sur `http://localhost:3000` (ou le port défini dans votre variable `PORT`).

---

## 🌐 Déploiement & Hébergement Indépendant

Le projet est **100% autonome** et peut être déployé sur n'importe quel serveur ou hébergeur de votre choix.

### Option A : Déploiement avec Docker (Recommandé)

1. **Construire l'image Docker :**
```bash
docker build -t guess-that .
```

2. **Lancer le conteneur avec votre clé API Gemini :**
```bash
docker run -d \
  -p 3000:3000 \
  -e GEMINI_API_KEY="votre_cle_api_gemini" \
  -e PORT=3000 \
  --name guess-that-app \
  guess-that
```

### Option B : Déploiement sur un VPS (Ubuntu / Debian avec PM2)

1. **Installer Node.js & PM2 :**
```bash
sudo apt update && sudo apt install -y nodejs npm
sudo npm install -g pm2
```

2. **Cloner et préparer le projet :**
```bash
git clone https://github.com/votre-nom-utilisateur/guess-that.git
cd guess-that
npm install
npm run build
```

3. **Créer le fichier `.env` avec votre clé API :**
```bash
echo 'GEMINI_API_KEY="votre_cle_api_gemini"' > .env
```

4. **Démarrer le serveur avec PM2 :**
```bash
pm2 start dist/server.js --name "guess-that"
pm2 save
pm2 startup
```

### Option C : Hébergeurs Cloud (Render, Railway, Fly.io, etc.)

- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm start`
- **Environment Variables** :
  - `GEMINI_API_KEY` = *Votre clé API Google Gemini*
  - `NODE_ENV` = `production`

---

## 📦 Scripts Disponibles

| Commande | Description |
| :--- | :--- |
| `npm run dev` | Démarre le serveur Express et Vite en mode développement |
| `npm run build` | Compile le frontend React et bundle le serveur pour la production |
| `npm run start` | Lance le serveur de production compilé |
| `npm run lint` | Vérifie la conformité TypeScript (`tsc --noEmit`) |

---

## 📁 Architecture du Projet

```text
guess-that/
├── public/                 # Fichiers statiques et sons
├── src/
│   ├── components/         # Composants d'interface utilisateur
│   │   ├── AudioCluePlayer.tsx       # Lecteur audio et YouTube
│   │   ├── JoinRoomModal.tsx         # Modal pour rejoindre un salon (code/QR)
│   │   ├── MultiplayerLobby.tsx      # Salle d'attente multijoueur
│   │   ├── MultiplayerResultsView.tsx # Podium et fin de partie
│   │   ├── QuestionCard.tsx          # Carte d'affichage des questions & options
│   │   └── ScoreBoard.tsx            # Tableau des scores en temps réel
│   ├── services/           # Services API et WebSocket
│   │   ├── multiplayerService.ts     # Client WebSocket pour le multijoueur
│   │   └── soundEngine.ts            # Moteur d'effets sonores Web Audio
│   ├── types.ts            # Types TypeScript partagés
│   ├── App.tsx             # Composant racine et gestion des états de jeu
│   ├── main.tsx            # Point d'entrée React
│   └── index.css           # Styles Tailwind CSS
├── server.ts               # Serveur Express, endpoints API Gemini et serveur WebSocket
├── package.json
└── README.md
```

---

## 🎯 Comment Jouer

1. **Créer une partie (Hôte)** :
   - Choisissez un thème ou laissez l'IA vous proposer des idées.
   - Sélectionnez la difficulté et le mode de jeu.
   - Partagez le code de salon ou faites scanner le QR Code à vos amis.
2. **Rejoindre une partie (Joueurs)** :
   - Rendez-vous sur l'application, cliquez sur **Rejoindre**, saisissez votre pseudo et entrez le code de la salle.
3. **Pendant la partie** :
   - Répondez aux questions le plus vite possible pour accumuler un maximum de points et faire grimper votre streak !
4. **Fin de partie & Revanche** :
   - Découvrez le classement final sur le podium.
   - L'hôte peut immédiatement entrer un nouveau sujet pour relancer une partie sans que personne n'ait besoin de se reconnecter.

---

## 📄 Licence

Ce projet est sous licence MIT. N'hésitez pas à l'utiliser, le modifier et y contribuer !
