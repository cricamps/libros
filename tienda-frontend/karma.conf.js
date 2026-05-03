// Karma configuration file
// See link for more information: https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // Opcional: configuración adicional de jasmine
      },
      clearContext: false // Mantiene el Jasmine Spec Runner en el navegador
    },
    jasmineHtmlReporter: {
      suppressAll: true // Elimina los reportes duplicados
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/tienda-frontend'),
      subdir: '.',
      reporters: [
        { type: 'html' },       // Para ver en navegador
        { type: 'text-summary' }, // Resumen en consola
        { type: 'lcov' }        // Para SonarQube
      ]
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
