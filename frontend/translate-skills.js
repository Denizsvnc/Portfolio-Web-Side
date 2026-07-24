const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src/app/[locale]/admin');
const jsonDir = path.join(__dirname, 'messages');

const task = {
  file: 'skills/page.tsx',
  namespace: 'Admin.skills',
  replaces: [
    { from: /'Yetenek Yönetimi'/g, to: "t('title')" },
    { from: />Yetenek Yönetimi</g, to: "> {t('title')} <" },
    { from: />Yeni Yetenek Ekle</g, to: "> {t('newSkill')} <" },
    { from: />Düzenle</g, to: "> {t('edit')} <" },
    { from: />Sil</g, to: "> {t('delete')} <" },
    { from: />Türkçe Başlık</g, to: "> {t('title_tr')} <" },
    { from: />İngilizce Başlık</g, to: "> {t('title_en')} <" },
    { from: />Almanca Başlık</g, to: "> {t('title_de')} <" },
    { from: />Rusça Başlık</g, to: "> {t('title_ru')} <" },
    { from: />Türkçe Yetenekler \(Virgülle ayırın\)</g, to: "> {t('element_tr')} <" },
    { from: />İngilizce Yetenekler \(Virgülle ayırın\)</g, to: "> {t('element_en')} <" },
    { from: />Almanca Yetenekler \(Virgülle ayırın\)</g, to: "> {t('element_de')} <" },
    { from: />Rusça Yetenekler \(Virgülle ayırın\)</g, to: "> {t('element_ru')} <" },
    { from: />İkon \(örn: code\)</g, to: "> {t('iconLabel')} <" },
    { from: />Aktif mi\?</g, to: "> {t('isActive')} <" },
    { from: />Kaydet</g, to: "> {t('save')} <" },
    { from: />İptal</g, to: "> {t('cancel')} <" },
    { from: /'Bu yeteneği silmek istediğinize emin misiniz\?'/g, to: "t('confirmDelete')" },
    { from: /'Silinirken hata oluştu.'/g, to: "t('deleteError')" },
    { from: /'Kaydedilirken hata oluştu.'/g, to: "t('saveError')" },
    { from: /'Yeteneği Düzenle'/g, to: "t('editSkill')" },
    { from: /'Yeni Yetenek Ekle'/g, to: "t('newSkill')" },
    { from: /Henüz yetenek eklenmemiş./g, to: "{t('noSkills')}" },
    { from: /Verileri Yenile/g, to: "{t('refresh')}" }
  ],
  dict: {
    tr: { title: "Yetenek Yönetimi", newSkill: "Yeni Yetenek Ekle", edit: "Düzenle", delete: "Sil", title_tr: "Türkçe Başlık", title_en: "İngilizce Başlık", title_de: "Almanca Başlık", title_ru: "Rusça Başlık", element_tr: "Türkçe Yetenekler (Virgülle ayırın)", element_en: "İngilizce Yetenekler (Virgülle ayırın)", element_de: "Almanca Yetenekler (Virgülle ayırın)", element_ru: "Rusça Yetenekler (Virgülle ayırın)", iconLabel: "İkon (örn: code)", isActive: "Aktif mi?", save: "Kaydet", cancel: "İptal", confirmDelete: "Bu yeteneği silmek istediğinize emin misiniz?", deleteError: "Silinirken hata oluştu.", saveError: "Kaydedilirken hata oluştu.", editSkill: "Yeteneği Düzenle", noSkills: "Henüz yetenek eklenmemiş.", refresh: "Verileri Yenile" },
    en: { title: "Skills Management", newSkill: "Add New Skill", edit: "Edit", delete: "Delete", title_tr: "Turkish Title", title_en: "English Title", title_de: "German Title", title_ru: "Russian Title", element_tr: "Turkish Skills (Comma separated)", element_en: "English Skills (Comma separated)", element_de: "German Skills (Comma separated)", element_ru: "Russian Skills (Comma separated)", iconLabel: "Icon (e.g., code)", isActive: "Is Active?", save: "Save", cancel: "Cancel", confirmDelete: "Are you sure you want to delete this skill?", deleteError: "Error occurred while deleting.", saveError: "Error occurred while saving.", editSkill: "Edit Skill", noSkills: "No skills added yet.", refresh: "Refresh Data" },
    de: { title: "Fähigkeiten-Verwaltung", newSkill: "Neue Fähigkeit hinzufügen", edit: "Bearbeiten", delete: "Löschen", title_tr: "Türkischer Titel", title_en: "Englischer Titel", title_de: "Deutscher Titel", title_ru: "Russischer Titel", element_tr: "Türkische Fähigkeiten (Kommagetrennt)", element_en: "Englische Fähigkeiten (Kommagetrennt)", element_de: "Deutsche Fähigkeiten (Kommagetrennt)", element_ru: "Russische Fähigkeiten (Kommagetrennt)", iconLabel: "Symbol (z.B. code)", isActive: "Ist aktiv?", save: "Speichern", cancel: "Abbrechen", confirmDelete: "Sind Sie sicher, dass Sie diese Fähigkeit löschen möchten?", deleteError: "Fehler beim Löschen aufgetreten.", saveError: "Fehler beim Speichern aufgetreten.", editSkill: "Fähigkeit bearbeiten", noSkills: "Noch keine Fähigkeiten hinzugefügt.", refresh: "Daten aktualisieren" },
    ru: { title: "Управление навыками", newSkill: "Добавить новый навык", edit: "Редактировать", delete: "Удалить", title_tr: "Турецкий заголовок", title_en: "Английский заголовок", title_de: "Немецкий заголовок", title_ru: "Русский заголовок", element_tr: "Навыки на турецком (через запятую)", element_en: "Навыки на английском (через запятую)", element_de: "Навыки на немецком (через запятую)", element_ru: "Навыки на русском (через запятую)", iconLabel: "Иконка (напр. code)", isActive: "Активен?", save: "Сохранить", cancel: "Отмена", confirmDelete: "Вы уверены, что хотите удалить этот навык?", deleteError: "Ошибка при удалении.", saveError: "Ошибка при сохранении.", editSkill: "Редактировать навык", noSkills: "Навыки пока не добавлены.", refresh: "Обновить данные" }
  }
};

const targetFile = path.join(adminDir, task.file);
if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  
  if (!content.includes('useTranslations')) {
    content = "import { useTranslations } from 'next-intl';\n" + content;
    content = content.replace(`export default function AdminSkillsPage() {`, `export default function AdminSkillsPage() {\n  const t = useTranslations('${task.namespace}');`);
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
