import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, PlusCircle, Gamepad2, Newspaper, Database, CheckCircle, 
  ExternalLink, Image, Video, Edit3, Trash2, X, Sparkles, DownloadCloud, RefreshCw
} from 'lucide-react';
import { Game, NewsArticle, WikiItem } from '../types';

export const AdminPage: React.FC = () => {
  const { 
    games, news, t,
    addGame, updateGame, deleteGame,
    addNews, updateNews, deleteNews,
    addWikiItem, updateWikiItem, deleteWikiItem,
    importGameFromSource 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'games' | 'news' | 'wiki' | 'import'>('games');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // ----------------------------------------------------
  // Edit State Modals
  // ----------------------------------------------------
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editingWikiItem, setEditingWikiItem] = useState<{ gameId: string; item: WikiItem } | null>(null);

  // ----------------------------------------------------
  // Form State: Add Game
  // ----------------------------------------------------
  const [gameName, setGameName] = useState('');
  const [gameYear, setGameYear] = useState('2024');
  const [gameDeveloper, setGameDeveloper] = useState('');
  const [gameGenres, setGameGenres] = useState('Survival, Action, Open World');
  const [gameCover, setGameCover] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');
  const [gameSourceUrl, setGameSourceUrl] = useState('');
  const [gameTaglineUz, setGameTaglineUz] = useState('');
  const [gameDescUz, setGameDescUz] = useState('');

  // ----------------------------------------------------
  // Form State: Add News
  // ----------------------------------------------------
  const [newsTitleUz, setNewsTitleUz] = useState('');
  const [newsSummaryUz, setNewsSummaryUz] = useState('');
  const [newsContentUz, setNewsContentUz] = useState('');
  const [newsCover, setNewsCover] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80');
  const [newsVideoUrl, setNewsVideoUrl] = useState('');
  const [newsGameId, setNewsGameId] = useState('raft');
  const [newsTags, setNewsTags] = useState('Patch, Reliz, O\'yinlar');
  const [newsAuthor, setNewsAuthor] = useState('Bosh Muharrir');

  // ----------------------------------------------------
  // Form State: Add Wiki Item
  // ----------------------------------------------------
  const [wikiGameId, setWikiGameId] = useState('raft');
  const [wikiCategory, setWikiCategory] = useState('resources');
  const [wikiNameUz, setWikiNameUz] = useState('');
  const [wikiTier, setWikiTier] = useState('Tier 1');
  const [wikiRarity, setWikiRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>('common');
  const [wikiIcon, setWikiIcon] = useState('💎');
  const [wikiDescUz, setWikiDescUz] = useState('');
  const [wikiIngredient, setWikiIngredient] = useState('Plank (O\'tin)');
  const [wikiIngredientCount, setWikiIngredientCount] = useState(2);

  // ----------------------------------------------------
  // Form State: Auto Importer
  // ----------------------------------------------------
  const [importUrl, setImportUrl] = useState('https://raft.fandom.com');
  const [importGameTitle, setImportGameTitle] = useState('');

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4500);
  };

  // ----------------------------------------------------
  // Handlers: Create
  // ----------------------------------------------------
  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim()) return;

    addGame({
      name: gameName,
      releaseYear: gameYear,
      developer: gameDeveloper || "Noma'lum",
      genre: gameGenres.split(',').map((g) => g.trim()),
      coverImage: gameCover,
      sourceUrl: gameSourceUrl.trim() || undefined,
      tagline: { uz: gameTaglineUz || gameName, ru: gameName, en: gameName },
      description: { uz: gameDescUz || '', ru: '', en: '' },
    });

    setGameName('');
    setGameTaglineUz('');
    setGameDescUz('');
    setGameSourceUrl('');
    showNotification("Yangi o'yin muvaffaqiyatli qo'shildi!");
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitleUz.trim()) return;

    addNews({
      title: { uz: newsTitleUz, ru: newsTitleUz, en: newsTitleUz },
      summary: { uz: newsSummaryUz, ru: newsSummaryUz, en: newsSummaryUz },
      content: { uz: newsContentUz, ru: newsContentUz, en: newsContentUz },
      coverImage: newsCover,
      videoUrl: newsVideoUrl.trim() || undefined,
      gameId: newsGameId,
      tags: newsTags.split(',').map((t) => t.trim()),
      author: newsAuthor,
    });

    setNewsTitleUz('');
    setNewsSummaryUz('');
    setNewsContentUz('');
    setNewsVideoUrl('');
    showNotification("Yangilik muvaffaqiyatli chop etildi!");
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

  // ----------------------------------------------------
  // Handler: Smart Source Auto-Import
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // Handlers: Save Updates
  // ----------------------------------------------------
  const handleSaveNewsEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    updateNews(editingNews.id, editingNews);
    setEditingNews(null);
    showNotification("Maqola muvaffaqiyatli tahrirlandi va yangilandi!");
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
                <h1 className="text-2xl font-black text-white">Boshqaruv Paneli (Admin CMS)</h1>
                <span className="text-[10px] font-bold bg-[#00e5ff]/20 text-[#00e5ff] px-2 py-0.5 rounded">
                  To'liq Tahrirlash & Import
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Barcha postlar, yangiliklar va o'yinlarni qo'shish, tahrirlash hamda manbadan avtomatik yuklash.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-[#070e17] px-4 py-2 rounded-xl border border-white/10 font-mono">
            Bazada: <strong className="text-white">{games.length} ta o'yin</strong> | <strong className="text-white">{news.length} ta post</strong>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] p-4 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'import'
                ? 'bg-[#00e5ff] text-[#070e17] shadow-lg shadow-[#00e5ff]/20'
                : 'bg-[#0b1424] text-[#00e5ff] hover:bg-white/5 border border-[#00e5ff]/30'
            }`}
          >
            <DownloadCloud className="w-4 h-4" />
            <span>⚡ Istochnikdan Avtomatik Yuklash</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'news'
                ? 'bg-[#00e5ff] text-[#070e17] shadow-lg shadow-[#00e5ff]/20'
                : 'bg-[#0b1424] text-slate-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Postlar & Yangiliklar ({news.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'games'
                ? 'bg-[#00e5ff] text-[#070e17] shadow-lg shadow-[#00e5ff]/20'
                : 'bg-[#0b1424] text-slate-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>O'yinlar ({games.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wiki')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'wiki'
                ? 'bg-[#00e5ff] text-[#070e17] shadow-lg shadow-[#00e5ff]/20'
                : 'bg-[#0b1424] text-slate-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Wiki Buyumlar & Retseptlar</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB: AUTO-IMPORTER (Fandom / Source URL to Database)     */}
        {/* ========================================================= */}
        {activeTab === 'import' && (
          <div className="bg-[#0b1424] border border-[#00e5ff]/40 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00e5ff]" />
                  <span>Istochnik (Manba) Ssilkasidan Ma'lumotlarni Avtomatik Yuklash</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Har qanday Fandom Wiki (masalan: <code>https://raft.fandom.com</code>, <code>https://rust.fandom.com</code>) ssilkasini kiritsangiz, tizim o'sha o'yinning barcha retseptlari, xaritalari va parametrlarini avtomatik bazaga qo'shadi!
                </p>
              </div>
            </div>

            <form onSubmit={handleAutoImport} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#00e5ff] block mb-1">
                    Istochnik Sayt Ssilkasi (Fandom Wiki URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="https://raft.fandom.com yoki https://theforest.fandom.com"
                    className="w-full bg-[#070e17] border border-[#00e5ff]/30 focus:border-[#00e5ff] rounded-xl px-4 py-3 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    O'yin Nomi (Ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={importGameTitle}
                    onChange={(e) => setImportGameTitle(e.target.value)}
                    placeholder="Avtomatik aniqlanadi..."
                    className="w-full bg-[#070e17] border border-white/10 focus:border-[#00e5ff] rounded-xl px-4 py-3 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Quick sample chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>Tezkor namunalar:</span>
                <button
                  type="button"
                  onClick={() => setImportUrl('https://raft.fandom.com')}
                  className="bg-white/5 hover:bg-white/10 text-[#00e5ff] px-2.5 py-1 rounded-lg border border-white/10"
                >
                  🌊 Raft Fandom Wiki
                </button>
                <button
                  type="button"
                  onClick={() => setImportUrl('https://rust.fandom.com')}
                  className="bg-white/5 hover:bg-white/10 text-amber-400 px-2.5 py-1 rounded-lg border border-white/10"
                >
                  🏹 Rust Fandom Wiki
                </button>
                <button
                  type="button"
                  onClick={() => setImportUrl('https://theforest.fandom.com')}
                  className="bg-white/5 hover:bg-white/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-white/10"
                >
                  🌲 The Forest Fandom Wiki
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isImporting}
                  className="bg-[#00e5ff] hover:bg-[#38bdf8] text-[#070e17] font-black text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#00e5ff]/20 flex items-center gap-2"
                >
                  {isImporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                  <span>{isImporting ? "Yuklanmoqda..." : "Ushbu Manbadan Saytga Ma'lumotlarni Qo'shish"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: NEWS & POSTS MANAGEMENT (Add, List, Edit, Delete) */}
        {/* ========================================================= */}
        {activeTab === 'news' && (
          <div className="space-y-8">
            {/* Create News Form */}
            <form onSubmit={handleCreateNews} className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#00e5ff]" />
                <span>Yangi Post / Maqola / Video Qo'shish</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Bog'langan O'yin</label>
                  <select
                    value={newsGameId}
                    onChange={(e) => setNewsGameId(e.target.value)}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                  >
                    <option value="all">Barcha O'yinlar (Umumiy)</option>
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Muallif</label>
                  <input
                    type="text"
                    value={newsAuthor}
                    onChange={(e) => setNewsAuthor(e.target.value)}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                  />
                </div>
              </div>

              {/* Media */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                    <Image className="w-3.5 h-3.5 text-[#00e5ff]" />
                    <span>Muqova Rasmi URL *</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={newsCover}
                    onChange={(e) => setNewsCover(e.target.value)}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                    <Video className="w-3.5 h-3.5 text-[#ff4655]" />
                    <span>Video Ssilka (YouTube Embed, ixtiyoriy)</span>
                  </label>
                  <input
                    type="url"
                    value={newsVideoUrl}
                    onChange={(e) => setNewsVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Sarlavha (Title) *</label>
                  <input
                    type="text"
                    required
                    value={newsTitleUz}
                    onChange={(e) => setNewsTitleUz(e.target.value)}
                    placeholder="Sarlavha..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Qisqacha Tavsif</label>
                  <textarea
                    rows={2}
                    value={newsSummaryUz}
                    onChange={(e) => setNewsSummaryUz(e.target.value)}
                    placeholder="Qisqacha mazmun..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Asosiy Matn (Content)</label>
                  <textarea
                    rows={4}
                    value={newsContentUz}
                    onChange={(e) => setNewsContentUz(e.target.value)}
                    placeholder="To'liq matn..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#00e5ff] text-[#070e17] font-black text-xs px-6 py-2.5 rounded-xl hover:bg-[#38bdf8] transition-colors"
              >
                Maqolani Chop Etish
              </button>
            </form>

            {/* List of Existing Posts (With Edit and Delete Buttons) */}
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
        {/* TAB 2: GAMES MANAGEMENT (Add, List, Edit, Delete)        */}
        {/* ========================================================= */}
        {activeTab === 'games' && (
          <div className="space-y-8">
            {/* Create Game Form */}
            <form onSubmit={handleCreateGame} className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#00e5ff]" />
                <span>Yangi O'yinni Qo'shish</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">O'yin Nomi *</label>
                  <input
                    type="text"
                    required
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    placeholder="Masalan: Raft, Rust, CS2..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Chiqarilgan Yili</label>
                  <input
                    type="text"
                    value={gameYear}
                    onChange={(e) => setGameYear(e.target.value)}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Ishlab chiqaruvchi</label>
                  <input
                    type="text"
                    value={gameDeveloper}
                    onChange={(e) => setGameDeveloper(e.target.value)}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Janrlar</label>
                  <input
                    type="text"
                    value={gameGenres}
                    onChange={(e) => setGameGenres(e.target.value)}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Source URL with auto-import hint */}
              <div className="bg-[#070e17] border border-[#00e5ff]/20 p-4 rounded-xl space-y-2">
                <label className="text-xs font-bold text-[#00e5ff] flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Istochnik / Manba Sayt Ssilkasi (Ixtiyoriy, Majburiy Emas)</span>
                </label>
                <input
                  type="url"
                  value={gameSourceUrl}
                  onChange={(e) => setGameSourceUrl(e.target.value)}
                  placeholder="https://raft.fandom.com (agar yo'q bo'lsa bo'sh qoldiring)"
                  className="w-full bg-[#0b1424] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#00e5ff] text-[#070e17] font-black text-xs px-6 py-2.5 rounded-xl hover:bg-[#38bdf8] transition-colors"
              >
                O'yinni Saqlash
              </button>
            </form>

            {/* List of Existing Games */}
            <div className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>Mavjud O'yinlar ({games.length})</span>
                <span className="text-xs text-slate-400 font-normal">O'yin ma'lumotlarini o'zgartirish yoki manbasini yangilash</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="bg-[#070e17] border border-white/5 rounded-xl p-4 flex flex-col justify-between gap-3 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={game.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-white">{game.name}</h4>
                        <div className="text-[10px] text-slate-400">{game.releaseYear} • {game.developer}</div>
                        <div className="text-[10px] text-[#00e5ff] mt-0.5">{game.items?.length || 0} ta maqola</div>
                        {game.sourceUrl && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                            🔗 {game.sourceUrl}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
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
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: WIKI ITEMS & RECIPES (Add, List, Edit, Delete)     */}
        {/* ========================================================= */}
        {activeTab === 'wiki' && (
          <div className="space-y-8">
            {/* Create Item Form */}
            <form onSubmit={handleCreateWikiItem} className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#00e5ff]" />
                <span>Yangi Wiki Buyum / Retsept / Ruda Qo'shish</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">O'yinni Tanlang</label>
                  <select
                    value={wikiGameId}
                    onChange={(e) => setWikiGameId(e.target.value)}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Kategoriya</label>
                  <select
                    value={wikiCategory}
                    onChange={(e) => setWikiCategory(e.target.value)}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="resources">Resurslar / Minerallar</option>
                    <option value="crafting">Asboblar & Qurollar</option>
                    <option value="food">Oshpazlik & Taomlar</option>
                    <option value="locations">Orollar / Xaritalar</option>
                    <option value="machinery">Mexanizmlar</option>
                    <option value="creatures">Dushmanlar & Jonivorlar</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Ikonka (Emoji)</label>
                  <input
                    type="text"
                    value={wikiIcon}
                    onChange={(e) => setWikiIcon(e.target.value)}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Buyum Nomi *</label>
                  <input
                    type="text"
                    required
                    value={wikiNameUz}
                    onChange={(e) => setWikiNameUz(e.target.value)}
                    placeholder="Temir Nayza, Titan Quymasi..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Tier / Daraja</label>
                  <input
                    type="text"
                    value={wikiTier}
                    onChange={(e) => setWikiTier(e.target.value)}
                    placeholder="Tier 1, S-Rank, Epic..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Tavsif</label>
                <textarea
                  rows={2}
                  value={wikiDescUz}
                  onChange={(e) => setWikiDescUz(e.target.value)}
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-[#00e5ff] text-[#070e17] font-black text-xs px-6 py-2.5 rounded-xl hover:bg-[#38bdf8] transition-colors"
              >
                Wiki Buyumini Saqlash
              </button>
            </form>

            {/* List and Edit Existing Wiki Items by Game */}
            <div className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-base font-bold text-white">Mavjud Wiki Maqolalar & Retseptlar</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Ko'rish uchun o'yin:</span>
                  <select
                    value={wikiGameId}
                    onChange={(e) => setWikiGameId(e.target.value)}
                    className="bg-[#070e17] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                  >
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items Table */}
              <div className="divide-y divide-white/5 bg-[#070e17] border border-white/10 rounded-xl overflow-hidden">
                {games.find((g) => g.id === wikiGameId)?.items?.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Ushbu o'yinda hozircha wiki maqolalar mavjud emas.
                  </div>
                ) : (
                  games.find((g) => g.id === wikiGameId)?.items?.map((item) => (
                    <div key={item.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-white">{t(item.name)}</div>
                          <div className="text-[10px] text-slate-400">
                            {item.category} • {item.tier || 'Oddiy'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingWikiItem({ gameId: wikiGameId, item })}
                          className="bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>O'zgartirish</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`"${t(item.name)}" buyumini o'chirishga ishonchingiz komilmi?`)) {
                              deleteWikiItem(wikiGameId, item.id);
                              showNotification("Buyum o'chirildi.");
                            }
                          }}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>O'chirish</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* EDIT MODAL: NEWS EDIT                                    */}
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
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Sarlavha</label>
                  <input
                    type="text"
                    required
                    value={editingNews.title.uz}
                    onChange={(e) => setEditingNews({
                      ...editingNews,
                      title: { ...editingNews.title, uz: e.target.value }
                    })}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Muqova Rasmi URL</label>
                  <input
                    type="url"
                    value={editingNews.coverImage}
                    onChange={(e) => setEditingNews({ ...editingNews, coverImage: e.target.value })}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Video Ssilka (YouTube embed)</label>
                  <input
                    type="url"
                    value={editingNews.videoUrl || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
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

        {/* ========================================================= */}
        {/* EDIT MODAL: GAME EDIT                                    */}
        {/* ========================================================= */}
        {editingGame && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0b1424] border border-[#00e5ff]/50 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white">O'yin Ma'lumotlarini Tahrirlash</h3>
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
                  <label className="text-xs font-bold text-slate-300 block mb-1">Istochnik / Manba Sayt Ssilkasi</label>
                  <input
                    type="url"
                    value={editingGame.sourceUrl || ''}
                    onChange={(e) => setEditingGame({ ...editingGame, sourceUrl: e.target.value })}
                    placeholder="https://raft.fandom.com"
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Qisqa Shior (Tagline)</label>
                  <input
                    type="text"
                    value={editingGame.tagline.uz}
                    onChange={(e) => setEditingGame({
                      ...editingGame,
                      tagline: { ...editingGame.tagline, uz: e.target.value }
                    })}
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
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

        {/* ========================================================= */}
        {/* EDIT MODAL: WIKI ITEM EDIT                               */}
        {/* ========================================================= */}
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

      </div>
    </div>
  );
};
