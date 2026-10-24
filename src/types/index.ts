export type Language = 'uz' | 'ru' | 'en';

export interface LocalizedString {
  uz: string;
  ru: string;
  en: string;
}

export interface WikiItem {
  id: string;
  name: LocalizedString;
  category: string; // e.g. "resources", "crafting", "locations", "creatures", "weapons", "maps"
  tier?: string;
  description: LocalizedString;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  attributes?: Record<string, string | number>;
  recipe?: {
    ingredients: Array<{ item: string; count: number }>;
    station?: string;
    craftTime?: string;
  };
  tips?: LocalizedString;
  location?: string;
}

export interface WikiCategory {
  id: string;
  name: LocalizedString;
  icon: string;
  count?: number;
}

export interface Game {
  id: string;
  name: string;
  tagline: LocalizedString;
  description: LocalizedString;
  coverImage: string;
  bannerImage: string;
  genre: string[];
  releaseYear: string;
  developer: string;
  sourceUrl?: string; // e.g. https://raft.fandom.com
  active?: boolean;
  categories: WikiCategory[];
  items: WikiItem[];
  releaseDateExact?: string; // e.g. "Kuz 2025" or exact date
  isUpcoming?: boolean; // Chiqishi kutilayotgan o'yin
  overviewArticle?: LocalizedString; // Ensiklopediya sahifasida chiqadigan umumiy katta maqola/sharh
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: LocalizedString;
  summary: LocalizedString;
  content: LocalizedString;
  coverImage: string;
  videoUrl?: string; // YouTube or video embed URL
  gameId?: string; // Related game or "all"
  tags: string[];
  author: string;
  date: string;
  views: number;
  expectedReleaseDate?: string; // Yangilikda o'yinning kutilayotgan reliz sanasi (ixtiyoriy)
}
