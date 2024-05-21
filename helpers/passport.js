const passport = require("passport");
const { User } = require("../models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../keys.json");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.web.client_id,
      clientSecret: keys.web.client_secret,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            userName: profile.displayName,
            // Add any other fields you need from the profile object
          });

          // Perform any additional setup (e.g., _createToken, _updateUserProfile)
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
