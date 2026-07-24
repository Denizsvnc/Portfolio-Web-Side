const fs = require('fs');
const path = require('path');

const locales = ['tr', 'en', 'de', 'ru'];

const baseTranslations = {
  tr: {
    dashboard: {
      title: "İstatistik Özeti",
      totalViews: "Toplam Görüntülenme",
      uniqueVisitors: "Tekil Ziyaretçi",
      blogsRead: "Okunan Blog",
      shares: "Toplam Paylaşım",
      pagesTitle: "Sayfa Ziyaretleri",
      citiesTitle: "Ziyaretçi Lokasyonları (Şehir)",
      logsTitle: "Son Ziyaretçi Logları",
      sharesByContent: "İçerik Bazlı Paylaşımlar",
      detailedShares: "Detaylı Paylaşım Logları",
      platform: "Platform",
      count: "Adet",
      content: "İçerik",
      country: "Ülke",
      city: "Şehir",
      date: "Tarih",
      path: "Sayfa",
      noData: "Veri bulunamadı"
    },
    about: {
      title: "Hakkımda Yönetimi",
      save: "Kaydet",
      saving: "Kaydediliyor...",
      success: "Başarıyla kaydedildi!",
      error: "Hata oluştu",
      fullname: "Ad Soyad",
      role: "Rol / Meslek",
      summary: "Kısa Özet",
      email: "E-posta",
      location: "Lokasyon",
      github: "GitHub URL",
      linkedin: "LinkedIn URL",
      twitter: "Twitter URL"
    },
    projects: {
      title: "Projeler",
      newProject: "Yeni Proje Ekle",
      edit: "Düzenle",
      delete: "Sil",
      cancel: "İptal",
      save: "Kaydet",
      titleLabel: "Proje Başlığı",
      isActive: "Aktif mi?",
      signature: "İmza Projesi mi?",
      techStack: "Teknolojiler",
      demoUrl: "Demo URL",
      githubUrl: "GitHub URL"
    },
    skills: {
      title: "Yetenek Yönetimi",
      newSkill: "Yeni Yetenek",
      save: "Kaydet"
    },
    blogs: {
      title: "Blog Yazıları",
      newBlog: "Yeni Blog Ekle",
      save: "Kaydet",
      edit: "Düzenle"
    },
    images: {
      title: "Medya ve Görseller",
      upload: "Görsel Yükle",
      copyLink: "Bağlantıyı Kopyala"
    },
    contact: {
      title: "İletişim Mesajları",
      settings: "E-posta Ayarları",
      reply: "Yanıtla",
      send: "Gönder"
    },
    ai: {
      title: "AI Otomasyon & Ayarlar",
      persona: "AI Karakteri",
      calendar: "İçerik Takvimi",
      generate: "Blog Üret"
    }
  }
};

// ... English, German, Russian translations can be generated via a small node prompt or just standard object copies for now.
// For the sake of automation, I will inject basic English.
baseTranslations.en = {
  dashboard: {
    title: "Dashboard Overview",
    totalViews: "Total Views",
    uniqueVisitors: "Unique Visitors",
    blogsRead: "Blogs Read",
    shares: "Total Shares",
    pagesTitle: "Page Visits",
    citiesTitle: "Visitor Locations",
    logsTitle: "Recent Visitor Logs",
    sharesByContent: "Shares by Content",
    detailedShares: "Detailed Share Logs",
    platform: "Platform",
    count: "Count",
    content: "Content",
    country: "Country",
    city: "City",
    date: "Date",
    path: "Path",
    noData: "No data found"
  },
  about: { title: "About Me Management", save: "Save", saving: "Saving...", success: "Saved successfully!", error: "Error occurred", fullname: "Full Name", role: "Role", summary: "Summary", email: "Email", location: "Location", github: "GitHub URL", linkedin: "LinkedIn URL", twitter: "Twitter URL" },
  projects: { title: "Projects", newProject: "Add New Project", edit: "Edit", delete: "Delete", cancel: "Cancel", save: "Save", titleLabel: "Project Title", isActive: "Is Active?", signature: "Signature Project?", techStack: "Tech Stack", demoUrl: "Demo URL", githubUrl: "GitHub URL" },
  skills: { title: "Skills Management", newSkill: "New Skill", save: "Save" },
  blogs: { title: "Blogs", newBlog: "Add New Blog", save: "Save", edit: "Edit" },
  images: { title: "Media & Images", upload: "Upload Image", copyLink: "Copy Link" },
  contact: { title: "Contact Messages", settings: "Email Settings", reply: "Reply", send: "Send" },
  ai: { title: "AI Automation", persona: "AI Persona", calendar: "Content Calendar", generate: "Generate Blog" }
};

baseTranslations.de = {
  dashboard: { title: "Dashboard-Übersicht", totalViews: "Gesamtaufrufe", uniqueVisitors: "Eindeutige Besucher", blogsRead: "Gelesene Blogs", shares: "Gesamt geteilt", pagesTitle: "Seitenaufrufe", citiesTitle: "Besucherstandorte", logsTitle: "Letzte Besucherprotokolle", sharesByContent: "Nach Inhalt geteilt", detailedShares: "Detaillierte Teilen-Protokolle", platform: "Plattform", count: "Anzahl", content: "Inhalt", country: "Land", city: "Stadt", date: "Datum", path: "Pfad", noData: "Keine Daten gefunden" },
  about: { title: "Über mich Verwaltung", save: "Speichern", saving: "Speichern...", success: "Erfolgreich gespeichert!", error: "Fehler aufgetreten", fullname: "Vollständiger Name", role: "Rolle", summary: "Zusammenfassung", email: "E-Mail", location: "Standort", github: "GitHub URL", linkedin: "LinkedIn URL", twitter: "Twitter URL" },
  projects: { title: "Projekte", newProject: "Neues Projekt", edit: "Bearbeiten", delete: "Löschen", cancel: "Abbrechen", save: "Speichern", titleLabel: "Projekttitel", isActive: "Ist aktiv?", signature: "Signaturprojekt?", techStack: "Technologien", demoUrl: "Demo URL", githubUrl: "GitHub URL" },
  skills: { title: "Fähigkeiten-Verwaltung", newSkill: "Neue Fähigkeit", save: "Speichern" },
  blogs: { title: "Blogs", newBlog: "Neuer Blog", save: "Speichern", edit: "Bearbeiten" },
  images: { title: "Medien & Bilder", upload: "Bild hochladen", copyLink: "Link kopieren" },
  contact: { title: "Kontaktnachrichten", settings: "E-Mail-Einstellungen", reply: "Antworten", send: "Senden" },
  ai: { title: "KI-Automatisierung", persona: "KI-Persona", calendar: "Inhaltskalender", generate: "Blog generieren" }
};

baseTranslations.ru = {
  dashboard: { title: "Обзор панели", totalViews: "Всего просмотров", uniqueVisitors: "Уникальные посетители", blogsRead: "Прочитанные блоги", shares: "Всего репостов", pagesTitle: "Посещения страниц", citiesTitle: "География посетителей", logsTitle: "Последние логи", sharesByContent: "Репосты по контенту", detailedShares: "Детальные логи репостов", platform: "Платформа", count: "Количество", content: "Контент", country: "Страна", city: "Город", date: "Дата", path: "Путь", noData: "Данные не найдены" },
  about: { title: "Обо мне", save: "Сохранить", saving: "Сохранение...", success: "Успешно сохранено!", error: "Произошла ошибка", fullname: "Полное имя", role: "Роль", summary: "Резюме", email: "Email", location: "Локация", github: "GitHub URL", linkedin: "LinkedIn URL", twitter: "Twitter URL" },
  projects: { title: "Проекты", newProject: "Новый проект", edit: "Редактировать", delete: "Удалить", cancel: "Отмена", save: "Сохранить", titleLabel: "Название проекта", isActive: "Активен?", signature: "Подпись проекта?", techStack: "Стек технологий", demoUrl: "Demo URL", githubUrl: "GitHub URL" },
  skills: { title: "Навыки", newSkill: "Новый навык", save: "Сохранить" },
  blogs: { title: "Блоги", newBlog: "Новый блог", save: "Сохранить", edit: "Редактировать" },
  images: { title: "Медиа и изображения", upload: "Загрузить", copyLink: "Копировать ссылку" },
  contact: { title: "Сообщения", settings: "Настройки Email", reply: "Ответить", send: "Отправить" },
  ai: { title: "Автоматизация ИИ", persona: "Персона ИИ", calendar: "Календарь контента", generate: "Генерировать блог" }
};

locales.forEach(lang => {
  const filePath = path.join(__dirname, 'messages', `${lang}.json`);
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.Admin) data.Admin = {};
  
  // Merge new translations
  data.Admin = { ...data.Admin, ...baseTranslations[lang] };
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${lang}.json`);
});
