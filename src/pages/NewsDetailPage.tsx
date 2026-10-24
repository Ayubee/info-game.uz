import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, User, Eye, ArrowLeft, Share2, Sparkles } from 'lucide-react';

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { news, t, language, incrementNewsViews } = useApp();

  const article = news.find((n) => n.id === id || n.slug === id);

  useEffect(() => {
    if (article) {
      incrementNewsViews(article.id);
    }
  }, [article?.id]);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Maqola topilmadi</h2>
        <Link to="/news" className="text-[#00e5ff] text-xs hover:underline">
          Yangiliklar ro'yxatiga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070e17] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Back Link */}
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#00e5ff] font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Barcha Yangiliklarga Qaytish</span>
        </Link>

        {/* Article Meta */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40 px-2.5 py-0.5 rounded-full uppercase">
              {article.gameId?.toUpperCase() || 'O\'YIN YANGILIGI'}
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.date}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {t(article.title)}
          </h1>

          <div className="flex items-center justify-between text-xs text-slate-400 py-3 border-y border-white/10">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#00e5ff]" />
              <span>Muallif: <strong className="text-white">{article.author}</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.views} marta ko'rildi</span>
            </div>
          </div>
        </div>

        {/* Media: Video or Cover Image */}
        {article.videoUrl ? (
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            <iframe
              src={article.videoUrl}
              title={t(article.title)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl max-h-[450px]">
            <img
              src={article.coverImage}
              alt={t(article.title)}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Summary Lead Box */}
        <div className="bg-[#0b1424] border-l-4 border-[#00e5ff] p-5 rounded-r-2xl text-sm font-medium text-slate-200 leading-relaxed">
          {t(article.summary)}
        </div>

        {/* Content Body */}
        <div className="text-slate-300 text-sm leading-relaxed space-y-4 whitespace-pre-line bg-[#0b1424]/60 p-6 rounded-2xl border border-white/5">
          {t(article.content)}
        </div>

        {/* Optional Source Attribution Link */}
        {article.sourceUrl && (
          <div className="bg-[#0b1424] border border-[#00e5ff]/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <span className="text-[#00e5ff] font-bold">Asl Manba:</span>
              <span>{article.sourceName || "Rasmiy Sayt / Istochnik"}</span>
            </div>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30 text-xs px-3 py-1.5 rounded-lg transition-colors font-bold"
            >
              <span>Manba Sahifasiga O'tish</span>
              <span className="text-sm">↗</span>
            </a>
          </div>
        )}

        {/* Tags */}
        <div className="pt-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-slate-400">Teglar:</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-[#0b1424] border border-white/10 text-[#38bdf8] px-3 py-1 rounded-lg font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};
