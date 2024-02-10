const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOLE_CLIENT_SECRET,
  // redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Create a new calender instance.
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// Create a new event start date instance for temp uses in our calendar.
const eventStartTime = new Date();
eventStartTime.setDate(eventStartTime.getDay() + 2);

// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date();
eventEndTime.setDate(eventEndTime.getDay() + 2);
eventEndTime.setMinutes(eventEndTime.getMinutes() + 60);

// Create a dummy event for temp uses in our calendar
const event = {
  summary: `Summary`,
  description: `Description`,
  colorId: 6,
  start: {
    dateTime: eventStartTime,
  },
  end: {
    dateTime: eventEndTime,
  },
};

calendar.events.insert({ calendarId: "primary", resource: event }, (err) => {
  // Check for errors and log them if they exist.
  if (err) return console.error("Error Creating Calender Event:", err);
  // Else log that the event was created.
  return console.log("Event created successfully.");
});
