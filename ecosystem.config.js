module.exports = {
  apps: [
    {
      name: 'denizsevinc-backend',
      script: 'npm',
      args: 'start',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        BACKEND_PORT: 3005
      }
    },
    {
      name: 'denizsevinc-frontend',
      script: 'node',
      args: 'server.js', // Standalone build olduğu için server.js çalıştırılacak
      cwd: './frontend/dist/standalone', // next.config.ts'te distDir: 'dist' ayarlandığı için dist/standalone klasörü kullanılır
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1' // Sadece localhost'tan erişilsin (Nginx dışarı açacak)
      }
    }
  ]
};
