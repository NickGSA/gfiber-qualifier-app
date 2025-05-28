// craco.config.js
const tailwindcss = require('@tailwindcss/postcss'); // <--- CHANGED HERE!
const autoprefixer = require('autoprefixer');

module.exports = {
  style: {
    postcss: {
      mode: 'extends',
      loaderOptions: {
        postcssOptions: {
          ident: 'postcss',
          plugins: [
            tailwindcss('./tailwind.config.js'),
            autoprefixer,
          ],
        },
      },
    },
  },
};
