// This requires login; which mean OAuth2

const { google } = require("googleapis");

const calendar = google.calendar({
  version: "v3",
  auth: "AIzaSyAZ97yqZcTBMAnpQ9m4uDbxcqglUPeJiQ8",
});

const event = {
  summary: "Sample Event",
  start: {
    dateTime: "2024-02-10T10:00:00",
    timeZone: "YOUR_TIMEZONE",
  },
  end: {
    dateTime: "2024-02-10T11:00:00",
    timeZone: "YOUR_TIMEZONE",
  },
};

calendar.events.insert(
  {
    calendarId: "primary",
    resource: event,
  },
  (err, res) => {
    if (err) {
      console.error("Error creating calendar event:", err);
      return;
    }
    console.log("Calendar event created:", res.data);
  }
);
