A simple [Passport](http://passportjs.org/) strategy for Zoom OAuth2.

## Install

npm install @giorgosavgeris/passport-zoom-oauth2

## Usage

### Register the strategy

```javascript
var ZoomStrategy = require('@giorgosavgeris/passport-zoom-oauth2').Strategy;

passport.use(new ZoomStrategy({
    clientID: ZOOM_CLIENT_ID,
    clientSecret: ZOOM_CLIENT_SECRET,
    callbackURL: 'https://www.example.net/oauth/zoom/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function (err, user) {
      done(err, user);
    });
  }
));
```

### Authenticate requests

```javascript
app.get('/auth/zoom', passport.authenticate('zoom', { state: 'pass_state_here' }));

app.get(
  '/auth/zoom/callback',
  passport.authenticate('zoom', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    res.redirect('/');
  }
);
```

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
