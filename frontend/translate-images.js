const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src/app/[locale]/admin');
const jsonDir = path.join(__dirname, 'messages');

const task = {
  file: 'images/page.tsx',
  namespace: 'Admin.images',
  replaces: [
    { from: /MEDYA VE GÖRSEL GALERİSİ/g, to: "{t('title')}" },
    { from: /Görselleri doğrudan yükleyin, otomatik WebP dönüşümü ve disk yönetimi/g, to: "{t('subtitle')}" },
    { from: /Yeni Görsel Yükle \(Otomatik WebP\)/g, to: "{t('uploadTitle')}" },
    { from: /Alternatif Metin \(Alt Text\)/g, to: "{t('altTextPlaceholder')}" },
    { from: /Yükle/g, to: "{t('uploadBtn')}" },
    { from: /Henüz hiç görsel yüklenmemiş./g, to: "{t('noImages')}" },
    { from: /Tarih:/g, to: "{t('date')}:" },
    { from: /Kopyalandı!/g, to: "{t('copied')}" },
    { from: /URL Kopyala/g, to: "{t('copyUrl')}" },
    { from: /'Lütfen bir resim dosyası seçin.'/g, to: "t('selectImageWarning')" },
    { from: /'Resim yüklenirken bir hata oluştu.'/g, to: "t('uploadError')" },
    { from: /'Bu görseli silmek istediğinize emin misiniz\? \(Fiziksel dosya da silinecektir\)'/g, to: "t('confirmDelete')" },
    { from: /'Silinirken hata oluştu.'/g, to: "t('deleteError')" }
  ],
  dict: {
    tr: { title: "MEDYA VE GÖRSEL GALERİSİ", subtitle: "Görselleri doğrudan yükleyin, otomatik WebP dönüşümü ve disk yönetimi", uploadTitle: "Yeni Görsel Yükle (Otomatik WebP)", altTextPlaceholder: "Alternatif Metin (Alt Text)", uploadBtn: "Yükle", noImages: "Henüz hiç görsel yüklenmemiş.", date: "Tarih", copied: "Kopyalandı!", copyUrl: "URL Kopyala", selectImageWarning: "Lütfen bir resim dosyası seçin.", uploadError: "Resim yüklenirken bir hata oluştu.", confirmDelete: "Bu görseli silmek istediğinize emin misiniz? (Fiziksel dosya da silinecektir)", deleteError: "Silinirken hata oluştu." },
    en: { title: "MEDIA AND IMAGE GALLERY", subtitle: "Upload images directly, automatic WebP conversion and disk management", uploadTitle: "Upload New Image (Auto WebP)", altTextPlaceholder: "Alternative Text (Alt Text)", uploadBtn: "Upload", noImages: "No images uploaded yet.", date: "Date", copied: "Copied!", copyUrl: "Copy URL", selectImageWarning: "Please select an image file.", uploadError: "Error occurred while uploading image.", confirmDelete: "Are you sure you want to delete this image? (Physical file will also be deleted)", deleteError: "Error occurred while deleting." },
    de: { title: "MEDIEN- UND BILDERGALERIE", subtitle: "Bilder direkt hochladen, automatische WebP-Konvertierung und Speicherverwaltung", uploadTitle: "Neues Bild hochladen (Auto WebP)", altTextPlaceholder: "Alternativtext (Alt Text)", uploadBtn: "Hochladen", noImages: "Noch keine Bilder hochgeladen.", date: "Datum", copied: "Kopiert!", copyUrl: "URL kopieren", selectImageWarning: "Bitte wählen Sie eine Bilddatei aus.", uploadError: "Fehler beim Hochladen des Bildes.", confirmDelete: "Sind Sie sicher, dass Sie dieses Bild löschen möchten? (Physische Datei wird ebenfalls gelöscht)", deleteError: "Fehler beim Löschen aufgetreten." },
    ru: { title: "МЕДИА И ГАЛЕРЕЯ ИЗОБРАЖЕНИЙ", subtitle: "Прямая загрузка изображений, автоматическая конвертация в WebP и управление диском", uploadTitle: "Загрузить новое изображение (Auto WebP)", altTextPlaceholder: "Альтернативный текст (Alt Text)", uploadBtn: "Загрузить", noImages: "Изображения пока не загружены.", date: "Дата", copied: "Скопировано!", copyUrl: "Копировать URL", selectImageWarning: "Пожалуйста, выберите файл изображения.", uploadError: "Ошибка при загрузке изображения.", confirmDelete: "Вы уверены, что хотите удалить это изображение? (Физический файл также будет удален)", deleteError: "Ошибка при удалении." }
  }
};

const targetFile = path.join(adminDir, task.file);
if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  
  if (!content.includes('useTranslations')) {
    content = "import { useTranslations } from 'next-intl';\n" + content;
    content = content.replace(`export default function AdminImagesPage() {`, `export default function AdminImagesPage() {\n  const t = useTranslations('${task.namespace}');`);
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
