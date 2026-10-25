import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Hammer, Search, Sparkles, Layers, BookOpen, ArrowRight, 
  ExternalLink, ChevronRight, Newspaper, Flame, Info
} from 'lucide-react';

export const WikiListPage: React.FC = () => {
  const { games, t, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // IMPORTANT: Only games with crafting system are part of Games Wiki!
  // Games without crafting (hasCrafting === false) belong exclusively to News!
  const craftingGames = games.filter((game) => game.hasCrafting !== false);

  const filteredGames = craftingGames.filter((game) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatches = game.name.toLowerCase().includes(query);
    const developerMatches = game.developer.toLowerCase().includes(query);
    const genreMatches = game.genre?.some((g) => g.toLowerCase().includes(query));
    const taglineMatches = t(game.tagline).toLowerCase().includes(query);
    return nameMatches || developerMatches || genreMatches || taglineMatches;
  });

  return (
    <div className="min-h-screen bg-[#070e17] text-slate-100 flex flex-col">
      {/* Header Banner */}
      <section className="relative overflow-hidden py-12 sm:py-16 border-b border-white/10 bg-gradient-to-b from-[#0a1526] via-[#070e17] to-[#070e17]">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00e5ff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold mb-4">
            <Hammer className="w-3.5 h-3.5 text-purple-400" />
            <span>{t('wikiList.badge') || "CRAFTING & RETSEPTLAR ENSIKLOPEDIYASI"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 max-w-3xl mx-auto leading-tight">
            {t('wikiList.title') || "O'yinlar Wiki — Fandom & Crafting Bazasi"}
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {t('wikiList.desc') || "Fandom uslubidagi barcha resurslar, asbob-uskunalar, retseptlar, ingredientlar va xaritalar bazasi. Faqat hunarmandchilik (crafting) tizimiga ega o'yinlar jamlangan."}
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto mt-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('wikiList.searchPlaceholder') || "Wiki o'yinlaridan qidirish (Raft, Rust, Minecraft)..."}
              className="w-full bg-[#0b1424] border border-white/10 focus:border-[#00e5ff] rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none shadow-xl transition-all"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1 w-full">
        
        {/* Notice: News vs Wiki separation */}
        <div className="bg-[#0b1424] border border-[#00e5ff]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] flex-shrink-0 mt-0.5 sm:mt-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {t('wikiList.noticeTitle') || "Yangiliklar va Wiki bo'limlari ajratilgan"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                {t('wikiList.noticeText') || "Ushbu bo'limda faqat Crafting (yasash) va Retseptlar tizimiga ega o'yinlar mavjud. Boshqa barcha o'yinlarning reliz sanalari, treylerlari va xabarlari Yangiliklar bo'limida alohida yoritiladi."}
              </p>
            </div>
          </div>

          <Link
            to="/news"
            className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#00e5ff] px-4 py-2 rounded-xl transition-colors"
          >
            <Newspaper className="w-4 h-4" />
            <span>{t('wikiList.goToNews') || "Barcha Yangiliklar"}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Catalog of Crafting Games */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Mavjud Wiki O'yinlar</span>
              <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                {filteredGames.length} ta o'yin
              </span>
            </h2>
          </div>

          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="group bg-[#0b1424] border border-white/10 hover:border-purple-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl"
                >
                  <div>
                    {/* Cover Image */}
                    <div className="h-48 relative overflow-hidden bg-slate-900">
                      <img
                        src={game.coverImage}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1424] via-transparent to-transparent" />

                      {/* Crafting Badge */}
                      <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-md text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                        <Hammer className="w-3 h-3" />
                        <span>{t('wikiList.craftBadge') || "Crafting Bor"}</span>
                      </div>

                      {/* Year badge */}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white border border-white/10 text-[10px] font-mono px-2 py-1 rounded-lg">
                        {game.releaseYear}
                      </div>
                    </div>

                    {/* Game Details */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                          {game.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {game.developer}
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {t(game.tagline) || t(game.description)}
                      </p>

                      {/* Genre Tags */}
                      {game.genre && game.genre.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {game.genre.slice(0, 3).map((g, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Categories count + Open Button */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>🏷️ {game.categories?.length || 0} kategoriya</span>
                        <span>•</span>
                        <span>📦 {game.items?.length || 0} retsept</span>
                      </div>

                      <Link
                        to={`/wiki/${game.id}`}
                        className="bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all group-hover:bg-purple-500 group-hover:text-white"
                      >
                        <span>{t('wikiList.openWiki') || "Wikini Ochish"}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#0b1424] border border-dashed border-white/10 rounded-2xl p-8 space-y-3">
              <Hammer className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">
                {t('wikiList.empty') || "Hech qanday crafting o'yini topilmadi"}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Qidiruv so'zini o'zgartirib ko'ring yoki Admin panel orqali yangi crafting o'yini qo'shing.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
