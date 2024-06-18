const maximumTokenAge = 30 * 24 * 60 * 60;

module.exports = {
  TOKEN_COOKIE_NAME: "candidaceToken",
  TOKEN_MAX_AGE: maximumTokenAge,
  COOKIE_OPTIONS: {
    httpOnly: true,
    maxAge: maximumTokenAge * 1000,
    // domain: 'candidace.fyi', // for using same cookie in different application
  },
};
