module.exports = {
  apps: [
    {
      name: 'denizsevinc-backend',
      script: 'npx',
      args: 'tsx src/index.ts',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        BACKEND_PORT: 2006
      }
    },
    {
      name: 'denizsevinc-frontend',
      script: 'node',
      args: 'server.js',
      cwd: './frontend/dist/standalone',
      env: {
        NODE_ENV: 'production',
        PORT: 3015,
        HOSTNAME: '127.0.0.1'
      }
    }
  ]
};
