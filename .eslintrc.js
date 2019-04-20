module.exports = {
  extends: 'airbnb-base',
  plugins: ['prettier'],
  overrides: [
    {
      files: ['test/*.test.js'],
      env: {
        jest: true,
      },
      plugins: ['jest'],
    },
  ],
};
