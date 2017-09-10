module.exports = {
  apps: [{
    name: 'latergram',
    ignore_watch: [
      'node_modules',
      'mongo_data',
      'tmp',
      '.gitignore',
      '.git',
    ],
    script: './bin/www',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};
