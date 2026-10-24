import os
import subprocess
import shutil

ROOT_DIR = r"D:\info-game.uz"
DESIGNS_DIR = r"D:\info-game.uz\designs"
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# Copy individual PDFs to root directory for easy access
for f in os.listdir(DESIGNS_DIR):
    if f.endswith(".pdf"):
        shutil.copy(os.path.join(DESIGNS_DIR, f), os.path.join(ROOT_DIR, f))
        print(f"Copied {f} to root directory.")

# Master Presentation HTML combining all pages with CSS page breaks
master_html_path = os.path.join(DESIGNS_DIR, "master_presentation.html")
master_pdf_path = os.path.join(ROOT_DIR, "INFO-GAME-UZ-5-XIL-DIZAYN-TAQDIMOTI.pdf")

# Read individual design bodies
def extract_body(fname):
    with open(os.path.join(DESIGNS_DIR, fname), "r", encoding="utf-8") as file:
        content = file.read()
        start = content.find("<body>") + len("<body>")
        end = content.find("</body>")
        return content[start:end]

def extract_style(fname):
    with open(os.path.join(DESIGNS_DIR, fname), "r", encoding="utf-8") as file:
        content = file.read()
        start = content.find("<style>") + len("<style>")
        end = content.find("</style>")
        return content[start:end]

cover_html = """
<div class="presentation-page cover-page">
  <div class="cover-inner">
    <div class="cover-badge">LOYYIHA KONSEPSIYASI VA UI/UX TAQDIMOTI</div>
    <h1 class="cover-title">INFO-GAME<span>.UZ</span></h1>
    <h2 class="cover-subtitle">O'zbekistondagi Birinchi To'liq O'yin Ensiklopediyasi va Ma'lumotlar Portali</h2>
    <p class="cover-desc">
      "Raft: The Final Chapter" va boshqa mashhur o'yinlar uchun moslashtirilgan 5 xil zamonaviy dizayn konsepsiyalari, foydalanuvchi interfeysi (UI) va texnologik qiyosiy tahlil.
    </p>

    <div class="cover-grid">
      <div class="cover-card">
        <div class="card-num">01</div>
        <div class="card-name">Ocean Survival Dark</div>
        <div class="card-note">O'yin muhitiga to'liq moslashgan to'q-ko'k dizayn</div>
      </div>
      <div class="cover-card">
        <div class="card-num">02</div>
        <div class="card-name">Cyberpunk HUD</div>
        <div class="card-note">Neon va taktik kalkulyatorga urg'u berilgan interfeys</div>
      </div>
      <div class="cover-card">
        <div class="card-num">03</div>
        <div class="card-name">Clean Notion Docs</div>
        <div class="card-note">Maksimal qulaylik, yengil va tezkor o'qish tajribasi</div>
      </div>
      <div class="cover-card">
        <div class="card-num">04</div>
        <div class="card-name">RPG Bento Grid</div>
        <div class="card-note">Modulli slotlar, interaktiv radar va oshpazlik qozoni</div>
      </div>
      <div class="cover-card">
        <div class="card-num">05</div>
        <div class="card-name">Esports Media Portal</div>
        <div class="card-note">Wiki + Hamjamiyat forumi va geymerlar yangiliklari</div>
      </div>
    </div>

    <div class="cover-footer">
      <span>Tayyorlandi: Antigravity AI & info-game.uz jamoasi</span>
      <span>Sana: 2026-yil</span>
      <span>Format: Yuqori Aniqlikdagi PDF (1440x1020)</span>
    </div>
  </div>
</div>
"""

matrix_html = """
<div class="presentation-page matrix-page">
  <div class="matrix-header">
    <div style="font-size: 13px; font-weight: 700; color: #38bdf8; text-transform: uppercase;">XULOSA VA TAVSIYALAR</div>
    <h2 style="font-size: 26px; font-weight: 800; color: #fff;">5 Xil Dizaynning Qiyosiy Tahlili va Texnologik Stack</h2>
  </div>

  <table class="matrix-table">
    <thead>
      <tr>
        <th>Konseptsiya</th>
        <th>Asosiy Afzalligi</th>
        <th>Target Auditoriya</th>
        <th>UI Murakkabligi</th>
        <th>Tavsiya Qilinadigan Dasturlash Stacki</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1. Ocean Survival Dark</strong></td>
        <td>O'yin atmosferasini 100% aks ettiradi, geymerlar uchun juda jozibador</td>
        <td>Raft ishqibozlari, vizual kontent sevuvchilar</td>
        <td>O'rtacha (Glassmorphism, Dark UI)</td>
        <td><strong>Next.js (React) + Tailwind CSS</strong> (SEO juda kuchli, SSR tez ishlaydi)</td>
      </tr>
      <tr>
        <td><strong>2. Cyber HUD</strong></td>
        <td>Interaktiv kalkulyatorlar va tier listlar uchun ajoyib</td>
        <td>Hardcore geymerlar, min-maxerlar, strateglar</td>
        <td>Yuqori (Ko'p animatsiya va kalkulyatorlar)</td>
        <td><strong>React / Vue 3 + Tailwind + Zustand</strong> (Kalkulyatorlar holatini boshqarish)</td>
      </tr>
      <tr>
        <td><strong>3. Clean Minimalist</strong></td>
        <td>Eng tez yuklanadi, matn va jadvallarni o'qish juda oson</td>
        <td>Tezkor ma'lumot qidiruvchilar, mobil foydalanuvchilar</td>
        <td>Past / O'rtacha (Minimalist, toza)</td>
        <td><strong>Astro / Next.js</strong> (Maksimal SEO, Google reytingida 100/100 ball)</td>
      </tr>
      <tr>
        <td><strong>4. RPG Bento Grid</strong></td>
        <td>Interaktiv slotlar, vizual bento-boxlar zamonaviy trendda</td>
        <td>Interaktiv tajriba xohlovchilar</td>
        <td>Yuqori (Responsive bento grid)</td>
        <td><strong>Next.js 15 / Nuxt 3 (Vue)</strong> (Komponentli qulay arxitektura)</td>
      </tr>
      <tr>
        <td><strong>5. Gaming Media Portal</strong></td>
        <td>Faqat wiki emas, balki yangiliklar va forum ham qo'shiladi</td>
        <td>Katta o'zbek o'yin hamjamiyatini qurish niyatidagilar</td>
        <td>Keng ko'lamli (Wiki + Blog + Auth + Forum)</td>
        <td><strong>Next.js + NestJS/Node.js</strong> yoki <strong>Laravel 11 + Vue</strong> (Ma'lumotlar bazasi va foydalanuvchilar boshqaruvi)</td>
      </tr>
    </tbody>
  </table>

  <div class="next-steps-grid">
    <div class="step-card">
      <div class="step-icon">🎯</div>
      <div class="step-title">1. Dizaynni Tanlash</div>
      <div class="step-text">5 ta variantdan o'zingizga ma'qul kelganini yoki ularning kombinatsiyasini (masalan, 1-dizayn fonida 4-dizayn kalkulyatorlari) tanlang.</div>
    </div>
    <div class="step-card">
      <div class="step-icon">⚡</div>
      <div class="step-title">2. Dasturlash Tilini Aniqlash</div>
      <div class="step-text">Next.js (TypeScript) — hozirgi kunda bunday loyihalar uchun dunyo standarti. Qidiruv tizimlarida (SEO) birinchi o'ringa chiqish imkonini beradi.</div>
    </div>
    <div class="step-card">
      <div class="step-icon">🤖</div>
      <div class="step-title">3. Ma'lumotlarni Parser Qilish</div>
      <div class="step-text">Raft Fandom API orqali barcha buyumlar, retseptlar va rasmlarni avtomatik tarzda bazangizga yuklab olishni boshlaymiz.</div>
    </div>
  </div>
</div>
"""

master_css = """
@page { size: 1440px 1020px; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
body { background: #070e18; color: #e2e8f0; width: 1440px; margin: 0; }
.presentation-page { width: 1440px; height: 1020px; page-break-after: always; position: relative; overflow: hidden; }

/* Cover Page */
.cover-page { background: radial-gradient(circle at 80% 20%, rgba(0, 229, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(2, 132, 199, 0.2) 0%, transparent 60%), #070e18; display: flex; align-items: center; justify-content: center; }
.cover-inner { width: 1200px; padding: 40px; text-align: center; }
.cover-badge { display: inline-block; background: rgba(0, 229, 255, 0.12); color: #00e5ff; border: 1px solid rgba(0, 229, 255, 0.3); padding: 8px 18px; border-radius: 30px; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 24px; }
.cover-title { font-size: 64px; font-weight: 900; letter-spacing: -1.5px; color: #fff; margin-bottom: 12px; }
.cover-title span { color: #00e5ff; text-shadow: 0 0 25px rgba(0, 229, 255, 0.5); }
.cover-subtitle { font-size: 22px; color: #94a3b8; font-weight: 600; margin-bottom: 20px; }
.cover-desc { font-size: 15px; color: #cbd5e1; max-width: 800px; margin: 0 auto 40px auto; line-height: 1.6; }

.cover-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 50px; text-align: left; }
.cover-card { background: rgba(14, 25, 44, 0.7); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 12px; padding: 16px; backdrop-filter: blur(10px); }
.card-num { font-size: 18px; font-weight: 900; color: #00e5ff; margin-bottom: 6px; }
.card-name { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.card-note { font-size: 11px; color: #94a3b8; line-height: 1.4; }

.cover-footer { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; font-size: 12px; color: #64748b; }

/* Matrix Page */
.matrix-page { background: #0a0f18; padding: 40px 50px; display: flex; flex-direction: column; justify-content: space-between; }
.matrix-header { margin-bottom: 20px; }
.matrix-table { width: 100%; border-collapse: collapse; font-size: 12px; background: rgba(14, 25, 44, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden; margin-bottom: 24px; }
.matrix-table th { background: #0f1c30; padding: 12px 14px; text-align: left; color: #38bdf8; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.1); text-transform: uppercase; font-size: 11px; }
.matrix-table td { padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #cbd5e1; vertical-align: middle; line-height: 1.4; }
.matrix-table tr:hover { background: rgba(0, 229, 255, 0.04); }

.next-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.step-card { background: rgba(14, 25, 44, 0.6); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 12px; padding: 18px; }
.step-icon { font-size: 24px; margin-bottom: 8px; }
.step-title { font-size: 14px; font-weight: 700; color: #00e5ff; margin-bottom: 6px; }
.step-text { font-size: 12px; color: #94a3b8; line-height: 1.5; }
"""

# Assemble full presentation HTML
full_presentation = f"""<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<title>INFO-GAME.UZ - 5 Xil Dizayn Taqdimoti</title>
<style>
{master_css}
{extract_style("dizayn-1-ocean-dark.html")}
{extract_style("dizayn-2-cyber-hud.html")}
{extract_style("dizayn-3-notion-clean.html")}
{extract_style("dizayn-4-rpg-bento.html")}
{extract_style("dizayn-5-gaming-portal.html")}
</style>
</head>
<body>
  {cover_html}
  <div class="presentation-page">{extract_body("dizayn-1-ocean-dark.html")}</div>
  <div class="presentation-page">{extract_body("dizayn-2-cyber-hud.html")}</div>
  <div class="presentation-page">{extract_body("dizayn-3-notion-clean.html")}</div>
  <div class="presentation-page">{extract_body("dizayn-4-rpg-bento.html")}</div>
  <div class="presentation-page">{extract_body("dizayn-5-gaming-portal.html")}</div>
  {matrix_html}
</body>
</html>
"""

with open(master_html_path, "w", encoding="utf-8") as f:
    f.write(full_presentation)
print("Master presentation HTML written.")

# Compile master presentation to PDF
file_url = 'file:///' + master_html_path.replace('\\', '/')
cmd = [
    CHROME_PATH,
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--no-pdf-header-footer',
    f'--print-to-pdf={master_pdf_path}',
    file_url
]
res = subprocess.run(cmd, capture_output=True, text=True)
print("Master PDF Exists:", os.path.exists(master_pdf_path), "Size:", os.path.getsize(master_pdf_path) if os.path.exists(master_pdf_path) else 0)
