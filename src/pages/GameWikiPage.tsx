import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WikiItem, WikiCategory } from '../types';
import { 
  Search, ExternalLink, Compass, Shield, Flame, Hammer, 
  MapPin, CheckCircle, ChevronRight, Layers, Sparkles, Filter, 
  Info, ArrowLeft, X, Clock, Award, Crosshair, Wrench, Eye
} from 'lucide-react';

export const GameWikiPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';
  const initialCat = searchParams.get('cat') || 'all';

  const { getGame, t, language } = useApp();
  const game = getGame(gameId || 'arc-raiders') || getGame('raft');

  const [activeCategory, setActiveCategory] = useState<string>(initialCat);
  const [filterText, setFilterText] = useState<string>(searchKeyword);
  const [selectedModalItem, setSelectedModalItem] = useState<WikiItem | null>(null);

  // Sync category changes with URL query parameter
  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', catId);
    }
    setSearchParams(searchParams, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (searchKeyword) {
      setFilterText(searchKeyword);
    }
  }, [searchKeyword]);

  useEffect(() => {
    const catFromUrl = searchParams.get('cat');
    if (catFromUrl) {
      setActiveCategory(catFromUrl);
    }
  }, [searchParams]);

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{t('wiki.gameNotFound') || "O'yin topilmadi"}</h2>
        <Link to="/wiki" className="text-[#00e5ff] text-sm hover:underline">
          {t('wiki.backToHome') || "Wiki ro'yxatiga qaytish"}
        </Link>
      </div>
    );
  }

  // Active Category details if not 'all'
  const currentCategory = game.categories?.find((c) => c.id === activeCategory);

  // Items filtering
  const categoryItems = activeCategory === 'all'
    ? game.items
    : game.items.filter((i) => i.category === activeCategory);

  const filteredItems = categoryItems.filter((item) => {
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    const nameMatch = t(item.name).toLowerCase().includes(q);
    const descMatch = t(item.description).toLowerCase().includes(q);
    const tipsMatch = item.tips && t(item.tips).toLowerCase().includes(q);
    const dropsMatch = item.drops && item.drops.some((d) => d.toLowerCase().includes(q));
    return nameMatch || descMatch || tipsMatch || dropsMatch;
  });

  // Group items by subcategory if inside a category
  const groupedItems: Record<string, WikiItem[]> = {};
  filteredItems.forEach((item) => {
    const sub = item.subCategory || 'General';
    if (!groupedItems[sub]) {
      groupedItems[sub] = [];
    }
    groupedItems[sub].push(item);
  });

  return (
    <div className="min-h-screen bg-[#070e17] text-slate-100 flex flex-col">
      
      {/* ========================================================= */}
      {/* 1. TOP HEADER & BREADCRUMBS BAR                          */}
      {/* ========================================================= */}
      <div className="bg-[#0b1424] border-b border-white/10 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 flex-wrap">
              <Link to="/" className="hover:text-white">{t('wiki.home') || "Bosh Sahifa"}</Link>
              <span>&gt;</span>
              <Link to="/wiki" className="hover:text-purple-300 text-purple-400 font-semibold">
                {t('nav.wiki') || "O'yinlar Wiki"}
              </Link>
              <span>&gt;</span>
              <button
                onClick={() => handleSelectCategory('all')}
                className={`font-semibold transition-colors ${activeCategory === 'all' ? 'text-[#00e5ff]' : 'text-slate-300 hover:text-white'}`}
              >
                {game.name}
              </button>
              {currentCategory && (
                <>
                  <span>&gt;</span>
                  <span className="text-[#00e5ff] font-bold">{t(currentCategory.name)}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                <span>{game.name}</span>
                <span className="text-slate-500 font-normal text-sm sm:text-base">— Fandom Wiki</span>
              </h1>

              {game.hasCrafting !== false && (
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Hammer className="w-3 h-3" /> Crafting Faol
                </span>
              )}
            </div>
          </div>

          {/* External Source Link */}
          {game.sourceUrl && (
            <a
              href={game.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
            >
              <span>{t('wiki.originalSource') || "Asl Manba: Fandom Wiki"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#00e5ff]" />
            </a>
          )}
        </div>
      </div>

      {/* Non-crafting notice if accessed directly */}
      {game.hasCrafting === false && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-300">
                  Ushbu o'yinda Crafting (hunarmandchilik) tizimi mavjud emas
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  "{game.name}" o'yini faqat yangiliklar, treylerlar va maqolalar uchun kiritilgan. Ushbu o'yinga oid postlarni Yangiliklar bo'limida kuzatishingiz mumkin.
                </p>
              </div>
            </div>
            <Link
              to="/news"
              className="bg-amber-400 text-black font-bold text-xs px-4 py-2 rounded-xl hover:bg-amber-300 flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Yangiliklarni Ko'rish</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-8">

        {/* ========================================================= */}
        {/* VIEW 1: GAME WIKI HUB (When activeCategory === 'all')     */}
        {/* ========================================================= */}
        {activeCategory === 'all' ? (
          <div className="space-y-10">
            
            {/* Hero Welcome Banner (Image 2 style) */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0b1424] p-6 sm:p-10 shadow-2xl">
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{ backgroundImage: `url(${game.coverImage || game.bannerImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b1424] via-[#0b1424]/90 to-transparent" />

              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Rasmiy Hamjamiyat Wiki Boshqaruvi</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  Welcome to the {game.name} Wiki, Raider.
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {t(game.description) || t(game.tagline) || "Ushbu wiki hamjamiyat tomonidan yuritiladigan resurs bo'lib, o'yindagi barcha dushmanlar, xaritalar, qurollar, retseptlar va qo'llanmalarni o'z ichiga oladi."}
                </p>

                {/* Search Bar for this Wiki */}
                <div className="pt-2 max-w-md relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder={`Search the ${game.name} Wiki...`}
                    className="w-full bg-[#070e17]/90 border border-white/15 focus:border-[#00e5ff] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none shadow-xl transition-all"
                  />
                </div>
              </div>
            </div>

            {/* CATEGORIES GRID (Exactly like Image 2) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <span>O'yin Kategoriyalari & Bo'limlar</span>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                      {game.categories?.length || 0} ta
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tafsilotlar, droplar va retseptlarni ko'rish uchun istalgan kategoriyani tanlang:
                  </p>
                </div>
              </div>

              {game.categories && game.categories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                  {game.categories.map((cat) => {
                    const count = game.items.filter((i) => i.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.id)}
                        className="group bg-[#0b1424] hover:bg-[#101d33] border border-white/10 hover:border-purple-500/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer"
                      >
                        <span className="text-4xl w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-purple-500/20 border border-white/10 group-hover:border-purple-500/40 flex items-center justify-center transition-all">
                          {cat.icon || '📦'}
                        </span>
                        
                        <div className="w-full">
                          <span className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors block truncate">
                            {t(cat.name)}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {count} ta element
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#0b1424] border border-dashed border-white/10 rounded-2xl text-xs text-slate-400">
                  Hozircha kategoriyalar mavjud emas.
                </div>
              )}
            </div>

            {/* Game Overview / Full Review Article */}
            {(game.overviewArticle || game.description) && (
              <div className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#00e5ff] uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>Ensiklopediya & Umumiy Sharh</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {game.name} — O'yin Mexanikasi va Tavsifi
                </h3>

                <div className="text-slate-300 text-xs sm:text-sm leading-relaxed space-y-3 whitespace-pre-line">
                  {t(game.overviewArticle) || t(game.description)}
                </div>

                {/* Details Bar */}
                <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-[#070e17] p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Developer</span>
                    <span className="font-bold text-white">{game.developer}</span>
                  </div>
                  <div className="bg-[#070e17] p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Chiqarilgan Yili</span>
                    <span className="font-bold text-[#00e5ff]">{game.releaseDateExact || game.releaseYear}</span>
                  </div>
                  <div className="bg-[#070e17] p-3 rounded-xl border border-white/5 col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Janrlar</span>
                    <span className="font-bold text-slate-200">{game.genre?.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* ========================================================= */
          /* VIEW 2: CATEGORY SPECIFIC VIEW (Image 1 style)           */
          /* ========================================================= */
          <div className="space-y-6">
            
            {/* Back button and Category Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0b1424] border border-white/10 rounded-2xl p-6">
              <div className="space-y-2">
                <button
                  onClick={() => handleSelectCategory('all')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Barcha Kategoriyalarga Qaytish (Hub)</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-3xl w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                    {currentCategory?.icon || '📦'}
                  </span>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      {currentCategory ? t(currentCategory.name) : activeCategory.toUpperCase()}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {currentCategory?.description 
                        ? t(currentCategory.description) 
                        : `${game.name} o'yini bo'yicha ${currentCategory ? t(currentCategory.name) : ''} to'liq katalogi va ma'lumotlari.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Search inside this category */}
              <div className="w-full sm:w-72 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Kategoriya ichidan qidirish..."
                  className="w-full bg-[#070e17] border border-white/10 focus:border-[#00e5ff] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Quick Category Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => handleSelectCategory('all')}
                className="bg-[#0b1424] hover:bg-white/5 border border-white/10 text-slate-300 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 flex-shrink-0"
              >
                <span>🏠</span>
                <span>Hub</span>
              </button>
              {game.categories?.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCategory(c.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
                    activeCategory === c.id
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-[#0b1424] hover:bg-white/5 border border-white/10 text-slate-300'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{t(c.name)}</span>
                </button>
              ))}
            </div>

            {/* RICH FANDOM TABLE LIST (Exactly like Image 1) */}
            {filteredItems.length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedItems).map(([subCatName, subItems]) => (
                  <div key={subCatName} className="space-y-3">
                    
                    {/* Subcategory title banner (e.g. "Security", "Husks", "General") */}
                    {subCatName !== 'General' && (
                      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        <h3 className="text-base font-bold text-white uppercase tracking-wider">
                          {subCatName}
                        </h3>
                        <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                          {subItems.length} ta
                        </span>
                      </div>
                    )}

                    {/* Table View (Fandom style) */}
                    <div className="bg-[#0b1424] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-[#070e17] text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
                              <th className="py-3.5 px-4 w-48 sm:w-64">
                                {currentCategory ? t(currentCategory.name) : "Element"}
                              </th>
                              <th className="py-3.5 px-3 w-16 text-center">Icon</th>
                              <th className="py-3.5 px-4">Notable Drops / Recipe</th>
                              <th className="py-3.5 px-4 w-44">XP / Stats</th>
                              <th className="py-3.5 px-4 min-w-[200px]">Tips & Strategy</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {subItems.map((item) => (
                              <tr 
                                key={item.id} 
                                onClick={() => setSelectedModalItem(item)}
                                className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                              >
                                {/* Column 1: Image & Name */}
                                <td className="py-4 px-4 align-top">
                                  <div className="space-y-2">
                                    {item.image ? (
                                      <div className="w-36 sm:w-44 h-24 sm:h-28 rounded-xl overflow-hidden bg-slate-900 border border-white/10 group-hover:border-purple-400/50 transition-all">
                                        <img 
                                          src={item.image} 
                                          alt={t(item.name)} 
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-20 h-20 rounded-xl bg-[#070e17] border border-white/10 flex items-center justify-center text-3xl">
                                        {item.icon}
                                      </div>
                                    )}

                                    <div>
                                      <div className="font-bold text-sm text-[#00e5ff] group-hover:underline flex items-center gap-1.5">
                                        <span>{t(item.name)}</span>
                                      </div>
                                      {item.tier && (
                                        <span className="text-[10px] text-slate-400 block mt-0.5">
                                          {item.tier}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Column 2: Icon */}
                                <td className="py-4 px-3 align-middle text-center">
                                  <span className="text-2xl w-10 h-10 rounded-xl bg-white/5 border border-white/10 inline-flex items-center justify-center">
                                    {item.icon}
                                  </span>
                                </td>

                                {/* Column 3: Notable drops / Recipe ingredients */}
                                <td className="py-4 px-4 align-top">
                                  {item.drops && item.drops.length > 0 ? (
                                    <ul className="space-y-1 text-slate-200">
                                      {item.drops.map((drop, idx) => (
                                        <li key={idx} className="flex items-center gap-1.5 text-xs">
                                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                                          <span>{drop}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : item.recipe?.ingredients && item.recipe.ingredients.length > 0 ? (
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                                        🔨 Retsept ({item.recipe.station || "Dastgoh"}):
                                      </span>
                                      <ul className="space-y-1 text-slate-200">
                                        {item.recipe.ingredients.map((ing, idx) => (
                                          <li key={idx} className="flex items-center gap-1.5 text-xs">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                            <span>{ing.count}x {ing.item}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ) : (
                                    <span className="text-slate-500 text-[11px]">—</span>
                                  )}
                                </td>

                                {/* Column 4: XP gained / Attributes */}
                                <td className="py-4 px-4 align-top">
                                  {item.xpGained ? (
                                    <div className="space-y-1 text-amber-300 font-mono text-xs">
                                      {item.xpGained.split('|').map((part, idx) => (
                                        <div key={idx} className="flex items-center gap-1">
                                          <span>•</span>
                                          <span>{part.trim()}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : item.attributes && Object.keys(item.attributes).length > 0 ? (
                                    <div className="space-y-1 text-xs">
                                      {Object.entries(item.attributes).slice(0, 3).map(([k, v]) => (
                                        <div key={k} className="text-slate-300">
                                          <strong className="text-slate-400">{k}:</strong> {v}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-slate-500 text-[11px]">—</span>
                                  )}
                                </td>

                                {/* Column 5: Tips & Strategy */}
                                <td className="py-4 px-4 align-top">
                                  {item.tips ? (
                                    <p className="text-slate-300 text-xs leading-relaxed">
                                      {t(item.tips)}
                                    </p>
                                  ) : item.description ? (
                                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                                      {t(item.description)}
                                    </p>
                                  ) : (
                                    <span className="text-slate-500 text-[11px]">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#0b1424] border border-dashed border-white/10 rounded-2xl p-8 space-y-3">
                <Info className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">
                  Ushbu kategoriyada ma'lumotlar topilmadi
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Qidiruv so'zini tozalang yoki Admin panel orqali ushbu kategoriyaga yangi ma'lumotlar qo'shing.
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* ITEM DEEP-DIVE MODAL (Clicking any row in Fandom table)   */}
      {/* ========================================================= */}
      {selectedModalItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1424] border border-purple-500/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                  {selectedModalItem.icon}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>{t(selectedModalItem.name)}</span>
                    {selectedModalItem.tier && (
                      <span className="text-[10px] font-bold bg-white/10 text-slate-300 px-2 py-0.5 rounded uppercase">
                        {selectedModalItem.tier}
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-[#00e5ff] uppercase font-mono">
                    {selectedModalItem.category} {selectedModalItem.subCategory ? `• ${selectedModalItem.subCategory}` : ''}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedModalItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo if available */}
            {selectedModalItem.image && (
              <div className="h-64 w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                <img
                  src={selectedModalItem.image}
                  alt={t(selectedModalItem.name)}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tavsif:</span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {t(selectedModalItem.description)}
              </p>
            </div>

            {/* Notable drops & XP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedModalItem.drops && selectedModalItem.drops.length > 0 && (
                <div className="bg-[#070e17] border border-white/10 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-purple-300 block">🎁 O'ljalar / Droplar:</span>
                  <ul className="space-y-1 text-xs text-slate-200">
                    {selectedModalItem.drops.map((d, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedModalItem.xpGained && (
                <div className="bg-[#070e17] border border-white/10 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-amber-300 block">⭐ XP / Mukofot:</span>
                  <div className="text-xs text-amber-200 font-mono space-y-1">
                    {selectedModalItem.xpGained.split('|').map((part, idx) => (
                      <div key={idx}>• {part.trim()}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recipe if craftable */}
            {selectedModalItem.recipe?.ingredients && selectedModalItem.recipe.ingredients.length > 0 && (
              <div className="bg-[#070e17] border border-emerald-500/20 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-400 block">
                  🔨 Crafting Retsepti ({selectedModalItem.recipe.station || "Dastgoh"}):
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedModalItem.recipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-slate-200">
                      <strong>{ing.count}x</strong> {ing.item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom attributes */}
            {selectedModalItem.attributes && Object.keys(selectedModalItem.attributes).length > 0 && (
              <div className="bg-[#070e17] border border-white/10 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Xususiyatlar va Parametrlar:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedModalItem.attributes).map(([k, v]) => (
                    <div key={k} className="p-2 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-slate-400 block text-[10px]">{k}</span>
                      <span className="font-bold text-white">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips & Tactics */}
            {selectedModalItem.tips && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 space-y-1">
                <span className="text-xs font-bold text-purple-300 block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Maslahatlar & Taktika:</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {t(selectedModalItem.tips)}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setSelectedModalItem(null)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-2 rounded-xl transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
