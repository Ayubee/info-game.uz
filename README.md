# 🎮 Info-Game.uz — Zamonaviy Geyming va Kiber-Sport Yangiliklari Portali

<p align="center">
  <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80" alt="Info-Game.uz Banner" width="100%" style="border-radius: 12px;" />
</p>

<p align="center">
  <strong>O'zbekistondagi eng so'nggi video o'yinlar, relizlar, treylerlar va kiber-sport olamidagi yangiliklarni yorituvchi zamonaviy veb-portal.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-ffca28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</p>

---

## 📌 Loyiha Haqida

**Info-Game.uz** — geymerlar va o'yin ixlosmandlari uchun maxsus yaratilgan tezkor, qulay va interaktiv axborot platformasi. Sayt eng so'nggi jahon o'yin yangiliklari, kutilayotgan yirik relizlar (GTA 6, STALKER 2, Witcher 4 va h.k.), rasmiy treylerlar va eksklyuziv maqolalarni bir joyda jamlaydi.

Loyiha to'liq **Reaktiv Web Arxitektura** asosida qurilgan bo'lib, har qanday qurilmada (smartfon, planshet, noutbuk) yuqori tezlik va geymerona qora/neon (Cyberpunk Dark) dizaynga ega.

---

## ✨ Asosiy Imkoniyatlar va Funksiyalar

### 1. 🌐 Ko'p Tilli Tizim (Multilingual Support)
- Sayt 3 ta tilda to'liq ishlaydi: **O'zbekcha (UZ)**, **Ruscha (RU)** va **Inglizcha (EN)**.
- Til o'zgartirilganda nafaqat sarlavha va matnlar, balki barcha navigatsiya elementlari, qidiruv paneli, teglari va admin bildirishnomalari bir zumda moslashadi.
- Tanlangan til foydalanuvchi brauzerida (`localStorage`) saqlanib qoladi.

### 2. 📰 O'yin Yangiliklari va Tahliliy Maqolalar
- **Kategoriyalar va Filtrlar**: Yangiliklar, Relizlar, Eksklyuziv, Kiber-sport, O'yin sharhlari va Patch-notelar.
- **Tezkor Qidiruv**: Sarlavha, muallif, o'yin nomi yoki kalit so'z bo'yicha real-vaqtda qidiruv.
- **Batafsil Sahifa**: Har bir yangilik alohida chiroyli sahifaga ega bo'lib, o'qish vaqti, nashr sanasi, muallif, manba havolasi va to'liq formatlangan matnni ko'rsatadi.

### 3. 🎬 YouTube Treylerlar va Video Pleer
- YouTube platformasidagi har qanday havolani (oddiy `youtube.com/watch?v=...`, qisqa `youtu.be/...`, yoki `youtube.com/shorts/...`) avtomatik taniydi va xavfsiz `embed` ko'rinishiga o'tkazadi.
- Sayt ichida to'g'ridan-to'g'ri 1080p sifatda treylerlarni bloklanmasdan tomosha qilish imkoniyati.

### 4. 🗄️ Google Firebase (Firestore) Real-time Baza
- **Bulutli Sinxronizatsiya**: Yangi qo'shilgan yoki tahrirlangan yangiliklar bir zumda Google Firebase bepul bulutli bazasida saqlanadi va butun dunyodagi foydalanuvchilarga darhol ko'rinadi.
- **Offline / Local Fallback**: Agar Firebase ulanmagan bo'lsa, sayt avtomatik ravishda lokal rejimda to'xtovsiz ishlayveradi.

### 5. 🔐 Qulay Admin CMS Paneli (`/admin`)
- **Yangilik Qo'shish & Chop Etish**: Ko'p tilli sarlavha, qisqacha ta'rif va to'liq matn kiritish tizimi.
- **Kompyuterdan Rasm Yuklash**: Foydalanuvchi o'z kompyuteridagi istalgan rasmni yuklay oladi. Tizim avtomatik ravishda rasmni Canvas orqali optimallashtiradi (maksimal 1200x800px, Web-JPEG formatiga siqadi).
- **Tahrirlash va O'chirish**: Mavjud postlarni istalgan payt o'zgartirish yoki bir tugma bilan o'chirish.
- **Baza Sozlamalari**: Firebase kalitlarini to'g'ridan-to'g'ri admin panel orqali kiritish va bazani faollashtirish.

---

## 🛠️ Texnologiyalar Steki

| Qism | Texnologiya | Tavsif |
| :--- | :--- | :--- |
| **Frontend Kutubxona** | React 18.3 | Komponentlarga asoslangan zamonaviy UI |
| **Dasturlash Tili** | TypeScript 5.6 | Qat'iy tiplar xavfsizligi va xatosiz kod |
| **Yig'uvchi (Bundler)** | Vite 6.0 | Ultra-tezkor Hot Module Replacement (HMR) va build |
| **Stillash (Styling)** | Tailwind CSS 3.4 | Zamonaviy Cyberpunk/Dark UI dizayn tizimi |
| **Ikonkalar** | Lucide React | Yengil va chiroyli SVG vektor ikonkalari |
| **Router** | React Router DOM v6 | SPA sahifalararo uzluksiz navigatsiya |
| **Ma'lumotlar Bazasi** | Google Firebase Firestore | NoSQL real-time bulutli ma'lumotlar bazasi |

---

## 📁 Loyiha Katalogi Tuzilishi

```text
info-game.uz/
├── public/                 # Statik resurslar va faviconlar
├── src/
│   ├── components/         # Qayta ishlatiluvchi UI komponentlar
│   │   ├── Footer.tsx      # Sayt podvali va havola bloklari
│   │   └── Navbar.tsx      # Tepa menyu, qidiruv, til tanlash va mobil panel
│   ├── context/            # Global holat boshqaruvi
│   │   └── AppContext.tsx  # Yangiliklar holati, tillar (i18n), Firebase Firestore sinxronizatsiyasi
│   ├── data/               # Boshlang'ich test va namuna ma'lumotlari
│   │   └── mockData.ts     # Dastlabki yangiliklar va o'yinlar ro'yxati
│   ├── pages/              # Asosiy sahifalar
│   │   ├── AdminPage.tsx   # Admin boshqaruv paneli (CMS va Baza)
│   │   ├── HomePage.tsx    # Bosh sahifa (Hero, dolzarb yangiliklar, treylerlar)
│   │   ├── NewsDetailPage.tsx # Yangilikning batafsil to'liq o'qish sahifasi
│   │   └── NewsListPage.tsx   # Barcha yangiliklar katalogi, qidiruv va filtrlar
│   ├── utils/              # Yordamchi modullar
│   │   └── video.ts        # YouTube havolalarini xavfsiz formatlash (Watch/Shorts/Embed)
│   ├── types.ts            # Ma'lumot turlari (TypeScript interfaces)
│   ├── App.tsx             # Asosiy marshrutlash (Routes)
│   ├── main.tsx            # React ilova kirish nuqtasi
│   └── index.css           # Tailwind CSS direktivalari va maxsus animatsiyalar
├── index.html              # HTML shablon
├── package.json            # Loyiha qaramliklari va skriptlar
├── tailwind.config.js      # Tailwind konfiguratsiyasi
├── tsconfig.json           # TypeScript sozlamalari
└── vite.config.ts          # Vite konfiguratsiyasi
```

---

## 🚀 O'rnatish va Ishga Tushirish

### Talablar:
- **Node.js** (v18.0 yoki undan yuqori)
- **npm** yoki **pnpm** / **yarn**

### 1. Repozitoriyni klonlash:
```bash
git clone https://github.com/Ayubee/info-game.uz.git
cd info-game.uz
```

### 2. Qaramliklarni o'rnatish:
```bash
npm install
```

### 3. Dasturchi rejimida ishga tushirish (Local Dev Server):
```bash
npm run dev
```
Sayt lokal ravishda `http://localhost:5173` manzilida ochiladi.

### 4. Ishlab chiqarish (Production) uchun yig'ish:
```bash
npm run build
```
Yig'ilgan optimallashtirilgan fayllar `dist/` katalogida hosil bo'ladi.

---

## 🔥 Google Firebase (Firestore) Bazani Ulash Qo'llanmasi

Sayt orqali kiritilgan yangiliklar butun dunyoga ko'rinishi uchun bepul Google Firebase bazasiga ulanishi mumkin:

1. [console.firebase.google.com](https://console.firebase.google.com) saytiga kiring va Google akkountingiz orqali tizimga kiring.
2. **"Create a project"** tugmasini bosing (loyiha nomi ixtiyoriy, masalan: `info-game-uz`).
3. Chap menyudan **"Build"** -> **"Firestore Database"** bo'limiga o'ting va **"Create Database"** ni bosing (boshlanishiga *"Start in test mode"* tanlanadi).
4. Loyiha sozlamalarida (Project Settings ⚙️) Web ilova qo'shing (`</>` belgisini bosing).
5. Chiqqan `firebaseConfig` obyektini nusxalang:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "info-game-uz.firebaseapp.com",
     projectId: "info-game-uz",
     storageBucket: "info-game-uz.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
6. Saytning **`/admin`** bo'limiga kiring, **"Google Firebase & Baza"** yorlig'iga o'tib, nusxalangan konfiguratsiyani tashlang va **"Bazani Saytga Ulash"** tugmasini bosing.
7. Sayt bir necha soniyada avtomatik tarzda Google Firestore bulutli bazasiga ulanadi!

---

## 🔒 Xavfsizlik va Ma'lumotlarni Himoyalash
- Barcha kiritilgan video havolalar XSS xurujlariga qarshi tekshiriladi va faqat xavfsiz iframe orqali yuklanadi.
- Rasm yuklashda faqat haqiqiy media-fayllar qabul qilinadi va Canvas orqali qayta ishlanadi.
- Admin panel faqat tasdiqlangan boshqaruvchilarga qaratilgan.

---

## 📄 Litsenziya

Ushbu loyiha ochiq kodli bo'lib, **MIT Litsenziyasi** ostida tarqatiladi.

---

<p align="center">
  Yaratuvchi: <strong>Info-Game.uz Jamoasi</strong> &bull; 2026-yil
</p>
