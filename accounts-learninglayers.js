Accounts.oauth.registerService('learninglayers');

if (Meteor.isClient) {
  Learninglayers = {};

  // Request Learninglayers credentials for the user
  // @param options {optional}
  // @param credentialRequestCompleteCallback {Function} Callback function to call on
  //   completion. Takes one argument, credentialToken on success, or Error on
  //   error.
  Learninglayers.requestCredential = function (options, credentialRequestCompleteCallback) {
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
      credentialRequestCompleteCallback = options;
      options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({service: 'learninglayers'});
    if (!config) {
      credentialRequestCompleteCallback && credentialRequestCompleteCallback(
        new ServiceConfiguration.ConfigError());
      return;
    }

    var credentialToken = Random.secret();

    var loginStyle = OAuth._loginStyle('learninglayers', config, options);

    var loginUrl =
      'https://api.learning-layers.eu/o/oauth2/authorize' +
      '?response_type=code' +
      '&client_id=' + config.clientId +
      '&redirect_uri=' + OAuth._redirectUri('learninglayers', config) +
      '&state=' + OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl); //, null, {replaceLocalhost: true}

    OAuth.launchLogin({
      loginService: "learninglayers",
      loginStyle: loginStyle,
      loginUrl: loginUrl,
      credentialRequestCompleteCallback: credentialRequestCompleteCallback,
      credentialToken: credentialToken
    });
  };

  Meteor.loginWithLearninglayers = function(options, callback) {
    // support a callback without options
    if (! callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Learninglayers.requestCredential(options, credentialRequestCompleteCallback);
  };
} else if (Meteor.isServer) {
  Learninglayers = {};

  OAuth.registerService('learninglayers', 2, null, function(query) {

    var accessToken = getAccessToken(query);
    var identity = getIdentity(accessToken);
    //console.log(identity);
    //var emails = getEmails(accessToken);
    //var primaryEmail = _.findWhere(emails, {primary: true});

    return {
      serviceData: {
        id: identity.sub,
        accessToken: OAuth.sealSecret(accessToken),
        email: identity.email,
        username: identity.preferred_username || identity.name,
        emails: [{address: identity.email, verified: identity.email_verified}]
      },
      options: {profile: {name: identity.name}}
    };
  });

  var userAgent = "Meteor";
  if (Meteor.release) {
    userAgent += "/" + Meteor.release;
  }

  var getAccessToken = function (query) {
    var config = ServiceConfiguration.configurations.findOne({service: 'learninglayers'});
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    var options = {
      headers: {
        Accept: 'application/json',
        "User-Agent": userAgent,
        Authorization: "Bearer " + query.state
      },
      params: {
        grant_type: "authorization_code",
        code: query.code,
        client_id: config.clientId,
        client_secret: OAuth.openSecret(config.secret),
        redirect_uri: OAuth._redirectUri('learninglayers', config) //, null, {replaceLocalhost: true}
      }
    };

    var response;
    try {
      response = HTTP.post(
        "https://api.learning-layers.eu/o/oauth2/token", options);
    } catch (err) {
      throw _.extend(new Error("Failed to complete OAuth handshake with LearningLayers. " + err.message),
        {response: err.response});
    }
    if (response.data.error) { // if the http response was a json object with an error attribute
      throw new Error("Failed to complete OAuth handshake with LearningLayers. " + response.data.error);
    } else {
      return response.data.access_token;
    }
  };

  var getIdentity = function (accessToken) {
    try {
      return HTTP.get(
        "https://api.learning-layers.eu/o/oauth2/userinfo", {
          headers: {
            "User-Agent": userAgent,
            Authorization: "Bearer " + accessToken
          }
        }).data;
    } catch (err) {
      throw _.extend(new Error("Failed to fetch identity from LearningLayers. " + err.message),
        {response: err.response});
    }
  };

  /*var getEmails = function (accessToken) {
    try {
      return HTTP.get(
        "https://api.learning-layers.eu/o/oauth2/userinfo/emails", {
          headers: {"User-Agent": userAgent},
          params: {access_token: accessToken}
        }).data;
    } catch (err) {
      return [];
    }
  };*/

  Learninglayers.retrieveCredential = function(credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
  };

  Accounts.addAutopublishFields({
    forLoggedInUser: ['services.learninglayers'],
    forOtherUsers: ['services.learninglayers.username']
  });
}
