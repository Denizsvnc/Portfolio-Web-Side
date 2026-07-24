const fs = require('fs');

const adminTranslations = {
  tr: {
    sidebar: {
      dashboard: "İstatistik Özeti",
      about: "Hakkımda",
      skills: "Yetenekler",
      projects: "Projeler",
      blogs: "Blog Yazıları",
      images: "Medya / Görseller",
      contact: "İletişim Mesajları",
      ai: "AI Otomasyon",
      logout: "Çıkış Yap",
      switchLanguage: "Dili Değiştir"
    }
  },
  en: {
    sidebar: {
      dashboard: "Dashboard",
      about: "About Me",
      skills: "Skills",
      projects: "Projects",
      blogs: "Blogs",
      images: "Media / Images",
      contact: "Contact Messages",
      ai: "AI Automation",
      logout: "Logout",
      switchLanguage: "Switch Language"
    }
  },
  de: {
    sidebar: {
      dashboard: "Dashboard",
      about: "Über mich",
      skills: "Fähigkeiten",
      projects: "Projekte",
      blogs: "Blogs",
      images: "Medien / Bilder",
      contact: "Kontaktnachrichten",
      ai: "KI-Automatisierung",
      logout: "Abmelden",
      switchLanguage: "Sprache wechseln"
    }
  },
  ru: {
    sidebar: {
      dashboard: "Панель управления",
      about: "Обо мне",
      skills: "Навыки",
      projects: "Проекты",
      blogs: "Блоги",
      images: "Медиа / Изображения",
      contact: "Сообщения",
      ai: "Автоматизация ИИ",
      logout: "Выйти",
      switchLanguage: "Сменить язык"
    }
  }
};

const langs = ['tr', 'en', 'de', 'ru'];

langs.forEach(lang => {
  const filePath = `c:/Users/DELL/Desktop/Deniz Sevinç/Projects/denizsevinc.com.tr/frontend/messages/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.Admin = adminTranslations[lang];
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${lang}.json`);
});
