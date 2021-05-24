module.exports = {
  // Run type-check on changes to TypeScript files
  '**/*.ts?(x)': () => 'yarn tsc',
  // Run ESLint on changes to JavaScript/TypeScript files
  '**/*.(ts)?(x)': (filenames) => `yarn lint ${filenames.join(' ')}`,
};
