import os
import subprocess

DESIGNS_DIR = r"D:\info-game.uz\designs"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# ==========================================
# 1. DESIGN 1: OCEAN SURVIVAL & MODERN DARK
# ==========================================
html_d1 = """<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<title>Dizayn 1: Ocean Survival & Modern Dark | INFO-GAME.UZ</title>
<style>
  @page { size: 1440px 1020px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; }
  body { background: #070e18; color: #e2e8f0; width: 1440px; height: 1020px; overflow: hidden; position: relative; }
  
  /* Background ambience */
  .bg-glow-1 { position: absolute; width: 500px; height: 500px; background: radial-gradient(circle, rgba(0, 229, 255, 0.12) 0%, transparent 70%); top: -100px; left: -100px; pointer-events: none; }
  .bg-glow-2 { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%); bottom: -100px; right: -100px; pointer-events: none; }

  /* Concept info banner */
  .concept-header { background: #0c1829; border-bottom: 2px solid #00e5ff33; padding: 12px 30px; display: flex; justify-content: space-between; align-items: center; }
  .concept-title { font-size: 14px; font-weight: 700; color: #00e5ff; letter-spacing: 1px; text-transform: uppercase; }
  .concept-tags { display: flex; gap: 8px; }
  .c-tag { background: rgba(0, 229, 255, 0.12); color: #38bdf8; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; border: 1px solid rgba(0, 229, 255, 0.25); }
  .palette { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #94a3b8; }
  .color-dot { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); }

  /* Top Navigation */
  .navbar { height: 64px; background: rgba(14, 25, 44, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; padding: 0 30px; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .logo-icon { width: 38px; height: 38px; background: linear-gradient(135deg, #00e5ff, #0284c7); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 0 15px rgba(0, 229, 255, 0.4); }
  .brand-text { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
  .brand-text span { color: #00e5ff; }
  
  .search-bar { width: 440px; height: 40px; background: rgba(7, 14, 24, 0.7); border: 1px solid rgba(0, 229, 255, 0.25); border-radius: 10px; display: flex; align-items: center; padding: 0 14px; gap: 10px; color: #94a3b8; font-size: 13px; }
  .search-shortcut { margin-left: auto; background: rgba(255,255,255,0.08); padding: 2px 7px; border-radius: 4px; font-size: 10px; color: #cbd5e1; font-weight: 700; border: 1px solid rgba(255,255,255,0.1); }

  .nav-actions { display: flex; align-items: center; gap: 16px; }
  .nav-btn { background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.3); color: #00e5ff; padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; }
  .lang-badge { background: rgba(255,255,255,0.06); padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; border: 1px solid rgba(255,255,255,0.1); }

  /* Subheader / Game bar */
  .game-bar { background: #0a1322; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 10px 30px; display: flex; align-items: center; justify-content: space-between; }
  .current-game { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 700; }
  .game-tag { background: #00e5ff22; color: #00e5ff; padding: 3px 8px; border-radius: 4px; font-size: 11px; text-transform: uppercase; }
  .quick-links { display: flex; gap: 20px; font-size: 13px; color: #94a3b8; }
  .quick-links span.active { color: #00e5ff; font-weight: 600; position: relative; }
  .quick-links span.active::after { content: ''; position: absolute; bottom: -12px; left: 0; width: 100%; height: 2px; background: #00e5ff; }

  /* Main Layout */
  .main-layout { display: grid; grid-template-columns: 240px 1fr 280px; gap: 20px; padding: 20px 30px; height: calc(1020px - 170px); }

  /* Left Sidebar */
  .sidebar { background: rgba(14, 25, 44, 0.6); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 14px; }
  .menu-group-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.8px; margin-bottom: 6px; }
  .menu-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 8px; font-size: 13px; color: #cbd5e1; background: transparent; }
  .menu-item.active { background: rgba(0, 229, 255, 0.15); color: #00e5ff; font-weight: 600; border: 1px solid rgba(0, 229, 255, 0.3); }
  .item-count { font-size: 10px; background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 10px; color: #94a3b8; }

  /* Center Content */
  .content-area { display: flex; flex-direction: column; gap: 16px; overflow: hidden; }
  
  .hero-banner { background: linear-gradient(135deg, rgba(14, 25, 44, 0.95), rgba(7, 14, 24, 0.85)), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.05"><path d="M0 0h100v100H0z" fill="none"/><path d="M10 10h80v80H10z" stroke="white"/></svg>'); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 14px; padding: 20px; display: flex; justify-content: space-between; align-items: center; position: relative; }
  .hero-text h1 { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .hero-text h1 span { color: #00e5ff; }
  .hero-text p { font-size: 13px; color: #94a3b8; max-width: 520px; }
  
  .category-pills { display: flex; gap: 8px; margin-top: 12px; }
  .cat-pill { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; color: #cbd5e1; }
  .cat-pill.active { background: #00e5ff; color: #070e18; border-color: #00e5ff; font-weight: 700; }

  /* Cards Grid */
  .cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .item-card { background: rgba(14, 25, 44, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px; display: flex; gap: 14px; position: relative; transition: all 0.2s; }
  .item-card:hover { border-color: rgba(0, 229, 255, 0.4); transform: translateY(-2px); }
  .item-avatar { width: 64px; height: 64px; background: #070e18; border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }
  
  .item-details { flex: 1; }
  .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .item-name { font-size: 14px; font-weight: 700; color: #fff; }
  .tier-badge { font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; }
  .tier-epic { background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4); }
  .tier-rare { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
  .tier-legendary { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
  
  .item-desc { font-size: 11px; color: #94a3b8; line-height: 1.4; margin-bottom: 8px; }
  .recipe-chips { display: flex; gap: 5px; flex-wrap: wrap; }
  .r-chip { background: #070e18; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 2px 6px; font-size: 10px; color: #cbd5e1; }

  /* Right Sidebar */
  .right-bar { display: flex; flex-direction: column; gap: 14px; }
  .info-widget { background: rgba(14, 25, 44, 0.6); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 14px; }
  .widget-title { font-size: 12px; font-weight: 700; color: #00e5ff; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  
  .tip-box { background: rgba(0, 229, 255, 0.08); border-left: 3px solid #00e5ff; padding: 10px; border-radius: 0 8px 8px 0; font-size: 11px; line-height: 1.4; color: #cbd5e1; }
  
  .coords-list { display: flex; flex-direction: column; gap: 6px; }
  .coord-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; background: rgba(7, 14, 24, 0.5); border-radius: 6px; font-size: 11px; }
  .coord-code { font-family: monospace; background: #00e5ff22; color: #00e5ff; padding: 2px 5px; border-radius: 4px; font-weight: 700; }
</style>
</head>
<body>
  <div class="bg-glow-1"></div>
  <div class="bg-glow-2"></div>

  <!-- Design Spec Header -->
  <div class="concept-header">
    <div class="concept-title">KONSEPTSIYA 1: OCEAN SURVIVAL & MODERN DARK (Raft Gamified UI)</div>
    <div class="palette">
      <span>Ranglar:</span>
      <div class="color-dot" style="background: #070e18;"></div>
      <div class="color-dot" style="background: #0e192c;"></div>
      <div class="color-dot" style="background: #00e5ff;"></div>
      <div class="color-dot" style="background: #38bdf8;"></div>
      <div class="color-dot" style="background: #fbbf24;"></div>
    </div>
    <div class="concept-tags">
      <span class="c-tag">O'yin muhiti</span>
      <span class="c-tag">Glassmorphism</span>
      <span class="c-tag">Yuqori immersivlik</span>
      <span class="c-tag">Qorong'u mavzu</span>
    </div>
  </div>

  <!-- Navbar -->
  <div class="navbar">
    <div class="brand">
      <div class="logo-icon">🧭</div>
      <div class="brand-text">INFO-GAME<span>.UZ</span></div>
    </div>

    <div class="search-bar">
      <span>🔍</span>
      <span>Raft buyumlari, retseptlar, orollarni qidiring...</span>
      <span class="search-shortcut">CTRL + K</span>
    </div>

    <div class="nav-actions">
      <div class="lang-badge">🇺🇿 O'zbekcha ▾</div>
      <div class="nav-btn">+ Retsept Qo'shish</div>
      <div style="width: 34px; height: 34px; border-radius: 8px; background: #1e293b; display: flex; align-items: center; justify-content: center; font-size: 14px;">👤</div>
    </div>
  </div>

  <!-- Game Selector Bar -->
  <div class="game-bar">
    <div class="current-game">
      <span>O'yin:</span>
      <span class="game-tag">Raft: The Final Chapter</span>
      <span style="font-size: 11px; color: #64748b;">(v1.09 Final)</span>
    </div>
    <div class="quick-links">
      <span class="active">Wiki Baza</span>
      <span>Interaktiv Xarita</span>
      <span>Oshpazlik Qozoni</span>
      <span>Sol Kalkulyatori</span>
      <span>Dushmanlar & Bosslar</span>
      <span>Yutuqlar (Steam)</span>
    </div>
  </div>

  <!-- Main Grid -->
  <div class="main-layout">
    <!-- Left Navigation -->
    <div class="sidebar">
      <div>
        <div class="menu-group-title">Asosiy Bo'limlar</div>
        <div class="menu-item active">
          <span>🌊 Bosh sahifa</span>
        </div>
        <div class="menu-item">
          <span>🪵 Boshlang'ich Resurslar</span>
          <span class="item-count">34</span>
        </div>
        <div class="menu-item">
          <span>⚙️ Dastgohlar & Mashinalar</span>
          <span class="item-count">18</span>
        </div>
        <div class="menu-item">
          <span>🍲 Oshpazlik & Fermerlik</span>
          <span class="item-count">42</span>
        </div>
      </div>

      <div>
        <div class="menu-group-title">Syujet & Dunyo</div>
        <div class="menu-item">
          <span>🏝️ Syujet Orollari (8 ta)</span>
          <span class="item-count">Yangi</span>
        </div>
        <div class="menu-item">
          <span>🦈 Dushmanlar & Jonivorlar</span>
          <span class="item-count">16</span>
        </div>
        <div class="menu-item">
          <span>🏪 Savdo Postlari (Trading)</span>
          <span class="item-count">3 Tier</span>
        </div>
      </div>

      <div style="margin-top: auto; padding: 10px; background: rgba(0, 229, 255, 0.05); border-radius: 8px; border: 1px dashed rgba(0, 229, 255, 0.2);">
        <div style="font-size: 11px; font-weight: 700; color: #00e5ff; margin-bottom: 4px;">Raft Wiki UZ</div>
        <div style="font-size: 10px; color: #94a3b8;">1,420 ta o'zbek tilidagi maqola va retseptlar bazasi.</div>
      </div>
    </div>

    <!-- Center Content -->
    <div class="content-area">
      <div class="hero-banner">
        <div class="hero-text">
          <h1>Raft Tirik Qolish <span>Ensiklopediyasi</span></h1>
          <p>Okean o'rtasida omon qolish, solingizni kengaytirish, texnologiyalar yaratish va barcha syujet sirlarini o'zbek tilida o'rganing.</p>
          <div class="category-pills">
            <span class="cat-pill active">Barchasi (340)</span>
            <span class="cat-pill">Resurslar</span>
            <span class="cat-pill">Oshpazlik</span>
            <span class="cat-pill">Qurollar</span>
            <span class="cat-pill">Syujet</span>
          </div>
        </div>
      </div>

      <!-- Cards Grid -->
      <div class="cards-grid">
        <!-- Card 1 -->
        <div class="item-card">
          <div class="item-avatar">💎</div>
          <div class="item-details">
            <div class="item-header">
              <span class="item-name">Titanium Ingot</span>
              <span class="tier-badge tier-epic">Tier 3 • Epic</span>
            </div>
            <div class="item-desc">Eng mustahkam asboblar va ilg'or dvigatellar yasash uchun kerak bo'ladigan nodir metall. Pechda eritiladi.</div>
            <div class="recipe-chips">
              <span class="r-chip">⛏️ 1x Titanium Ore</span>
              <span class="r-chip">🔥 Smelter (60s)</span>
              <span class="r-chip">📍 Tangaroa / Savdo</span>
            </div>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="item-card">
          <div class="item-avatar">🍲</div>
          <div class="item-details">
            <div class="item-header">
              <span class="item-name">Shark Dinner (Akula Taomi)</span>
              <span class="tier-badge tier-legendary">Oshpazlik • Max</span>
            </div>
            <div class="item-desc">Qozonda pishiriladigan eng to'yimli taom. Qo'shimcha sog'liq zaxirasi beradi va to'qlikni maksimal darajada ushlab turadi.</div>
            <div class="recipe-chips">
              <span class="r-chip">🦈 2x Shark Meat</span>
              <span class="r-chip">🍄 1x Cave Mushroom</span>
              <span class="r-chip">🐟 1x Silverfish</span>
            </div>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="item-card">
          <div class="item-avatar">⚡</div>
          <div class="item-details">
            <div class="item-header">
              <span class="item-name">Biofuel Refiner (Ilg'or)</span>
              <span class="tier-badge tier-rare">Texnologiya</span>
            </div>
            <div class="item-desc">Organik chiqindilar va asaldan foydalanib toza bioyoqilg'i ishlab chiqaruvchi apparat. Dvigatellarni avtomatlashtiradi.</div>
            <div class="recipe-chips">
              <span class="r-chip">🪵 12x Plastic</span>
              <span class="r-chip">🍯 2x Honey</span>
              <span class="r-chip">🔩 4x Scrap</span>
            </div>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="item-card">
          <div class="item-avatar">🏗️</div>
          <div class="item-details">
            <div class="item-header">
              <span class="item-name">Varuna Point (3-Bob)</span>
              <span class="tier-badge tier-epic">Syujet Oroli</span>
            </div>
            <div class="item-desc">Suv ostida qolgan ulkan osmono'par binolar majmuasi. Rhino Shark bossi va maxsus ilg'or chizmalar joylashgan.</div>
            <div class="recipe-chips">
              <span class="r-chip">📡 Radar: #7124</span>
              <span class="r-chip">🤿 Gidrokostyum kerak</span>
              <span class="r-chip">🏆 Rhino Trophy</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Sidebar -->
    <div class="right-bar">
      <!-- Tip widget -->
      <div class="info-widget">
        <div class="widget-title">💡 Kun Maslahati</div>
        <div class="tip-box">
          <strong>Akula Taktikasi:</strong> Suvda suzganda akula to'g'ridan-to'g'ri og'zini ochib kelayotgan paytda nayza bilan urilsa, u tishlamay orqaga qaytadi!
        </div>
      </div>

      <!-- Coords widget -->
      <div class="info-widget">
        <div class="widget-title">🧭 Radar Kodlari</div>
        <div class="coords-list">
          <div class="coord-row">
            <span>Radio Tower</span>
            <span class="coord-code">#4012</span>
          </div>
          <div class="coord-row">
            <span>Vasagatan (Kema)</span>
            <span class="coord-code">#2451</span>
          </div>
          <div class="coord-row">
            <span>Balboa Island</span>
            <span class="coord-code">#1829</span>
          </div>
          <div class="coord-row">
            <span>Caravan Town</span>
            <span class="coord-code">#6523</span>
          </div>
          <div class="coord-row">
            <span>Tangaroa</span>
            <span class="coord-code">#3180</span>
          </div>
        </div>
      </div>

      <!-- Popular Recipes -->
      <div class="info-widget">
        <div class="widget-title">🔥 Trenddagi Retseptlar</div>
        <div style="font-size: 11px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between;">
            <span>1. Simli Ilmoq (Titanium Hook)</span>
            <span style="color: #00e5ff;">1,840 marta</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>2. Biofuel To'liq Tizimi</span>
            <span style="color: #00e5ff;">1,420 marta</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>3. Suv Purkagich (Sprinkler)</span>
            <span style="color: #00e5ff;">980 marta</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
"""

# ==========================================
# 2. DESIGN 2: CYBERPUNK / HIGH-TECH GAMER HUD
# ==========================================
html_d2 = """<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<title>Dizayn 2: Cyber HUD & High-Tech Gamer | INFO-GAME.UZ</title>
<style>
  @page { size: 1440px 1020px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Consolas', 'Courier New', 'Segoe UI', monospace; }
  body { background: #08090d; color: #e0e7ff; width: 1440px; height: 1020px; overflow: hidden; position: relative; }
  
  /* Cyber Grid Background */
  .grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(0, 255, 204, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 204, 0.03) 1px, transparent 1px); background-size: 30px 30px; pointer-events: none; }
  
  /* Concept info banner */
  .concept-header { background: #0e0f17; border-bottom: 2px solid #00ffcc; padding: 10px 30px; display: flex; justify-content: space-between; align-items: center; }
  .concept-title { font-size: 13px; font-weight: 800; color: #00ffcc; letter-spacing: 2px; text-transform: uppercase; }
  .palette { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #94a3b8; }
  .color-dot { width: 14px; height: 14px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.2); }
  .concept-tags { display: flex; gap: 8px; }
  .c-tag { background: rgba(0, 255, 204, 0.1); color: #00ffcc; padding: 3px 8px; border: 1px solid rgba(0, 255, 204, 0.3); font-size: 10px; font-weight: 700; }

  /* Cyber HUD Top Bar */
  .hud-top { height: 60px; background: rgba(14, 16, 24, 0.95); border-bottom: 1px solid rgba(0, 255, 204, 0.2); display: flex; align-items: center; justify-content: space-between; padding: 0 30px; }
  .hud-brand { display: flex; align-items: center; gap: 12px; }
  .hud-glitch { font-size: 20px; font-weight: 900; color: #fff; letter-spacing: 1px; }
  .hud-glitch span { color: #00ffcc; text-shadow: 0 0 10px rgba(0, 255, 204, 0.8); }
  .hud-status { display: flex; gap: 14px; font-size: 11px; color: #94a3b8; }
  .hud-status-item { display: flex; align-items: center; gap: 5px; }
  .status-light { width: 8px; height: 8px; background: #00ffcc; border-radius: 50%; box-shadow: 0 0 8px #00ffcc; }

  .hud-search { width: 500px; height: 38px; background: #050608; border: 1px solid #00ffcc; display: flex; align-items: center; padding: 0 12px; gap: 10px; font-size: 12px; color: #00ffcc; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%); }
  .hud-search input { background: transparent; border: none; outline: none; color: #00ffcc; font-family: monospace; font-size: 12px; width: 100%; }

  /* Main HUD Layout */
  .hud-body { display: grid; grid-template-columns: 320px 1fr 340px; gap: 18px; padding: 20px 30px; height: calc(1020px - 140px); }

  /* Angled Container */
  .hud-box { background: rgba(14, 16, 24, 0.85); border: 1px solid rgba(0, 255, 204, 0.25); border-radius: 4px; padding: 16px; position: relative; }
  .hud-box::before { content: ''; position: absolute; top: -1px; left: -1px; width: 10px; height: 10px; border-top: 2px solid #00ffcc; border-left: 2px solid #00ffcc; }
  .hud-box::after { content: ''; position: absolute; bottom: -1px; right: -1px; width: 10px; height: 10px; border-bottom: 2px solid #00ffcc; border-right: 2px solid #00ffcc; }
  .box-title { font-size: 12px; font-weight: 800; color: #00ffcc; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0,255,204,0.15); padding-bottom: 6px; }

  /* Left: Crafting Calculator Simulator */
  .calc-target { background: #08090d; border: 1px solid rgba(255, 0, 85, 0.4); padding: 12px; margin-bottom: 14px; }
  .calc-target-header { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #ff0055; margin-bottom: 6px; }
  .tree-branch { font-size: 11px; color: #a5b4fc; margin-left: 10px; line-height: 1.8; border-left: 1px dashed rgba(0,255,204,0.3); padding-left: 10px; }

  .stat-progress { margin-top: 10px; font-size: 11px; }
  .progress-bar-bg { width: 100%; height: 6px; background: #1e1b4b; border-radius: 3px; overflow: hidden; margin-top: 4px; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, #00ffcc, #38bdf8); width: 75%; }

  /* Center: Interactive Tier Matrix */
  .center-grid { display: flex; flex-direction: column; gap: 16px; }
  .tier-row { background: #08090d; border: 1px solid rgba(255,255,255,0.08); padding: 12px; display: flex; align-items: center; gap: 14px; position: relative; }
  .tier-badge-big { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; border-radius: 4px; }
  .s-rank { background: rgba(255, 0, 85, 0.2); border: 2px solid #ff0055; color: #ff0055; text-shadow: 0 0 10px #ff0055; }
  .a-rank { background: rgba(0, 255, 204, 0.2); border: 2px solid #00ffcc; color: #00ffcc; text-shadow: 0 0 10px #00ffcc; }
  .b-rank { background: rgba(56, 189, 248, 0.2); border: 2px solid #38bdf8; color: #38bdf8; }

  .tier-info { flex: 1; }
  .tier-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .tier-stat-bars { display: flex; gap: 20px; font-size: 11px; color: #94a3b8; }

  /* Right: Boss Combat HUD */
  .boss-card { background: #090a10; border: 1px solid #ff0055; padding: 12px; margin-bottom: 12px; }
  .boss-name { font-size: 13px; font-weight: 800; color: #ff0055; display: flex; justify-content: space-between; }
  .boss-hp { font-size: 11px; color: #fda4af; margin: 4px 0 8px 0; }
  .boss-phase { font-size: 10px; background: rgba(255,0,85,0.15); border-left: 2px solid #ff0055; padding: 6px; margin-bottom: 6px; color: #e2e8f0; }

  .action-btn-neon { background: #00ffcc; color: #050608; border: none; padding: 10px; font-weight: 900; font-family: monospace; font-size: 12px; text-transform: uppercase; cursor: pointer; letter-spacing: 1px; width: 100%; text-align: center; clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%); }
</style>
</head>
<body>
  <div class="grid-bg"></div>

  <!-- Concept Header -->
  <div class="concept-header">
    <div class="concept-title">KONSEPTSIYA 2: CYBERPUNK / HIGH-TECH GAMER HUD (Taktik Portal)</div>
    <div class="palette">
      <span>Ranglar:</span>
      <div class="color-dot" style="background: #08090d;"></div>
      <div class="color-dot" style="background: #00ffcc;"></div>
      <div class="color-dot" style="background: #ff0055;"></div>
      <div class="color-dot" style="background: #8b5cf6;"></div>
    </div>
    <div class="concept-tags">
      <span class="c-tag">Neon HUD</span>
      <span class="c-tag">Angled Borders</span>
      <span class="c-tag">Kalkulyator Fokus</span>
      <span class="c-tag">Gamer Estetika</span>
    </div>
  </div>

  <!-- HUD Top Bar -->
  <div class="hud-top">
    <div class="hud-brand">
      <div class="hud-glitch">INFO-GAME // <span>CORE_V2</span></div>
    </div>

    <div class="hud-search">
      <span>&gt;_</span>
      <input type="text" value="SEARCH: TITANIUM INGOT // CRAFTING_ID: #4092" readonly>
      <span style="font-size: 10px; background: #00ffcc22; padding: 2px 5px;">ENTER</span>
    </div>

    <div class="hud-status">
      <div class="hud-status-item">
        <div class="status-light"></div>
        <span>SYSTEM: ONLINE</span>
      </div>
      <div class="hud-status-item">
        <span>ITEMS: 1,420</span>
      </div>
      <div class="hud-status-item">
        <span>LOC: UZ-TAS</span>
      </div>
    </div>
  </div>

  <!-- Main Body -->
  <div class="hud-body">
    <!-- Left: Crafting Calculator Simulator -->
    <div class="hud-box">
      <div class="box-title">
        <span>[01] RESURS KALKULYATORI</span>
        <span style="color: #ff0055;">LIVE_CALC</span>
      </div>

      <div class="calc-target">
        <div class="calc-target-header">
          <span>MAQSAD: METAL SPEAR</span>
          <span>TIER: A</span>
        </div>
        <div style="font-size: 10px; color: #94a3b8; margin-bottom: 8px;">Dushmanlarga 15 DPS yetkazuvchi asosiy jangovar qurol.</div>

        <div class="tree-branch">
          <div>├─ 1x Wooden Spear</div>
          <div style="padding-left: 12px; color: #64748b;">├─ 6x Plank (Taxta) [4/6] ⚠️</div>
          <div style="padding-left: 12px; color: #64748b;">└─ 1x Rope (Arqon) [✔ BOR]</div>
          <div>├─ 3x Scrap (Temir-tersak) [✔ 8/3]</div>
          <div>└─ 1x Bolt (Boltcha) [✔ 2/1]</div>
        </div>

        <div class="stat-progress">
          <div style="display: flex; justify-content: space-between;">
            <span>Resurslar yetarliligi:</span>
            <span style="color: #00ffcc;">85%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-fill"></div>
          </div>
        </div>
      </div>

      <div style="font-size: 11px; color: #94a3b8; line-height: 1.6; margin-bottom: 14px;">
        <div>⚠️ <strong>Yetishmayotgan xomashyo:</strong></div>
        <div style="color: #fda4af;">- 2x Plank (Okeandan ilmoq bilan yig'ing)</div>
      </div>

      <button class="action-btn-neon">SOL RO'YXATIGA QO'SHISH [+]</button>
    </div>

    <!-- Center: Tier Matrix & Weapons HUD -->
    <div class="center-grid">
      <div class="hud-box" style="flex: 1;">
        <div class="box-title">
          <span>[02] QUROLLAR & ASBOBLAR REYTINGI (TIER LIST)</span>
          <span style="color: #00ffcc;">PATCH_1.09</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <!-- S Rank -->
          <div class="tier-row">
            <div class="tier-badge-big s-rank">S</div>
            <div class="tier-info">
              <div class="tier-title">Titanium Sword (Titan Qilichi)</div>
              <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">Zarba kuchi: 20 HP | Chidamlilik: 170 zarba | Tebranish: Tez</div>
              <div class="tier-stat-bars">
                <span>Zarba: ██████████ 100%</span>
                <span style="color: #ff0055;">Narx: 3x Titanium Ingot</span>
              </div>
            </div>
          </div>

          <!-- A Rank -->
          <div class="tier-row">
            <div class="tier-badge-big a-rank">A</div>
            <div class="tier-info">
              <div class="tier-title">Metal Spear (Temir Nayza)</div>
              <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">Zarba kuchi: 15 HP | Chidamlilik: 120 zarba | Masofa: Uzoq</div>
              <div class="tier-stat-bars">
                <span>Zarba: ███████░░░ 75%</span>
                <span style="color: #00ffcc;">Narx: 3x Scrap, 1x Bolt</span>
              </div>
            </div>
          </div>

          <!-- B Rank -->
          <div class="tier-row">
            <div class="tier-badge-big b-rank">B</div>
            <div class="tier-info">
              <div class="tier-title">Wooden Spear (Yog'och Nayza)</div>
              <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">Zarba kuchi: 10 HP | Chidamlilik: 50 zarba | Oson yasaladi</div>
              <div class="tier-stat-bars">
                <span>Zarba: ████░░░░░░ 50%</span>
                <span style="color: #38bdf8;">Narx: 6x Plank, 1x Rope</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Boss Combat HUD -->
    <div class="hud-box">
      <div class="box-title">
        <span>[03] BOSS JANGI TAKTIKASI</span>
        <span style="color: #ff0055;">ALERT</span>
      </div>

      <div class="boss-card">
        <div class="boss-name">
          <span>RHINO SHARK</span>
          <span>CHAPTER 3</span>
        </div>
        <div class="boss-hp">HP: IMMUNE (Portlatish kerak) | JOY: Varuna Point</div>
        
        <div class="boss-phase">
          <strong>1-Bosqich:</strong> Ustunlar orqasiga suzing va akula kelib urilishini kuting.
        </div>
        <div class="boss-phase">
          <strong>2-Bosqich:</strong> Portlovchi bochkani hosil bo'lgan yoriqqa joylashtiring.
        </div>
        <div class="boss-phase">
          <strong>3-Bosqich:</strong> 3 marta takrorlangandan so'ng xazina xonasi ochiladi.
        </div>
      </div>

      <div style="background: rgba(0,255,204,0.06); border: 1px dashed rgba(0,255,204,0.3); padding: 10px; font-size: 11px;">
        <div style="color: #00ffcc; font-weight: 700; margin-bottom: 4px;">⚡ TEZKOR TUGMALAR:</div>
        <div style="color: #cbd5e1; line-height: 1.6;">
          <div>[1] Oziq-ovqat Bufflari</div>
          <div>[2] Suv Tizimi Avtomatika</div>
          <div>[3] Dvigatel Quvvati Hisobi</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
"""

# ==========================================
# 3. DESIGN 3: CLEAN MINIMALIST & NOTION DOCS
# ==========================================
html_d3 = """<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<title>Dizayn 3: Clean Minimalist & Notion Docs | INFO-GAME.UZ</title>
<style>
  @page { size: 1440px 1020px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif; }
  body { background: #ffffff; color: #0f172a; width: 1440px; height: 1020px; overflow: hidden; position: relative; }
  
  /* Concept info banner */
  .concept-header { background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 10px 30px; display: flex; justify-content: space-between; align-items: center; }
  .concept-title { font-size: 13px; font-weight: 700; color: #2563eb; letter-spacing: 0.5px; text-transform: uppercase; }
  .palette { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #64748b; }
  .color-dot { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); }
  .concept-tags { display: flex; gap: 8px; }
  .c-tag { background: #eff6ff; color: #2563eb; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; }

  /* Minimal Top Bar */
  .nav-docs { height: 56px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; padding: 0 30px; }
  .brand { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 700; color: #0f172a; }
  .brand-badge { background: #2563eb; color: #fff; padding: 2px 7px; border-radius: 4px; font-size: 11px; }

  .search-input { width: 360px; height: 34px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0 12px; font-size: 12px; color: #64748b; display: flex; align-items: center; justify-content: space-between; }

  /* 3-Column Layout */
  .docs-container { display: grid; grid-template-columns: 240px 1fr 240px; height: calc(1020px - 96px); }

  /* Left Sidebar: Navigation Tree */
  .docs-sidebar { border-right: 1px solid #e2e8f0; padding: 20px 16px; background: #f8fafc; overflow-y: hidden; }
  .tree-section-title { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .tree-link { display: block; padding: 6px 10px; border-radius: 6px; font-size: 13px; color: #334155; text-decoration: none; margin-bottom: 2px; }
  .tree-link.active { background: #eff6ff; color: #2563eb; font-weight: 600; }
  .tree-link.nested { padding-left: 22px; font-size: 12px; color: #64748b; }

  /* Center Article View */
  .docs-article { padding: 30px 40px; overflow-y: hidden; }
  .breadcrumb { font-size: 12px; color: #64748b; margin-bottom: 12px; display: flex; gap: 6px; }
  .article-title { font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
  .article-subtitle { font-size: 14px; color: #64748b; margin-bottom: 20px; line-height: 1.5; }

  /* Info Meta Box */
  .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; font-size: 12px; }
  .meta-item label { display: block; color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: 700; margin-bottom: 2px; }
  .meta-item span { font-weight: 600; color: #0f172a; }

  /* Tabs */
  .tab-bar { display: flex; border-bottom: 1px solid #e2e8f0; gap: 20px; margin-bottom: 16px; font-size: 13px; font-weight: 600; }
  .tab-btn { padding-bottom: 8px; color: #64748b; cursor: pointer; }
  .tab-btn.active { color: #2563eb; border-bottom: 2px solid #2563eb; }

  /* Content elements */
  .callout-blue { background: #eff6ff; border-left: 3px solid #2563eb; padding: 12px; border-radius: 0 6px 6px 0; font-size: 12px; color: #1e40af; line-height: 1.5; margin-bottom: 18px; }
  
  .clean-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 18px; }
  .clean-table th { background: #f1f5f9; text-align: left; padding: 8px 12px; color: #475569; font-weight: 600; border: 1px solid #e2e8f0; }
  .clean-table td { padding: 8px 12px; border: 1px solid #e2e8f0; color: #1e293b; }

  /* Right Sidebar: Table of contents */
  .docs-toc { border-left: 1px solid #e2e8f0; padding: 20px 16px; font-size: 12px; }
  .toc-title { font-weight: 700; color: #0f172a; margin-bottom: 10px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
  .toc-link { display: block; color: #64748b; margin-bottom: 8px; text-decoration: none; }
  .toc-link.active { color: #2563eb; font-weight: 600; }
</style>
</head>
<body>
  <!-- Concept Header -->
  <div class="concept-header">
    <div class="concept-title">KONSEPTSIYA 3: CLEAN MINIMALIST & NOTION DOCS (Maksimal Qulaylik)</div>
    <div class="palette">
      <span>Ranglar:</span>
      <div class="color-dot" style="background: #ffffff;"></div>
      <div class="color-dot" style="background: #f8fafc;"></div>
      <div class="color-dot" style="background: #2563eb;"></div>
      <div class="color-dot" style="background: #0f172a;"></div>
    </div>
    <div class="concept-tags">
      <span class="c-tag">O'qishga qulay</span>
      <span class="c-tag">Tez yuklanuvchi</span>
      <span class="c-tag">Hujjatlashgan</span>
      <span class="c-tag">Notion / GitBook Uslubi</span>
    </div>
  </div>

  <!-- Minimal Nav -->
  <div class="nav-docs">
    <div class="brand">
      <span>INFO-GAME.UZ</span>
      <span class="brand-badge">WIKI DOCS</span>
      <span style="font-size: 13px; color: #64748b; font-weight: normal;">/ Raft Ensiklopediyasi</span>
    </div>

    <div class="search-input">
      <span>🔍 Maqoladan qidirish...</span>
      <span style="font-size: 10px; background: #e2e8f0; padding: 2px 5px; border-radius: 4px;">Ctrl+K</span>
    </div>

    <div style="display: flex; gap: 10px; font-size: 12px;">
      <span style="color: #2563eb; font-weight: 600;">O'zbek tili ▾</span>
      <span>|</span>
      <span style="color: #64748b;">GitHub Sync</span>
    </div>
  </div>

  <!-- Main Container -->
  <div class="docs-container">
    <!-- Left Navigation Tree -->
    <div class="docs-sidebar">
      <div class="tree-section-title">Boshlanish</div>
      <a href="#" class="tree-link">Kirish & Boshlang'ich Sol</a>
      <a href="#" class="tree-link">Omon qolish qoidalari</a>

      <div class="tree-section-title" style="margin-top: 14px;">Resurslar & Minerallar</div>
      <a href="#" class="tree-link">Plank & Plastic</a>
      <a href="#" class="tree-link">Scrap & Metal Ore</a>
      <a href="#" class="tree-link active">Titanium Ingot (Titan)</a>
      <a href="#" class="tree-link nested">└ Qayerdan topiladi</a>
      <a href="#" class="tree-link nested">└ Nimalar yasaladi</a>

      <div class="tree-section-title" style="margin-top: 14px;">Mashinalar & Texnika</div>
      <a href="#" class="tree-link">Smelter (Pech)</a>
      <a href="#" class="tree-link">Biofuel Refiner</a>
      <a href="#" class="tree-link">Anchor & Steering</a>
    </div>

    <!-- Center Article -->
    <div class="docs-article">
      <div class="breadcrumb">
        <span>Bosh sahifa</span> &gt; <span>Resurslar</span> &gt; <span>Minerallar</span> &gt; <span style="color: #2563eb;">Titanium Ingot</span>
      </div>

      <h1 class="article-title">Titanium Ingot (Titan Quymasi)</h1>
      <p class="article-subtitle">O'yindagi eng yuqori darajadagi asbob-uskunalar, avtomatlashtirilgan motorlar va suv saqlagichlar yasash uchun zarur bo'lgan nodir metall.</p>

      <div class="meta-box">
        <div class="meta-item">
          <label>Item ID</label>
          <span>#titanium_ingot</span>
        </div>
        <div class="meta-item">
          <label>Stack Sig'imi</label>
          <span>20 ta</span>
        </div>
        <div class="meta-item">
          <label>Erish Vaqti</label>
          <span>60 soniya (Smelter)</span>
        </div>
        <div class="meta-item">
          <label>Manbasi</label>
          <span>Tangaroa / Metalldetektor</span>
        </div>
      </div>

      <div class="tab-bar">
        <div class="tab-btn active">Umumiy ko'rinish</div>
        <div class="tab-btn">Olish usullari</div>
        <div class="tab-btn">Ishlatiladigan retseptlar (12)</div>
      </div>

      <div class="callout-blue">
        💡 <strong>Maslahat:</strong> Titanni xom holda (Titanium Ore) ishlatib bo'lmaydi. Uni avval oddiy yoki elektr pechda eritib, quyma holatga keltirish shart!
      </div>

      <table class="clean-table">
        <thead>
          <tr>
            <th>Kerakli Buyum</th>
            <th>Ketadigan Titan</th>
            <th>Qo'shimcha Resurslar</th>
            <th>Vazifasi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Titanium Hook</strong></td>
            <td>1x Titan</td>
            <td>2x Bolt, 1x Rope</td>
            <td>Eng tezkor va uzoqqa otiluvchi ilmoq</td>
          </tr>
          <tr>
            <td><strong>Titanium Sword</strong></td>
            <td>3x Titan</td>
            <td>2x Bolt, 1x Leather</td>
            <td>20 DPS maksimal zarba qilichi</td>
          </tr>
          <tr>
            <td><strong>Water Tank (Katta)</strong></td>
            <td>4x Titan</td>
            <td>10x Plastic, 2x Scrap</td>
            <td>150 litr toza ichimlik suvi zaxirasi</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Right Table of Contents -->
    <div class="docs-toc">
      <div class="toc-title">Ushbu sahifada</div>
      <a href="#" class="toc-link active">1. Umumiy tavsif</a>
      <a href="#" class="toc-link">2. Parametrlar & Xususiyatlar</a>
      <a href="#" class="toc-link">3. Olish manbalari</a>
      <a href="#" class="toc-link">4. Titan retseptlari jadvali</a>
      <a href="#" class="toc-link">5. Xulosa va tavsiyalar</a>

      <div style="margin-top: 30px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
        <div style="font-weight: 700; font-size: 11px; margin-bottom: 4px;">Fikr bildirish</div>
        <div style="font-size: 11px; color: #64748b;">Xatolik ko'rdingizmi? Tahrir taklif qiling.</div>
      </div>
    </div>
  </div>
</body>
</html>
"""

# ==========================================
# 4. DESIGN 4: RPG INVENTORY & BENTO GRID
# ==========================================
html_d4 = """<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<title>Dizayn 4: RPG Inventory & Bento Grid | INFO-GAME.UZ</title>
<style>
  @page { size: 1440px 1020px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', -apple-system, Roboto, sans-serif; }
  body { background: #0f1115; color: #f1f5f9; width: 1440px; height: 1020px; overflow: hidden; position: relative; }

  /* Concept info banner */
  .concept-header { background: #181a20; border-bottom: 2px solid #f59e0b; padding: 10px 30px; display: flex; justify-content: space-between; align-items: center; }
  .concept-title { font-size: 13px; font-weight: 800; color: #f59e0b; letter-spacing: 1px; text-transform: uppercase; }
  .palette { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #94a3b8; }
  .color-dot { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); }
  .concept-tags { display: flex; gap: 8px; }
  .c-tag { background: rgba(245, 158, 11, 0.15); color: #fbbf24; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; border: 1px solid rgba(245, 158, 11, 0.3); }

  /* Bento Navbar */
  .bento-nav { height: 60px; background: rgba(24, 26, 32, 0.9); border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; padding: 0 30px; }
  .brand { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 800; color: #fff; }
  .brand span { color: #f59e0b; }

  /* Bento Grid Master */
  .bento-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: repeat(2, 1fr); gap: 18px; padding: 20px 30px; height: calc(1020px - 110px); }

  /* Bento Tile */
  .b-tile { background: #16181f; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px; position: relative; display: flex; flex-direction: column; overflow: hidden; }
  .b-tile.highlight { border-color: rgba(245, 158, 11, 0.35); background: linear-gradient(145deg, #181b24, #12141a); }
  .tile-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .tile-title { font-size: 13px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; }
  .tile-badge { font-size: 10px; background: rgba(245, 158, 11, 0.15); color: #fbbf24; padding: 2px 7px; border-radius: 4px; font-weight: 700; }

  /* Tile 1: Interactive Radar Screen */
  .radar-display { flex: 1; background: #090a0d; border-radius: 12px; border: 1px solid #1e293b; position: relative; display: flex; align-items: center; justify-content: center; }
  .radar-circle { width: 220px; height: 220px; border-radius: 50%; border: 1px solid rgba(34, 197, 94, 0.25); position: absolute; }
  .radar-circle-2 { width: 140px; height: 140px; border-radius: 50%; border: 1px solid rgba(34, 197, 94, 0.35); position: absolute; }
  .radar-dot { width: 10px; height: 10px; background: #22c55e; border-radius: 50%; position: absolute; box-shadow: 0 0 10px #22c55e; }
  .radar-cross-h { width: 100%; height: 1px; background: rgba(34, 197, 94, 0.15); position: absolute; }
  .radar-cross-v { height: 100%; width: 1px; background: rgba(34, 197, 94, 0.15); position: absolute; }

  /* Tile 2: Cooking Pot Slots */
  .cook-slots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
  .slot { aspect-ratio: 1; background: #0c0d12; border: 1px solid #2d313d; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 20px; position: relative; }
  .slot span.count { position: absolute; bottom: 4px; right: 6px; font-size: 10px; font-weight: 700; color: #fbbf24; }

  /* Tile 3: Animal Drops */
  .drop-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #0c0d12; border-radius: 8px; margin-bottom: 6px; font-size: 12px; }
  .drop-percent { color: #22c55e; font-weight: 700; }

  /* Tile 4: Trading Currency */
  .currency-card { background: #0c0d12; border-radius: 10px; padding: 12px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; }
  .cur-icon { width: 36px; height: 36px; border-radius: 8px; background: #252834; display: flex; align-items: center; justify-content: center; font-size: 18px; }
</style>
</head>
<body>
  <!-- Concept Header -->
  <div class="concept-header">
    <div class="concept-title">KONSEPTSIYA 4: RPG INVENTORY & BENTO GRID (Interaktiv UI)</div>
    <div class="palette">
      <span>Ranglar:</span>
      <div class="color-dot" style="background: #0f1115;"></div>
      <div class="color-dot" style="background: #181a20;"></div>
      <div class="color-dot" style="background: #f59e0b;"></div>
      <div class="color-dot" style="background: #22c55e;"></div>
    </div>
    <div class="concept-tags">
      <span class="c-tag">Bento Box Grid</span>
      <span class="c-tag">Slot-based Crafter</span>
      <span class="c-tag">Interaktiv Modullar</span>
      <span class="c-tag">RPG Gamifikatsiya</span>
    </div>
  </div>

  <!-- Bento Nav -->
  <div class="bento-nav">
    <div class="brand">
      <span>🧭 INFO-GAME</span>
      <span style="font-size: 14px; color: #94a3b8; font-weight: normal;">| Bento Dashboard</span>
    </div>

    <div style="display: flex; gap: 14px; font-size: 12px;">
      <span style="color: #fbbf24;">⚡ Sol Og'irligi: 320 blok</span>
      <span style="color: #38bdf8;">💧 Suv Zaxirasi: 100%</span>
      <span style="color: #4ade80;">🍖 Ozuqa: To'liq</span>
    </div>
  </div>

  <!-- Bento Grid -->
  <div class="bento-grid">
    <!-- Tile 1 (Big): Radar & Story Navigation -->
    <div class="b-tile highlight" style="grid-row: span 2;">
      <div class="tile-header">
        <div class="tile-title">
          <span>📡</span>
          <span>Interaktiv Radar & Syujet Xaritasi</span>
        </div>
        <span class="tile-badge">LIVE RADAR</span>
      </div>

      <div class="radar-display">
        <div class="radar-cross-h"></div>
        <div class="radar-cross-v"></div>
        <div class="radar-circle"></div>
        <div class="radar-circle-2"></div>
        
        <!-- Blips -->
        <div class="radar-dot" style="top: 35%; left: 62%;"></div>
        <div style="position: absolute; top: 38%; left: 65%; font-size: 10px; color: #4ade80; font-weight: 700;">Vasagatan (#2451)</div>

        <div class="radar-dot" style="top: 70%; left: 30%; background: #00e5ff; box-shadow: 0 0 10px #00e5ff;"></div>
        <div style="position: absolute; top: 73%; left: 32%; font-size: 10px; color: #00e5ff; font-weight: 700;">Tangaroa (#3180)</div>
      </div>

      <div style="margin-top: 14px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 11px;">
        <div style="background: #090a0d; padding: 8px; border-radius: 6px;">
          <div style="color: #94a3b8;">Hozirgi Masofa</div>
          <div style="font-weight: 700; color: #fff;">450 metr</div>
        </div>
        <div style="background: #090a0d; padding: 8px; border-radius: 6px;">
          <div style="color: #94a3b8;">Shamol Yo'nalishi</div>
          <div style="font-weight: 700; color: #fbbf24;">Shimoliy-Sharq</div>
        </div>
        <div style="background: #090a0d; padding: 8px; border-radius: 6px;">
          <div style="color: #94a3b8;">Dvigatellar</div>
          <div style="font-weight: 700; color: #4ade80;">2x Ishlamoqda</div>
        </div>
      </div>
    </div>

    <!-- Tile 2: Cooking Pot Simulator -->
    <div class="b-tile" style="grid-column: span 2;">
      <div class="tile-header">
        <div class="tile-title">
          <span>🍲</span>
          <span>Oshpazlik Qozoni Simulyatori (Cooking Pot)</span>
        </div>
        <span class="tile-badge">SLOT RETSEPT</span>
      </div>

      <div class="cook-slots">
        <div class="slot">🦈<span class="count">x1</span></div>
        <div class="slot">🦈<span class="count">x1</span></div>
        <div class="slot">🍄<span class="count">x1</span></div>
        <div class="slot">🐟<span class="count">x1</span></div>
      </div>

      <div style="background: #0c0d12; border-radius: 8px; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 12px; font-weight: 700; color: #fff;">Natija: Shark Dinner</div>
          <div style="font-size: 11px; color: #4ade80;">Bonus: +100 To'qlik, +50 Zaxira HP</div>
        </div>
        <div style="font-size: 11px; background: #f59e0b; color: #0f1115; font-weight: 700; padding: 4px 10px; border-radius: 6px;">Tayyorlash: 25s</div>
      </div>
    </div>

    <!-- Tile 3: Animal Drops -->
    <div class="b-tile">
      <div class="tile-header">
        <div class="tile-title">
          <span>🦙</span>
          <span>Jonivorlar & Drop %</span>
        </div>
      </div>

      <div class="drop-row">
        <span>Llama (Xonaki)</span>
        <span class="drop-percent">100% Jun</span>
      </div>
      <div class="drop-row">
        <span>Echki (Goat)</span>
        <span class="drop-percent">Kunlik Sut</span>
      </div>
      <div class="drop-row">
        <span>Akula (Bryus)</span>
        <span class="drop-percent">4x Go'sht, 1x Kalla</span>
      </div>
    </div>

    <!-- Tile 4: Trading Currency -->
    <div class="b-tile">
      <div class="tile-header">
        <div class="tile-title">
          <span>🪙</span>
          <span>Savdo Valyutalari</span>
        </div>
      </div>

      <div class="currency-card">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="cur-icon">📦</div>
          <div>
            <div style="font-size: 12px; font-weight: 700;">Trash Cube</div>
            <div style="font-size: 10px; color: #94a3b8;">Qayta ishlangan chiqindi</div>
          </div>
        </div>
        <div style="font-size: 12px; font-weight: 700; color: #fbbf24;">Recycler</div>
      </div>

      <div class="currency-card">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="cur-icon">🪙</div>
          <div>
            <div style="font-size: 12px; font-weight: 700;">Trade Coin</div>
            <div style="font-size: 10px; color: #94a3b8;">Savdogar tangalari</div>
          </div>
        </div>
        <div style="font-size: 12px; font-weight: 700; color: #4ade80;">Tier 3</div>
      </div>
    </div>
  </div>
</body>
</html>
"""

# ==========================================
# 5. DESIGN 5: ESPORTS & GAMING MEDIA PORTAL
# ==========================================
html_d5 = """<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<title>Dizayn 5: Esports & Gaming Media Portal | INFO-GAME.UZ</title>
<style>
  @page { size: 1440px 1020px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  body { background: #0c0e12; color: #e2e8f0; width: 1440px; height: 1020px; overflow: hidden; position: relative; }

  /* Concept info banner */
  .concept-header { background: #13161c; border-bottom: 2px solid #ff4655; padding: 10px 30px; display: flex; justify-content: space-between; align-items: center; }
  .concept-title { font-size: 13px; font-weight: 800; color: #ff4655; letter-spacing: 1px; text-transform: uppercase; }
  .palette { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #94a3b8; }
  .color-dot { width: 14px; height: 14px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.2); }
  .concept-tags { display: flex; gap: 8px; }
  .c-tag { background: rgba(255, 70, 85, 0.15); color: #ff4655; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; border: 1px solid rgba(255, 70, 85, 0.3); }

  /* Media Portal Top Navbar */
  .portal-nav { height: 64px; background: #13161c; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; padding: 0 30px; }
  .brand { display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
  .brand span { color: #ff4655; }

  .portal-menu { display: flex; gap: 24px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .portal-menu a { color: #94a3b8; text-decoration: none; }
  .portal-menu a.active { color: #ff4655; border-bottom: 2px solid #ff4655; padding-bottom: 20px; }

  /* Main Media Layout */
  .media-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; padding: 20px 30px; height: calc(1020px - 120px); }

  /* Hero Featured Story */
  .hero-feature { background: linear-gradient(180deg, transparent 40%, rgba(12, 14, 18, 0.95)), #1a1e27; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); padding: 24px; display: flex; flex-direction: column; justify-content: flex-end; position: relative; height: 320px; }
  .feature-badge { align-self: flex-start; background: #ff4655; color: #fff; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; margin-bottom: 12px; }
  .feature-title { font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 8px; line-height: 1.2; }
  .feature-meta { font-size: 12px; color: #94a3b8; display: flex; gap: 14px; }

  /* Lower Grid in Left Col */
  .lower-articles { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 16px; }
  .sub-card { background: #13161c; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 14px; }
  .sub-tag { font-size: 10px; color: #ff4655; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
  .sub-title { font-size: 14px; font-weight: 700; color: #fff; line-height: 1.4; margin-bottom: 6px; }
  .sub-desc { font-size: 11px; color: #94a3b8; line-height: 1.4; }

  /* Right Column: Community & Trending Guides */
  .side-panel { display: flex; flex-direction: column; gap: 16px; }
  .panel-box { background: #13161c; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; }
  .panel-title { font-size: 13px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
  
  .trend-item { display: flex; gap: 12px; align-items: flex-start; padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .trend-num { font-size: 18px; font-weight: 900; color: #ff4655; line-height: 1; }
  .trend-text { font-size: 12px; font-weight: 600; color: #e2e8f0; line-height: 1.4; }

  .forum-thread { background: #0c0e12; border-radius: 8px; padding: 10px; margin-bottom: 8px; font-size: 11px; }
  .thread-title { font-weight: 700; color: #fff; margin-bottom: 4px; }
  .thread-meta { display: flex; justify-content: space-between; color: #94a3b8; font-size: 10px; }
</style>
</head>
<body>
  <!-- Concept Header -->
  <div class="concept-header">
    <div class="concept-title">KONSEPTSIYA 5: ESPORTS & GAMING MEDIA PORTAL (Portal + Hamjamiyat)</div>
    <div class="palette">
      <span>Ranglar:</span>
      <div class="color-dot" style="background: #0c0e12;"></div>
      <div class="color-dot" style="background: #13161c;"></div>
      <div class="color-dot" style="background: #ff4655;"></div>
      <div class="color-dot" style="background: #e2e8f0;"></div>
    </div>
    <div class="concept-tags">
      <span class="c-tag">Media Portal</span>
      <span class="c-tag">Hamjamiyat & Forum</span>
      <span class="c-tag">Yangiliklar Oqimi</span>
      <span class="c-tag">IGN / Dexerto Uslubi</span>
    </div>
  </div>

  <!-- Top Nav -->
  <div class="portal-nav">
    <div class="brand">
      INFO-GAME<span>.UZ</span>
    </div>

    <div class="portal-menu">
      <a href="#" class="active">Wiki Qo'llanmalar</a>
      <a href="#">Yangiliklar</a>
      <a href="#">Patch Notes</a>
      <a href="#">Hamjamiyat Forumi</a>
      <a href="#">Discord Server</a>
    </div>

    <div style="font-size: 12px; background: #ff4655; color: #fff; padding: 6px 14px; border-radius: 6px; font-weight: 700;">
      Hamjamiyatga Qo'shilish
    </div>
  </div>

  <!-- Main Layout -->
  <div class="media-layout">
    <!-- Left Col -->
    <div>
      <div class="hero-feature">
        <span class="feature-badge">Eksklyuziv Qo'llanma</span>
        <h2 class="feature-title">Raft The Final Chapter: O'yinni 100% Tugatish va Barcha Syujet Sirlari</h2>
        <div class="feature-meta">
          <span>✍️ Muallif: info-game tahririyati</span>
          <span>📅 Yangilandi: 24-Oktabr</span>
          <span>👁️ 14,200 ko'rildi</span>
        </div>
      </div>

      <div class="lower-articles">
        <div class="sub-card">
          <div class="sub-tag">Avtomatlashtirish</div>
          <div class="sub-title">Biofuel va Quvurlar Tizimini O'rnatish</div>
          <div class="sub-desc">Solingizni doimiy ravishda o'tin yoqishdan qutqaruvchi to'liq avtonom yoqilg'i stansiyasi yaratish bo'yicha to'liq qo'llanma.</div>
        </div>

        <div class="sub-card">
          <div class="sub-tag">Boss Janglari</div>
          <div class="sub-title">Rhino Sharkni Qurolsiz Mag'lub Etish Usuli</div>
          <div class="sub-desc">Varuna Pointdagi ulkan karkidon akulani faqat portlovchi bochkalar yordamida tezkor tor-mor qilish taktikasi.</div>
        </div>
      </div>
    </div>

    <!-- Right Col -->
    <div class="side-panel">
      <!-- Trending Guides -->
      <div class="panel-box">
        <div class="panel-title">
          <span>🔥 Eng Ko'p O'qilganlar</span>
          <span style="font-size: 10px; color: #ff4655;">TOP 5</span>
        </div>

        <div class="trend-item">
          <div class="trend-num">01</div>
          <div class="trend-text">Titanium Ingotni eng tezkor fermerlik qilish koordinatalari</div>
        </div>
        <div class="trend-item">
          <div class="trend-num">02</div>
          <div class="trend-text">Akula Bryusdan solni butunlay himoyalash siri</div>
        </div>
        <div class="trend-item">
          <div class="trend-num">03</div>
          <div class="trend-text">Barcha 8 ta syujet oroli radar kodlari jadvali</div>
        </div>
      </div>

      <!-- Forum Discussions -->
      <div class="panel-box">
        <div class="panel-title">
          <span>💬 Hamjamiyat Savol-Javoblari</span>
        </div>

        <div class="forum-thread">
          <div class="thread-title">Solim to'xtab qoldi, dvigatel quvvati yetmayapti?</div>
          <div class="thread-meta">
            <span>👤 Bekzod99</span>
            <span>12 ta javob • 5 daqiqa oldin</span>
          </div>
        </div>

        <div class="forum-thread">
          <div class="thread-title">Tangaroa orolidagi elevator kodini qayerdan oladi?</div>
          <div class="thread-meta">
            <span>👤 Gamer_UZ</span>
            <span>8 ta javob • 22 daqiqa oldin</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
"""

# Write all single HTML files
files = {
    "dizayn-1-ocean-dark.html": html_d1,
    "dizayn-2-cyber-hud.html": html_d2,
    "dizayn-3-notion-clean.html": html_d3,
    "dizayn-4-rpg-bento.html": html_d4,
    "dizayn-5-gaming-portal.html": html_d5,
}

for fname, content in files.items():
    fpath = os.path.join(DESIGNS_DIR, fname)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {fname}")

print("All 5 standalone designs written successfully.")
