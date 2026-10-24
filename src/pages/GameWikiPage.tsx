import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WikiItem, WikiCategory } from '../types';
import { 
  Search, ExternalLink, Compass, Shield, Flame, Hammer, 
  MapPin, CheckCircle, ChevronRight, Layers, Sparkles, Filter 
} from 'lucide-react';

export const GameWikiPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';

  const { getGame, t, language } = useApp();
  const game = getGame(gameId || 'raft') || getGame('raft');

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterText, setFilterText] = useState<string>(searchKeyword);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'recipe' | 'tips'>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (searchKeyword) {
      setFilterText(searchKeyword);
    }
  }, [searchKeyword]);

  // Set initial selected item when game changes
  useEffect(() => {
    if (game && game.items && game.items.length > 0) {
      setSelectedItemId(game.items[0].id);
    }
  }, [game]);

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">O'yin topilmadi</h2>
        <Link to="/" className="text-[#00e5ff] text-sm hover:underline">Bosh sahifaga qaytish</Link>
      </div>
    );
  }

  // Filter items
  const filteredItems = game.items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesText =
      !filterText.trim() ||
      t(item.name).toLowerCase().includes(filterText.toLowerCase()) ||
      t(item.description).toLowerCase().includes(filterText.toLowerCase());
    return matchesCategory && matchesText;
  });

  const activeItem: WikiItem | undefined = game.items.find((i) => i.id === selectedItemId) || filteredItems[0];

  return (
    <div className="min-h-screen bg-[#070e17] text-slate-100 flex flex-col">
      {/* Game Header Bar */}
      <div className="bg-[#0b1424] border-b border-white/10 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link to="/" className="hover:text-white">Bosh Sahifa</Link>
              <span>&gt;</span>
              <span className="text-[#00e5ff] font-semibold">{game.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
              <span>{game.name} — Ensiklopediya</span>
              <span className="text-xs bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40 px-2 py-0.5 rounded-full font-mono">
                {game.items.length} ta Maqola
              </span>
            </h1>
          </div>

          {/* External Source Attribution Link */}
          {game.sourceUrl && (
            <a
              href={game.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>Asl Manba: Fandom Wiki</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#00e5ff]" />
            </a>
          )}
        </div>
      </div>

      {/* Main 3-Column Hybrid Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden col-span-1 flex items-center justify-between bg-[#0b1424] p-3 rounded-xl border border-white/10">
          <span className="text-xs font-bold text-slate-300">
            Kategoriya: <strong className="text-[#00e5ff]">{activeCategory.toUpperCase()}</strong>
          </span>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex items-center gap-1.5 bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 text-xs px-3 py-1 rounded-lg font-bold"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Kategoriyalar</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* LEFT COLUMN: Categories & Items Tree (Notion Style)      */}
        {/* ========================================================= */}
        <aside className={`lg:col-span-3 bg-[#0b1424]/80 backdrop-blur border border-white/10 rounded-2xl p-4 flex flex-col gap-4 ${mobileSidebarOpen ? 'block' : 'hidden lg:flex'}`}>
          {/* Search inside Wiki */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Tezkor qidiruv..."
              className="w-full bg-[#050a12] border border-white/10 focus:border-[#00e5ff]/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          {/* Categories Filter */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
              Kategoriyalar
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === 'all'
                    ? 'bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/40 shadow-sm'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>📦 Barchasi</span>
                <span className="text-[10px] opacity-70">{game.items.length}</span>
              </button>

              {game.categories?.map((cat) => {
                const count = game.items.filter((i) => i.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeCategory === cat.id
                        ? 'bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/40 shadow-sm'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{t(cat.name)}</span>
                    </span>
                    <span className="text-[10px] opacity-70 bg-white/5 px-1.5 py-0.5 rounded">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Item List */}
          <div className="flex-1 border-t border-white/10 pt-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
              Mavjud Buyumlar ({filteredItems.length})
            </div>
            
            {filteredItems.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                Hech narsa topilmadi
              </div>
            ) : (
              <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItemId(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-all ${
                      item.id === activeItem?.id
                        ? 'bg-gradient-to-r from-[#00e5ff]/20 to-transparent text-[#00e5ff] font-bold border-l-4 border-[#00e5ff]'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="truncate flex-1">{t(item.name)}</span>
                    {item.rarity === 'epic' && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                    {item.rarity === 'legendary' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER COLUMN: Detailed Wiki Article (Notion + Game HUD) */}
        {/* ========================================================= */}
        <main className="lg:col-span-6 space-y-6">
          {activeItem ? (
            <div className="bg-[#0b1424] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Breadcrumb & Tier Header */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span>{game.name}</span>
                    <span>/</span>
                    <span className="capitalize">{activeItem.category}</span>
                  </div>
                  {activeItem.tier && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {activeItem.tier}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#070e17] border border-[#00e5ff]/30 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                    {activeItem.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white leading-tight">
                      {t(activeItem.name)}
                    </h2>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      {t(activeItem.description)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation (Notion style) */}
              <div className="flex border-b border-white/10 gap-6 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2.5 transition-colors relative ${
                    activeTab === 'overview' ? 'text-[#00e5ff]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📄 Umumiy Ma'lumot
                  {activeTab === 'overview' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00e5ff]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('recipe')}
                  className={`pb-2.5 transition-colors relative ${
                    activeTab === 'recipe' ? 'text-[#00e5ff]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🔨 Retsept & Manba
                  {activeTab === 'recipe' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00e5ff]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('tips')}
                  className={`pb-2.5 transition-colors relative ${
                    activeTab === 'tips' ? 'text-[#00e5ff]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💡 Maslahatlar
                  {activeTab === 'tips' && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00e5ff]" />
                  )}
                </button>
              </div>

              {/* Tab 1: Overview & Attributes Grid */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Attributes Grid */}
                  {activeItem.attributes && (
                    <div>
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                        Asosiy Ko'rsatkichlar
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                        {Object.entries(activeItem.attributes).map(([key, value]) => (
                          <div key={key} className="bg-[#070e17] border border-white/5 rounded-xl p-3">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                              {key}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlight Callout Box */}
                  {activeItem.tips && (
                    <div className="bg-[#00e5ff]/10 border-l-4 border-[#00e5ff] p-4 rounded-r-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#00e5ff] mb-1">
                        <Sparkles className="w-4 h-4" />
                        <span>Muhim Eslatma</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {t(activeItem.tips)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Recipe & Crafting */}
              {activeTab === 'recipe' && (
                <div className="space-y-4">
                  {activeItem.recipe ? (
                    <div>
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                        Kerakli Komponentlar & Dastgoh
                      </div>

                      <div className="bg-[#070e17] border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-white/5 text-slate-400 font-bold border-b border-white/5">
                            <tr>
                              <th className="p-3">Material / Ingredient</th>
                              <th className="p-3 text-right">Miqdor</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {activeItem.recipe.ingredients.map((ing, i) => (
                              <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="p-3 font-semibold text-white flex items-center gap-2">
                                  <span>🔹</span>
                                  <span>{ing.item}</span>
                                </td>
                                <td className="p-3 text-right font-mono font-bold text-[#00e5ff]">
                                  x{ing.count}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-[#070e17] p-3 rounded-xl border border-white/5">
                        <span>Ishlatiladigan Dastgoh: <strong className="text-white">{activeItem.recipe.station || "Qo'lda"}</strong></span>
                        {activeItem.recipe.craftTime && (
                          <span>Vaqt: <strong className="text-amber-400">{activeItem.recipe.craftTime}</strong></span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400 bg-[#070e17] rounded-xl border border-white/5">
                      Ushbu element xomashyodan yasalmaydi (Dunyodan teriladi yoki maxsus o'ljadan tushadi).
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Tips */}
              {activeTab === 'tips' && (
                <div className="space-y-4">
                  <div className="bg-[#070e17] border border-white/10 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
                    {activeItem.tips ? t(activeItem.tips) : "Ushbu buyum uchun maxsus maslahat hozircha kiritilmagan."}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#0b1424] border border-white/10 rounded-2xl p-12 text-center text-slate-400 text-sm">
              Chap tomondan ma'lumot ko'rmoqchi bo'lgan buyumni tanlang.
            </div>
          )}
        </main>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Table of Contents & Game Widgets           */}
        {/* ========================================================= */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Quick Table of Contents (On this page) */}
          <div className="bg-[#0b1424]/80 backdrop-blur border border-white/10 rounded-2xl p-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Ushbu Sahifada
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <button onClick={() => setActiveTab('overview')} className="block hover:text-[#00e5ff] text-left">
                1. Umumiy tavsif va xususiyatlar
              </button>
              <button onClick={() => setActiveTab('recipe')} className="block hover:text-[#00e5ff] text-left">
                2. Hunarmandchilik retseptlari
              </button>
              <button onClick={() => setActiveTab('tips')} className="block hover:text-[#00e5ff] text-left">
                3. Taktik maslahatlar
              </button>
            </div>
          </div>

          {/* Game Specific Widget (Radar for Raft, Lineups for CS2) */}
          {game.id === 'raft' && (
            <div className="bg-[#0b1424] border border-[#00e5ff]/30 rounded-2xl p-4 shadow-lg shadow-[#00e5ff]/5">
              <div className="flex items-center justify-between text-xs font-bold text-[#00e5ff] mb-3">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  <span>Radar Kodlari</span>
                </span>
                <span className="text-[9px] bg-[#00e5ff]/20 px-1.5 py-0.5 rounded font-mono">STORY</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-[#070e17] p-2 rounded-lg border border-white/5">
                  <span className="text-slate-300">Radio Tower</span>
                  <span className="font-mono text-[#00e5ff] font-bold">#4012</span>
                </div>
                <div className="flex justify-between items-center bg-[#070e17] p-2 rounded-lg border border-white/5">
                  <span className="text-slate-300">Vasagatan</span>
                  <span className="font-mono text-[#00e5ff] font-bold">#2451</span>
                </div>
                <div className="flex justify-between items-center bg-[#070e17] p-2 rounded-lg border border-white/5">
                  <span className="text-slate-300">Balboa Island</span>
                  <span className="font-mono text-[#00e5ff] font-bold">#1829</span>
                </div>
                <div className="flex justify-between items-center bg-[#070e17] p-2 rounded-lg border border-white/5">
                  <span className="text-slate-300">Tangaroa</span>
                  <span className="font-mono text-[#00e5ff] font-bold">#3180</span>
                </div>
              </div>
            </div>
          )}

          {/* Other Games List Widget */}
          <div className="bg-[#0b1424] border border-white/10 rounded-2xl p-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Boshqa O'yinlar
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['CS2', 'Rust', 'Minecraft', 'The Forest', 'Subnautica'].map((gName) => (
                <span key={gName} className="text-xs bg-white/5 border border-white/5 text-slate-300 px-2.5 py-1 rounded-lg">
                  {gName}
                </span>
              ))}
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
};
