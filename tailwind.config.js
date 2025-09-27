const sharedConfig = require('../tailwind.config.js');

module.exports = {
  ...sharedConfig,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../shared/**/*.{js,ts,jsx,tsx}',
  ],
};
