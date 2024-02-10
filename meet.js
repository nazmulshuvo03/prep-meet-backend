const { google } = require("googleapis");
const fs = require("fs");
const readline = require("readline");

const TOKEN_PATH = "./token.json";
const CLIENTS_SECRET_FILE_PATH = "./keys.json";

fs.readFile(CLIENTS_SECRET_FILE_PATH, (err, content) => {
  if (err) return console.error("Error loading client secret file:", err);
  authorize(JSON.parse(content), createEvents);
});

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    const parsedToken = JSON.parse(token);
    if (parsedToken.expiry_date <= new Date().getTime())
      return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(parsedToken);
    callback(oAuth2Client);
  });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });
  console.log("Auth URL: ", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function listEvents(auth) {
  const calendar = google.calendar({ version: "v3", auth });
  calendar.events.list(
    {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, res) => {
      if (err) return console.error("The API returned an error:", err);
      const events = res.data.items;
      if (events.length) {
        console.log("Upcoming 10 events:");
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log("No upcoming events found.");
      }
    }
  );
}

function createEvents(auth) {
  const calendar = google.calendar({ version: "v3", auth: auth });

  const startTime = new Date();
  const endUTC = startTime.getTime() + 2 * 3600 * 1000;
  const endTime = new Date(endUTC);

  const event = {
    summary: "Meeting Title",
    location: "Google Meet Link",
    description: "Description of the meeting",
    start: {
      dateTime: startTime,
      // timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: endTime,
      // timeZone: "America/Los_Angeles",
    },
    attendees: [
      { email: "nazmulshuvo03@gmail.com" },
      { email: "attendee2@example.com" },
    ],
    source: {
      title: "Meet Prep",
      url: "https://www.meetprep.com",
    },
    // reminders: {
    //   useDefault: false,
    //   overrides: [
    //     { method: "email", minutes: 24 * 60 },
    //     { method: "popup", minutes: 10 },
    //   ],
    // },
    conferenceData: {
      createRequest: {
        requestId: "random-string-123", // Provide a unique request ID
      },
    },
  };

  calendar.events.insert(
    {
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
      // sendNotifications: true,
      sendUpdates: "all",
    },
    (err, res) => {
      if (err) {
        console.error("Error creating event:", err);
        return;
      }
      console.log("Event created: %s", res.data.htmlLink);
    }
  );
}

function checkFreeBusy(auth) {
  const calendar = google.calendar({ version: "v3", auth: auth });
  calendar.freebusy.query(
    {
      resource: {
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        items: [{ id: "primary" }],
      },
    },
    (err, res) => {
      // Check for errors in our query and log them if they exist.
      if (err) return console.error("Free Busy Query Error: ", err);

      // Create an array of all events on our calendar during that time.
      const eventArr = res.data.calendars.primary.busy;

      // Check if event array is empty which means we are not busy
      if (eventArr.length === 0) {
        createEvents(auth);
      }
      // If event array is not empty log that we are busy.
      return console.log(`Sorry I'm busy for that time...`);
    }
  );
}
