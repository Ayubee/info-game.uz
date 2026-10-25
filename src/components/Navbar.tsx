import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Compass, Globe, Search, Menu, X, ChevronDown, Gamepad2, Newspaper } from 'lucide-react';
import { Language } from '../types';

export const Navbar: React.FC = () => {
  const { language, setLanguage, games, selectedGameId, setSelectedGameId, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [gameDropdownOpen, setGameDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const activeGame = games.find((g) => g.id === selectedGameId) || games[0];

  const handleGameSelect = (gameId: string) => {
    setSelectedGameId(gameId);
    setGameDropdownOpen(false);
    navigate(`/games/${gameId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/games/${activeGame?.id || 'raft'}?search=${encodeURIComponent(searchQuery)}`);
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-50 bg-[#08101d]/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0284c7] to-[#00e5ff] flex items-center justify-center text-[#070e17] shadow-lg shadow-[#00e5ff]/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
              INFO-GAME<span className="text-[#00e5ff]">.UZ</span>
            </div>
          </Link>
        </div>

        {/* Center: Search Box (Desktop) for News & Articles */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md items-center">
          <div className="w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full bg-[#050a12] border border-white/10 focus:border-[#00e5ff]/60 rounded-xl pl-9 pr-12 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-mono text-slate-400">
              Enter
            </span>
          </div>
        </form>

        {/* Right: Nav Links & Language Switcher */}
        <div className="flex items-center gap-3">
          <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-300">
            <Link
              to="/"
              className={`hover:text-[#00e5ff] transition-colors ${location.pathname === '/' ? 'text-[#00e5ff] font-bold' : ''}`}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/games"
              className={`hover:text-[#00e5ff] transition-colors ${location.pathname.startsWith('/games') ? 'text-[#00e5ff] font-bold' : ''}`}
            >
              {t('nav.games')}
            </Link>
            <Link
              to="/news"
              className={`hover:text-[#00e5ff] transition-colors ${location.pathname.startsWith('/news') ? 'text-[#00e5ff] font-bold' : ''}`}
            >
              {t('nav.allNews')}
            </Link>
          </nav>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 bg-[#0d182b] hover:bg-[#12223d] border border-white/10 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg transition-all"
            >
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline font-semibold">{currentLang.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-36 bg-[#0c1626] border border-white/10 rounded-xl shadow-xl p-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                      l.code === language ? 'bg-[#00e5ff]/15 text-[#00e5ff] font-bold' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a1322] border-b border-white/10 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.searchMobile')}
                className="w-full bg-[#050a12] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white"
              />
            </div>
          </form>

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-bold text-slate-200 hover:bg-white/5"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/games"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-bold text-slate-200 hover:bg-white/5"
            >
              {t('nav.games')}
            </Link>
            <Link
              to="/news"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-bold text-[#00e5ff] hover:bg-white/5"
            >
              {t('nav.allNews')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
