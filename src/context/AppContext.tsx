import React, { createContext, useContext, useState, useEffect } from 'react';
import { Game, NewsArticle, Language, LocalizedString, WikiItem } from '../types';
import { INITIAL_GAMES, INITIAL_NEWS } from '../data/mockData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  games: Game[];
  news: NewsArticle[];
  selectedGameId: string;
  setSelectedGameId: (id: string) => void;
  getGame: (id: string) => Game | undefined;
  addGame: (newGame: Partial<Game>) => void;
  addNews: (newArticle: Partial<NewsArticle>) => void;
  addWikiItem: (gameId: string, item: WikiItem) => void;
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

  useEffect(() => {
    localStorage.setItem('info_game_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('info_game_games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('info_game_news', JSON.stringify(news));
  }, [news]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const getGame = (id: string) => {
    return games.find((g) => g.id.toLowerCase() === id.toLowerCase());
  };

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
      categories: newGame.categories || [
        { id: 'general', name: { uz: 'Umumiy Ma\'lumotlar', ru: 'Общая информация', en: 'General Info' }, icon: '📖' },
        { id: 'items', name: { uz: 'Buyumlar va Resurslar', ru: 'Предметы и Ресурсы', en: 'Items & Resources' }, icon: '🎒' }
      ],
      items: newGame.items || [],
    };

    setGames((prev) => [fullGame, ...prev]);
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
    };

    setNews((prev) => [article, ...prev]);
  };

  const addWikiItem = (gameId: string, item: WikiItem) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          return {
            ...g,
            items: [...g.items, item],
          };
        }
        return g;
      })
    );
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
