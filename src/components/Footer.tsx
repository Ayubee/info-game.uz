import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="bg-[#050911] border-t border-white/10 mt-auto text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0284c7] to-[#00e5ff] flex items-center justify-center text-[#070e17]">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white">
                INFO-GAME<span className="text-[#00e5ff]">.UZ</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {t('footer.brandDesc')}
            </p>
          </div>

          {/* Quick News Topics */}
          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {t('footer.newsTopics')}
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/news" className="hover:text-[#00e5ff] transition-colors">
                  {t('footer.topicGta')}
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-[#00e5ff] transition-colors">
                  {t('footer.topicCs2')}
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-[#00e5ff] transition-colors">
                  {t('footer.topicMinecraft')}
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-[#00e5ff] transition-colors">
                  {t('footer.topicTrailers')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Sections */}
          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {t('footer.sections')}
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-[#00e5ff]">{t('nav.home')}</Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-[#00e5ff]">{t('footer.allGamingNews')}</Link>
              </li>
              <li>
                <Link to="/wiki" className="hover:text-[#00e5ff]">{t('nav.wiki')}</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Notice */}
          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {t('footer.info')}
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed mb-3">
              {t('footer.disclaimer')}
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />
              <span>{t('footer.license')}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar with subtle discrete admin access */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} INFO-GAME.UZ. {t('footer.rights')}
          </div>
          
          <div className="flex items-center gap-4">
            <span>{t('footer.location')}</span>
            {/* Subtle, secret link to admin panel */}
            <Link to="/admin" className="text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1">
              <span>🔒</span>
              <span className="text-[10px]">{t('footer.system')}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
