import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, setDoc, deleteDoc, 
  onSnapshot, getDocs, Firestore 
} from 'firebase/firestore';
import { Game, NewsArticle } from '../types';
import { INITIAL_GAMES, INITIAL_NEWS } from '../data/mockData';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

// Default built-in Firebase project configuration (can be overridden via Admin UI or .env)
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyAKyMX3wQZPIPEFSh2e3eGAF61-acVFs6s",
  authDomain: "info-game-uz.firebaseapp.com",
  projectId: "info-game-uz",
  storageBucket: "info-game-uz.firebasestorage.app",
  messagingSenderId: "783025127746",
  appId: "1:783025127746:web:f49605d1164c7eeba948db"
};

// 1. Get configuration either from localStorage (set via Admin UI), from Vite env, or fallback to DEFAULT
export const getActiveFirebaseConfig = (): FirebaseConfig | null => {
  const localSaved = localStorage.getItem('info_game_firebase_config');
  if (localSaved) {
    try {
      const parsed = JSON.parse(localSaved);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    } catch (e) {
      // ignore
    }
  }

  // Check Vite env variables if provided
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
  }

  // Return default Firebase project configuration
  return DEFAULT_FIREBASE_CONFIG;
};

let dbInstance: Firestore | null = null;

export const initFirebase = (): Firestore | null => {
  if (dbInstance) return dbInstance;

  const config = getActiveFirebaseConfig();
  if (!config) return null;

  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.warn("Firebase initialization error:", err);
    return null;
  }
};

export const isFirebaseActive = (): boolean => {
  return initFirebase() !== null;
};

// ----------------------------------------------------
// Firestore Sync Services
// ----------------------------------------------------
export const syncGamesFromFirestore = (onData: (games: Game[]) => void) => {
  const db = initFirebase();
  if (!db) return () => {};

  const gamesRef = collection(db, 'games');
  return onSnapshot(gamesRef, (snapshot) => {
    if (snapshot.empty) {
      // First time database is opened: seed with INITIAL_GAMES
      INITIAL_GAMES.forEach((g) => {
        setDoc(doc(db, 'games', g.id), g).catch(console.error);
      });
      onData(INITIAL_GAMES);
    } else {
      const items: Game[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Game);
      });
      onData(items);
    }
  }, (err) => {
    console.error("Firestore Games sync error:", err);
  });
};

export const syncNewsFromFirestore = (onData: (news: NewsArticle[]) => void) => {
  const db = initFirebase();
  if (!db) return () => {};

  const newsRef = collection(db, 'news');
  return onSnapshot(newsRef, (snapshot) => {
    const items: NewsArticle[] = [];
    snapshot.forEach((docSnap) => {
      items.push(docSnap.data() as NewsArticle);
    });
    // Sort news by date descending
    items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    onData(items);
  }, (err) => {
    console.error("Firestore News sync error:", err);
  });
};

export const saveGameToFirestore = async (game: Game) => {
  const db = initFirebase();
  if (!db) return;
  await setDoc(doc(db, 'games', game.id), game);
};

export const deleteGameFromFirestore = async (gameId: string) => {
  const db = initFirebase();
  if (!db) return;
  await deleteDoc(doc(db, 'games', gameId));
};

export const saveNewsToFirestore = async (article: NewsArticle) => {
  const db = initFirebase();
  if (!db) return;
  const cleanData: Record<string, any> = {};
  for (const [key, value] of Object.entries(article)) {
    if (value !== undefined) {
      cleanData[key] = value;
    }
  }
  // If videoUrl was removed or empty, save as empty string so Firestore updates
  cleanData.videoUrl = article.videoUrl || '';
  await setDoc(doc(db, 'news', article.id), cleanData);
};

export const deleteNewsFromFirestore = async (articleId: string) => {
  const db = initFirebase();
  if (!db) return;
  await deleteDoc(doc(db, 'news', articleId));
};
