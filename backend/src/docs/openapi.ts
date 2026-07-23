export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Deniz Sevinç Portfolio Backend API',
    version: '1.0.0',
    description: 'Deniz Sevinç kişisel web sitesi ve yönetim paneli REST API dokümantasyonu.',
  },
  servers: [
    {
      url: 'http://localhost:3005',
      description: 'Yerel Geliştirme Sunucusu',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Kimlik doğrulama ve oturum işlemleri' },
    { name: 'About', description: 'Hakkımda bölümü yönetimi' },
    { name: 'Skills', description: 'Yetenekler bölümü yönetimi' },
    { name: 'Projects', description: 'Projeler bölümü yönetimi' },
    { name: 'ContactBox', description: 'İletişim mesajları yönetimi' },
    { name: 'ContactSections', description: 'İletişim kanalları yönetimi' },
    { name: 'Images', description: 'Görseller ve medya yönetimi' },
    { name: 'Blogs', description: 'Blog yazıları yönetimi' },
    { name: 'Analytics', description: 'Ziyaretçi takibi ve istatistiksel raporlama' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Yetkili erişim gerektiren isteklerde `Authorization: Bearer <token>` olarak ekleyin.',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Bir hata oluştu.' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@mail.com' },
          password: { type: 'string', example: '123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Giriş başarılı.' },
          tokens: {
            type: 'object',
            properties: {
              accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
              refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
            },
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              name: { type: 'string', example: 'Admin' },
              email: { type: 'string', example: 'admin@mail.com' },
              role: { type: 'string', example: 'super_admin' },
            },
          },
        },
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
        },
      },
      RefreshTokenResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Token başarıyla yenilendi.' },
          tokens: {
            type: 'object',
            properties: {
              accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
              refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
            },
          },
        },
      },

      /* ABOUT SCHEMAS */
      AboutItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
          title_tr: { type: 'string', example: 'Yazılım Geliştirici' },
          title_en: { type: 'string', example: 'Software Developer' },
          title_de: { type: 'string', example: 'Softwareentwickler' },
          title_ru: { type: 'string', example: 'Разработчик программного обеспечения' },
          text_tr: { type: 'string', example: 'Merhaba, ben Deniz. Full-stack geliştiriciyim.' },
          text_en: { type: 'string', example: "Hello, I'm Deniz. I'm a full-stack developer." },
          text_de: { type: 'string', example: 'Hallo, ich bin Deniz. Ich bin Full-Stack-Entwickler.' },
          text_ru: { type: 'string', example: 'Привет, я Дениз. Я full-stack разработчик.' },
          pp_url: { type: 'string', example: 'https://example.com/profile.jpg' },
        },
      },
      CreateAboutRequest: {
        type: 'object',
        required: ['title_tr', 'title_en', 'title_de', 'title_ru', 'text_tr', 'text_en', 'text_de', 'text_ru', 'pp_url'],
        properties: {
          title_tr: { type: 'string', example: 'Yazılım Geliştirici' },
          title_en: { type: 'string', example: 'Software Developer' },
          title_de: { type: 'string', example: 'Softwareentwickler' },
          title_ru: { type: 'string', example: 'Разработчик' },
          text_tr: { type: 'string', example: 'Merhaba, ben Deniz.' },
          text_en: { type: 'string', example: 'Hello, I am Deniz.' },
          text_de: { type: 'string', example: 'Hallo, ich bin Deniz.' },
          text_ru: { type: 'string', example: 'Привет, я Дениз.' },
          pp_url: { type: 'string', example: 'https://example.com/profile.jpg' },
        },
      },
      UpdateAboutRequest: {
        type: 'object',
        properties: {
          title_tr: { type: 'string', example: 'Güncellenmiş Başlık (TR)' },
          title_en: { type: 'string', example: 'Updated Title (EN)' },
          title_de: { type: 'string', example: 'Updated Title (DE)' },
          title_ru: { type: 'string', example: 'Updated Title (RU)' },
          text_tr: { type: 'string', example: 'Güncellenmiş Metin (TR)' },
          text_en: { type: 'string', example: 'Updated Text (EN)' },
          text_de: { type: 'string', example: 'Updated Text (DE)' },
          text_ru: { type: 'string', example: 'Updated Text (RU)' },
          pp_url: { type: 'string', example: 'https://example.com/new_profile.jpg' },
        },
      },
      AboutResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'İşlem başarılı.' },
          data: { $ref: '#/components/schemas/AboutItem' },
        },
      },
      AboutListResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Hakkında bölümleri başarıyla getirildi.' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/AboutItem' },
          },
        },
      },

      /* SKILLS SCHEMAS */
      SkillItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' },
          icon: { type: 'string', example: 'code' },
          title_tr: { type: 'string', example: 'Backend Geliştirme' },
          title_en: { type: 'string', example: 'Backend Development' },
          title_de: { type: 'string', example: 'Backend-Entwicklung' },
          title_ru: { type: 'string', example: 'Backend-разработка' },
          element_tr: { type: 'string', example: 'Node.js, Express, PostgreSQL' },
          element_en: { type: 'string', example: 'Node.js, Express, PostgreSQL' },
          element_de: { type: 'string', example: 'Node.js, Express, PostgreSQL' },
          element_ru: { type: 'string', example: 'Node.js, Express, PostgreSQL' },
          is_active: { type: 'boolean', example: true },
        },
      },
      CreateSkillRequest: {
        type: 'object',
        required: ['icon', 'title_tr', 'title_en', 'title_de', 'title_ru', 'element_tr', 'element_en', 'element_de', 'element_ru'],
        properties: {
          icon: { type: 'string', example: 'code' },
          title_tr: { type: 'string', example: 'Backend Geliştirme' },
          title_en: { type: 'string', example: 'Backend Development' },
          title_de: { type: 'string', example: 'Backend-Entwicklung' },
          title_ru: { type: 'string', example: 'Backend-разработка' },
          element_tr: { type: 'string', example: 'Node.js, Express, PostgreSQL' },
          element_en: { type: 'string', example: 'Node.js, Express, PostgreSQL' },
          element_de: { type: 'string', example: 'Node.js, Express, PostgreSQL' },
          element_ru: { type: 'string', example: 'Node.js, Express, PostgreSQL' },
          is_active: { type: 'boolean', example: true },
        },
      },
      UpdateSkillRequest: {
        type: 'object',
        properties: {
          icon: { type: 'string', example: 'server' },
          title_tr: { type: 'string', example: 'Güncellenmiş Yetenek (TR)' },
          title_en: { type: 'string', example: 'Updated Skill (EN)' },
          title_de: { type: 'string', example: 'Updated Skill (DE)' },
          title_ru: { type: 'string', example: 'Updated Skill (RU)' },
          element_tr: { type: 'string', example: 'Node.js, TypeScript, PostgreSQL' },
          element_en: { type: 'string', example: 'Node.js, TypeScript, PostgreSQL' },
          element_de: { type: 'string', example: 'Node.js, TypeScript, PostgreSQL' },
          element_ru: { type: 'string', example: 'Node.js, TypeScript, PostgreSQL' },
          is_active: { type: 'boolean', example: true },
        },
      },
      SkillResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Skill created successfully.' },
          data: { $ref: '#/components/schemas/SkillItem' },
        },
      },
      SkillListResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Skills retrieved successfully.' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/SkillItem' },
          },
        },
      },

      /* IMAGES SCHEMAS */
      ImageItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' },
          image_url: { type: 'string', example: '/uploads/image-1721721600000-123456789.webp' },
          alt_text: { type: 'string', example: 'Profil fotoğrafı' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          blogId: { type: 'string', format: 'uuid', nullable: true },
          queue: { type: 'integer', example: 0 },
        },
      },
      UpdateImageRequest: {
        type: 'object',
        properties: {
          alt_text: { type: 'string', example: 'Yeni alt metin' },
          isActive: { type: 'boolean', example: true },
          queue: { type: 'integer', example: 1 },
          blogId: { type: 'string', format: 'uuid' },
        },
      },
      ImageResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Görsel başarıyla yüklendi ve WebP formatına dönüştürüldü.' },
          data: { $ref: '#/components/schemas/ImageItem' },
        },
      },
      ImageListResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Görseller başarıyla getirildi.' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/ImageItem' },
          },
        },
      },

      /* PROJECTS SCHEMAS */
      ProjectItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44' },
          icon: { type: 'string', example: 'folder' },
          title_tr: { type: 'string', example: 'E-Ticaret Web Sitesi' },
          title_en: { type: 'string', example: 'E-Commerce Website' },
          title_de: { type: 'string', example: 'E-Commerce-Website' },
          title_ru: { type: 'string', example: 'Интернет-магазин' },
          element_tr: { type: 'string', example: 'Next.js, TypeScript, Node.js' },
          element_en: { type: 'string', example: 'Next.js, TypeScript, Node.js' },
          element_de: { type: 'string', example: 'Next.js, TypeScript, Node.js' },
          element_ru: { type: 'string', example: 'Next.js, TypeScript, Node.js' },
          button_url: { type: 'string', example: 'https://github.com/example/project' },
          queue: { type: 'integer', example: 0 },
          isActive: { type: 'boolean', example: true },
          views: { type: 'integer', example: 0 },
        },
      },
      CreateProjectRequest: {
        type: 'object',
        required: ['icon', 'title_tr', 'title_en', 'title_de', 'title_ru', 'element_tr', 'element_en', 'element_de', 'element_ru', 'button_url', 'queue'],
        properties: {
          icon: { type: 'string', example: 'folder' },
          title_tr: { type: 'string', example: 'E-Ticaret Web Sitesi' },
          title_en: { type: 'string', example: 'E-Commerce Website' },
          title_de: { type: 'string', example: 'E-Commerce-Website' },
          title_ru: { type: 'string', example: 'Интернет-магазин' },
          element_tr: { type: 'string', example: 'Next.js, TypeScript, Node.js' },
          element_en: { type: 'string', example: 'Next.js, TypeScript, Node.js' },
          element_de: { type: 'string', example: 'Next.js, TypeScript, Node.js' },
          element_ru: { type: 'string', example: 'Next.js, TypeScript, Node.js' },
          button_url: { type: 'string', example: 'https://github.com/example/project' },
          queue: { type: 'integer', example: 0 },
        },
      },
      UpdateProjectRequest: {
        type: 'object',
        properties: {
          icon: { type: 'string', example: 'folder-open' },
          title_tr: { type: 'string', example: 'Güncellenmiş Proje (TR)' },
          title_en: { type: 'string', example: 'Updated Project (EN)' },
          title_de: { type: 'string', example: 'Updated Project (DE)' },
          title_ru: { type: 'string', example: 'Updated Project (RU)' },
          element_tr: { type: 'string', example: 'React, Node.js' },
          element_en: { type: 'string', example: 'React, Node.js' },
          element_de: { type: 'string', example: 'React, Node.js' },
          element_ru: { type: 'string', example: 'React, Node.js' },
          button_url: { type: 'string', example: 'https://example.com' },
          queue: { type: 'integer', example: 1 },
          isActive: { type: 'boolean', example: true },
        },
      },
      ProjectResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Project created successfully.' },
          data: { $ref: '#/components/schemas/ProjectItem' },
        },
      },
      ProjectListResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Projects retrieved successfully.' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProjectItem' },
          },
        },
      },

      /* BLOGS SCHEMAS */
      BlogItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55' },
          icon: { type: 'string', example: 'book-open' },
          img_url: { type: 'string', example: '/uploads/blog-cover.webp' },
          title_tr: { type: 'string', example: 'TypeScript ile Web Geliştirme' },
          title_en: { type: 'string', example: 'Web Development with TypeScript' },
          title_de: { type: 'string', example: 'Webentwicklung mit TypeScript' },
          title_ru: { type: 'string', example: 'Веб-разработка на TypeScript' },
          description_tr: { type: 'string', example: 'TypeScript kullanarak güvenli backend mimarileri kurmak.' },
          description_en: { type: 'string', example: 'Building type-safe backend architectures with TypeScript.' },
          description_de: { type: 'string', example: 'Erstellen von typsicheren Backend-Architekturen mit TypeScript.' },
          description_ru: { type: 'string', example: 'Создание безопасных backend-архитектур с помощью TypeScript.' },
          queue: { type: 'integer', example: 0 },
          isActive: { type: 'boolean', example: true },
          views: { type: 'integer', example: 42 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateBlogRequest: {
        type: 'object',
        required: ['img_url', 'title_tr', 'title_en', 'title_de', 'title_ru', 'description_tr', 'description_en', 'description_de', 'description_ru'],
        properties: {
          icon: { type: 'string', example: 'book-open' },
          img_url: { type: 'string', example: '/uploads/blog-cover.webp' },
          title_tr: { type: 'string', example: 'TypeScript ile Web Geliştirme' },
          title_en: { type: 'string', example: 'Web Development with TypeScript' },
          title_de: { type: 'string', example: 'Webentwicklung mit TypeScript' },
          title_ru: { type: 'string', example: 'Веб-разработка на TypeScript' },
          description_tr: { type: 'string', example: 'TypeScript kullanarak güvenli backend mimarileri kurmak.' },
          description_en: { type: 'string', example: 'Building type-safe backend architectures with TypeScript.' },
          description_de: { type: 'string', example: 'Erstellen von typsicheren Backend-Architekturen mit TypeScript.' },
          description_ru: { type: 'string', example: 'Создание безопасных backend-архитектур с помощью TypeScript.' },
          queue: { type: 'integer', example: 0 },
          isActive: { type: 'boolean', example: true },
        },
      },
      UpdateBlogRequest: {
        type: 'object',
        properties: {
          icon: { type: 'string', example: 'edit' },
          img_url: { type: 'string', example: '/uploads/new-blog-cover.webp' },
          title_tr: { type: 'string', example: 'Güncellenmiş Blog Başlığı' },
          title_en: { type: 'string', example: 'Updated Blog Title' },
          title_de: { type: 'string', example: 'Updated Blog Title' },
          title_ru: { type: 'string', example: 'Updated Blog Title' },
          description_tr: { type: 'string', example: 'Güncellenmiş açıklama.' },
          description_en: { type: 'string', example: 'Updated description.' },
          description_de: { type: 'string', example: 'Updated description.' },
          description_ru: { type: 'string', example: 'Updated description.' },
          queue: { type: 'integer', example: 1 },
          isActive: { type: 'boolean', example: true },
        },
      },
      BlogResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Blog yazısı başarıyla oluşturuldu.' },
          data: { $ref: '#/components/schemas/BlogItem' },
        },
      },
      BlogListResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Blog yazıları başarıyla getirildi.' },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/BlogItem' },
          },
        },
      },
    },
  },
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Kullanıcı Girişi',
        description: 'E-posta ve şifre ile sisteme giriş yapar. Başarılı girişte Access ve Refresh Token döndürür, Refresh Token DB kaydedilir.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Giriş başarılı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          '401': {
            description: 'Hatalı e-posta veya şifre.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Token Yenileme',
        description: 'Veritabanında kayıtlı geçerli bir Refresh Token ile yeni Access Token üretir ve Refresh Token rotation gerçekleştirir.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Token başarıyla yenilendi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RefreshTokenResponse' },
              },
            },
          },
          '401': {
            description: 'Geçersiz veya süresi dolmuş refresh token.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Oturum Kapatma',
        description: 'Giriş yapmış kullanıcının veritabanındaki aktif Refresh Token bilgisini temizler ve oturumu sonlandırır.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Çıkış başarılı.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Çıkış başarılı.' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/about': {
      get: {
        tags: ['About'],
        summary: 'Tüm Hakkımda Bölümlerini Listele',
        description: 'Veritabanındaki tüm Hakkımda kayıtlarını listeler.',
        responses: {
          '200': {
            description: 'Hakkımda bölümleri başarıyla getirildi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AboutListResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['About'],
        summary: 'Hakkımda Oluştur',
        description: 'Yeni bir Hakkımda kaydı oluşturur. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateAboutRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Hakkımda bölümü başarıyla oluşturuldu.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AboutResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Bu işlem için yetkiniz bulunmamaktadır.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/about/{id}': {
      get: {
        tags: ['About'],
        summary: 'Hakkımda Detayını Getir',
        description: 'Belirtilen UUID parametresine sahip Hakkımda içerik detayını getirir.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Hakkımda kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Hakkımda bölümü başarıyla getirildi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AboutResponse' },
              },
            },
          },
          '404': {
            description: 'Hakkımda bölümü bulunamadı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['About'],
        summary: 'Hakkımda Güncelle',
        description: 'Belirtilen UUID kaydını günceller. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Hakkımda kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateAboutRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Hakkımda bölümü başarıyla güncellendi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AboutResponse' },
              },
            },
          },
          '400': {
            description: 'Geçersiz parametre.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Token bulunamadı veya geçersiz.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Bu işlem için yetkiniz bulunmamaktadır.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['About'],
        summary: 'Hakkımda Sil',
        description: 'Belirtilen UUID kaydını veritabanından siler. (Gerekli rol: super_admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Hakkımda kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Hakkımda bölümü başarıyla silindi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AboutResponse' },
              },
            },
          },
          '404': {
            description: 'Hakkımda bölümü bulunamadı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Bu işlem için yetkiniz bulunmamaktadır.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/skills': {
      get: {
        tags: ['Skills'],
        summary: 'Tüm Yetenekleri Listele',
        description: 'Veritabanındaki tüm Yetenek (Skills) kayıtlarını listeler.',
        responses: {
          '200': {
            description: 'Skills retrieved successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SkillListResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Skills'],
        summary: 'Yetenek Oluştur',
        description: 'Yeni bir Yetenek kaydı oluşturur. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateSkillRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Skill created successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SkillResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Bu işlem için yetkiniz bulunmamaktadır.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/skills/{id}': {
      get: {
        tags: ['Skills'],
        summary: 'Yetenek Detayını Getir',
        description: 'Belirtilen UUID parametresine sahip Yetenek kaydını getirir.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Yetenek kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Skill retrieved successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SkillResponse' },
              },
            },
          },
          '404': {
            description: 'Skill section not found.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Skills'],
        summary: 'Yetenek Güncelle',
        description: 'Belirtilen UUID kaydını günceller. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Yetenek kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateSkillRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Skill updated successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SkillResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid ID parameter.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Skill section not found.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Bu işlem için yetkiniz bulunmamaktadır.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Skills'],
        summary: 'Yetenek Sil',
        description: 'Belirtilen UUID kaydını veritabanından siler. (Gerekli rol: super_admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Yetenek kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Skill deleted successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SkillResponse' },
              },
            },
          },
          '404': {
            description: 'Skill section not found.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Bu işlem için yetkiniz bulunmamaktadır.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/images': {
      get: {
        tags: ['Images'],
        summary: 'Tüm Görselleri Listele',
        description: 'Veritabanındaki tüm görsel kayıtlarını listeler.',
        responses: {
          '200': {
            description: 'Görseller başarıyla getirildi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ImageListResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Images'],
        summary: 'Görsel Yükle ve Kaydet',
        description: '`multipart/form-data` ile görsel dosyasını yükler, WebP formatına çevirir ve veritabanına ekler. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Yüklenecek görsel dosyası (jpg, png, webp vb.)',
                  },
                  alt_text: { type: 'string', example: 'Profil resmi' },
                  blogId: { type: 'string', format: 'uuid', description: 'Varsa ilişkili Blog UUID değeri' },
                  queue: { type: 'integer', example: 0 },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Görsel başarıyla yüklendi ve WebP formatına dönüştürüldü.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ImageResponse' },
              },
            },
          },
          '400': {
            description: 'Geçersiz istek veya görsel yüklenmedi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Bu işlem için yetkiniz bulunmamaktadır.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/images/{id}': {
      get: {
        tags: ['Images'],
        summary: 'Görsel Detayını Getir',
        description: 'UUID değerine göre görsel detayını getirir.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Görsel kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Görsel başarıyla getirildi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ImageResponse' },
              },
            },
          },
          '404': {
            description: 'Görsel bulunamadı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Images'],
        summary: 'Görsel Bilgilerini Güncelle',
        description: 'Görselin alt_text, isActive, queue veya blogId bilgilerini günceller. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Görsel kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateImageRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Görsel başarıyla güncellendi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ImageResponse' },
              },
            },
          },
          '404': {
            description: 'Görsel bulunamadı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Images'],
        summary: 'Görsel ve Dosyayı Sil',
        description: 'Görseli veritabanından ve diskten (uploads/) siler. (Gerekli rol: super_admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Görsel kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Görsel ve fiziksel dosya başarıyla silindi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ImageResponse' },
              },
            },
          },
          '404': {
            description: 'Görsel bulunamadı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/projects': {
      get: {
        tags: ['Projects'],
        summary: 'Tüm Projeleri Listele',
        description: 'Veritabanındaki tüm proje kayıtlarını listeler.',
        responses: {
          '200': {
            description: 'Projects retrieved successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProjectListResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Projects'],
        summary: 'Proje Oluştur',
        description: 'Yeni bir proje kaydı oluşturur. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProjectRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Project created successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProjectResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Bu işlem için yetkiniz bulunmamaktadır.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Proje Detayını Getir',
        description: 'Belirtilen UUID parametresine sahip Proje detayını getirir.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Proje kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Project retrieved successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProjectResponse' },
              },
            },
          },
          '404': {
            description: 'Project not found.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Projects'],
        summary: 'Proje Güncelle',
        description: 'Belirtilen UUID kaydını günceller. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Proje kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProjectRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Project updated successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProjectResponse' },
              },
            },
          },
          '404': {
            description: 'Project not found.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Projects'],
        summary: 'Proje Sil',
        description: 'Belirtilen UUID kaydını veritabanından siler. (Gerekli rol: super_admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Proje kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Project deleted successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProjectResponse' },
              },
            },
          },
          '404': {
            description: 'Project not found.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/blogs': {
      get: {
        tags: ['Blogs'],
        summary: 'Tüm Blog Yazılarını Listele',
        description: 'Veritabanındaki tüm blog yazılarını listeler.',
        responses: {
          '200': {
            description: 'Blog yazıları başarıyla getirildi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BlogListResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Blogs'],
        summary: 'Blog Yazısı Oluştur',
        description: 'Yeni bir blog yazısı kaydı oluşturur. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateBlogRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Blog yazısı başarıyla oluşturuldu.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BlogResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Bu işlem için yetkiniz bulunmamaktadır.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/blogs/{id}': {
      get: {
        tags: ['Blogs'],
        summary: 'Blog Yazısı Detayını Getir',
        description: 'Belirtilen UUID parametresine sahip Blog yazısını getirir ve görüntülenme sayısını 1 artırır.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Blog kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Blog yazısı başarıyla getirildi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BlogResponse' },
              },
            },
          },
          '404': {
            description: 'Blog yazısı bulunamadı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Blogs'],
        summary: 'Blog Yazısını Güncelle',
        description: 'Belirtilen UUID kaydını günceller. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Blog kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateBlogRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Blog yazısı başarıyla güncellendi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BlogResponse' },
              },
            },
          },
          '404': {
            description: 'Blog yazısı bulunamadı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Blogs'],
        summary: 'Blog Yazısını Sil',
        description: 'Belirtilen UUID kaydını veritabanından siler. (Gerekli rol: super_admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Blog kaydının UUID değeri',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Blog yazısı başarıyla silindi.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BlogResponse' },
              },
            },
          },
          '404': {
            description: 'Blog yazısı bulunamadı.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Yetkisiz erişim.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/analytics/overview': {
      get: {
        tags: ['Analytics'],
        summary: 'Genel İstatistik Özeti',
        description: 'Toplam ziyaretçi sayısı, sayfa görüntüleme, blog okuma ve paylaşma sayılarını verir. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Genel istatistik özeti getirildi.',
          },
          '401': {
            description: 'Yetkisiz erişim.',
          },
        },
      },
    },
    '/api/analytics/pages': {
      get: {
        tags: ['Analytics'],
        summary: 'Sayfa Görüntüleme İstatistikleri',
        description: 'Hangi sayfanın kaç kere ziyaret edildiği istatistiklerini verir. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Sayfa görüntüleme istatistikleri getirildi.',
          },
          '401': {
            description: 'Yetkisiz erişim.',
          },
        },
      },
    },
    '/api/analytics/cities': {
      get: {
        tags: ['Analytics'],
        summary: 'Şehir ve Ülke Bazlı Ziyaretçi İstatistikleri',
        description: 'Ziyaretçilerin hangi şehir ve ülkelerden girdiğini raporlar. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Şehir bazlı ziyaretçi istatistikleri getirildi.',
          },
          '401': {
            description: 'Yetkisiz erişim.',
          },
        },
      },
    },
    '/api/analytics/blogs': {
      get: {
        tags: ['Analytics'],
        summary: 'Blog Okuma ve Paylaşma İstatistikleri',
        description: 'Blog yazılarının kaç kere okunduğunu ve kaç kere paylaşıldığını raporlar. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Blog okuma ve paylaşma istatistikleri getirildi.',
          },
          '401': {
            description: 'Yetkisiz erişim.',
          },
        },
      },
    },
    '/api/analytics/visitors': {
      get: {
        tags: ['Analytics'],
        summary: 'Son Ziyaretçilerin Günlüğü',
        description: 'Siteye giren ziyaretçilerin IP, şehir, ziyaret sayısı ve zaman damgası günlüğünü getirir. (Gerekli rol: super_admin veya admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            required: false,
            description: 'Getirilecek kayıt sayısı (Varsayılan 50)',
            schema: { type: 'integer', example: 50 },
          },
        ],
        responses: {
          '200': {
            description: 'Son ziyaretçilerin verileri getirildi.',
          },
          '401': {
            description: 'Yetkisiz erişim.',
          },
        },
      },
    },
  },
};
