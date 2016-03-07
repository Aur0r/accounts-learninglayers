Package.describe({
  name: 'aur0r:accounts-learninglayers',
  version: '0.0.6',
  // Brief, one-line summary of the package.
  summary: 'Login service for LearningLayers accounts',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
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
