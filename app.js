require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const axios = require("axios");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Weather schema
const weatherSchema = new mongoose.Schema({
    name: String,
    email: String,
    location: String,
});
const Weather = mongoose.model("weather", weatherSchema);

// Middleware
app.use(express.static("Subscribe"));
app.use(express.static("Subscribe/Public"));
app.use(express.static("Subscribe/Public/Images"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.get("/Subscribe/subscribe.html", (req, res) => {
    res.sendFile(__dirname + "/Subscribe/subscribe.html");
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Cron job for daily emails
cron.schedule("53 18 * * *", async () => {
    try {
        const weatherData = await Weather.find().exec();
        console.log(weatherData);

        for (const weather of weatherData) {
            const { name, email, location } = weather;
            const url = `https://api.weatherapi.com/v1/forecast.json?q=${location}&key=${process.env.WEATHER_API_KEY}`;

            const response = await axios.get(url);
            const wData = response.data;

            // Simplify hourly data handling using map
            const hours = wData.forecast.forecastday[0].hour.map(
                (h, index) => `The Temperature at ${index}:00 is ${h.temp_c}°C. Condition: ${h.condition.text}`
            );

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Weather Wise Forecast",
                text: `Weather forecast for today in ${location}:\n\n${hours.join("\n")}`,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent:", info.response);
        }
    } catch (error) {
        console.log("Error sending email:", error);
    }
});

// Subscribe route
app.post("/subscribe", async (req, res) => {
    const { place, nam, emai } = req.body;

    const details = new Weather({
        name: nam,
        email: emai,
        location: place,
    });

    await details.save();
    res.send("<h1>You have subscribed to Weather Wise!</h1>");
});

// Get weather route
app.post("/", async (req, res) => {
    const location = req.body.location;
    const url = `https://api.weatherapi.com/v1/current.json?q=${location}&key=${process.env.WEATHER_API_KEY}`;

    try {
        const response = await axios.get(url);
        const weatherData = response.data;

        const temp = weatherData.current.temp_c;
        const condition = weatherData.current.condition.text;
        const feels = weatherData.current.feelslike_c;
        const humidity = weatherData.current.humidity;
        const clouds = weatherData.current.cloud;

        res.write(`<h1>The temperature in ${location} is ${temp}°C</h1>`);
        res.write(`<h2>Current condition: ${condition}</h2>`);
        res.write(`<h2>Feels like: ${feels}°C</h2>`);
        res.write(`<h2>Humidity: ${humidity}%</h2>`);
        res.write(`<h2>Clouds: ${clouds}</h2>`);
        res.send();
    } catch (error) {
        console.log("Error fetching weather data:", error);
        res.send("<h1>Error fetching weather data.</h1>");
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
