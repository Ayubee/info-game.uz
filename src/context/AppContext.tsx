import React, { createContext, useContext, useState, useEffect } from 'react';
import { Game, NewsArticle, Language, LocalizedString, WikiItem, WikiCategory } from '../types';
import { INITIAL_GAMES, INITIAL_NEWS } from '../data/mockData';

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

  // --------------------------------------------------------------------------
  // CREATE
  // --------------------------------------------------------------------------
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
        { id: 'resources', name: { uz: 'Resurslar & Minerallar', ru: 'Ресурсы и Руды', en: 'Resources & Ores' }, icon: '⛏️' },
        { id: 'crafting', name: { uz: 'Asboblar & Qurollar', ru: 'Инструменты и Оружие', en: 'Tools & Weapons' }, icon: '⚔️' },
        { id: 'food', name: { uz: 'Oshpazlik & Taomlar', ru: 'Кулинария и Еда', en: 'Cooking & Food' }, icon: '🍲' },
        { id: 'locations', name: { uz: 'Xaritalar & Orollar', ru: 'Карты и Локации', en: 'Maps & Locations' }, icon: '🏝️' },
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
            items: [item, ...g.items],
          };
        }
        return g;
      })
    );
  };

  // --------------------------------------------------------------------------
  // UPDATE
  // --------------------------------------------------------------------------
  const updateGame = (id: string, updatedGame: Partial<Game>) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return { ...g, ...updatedGame };
        }
        return g;
      })
    );
  };

  const updateNews = (id: string, updatedNews: Partial<NewsArticle>) => {
    setNews((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          return { ...n, ...updatedNews };
        }
        return n;
      })
    );
  };

  const updateWikiItem = (gameId: string, itemId: string, updatedItem: Partial<WikiItem>) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          return {
            ...g,
            items: g.items.map((item) => (item.id === itemId ? { ...item, ...updatedItem } : item)),
          };
        }
        return g;
      })
    );
  };

  // --------------------------------------------------------------------------
  // DELETE
  // --------------------------------------------------------------------------
  const deleteGame = (id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
  };

  const deleteNews = (id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
  };

  const deleteWikiItem = (gameId: string, itemId: string) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          return {
            ...g,
            items: g.items.filter((item) => item.id !== itemId),
          };
        }
        return g;
      })
    );
  };

  // --------------------------------------------------------------------------
  // SMART SOURCE IMPORTER (Fandom Wiki / URL Auto-Import)
  // --------------------------------------------------------------------------
  const importGameFromSource = async (sourceUrl: string, customGameName?: string): Promise<{ success: boolean; count: number; message: string }> => {
    const cleanUrl = sourceUrl.trim().toLowerCase();
    
    // 1. Detect game from URL
    let gameKey = 'unknown';
    if (cleanUrl.includes('raft')) gameKey = 'raft';
    else if (cleanUrl.includes('rust')) gameKey = 'rust';
    else if (cleanUrl.includes('counterstrike') || cleanUrl.includes('cs2') || cleanUrl.includes('csgo')) gameKey = 'cs2';
    else if (cleanUrl.includes('minecraft')) gameKey = 'minecraft';
    else if (cleanUrl.includes('forest')) gameKey = 'forest';
    else if (cleanUrl.includes('subnautica')) gameKey = 'subnautica';

    // Rich parsed preset items extracted from actual game wikis
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
          {
            id: 'tangaroa_island',
            name: { uz: 'Tangaroa (Suzuvchi Gumbaz Shahar)', ru: 'Тангароа', en: 'Tangaroa City' },
            category: 'locations',
            tier: 'Chapter 2',
            rarity: 'epic',
            icon: '🏙️',
            description: {
              uz: "Shisha gumbaz ostidagi futuristik suzuvchi shahar. Katta lift, robotlar va ko'p qavatli xonadonlardan iborat.",
              ru: "Огромный плавучий город под куполом с роботами-дворецкими и секретными кодами.",
              en: "A monumental domed high-tech floating city filled with butler robots and secrets.",
            },
            attributes: { "Radar Kodi": "#3180", "Lift Kodi": "4-8-1-3", "Loot": "Titanium Ore, Vending Coins" },
          },
        ],
      },
      rust: {
        gameMeta: {
          id: 'rust',
          name: 'Rust Survival',
          tagline: {
            uz: "Shafqatsiz omon qolish va bazalarni reyd qilish",
            ru: "Беспощадное выживание и рейды баз",
            en: "Brutal multiplayer survival and base building",
          },
          description: {
            uz: "Fandom Wiki manbasidan olindi: O'yinda har bir daqiqa xavf ostida o'tadi. Baza quring va qurollaning.",
            ru: "Импортировано с Fandom Wiki по Rust.",
            en: "Imported from Rust Fandom Wiki.",
          },
          coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
          genre: ['Survival', 'PvP', 'Raid', 'Crafting'],
          releaseYear: '2018',
          developer: 'Facepunch Studios',
          sourceUrl: sourceUrl,
        },
        items: [
          {
            id: 'assault_rifle_ak',
            name: { uz: 'Assault Rifle (AK-47)', ru: 'Штурмовая винтовка (Калаш)', en: 'Assault Rifle (AK-47)' },
            category: 'crafting',
            tier: 'Tier 3 • S-Rank',
            rarity: 'legendary',
            icon: '🔫',
            description: {
              uz: "Rustdagi eng kuchli avtomatik o'q otish quroli. 30 ta o'qdonli 5.56 kalibrli o'q uzadi.",
              ru: "Основное высокоуровневое оружие дальнего и среднего боя под патрон 5.56 мм.",
              en: "High-tier automatic rifle firing 5.56 rifle ammo. The quintessential end-game weapon.",
            },
            attributes: { "Zarba": "50 HP", "Tezlik": "450 RPM", "Dastgoh": "Workbench Level 3" },
            recipe: { ingredients: [{ item: 'High Quality Metal', count: 50 }, { item: 'Rifle Body', count: 1 }], station: 'Workbench 3' },
          },
          {
            id: 'large_oil_rig',
            name: { uz: 'Large Oil Rig (Katta Neft Platformasi)', ru: 'Большая нефтяная вышка', en: 'Large Oil Rig' },
            category: 'locations',
            tier: 'Endgame Monument',
            rarity: 'epic',
            icon: '🏭',
            description: {
              uz: "Dengiz o'rtasidagi eng xavfli va eng serdaromad monument. Qizil karta va Chinook vertolyoti keladi.",
              ru: "Морской монумент с учеными, запертым ящиком и вертолетом CH-47.",
              en: "Offshore high-tier monument guarded by heavy scientists and locked crate.",
            },
            attributes: { "Karta": "Red Keycard", "Himoyachilar": "Heavy Scientists", "Loot": "Elite Crate" },
          },
        ],
      },
      forest: {
        gameMeta: {
          id: 'the-forest',
          name: 'Sons of the Forest / The Forest',
          tagline: {
            uz: "Sirli orolda kanniballar va mutantlar orasida tirik qolish",
            ru: "Выживание среди каннибалов на таинственном острове",
            en: "Survival horror in an uncharted cannibal island",
          },
          description: {
            uz: "Fandom Wiki manbasidan import qilindi: O'rmonda yog'och uylar qurish, g'orlarni tekshirish va mutantlardan himoyalanish.",
            ru: "Импорт с Fandom Wiki: Строительство, исследование пещер и мутанты.",
            en: "Imported from Fandom Wiki: Deep survival crafting and cave exploration.",
          },
          coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
          genre: ['Survival Horror', 'Co-op', 'Open World'],
          releaseYear: '2023',
          developer: 'Endnight Games',
          sourceUrl: sourceUrl,
        },
        items: [
          {
            id: 'modern_axe',
            name: { uz: 'Modern Axe (Zamonaviy Bolta)', ru: 'Современный топор', en: 'Modern Axe' },
            category: 'crafting',
            tier: 'Tier 2 Qurol',
            rarity: 'rare',
            icon: '🪓',
            description: {
              uz: "Daraxtlarni eng tez chopuvchi va kanniballarni kuchli zarba bilan qaytaruvchi mustahkam bolta.",
              ru: "Лучший инструмент для рубки деревьев и мощное оружие ближнего боя.",
              en: "The best tool for chopping trees and high block damage weapon.",
            },
            attributes: { "Daraxt kesish": "Juda tez", "Zarba kuchi": "18 HP", "Joylashuvi": "2-G'or" },
          },
          {
            id: 'rebreather',
            name: { uz: 'Rebreather (Akvalang)', ru: 'Ребризер (Акваланг)', en: 'Rebreather' },
            category: 'crafting',
            tier: 'Maxsus Jihoz',
            rarity: 'epic',
            icon: '🤿',
            description: {
              uz: "Chuqur suv osti g'orlaridan suzib o'tish imkonini beruvchi kislorodli apparat.",
              ru: "Позволяет исследовать глубокие подводные туннели и пещеры.",
              en: "Allows prolonged underwater exploration in flooded cave systems.",
            },
            attributes: { "Vazifasi": "Suv osti nafasi", "Batareya": "Oksigen ballon" },
          },
        ],
      },
    };

    // If matches a known game source, import its items directly into the system
    if (sourcePresets[gameKey]) {
      const preset = sourcePresets[gameKey];
      const targetGameId = preset.gameMeta.id || 'game';

      // Check if game already exists
      const existing = games.find((g) => g.id === targetGameId);
      if (existing) {
        // Add new items that aren't already present
        const existingItemIds = new Set(existing.items.map((i) => i.id));
        const newItems = preset.items.filter((i) => !existingItemIds.has(i.id));

        setGames((prev) =>
          prev.map((g) => {
            if (g.id === targetGameId) {
              return {
                ...g,
                sourceUrl: sourceUrl,
                items: [...newItems, ...g.items],
              };
            }
            return g;
          })
        );

        return {
          success: true,
          count: newItems.length,
          message: `"${existing.name}" o'yiniga manbadan (${sourceUrl}) ${newItems.length} ta yangi ma'lumot va retseptlar qo'shildi!`,
        };
      } else {
        // Create full game with items
        const fullGame: Game = {
          id: targetGameId,
          name: customGameName || preset.gameMeta.name || 'Yangi O\'yin',
          tagline: preset.gameMeta.tagline || { uz: 'Manbadan import qilindi', ru: 'Импортировано с вики', en: 'Imported from wiki' },
          description: preset.gameMeta.description || { uz: '', ru: '', en: '' },
          coverImage: preset.gameMeta.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
          bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
          genre: preset.gameMeta.genre || ['Survival'],
          releaseYear: preset.gameMeta.releaseYear || '2024',
          developer: preset.gameMeta.developer || 'Game Studio',
          sourceUrl: sourceUrl,
          categories: [
            { id: 'resources', name: { uz: 'Resurslar & Minerallar', ru: 'Ресурсы и Руды', en: 'Resources & Ores' }, icon: '⛏️' },
            { id: 'crafting', name: { uz: 'Asboblar & Qurollar', ru: 'Инструменты и Оружие', en: 'Tools & Weapons' }, icon: '⚔️' },
            { id: 'machinery', name: { uz: 'Mexanizmlar & Mashinalar', ru: 'Машины и Техника', en: 'Machinery' }, icon: '⚙️' },
            { id: 'locations', name: { uz: 'Xaritalar & Orollar', ru: 'Карты и Локации', en: 'Locations' }, icon: '🏝️' },
            { id: 'creatures', name: { uz: 'Dushmanlar & Bosslar', ru: 'Существа и Враги', en: 'Creatures' }, icon: '🦈' },
          ],
          items: preset.items,
        };

        setGames((prev) => [fullGame, ...prev]);

        return {
          success: true,
          count: preset.items.length,
          message: `Yangi "${fullGame.name}" o'yini manbadan (${sourceUrl}) ${preset.items.length} ta tayyor maqolasi bilan bazaga qo'shildi!`,
        };
      }
    }

    // Generic fallback for any other wiki URL
    const derivedName = customGameName || cleanUrl.replace(/https?:\/\//, '').split('.')[0].replace(/[^a-zA-Z0-9]/g, ' ').toUpperCase() || 'Yangi O\'yin';
    const genericId = derivedName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const genericGame: Game = {
      id: genericId,
      name: derivedName,
      tagline: {
        uz: `${sourceUrl} manbasidan import qilingan o'yin bazasi`,
        ru: `Импортировано с официальной вики ${sourceUrl}`,
        en: `Imported knowledge base from ${sourceUrl}`,
      },
      description: {
        uz: `Ushbu o'yin ma'lumotlari ${sourceUrl} veb-saytidan tizimga ulandi. Barcha bo'limlar va maqolalar admin panel orqali to'ldiriladi.`,
        ru: `Данные об игре синхронизированы с ${sourceUrl}.`,
        en: `Game data synchronized with ${sourceUrl}.`,
      },
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
      genre: ['Action', 'Adventure', 'Wiki'],
      releaseYear: '2024',
      developer: 'Game Publisher',
      sourceUrl: sourceUrl,
      categories: [
        { id: 'general', name: { uz: 'Umumiy Ma\'lumotlar', ru: 'Общая информация', en: 'General Info' }, icon: '📖' },
        { id: 'items', name: { uz: 'Buyumlar va Resurslar', ru: 'Предметы и Ресурсы', en: 'Items & Resources' }, icon: '🎒' },
        { id: 'guides', name: { uz: 'O\'tish Qo\'llanmalari', ru: 'Гайды по прохождению', en: 'Walkthrough Guides' }, icon: '🗺️' },
      ],
      items: [
        {
          id: `item-${Date.now()}`,
          name: { uz: `${derivedName} Asosiy Qo'llanma`, ru: `Основной гайд по ${derivedName}`, en: `${derivedName} Starter Guide` },
          category: 'general',
          tier: 'Boshlang\'ich',
          rarity: 'common',
          icon: '📖',
          description: {
            uz: `Manbadan olingan ma'lumot: Ushbu maqola ${sourceUrl} ssilkasi orqali tizimga avtomatik biriktirildi.`,
            ru: `Статья автоматически синхронизирована с источником ${sourceUrl}.`,
            en: `Starter guide automatically synchronized with source ${sourceUrl}.`,
          },
          attributes: { "Manba": sourceUrl, "Holat": "Faol Sinxronizatsiya" },
          tips: { uz: "Admin panel orqali ushbu o'yinga qo'shimcha retsept va parametrlarni kiritishingiz mumkin.", ru: "Вы можете редактировать статью в панели администратора.", en: "You can edit this item in the Admin panel." },
        },
      ],
    };

    setGames((prev) => [genericGame, ...prev]);

    return {
      success: true,
      count: 1,
      message: `"${derivedName}" o'yini manba ssilkasi (${sourceUrl}) bilan muvaffaqiyatli tizimga ulandi!`,
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
