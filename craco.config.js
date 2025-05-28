// craco.config.js
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  style: {
    postcss: {
      mode: 'extends', // This tells CRACO to extend React-scripts' internal PostCSS config
      loaderOptions: {
        postcssOptions: {
          ident: 'postcss',
          plugins: [
            tailwindcss('./tailwind.config.js'), // Explicitly pass tailwind.config.js path
            autoprefixer,
          ],
        },
      },
    },
  },
};
