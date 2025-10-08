require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const axios = require("axios");

const app = express();

// ✅ 1. Database connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ 2. Schema & Model
const weatherSchema = new mongoose.Schema({
  name: String,
  email: String,
  location: String,
});
const Weather = mongoose.model("weather", weatherSchema);

// ✅ 3. Middleware
app.use(express.static("Subscribe"));
app.use(express.static("Subscribe/Public"));
app.use(express.static("Subscribe/Public/Images"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ 4. Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/Subscribe/subscribe.html", (req, res) => {
  res.sendFile(__dirname + "/Subscribe/subscribe.html");
});

// ✅ 5. Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wiseweather3@gmail.com",
    pass: "qziieikmnewvkrxn",
  },
});

// ✅ 6. CRON JOB (runs every minute — change to once/day later)
cron.schedule("*/1 * * * *", async () => {
  console.log("⏰ Cron job triggered...");

  try {
    const weatherData = await Weather.find().exec();
    console.log("Fetched users:", weatherData.length);

    for (const entry of weatherData) {
      const { name, email, location } = entry;

      // ❌ WRONG: ur1 → ✅ FIXED: url1 + backticks
      const url1 = `https://api.weatherapi.com/v1/forecast.json?q=${location}&key=827cded53f444a9d903102400250810`;

      const response = await axios.get(url1);
      const wData = response.data;

      // Get temperatures & conditions for all 24 hours dynamically ✅
      const hourly = wData.forecast.forecastday[0].hour;
      let report = `Hello ${name},\n\nWeather forecast for today in ${location}:\n\n`;

      for (let i = 0; i < 24; i++) {
        report += `🕐 ${i}:00 → ${hourly[i].temp_c}°C, ${hourly[i].condition.text}\n`;
      }

      const mailOptions = {
        from: "wiseweather3@gmail.com",
        to: email,
        subject: "🌤 Weather Wise Forecast",
        text: report,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent to:", email, info.response);
    }
  } catch (error) {
    console.error("❌ Error in cron job:", error.message);
    if (error.response) console.error("Response:", error.response.data);
  }
});

// ✅ 7. Subscribe route
app.post("/subscribe", async (req, res) => {
  const { place, nam, emai } = req.body;

  console.log("New subscription:", nam, emai, place);

  const details = new Weather({
    name: nam,
    email: emai,
    location: place,
  });

  await details.save();
  res.send("<h1>You have subscribed to Weather Wise!</h1>");
});

// ✅ 8. Weather lookup route
app.post("/", async (req, res) => {
  const location = req.body.location;
  const url = `https://api.weatherapi.com/v1/current.json?q=${location}&key=827cded53f444a9d903102400250810`;

  try {
    const response = await axios.get(url);
    const weatherData = response.data;
    const { temp_c, condition, feelslike_c, humidity, cloud } = weatherData.current;

    res.write(`<h1>The temperature in ${location} is ${temp_c}°C</h1>`);
    res.write(`<h2>Condition: ${condition.text}</h2>`);
    res.write(`<h2>Feels like: ${feelslike_c}°C</h2>`);
    res.write(`<h2>Humidity: ${humidity}%</h2>`);
    res.write(`<h2>Clouds: ${cloud}</h2>`);
    res.send();
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  }
});

// ✅ 9. Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌍 Server running on port ${PORT}`));
