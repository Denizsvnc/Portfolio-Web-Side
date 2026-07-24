const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src/app/[locale]/admin');

// We will do a robust manual mapping for each file.
const replacements = [
  {
    file: 'about/page.tsx',
    namespace: 'Admin.about',
    replaces: [
      { from: /'Hakkımda Yönetimi'/g, to: "t('title')" },
      { from: /'Hakkımda Bölümleri'/g, to: "t('sections')" },
      { from: />Yeni Ekle</g, to: "> {t('addNew')} <" },
      { from: />Düzenle</g, to: "> {t('edit')} <" },
      { from: />Sil</g, to: "> {t('delete')} <" },
      { from: />Profil Fotoğrafı \(Dosya veya URL\)</g, to: "> {t('profilePhoto')} <" },
      { from: />Resmi Buraya Sürükle veya Seç</g, to: "> {t('dragImage')} <" },
      { from: />CV \(PDF\) Yükle</g, to: "> {t('uploadCV')} <" },
      { from: />Türkçe Başlık</g, to: "> {t('title_tr')} <" },
      { from: />İngilizce Başlık</g, to: "> {t('title_en')} <" },
      { from: />Almanca Başlık</g, to: "> {t('title_de')} <" },
      { from: />Rusça Başlık</g, to: "> {t('title_ru')} <" },
      { from: />Türkçe İçerik</g, to: "> {t('text_tr')} <" },
      { from: />İngilizce İçerik</g, to: "> {t('text_en')} <" },
      { from: />Almanca İçerik</g, to: "> {t('text_de')} <" },
      { from: />Rusça İçerik</g, to: "> {t('text_ru')} <" },
      { from: />Kaydet</g, to: "> {t('save')} <" },
      { from: />İptal</g, to: "> {t('cancel')} <" },
      { from: /'Bu hakkında bölümünü silmek istediğinize emin misiniz\?'/g, to: "t('confirmDelete')" },
      { from: /'Silinirken bir hata oluştu.'/g, to: "t('deleteError')" },
      { from: /'Resim yüklenirken bir hata oluştu.'/g, to: "t('uploadError')" },
      { from: /'Hakkımda Bölümünü Düzenle'/g, to: "t('editSection')" },
      { from: /'Yeni Hakkımda Bölümü Ekle'/g, to: "t('newSection')" },
      { from: /Henüz eklenmiş bir bölüm yok./g, to: "{t('noSections')}" },
      { from: />CV Dosyası Yüklü</g, to: "> {t('cvUploaded')} <" },
      { from: />Profil Fotoğrafı Yükleniyor...</g, to: "> {t('uploadingPhoto')} <" },
      { from: />CV Yükleniyor...</g, to: "> {t('uploadingCV')} <" },
      { from: />Kaydediliyor...</g, to: "> {t('saving')} <" }
    ],
    dict: {
      tr: { title: "Hakkımda Yönetimi", sections: "Hakkımda Bölümleri", addNew: "Yeni Ekle", edit: "Düzenle", delete: "Sil", profilePhoto: "Profil Fotoğrafı (Dosya veya URL)", dragImage: "Resmi Buraya Sürükle veya Seç", uploadCV: "CV (PDF) Yükle", title_tr: "Türkçe Başlık", title_en: "İngilizce Başlık", title_de: "Almanca Başlık", title_ru: "Rusça Başlık", text_tr: "Türkçe İçerik", text_en: "İngilizce İçerik", text_de: "Almanca İçerik", text_ru: "Rusça İçerik", save: "Kaydet", cancel: "İptal", confirmDelete: "Bu hakkında bölümünü silmek istediğinize emin misiniz?", deleteError: "Silinirken bir hata oluştu.", uploadError: "Resim yüklenirken bir hata oluştu.", editSection: "Hakkımda Bölümünü Düzenle", newSection: "Yeni Hakkımda Bölümü Ekle", noSections: "Henüz eklenmiş bir bölüm yok.", cvUploaded: "CV Dosyası Yüklü", uploadingPhoto: "Profil Fotoğrafı Yükleniyor...", uploadingCV: "CV Yükleniyor...", saving: "Kaydediliyor..." },
      en: { title: "About Management", sections: "About Sections", addNew: "Add New", edit: "Edit", delete: "Delete", profilePhoto: "Profile Photo (File or URL)", dragImage: "Drag or Select Image", uploadCV: "Upload CV (PDF)", title_tr: "Turkish Title", title_en: "English Title", title_de: "German Title", title_ru: "Russian Title", text_tr: "Turkish Content", text_en: "English Content", text_de: "German Content", text_ru: "Russian Content", save: "Save", cancel: "Cancel", confirmDelete: "Are you sure you want to delete this about section?", deleteError: "An error occurred while deleting.", uploadError: "An error occurred while uploading image.", editSection: "Edit About Section", newSection: "Add New About Section", noSections: "No sections added yet.", cvUploaded: "CV Uploaded", uploadingPhoto: "Uploading Photo...", uploadingCV: "Uploading CV...", saving: "Saving..." },
      de: { title: "Über Mich Verwaltung", sections: "Über Mich Abschnitte", addNew: "Neu hinzufügen", edit: "Bearbeiten", delete: "Löschen", profilePhoto: "Profilfoto (Datei oder URL)", dragImage: "Bild hierher ziehen oder auswählen", uploadCV: "CV (PDF) hochladen", title_tr: "Türkischer Titel", title_en: "Englischer Titel", title_de: "Deutscher Titel", title_ru: "Russischer Titel", text_tr: "Türkischer Inhalt", text_en: "Englischer Inhalt", text_de: "Deutscher Inhalt", text_ru: "Russischer Inhalt", save: "Speichern", cancel: "Abbrechen", confirmDelete: "Sind Sie sicher, dass Sie diesen Abschnitt löschen möchten?", deleteError: "Fehler beim Löschen aufgetreten.", uploadError: "Fehler beim Hochladen des Bildes.", editSection: "Abschnitt bearbeiten", newSection: "Neuen Abschnitt hinzufügen", noSections: "Noch keine Abschnitte hinzugefügt.", cvUploaded: "CV Hochgeladen", uploadingPhoto: "Foto hochladen...", uploadingCV: "CV hochladen...", saving: "Wird gespeichert..." },
      ru: { title: "Управление Обо мне", sections: "Разделы Обо мне", addNew: "Добавить новый", edit: "Редактировать", delete: "Удалить", profilePhoto: "Фото профиля (Файл или URL)", dragImage: "Перетащите или выберите изображение", uploadCV: "Загрузить резюме (PDF)", title_tr: "Турецкий заголовок", title_en: "Английский заголовок", title_de: "Немецкий заголовок", title_ru: "Русский заголовок", text_tr: "Турецкий контент", text_en: "Английский контент", text_de: "Немецкий контент", text_ru: "Русский контент", save: "Сохранить", cancel: "Отмена", confirmDelete: "Вы уверены, что хотите удалить этот раздел?", deleteError: "Ошибка при удалении.", uploadError: "Ошибка при загрузке изображения.", editSection: "Редактировать раздел", newSection: "Добавить новый раздел", noSections: "Разделы пока не добавлены.", cvUploaded: "Резюме загружено", uploadingPhoto: "Загрузка фото...", uploadingCV: "Загрузка резюме...", saving: "Сохранение..." }
    }
  }
];

function updateTranslations() {
  const jsonDir = path.join(__dirname, 'messages');
  
  replacements.forEach(task => {
    // 1. Update Component
    const targetFile = path.join(adminDir, task.file);
    if (!fs.existsSync(targetFile)) {
      console.log(`Skipping ${task.file} - not found`);
      return;
    }
    
    let content = fs.readFileSync(targetFile, 'utf8');
    
    // Add useTranslations hook if not exists
    if (!content.includes('useTranslations')) {
      content = content.replace("import React,", "import React, {");
      // Actually easier to just inject at the top of imports
      content = "import { useTranslations } from 'next-intl';\n" + content;
      
      // Inject const t = useTranslations('...'); inside the component
      const componentName = task.file.includes('about') ? 'AdminAboutPage' : 'Component'; // Hacky but works for about
      content = content.replace(`export default function ${componentName}() {`, `export default function ${componentName}() {\n  const t = useTranslations('${task.namespace}');`);
    }
    
    // Apply replacements
    task.replaces.forEach(r => {
      content = content.replace(r.from, r.to);
    });
    
    fs.writeFileSync(targetFile, content);
    console.log(`Updated component ${task.file}`);
    
    // 2. Update JSON files
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
  });
}

updateTranslations();
