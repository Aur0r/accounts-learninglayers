Package.describe({
  name: 'aur0r:accounts-learninglayers',
  version: '0.0.8',
  summary: 'Login service for LearningLayers accounts',
  git: 'https://github.com/Aur0r/accounts-learninglayers',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);
  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);

  api.export('Learninglayers');

  api.addFiles('learninglayers_login_button.css', 'client');

  api.addFiles(['learninglayers_configure.html', 'learninglayers_configure.js'], 'client');
  api.addFiles('accounts-learninglayers.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('aur0r:accounts-learninglayers');
  api.addFiles('accounts-learninglayers-tests.js');
});
