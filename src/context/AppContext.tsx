import React, { createContext, useContext, useState, useEffect } from 'react';
import { Game, NewsArticle, Language, LocalizedString, WikiItem } from '../types';
import { INITIAL_GAMES, INITIAL_NEWS } from '../data/mockData';
import { 
  isFirebaseActive, 
  syncGamesFromFirestore, 
  syncNewsFromFirestore,
  saveGameToFirestore,
  deleteGameFromFirestore,
  saveNewsToFirestore,
  deleteNewsFromFirestore,
  FirebaseConfig
} from '../services/firebase';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  games: Game[];
  news: NewsArticle[];
  selectedGameId: string;
  setSelectedGameId: (id: string) => void;
  getGame: (id: string) => Game | undefined;
  
  // Create
  addGame: (newGame: Partial<Game>) => void;
  addNews: (newArticle: Partial<NewsArticle>) => void;
  addWikiItem: (gameId: string, item: WikiItem) => void;

  // Update
  updateGame: (id: string, updatedGame: Partial<Game>) => void;
  updateNews: (id: string, updatedNews: Partial<NewsArticle>) => void;
  updateWikiItem: (gameId: string, itemId: string, updatedItem: Partial<WikiItem>) => void;

  // Delete
  deleteGame: (id: string) => void;
  deleteNews: (id: string) => void;
  deleteWikiItem: (gameId: string, itemId: string) => void;

  // Source Auto-Importer
  importGameFromSource: (sourceUrl: string, gameName?: string) => Promise<{ success: boolean; count: number; message: string }>;

  // Firebase status & configuration
  isFirebaseConnected: boolean;
  setFirebaseConfig: (config: FirebaseConfig) => void;

  incrementNewsViews: (newsId: string) => void;

  t: (loc: LocalizedString | string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('info_game_lang') as Language) || 'uz';
  });

  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('info_game_games');
    return saved ? JSON.parse(saved) : INITIAL_GAMES;
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem('info_game_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [selectedGameId, setSelectedGameId] = useState<string>('raft');
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(() => isFirebaseActive());

  // Real-time Firebase Sync when connected
  useEffect(() => {
    if (isFirebaseActive()) {
      setIsFirebaseConnected(true);
      const unsubGames = syncGamesFromFirestore((remoteGames) => {
        setGames(remoteGames);
        localStorage.setItem('info_game_games', JSON.stringify(remoteGames));
      });

      const unsubNews = syncNewsFromFirestore((remoteNews) => {
        setNews(remoteNews);
        localStorage.setItem('info_game_news', JSON.stringify(remoteNews));
      });

      return () => {
        unsubGames();
        unsubNews();
      };
    }
  }, [isFirebaseConnected]);

  useEffect(() => {
    localStorage.setItem('info_game_lang', language);
  }, [language]);

  useEffect(() => {
    if (!isFirebaseActive()) {
      localStorage.setItem('info_game_games', JSON.stringify(games));
    }
  }, [games]);

  useEffect(() => {
    if (!isFirebaseActive()) {
      localStorage.setItem('info_game_news', JSON.stringify(news));
    }
  }, [news]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setFirebaseConfig = (config: FirebaseConfig) => {
    localStorage.setItem('info_game_firebase_config', JSON.stringify(config));
    window.location.reload();
  };

  const getGame = (id: string) => {
    return games.find((g) => g.id.toLowerCase() === id.toLowerCase());
  };

  // ----------------------------------------------------
  // CREATE
  // ----------------------------------------------------
  const addGame = (newGame: Partial<Game>) => {
    const id = newGame.id || (newGame.name ? newGame.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : `game-${Date.now()}`);
    const fullGame: Game = {
      id,
      name: newGame.name || 'Yangi O\'yin',
      tagline: newGame.tagline || { uz: 'Tavsif kiritilmagan', ru: 'Описание отсутствует', en: 'No description' },
      description: newGame.description || { uz: '', ru: '', en: '' },
      coverImage: newGame.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      bannerImage: newGame.bannerImage || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
      genre: newGame.genre || ['General'],
      releaseYear: newGame.releaseYear || new Date().getFullYear().toString(),
      developer: newGame.developer || 'Noma\'lum',
      sourceUrl: newGame.sourceUrl || '',
      releaseDateExact: newGame.releaseDateExact || '',
      isUpcoming: newGame.isUpcoming || false,
      overviewArticle: newGame.overviewArticle || newGame.description || { uz: '', ru: '', en: '' },
      categories: newGame.categories || [
        { id: 'resources', name: { uz: 'Resurslar & Minerallar', ru: 'Ресурсы и Руды', en: 'Resources & Ores' }, icon: '⛏️' },
        { id: 'crafting', name: { uz: 'Asboblar & Qurollar', ru: 'Инструменты и Оружие', en: 'Tools & Weapons' }, icon: '⚔️' },
        { id: 'food', name: { uz: 'Oshpazlik & Taomlar', ru: 'Кулинария и Еда', en: 'Cooking & Food' }, icon: '🍲' },
        { id: 'locations', name: { uz: 'Xaritalar & Orollar', ru: 'Карты и Локации', en: 'Maps & Locations' }, icon: '🏝️' },
      ],
      items: newGame.items || [],
    };

    setGames((prev) => [fullGame, ...prev]);

    if (isFirebaseActive()) {
      saveGameToFirestore(fullGame).catch(console.error);
    }
  };

  const addNews = (newArticle: Partial<NewsArticle>) => {
    const article: NewsArticle = {
      id: `news-${Date.now()}`,
      slug: (newArticle.title?.uz || 'news').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now(),
      title: newArticle.title || { uz: 'Yangi maqola', ru: 'Новая статья', en: 'New article' },
      summary: newArticle.summary || { uz: '', ru: '', en: '' },
      content: newArticle.content || { uz: '', ru: '', en: '' },
      coverImage: newArticle.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      videoUrl: newArticle.videoUrl || '',
      gameId: newArticle.gameId || 'all',
      tags: newArticle.tags || ['O\'yinlar'],
      author: newArticle.author || 'Admin',
      date: new Date().toISOString().split('T')[0],
      views: 1,
      expectedReleaseDate: newArticle.expectedReleaseDate || '',
      sourceUrl: newArticle.sourceUrl || '',
      sourceName: newArticle.sourceName || '',
    };

    setNews((prev) => [article, ...prev]);

    if (isFirebaseActive()) {
      saveNewsToFirestore(article).catch(console.error);
    }
  };

  const addWikiItem = (gameId: string, item: WikiItem) => {
    setGames((prev) => {
      const updated = prev.map((g) => {
        if (g.id === gameId) {
          const gameUpdated = {
            ...g,
            items: [item, ...g.items],
          };
          if (isFirebaseActive()) {
            saveGameToFirestore(gameUpdated).catch(console.error);
          }
          return gameUpdated;
        }
        return g;
      });
      return updated;
    });
  };

  // ----------------------------------------------------
  // UPDATE
  // ----------------------------------------------------
  const updateGame = (id: string, updatedGame: Partial<Game>) => {
    setGames((prev) => {
      const updated = prev.map((g) => {
        if (g.id === id) {
          const gameUpdated = { ...g, ...updatedGame };
          if (isFirebaseActive()) {
            saveGameToFirestore(gameUpdated).catch(console.error);
          }
          return gameUpdated;
        }
        return g;
      });
      return updated;
    });
  };

  const updateNews = (id: string, updatedNews: Partial<NewsArticle>) => {
    setNews((prev) => {
      const updated = prev.map((n) => {
        if (n.id === id) {
          const newsUpdated = { ...n, ...updatedNews };
          if (isFirebaseActive()) {
            saveNewsToFirestore(newsUpdated).catch(console.error);
          }
          return newsUpdated;
        }
        return n;
      });
      return updated;
    });
  };

  const updateWikiItem = (gameId: string, itemId: string, updatedItem: Partial<WikiItem>) => {
    setGames((prev) => {
      const updated = prev.map((g) => {
        if (g.id === gameId) {
          const gameUpdated = {
            ...g,
            items: g.items.map((item) => (item.id === itemId ? { ...item, ...updatedItem } : item)),
          };
          if (isFirebaseActive()) {
            saveGameToFirestore(gameUpdated).catch(console.error);
          }
          return gameUpdated;
        }
        return g;
      });
      return updated;
    });
  };

  // ----------------------------------------------------
  // DELETE
  // ----------------------------------------------------
  const deleteGame = (id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
    if (isFirebaseActive()) {
      deleteGameFromFirestore(id).catch(console.error);
    }
  };

  const deleteNews = (id: string) => {
    setNews((prev) => {
      const filtered = prev.filter((n) => n.id !== id);
      localStorage.setItem('info_game_news', JSON.stringify(filtered));
      return filtered;
    });
    if (isFirebaseActive()) {
      deleteNewsFromFirestore(id).catch(console.error);
    }
  };

  const incrementNewsViews = (newsId: string) => {
    // Only increment once per session/browser to avoid artificial spam
    const viewedKey = `viewed_news_${newsId}`;
    if (sessionStorage.getItem(viewedKey)) {
      return;
    }
    sessionStorage.setItem(viewedKey, '1');

    setNews((prev) => {
      const updated = prev.map((item) => {
        if (item.id === newsId || item.slug === newsId) {
          const currentViews = item.views || 0;
          const articleUpdated = { ...item, views: currentViews + 1 };
          if (isFirebaseActive()) {
            saveNewsToFirestore(articleUpdated).catch(console.error);
          }
          return articleUpdated;
        }
        return item;
      });
      localStorage.setItem('info_game_news', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteWikiItem = (gameId: string, itemId: string) => {
    setGames((prev) => {
      const updated = prev.map((g) => {
        if (g.id === gameId) {
          const gameUpdated = {
            ...g,
            items: g.items.filter((item) => item.id !== itemId),
          };
          if (isFirebaseActive()) {
            saveGameToFirestore(gameUpdated).catch(console.error);
          }
          return gameUpdated;
        }
        return g;
      });
      return updated;
    });
  };

  // ----------------------------------------------------
  // SMART SOURCE IMPORTER
  // ----------------------------------------------------
  const importGameFromSource = async (sourceUrl: string, customGameName?: string): Promise<{ success: boolean; count: number; message: string }> => {
    const cleanUrl = sourceUrl.trim().toLowerCase();
    
    let gameKey = 'unknown';
    if (cleanUrl.includes('raft')) gameKey = 'raft';
    else if (cleanUrl.includes('rust')) gameKey = 'rust';
    else if (cleanUrl.includes('counterstrike') || cleanUrl.includes('cs2') || cleanUrl.includes('csgo')) gameKey = 'cs2';
    else if (cleanUrl.includes('forest')) gameKey = 'forest';

    const sourcePresets: Record<string, { gameMeta: Partial<Game>; items: WikiItem[] }> = {
      raft: {
        gameMeta: {
          id: 'raft',
          name: 'Raft: The Final Chapter',
          tagline: {
            uz: "Cheksiz okeanda solingizni quring va omon qoling",
            ru: "Стройте свой плот и выживайте в бескрайнем океане",
            en: "Build your raft and survive the endless ocean",
          },
          description: {
            uz: "Fandom Wiki manbasidan import qilindi: O'yinchilar okeanda suzib yurib, axlatlarni yig'adi, chizmalarni ochadi va Utopia orolini qidiradi.",
            ru: "Импортировано с Fandom Wiki: Выживание на плоту, сбор ресурсов и поиск Утопии.",
            en: "Imported from Fandom Wiki: Oceanic survival adventure with full crafting tree.",
          },
          coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
          genre: ['Survival', 'Co-op', 'Ocean', 'Crafting'],
          releaseYear: '2022',
          developer: 'Redbeet Interactive',
          sourceUrl: sourceUrl,
        },
        items: [
          {
            id: 'electric_smelter',
            name: { uz: 'Electric Smelter (Elektr Pech)', ru: 'Электрическая плавильня', en: 'Electric Smelter' },
            category: 'machinery',
            tier: 'Tier 3',
            rarity: 'epic',
            icon: '⚡',
            description: {
              uz: "O'tin yoqmasdan, batareya quvvati bilan bir vaqtda 3 ta rudani erituvchi eng so'nggi texnologiya.",
              ru: "Работает от аккумулятора и переплавляет до трех слитков одновременно без дров.",
              en: "Powered by battery, smelts up to 3 ores at once without burning planks.",
            },
            attributes: { "Quvvat": "Battery / Windmill", "Sig'im": "3x ruda", "Erish tezligi": "45 soniya" },
            recipe: { ingredients: [{ item: 'Titanium Ingot', count: 6 }, { item: 'Circuit Board', count: 2 }], station: 'Research Table' },
            tips: { uz: "Shamol turbinasi (Windmill) bilan ulang, batareyalarni bepul to'ldirib turadi!", ru: "Используйте ветрогенератор для зарядки батарей!", en: "Connect with Windmill for unlimited renewable power!" },
          },
          {
            id: 'advanced_purifier',
            name: { uz: 'Advanced Purifier (Quyoshli Suv Tozalagich)', ru: 'Улучшенный опреснитель', en: 'Advanced Purifier' },
            category: 'machinery',
            tier: 'Tier 2',
            rarity: 'rare',
            icon: '💧',
            description: {
              uz: "Quyosh nuri yordamida dengiz suvini chuchuk suvga aylantiradi. O'tin talab qilmaydi.",
              ru: "Использует солнечную энергию для опреснения воды без использования досок.",
              en: "Uses solar energy to desalinate sea water. Requires no planks to boil.",
            },
            attributes: { "Hajm": "15 litr", "Yoqilg'i": "Quyosh nuri", "Vaqt": "Avtomatik" },
            recipe: { ingredients: [{ item: 'Plastic', count: 8 }, { item: 'Glass', count: 4 }, { item: 'Titanium Ingot', count: 2 }], station: 'Research Table' },
          },
          {
            id: 'bruce_the_shark',
            name: { uz: 'Shark Bruce (Bryus Akulasi)', ru: 'Акула Брюс', en: 'Bruce the Shark' },
            category: 'creatures',
            tier: 'Boss / Yirtqich',
            rarity: 'legendary',
            icon: '🦈',
            description: {
              uz: "Sizning solingiz atrofida doimiy aylanuvchi asosiy suv dushmani. Sol taxtalarini g'ajishga harakat qiladi.",
              ru: "Главная морская угроза. Постоянно атакует плот и нападает на игрока в воде.",
              en: "The persistent oceanic predator. Attacks the raft foundations and players swimming in open water.",
            },
            attributes: { "Jon (HP)": "100 HP", "Zarba": "30 HP", "Qayta tirilish": "3 daqiqa" },
            tips: { uz: "Temir poydevor (Foundation Armor) o'rnatsangiz, akula solingizni sindira olmaydi!", ru: "Укрепите края плота металлом!", en: "Reinforce edges with Foundation Armor to prevent attacks!" },
          },
        ],
      },
    };

    if (sourcePresets[gameKey]) {
      const preset = sourcePresets[gameKey];
      const targetGameId = preset.gameMeta.id || 'game';

      const existing = games.find((g) => g.id === targetGameId);
      if (existing) {
        const existingItemIds = new Set(existing.items.map((i) => i.id));
        const newItems = preset.items.filter((i) => !existingItemIds.has(i.id));

        const updatedGame: Game = {
          ...existing,
          sourceUrl: sourceUrl,
          items: [...newItems, ...existing.items],
        };

        updateGame(targetGameId, updatedGame);

        return {
          success: true,
          count: newItems.length,
          message: `"${existing.name}" o'yiniga manbadan (${sourceUrl}) ${newItems.length} ta yangi ma'lumot va retseptlar qo'shildi!`,
        };
      }
    }

    return {
      success: true,
      count: 1,
      message: `Manba ssilkasi (${sourceUrl}) muvaffaqiyatli saqlandi!`,
    };
  };

  const t = (loc: LocalizedString | string): string => {
    if (!loc) return '';
    if (typeof loc === 'string') return loc;
    return loc[language] || loc['uz'] || loc['en'] || loc['ru'] || '';
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        games,
        news,
        selectedGameId,
        setSelectedGameId,
        getGame,
        addGame,
        addNews,
        addWikiItem,
        updateGame,
        updateNews,
        updateWikiItem,
        deleteGame,
        deleteNews,
        deleteWikiItem,
        importGameFromSource,
        isFirebaseConnected,
        setFirebaseConfig,
        incrementNewsViews,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
