var util = require("util");
var OAuth2Strategy = require("passport-oauth2");
var InternalOAuthError = require("passport-oauth2").InternalOAuthError;
var Profile = require("./profile");

/**
 * `Strategy` constructor.
 *
 * Options:
 *   - `clientID`      Zoom application's App ID
 *   - `clientSecret`  Zoom application's App Secret
 *   - `callbackURL`   URL to which Zoom will redirect the user after granting authorization
 *
 * Examples:
 *
 *   passport.use(new ZoomStrategy({
 *       clientID: ZOOM_CLIENT_ID,
 *       clientSecret: ZOOM_CLIENT_SECRET,
 *       callbackURL: 'https://www.example.net/oauth/zoom/callback'
 *     },
 *     function(accessToken, refreshToken, profile, done) {
 *       User.findOrCreate(..., function (err, user) {
 *         done(err, user);
 *       });
 *     }
 *   ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
  options = options || {};

  options.authorizationURL = options.authorizationURL || "https://zoom.us/oauth/authorize";
  options.tokenURL = options.tokenURL || "https://zoom.us/oauth/token";

  OAuth2Strategy.call(this, options, verify);

  this.name = "zoom";
  this.options = options;
  this._profileUrl = options.profileUrl || "https://api.zoom.us/v2/users/me";
  // Use access_token in the ‘Authorization’ header for the request
  this._oauth2.useAuthorizationHeaderforGET(true);
}

// Inherit from `OAuth2Strategy`
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Zoom.
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._profileUrl, accessToken, function(err, body, res) {
    var json;

    if (err) {
      return done(new InternalOAuthError("Failed to fetch user profile", err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error("Failed to parse user profile"));
    }

    var profile = Profile.parse(json);

    profile.provider = "zoom";
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};

module.exports = Strategy;
