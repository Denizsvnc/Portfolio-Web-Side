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
  },
};
