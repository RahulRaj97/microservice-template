module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./src",
  verbose: true,
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  }
}
