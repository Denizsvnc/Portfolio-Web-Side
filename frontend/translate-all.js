const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src/app/[locale]/admin');
const jsonDir = path.join(__dirname, 'messages');

const tasks = [
  {
    file: 'projects/page.tsx',
    namespace: 'Admin.projects',
    replaces: [
      { from: /PROJELER YÖNETİMİ/g, to: "{t('title')}" },
      { from: /Öne çıkan projeleriniz, teknoloji detayları ve linkler/g, to: "{t('subtitle')}" },
      { from: /Yeni Proje Ekle/g, to: "{t('newProject')}" },
      { from: /Henüz proje eklenmemiş./g, to: "{t('noProjects')}" },
      { from: /Pasif/g, to: "{t('inactive')}" },
      { from: /İmza/g, to: "{t('signature')}" },
      { from: /Projeyi Görüntüle/g, to: "{t('viewProject')}" },
      { from: /'Bu projeyi silmek istediğinize emin misiniz\?'/g, to: "t('confirmDelete')" },
      { from: /'Silinirken hata oluştu.'/g, to: "t('deleteError')" },
      { from: /Yükleniyor.../g, to: "{t('loading')}" }
    ],
    dict: {
      tr: { title: "PROJELER YÖNETİMİ", subtitle: "Öne çıkan projeleriniz, teknoloji detayları ve linkler", newProject: "Yeni Proje Ekle", noProjects: "Henüz proje eklenmemiş.", inactive: "Pasif", signature: "İmza", viewProject: "Projeyi Görüntüle", confirmDelete: "Bu projeyi silmek istediğinize emin misiniz?", deleteError: "Silinirken hata oluştu.", loading: "Yükleniyor..." },
      en: { title: "PROJECTS MANAGEMENT", subtitle: "Your featured projects, tech details and links", newProject: "Add New Project", noProjects: "No projects added yet.", inactive: "Inactive", signature: "Signature", viewProject: "View Project", confirmDelete: "Are you sure you want to delete this project?", deleteError: "Error occurred while deleting.", loading: "Loading..." },
      de: { title: "PROJEKTE-VERWALTUNG", subtitle: "Ihre vorgestellten Projekte, Tech-Details und Links", newProject: "Neues Projekt hinzufügen", noProjects: "Noch keine Projekte hinzugefügt.", inactive: "Inaktiv", signature: "Signatur", viewProject: "Projekt ansehen", confirmDelete: "Sind Sie sicher, dass Sie dieses Projekt löschen möchten?", deleteError: "Fehler beim Löschen aufgetreten.", loading: "Wird geladen..." },
      ru: { title: "УПРАВЛЕНИЕ ПРОЕКТАМИ", subtitle: "Ваши лучшие проекты, технические детали и ссылки", newProject: "Добавить проект", noProjects: "Проекты пока не добавлены.", inactive: "Неактивен", signature: "Подпись", viewProject: "Посмотреть проект", confirmDelete: "Вы уверены, что хотите удалить этот проект?", deleteError: "Ошибка при удалении.", loading: "Загрузка..." }
    }
  },
  {
    file: 'projects/new/page.tsx',
    namespace: 'Admin.projectsNew',
    replaces: [
      { from: /YENİ PROJE EKLE/g, to: "{t('title')}" },
      { from: /Yeni projenizi tüm detayları ve 4 dilli yapısıyla oluşturun./g, to: "{t('subtitle')}" },
      { from: /Temel Bilgiler/g, to: "{t('basicInfo')}" },
      { from: /Proje İkonu \(örn: code, layout, vb\.\)/g, to: "{t('icon')}" },
      { from: /Gösterim Sırası/g, to: "{t('queue')}" },
      { from: /Proje Aktif Mi\?/g, to: "{t('isActive')}" },
      { from: /İmza Projesi Mi\? \(Öne Çıkan\)/g, to: "{t('isSignature')}" },
      { from: /Teknolojiler \(Virgülle ayırın\)/g, to: "{t('techStack')}" },
      { from: /Canlı Demo URL/g, to: "{t('demoUrl')}" },
      { from: /Proje Detayı İçin Buton Linki/g, to: "{t('buttonUrl')}" },
      { from: /İçerik Dili/g, to: "{t('contentLanguage')}" },
      { from: /Proje Başlığı/g, to: "{t('projectTitle')}" },
      { from: /Neler Yaptım\? \(Paragraf eklemek için enter'a basın\)/g, to: "{t('elements')}" },
      { from: /Teknolojik İnovasyon \/ Kullanılan Altyapı/g, to: "{t('innovation')}" },
      { from: /Yeni Paragraf Ayracı Ekle/g, to: "{t('addParagraph')}" },
      { from: /Dış Bağlantılar/g, to: "{t('externalLinks')}" },
      { from: /Bağlantı Başlığı/g, to: "{t('linkTitle')}" },
      { from: /URL/g, to: "{t('linkUrl')}" },
      { from: /Ekle/g, to: "{t('add')}" },
      { from: /Dokümanlar & Dosyalar/g, to: "{t('documents')}" },
      { from: /Belge veya dosyaları buraya sürükleyin veya seçin/g, to: "{t('dragFiles')}" },
      { from: /Maksimum 5MB \(PDF, DOC, TXT, IMG\)/g, to: "{t('maxFileSize')}" },
      { from: /Kaydet ve Yayınla/g, to: "{t('saveAndPublish')}" },
      { from: /Kaydediliyor.../g, to: "{t('saving')}" }
    ],
    dict: {
      tr: { title: "YENİ PROJE EKLE", subtitle: "Yeni projenizi tüm detayları ve 4 dilli yapısıyla oluşturun.", basicInfo: "Temel Bilgiler", icon: "Proje İkonu (örn: code, layout, vb.)", queue: "Gösterim Sırası", isActive: "Proje Aktif Mi?", isSignature: "İmza Projesi Mi? (Öne Çıkan)", techStack: "Teknolojiler (Virgülle ayırın)", demoUrl: "Canlı Demo URL", buttonUrl: "Proje Detayı İçin Buton Linki", contentLanguage: "İçerik Dili", projectTitle: "Proje Başlığı", elements: "Neler Yaptım? (Paragraf eklemek için enter'a basın)", innovation: "Teknolojik İnovasyon / Kullanılan Altyapı", addParagraph: "Yeni Paragraf Ayracı Ekle", externalLinks: "Dış Bağlantılar", linkTitle: "Bağlantı Başlığı", linkUrl: "URL", add: "Ekle", documents: "Dokümanlar & Dosyalar", dragFiles: "Belge veya dosyaları buraya sürükleyin veya seçin", maxFileSize: "Maksimum 5MB (PDF, DOC, TXT, IMG)", saveAndPublish: "Kaydet ve Yayınla", saving: "Kaydediliyor..." },
      en: { title: "ADD NEW PROJECT", subtitle: "Create your new project with all details and 4-language support.", basicInfo: "Basic Info", icon: "Project Icon (e.g., code, layout, etc.)", queue: "Display Order", isActive: "Is Project Active?", isSignature: "Is Signature Project? (Featured)", techStack: "Technologies (Comma separated)", demoUrl: "Live Demo URL", buttonUrl: "Button Link for Project Details", contentLanguage: "Content Language", projectTitle: "Project Title", elements: "What did I do? (Press enter to add paragraph)", innovation: "Technical Innovation / Infrastructure Used", addParagraph: "Add New Paragraph Separator", externalLinks: "External Links", linkTitle: "Link Title", linkUrl: "URL", add: "Add", documents: "Documents & Files", dragFiles: "Drag or select documents or files here", maxFileSize: "Max 5MB (PDF, DOC, TXT, IMG)", saveAndPublish: "Save and Publish", saving: "Saving..." },
      de: { title: "NEUES PROJEKT HINZUFÜGEN", subtitle: "Erstellen Sie Ihr neues Projekt mit allen Details und 4-sprachiger Unterstützung.", basicInfo: "Basisinformationen", icon: "Projekt-Icon (z.B. code, layout, etc.)", queue: "Anzeigereihenfolge", isActive: "Ist Projekt aktiv?", isSignature: "Ist Signaturprojekt? (Hervorgehoben)", techStack: "Technologien (Kommagetrennt)", demoUrl: "Live-Demo URL", buttonUrl: "Button-Link für Projektdetails", contentLanguage: "Inhaltssprache", projectTitle: "Projekttitel", elements: "Was habe ich gemacht? (Eingabetaste für Absatz)", innovation: "Technische Innovation / Verwendete Infrastruktur", addParagraph: "Neuen Absatztrenner hinzufügen", externalLinks: "Externe Links", linkTitle: "Link-Titel", linkUrl: "URL", add: "Hinzufügen", documents: "Dokumente & Dateien", dragFiles: "Dokumente oder Dateien hierher ziehen oder auswählen", maxFileSize: "Max 5MB (PDF, DOC, TXT, IMG)", saveAndPublish: "Speichern und veröffentlichen", saving: "Wird gespeichert..." },
      ru: { title: "ДОБАВИТЬ НОВЫЙ ПРОЕКТ", subtitle: "Создайте свой новый проект со всеми деталями и поддержкой 4 языков.", basicInfo: "Основная информация", icon: "Иконка проекта (напр. code, layout)", queue: "Порядок отображения", isActive: "Проект активен?", isSignature: "Подпись проекта? (Выделенный)", techStack: "Технологии (через запятую)", demoUrl: "Live Demo URL", buttonUrl: "Ссылка на кнопку для деталей проекта", contentLanguage: "Язык контента", projectTitle: "Название проекта", elements: "Что я сделал? (Нажмите Enter для абзаца)", innovation: "Технические инновации / Инфраструктура", addParagraph: "Добавить разделитель абзацев", externalLinks: "Внешние ссылки", linkTitle: "Название ссылки", linkUrl: "URL", add: "Добавить", documents: "Документы и файлы", dragFiles: "Перетащите или выберите документы и файлы здесь", maxFileSize: "Макс 5MB (PDF, DOC, TXT, IMG)", saveAndPublish: "Сохранить и опубликовать", saving: "Сохранение..." }
    }
  },
  {
    file: 'blogs/page.tsx',
    namespace: 'Admin.blogs',
    replaces: [
      { from: /BLOG YAZILARI YÖNETİMİ/g, to: "{t('title')}" },
      { from: /Tüm blog yazılarınız, trafik durumları ve çok dilli içerik/g, to: "{t('subtitle')}" },
      { from: /Yeni Yazı Ekle/g, to: "{t('newBlog')}" },
      { from: /Henüz blog yazısı eklenmemiş./g, to: "{t('noBlogs')}" },
      { from: /Yayında/g, to: "{t('published')}" },
      { from: /Taslak/g, to: "{t('draft')}" },
      { from: /Blogu Görüntüle/g, to: "{t('viewBlog')}" },
      { from: /'Bu yazıyı silmek istediğinize emin misiniz\?'/g, to: "t('confirmDelete')" },
      { from: /'Silinirken hata oluştu.'/g, to: "t('deleteError')" }
    ],
    dict: {
      tr: { title: "BLOG YAZILARI YÖNETİMİ", subtitle: "Tüm blog yazılarınız, trafik durumları ve çok dilli içerik", newBlog: "Yeni Yazı Ekle", noBlogs: "Henüz blog yazısı eklenmemiş.", published: "Yayında", draft: "Taslak", viewBlog: "Blogu Görüntüle", confirmDelete: "Bu yazıyı silmek istediğinize emin misiniz?", deleteError: "Silinirken hata oluştu." },
      en: { title: "BLOG POSTS MANAGEMENT", subtitle: "All your blog posts, traffic stats and multilingual content", newBlog: "Add New Post", noBlogs: "No blog posts added yet.", published: "Published", draft: "Draft", viewBlog: "View Blog", confirmDelete: "Are you sure you want to delete this post?", deleteError: "Error occurred while deleting." },
      de: { title: "BLOG-BEITRÄGE VERWALTUNG", subtitle: "Alle Ihre Blog-Beiträge, Verkehrsstatistiken und mehrsprachige Inhalte", newBlog: "Neuen Beitrag hinzufügen", noBlogs: "Noch keine Blog-Beiträge hinzugefügt.", published: "Veröffentlicht", draft: "Entwurf", viewBlog: "Blog ansehen", confirmDelete: "Sind Sie sicher, dass Sie diesen Beitrag löschen möchten?", deleteError: "Fehler beim Löschen aufgetreten." },
      ru: { title: "УПРАВЛЕНИЕ БЛОГАМИ", subtitle: "Все ваши блоги, статистика трафика и многоязычный контент", newBlog: "Добавить новый пост", noBlogs: "Посты пока не добавлены.", published: "Опубликовано", draft: "Черновик", viewBlog: "Посмотреть блог", confirmDelete: "Вы уверены, что хотите удалить этот пост?", deleteError: "Ошибка при удалении." }
    }
  },
  {
    file: 'contact/page.tsx',
    namespace: 'Admin.contact',
    replaces: [
      { from: /İLETİŞİM MESAJLARI/g, to: "{t('title')}" },
      { from: /Gelen mesajları görüntüleyin ve yanıtlayın/g, to: "{t('subtitle')}" },
      { from: /Henüz mesaj bulunmuyor./g, to: "{t('noMessages')}" },
      { from: /'Bu mesajı silmek istediğinize emin misiniz\?'/g, to: "t('confirmDelete')" },
      { from: /SMTP ve Otomatik Yönlendirme Ayarları/g, to: "{t('settings')}" },
      { from: /Okunmadı/g, to: "{t('unread')}" },
      { from: /Yanıtlandı/g, to: "{t('replied')}" },
      { from: /Geri Dön/g, to: "{t('goBack')}" }
    ],
    dict: {
      tr: { title: "İLETİŞİM MESAJLARI", subtitle: "Gelen mesajları görüntüleyin ve yanıtlayın", noMessages: "Henüz mesaj bulunmuyor.", confirmDelete: "Bu mesajı silmek istediğinize emin misiniz?", settings: "SMTP ve Otomatik Yönlendirme Ayarları", unread: "Okunmadı", replied: "Yanıtlandı", goBack: "Geri Dön" },
      en: { title: "CONTACT MESSAGES", subtitle: "View and reply to incoming messages", noMessages: "No messages yet.", confirmDelete: "Are you sure you want to delete this message?", settings: "SMTP and Auto-Forward Settings", unread: "Unread", replied: "Replied", goBack: "Go Back" },
      de: { title: "KONTAKTNACHRICHTEN", subtitle: "Eingehende Nachrichten anzeigen und beantworten", noMessages: "Noch keine Nachrichten.", confirmDelete: "Sind Sie sicher, dass Sie diese Nachricht löschen möchten?", settings: "SMTP- und Auto-Weiterleitungs-Einstellungen", unread: "Ungelesen", replied: "Beantwortet", goBack: "Zurück" },
      ru: { title: "СООБЩЕНИЯ", subtitle: "Просмотр и ответ на входящие сообщения", noMessages: "Сообщений пока нет.", confirmDelete: "Вы уверены, что хотите удалить это сообщение?", settings: "Настройки SMTP и автопересылки", unread: "Не прочитано", replied: "Отвечено", goBack: "Назад" }
    }
  },
  {
    file: 'ai-settings/page.tsx',
    namespace: 'Admin.aiSettings',
    replaces: [
      { from: /YAPAY ZEKA OTONOMİSİ VE KARAKTER/g, to: "{t('title')}" },
      { from: /Blog yazarlığınızı üstlenecek yapay zekanın karakterini ve planlarını belirleyin./g, to: "{t('subtitle')}" },
      { from: /'Karakter (Persona)'/g, to: "t('tabPersona')" },
      { from: /'Manuel Blog Üret'/g, to: "t('tabManual')" },
      { from: /'İçerik Takvimi'/g, to: "t('tabCalendar')" }
    ],
    dict: {
      tr: { title: "YAPAY ZEKA OTONOMİSİ VE KARAKTER", subtitle: "Blog yazarlığınızı üstlenecek yapay zekanın karakterini ve planlarını belirleyin.", tabPersona: "Karakter (Persona)", tabManual: "Manuel Blog Üret", tabCalendar: "İçerik Takvimi" },
      en: { title: "AI AUTOMATION & PERSONA", subtitle: "Define the persona and plans of the AI that will write your blogs.", tabPersona: "Persona", tabManual: "Generate Blog Manually", tabCalendar: "Content Calendar" },
      de: { title: "KI-AUTOMATISIERUNG & PERSONA", subtitle: "Definieren Sie die Persona und Pläne der KI, die Ihre Blogs schreiben wird.", tabPersona: "Persona", tabManual: "Blog manuell generieren", tabCalendar: "Inhaltskalender" },
      ru: { title: "ИИ АВТОМАТИЗАЦИЯ И ПЕРСОНА", subtitle: "Определите персону и планы ИИ, который будет писать ваши блоги.", tabPersona: "Персона", tabManual: "Сгенерировать блог вручную", tabCalendar: "Календарь контента" }
    }
  }
];

tasks.forEach(task => {
  const targetFile = path.join(adminDir, task.file);
  if (fs.existsSync(targetFile)) {
    let content = fs.readFileSync(targetFile, 'utf8');
    if (!content.includes('useTranslations')) {
      content = "import { useTranslations } from 'next-intl';\n" + content;
      // Inject inside the main export default function
      const match = content.match(/export default function ([A-Za-z0-9_]+)\s*\(\)\s*\{/);
      if (match) {
        content = content.replace(match[0], `${match[0]}\n  const t = useTranslations('${task.namespace}');`);
      }
    }
    
    task.replaces.forEach(r => {
      content = content.replace(r.from, r.to);
    });
    fs.writeFileSync(targetFile, content);
    console.log(`Updated component ${task.file}`);
    
    ['tr', 'en', 'de', 'ru'].forEach(lang => {
      const jsonPath = path.join(jsonDir, `${lang}.json`);
      let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (!data.Admin) data.Admin = {};
      const subKey = task.namespace.split('.')[1];
      if (!data.Admin[subKey]) data.Admin[subKey] = {};
      data.Admin[subKey] = { ...data.Admin[subKey], ...task.dict[lang] };
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    });
    console.log(`Updated JSONs for ${task.file}`);
  }
});
