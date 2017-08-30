module.exports = {
  apps: [{
    name: 'latergram',
    script: './bin/www',
    env: {
      NODE_ENV: 'development',
      COMMON_VARIABLE: 'true'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
