import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Gamepad2, Compass, Sparkles, BookOpen, ChevronRight, Play, Eye, 
  Calendar, Flame, Clock, Newspaper, ArrowRight, CheckCircle2, Hammer 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { games, news, language, t, setSelectedGameId } = useApp();
  const [newsFilter, setNewsFilter] = useState<'all' | 'hot' | 'upcoming'>('all');

  const featuredNews = news[0];
  const secondaryNews = news.slice(1, 7);
  const wikiGames = games.filter((g) => g.hasCrafting !== false);

  return (
    <div className="min-h-screen flex flex-col bg-[#070e17]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 border-b border-white/10 bg-gradient-to-b from-[#0a1526] via-[#070e17] to-[#070e17]">
        {/* Ambient Lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00e5ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ff4655]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] text-xs font-bold mb-5 tracking-wide">
            <Flame className="w-3.5 h-3.5 text-[#ff4655]" />
            <span>{t('home.badge')}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4 max-w-4xl mx-auto leading-tight">
            {t('home.heroTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#38bdf8]">{t('home.heroTitleHighlight')}</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('home.heroDesc')}
          </p>

          {/* Quick Navigation Buttons (News & Wiki separated) */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/news"
              className="bg-[#00e5ff] text-[#070e17] font-black text-xs sm:text-sm px-6 py-3 rounded-xl hover:bg-[#38bdf8] transition-all shadow-lg shadow-[#00e5ff]/25 flex items-center gap-2 hover:scale-105"
            >
              <Newspaper className="w-4 h-4" />
              <span>{t('home.browseNewsBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/wiki"
              className="bg-purple-600/25 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2 hover:scale-105"
            >
              <Hammer className="w-4 h-4 text-purple-300" />
              <span>O'yinlar Wiki (Crafting)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* ========================================================= */}
        {/* SECTION 1: LATEST NEWS & RELEASES (DIQQAT MARKAZI)        */}
        {/* ========================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-bold text-[#ff4655] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{t('home.hotNewsBadge')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {t('home.latestNewsHeading')}
              </h2>
            </div>

            <Link
              to="/news"
              className="text-xs font-bold text-[#00e5ff] hover:text-[#38bdf8] flex items-center gap-1 group"
            >
              <span>{t('home.viewAllArticles')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Featured Hero News Banner (Agar kamida bitta post bo'lsa) */}
          {featuredNews && (
            <Link
              to={`/news/${featuredNews.id}`}
              className="group block relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#00e5ff]/50 transition-all bg-[#0b1424] shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 h-64 sm:h-80 lg:h-96 relative overflow-hidden bg-slate-900">
                  <img
                    src={featuredNews.coverImage}
                    alt={t(featuredNews.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-[#0b1424]/40 to-[#0b1424]" />
                  {featuredNews.videoUrl && (
                    <div className="absolute bottom-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t('home.videoBadge')}</span>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-[#ff4655] text-white">
                        {t('home.topNews')}
                      </span>
                      <span className="text-xs text-[#00e5ff] font-bold uppercase">
                        {featuredNews.gameId || t('home.generalCategory')}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs text-slate-400">{featuredNews.date}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#00e5ff] transition-colors leading-tight mb-4">
                      {t(featuredNews.title)}
                    </h3>

                    <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                      {t(featuredNews.summary)}
                    </p>

                    {featuredNews.expectedReleaseDate && (
                      <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-300 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t('home.expectedRelease')} {featuredNews.expectedReleaseDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">{t('home.author')} {featuredNews.author}</span>
                    <span className="text-[#00e5ff] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      {t('home.readMore')} <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid of Secondary News */}
          {secondaryNews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {secondaryNews.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="group bg-[#0b1424] border border-white/10 hover:border-[#00e5ff]/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 shadow-lg"
                >
                  <div>
                    <div className="h-48 relative overflow-hidden bg-slate-900">
                      <img
                        src={item.coverImage}
                        alt={t(item.title)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-[#00e5ff] text-[10px] font-bold px-2 py-0.5 rounded">
                        {item.gameId?.toUpperCase() || t('home.newsBadge')}
                      </div>
                      {item.videoUrl && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#ff4655] text-white flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 ml-0.5 fill-current" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-2">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{item.author}</span>
                      </div>

                      <h4 className="text-base font-bold text-white group-hover:text-[#00e5ff] transition-colors leading-snug line-clamp-2 mb-2">
                        {t(item.title)}
                      </h4>

                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {t(item.summary)}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{item.views} {t('home.viewsCount')}</span>
                    </span>
                    <span className="text-[#00e5ff] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      {t('home.readBtn')} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: GAMES WIKI & CRAFTING (ALOHIDA BO'LIM)         */}
        {/* ========================================================= */}
        <section className="space-y-6 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Hammer className="w-4 h-4" />
                <span>O'yinlar Wiki & Fandom</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Crafting va Retseptlar Ensiklopediyasi
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Faqat hunarmandchilik (craft) tizimiga ega o'yinlar uchun maxsus qo'llanmalar, ingredientlar va resurslar.
              </p>
            </div>

            <Link
              to="/wiki"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 group"
            >
              <span>Barcha Wiki O'yinlar ({wikiGames.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wikiGames.slice(0, 3).map((game) => (
              <Link
                key={game.id}
                to={`/wiki/${game.id}`}
                className="group bg-[#0b1424] border border-white/10 hover:border-purple-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="h-44 relative overflow-hidden bg-slate-900">
                    <img
                      src={game.coverImage}
                      alt={game.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1424] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-emerald-500/90 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 shadow-lg">
                      <Hammer className="w-3 h-3" />
                      <span>Crafting Bor</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
                      {game.releaseYear}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
                      {game.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mb-2">
                      {game.developer}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {t(game.tagline) || t(game.description)}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px]">
                    🏷️ {game.categories?.length || 0} kategoriya • 📦 {game.items?.length || 0} buyum
                  </span>
                  <span className="text-purple-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Wikini Ochish <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
