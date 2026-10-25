import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, PlusCircle, Gamepad2, Newspaper, Database, CheckCircle, 
  ExternalLink, Image as ImageIcon, Video, Edit3, Trash2, X, Sparkles, 
  DownloadCloud, RefreshCw, Upload, FileImage, CloudLightning, Flame, Globe,
  Layers, Hammer, Plus, Minus, Tag, Wrench, Clock, MapPin, Lightbulb, ChevronRight
} from 'lucide-react';
import { Game, NewsArticle, WikiItem, WikiCategory } from '../types';
import { formatEmbedUrl } from '../utils/video';

const processImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Faqat rasm yuklash mumkin!'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Rasm ochishda xatolik!'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Faylni o\'qishda xatolik!'));
    reader.readAsDataURL(file);
  });
};

export const AdminPage: React.FC = () => {
  const { 
    games, news, t,
    addGame, updateGame, deleteGame,
    addNews, updateNews, deleteNews,
    addWikiItem, updateWikiItem, deleteWikiItem,
    addWikiCategory, updateWikiCategory, deleteWikiCategory,
    importGameFromSource,
    isFirebaseConnected, setFirebaseConfig
  } = useApp();

  const [activeTab, setActiveTab] = useState<'news' | 'wiki' | 'database'>('news');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // File input refs
  const newsFileInputRef = useRef<HTMLInputElement>(null);
  const editNewsFileInputRef = useRef<HTMLInputElement>(null);
  const gameFileInputRef = useRef<HTMLInputElement>(null);
  const editGameFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Modals
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editingWikiItem, setEditingWikiItem] = useState<{ gameId: string; item: WikiItem } | null>(null);

  // Category & Items Management Modals
  const [managingCategoriesGameId, setManagingCategoriesGameId] = useState<string | null>(null);
  const [managingItemsGameId, setManagingItemsGameId] = useState<string | null>(null);

  // Form State: Category Management
  const [newCatNameUz, setNewCatNameUz] = useState('');
  const [newCatNameRu, setNewCatNameRu] = useState('');
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [editingCategory, setEditingCategory] = useState<WikiCategory | null>(null);

  // Form State: Fandom Wiki Item & Recipe Management
  const itemFileInputRef = useRef<HTMLInputElement>(null);
  const [itemCatId, setItemCatId] = useState('');
  const [itemSubCategory, setItemSubCategory] = useState('');
  const [itemNameUz, setItemNameUz] = useState('');
  const [itemNameRu, setItemNameRu] = useState('');
  const [itemNameEn, setItemNameEn] = useState('');
  const [itemIcon, setItemIcon] = useState('🔨');
  const [itemImage, setItemImage] = useState('');
  const [itemTier, setItemTier] = useState('Tier 1');
  const [itemRarity, setItemRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>('common');
  const [itemDescUz, setItemDescUz] = useState('');
  const [itemDescRu, setItemDescRu] = useState('');
  const [itemDescEn, setItemDescEn] = useState('');
  const [itemDrops, setItemDrops] = useState('');
  const [itemXpGained, setItemXpGained] = useState('');
  const [itemStation, setItemStation] = useState('Dastgoh (Work Bench)');
  const [itemCraftTime, setItemCraftTime] = useState('Tezkor');
  const [itemLocation, setItemLocation] = useState('');
  const [itemTipsUz, setItemTipsUz] = useState('');
  const [itemIngredients, setItemIngredients] = useState<Array<{ item: string; count: number }>>([
    { item: 'Taxta (Plank)', count: 2 }
  ]);
  const [itemAttributes, setItemAttributes] = useState<Array<{ key: string; value: string }>>([
    { key: 'Chidamlilik', value: '100' }
  ]);

  // Form State: Add Game
  const [gameName, setGameName] = useState('');
  const [gameYear, setGameYear] = useState('2025');
  const [gameDeveloper, setGameDeveloper] = useState('');
  const [gameGenres, setGameGenres] = useState('Action, Open World, Shooter');
  const [gameCover, setGameCover] = useState<string>('');
  const [gameSourceUrl, setGameSourceUrl] = useState('');
  const [gameTaglineUz, setGameTaglineUz] = useState('');
  const [gameDescUz, setGameDescUz] = useState('');
  const [gameReleaseDateExact, setGameReleaseDateExact] = useState('Kuz 2025');
  const [gameIsUpcoming, setGameIsUpcoming] = useState(false);
  const [gameHasCrafting, setGameHasCrafting] = useState(true);
  const [gameOverviewArticleUz, setGameOverviewArticleUz] = useState('');

  // Form State: Add News (Multi-language and Tag management)
  const [newsLangTab, setNewsLangTab] = useState<'uz' | 'ru' | 'en'>('uz');
  const [newsTitleUz, setNewsTitleUz] = useState('');
  const [newsTitleRu, setNewsTitleRu] = useState('');
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsSummaryUz, setNewsSummaryUz] = useState('');
  const [newsSummaryRu, setNewsSummaryRu] = useState('');
  const [newsSummaryEn, setNewsSummaryEn] = useState('');
  const [newsContentUz, setNewsContentUz] = useState('');
  const [newsContentRu, setNewsContentRu] = useState('');
  const [newsContentEn, setNewsContentEn] = useState('');
  const [newsCover, setNewsCover] = useState<string>('');
  const [newsVideoUrl, setNewsVideoUrl] = useState('');
  const [newsGameId, setNewsGameId] = useState('all');
  const [newsCustomGame, setNewsCustomGame] = useState('');
  const [newsAuthor, setNewsAuthor] = useState('Bosh Muharrir');
  const [newsExpectedReleaseDate, setNewsExpectedReleaseDate] = useState('');
  const [newsSourceUrl, setNewsSourceUrl] = useState('');
  const [newsSourceName, setNewsSourceName] = useState('');
  
  // Tag selection system
  const [selectedTags, setSelectedTags] = useState<string[]>(['Yangilik', 'Reliz']);
  const [customTagInput, setCustomTagInput] = useState('');

  // Form State: Add Wiki Item
  const [wikiGameId, setWikiGameId] = useState('raft');
  const [wikiCategory, setWikiCategory] = useState('resources');
  const [wikiNameUz, setWikiNameUz] = useState('');
  const [wikiTier, setWikiTier] = useState('Tier 1');
  const [wikiRarity, setWikiRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>('common');
  const [wikiIcon, setWikiIcon] = useState('💎');
  const [wikiDescUz, setWikiDescUz] = useState('');
  const [wikiIngredient, setWikiIngredient] = useState('Plank (O\'tin)');
  const [wikiIngredientCount, setWikiIngredientCount] = useState(2);

  // Form State: Auto Importer
  const [importUrl, setImportUrl] = useState('https://raft.fandom.com');
  const [importGameTitle, setImportGameTitle] = useState('');

  // Firebase Config Form State
  const [fbApiKey, setFbApiKey] = useState('');
  const [fbProjectId, setFbProjectId] = useState('');
  const [fbRawConfig, setFbRawConfig] = useState('');

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4500);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64Url = await processImageFile(file);
      setter(base64Url);
      showNotification("Rasm kompyuterdan muvaffaqiyatli yuklandi!");
    } catch (err: any) {
      alert(err.message || "Rasm yuklashda xatolik yuz berdi");
    }
  };

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim()) return;

    addGame({
      name: gameName,
      releaseYear: gameYear,
      developer: gameDeveloper || "Noma'lum",
      genre: gameGenres.split(',').map((g) => g.trim()),
      coverImage: gameCover || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      sourceUrl: gameSourceUrl.trim() || undefined,
      tagline: { uz: gameTaglineUz || gameName, ru: gameName, en: gameName },
      description: { uz: gameDescUz || '', ru: '', en: '' },
      releaseDateExact: gameReleaseDateExact.trim() || undefined,
      isUpcoming: gameIsUpcoming,
      hasCrafting: gameHasCrafting,
      overviewArticle: gameOverviewArticleUz.trim() ? { uz: gameOverviewArticleUz, ru: gameOverviewArticleUz, en: gameOverviewArticleUz } : undefined,
    });

    setGameName('');
    setGameCover('');
    setGameTaglineUz('');
    setGameDescUz('');
    setGameSourceUrl('');
    setGameOverviewArticleUz('');
    showNotification("Yangi o'yin muvaffaqiyatli qo'shildi!");
  };

  const handleAddIngredientRow = () => {
    setItemIngredients([...itemIngredients, { item: '', count: 1 }]);
  };

  const handleRemoveIngredientRow = (index: number) => {
    setItemIngredients(itemIngredients.filter((_, i) => i !== index));
  };

  const handleUpdateIngredientRow = (index: number, field: 'item' | 'count', val: string | number) => {
    const updated = [...itemIngredients];
    if (field === 'item') {
      updated[index].item = String(val);
    } else {
      updated[index].count = Number(val) || 1;
    }
    setItemIngredients(updated);
  };

  const handleAddAttributeRow = () => {
    setItemAttributes([...itemAttributes, { key: '', value: '' }]);
  };

  const handleRemoveAttributeRow = (index: number) => {
    setItemAttributes(itemAttributes.filter((_, i) => i !== index));
  };

  const handleUpdateAttributeRow = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...itemAttributes];
    updated[index][field] = val;
    setItemAttributes(updated);
  };

  const handleCreateFandomItem = (e: React.FormEvent, gameId: string) => {
    e.preventDefault();
    if (!itemNameUz.trim() && !itemNameRu.trim() && !itemNameEn.trim()) {
      alert("Buyum nomini kiriting!");
      return;
    }

    const defaultName = itemNameUz || itemNameRu || itemNameEn;
    const defaultDesc = itemDescUz || itemDescRu || itemDescEn;

    const validIngredients = itemIngredients.filter(ing => ing.item.trim());
    const validAttributes: Record<string, string | number> = {};
    itemAttributes.forEach(attr => {
      if (attr.key.trim() && attr.value.trim()) {
        validAttributes[attr.key.trim()] = attr.value.trim();
      }
    });

    const targetGame = games.find(g => g.id === gameId);
    const categoryToUse = itemCatId || (targetGame?.categories?.[0]?.id || 'general');

    const parsedDrops = itemDrops
      .split(',')
      .map(d => d.trim())
      .filter(Boolean);

    const newItem: WikiItem = {
      id: `item-${Date.now()}`,
      name: {
        uz: itemNameUz.trim() || defaultName,
        ru: itemNameRu.trim() || defaultName,
        en: itemNameEn.trim() || defaultName,
      },
      category: categoryToUse,
      subCategory: itemSubCategory.trim() || undefined,
      tier: itemTier.trim() || undefined,
      rarity: itemRarity,
      icon: itemIcon.trim() || '📦',
      image: itemImage.trim() || undefined,
      drops: parsedDrops.length > 0 ? parsedDrops : undefined,
      xpGained: itemXpGained.trim() || undefined,
      description: {
        uz: itemDescUz.trim() || defaultDesc,
        ru: itemDescRu.trim() || defaultDesc,
        en: itemDescEn.trim() || defaultDesc,
      },
      recipe: validIngredients.length > 0 ? {
        ingredients: validIngredients,
        station: itemStation.trim() || undefined,
        craftTime: itemCraftTime.trim() || undefined,
      } : undefined,
      attributes: Object.keys(validAttributes).length > 0 ? validAttributes : undefined,
      tips: (itemTipsUz.trim()) ? {
        uz: itemTipsUz.trim(),
        ru: itemTipsUz.trim(),
        en: itemTipsUz.trim()
      } : undefined,
      location: itemLocation.trim() || undefined,
    };

    addWikiItem(gameId, newItem);
    setItemNameUz('');
    setItemNameRu('');
    setItemNameEn('');
    setItemDescUz('');
    setItemDescRu('');
    setItemDescEn('');
    setItemLocation('');
    setItemTipsUz('');
    setItemImage('');
    setItemSubCategory('');
    setItemDrops('');
    setItemXpGained('');
    setItemIngredients([{ item: 'Taxta (Plank)', count: 2 }]);
    setItemAttributes([{ key: 'Chidamlilik', value: '100' }]);
    showNotification("Fandom Wiki buyumi va retsepti saqlandi!");
  };

  const handleCreateCategory = (e: React.FormEvent, gameId: string) => {
    e.preventDefault();
    if (!newCatNameUz.trim() && !newCatNameRu.trim() && !newCatNameEn.trim()) {
      alert("Kategoriya nomini kiriting!");
      return;
    }
    const defaultName = newCatNameUz || newCatNameRu || newCatNameEn;
    const generatedId = newCatId.trim().toLowerCase().replace(/\s+/g, '-') || `cat-${Date.now()}`;

    const newCat: WikiCategory = {
      id: generatedId,
      name: {
        uz: newCatNameUz.trim() || defaultName,
        ru: newCatNameRu.trim() || defaultName,
        en: newCatNameEn.trim() || defaultName,
      },
      icon: newCatIcon.trim() || '📁',
    };

    addWikiCategory(gameId, newCat);
    setNewCatNameUz('');
    setNewCatNameRu('');
    setNewCatNameEn('');
    setNewCatId('');
    setNewCatIcon('📦');
    showNotification("Yangi kategoriya qo'shildi!");
  };

  const handleSaveCategoryEdit = (e: React.FormEvent, gameId: string) => {
    e.preventDefault();
    if (!editingCategory) return;
    updateWikiCategory(gameId, editingCategory.id, editingCategory);
    setEditingCategory(null);
    showNotification("Kategoriya muvaffaqiyatli o'zgartirildi!");
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitleUz.trim() && !newsTitleRu.trim() && !newsTitleEn.trim()) {
      alert("Kamida bitta tilda sarlavha kiritishingiz shart!");
      return;
    }

    const defaultTitle = newsTitleUz || newsTitleRu || newsTitleEn;
    const defaultSummary = newsSummaryUz || newsSummaryRu || newsSummaryEn;
    const defaultContent = newsContentUz || newsContentRu || newsContentEn;

    const finalGameId = newsGameId === 'custom' 
      ? (newsCustomGame.trim() || 'all') 
      : newsGameId;

    addNews({
      title: { 
        uz: newsTitleUz.trim() || defaultTitle, 
        ru: newsTitleRu.trim() || defaultTitle, 
        en: newsTitleEn.trim() || defaultTitle 
      },
      summary: { 
        uz: newsSummaryUz.trim() || defaultSummary, 
        ru: newsSummaryRu.trim() || defaultSummary, 
        en: newsSummaryEn.trim() || defaultSummary 
      },
      content: { 
        uz: newsContentUz.trim() || defaultContent, 
        ru: newsContentRu.trim() || defaultContent, 
        en: newsContentEn.trim() || defaultContent 
      },
      coverImage: newsCover || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      videoUrl: newsVideoUrl.trim() ? formatEmbedUrl(newsVideoUrl.trim()) : undefined,
      gameId: finalGameId,
      tags: selectedTags.length > 0 ? selectedTags : ['Yangilik'],
      author: newsAuthor,
      expectedReleaseDate: newsExpectedReleaseDate.trim() || undefined,
      sourceUrl: newsSourceUrl.trim() || undefined,
      sourceName: newsSourceName.trim() || undefined,
    });

    setNewsTitleUz('');
    setNewsTitleRu('');
    setNewsTitleEn('');
    setNewsSummaryUz('');
    setNewsSummaryRu('');
    setNewsSummaryEn('');
    setNewsContentUz('');
    setNewsContentRu('');
    setNewsContentEn('');
    setNewsCover('');
    setNewsVideoUrl('');
    setNewsExpectedReleaseDate('');
    setNewsCustomGame('');
    setNewsSourceUrl('');
    setNewsSourceName('');
    showNotification("Yangilik barcha tillarda muvaffaqiyatli chop etildi!");
  };

  const handleCreateWikiItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wikiNameUz.trim()) return;

    const newItem: WikiItem = {
      id: `item-${Date.now()}`,
      name: { uz: wikiNameUz, ru: wikiNameUz, en: wikiNameUz },
      category: wikiCategory,
      tier: wikiTier,
      rarity: wikiRarity,
      icon: wikiIcon,
      description: { uz: wikiDescUz, ru: wikiDescUz, en: wikiDescUz },
      recipe: {
        ingredients: [{ item: wikiIngredient, count: Number(wikiIngredientCount) }],
        station: "Dastgoh",
      },
    };

    addWikiItem(wikiGameId, newItem);
    setWikiNameUz('');
    setWikiDescUz('');
    showNotification("Wiki buyumi muvaffaqiyatli qo'shildi!");
  };

  const handleAutoImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl.trim()) return;

    setIsImporting(true);
    try {
      const res = await importGameFromSource(importUrl, importGameTitle.trim() || undefined);
      showNotification(res.message);
      setImportUrl('');
      setImportGameTitle('');
    } catch (err) {
      showNotification("Import jarayonida xatolik yuz berdi.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (fbRawConfig.trim()) {
      try {
        const cleaned = fbRawConfig.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
        const parsed = JSON.parse(cleaned);
        if (parsed.apiKey && parsed.projectId) {
          setFirebaseConfig(parsed);
          return;
        }
      } catch (err) {
        alert("JSON formatida xatolik. Iltimos tekshirib qayta tashlang.");
        return;
      }
    }

    if (fbApiKey && fbProjectId) {
      setFirebaseConfig({
        apiKey: fbApiKey.trim(),
        projectId: fbProjectId.trim(),
        authDomain: `${fbProjectId.trim()}.firebaseapp.com`,
      });
      return;
    }

    alert("Iltimos Firebase API Key va Project ID kiriting!");
  };

  const handleSaveNewsEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    updateNews(editingNews.id, {
      ...editingNews,
      videoUrl: editingNews.videoUrl ? formatEmbedUrl(editingNews.videoUrl) : undefined,
    });
    setEditingNews(null);
    showNotification("Maqola muvaffaqiyatli tahrirlandi!");
  };

  const handleSaveGameEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;

    updateGame(editingGame.id, editingGame);
    setEditingGame(null);
    showNotification("O'yin ma'lumotlari muvaffaqiyatli yangilandi!");
  };

  const handleSaveWikiItemEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWikiItem) return;

    updateWikiItem(editingWikiItem.gameId, editingWikiItem.item.id, editingWikiItem.item);
    setEditingWikiItem(null);
    showNotification("Wiki buyumi muvaffaqiyatli yangilandi!");
  };

  return (
    <div className="min-h-screen bg-[#070e17] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-[#0b1424] border border-[#00e5ff]/30 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0284c7] to-[#00e5ff] flex items-center justify-center text-[#070e17]">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{t('admin.headerTitle')}</h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                  isFirebaseConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {isFirebaseConnected ? t('admin.connected') : t('admin.localMode')}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Barcha postlar, o'yinlar, kompyuterdan rasm yuklash va Google Firebase bepul bazasi orqali butun dunyoga jonli ulash.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-[#070e17] px-4 py-2 rounded-xl border border-white/10 font-mono">
            {t('admin.inDb')} <strong className="text-white">{games.length} {t('admin.gamesCount')}</strong> | <strong className="text-white">{news.length} {t('admin.postsCount')}</strong>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] p-4 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Switcher: Only News, Game Wiki/Reviews, and Database Status */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'news'
                ? 'bg-[#00e5ff] text-[#070e17] shadow-lg shadow-[#00e5ff]/20'
                : 'bg-[#0b1424] text-slate-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>{t('admin.tabNewsLabel')} ({news.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wiki')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'wiki'
                ? 'bg-[#00e5ff] text-[#070e17] shadow-lg shadow-[#00e5ff]/20'
                : 'bg-[#0b1424] text-slate-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>{t('admin.tabWikiLabel')} ({games.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ml-auto ${
              activeTab === 'database'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                : 'bg-[#0b1424] text-amber-400 hover:bg-white/5 border border-amber-500/30'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>{t('admin.tabDatabaseLabel')}</span>
            {isFirebaseConnected && <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-mono">ULANDI</span>}
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 0: GOOGLE FIREBASE FREE DATABASE SETUP & CONNECT     */}
        {/* ========================================================= */}
        {activeTab === 'database' && (
          <div className="bg-[#0b1424] border border-amber-500/40 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>Google Firebase Bepul Baza (Firestore) Sozlamasi</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Bu nima uchun kerak? Siz saytda yangi post yoki o'yin qo'shganingizda, u <strong>butun dunyodagi boshqa odamlarga ham ko'rinishi</strong> uchun Google Firebase bepul bulutli bazasiga ulanadi!
                </p>
              </div>

              <div className="text-right">
                {isFirebaseConnected ? (
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl font-bold inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Google Baza Faol Ishlamoqda</span>
                  </span>
                ) : (
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl font-bold">
                    Hali Ulanmagan
                  </span>
                )}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#070e17] border border-white/10 rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">1</span>
                  <span>Saytga Kiring</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Brauzeringizda <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-[#00e5ff] underline font-bold">console.firebase.google.com</a> manziliga kiring (Google akkountingiz bilan bepul).
                </p>
              </div>

              <div className="bg-[#070e17] border border-white/10 rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">2</span>
                  <span>Baza Yarating</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>"Create a project"</strong> (nomi: <code>info-game-uz</code>) &gt; chap menyudan <strong>"Firestore Database"</strong> &gt; <strong>"Create Database"</strong> ni bosib, <em>"Test mode"</em>ni tanlang.
                </p>
              </div>

              <div className="bg-[#070e17] border border-white/10 rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">3</span>
                  <span>Kodni Nusxalang</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Loyiha sozlamalarida Web <code>&lt;/&gt;</code> belgisini bosib, chiqqan <strong>firebaseConfig</strong> kodini quyidagi maydonga tashlang.
                </p>
              </div>
            </div>

            {/* Form to paste config */}
            <form onSubmit={handleSaveFirebaseConfig} className="bg-[#070e17] border border-white/10 rounded-xl p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-white block mb-1">
                  Firebase Config JSON yoki Kodini shu yerga tashlang:
                </label>
                <textarea
                  rows={4}
                  value={fbRawConfig}
                  onChange={(e) => setFbRawConfig(e.target.value)}
                  placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "info-game-uz.firebaseapp.com",\n  "projectId": "info-game-uz"\n}`}
                  className="w-full bg-[#0b1424] border border-white/15 focus:border-amber-400 rounded-xl p-3 text-xs text-white font-mono outline-none"
                />
              </div>

              <div className="text-xs text-slate-400">Yoki alohida kiriting:</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">API Key</label>
                  <input
                    type="text"
                    value={fbApiKey}
                    onChange={(e) => setFbApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-[#0b1424] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Project ID</label>
                  <input
                    type="text"
                    value={fbProjectId}
                    onChange={(e) => setFbProjectId(e.target.value)}
                    placeholder="info-game-uz"
                    className="w-full bg-[#0b1424] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all"
                >
                  Bazani Saytga Ulash va Faollashtirish
                </button>

                {isFirebaseConnected && (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('info_game_firebase_config');
                      window.location.reload();
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Bazani uzish
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: NEWS (Add with Local File Upload, Edit, Delete)   */}
        {/* ========================================================= */}
        {activeTab === 'news' && (
          <div className="space-y-8">
            <form onSubmit={handleCreateNews} className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#00e5ff]" />
                <span>Yangi Post / Maqola Yaratish</span>
              </h2>

              {/* Game Selector with Custom / General Option */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Qaysi o'yin bo'yicha yangilik? *</label>
                  <select
                    value={newsGameId}
                    onChange={(e) => setNewsGameId(e.target.value)}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                  >
                    <option value="all">🌐 Barcha O'yinlar (Umumiy yangilik)</option>
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>🎮 {g.name}</option>
                    ))}
                    <option value="custom">➕ Ro'yxatda yo'q boshqa o'yin (Qo'lda yozish)</option>
                  </select>

                  {newsGameId === 'custom' && (
                    <input
                      type="text"
                      required
                      value={newsCustomGame}
                      onChange={(e) => setNewsCustomGame(e.target.value)}
                      placeholder="O'yin nomini kiriting (masalan: GTA 6, Witcher 4...)"
                      className="w-full mt-2 bg-[#050b14] border border-[#00e5ff]/50 rounded-xl px-3 py-2 text-xs text-white outline-none animate-in fade-in"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Muallif</label>
                  <input
                    type="text"
                    value={newsAuthor}
                    onChange={(e) => setNewsAuthor(e.target.value)}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Tag System: Select existing or Add custom tags */}
              <div className="bg-[#070e17] border border-white/10 rounded-2xl p-4 space-y-3">
                <label className="text-xs font-bold text-[#00e5ff] flex items-center justify-between">
                  <span>Teglar (Kategoriya / Mavzular) *</span>
                  <span className="text-[10px] text-slate-400 font-normal">Tanlangan: {selectedTags.length} ta</span>
                </label>

                {/* Selected Tag Badges */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                        className="hover:text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {selectedTags.length === 0 && (
                    <span className="text-xs text-slate-500 italic">Hali teg tanlanmadi. Quyidagilardan tanlang yoki yangi qo'shing.</span>
                  )}
                </div>

                {/* Popular / Existing Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Tavsiya teglar:</span>
                  {['Yangilik', 'Reliz', 'Patch', 'Treyler', 'GTA 6', 'CS2', 'Rust', 'E-Sport', 'Geympley', 'Mobil'].map((pt) => {
                    const isSelected = selectedTags.includes(pt);
                    return (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedTags(selectedTags.filter((t) => t !== pt));
                          } else {
                            setSelectedTags([...selectedTags, pt]);
                          }
                        }}
                        className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                          isSelected
                            ? 'bg-[#00e5ff] text-[#070e17] font-bold border-[#00e5ff]'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30'
                        }`}
                      >
                        + {pt}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Tag Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
                          setSelectedTags([...selectedTags, customTagInput.trim()]);
                          setCustomTagInput('');
                        }
                      }
                    }}
                    placeholder="Yangi teg yozib Enter bosing..."
                    className="flex-1 bg-[#0b1424] border border-white/10 focus:border-[#00e5ff] rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customTagInput.trim() && !selectedTags.includes(customTagInput.trim())) {
                        setSelectedTags([...selectedTags, customTagInput.trim()]);
                        setCustomTagInput('');
                      }
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition-colors"
                  >
                    Qo'shish
                  </button>
                </div>
              </div>

              {/* Local File Uploader for News Image */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#00e5ff] flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  <span>Maqola Rasmi (Kompyuteringizdan Fayl Tanlang)</span>
                </label>

                <input
                  type="file"
                  ref={newsFileInputRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setNewsCover)}
                  className="hidden"
                />

                <div
                  onClick={() => newsFileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#00e5ff]/30 hover:border-[#00e5ff] bg-[#070e17] rounded-2xl p-6 text-center cursor-pointer transition-all group"
                >
                  {newsCover ? (
                    <div className="space-y-3">
                      <div className="relative inline-block rounded-xl overflow-hidden max-h-56 shadow-lg border border-white/20">
                        <img src={newsCover} alt="Preview" className="max-h-56 object-contain" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewsCover('');
                          }}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full text-xs transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-[#00e5ff] font-bold">
                        ✔ Rasm yuklandi. Boshqasini tanlash uchun ustiga bosing.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <FileImage className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-white">
                        Kompyuterdan rasm tanlash uchun bu yerga bosing
                      </div>
                      <div className="text-xs text-slate-400">
                        PNG, JPG, WEBP formatlar (Avtomatik optimizatsiya qilinadi)
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Video Link & Expected Release Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                    <Video className="w-3.5 h-3.5 text-[#ff4655]" />
                    <span>Video Ssilka (YouTube / Shorts / youtu.be, ixtiyoriy)</span>
                  </label>
                  <input
                    type="url"
                    value={newsVideoUrl}
                    onChange={(e) => setNewsVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... yoki https://youtu.be/..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Istalgan YouTube ssilkasini qo'yishingiz mumkin, tizim uni avtomatik tarzda to'g'ri ko'rinishga keltiradi.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>O'yin Chiqish Sanasi (Ixtiyoriy, masalan: "Kuz 2025")</span>
                  </label>
                  <input
                    type="text"
                    value={newsExpectedReleaseDate}
                    onChange={(e) => setNewsExpectedReleaseDate(e.target.value)}
                    placeholder="Kuz 2025, 2026-yil 1-chorak..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Multi-Language Title & Content Tabs */}
              <div className="bg-[#070e17] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
                  <div>
                    <label className="text-xs font-bold text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#00e5ff]" />
                      <span>Post Matnlari (O'zbek, Rus va Ingliz tillarida)</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Istalgan tilda yozishingiz mumkin. Sayt foydalanuvchi tanlagan tilga mosini ko'rsatadi.
                    </span>
                  </div>

                  {/* Language Switcher Buttons for Form */}
                  <div className="flex bg-[#0b1424] p-1 rounded-xl border border-white/10 gap-1">
                    <button
                      type="button"
                      onClick={() => setNewsLangTab('uz')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        newsLangTab === 'uz' ? 'bg-[#00e5ff] text-[#070e17]' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>🇺🇿</span>
                      <span>O'zbekcha</span>
                      {newsTitleUz && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewsLangTab('ru')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        newsLangTab === 'ru' ? 'bg-[#00e5ff] text-[#070e17]' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>🇷🇺</span>
                      <span>Русский</span>
                      {newsTitleRu && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewsLangTab('en')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        newsLangTab === 'en' ? 'bg-[#00e5ff] text-[#070e17]' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>🇬🇧</span>
                      <span>English</span>
                      {newsTitleEn && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </button>
                  </div>
                </div>

                {/* Uzbek Inputs */}
                {newsLangTab === 'uz' && (
                  <div className="space-y-3 animate-in fade-in">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇺🇿 Sarlavha (O'zbekcha) *</label>
                      <input
                        type="text"
                        value={newsTitleUz}
                        onChange={(e) => setNewsTitleUz(e.target.value)}
                        placeholder="Grand Theft Auto VI: Chiqish sanasi va tafsilotlar..."
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇺🇿 Qisqacha Tavsif (O'zbekcha)</label>
                      <textarea
                        rows={2}
                        value={newsSummaryUz}
                        onChange={(e) => setNewsSummaryUz(e.target.value)}
                        placeholder="O'yin haqida qisqacha ma'lumot..."
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇺🇿 To'liq Matn (O'zbekcha)</label>
                      <textarea
                        rows={4}
                        value={newsContentUz}
                        onChange={(e) => setNewsContentUz(e.target.value)}
                        placeholder="Maqolaning to'liq matni..."
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Russian Inputs */}
                {newsLangTab === 'ru' && (
                  <div className="space-y-3 animate-in fade-in">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇷🇺 Заголовок (Русский)</label>
                      <input
                        type="text"
                        value={newsTitleRu}
                        onChange={(e) => setNewsTitleRu(e.target.value)}
                        placeholder="Grand Theft Auto VI: Дата выхода и подробности..."
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇷🇺 Краткое описание (Русский)</label>
                      <textarea
                        rows={2}
                        value={newsSummaryRu}
                        onChange={(e) => setNewsSummaryRu(e.target.value)}
                        placeholder="Краткое содержание..."
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇷🇺 Полный текст (Русский)</label>
                      <textarea
                        rows={4}
                        value={newsContentRu}
                        onChange={(e) => setNewsContentRu(e.target.value)}
                        placeholder="Полный текст новости..."
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* English Inputs */}
                {newsLangTab === 'en' && (
                  <div className="space-y-3 animate-in fade-in">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇬🇧 Title (English)</label>
                      <input
                        type="text"
                        value={newsTitleEn}
                        onChange={(e) => setNewsTitleEn(e.target.value)}
                        placeholder="Grand Theft Auto VI: Release Date and details..."
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇬🇧 Short Excerpt (English)</label>
                      <textarea
                        rows={2}
                        value={newsSummaryEn}
                        onChange={(e) => setNewsSummaryEn(e.target.value)}
                        placeholder="Brief summary..."
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇬🇧 Full Content (English)</label>
                      <textarea
                        rows={4}
                        value={newsContentEn}
                        onChange={(e) => setNewsContentEn(e.target.value)}
                        placeholder="Full article body..."
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Source (Istochnik) Information - OPTIONAL */}
              <div className="bg-[#070e17] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#00e5ff]">
                  <ExternalLink className="w-4 h-4" />
                  <span>Istochnik / Manba Ma'lumotlari (Ixtiyoriy)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Manba Sayt Nomi (masalan: Rockstar Games, IGN, Steam, PC Gamer)
                    </label>
                    <input
                      type="text"
                      value={newsSourceName}
                      onChange={(e) => setNewsSourceName(e.target.value)}
                      placeholder="IGN, Rockstar Games..."
                      className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Manba Ssilkasi (Asl maqola URL manzili)
                    </label>
                    <input
                      type="url"
                      value={newsSourceUrl}
                      onChange={(e) => setNewsSourceUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#00e5ff] text-[#070e17] font-black text-xs px-6 py-2.5 rounded-xl hover:bg-[#38bdf8] transition-colors shadow-lg shadow-[#00e5ff]/20"
              >
                Maqolani Chop Etish
              </button>
            </form>

            {/* Existing Posts List */}
            <div className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>Mavjud Postlar Ro'yxati ({news.length})</span>
                <span className="text-xs text-slate-400 font-normal">Har bir postni o'zgartirish yoki o'chirish mumkin</span>
              </h3>

              <div className="space-y-3">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#070e17] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.coverImage} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">{t(item.title)}</div>
                        <div className="text-[10px] text-slate-400 mt-1 flex gap-2">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.author}</span>
                          <span>•</span>
                          <span className="text-[#00e5ff] uppercase">{item.gameId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setEditingNews(item)}
                        className="bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>O'zgartirish</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`"${t(item.title)}" maqolasini o'chirishga ishonchingiz komilmi?`)) {
                            deleteNews(item.id);
                            showNotification("Maqola o'chirildi.");
                          }
                        }}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>O'chirish</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: WIKI & GAMES (Add, List, Edit, Delete Games/Wiki)  */}
        {/* ========================================================= */}
        {activeTab === 'wiki' && (
          <div className="space-y-8">
            <form onSubmit={handleCreateGame} className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#00e5ff]" />
                <span>Yangi O'yin / Ensiklopediya Sharhi Qo'shish</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">O'yin Nomi *</label>
                  <input
                    type="text"
                    required
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    placeholder="Masalan: GTA 6, Counter-Strike 2, STALKER 2..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-400 block mb-1">Kutilayotgan Reliz Sanasi</label>
                  <input
                    type="text"
                    value={gameReleaseDateExact}
                    onChange={(e) => setGameReleaseDateExact(e.target.value)}
                    placeholder="Kuz 2025, 2026-yil..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Ishlab chiqaruvchi (Developer)</label>
                  <input
                    type="text"
                    value={gameDeveloper}
                    onChange={(e) => setGameDeveloper(e.target.value)}
                    placeholder="Rockstar Games, Valve, GSC..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Janrlar</label>
                  <input
                    type="text"
                    value={gameGenres}
                    onChange={(e) => setGameGenres(e.target.value)}
                    placeholder="Action, Open World, Shooter..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Overview / Story / Review Content */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  O'yin Haqida Katta Ensiklopediya Sharhi (Syujet, Personajlar, O'yin mexanikasi)
                </label>
                <textarea
                  rows={5}
                  value={gameOverviewArticleUz}
                  onChange={(e) => setGameOverviewArticleUz(e.target.value)}
                  placeholder="Ushbu o'yin haqida batafsil ma'lumotlar, yangiliklar va sharh..."
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00e5ff]"
                />
              </div>

              {/* Local File Upload for Game Cover */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#00e5ff] flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  <span>O'yin Rasmi (Kompyuteringizdan Yuklang)</span>
                </label>
                <input
                  type="file"
                  ref={gameFileInputRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setGameCover)}
                  className="hidden"
                />
                <div
                  onClick={() => gameFileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-[#00e5ff] bg-[#070e17] rounded-xl p-4 text-center cursor-pointer transition-all"
                >
                  {gameCover ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={gameCover} alt="Cover" className="h-16 w-24 object-cover rounded-lg border border-white/20" />
                      <span className="text-xs text-[#00e5ff] font-bold">Rasm yuklandi. O'zgartirish uchun bosing.</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">
                      Kompyuterdan o'yin rasmini yuklash uchun bosing
                    </div>
                  )}
                </div>
              </div>

              {/* Source URL (Optional) */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Manba Sayt Ssilkasi (Ixtiyoriy)
                </label>
                <input
                  type="url"
                  value={gameSourceUrl}
                  onChange={(e) => setGameSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#070e17] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                />
              </div>

              {/* Crafting System Checkbox / Question */}
              <div className="bg-[#070e17] border border-[#00e5ff]/30 rounded-xl p-4 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="gameHasCrafting"
                  checked={gameHasCrafting}
                  onChange={(e) => setGameHasCrafting(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#00e5ff] accent-[#00e5ff] cursor-pointer"
                />
                <label htmlFor="gameHasCrafting" className="cursor-pointer">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span>🔨 Ushbu o'yinda Crafting / Retseptlar / Buyumlar tizimi bormi?</span>
                    {gameHasCrafting ? (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-bold">HA, MAVJUD</span>
                    ) : (
                      <span className="bg-slate-700/50 text-slate-400 border border-white/10 text-[10px] px-2 py-0.5 rounded font-bold">YO'Q</span>
                    )}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1 leading-relaxed">
                    Agar belgilansa, o'yin uchun avtomatik Crafting & Retseptlar bo'limi ochiladi va siz Fandom (Raft, Rust, Minecraft kabi) buyumlari, ingredientlari va dastgohlarini kiritishingiz mumkin bo'ladi.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="bg-[#00e5ff] text-[#070e17] font-black text-xs px-6 py-2.5 rounded-xl hover:bg-[#38bdf8] transition-colors"
              >
                O'yin Sharhini Saqlash
              </button>
            </form>

            {/* List of Existing Games */}
            <div className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>Mavjud O'yinlar Ensiklopediyasi ({games.length})</span>
                <span className="text-xs text-slate-400 font-normal">Kategoriyalar, buyumlar, craft va tahrirlash</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="bg-[#070e17] border border-white/5 rounded-xl p-4 flex flex-col justify-between gap-3 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={game.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white truncate">{game.name}</h4>
                          {game.hasCrafting !== false ? (
                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                              <Hammer className="w-2.5 h-2.5" /> Crafting Bor
                            </span>
                          ) : (
                            <span className="text-[9px] bg-slate-800 text-slate-400 border border-white/10 px-1.5 py-0.5 rounded font-bold">
                              Craftingsiz
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{game.releaseDateExact || game.releaseYear} • {game.developer}</div>
                        <div className="text-[10px] text-[#00e5ff] mt-0.5 flex items-center gap-2">
                          <span>🏷️ {game.categories?.length || 0} kategoriya</span>
                          <span>•</span>
                          <span>📦 {game.items?.length || 0} buyum</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setManagingCategoriesGameId(game.id)}
                          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-bold transition-all"
                          title="Kategoriyalarni tahrirlash, o'chirish yoki yangi kategoriya qo'shish"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          <span>Kategoriyalar ({game.categories?.length || 0})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setManagingItemsGameId(game.id)}
                          className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-bold transition-all"
                          title="Fandom Wiki buyumlari, retseptlar va ingredientlarni boshqarish"
                        >
                          <Hammer className="w-3.5 h-3.5" />
                          <span>Buyumlar & Craft ({game.items?.length || 0})</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingGame(game)}
                          className="bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>O'zgartirish</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`"${game.name}" o'yinini o'chirishga ishonchingiz komilmi?`)) {
                              deleteGame(game.id);
                              showNotification("O'yin o'chirildi.");
                            }
                          }}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>O'chirish</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* EDIT MODAL: NEWS EDIT (With File Upload from Computer)    */}
        {/* ========================================================= */}
        {editingNews && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0b1424] border border-[#00e5ff]/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white">Postni Tahrirlash (O'zgartirish)</h3>
                <button onClick={() => setEditingNews(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNewsEdit} className="space-y-4">
                {/* Multi-language edit inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">🇺🇿 Sarlavha (O'zbekcha)</label>
                    <input
                      type="text"
                      value={editingNews.title.uz}
                      onChange={(e) => setEditingNews({
                        ...editingNews,
                        title: { ...editingNews.title, uz: e.target.value }
                      })}
                      className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇷🇺 Заголовок (Русский)</label>
                      <input
                        type="text"
                        value={editingNews.title.ru || ''}
                        onChange={(e) => setEditingNews({
                          ...editingNews,
                          title: { ...editingNews.title, ru: e.target.value }
                        })}
                        className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇬🇧 Title (English)</label>
                      <input
                        type="text"
                        value={editingNews.title.en || ''}
                        onChange={(e) => setEditingNews({
                          ...editingNews,
                          title: { ...editingNews.title, en: e.target.value }
                        })}
                        className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#00e5ff] flex items-center gap-1.5">
                    <Upload className="w-4 h-4" />
                    <span>Muqova Rasmini Kompyuterdan Yangilash</span>
                  </label>
                  <input
                    type="file"
                    ref={editNewsFileInputRef}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, (newUrl) => {
                      setEditingNews({ ...editingNews, coverImage: newUrl });
                    })}
                    className="hidden"
                  />
                  <div
                    onClick={() => editNewsFileInputRef.current?.click()}
                    className="border border-dashed border-white/20 hover:border-[#00e5ff] bg-[#070e17] rounded-xl p-3 text-center cursor-pointer transition-all flex items-center justify-center gap-3"
                  >
                    <img src={editingNews.coverImage} alt="Current" className="h-14 w-20 object-cover rounded-lg border border-white/20" />
                    <span className="text-xs text-[#00e5ff] font-bold">Kompyuterdan yangi rasm tanlash uchun bosing</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Video Ssilka (YouTube)</label>
                  <input
                    type="url"
                    value={editingNews.videoUrl || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... yoki https://youtu.be/..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Qisqacha Tavsif</label>
                  <textarea
                    rows={2}
                    value={editingNews.summary.uz}
                    onChange={(e) => setEditingNews({
                      ...editingNews,
                      summary: { ...editingNews.summary, uz: e.target.value }
                    })}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">To'liq Matn (Content)</label>
                  <textarea
                    rows={5}
                    value={editingNews.content.uz}
                    onChange={(e) => setEditingNews({
                      ...editingNews,
                      content: { ...editingNews.content, uz: e.target.value }
                    })}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                  />
                </div>

                {/* Edit Source URL & Source Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Manba Sayt Nomi</label>
                    <input
                      type="text"
                      value={editingNews.sourceName || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, sourceName: e.target.value })}
                      placeholder="IGN, Rockstar Games..."
                      className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Manba Ssilkasi</label>
                    <input
                      type="url"
                      value={editingNews.sourceUrl || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, sourceUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingNews(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-slate-300 hover:bg-white/10"
                  >
                    Bekor Qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-black bg-[#00e5ff] text-[#070e17] hover:bg-[#38bdf8]"
                  >
                    O'zgarishlarni Saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT GAME MODAL */}
        {editingGame && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0b1424] border border-[#00e5ff]/50 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white">O'yinni Tahrirlash</h3>
                <button onClick={() => setEditingGame(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveGameEdit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">O'yin Nomi</label>
                  <input
                    type="text"
                    required
                    value={editingGame.name}
                    onChange={(e) => setEditingGame({ ...editingGame, name: e.target.value })}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Chiqarilgan Yili</label>
                    <input
                      type="text"
                      value={editingGame.releaseYear}
                      onChange={(e) => setEditingGame({ ...editingGame, releaseYear: e.target.value })}
                      className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-amber-400 block mb-1">Aniq Reliz Sanasi</label>
                    <input
                      type="text"
                      value={editingGame.releaseDateExact || ''}
                      onChange={(e) => setEditingGame({ ...editingGame, releaseDateExact: e.target.value })}
                      placeholder="Kuz 2025..."
                      className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Umumiy Ensiklopediya Sharhi / Katta Maqolasi
                  </label>
                  <textarea
                    rows={4}
                    value={editingGame.overviewArticle?.uz || editingGame.description?.uz || ''}
                    onChange={(e) => setEditingGame({
                      ...editingGame,
                      overviewArticle: { uz: e.target.value, ru: e.target.value, en: e.target.value }
                    })}
                    placeholder="O'yin haqidagi batafsil sharh..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#00e5ff] block mb-1">Manba (Istochnik) URL</label>
                  <input
                    type="url"
                    value={editingGame.sourceUrl || ''}
                    onChange={(e) => setEditingGame({ ...editingGame, sourceUrl: e.target.value })}
                    placeholder="https://raft.fandom.com"
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="bg-[#070e17] border border-[#00e5ff]/30 rounded-xl p-3 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="editGameHasCrafting"
                    checked={editingGame.hasCrafting !== false}
                    onChange={(e) => setEditingGame({ ...editingGame, hasCrafting: e.target.checked })}
                    className="w-4 h-4 text-[#00e5ff] accent-[#00e5ff] cursor-pointer"
                  />
                  <label htmlFor="editGameHasCrafting" className="text-xs font-bold text-white cursor-pointer flex items-center gap-2">
                    <Hammer className="w-3.5 h-3.5 text-[#00e5ff]" />
                    <span>Ushbu o'yinda Crafting / Retseptlar tizimi yoqilgan ({editingGame.hasCrafting !== false ? "HA" : "YO'Q"})</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#00e5ff] flex items-center gap-1.5">
                    <Upload className="w-4 h-4" />
                    <span>Kompyuterdan Yangi Rasm Yuklash</span>
                  </label>
                  <input
                    type="file"
                    ref={editGameFileInputRef}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, (newUrl) => {
                      setEditingGame({ ...editingGame, coverImage: newUrl });
                    })}
                    className="hidden"
                  />
                  <div
                    onClick={() => editGameFileInputRef.current?.click()}
                    className="border border-dashed border-white/20 hover:border-[#00e5ff] bg-[#070e17] rounded-xl p-3 text-center cursor-pointer transition-all flex items-center justify-center gap-3"
                  >
                    <img src={editingGame.coverImage} alt="Current" className="h-14 w-20 object-cover rounded-lg border border-white/20" />
                    <span className="text-xs text-[#00e5ff] font-bold">Rasmni o'zgartirish uchun bosing</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingGame(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-slate-300 hover:bg-white/10"
                  >
                    Bekor Qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-black bg-[#00e5ff] text-[#070e17] hover:bg-[#38bdf8]"
                  >
                    O'zgarishlarni Saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT WIKI ITEM MODAL */}
        {editingWikiItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0b1424] border border-[#00e5ff]/50 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white">Wiki Buyumini Tahrirlash</h3>
                <button onClick={() => setEditingWikiItem(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveWikiItemEdit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-300 block mb-1">Nomi</label>
                    <input
                      type="text"
                      required
                      value={editingWikiItem.item.name.uz}
                      onChange={(e) => setEditingWikiItem({
                        ...editingWikiItem,
                        item: {
                          ...editingWikiItem.item,
                          name: { ...editingWikiItem.item.name, uz: e.target.value }
                        }
                      })}
                      className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Ikonka</label>
                    <input
                      type="text"
                      value={editingWikiItem.item.icon}
                      onChange={(e) => setEditingWikiItem({
                        ...editingWikiItem,
                        item: { ...editingWikiItem.item, icon: e.target.value }
                      })}
                      className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Tier / Daraja</label>
                  <input
                    type="text"
                    value={editingWikiItem.item.tier || ''}
                    onChange={(e) => setEditingWikiItem({
                      ...editingWikiItem,
                      item: { ...editingWikiItem.item, tier: e.target.value }
                    })}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Tavsif</label>
                  <textarea
                    rows={3}
                    value={editingWikiItem.item.description.uz}
                    onChange={(e) => setEditingWikiItem({
                      ...editingWikiItem,
                      item: {
                        ...editingWikiItem.item,
                        description: { ...editingWikiItem.item.description, uz: e.target.value }
                      }
                    })}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingWikiItem(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-slate-300 hover:bg-white/10"
                  >
                    Bekor Qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-black bg-[#00e5ff] text-[#070e17] hover:bg-[#38bdf8]"
                  >
                    O'zgarishlarni Saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL: CATEGORY MANAGEMENT MODAL                         */}
        {/* ========================================================= */}
        {managingCategoriesGameId && (() => {
          const catGame = games.find(g => g.id === managingCategoriesGameId);
          if (!catGame) return null;

          return (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0b1424] border border-amber-500/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>"{catGame.name}" Kategoriyalari</span>
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                          {catGame.categories?.length || 0} ta
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        O'yin kategoriyalarini o'zgartiring, yangisini qo'shing yoki keraksizlarini olib tashlang.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setManagingCategoriesGameId(null);
                      setEditingCategory(null);
                    }}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Edit Category Form (Inline) */}
                {editingCategory && (
                  <form
                    onSubmit={(e) => handleSaveCategoryEdit(e, catGame.id)}
                    className="bg-[#070e17] border border-amber-500/40 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4" />
                        <span>Kategoriyani tahrirlash: {editingCategory.name.uz}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Bekor qilish
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="O'zbekcha nomi *"
                        value={editingCategory.name.uz}
                        onChange={(e) => setEditingCategory({
                          ...editingCategory,
                          name: { ...editingCategory.name, uz: e.target.value }
                        })}
                        className="bg-[#0b1424] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      />
                      <input
                        type="text"
                        placeholder="Ruscha nomi"
                        value={editingCategory.name.ru || ''}
                        onChange={(e) => setEditingCategory({
                          ...editingCategory,
                          name: { ...editingCategory.name, ru: e.target.value }
                        })}
                        className="bg-[#0b1424] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Inglizcha nomi"
                        value={editingCategory.name.en || ''}
                        onChange={(e) => setEditingCategory({
                          ...editingCategory,
                          name: { ...editingCategory.name, en: e.target.value }
                        })}
                        className="bg-[#0b1424] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Ikonka (emoji)"
                        value={editingCategory.icon || ''}
                        onChange={(e) => setEditingCategory({
                          ...editingCategory,
                          icon: e.target.value
                        })}
                        className="bg-[#0b1424] border border-white/10 rounded-lg px-3 py-2 text-xs text-white text-center outline-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="submit"
                        className="bg-amber-400 hover:bg-amber-300 text-black font-black text-xs px-4 py-2 rounded-lg"
                      >
                        O'zgarishni Saqlash
                      </button>
                    </div>
                  </form>
                )}

                {/* Existing Categories List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-300">
                    Mavjud Kategoriyalar ({catGame.categories?.length || 0})
                  </h4>

                  {catGame.categories && catGame.categories.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2.5">
                      {catGame.categories.map((cat) => {
                        const count = catGame.items?.filter((it) => it.category === cat.id).length || 0;
                        return (
                          <div
                            key={cat.id}
                            className="bg-[#070e17] border border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-white/20 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
                                {cat.icon || '📦'}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white">{cat.name.uz}</span>
                                  <span className="text-[10px] font-mono text-slate-400 bg-black/50 px-2 py-0.5 rounded border border-white/5">
                                    id: {cat.id}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                                  <span>🇷🇺 {cat.name.ru || '-'}</span>
                                  <span>•</span>
                                  <span>🇬🇧 {cat.name.en || '-'}</span>
                                  <span>•</span>
                                  <span className="text-[#00e5ff] font-semibold">{count} ta buyum biriktirilgan</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingCategory(cat)}
                                className="bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Tahrirlash</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`"${cat.name.uz}" kategoriyasini olib tashlashga ishonchingiz komilmi?`)) {
                                    deleteWikiCategory(catGame.id, cat.id);
                                    showNotification("Kategoriya olib tashlandi.");
                                  }
                                }}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Olib tashlash</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs bg-[#070e17] rounded-xl border border-dashed border-white/10">
                      Ushbu o'yinda hozircha kategoriyalar yo'q. Quyidagi shakldan foydalanib yangi kategoriya qo'shing.
                    </div>
                  )}
                </div>

                {/* Add Category Form */}
                <form
                  onSubmit={(e) => handleCreateCategory(e, catGame.id)}
                  className="bg-[#070e17] border border-[#00e5ff]/30 rounded-xl p-4 space-y-4"
                >
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-[#00e5ff]" />
                    <span>Yangi Kategoriya Qo'shish</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">🇺🇿 Nomi (O'zbekcha) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Masalan: Qurollar, Resurslar, Kema..."
                        value={newCatNameUz}
                        onChange={(e) => setNewCatNameUz(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">🇷🇺 Nomi (Ruscha)</label>
                      <input
                        type="text"
                        placeholder="Оружие, Ресурсы..."
                        value={newCatNameRu}
                        onChange={(e) => setNewCatNameRu(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">🇬🇧 Nomi (Inglizcha)</label>
                      <input
                        type="text"
                        placeholder="Weapons, Resources..."
                        value={newCatNameEn}
                        onChange={(e) => setNewCatNameEn(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Ikonka (Emoji)</label>
                      <input
                        type="text"
                        placeholder="⚔️, 🪵, 🍲, 💎, 🧭..."
                        value={newCatIcon}
                        onChange={(e) => setNewCatIcon(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">ID (Slug, ixtiyoriy)</label>
                      <input
                        type="text"
                        placeholder="weapons, resources, food..."
                        value={newCatId}
                        onChange={(e) => setNewCatId(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-[#00e5ff] text-[#070e17] font-black text-xs px-5 py-2 rounded-lg hover:bg-[#38bdf8] flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Kategoriyani Qo'shish</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })()}

        {/* ========================================================= */}
        {/* MODAL: FANDOM ITEMS & CRAFTING RECIPES MANAGEMENT        */}
        {/* ========================================================= */}
        {managingItemsGameId && (() => {
          const itemGame = games.find(g => g.id === managingItemsGameId);
          if (!itemGame) return null;

          return (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0b1424] border border-purple-500/40 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Hammer className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>"{itemGame.name}" — Fandom Wiki Buyumlari & Craft</span>
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                          {itemGame.items?.length || 0} ta buyum
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        {itemGame.hasCrafting !== false 
                          ? "Raft Fandom kabi buyumlar, retseptlar, ingredientlar, dastgoh va xususiyatlar qo'shish tizimi."
                          : "Ushbu o'yinda umumiy buyumlar va ensiklopediya elementlarini kiritishingiz mumkin."}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setManagingItemsGameId(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Crafting System Status Banner */}
                <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                  itemGame.hasCrafting !== false 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-800/60 border-white/10 text-slate-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <Hammer className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {itemGame.hasCrafting !== false 
                        ? "Crafting va Retseptlar bo'limi yoqilgan! Quyida ingredientlar va dastgohlarni to'liq kiritishingiz mumkin."
                        : "Crafting tizimi o'chirilgan. (Agar o'yinda craft bo'lsa, 'O'zgartirish' bo'limida yoqishingiz mumkin)."}
                    </span>
                  </div>
                </div>

                {/* Form to Add New Fandom Item / Recipe */}
                <form
                  onSubmit={(e) => handleCreateFandomItem(e, itemGame.id)}
                  className="bg-[#070e17] border border-purple-500/30 rounded-2xl p-5 space-y-5"
                >
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-purple-400" />
                    <span>Yangi Buyum / Craft Retsepti Kiritish (Raft Fandom uslubida)</span>
                  </h4>

                  {/* Category, Subcategory, Tier, Rarity, Icon */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Kategoriya *</label>
                      <select
                        value={itemCatId}
                        onChange={(e) => setItemCatId(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                      >
                        {itemGame.categories && itemGame.categories.length > 0 ? (
                          itemGame.categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.icon || '📁'} {c.name.uz} ({c.id})</option>
                          ))
                        ) : (
                          <option value="general">Umumiy (general)</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Bo'lim / Subkategoriya</label>
                      <input
                        type="text"
                        placeholder="Security, Husks, Qurollar..."
                        value={itemSubCategory}
                        onChange={(e) => setItemSubCategory(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Tier / Daraja</label>
                      <input
                        type="text"
                        placeholder="Scout, Tier 1, Heavy..."
                        value={itemTier}
                        onChange={(e) => setItemTier(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Noyoblik (Rarity)</label>
                      <select
                        value={itemRarity}
                        onChange={(e) => setItemRarity(e.target.value as any)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      >
                        <option value="common">Oddiy (Common)</option>
                        <option value="rare">Noyob (Rare)</option>
                        <option value="epic">Epik (Epic)</option>
                        <option value="legendary">Afsonaviy (Legendary)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Ikonka (Emoji)</label>
                      <input
                        type="text"
                        placeholder="🤖, 👁️, 🪓, 🎣..."
                        value={itemIcon}
                        onChange={(e) => setItemIcon(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none text-center"
                      />
                    </div>
                  </div>

                  {/* Image / Photo upload or URL */}
                  <div className="bg-[#0b1424] border border-white/10 rounded-xl p-3.5 space-y-2">
                    <label className="text-xs font-bold text-purple-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Upload className="w-4 h-4" />
                        <span>Buyum / Robot / Xarita Rasmi (Foto)</span>
                      </span>
                      {itemImage && (
                        <button
                          type="button"
                          onClick={() => setItemImage('')}
                          className="text-[10px] text-red-400 hover:underline"
                        >
                          Rasmni o'chirish
                        </button>
                      )}
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Rasm ssilkasi (https://...) yoki kompyuterdan yuklang"
                        value={itemImage}
                        onChange={(e) => setItemImage(e.target.value)}
                        className="flex-1 bg-[#070e17] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                      />
                      <input
                        type="file"
                        ref={itemFileInputRef}
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setItemImage)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => itemFileInputRef.current?.click()}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 flex-shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Fayl yuklash</span>
                      </button>
                    </div>

                    {itemImage && (
                      <div className="flex items-center gap-3 pt-1">
                        <img src={itemImage} alt="Preview" className="h-16 w-28 object-cover rounded-lg border border-white/20" />
                        <span className="text-[11px] text-emerald-400 font-semibold">Rasm tanlandi! Jadvalda fotolari bilan chiroyli chiqadi.</span>
                      </div>
                    )}
                  </div>

                  {/* Multi-language Item Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇺🇿 Nomi (O'zbekcha) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Plastik Qarmaq (Plastic Hook)..."
                        value={itemNameUz}
                        onChange={(e) => setItemNameUz(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇷🇺 Nomi (Ruscha)</label>
                      <input
                        type="text"
                        placeholder="Пластиковый крюк..."
                        value={itemNameRu}
                        onChange={(e) => setItemNameRu(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇬🇧 Nomi (Inglizcha)</label>
                      <input
                        type="text"
                        placeholder="Plastic Hook..."
                        value={itemNameEn}
                        onChange={(e) => setItemNameEn(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇺🇿 Tavsif (O'zbekcha)</label>
                      <textarea
                        rows={2}
                        placeholder="Ushbu buyum nima uchun ishlatiladi..."
                        value={itemDescUz}
                        onChange={(e) => setItemDescUz(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇷🇺 Tavsif (Ruscha)</label>
                      <textarea
                        rows={2}
                        placeholder="Описание предмета..."
                        value={itemDescRu}
                        onChange={(e) => setItemDescRu(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">🇬🇧 Tavsif (Inglizcha)</label>
                      <textarea
                        rows={2}
                        placeholder="Item description..."
                        value={itemDescEn}
                        onChange={(e) => setItemDescEn(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Crafting Recipe & Ingredients Section */}
                  <div className="bg-[#0b1424] border border-white/10 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs font-bold text-[#00e5ff] flex items-center gap-1.5">
                        <Hammer className="w-4 h-4" />
                        <span>Crafting Retsepti & Ingredientlar</span>
                      </span>
                      <span className="text-[11px] text-slate-400">Raft Fandom kabi ko'p ingredientli retsept</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">Dastgoh / Stanok (Station)</label>
                        <input
                          type="text"
                          placeholder="Dastgoh (Work Bench), Oddiy Gril, Eritish pechi, Qo'lda..."
                          value={itemStation}
                          onChange={(e) => setItemStation(e.target.value)}
                          className="w-full bg-[#070e17] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">Tayyorlanish Vaqti (Craft Time)</label>
                        <input
                          type="text"
                          placeholder="Tezkor, 5 soniya, 10 soniya..."
                          value={itemCraftTime}
                          onChange={(e) => setItemCraftTime(e.target.value)}
                          className="w-full bg-[#070e17] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    {/* Dynamic Ingredients List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-300">Retseptdagi Ingredientlar</label>
                        <button
                          type="button"
                          onClick={handleAddIngredientRow}
                          className="text-xs text-[#00e5ff] hover:underline flex items-center gap-1 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Ingredient qo'shish</span>
                        </button>
                      </div>

                      {itemIngredients.map((ing, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Ingredient nomi (masalan: Taxta / Plank, Plastik)"
                            value={ing.item}
                            onChange={(e) => handleUpdateIngredientRow(idx, 'item', e.target.value)}
                            className="flex-1 bg-[#070e17] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#00e5ff]"
                          />
                          <input
                            type="number"
                            min={1}
                            placeholder="Soni"
                            value={ing.count}
                            onChange={(e) => handleUpdateIngredientRow(idx, 'count', e.target.value)}
                            className="w-20 bg-[#070e17] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white text-center outline-none"
                          />
                          {itemIngredients.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveIngredientRow(idx)}
                              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg border border-red-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attributes Section (Damage, Durability, Health, Hunger, etc.) */}
                  <div className="bg-[#0b1424] border border-white/10 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span>Xususiyatlar & Parametrlar (Attributes)</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleAddAttributeRow}
                        className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Xususiyat qo'shish</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {itemAttributes.map((attr, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Xususiyat nomi (masalan: Chidamlilik, Zarar, Kislorod)"
                            value={attr.key}
                            onChange={(e) => handleUpdateAttributeRow(idx, 'key', e.target.value)}
                            className="flex-1 bg-[#070e17] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
                          />
                          <input
                            type="text"
                            placeholder="Qiymati (masalan: 100 urish, +25 HP, 40 soniya)"
                            value={attr.value}
                            onChange={(e) => handleUpdateAttributeRow(idx, 'value', e.target.value)}
                            className="flex-1 bg-[#070e17] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveAttributeRow(idx)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg border border-red-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fandom Drops & XP Gained */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0b1424] border border-white/10 rounded-xl p-3.5">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        🎁 O'ljalar / Droplar (Notable drops, vergul bilan)
                      </label>
                      <input
                        type="text"
                        placeholder="ARC Synthetic Resin, Sensors, Snitch Scanner..."
                        value={itemDrops}
                        onChange={(e) => setItemDrops(e.target.value)}
                        className="w-full bg-[#070e17] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        ⭐ XP / Mukofot (XP Gained)
                      </label>
                      <input
                        type="text"
                        placeholder="Destroy: +100 | Loot: +200..."
                        value={itemXpGained}
                        onChange={(e) => setItemXpGained(e.target.value)}
                        className="w-full bg-[#070e17] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  {/* Location & Tips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Qayerdan Topish Mumkin (Location)</label>
                      <input
                        type="text"
                        placeholder="Masalan: Riflar ostida, Katta orollarda, Bochkalar ichida..."
                        value={itemLocation}
                        onChange={(e) => setItemLocation(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Maslahatlar & Yo'riqnoma (Tips & Tricks)</label>
                      <input
                        type="text"
                        placeholder="Masalan: Birinchi bo'lib qarmog'ingizni yasang, akuladan ehtiyot bo'ling..."
                        value={itemTipsUz}
                        onChange={(e) => setItemTipsUz(e.target.value)}
                        className="w-full bg-[#0b1424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-purple-500 hover:bg-purple-400 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Fandom Buyumi va Retseptini Saqlash</span>
                    </button>
                  </div>
                </form>

                {/* List of Existing Items in this Game */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-300">
                    "{itemGame.name}" O'yini Buyumlari ({itemGame.items?.length || 0})
                  </h4>

                  {itemGame.items && itemGame.items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {itemGame.items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#070e17] border border-white/10 rounded-xl p-3 flex flex-col justify-between gap-3 hover:border-white/20 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-3xl w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 flex-shrink-0">
                              {item.icon}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-white">{item.name.uz}</span>
                                {item.tier && (
                                  <span className="text-[10px] bg-white/10 text-slate-300 px-1.5 py-0.5 rounded font-bold">
                                    {item.tier}
                                  </span>
                                )}
                                <span className="text-[10px] font-mono text-[#00e5ff] bg-[#00e5ff]/10 px-1.5 py-0.5 rounded uppercase">
                                  {item.rarity}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                                {item.description.uz}
                              </p>

                              {/* Recipe summary */}
                              {item.recipe?.ingredients && item.recipe.ingredients.length > 0 && (
                                <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-1.5 mt-2">
                                  🔨 <strong>Retsept:</strong> {item.recipe.ingredients.map(i => `${i.count}x ${i.item}`).join(', ')}
                                  {item.recipe.station && <span className="text-slate-400"> ({item.recipe.station})</span>}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`"${item.name.uz}" buyumini o'chirishga ishonchingiz komilmi?`)) {
                                  deleteWikiItem(itemGame.id, item.id);
                                  showNotification("Buyum o'chirildi.");
                                }
                              }}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>O'chirish</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs bg-[#070e17] rounded-xl border border-dashed border-white/10">
                      Ushbu o'yinda hozircha buyumlar mavjud emas. Yuqoridagi formadan foydalanib birinchi buyumni qo'shing.
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};
