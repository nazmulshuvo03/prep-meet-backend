const { google } = require("googleapis");
const fs = require("fs");
const { generateOAuthURL, createOAuthClient } = require("./oAuth");

const TOKEN_PATH = "./token.json";
const REFRESH_TOKEN_PATH = "./refresh_token.json";

const getMeetingAuthentication = async () => {
  try {
    const tokenContent = await fs.promises.readFile(TOKEN_PATH);
    const parsedToken = JSON.parse(tokenContent);
    const oAuthClient = await createOAuthClient();
    oAuthClient.setCredentials(parsedToken);
    return oAuthClient;
  } catch (err) {
    if (err.code === "ENOENT") {
      // Check if file not found error
      const oAuthUrl = await generateOAuthURL();
      return { redirect: true, redirectUrl: oAuthUrl };
    } else {
      console.error("Error loading token file:", err);
      throw err;
    }
  }
};

const createMeeting = async (initiator, acceptor, timeData) => {
  const auth = await getMeetingAuthentication();
  if (auth.redirect)
    return { created: false, redirect: true, redirectUrl: auth.redirectUrl };

  try {
    const calendar = google.calendar({
      version: "v3",
      auth,
    });

    const dayHour = parseInt(timeData.dayHour);
    const startTime = new Date(dayHour);
    const endTime = new Date(dayHour + 1 * 3600 * 1000);

    const event = {
      summary: "Meet Prep Meeting",
      location: "Google Meet",
      description: "Talk about the topics that you have prepared for",
      start: {
        dateTime: startTime,
      },
      end: {
        dateTime: endTime,
      },
      attendees: [{ email: initiator }, { email: acceptor }],
      conferenceData: {
        createRequest: {
          requestId: timeData.id,
        },
      },
    };
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });
    console.log("Meet response: ", response.data);
    return {
      created: true,
      eventLink: response.data.htmlLink,
      meetLink: response.data.hangoutLink,
    };
  } catch (err) {
    console.log("Error: ", err.message);
    return { created: false, redirect: false, message: err.message };
  }
};

module.exports = {
  createMeeting,
};
