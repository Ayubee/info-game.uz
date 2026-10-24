import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Gamepad2, Compass, Sparkles, BookOpen, ChevronRight, Play, Eye } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { games, news, language, t, setSelectedGameId } = useApp();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-white/10 bg-gradient-to-b from-[#091322] via-[#070e17] to-[#070e17]">
        {/* Ambient Lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00e5ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0284c7]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] text-xs font-bold mb-6 tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>O'ZBEKISTONDAGI BIRINCHI GEYMERLAR ENSIKLOPEDIYASI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4 max-w-4xl mx-auto leading-tight">
            Sevimli O'yiningiz Sirlari va <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#38bdf8]">Retseptlarini O'rganing</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Raft, CS2, Rust, Minecraft va boshqa mashhur o'yinlarning xaritalari, hunarmandchilik retseptlari va so'nggi yangiliklari o'zbek, rus va ingliz tillarida.
          </p>

          {/* Quick Game Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {games.map((g) => (
              <Link
                key={g.id}
                to={`/games/${g.id}`}
                onClick={() => setSelectedGameId(g.id)}
                className="flex items-center gap-2 bg-[#0c1626] hover:bg-[#12223d] border border-white/10 hover:border-[#00e5ff]/50 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md group"
              >
                <Gamepad2 className="w-4 h-4 text-[#00e5ff] group-hover:scale-110 transition-transform" />
                <span>{g.name}</span>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400">
                  {g.items?.length || 0} maqola
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Games Wiki Catalog */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs font-bold text-[#00e5ff] uppercase tracking-wider mb-1 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>O'yinlar Katalogi</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                Mavjud O'yin Ensiklopediyalari
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                onClick={() => setSelectedGameId(game.id)}
                className="group bg-[#0b1424] border border-white/10 hover:border-[#00e5ff]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[#00e5ff]/10 flex flex-col"
              >
                <div className="h-44 relative overflow-hidden bg-slate-900">
                  <img
                    src={game.coverImage}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1424] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] font-bold bg-black/60 backdrop-blur-md border border-white/20 text-white px-2 py-1 rounded-md">
                    {game.releaseYear}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#00e5ff] transition-colors mb-1">
                      {game.name}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                      {t(game.tagline)}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {game.genre.slice(0, 3).map((gn, i) => (
                        <span key={i} className="text-[10px] bg-white/5 text-slate-300 px-2 py-0.5 rounded">
                          {gn}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#00e5ff]">
                      <span>{game.categories?.length || 0} ta Kategoriya</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Gaming News Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs font-bold text-[#ff4655] uppercase tracking-wider mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Tezkor Yangiliklar</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                So'nggi O'yin Xabarlari va Patchlar
              </h2>
            </div>
            <Link to="/news" className="text-xs font-bold text-[#00e5ff] hover:underline flex items-center gap-1">
              <span>Barcha Yangiliklar</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.slice(0, 2).map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="group bg-[#0b1424] border border-white/10 hover:border-white/30 rounded-2xl overflow-hidden flex flex-col sm:flex-row transition-all shadow-lg"
              >
                <div className="sm:w-56 h-48 sm:h-auto relative overflow-hidden bg-slate-900 flex-shrink-0">
                  <img
                    src={item.coverImage}
                    alt={t(item.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.videoUrl && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#ff4655] text-white flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-2">
                      <span className="bg-[#00e5ff]/15 text-[#00e5ff] font-bold px-2 py-0.5 rounded uppercase">
                        {item.gameId?.toUpperCase() || 'YANGILIK'}
                      </span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#00e5ff] transition-colors leading-snug mb-2">
                      {t(item.title)}
                    </h3>

                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {t(item.summary)}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-slate-500 text-[11px]">
                    <span>{item.author}</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{item.views} marta</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
