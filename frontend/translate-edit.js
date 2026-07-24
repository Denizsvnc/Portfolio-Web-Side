const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src/app/[locale]/admin');
const jsonDir = path.join(__dirname, 'messages');

const tasks = [
  {
    file: 'projects/edit/[id]/page.tsx',
    namespace: 'Admin.projectsEdit',
    replaces: [
      { from: /PROJE DÜZENLE/g, to: "{t('title')}" },
      { from: /Mevcut projenizi ve içeriklerini güncelleyin./g, to: "{t('subtitle')}" },
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
      { from: /Projeyi Güncelle/g, to: "{t('saveAndPublish')}" },
      { from: /Kaydediliyor.../g, to: "{t('saving')}" },
      { from: /'{t\('saving'\)}'/g, to: "t('saving')" }
    ],
    dict: {
      tr: { title: "PROJE DÜZENLE", subtitle: "Mevcut projenizi ve içeriklerini güncelleyin.", basicInfo: "Temel Bilgiler", icon: "Proje İkonu (örn: code, layout, vb.)", queue: "Gösterim Sırası", isActive: "Proje Aktif Mi?", isSignature: "İmza Projesi Mi? (Öne Çıkan)", techStack: "Teknolojiler (Virgülle ayırın)", demoUrl: "Canlı Demo URL", buttonUrl: "Proje Detayı İçin Buton Linki", contentLanguage: "İçerik Dili", projectTitle: "Proje Başlığı", elements: "Neler Yaptım? (Paragraf eklemek için enter'a basın)", innovation: "Teknolojik İnovasyon / Kullanılan Altyapı", addParagraph: "Yeni Paragraf Ayracı Ekle", externalLinks: "Dış Bağlantılar", linkTitle: "Bağlantı Başlığı", linkUrl: "URL", add: "Ekle", documents: "Dokümanlar & Dosyalar", dragFiles: "Belge veya dosyaları buraya sürükleyin veya seçin", maxFileSize: "Maksimum 5MB (PDF, DOC, TXT, IMG)", saveAndPublish: "Projeyi Güncelle", saving: "Kaydediliyor..." },
      en: { title: "EDIT PROJECT", subtitle: "Update your existing project and its contents.", basicInfo: "Basic Info", icon: "Project Icon (e.g., code, layout, etc.)", queue: "Display Order", isActive: "Is Project Active?", isSignature: "Is Signature Project? (Featured)", techStack: "Technologies (Comma separated)", demoUrl: "Live Demo URL", buttonUrl: "Button Link for Project Details", contentLanguage: "Content Language", projectTitle: "Project Title", elements: "What did I do? (Press enter to add paragraph)", innovation: "Technical Innovation / Infrastructure Used", addParagraph: "Add New Paragraph Separator", externalLinks: "External Links", linkTitle: "Link Title", linkUrl: "URL", add: "Add", documents: "Documents & Files", dragFiles: "Drag or select documents or files here", maxFileSize: "Max 5MB (PDF, DOC, TXT, IMG)", saveAndPublish: "Update Project", saving: "Saving..." },
      de: { title: "PROJEKT BEARBEITEN", subtitle: "Aktualisieren Sie Ihr bestehendes Projekt und dessen Inhalte.", basicInfo: "Basisinformationen", icon: "Projekt-Icon (z.B. code, layout, etc.)", queue: "Anzeigereihenfolge", isActive: "Ist Projekt aktiv?", isSignature: "Ist Signaturprojekt? (Hervorgehoben)", techStack: "Technologien (Kommagetrennt)", demoUrl: "Live-Demo URL", buttonUrl: "Button-Link für Projektdetails", contentLanguage: "Inhaltssprache", projectTitle: "Projekttitel", elements: "Was habe ich gemacht? (Eingabetaste für Absatz)", innovation: "Technische Innovation / Verwendete Infrastruktur", addParagraph: "Neuen Absatztrenner hinzufügen", externalLinks: "Externe Links", linkTitle: "Link-Titel", linkUrl: "URL", add: "Hinzufügen", documents: "Dokumente & Dateien", dragFiles: "Dokumente oder Dateien hierher ziehen oder auswählen", maxFileSize: "Max 5MB (PDF, DOC, TXT, IMG)", saveAndPublish: "Projekt aktualisieren", saving: "Wird gespeichert..." },
      ru: { title: "РЕДАКТИРОВАТЬ ПРОЕКТ", subtitle: "Обновите существующий проект и его содержимое.", basicInfo: "Основная информация", icon: "Иконка проекта (напр. code, layout)", queue: "Порядок отображения", isActive: "Проект активен?", isSignature: "Подпись проекта? (Выделенный)", techStack: "Технологии (через запятую)", demoUrl: "Live Demo URL", buttonUrl: "Ссылка на кнопку для деталей проекта", contentLanguage: "Язык контента", projectTitle: "Название проекта", elements: "Что я сделал? (Нажмите Enter для абзаца)", innovation: "Технические инновации / Инфраструктура", addParagraph: "Добавить разделитель абзацев", externalLinks: "Внешние ссылки", linkTitle: "Название ссылки", linkUrl: "URL", add: "Добавить", documents: "Документы и файлы", dragFiles: "Перетащите или выберите документы и файлы здесь", maxFileSize: "Макс 5MB (PDF, DOC, TXT, IMG)", saveAndPublish: "Обновить проект", saving: "Сохранение..." }
    }
  }
];

tasks.forEach(task => {
  const targetFile = path.join(adminDir, task.file);
  if (fs.existsSync(targetFile)) {
    let content = fs.readFileSync(targetFile, 'utf8');
    if (!content.includes('useTranslations')) {
      content = "import { useTranslations } from 'next-intl';\n" + content;
      const match = content.match(/export default function ([A-Za-z0-9_]+)\s*\(\{\s*params\s*\}\s*:\s*\{[^\}]+\}\)\s*\{/);
      if (match) {
        content = content.replace(match[0], `${match[0]}\n  const t = useTranslations('${task.namespace}');`);
      } else {
        const match2 = content.match(/export default function ([A-Za-z0-9_]+)\s*\(\)\s*\{/);
        if (match2) content = content.replace(match2[0], `${match2[0]}\n  const t = useTranslations('${task.namespace}');`);
      }
    }
    
    task.replaces.forEach(r => {
      content = content.replace(r.from, r.to);
    });
    
    // Fix syntax issues
    content = content.replace(/'\{t\('saving'\)\}'/g, "t('saving')");
    content = content.replace(/'\{t\('saveAndPublish'\)\}'/g, "t('saveAndPublish')");
    content = content.replace(/>\{t\('saving'\)\}</g, ">{t('saving')}<");
    
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
