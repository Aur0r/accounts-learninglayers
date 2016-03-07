Template.configureLoginServiceDialogForLearninglayers.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl({replaceLocalhost: true});
  }
});

Template.configureLoginServiceDialogForLearninglayers.fields = function () {
  return [
    {property: 'clientId', label: 'Client ID'},
    {property: 'secret', label: 'Client Secret'}
  ];
};