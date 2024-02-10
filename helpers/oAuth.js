const axios = require("axios");
const { google } = require("googleapis");
const fs = require("fs");
const keys = require("../keys.json");

const CLIENTS_SECRET_FILE_PATH = "./keys.json";
const TOKEN_PATH = "./token.json";
const REFRESH_TOKEN_PATH = "./refresh_token.json";

const redirectToOAuthURL = () => {
  fs.readFile(CLIENTS_SECRET_FILE_PATH, (err, content) => {
    if (err) return console.error("Error loading client secret file:", err);
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar"],
    });
    console.log("Auth URL: ", authUrl);
    res.redirect(authUrl);
  });
};

const getAccessTokenFromAuth = (authCode) => {
  const data = {
    code: authCode,
    client_id: keys.web.client_id,
    client_secret: keys.web.client_secret,
    redirect_uri: keys.web.redirect_uris[0],
    grant_type: "authorization_code",
  };

  axios
    .post("https://oauth2.googleapis.com/token", data)
    .then((response) => {
      const token = response.data;
      console.log("Token data: ", token);
      const refresh_token = token.refresh_token;
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      fs.writeFile(
        REFRESH_TOKEN_PATH,
        JSON.stringify({ refresh_token }),
        (err) => {
          if (err) return console.error(err);
          console.log("Refresh Token stored to", REFRESH_TOKEN_PATH);
        }
      );
    })
    .catch((error) => {
      console.error("Error:", error.response.data);
    });
};

const getAccessTokenFromRefreshToken = () => {
  const ref_token = require("../refresh_token.json");
  const data = {
    client_id: keys.web.client_id,
    client_secret: keys.web.client_secret,
    refresh_token: ref_token.refresh_token,
    grant_type: "refresh_token",
  };

  axios
    .post("https://oauth2.googleapis.com/token", data)
    .then((response) => {
      const token = response.data;
      console.log("Token data: ", token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
    })
    .catch((error) => {
      console.error("Error:", error.response.data);
    });
};

module.exports = {
  redirectToOAuthURL,
  getAccessTokenFromAuth,
  getAccessTokenFromRefreshToken,
};
