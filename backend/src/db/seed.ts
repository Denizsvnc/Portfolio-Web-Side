import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from './index';
import {
  usersTable,
  about,
  skilss,
  projects,
  blogs,
  images,
  visitors,
  pageViews,
  blogAnalytics,
} from './schema';

async function seed() {
  console.log('🚀 Enriching database seed...');

  // 1. Super Admin User
  const adminEmail = 'admin@mail.com';
  const rawPassword = '123';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, adminEmail));

  if (existingUser) {
    await db
      .update(usersTable)
      .set({
        password: hashedPassword,
        role: 'super_admin',
        is_active: true,
      })
      .where(eq(usersTable.id, existingUser.id));
    console.log(`[✓] Super Admin user (${adminEmail}) updated!`);
  } else {
    await db.insert(usersTable).values({
      name: 'Deniz Sevinç',
      email: adminEmail,
      password: hashedPassword,
      role: 'super_admin',
      is_active: true,
    });
    console.log(`[✓] Super Admin user (${adminEmail}) created!`);
  }

  // 2. About Section
  const existingAbout = await db.select().from(about);
  if (existingAbout.length === 0) {
    await db.insert(about).values({
      title_tr: 'Deniz Sevinç - Hakkımda',
      title_en: 'Deniz Sevinç - About Me',
      title_de: 'Deniz Sevinç - Über Mich',
      title_ru: 'Дениз Севинч - Обо мне',
      text_tr:
        "Bafra Mesleki ve Teknik Anadolu Lisesi Bilgi Teknolojileri – Yazılım Geliştirme bölümünün ardından, Ondokuz Mayıs Üniversitesi Bilgisayar Programcılığı bölümünden mezun oldum. Akademik eğitimim sırasında makine öğrenmesi odaklı projemizle TÜBİTAK Ulusal Proje Yarışması'nda Türkiye 4.'sü olma başarısı gösterdik. Profesyonel kariyerimde YeşilMavi Yazılım'da Software Developer olarak görev aldım ve kurumsal ölçekte çeşitli tecrübeler edindim. Geliştirme süreçlerinde daima modern web teknolojilerini, kullanıcı deneyimini (UX) ve yüksek performansı merkezde tutuyorum. Şu an inovasyon ve ölçeklenebilirlik odaklı dijital ürünler (SaaS, Mini ERP, Full-Stack Web Uygulamaları) tasarlıyor ve freelance olarak profesyonel projelere imza atmaya devam ediyorum.",
      text_en:
        "After graduating from Bafra Vocational and Technical Anatolian High School Information Technology - Software Development department, I graduated from Ondokuz Mayıs University Computer Programming department. During my academic education, our machine learning-focused project won 4th place in Turkey at the TÜBİTAK National Project Competition. In my professional career, I worked as a Software Developer at YeşilMavi Software and gained enterprise experience.",
      text_de:
        "Nach dem Abschluss an der Bafra Berufsbildenden Schule für Informationstechnologie - Softwareentwicklung habe ich mein Studium der Computerprogrammierung an der Ondokuz Mayıs Universität abgeschlossen.",
      text_ru:
        "После окончания профессионально-технической школы в Бафре по специальности 'Информационные технологии - Разработка ПО', я окончил отделение компьютерного программирования Университета Ондокуз Майыс.",
      pp_url:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    });
    console.log('[✓] About section seeded!');
  }

  // 3. Skills Section
  const existingSkills = await db.select().from(skilss);
  if (existingSkills.length === 0) {
    await db.insert(skilss).values([
      {
        icon: 'code',
        title_tr: 'Frontend Development',
        title_en: 'Frontend Development',
        title_de: 'Frontend-Entwicklung',
        title_ru: 'Фронтенд-разработка',
        element_tr: 'HTML5, CSS3, JavaScript, TypeScript, React.js, Next.js, TailwindCSS, Bootstrap',
        element_en: 'HTML5, CSS3, JavaScript, TypeScript, React.js, Next.js, TailwindCSS, Bootstrap',
        element_de: 'HTML5, CSS3, JavaScript, TypeScript, React.js, Next.js, TailwindCSS, Bootstrap',
        element_ru: 'HTML5, CSS3, JavaScript, TypeScript, React.js, Next.js, TailwindCSS, Bootstrap',
        is_active: true,
      },
      {
        icon: 'server',
        title_tr: 'Backend & Languages',
        title_en: 'Backend & Languages',
        title_de: 'Backend & Sprachen',
        title_ru: 'Бэкенд и языки',
        element_tr: 'Node.js, NestJS, Express.js, TypeScript, Python, C#, PHP, Drizzle ORM, MVC',
        element_en: 'Node.js, NestJS, Express.js, TypeScript, Python, C#, PHP, Drizzle ORM, MVC',
        element_de: 'Node.js, NestJS, Express.js, TypeScript, Python, C#, PHP, Drizzle ORM, MVC',
        element_ru: 'Node.js, NestJS, Express.js, TypeScript, Python, C#, PHP, Drizzle ORM, MVC',
        is_active: true,
      },
      {
        icon: 'tools',
        title_tr: 'Tools & Databases',
        title_en: 'Tools & Databases',
        title_de: 'Werkzeuge & Datenbanken',
        title_ru: 'Инструменты и базы данных',
        element_tr: 'Git, Git Bash, PostgreSQL, MySQL, Docker, REST API Architecture, Sharp WebP',
        element_en: 'Git, Git Bash, PostgreSQL, MySQL, Docker, REST API Architecture, Sharp WebP',
        element_de: 'Git, Git Bash, PostgreSQL, MySQL, Docker, REST API Architecture, Sharp WebP',
        element_ru: 'Git, Git Bash, PostgreSQL, MySQL, Docker, REST API Architecture, Sharp WebP',
        is_active: true,
      },
    ]);
    console.log('[✓] Skills seeded!');
  }

  // 4. Projects Section
  const existingProjects = await db.select().from(projects);
  if (existingProjects.length === 0) {
    await db.insert(projects).values([
      {
        icon: 'star',
        title_tr: 'E-Menum SaaS & Mini ERP',
        title_en: 'E-Menum SaaS & Mini ERP Solution',
        title_de: 'E-Menum SaaS & Mini ERP Lösung',
        title_ru: 'E-Menum SaaS и Мини ERP Решение',
        element_tr:
          'Restoranlar için tam kapsamlı dijital dönüşüm çözümü. QR menü, NFC sipariş, masa yönetimi, Kasa POS ve mini ERP tek platformda.',
        element_en:
          'Full-scale digital transformation solution for restaurants. QR menu, NFC ordering, table management, POS cashier and mini ERP in one single platform.',
        element_de:
          'Umfassende digitale Transformationslösung für Restaurants. QR-Menü, NFC-Bestellung, Tischverwaltung, Kassen-POS und Mini-ERP auf einer Plattform.',
        element_ru:
          'Комплексное решение для цифровой трансформации ресторанов. QR-меню, NFC-заказы, управление столами, POS-касса и мини-ERP на одной платформе.',
        innovation_tr:
          'QR kopyalama ve sahte sipariş açıklarına karşı NFC Kart Teknolojisi ile donanımsal çözüm geliştirildi. Token tabanlı oturum güvenliği sayesinde kart masada yoksa sipariş alınamıyor.',
        innovation_en:
          'Hardware NFC Card technology developed against QR cloning vulnerabilities. Token-based session security prevents order placement without physical table card presence.',
        innovation_de:
          'Hardware-NFC-Kartentechnologie gegen QR-Kopierlücken. Token-basierte Sitzungssicherheit verhindert Bestellungen ohne physische Tischkarte.',
        innovation_ru:
          'Разработана аппаратная технология NFC-карт для защиты от клонирования QR-кодов. Безопасность сеанса на основе токенов запрещает заказ при отсутствии карты.',
        tech_stack: 'TypeScript, SaaS, Mini ERP, NFC & QR',
        button_url: 'https://github.com/Denizsvnc/emenum.tr-SaaS-Projects-Preview',
        demo_url: 'https://emenum.tr',
        isSignature: true,
        queue: 1,
        isActive: true,
        views: 342,
      },
      {
        icon: 'hotel',
        title_tr: 'Han Hotel Web Project',
        title_en: 'Han Hotel Web Project',
        title_de: 'Han Hotel Webprojekt',
        title_ru: 'Han Hotel Веб-проект',
        element_tr:
          'Modern otel işletmeleri için geliştirilmiş, şık tasarımlı, rezervasyon bilgilendirme ekranlı ve tam uyumlu (Responsive) kurumsal web projesi.',
        element_en:
          'Corporate website project for modern hotel businesses featuring luxury UI/UX design and booking information modules.',
        element_de:
          'Kurporatives Webprojekt für moderne Hotelunternehmen mit luxuriösem UI/UX-Design und Buchungsinformationsmodulen.',
        element_ru:
          'Корпоративный веб-проект для современных отелей с премиальным UI/UX дизайном и модулями бронирования.',
        tech_stack: 'HTML5, CSS3, JavaScript, Responsive UI',
        button_url: 'https://github.com/Denizsvnc/Han-Hotel-Web-Project/',
        demo_url: '',
        isSignature: false,
        queue: 2,
        isActive: true,
        views: 185,
      },
      {
        icon: 'shield',
        title_tr: 'Authentication Template - NestJS',
        title_en: 'Authentication Template - NestJS',
        title_de: 'Authentifizierungs-Vorlage - NestJS',
        title_ru: 'Шаблон авторизации - NestJS',
        element_tr:
          'TypeScript ve NestJS tabanlı, JWT, Refresh Token ve Rol Tabanlı Erişim Kontrolü (RBAC) içeren modüler kimlik doğrulama altyapısı.',
        element_en:
          'TypeScript and NestJS based modular authentication framework including JWT, Refresh Tokens, and Role Based Access Control (RBAC).',
        element_de:
          'Modulares Authentifizierungs-Framework auf Basis von TypeScript und NestJS mit JWT, Refresh-Tokens und RBAC.',
        element_ru:
          'Модульный фреймворк аутентификации на TypeScript и NestJS с поддержкой JWT, Refresh-токенов и RBAC.',
        tech_stack: 'TypeScript, NestJS, JWT, RBAC',
        button_url: 'https://github.com/Denizsvnc/Authentication-Template-Projects---NestJS',
        demo_url: '',
        isSignature: false,
        queue: 3,
        isActive: true,
        views: 142,
      },
      {
        icon: 'sparkles',
        title_tr: 'Elite Model Turkey Full-Stack Project',
        title_en: 'Elite Model Turkey Full-Stack Project',
        title_de: 'Elite Model Turkey Full-Stack Projekt',
        title_ru: 'Elite Model Turkey Full-Stack Проект',
        element_tr:
          'Model ajansları ve yetenek yönetimi platformları için geliştirilmiş full-stack dinamik portal çözümü.',
        element_en:
          'Full-stack dynamic portal solution engineered for model agencies and talent management platforms.',
        element_de:
          'Full-Stack dynamisches Portallösungsdesign für Modellagenturen und Talentmanagement-Plattformen.',
        element_ru:
          'Full-stack портал для модельных агентств и платформ управления талантами.',
        tech_stack: 'TypeScript, Node.js, Express, React',
        button_url: 'https://github.com/Denizsvnc/Elite-Model-Turkey-Full-Stack-Web-Site',
        demo_url: '',
        isSignature: false,
        queue: 4,
        isActive: true,
        views: 120,
      },
      {
        icon: 'grid',
        title_tr: 'Grid Generator Helper Tool',
        title_en: 'Grid Generator Helper Tool',
        title_de: 'Grid Generator Hilfswerkzeug',
        title_ru: 'Генератор сетки CSS',
        element_tr:
          'Geliştiriciler için karmaşık CSS Grid düzenlerini görsel olarak oluşturan ve kod üreten yardımcı geliştirici aracı.',
        element_en:
          'Developer utility tool for visually constructing complex CSS Grid layouts and auto-generating clean CSS code.',
        element_de:
          'Entwickler-Hilfswerkzeug zur visuellen Erstellung komplexer CSS-Grid-Layouts und automatischen Codegenerierung.',
        element_ru:
          'Инструмент разработчика для визуального создания сложных CSS Grid макетов и генерации чистого кода.',
        tech_stack: 'JavaScript, CSS Grid, HTML5 Canvas',
        button_url: 'https://github.com/Denizsvnc/Grid-Generator',
        demo_url: '',
        isSignature: false,
        queue: 5,
        isActive: true,
        views: 98,
      },
    ]);
    console.log('[✓] Projects seeded!');
  }

  // 5. Blogs Section
  const existingBlogs = await db.select().from(blogs);
  if (existingBlogs.length === 0) {
    await db.insert(blogs).values([
      {
        icon: 'rocket',
        img_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        title_tr: 'Next.js 14 ve App Router ile Yüksek Performanslı Web Uygulamaları',
        title_en: 'High Performance Web Applications with Next.js 14 & App Router',
        title_de: 'Hochleistungs-Webanwendungen mit Next.js 14 & App Router',
        title_ru: 'Высокопроизводительные веб-приложения на Next.js 14 и App Router',
        description_tr:
          'Modern web geliştirmede sunucu bileşenleri (Server Components), Turbopack derleyici ve dinamik yönlendirme mimarisinin sunduğu performans avantajları, SEO optimizasyon yöntemleri ve statik üretkenlik teknikleri.',
        description_en:
          'Exploring Server Components, Turbopack bundling, and dynamic routing architectures in Next.js 14 for optimal page load speed and SEO performance.',
        description_de:
          'Erforschung von Server Components, Turbopack-Bundling und dynamischer Routing-Architektur in Next.js 14 für optimale Ladegeschwindigkeiten.',
        description_ru:
          'Исследование серверных компонентов, сборки Turbopack и динамической маршрутизации в Next.js 14 для оптимизации скорости загрузки.',
        queue: 1,
        isActive: true,
        views: 412,
        shares: 68,
      },
      {
        icon: 'database',
        img_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
        title_tr: 'Drizzle ORM ve PostgreSQL ile Tip Güvenlikli Veritabanı Mimarisi',
        title_en: 'Type-Safe Database Architecture with Drizzle ORM and PostgreSQL',
        title_de: 'Typsichere Datenbankarchitektur mit Drizzle ORM und PostgreSQL',
        title_ru: 'Типобезопасная архитектура БД с Drizzle ORM и PostgreSQL',
        description_tr:
          'TypeScript ekosisteminde Drizzle ORM kullanarak sıfır çalışma zamanı yükü (Zero-Overhead) ile veritabanı şemaları oluşturma, göç yönetimi (drizzle-kit push) ve karmaşık SQL sorgu optimizasyonları.',
        description_en:
          'Designing zero-overhead database schemas, migration control with Drizzle Kit, and type-safe query builders in Node.js applications.',
        description_de:
          'Entwurf von Datenbank-Schemas ohne Arbeitsaufwand, Migrationssteuerung mit Drizzle Kit und typsicheren Query Buildern.',
        description_ru:
          'Проектирование схем БД с нулевыми накладными расходами, управление миграциями с помощью Drizzle Kit и типобезопасные запросы.',
        queue: 2,
        isActive: true,
        views: 298,
        shares: 44,
      },
      {
        icon: 'shield-check',
        img_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
        title_tr: 'NFC ve QR Tabanlı SaaS Sistemlerinde Güvenlik ve Mimari',
        title_en: 'Security Architecture in NFC & QR Based SaaS Platforms',
        title_de: 'Sicherheitsarchitektur in NFC- & QR-basierten SaaS-Plattformen',
        title_ru: 'Архитектура безопасности в SaaS системах на базе NFC и QR',
        description_tr:
          'QR kopyalama açıklarını ortadan kaldırmak için donanımsal NFC kart doğrulaması, token rotation güvenlik protokolleri ve masa bazlı dinamik oturum yönetimi.',
        description_en:
          'Eliminating QR spoofing vulnerabilities using hardware NFC validation protocols, cryptographic token rotation, and dynamic session states.',
        description_de:
          'Eliminierung von QR-Spoofing-Schwachstellen durch Hardware-NFC-Validierungsprotokolle und kryptografische Token-Rotation.',
        description_ru:
          'Устранение уязвимостей клонирования QR-кодов с помощью аппаратной проверки NFC и криптографической ротации токенов.',
        queue: 3,
        isActive: true,
        views: 380,
        shares: 89,
      },
      {
        icon: 'layers',
        img_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        title_tr: 'TypeScript ve Node.js ile Kurumsal Ölçeklenebilir REST API Tasarımı',
        title_en: 'Enterprise Scalable REST API Design with TypeScript & Node.js',
        title_de: 'Skalierbares REST-API-Design für Unternehmen mit TypeScript & Node.js',
        title_ru: 'Масштабируемый REST API для предприятий на TypeScript и Node.js',
        description_tr:
          'Modüler mimari (Service/Controller/Routes katmanı), JWT ve Refresh Token güvenliği, IP bazlı ziyaretçi takip middleware yapısı ve OpenAPI 3.1 dokümantasyonu.',
        description_en:
          'Layered architecture design patterns, JWT authentication rotation, visitor IP tracking middlewares, and Scalar OpenAPI documentation standards.',
        description_de:
          'Schichtenarchitektur-Entwurfsmuster, JWT-Authentifizierung, Besucher-IP-Tracking-Middleware und Scalar OpenAPI-Standards.',
        description_ru:
          'Многослойные шаблоны проектирования, аутентификация JWT, промежуточное ПО отслеживания IP посетителей и OpenAPI документация.',
        queue: 4,
        isActive: true,
        views: 215,
        shares: 31,
      },
    ]);
    console.log('[✓] Blogs seeded!');
  }

  // 6. Visitors & Analytics Mock Data
  const existingVisitors = await db.select().from(visitors);
  if (existingVisitors.length === 0) {
    const insertedVisitors = await db
      .insert(visitors)
      .values([
        {
          ip_address: '176.240.112.45',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          country: 'Turkey',
          city: 'Istanbul',
          role: 'visitor',
          visit_count: 14,
        },
        {
          ip_address: '88.255.198.12',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          country: 'Turkey',
          city: 'Ankara',
          role: 'visitor',
          visit_count: 8,
        },
        {
          ip_address: '95.70.14.88',
          user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
          country: 'Turkey',
          city: 'Izmir',
          role: 'visitor',
          visit_count: 5,
        },
        {
          ip_address: '141.136.88.20',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
          country: 'Germany',
          city: 'Berlin',
          role: 'visitor',
          visit_count: 9,
        },
        {
          ip_address: '31.221.14.99',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
          country: 'United Kingdom',
          city: 'London',
          role: 'visitor',
          visit_count: 4,
        },
      ])
      .returning();

    // Page Views
    await db.insert(pageViews).values([
      { visitor_id: insertedVisitors[0]!.id, path: '/', ip_address: '176.240.112.45', city: 'Istanbul', country: 'Turkey' },
      { visitor_id: insertedVisitors[0]!.id, path: '/projects', ip_address: '176.240.112.45', city: 'Istanbul', country: 'Turkey' },
      { visitor_id: insertedVisitors[0]!.id, path: '/blogs', ip_address: '176.240.112.45', city: 'Istanbul', country: 'Turkey' },
      { visitor_id: insertedVisitors[1]!.id, path: '/', ip_address: '88.255.198.12', city: 'Ankara', country: 'Turkey' },
      { visitor_id: insertedVisitors[1]!.id, path: '/projects', ip_address: '88.255.198.12', city: 'Ankara', country: 'Turkey' },
      { visitor_id: insertedVisitors[3]!.id, path: '/', ip_address: '141.136.88.20', city: 'Berlin', country: 'Germany' },
    ]);

    console.log('[✓] Visitors & Analytics mock data seeded!');
  }

  console.log('🎉 Database seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[X] Seed failed:', err);
  process.exit(1);
});
