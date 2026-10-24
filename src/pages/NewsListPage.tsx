import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, Play, Eye, Calendar, User, Search } from 'lucide-react';

export const NewsListPage: React.FC = () => {
  const { news, t, language } = useApp();
  const [filterTag, setFilterTag] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const allTags = Array.from(new Set(news.flatMap((n) => n.tags || [])));

  const filteredNews = news.filter((item) => {
    const matchesTag = filterTag === 'all' || item.tags.includes(filterTag);
    const matchesSearch =
      !search.trim() ||
      t(item.title).toLowerCase().includes(search.toLowerCase()) ||
      t(item.summary).toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070e17] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#ff4655] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>O'yin Yangiliklari Portali</span>
            </div>
            <h1 className="text-3xl font-black text-white">
              Eng So'nggi Xabarlar, Patchlar va Relizlar
            </h1>
          </div>

          {/* Search */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Yangiliklardan qidirish..."
              className="w-full bg-[#0b1424] border border-white/10 focus:border-[#00e5ff]/50 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterTag('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              filterTag === 'all'
                ? 'bg-[#00e5ff] text-[#070e17]'
                : 'bg-[#0b1424] text-slate-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            Barchasi ({news.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                filterTag === tag
                  ? 'bg-[#00e5ff] text-[#070e17]'
                  : 'bg-[#0b1424] text-slate-300 hover:bg-white/5 border border-white/10'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="group bg-[#0b1424] border border-white/10 hover:border-[#00e5ff]/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <div className="h-48 relative overflow-hidden bg-slate-900">
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
                <span className="absolute top-3 left-3 text-[10px] font-bold bg-black/60 backdrop-blur border border-white/20 text-[#00e5ff] px-2 py-0.5 rounded uppercase">
                  {item.gameId?.toUpperCase() || 'YANGILIK'}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-white group-hover:text-[#00e5ff] transition-colors leading-snug mb-2">
                    {t(item.title)}
                  </h2>
                  <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4">
                    {t(item.summary)}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.views}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};
