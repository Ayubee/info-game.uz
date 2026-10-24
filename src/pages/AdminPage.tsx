import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, PlusCircle, Gamepad2, Newspaper, Database, CheckCircle, 
  ExternalLink, Image as ImageIcon, Video, Edit3, Trash2, X, Sparkles, 
  DownloadCloud, RefreshCw, Upload, FileImage, CloudLightning, Flame, Globe
} from 'lucide-react';
import { Game, NewsArticle, WikiItem } from '../types';

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
  const [gameOverviewArticleUz, setGameOverviewArticleUz] = useState('');

  // Form State: Add News
  const [newsTitleUz, setNewsTitleUz] = useState('');
  const [newsSummaryUz, setNewsSummaryUz] = useState('');
  const [newsContentUz, setNewsContentUz] = useState('');
  const [newsCover, setNewsCover] = useState<string>('');
  const [newsVideoUrl, setNewsVideoUrl] = useState('');
  const [newsGameId, setNewsGameId] = useState('raft');
  const [newsTags, setNewsTags] = useState('Patch, Reliz, O\'yinlar');
  const [newsAuthor, setNewsAuthor] = useState('Bosh Muharrir');
  const [newsExpectedReleaseDate, setNewsExpectedReleaseDate] = useState('');

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

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitleUz.trim()) return;

    addNews({
      title: { uz: newsTitleUz, ru: newsTitleUz, en: newsTitleUz },
      summary: { uz: newsSummaryUz, ru: newsSummaryUz, en: newsSummaryUz },
      content: { uz: newsContentUz, ru: newsContentUz, en: newsContentUz },
      coverImage: newsCover || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      videoUrl: newsVideoUrl.trim() || undefined,
      gameId: newsGameId,
      tags: newsTags.split(',').map((t) => t.trim()),
      author: newsAuthor,
      expectedReleaseDate: newsExpectedReleaseDate.trim() || undefined,
    });

    setNewsTitleUz('');
    setNewsSummaryUz('');
    setNewsContentUz('');
    setNewsCover('');
    setNewsVideoUrl('');
    setNewsExpectedReleaseDate('');
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

    updateNews(editingNews.id, editingNews);
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
                <h1 className="text-2xl font-black text-white">Boshqaruv Paneli (Admin CMS)</h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                  isFirebaseConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {isFirebaseConnected ? "Google Firebase Faol (Jonli Baza)" : "Lokal Rejim"}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Barcha postlar, o'yinlar, kompyuterdan rasm yuklash va Google Firebase bepul bazasi orqali butun dunyoga jonli ulash.
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
            <span>📰 Yangiliklar & Postlar ({news.length})</span>
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
            <span>🎮 O'yinlar Ensiklopediyasi & Sharhlari ({games.length})</span>
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
            <span>🔥 Google Firebase Baza Holati</span>
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
                    className="w-full bg-[#070e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
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

              {/* Title & Texts */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Sarlavha (Title) *</label>
                  <input
                    type="text"
                    required
                    value={newsTitleUz}
                    onChange={(e) => setNewsTitleUz(e.target.value)}
                    placeholder="Maqola sarlavhasi..."
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
                <span className="text-xs text-slate-400 font-normal">Tahrirlash yoki o'chirish</span>
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
                        <div className="text-[10px] text-slate-400">{game.releaseDateExact || game.releaseYear} • {game.developer}</div>
                        <div className="text-[10px] text-[#00e5ff] mt-0.5">Ensiklopediya sharhi mavjud</div>
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

      </div>
    </div>
  );
};
