// const passport = require("passport")
// const FacebookStrategy = require("passport-facebook").Strategy
// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_APP_ID,
//     clientSecret: FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:3000/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, profile, documentation) {
//     // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//     //   return cb(err, user);
//     // });
//     done(null, profile);
//   }
// ));


// passport.serializeUser((user, done) => {
//     console.log("user is serialize", user)
//     done(null, user)
// })

// passport.deserializeUser((user, done) => {
//     console.log("user is decerialize ", user)
//     done(null, user)
// })