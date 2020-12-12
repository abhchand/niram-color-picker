// See: jestjs.io/docs/configuration.html
module.exports = {
  rootDir: '../..',
  roots: ['src/js', 'test/js'],
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules', 'src', 'test'],
  restoreMocks: true,
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/test/js/jest.setup.js'],
  transform: {
    '\\.jsx?$': 'babel-jest'
  },
  verbose: false
};
