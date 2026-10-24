import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, PlusCircle, Gamepad2, Newspaper, Database, CheckCircle, ExternalLink, Image, Video } from 'lucide-react';
import { Game, NewsArticle, WikiItem } from '../types';

export const AdminPage: React.FC = () => {
  const { games, news, addGame, addNews, addWikiItem } = useApp();
  const [activeTab, setActiveTab] = useState<'games' | 'news' | 'wiki'>('games');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // ----------------------------------------------------
  // Form State: Add Game
  // ----------------------------------------------------
  const [gameName, setGameName] = useState('');
  const [gameYear, setGameYear] = useState('2024');
  const [gameDeveloper, setGameDeveloper] = useState('');
  const [gameGenres, setGameGenres] = useState('Survival, Action, Open World');
  const [gameCover, setGameCover] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');
  const [gameSourceUrl, setGameSourceUrl] = useState(''); // Optional! e.g. https://raft.fandom.com
  
  // Game Translations
  const [gameTaglineUz, setGameTaglineUz] = useState('');
  const [gameTaglineRu, setGameTaglineRu] = useState('');
  const [gameTaglineEn, setGameTaglineEn] = useState('');

  const [gameDescUz, setGameDescUz] = useState('');
  const [gameDescRu, setGameDescRu] = useState('');
  const [gameDescEn, setGameDescEn] = useState('');

  // ----------------------------------------------------
  // Form State: Add News Article
  // ----------------------------------------------------
  const [newsTitleUz, setNewsTitleUz] = useState('');
  const [newsTitleRu, setNewsTitleRu] = useState('');
  const [newsTitleEn, setNewsTitleEn] = useState('');

  const [newsSummaryUz, setNewsSummaryUz] = useState('');
  const [newsSummaryRu, setNewsSummaryRu] = useState('');
  const [newsSummaryEn, setNewsSummaryEn] = useState('');

  const [newsContentUz, setNewsContentUz] = useState('');
  const [newsContentRu, setNewsContentRu] = useState('');
  const [newsContentEn, setNewsContentEn] = useState('');

  const [newsCover, setNewsCover] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80');
  const [newsVideoUrl, setNewsVideoUrl] = useState(''); // Video link (e.g. YouTube embed)
  const [newsGameId, setNewsGameId] = useState('raft');
  const [newsTags, setNewsTags] = useState('Patch, Reliz, O\'yinlar');
  const [newsAuthor, setNewsAuthor] = useState('Bosh Muharrir');

  // ----------------------------------------------------
  // Form State: Add Wiki Item
  // ----------------------------------------------------
  const [wikiGameId, setWikiGameId] = useState('raft');
  const [wikiCategory, setWikiCategory] = useState('resources');
  const [wikiNameUz, setWikiNameUz] = useState('');
  const [wikiNameRu, setWikiNameRu] = useState('');
  const [wikiNameEn, setWikiNameEn] = useState('');
  const [wikiTier, setWikiTier] = useState('Tier 1');
  const [wikiRarity, setWikiRarity] = useState<'common' | 'rare' | 'epic' | 'legendary'>('common');
  const [wikiIcon, setWikiIcon] = useState('💎');
  const [wikiDescUz, setWikiDescUz] = useState('');
  const [wikiDescRu, setWikiDescRu] = useState('');
  const [wikiDescEn, setWikiDescEn] = useState('');
  const [wikiIngredient, setWikiIngredient] = useState('Plank (O\'tin)');
  const [wikiIngredientCount, setWikiIngredientCount] = useState(2);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim()) return;

    addGame({
      name: gameName,
      releaseYear: gameYear,
      developer: gameDeveloper || "Noma'lum",
      genre: gameGenres.split(',').map((g) => g.trim()),
      coverImage: gameCover,
      sourceUrl: gameSourceUrl.trim() || undefined, // Optional!
      tagline: {
        uz: gameTaglineUz || gameName,
        ru: gameTaglineRu || gameName,
        en: gameTaglineEn || gameName,
      },
      description: {
        uz: gameDescUz || '',
        ru: gameDescRu || '',
        en: gameDescEn || '',
      },
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
      title: {
        uz: newsTitleUz,
        ru: newsTitleRu || newsTitleUz,
        en: newsTitleEn || newsTitleUz,
      },
      summary: {
        uz: newsSummaryUz,
        ru: newsSummaryRu || newsSummaryUz,
        en: newsSummaryEn || newsSummaryUz,
      },
      content: {
        uz: newsContentUz,
        ru: newsContentRu || newsContentUz,
        en: newsContentEn || newsContentUz,
      },
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
    showNotification("Yangilik va maqola muvaffaqiyatli chop etildi!");
  };

  const handleCreateWikiItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wikiNameUz.trim()) return;

    const newItem: WikiItem = {
      id: `item-${Date.now()}`,
      name: {
        uz: wikiNameUz,
        ru: wikiNameRu || wikiNameUz,
        en: wikiNameEn || wikiNameUz,
      },
      category: wikiCategory,
      tier: wikiTier,
      rarity: wikiRarity,
      icon: wikiIcon,
      description: {
        uz: wikiDescUz,
        ru: wikiDescRu || wikiDescUz,
        en: wikiDescEn || wikiDescUz,
      },
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

  return (
    <div className="min-h-screen bg-[#070e17] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-[#0b1424] border border-[#00e5ff]/30 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0284c7] to-[#00e5ff] flex items-center justify-center text-[#070e17]">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">Boshqaruv Paneli (Admin CMS)</h1>
                <span className="text-[10px] font-bold bg-[#00e5ff]/20 text-[#00e5ff] px-2 py-0.5 rounded">
                  Maxfiy Rejim
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                O'yinlar, Wiki ma'lumotlar bazasi va yangiliklarni to'g'ridan-to'g'ri boshqaring.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-[#070e17] px-4 py-2 rounded-xl border border-white/10 font-mono">
            Bazada: <strong className="text-white">{games.length} ta o'yin</strong> | <strong className="text-white">{news.length} ta maqola</strong>
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
        <div className="flex gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'games'
                ? 'bg-[#00e5ff] text-[#070e17] shadow-lg shadow-[#00e5ff]/20'
                : 'bg-[#0b1424] text-slate-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>1. Yangi O'yin Qo'shish</span>
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
            <span>2. Yangilik / Video / Maqola</span>
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
            <span>3. Wiki Buyum / Retsept</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ADD GAME FORM                                     */}
        {/* ========================================================= */}
        {activeTab === 'games' && (
          <form onSubmit={handleCreateGame} className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Yangi O'yinni Tizimga Kiritish</h2>
                <p className="text-xs text-slate-400">O'yin nomini, tavsifini va ixtiyoriy ravishda manba saytini kiriting.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">O'yin Nomi *</label>
                <input
                  type="text"
                  required
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="Masalan: The Forest, Subnautica, Dota 2..."
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Chiqarilgan Yili</label>
                <input
                  type="text"
                  value={gameYear}
                  onChange={(e) => setGameYear(e.target.value)}
                  placeholder="2024"
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Ishlab chiqaruvchi (Developer)</label>
                <input
                  type="text"
                  value={gameDeveloper}
                  onChange={(e) => setGameDeveloper(e.target.value)}
                  placeholder="Valve, Mojang, Redbeet..."
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Janrlar (vergul bilan)</label>
                <input
                  type="text"
                  value={gameGenres}
                  onChange={(e) => setGameGenres(e.target.value)}
                  placeholder="Survival, Open World, Co-op"
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                />
              </div>
            </div>

            {/* Optional Source URL (Fandom wiki) */}
            <div className="bg-[#070e17] border border-[#00e5ff]/20 p-4 rounded-xl space-y-2">
              <label className="text-xs font-bold text-[#00e5ff] flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Istochnik / Manba Sayt Ssilkasi (Ixtiyoriy, Majburiy Emas)</span>
              </label>
              <input
                type="url"
                value={gameSourceUrl}
                onChange={(e) => setGameSourceUrl(e.target.value)}
                placeholder="https://raft.fandom.com yoki https://rust.fandom.com (agar yo'q bo'lsa bo'sh qoldiring)"
                className="w-full bg-[#0b1424] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
              />
              <span className="text-[10px] text-slate-400 block">
                Agar ssilka kiritsangiz, foydalanuvchilar o'yin sahifasida rasmiy Fandom manbasiga havola ko'rishlari mumkin bo'ladi.
              </span>
            </div>

            {/* Cover Image */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Muqova Rasmi URL</label>
              <input
                type="url"
                value={gameCover}
                onChange={(e) => setGameCover(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
              />
            </div>

            {/* Multilingual Tagline & Description */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="text-xs font-bold text-[#00e5ff] uppercase tracking-wider">
                Ko'p Tilli Tavsiflar (i18n)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">🇺🇿 Qisqa Shior (O'zbekcha)</label>
                  <input
                    type="text"
                    value={gameTaglineUz}
                    onChange={(e) => setGameTaglineUz(e.target.value)}
                    placeholder="O'yin haqida qisqa..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">🇷🇺 Краткий слоган (Русский)</label>
                  <input
                    type="text"
                    value={gameTaglineRu}
                    onChange={(e) => setGameTaglineRu(e.target.value)}
                    placeholder="Кратко об игре..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">🇬🇧 Short Tagline (English)</label>
                  <input
                    type="text"
                    value={gameTaglineEn}
                    onChange={(e) => setGameTaglineEn(e.target.value)}
                    placeholder="Short tagline..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">To'liq Tavsif (O'zbekcha)</label>
                <textarea
                  rows={3}
                  value={gameDescUz}
                  onChange={(e) => setGameDescUz(e.target.value)}
                  placeholder="O'yin haqida batafsil ma'lumot..."
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00e5ff]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#00e5ff] text-[#070e17] font-black text-xs px-6 py-3 rounded-xl hover:bg-[#38bdf8] transition-colors shadow-lg shadow-[#00e5ff]/20 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>O'yinni Bazaga Saqlash</span>
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ADD NEWS ARTICLE FORM                             */}
        {/* ========================================================= */}
        {activeTab === 'news' && (
          <form onSubmit={handleCreateNews} className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Yangi Maqola, Patch yoki Video Chop Etish</h2>
                <p className="text-xs text-slate-400">Rasm, matn va video ssilkasi bilan to'liq yangilik joylang.</p>
              </div>
            </div>

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

            {/* Media: Image & Video URL */}
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
                  placeholder="https://..."
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

            {/* Multilingual Title */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="text-xs font-bold text-[#00e5ff] uppercase tracking-wider">
                Sarlavha (3 Tilda)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">🇺🇿 O'zbekcha *</label>
                  <input
                    type="text"
                    required
                    value={newsTitleUz}
                    onChange={(e) => setNewsTitleUz(e.target.value)}
                    placeholder="Sarlavha..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">🇷🇺 Русский</label>
                  <input
                    type="text"
                    value={newsTitleRu}
                    onChange={(e) => setNewsTitleRu(e.target.value)}
                    placeholder="Заголовок..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">🇬🇧 English</label>
                  <input
                    type="text"
                    value={newsTitleEn}
                    onChange={(e) => setNewsTitleEn(e.target.value)}
                    placeholder="Title..."
                    className="w-full bg-[#070e17] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Multilingual Content */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Qisqacha Tavsif (Lead text)</label>
                <textarea
                  rows={2}
                  value={newsSummaryUz}
                  onChange={(e) => setNewsSummaryUz(e.target.value)}
                  placeholder="Maqola haqida 1-2 jumlalik xulosa..."
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00e5ff]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Asosiy Matn (Content)</label>
                <textarea
                  rows={5}
                  value={newsContentUz}
                  onChange={(e) => setNewsContentUz(e.target.value)}
                  placeholder="Yangilikning to'liq matnini kiriting..."
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00e5ff]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Teglar (vergul bilan)</label>
              <input
                type="text"
                value={newsTags}
                onChange={(e) => setNewsTags(e.target.value)}
                placeholder="Raft, Yangilanish, Patch"
                className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-[#00e5ff] text-[#070e17] font-black text-xs px-6 py-3 rounded-xl hover:bg-[#38bdf8] transition-colors shadow-lg shadow-[#00e5ff]/20 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Maqolani Chop Etish</span>
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ADD WIKI ITEM FORM                                */}
        {/* ========================================================= */}
        {activeTab === 'wiki' && (
          <form onSubmit={handleCreateWikiItem} className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Yangi Wiki Buyum yoki Retsept Qo'shish</h2>
                <p className="text-xs text-slate-400">O'yinga yangi asbob, taom, ruda yoki qurol ma'lumotlarini biriktiring.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">O'yinni Tanlang</label>
                <select
                  value={wikiGameId}
                  onChange={(e) => setWikiGameId(e.target.value)}
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
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
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
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
                  placeholder="💎, 🦈, 🍲, 🔫"
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none text-center text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Buyum Nomi (O'zbekcha) *</label>
                <input
                  type="text"
                  required
                  value={wikiNameUz}
                  onChange={(e) => setWikiNameUz(e.target.value)}
                  placeholder="Masalan: Temir Nayza, Titan Quymasi..."
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Tier / Daraja</label>
                <input
                  type="text"
                  value={wikiTier}
                  onChange={(e) => setWikiTier(e.target.value)}
                  placeholder="Tier 1, S-Rank, Rare"
                  className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00e5ff]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Tavsif (O'zbekcha)</label>
              <textarea
                rows={3}
                value={wikiDescUz}
                onChange={(e) => setWikiDescUz(e.target.value)}
                placeholder="Buyum nima vazifa bajaradi va qanday ishlatiladi..."
                className="w-full bg-[#070e17] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#00e5ff]"
              />
            </div>

            <div className="p-4 bg-[#070e17] border border-white/10 rounded-xl space-y-3">
              <div className="text-xs font-bold text-[#00e5ff]">
                Retsept Komponenti (Namuna)
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Kerakli Material</label>
                  <input
                    type="text"
                    value={wikiIngredient}
                    onChange={(e) => setWikiIngredient(e.target.value)}
                    className="w-full bg-[#0b1424] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Miqdori</label>
                  <input
                    type="number"
                    value={wikiIngredientCount}
                    onChange={(e) => setWikiIngredientCount(Number(e.target.value))}
                    className="w-full bg-[#0b1424] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#00e5ff] text-[#070e17] font-black text-xs px-6 py-3 rounded-xl hover:bg-[#38bdf8] transition-colors shadow-lg shadow-[#00e5ff]/20 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Wiki Buyumini Saqlash</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
