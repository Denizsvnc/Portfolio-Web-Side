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
      args: 'server.js',
      cwd: './frontend/dist/standalone',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1'
      }
    }
  ]
};
