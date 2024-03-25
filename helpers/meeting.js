const axios = require("axios");
const { google } = require("googleapis");
const fs = require("fs");
const {
  generateOAuthURL,
  createOAuthClient,
  getAccessTokenFromRefreshToken,
} = require("./oAuth");
const { sendMeetingEmail } = require("./emailMeeting");

const TOKEN_PATH = "./token.json";

const getMeetingAuthentication = async () => {
  try {
    const tokenContent = await fs.promises.readFile(TOKEN_PATH);
    const parsedToken = JSON.parse(tokenContent);
    const oAuthClient = await createOAuthClient();
    oAuthClient.setCredentials(parsedToken);
    return oAuthClient;
  } catch (err) {
    if (err.code === "ENOENT") {
      const oAuthUrl = await generateOAuthURL();
      return { redirect: true, redirectUrl: oAuthUrl };
    } else {
      console.error("Error loading token file:", err);
      throw err;
    }
  }
};

const performMeetingInsert = async (event) => {
  const auth = await getMeetingAuthentication();
  if (auth.redirect)
    return { created: false, redirect: true, redirectUrl: auth.redirectUrl };

  const calendar = google.calendar({
    version: "v3",
    auth,
  });

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });
    return {
      created: true,
      eventLink: response.data.htmlLink,
      meetLink: response.data.hangoutLink,
    };
  } catch (err) {
    return err;
  }
};

const createEvent = async (
  initiator,
  acceptor,
  availabilityData,
  meetingProps
) => {
  const dayHour = parseInt(availabilityData.dayHour);
  const startTimeUnix = new Date(dayHour);
  const endTimeUnix = new Date(dayHour + 1 * 3600 * 1000);
  const startTime = new Date(startTimeUnix).toISOString();
  const endTime = new Date(endTimeUnix).toISOString();

  const event = {
    summary: "Meet Prep Meeting",
    location: "Google Meet",
    description: await sendMeetingEmail(meetingProps),
    start: {
      dateTime: startTime,
    },
    end: {
      dateTime: endTime,
    },
    attendees: [{ email: initiator }, { email: acceptor }],
  };
  const insertResponse = await performMeetingInsert(event);
  if (insertResponse.message === "Invalid Credentials") {
    await getAccessTokenFromRefreshToken();
    return performMeetingInsert(event);
  } else return insertResponse;
};

const createMeeting = async () => {
  try {
    const response = await axios.post(
      "https://sfu.mirotalk.com/api/v1/meeting",
      {},
      {
        headers: {
          Authorization: "mirotalksfu_default_secret",
        },
      }
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

module.exports = {
  createMeeting,
  createEvent,
};
