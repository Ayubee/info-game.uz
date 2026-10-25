import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { WikiListPage } from './pages/WikiListPage';
import { GameWikiPage } from './pages/GameWikiPage';
import { NewsListPage } from './pages/NewsListPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070e17] text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Dedicated Games Wiki Section (Only games with Crafting) */}
          <Route path="/wiki" element={<WikiListPage />} />
          <Route path="/wiki/:gameId" element={<GameWikiPage />} />
          <Route path="/games" element={<WikiListPage />} />
          <Route path="/games/:gameId" element={<GameWikiPage />} />

          {/* Dedicated News Section */}
          <Route path="/news" element={<NewsListPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          
          {/* Secret Dedicated Admin Route */}
          <Route path="/admin" element={<AdminPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
