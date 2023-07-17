require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const mongoose=require("mongoose");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const axios=require("axios");


const app=express();
mongoose.connect(process.env.MONGO_URL);
const weatherschema=new mongoose.Schema(
    {
        name:String,
        email: String,
        location: String
    }
);
const weather = mongoose.model("weather",weatherschema);


app.use(express.static("Subscribe"));
app.use(express.static("Subscribe/Public"));
app.use(express.static("Subscribe/Public/Images"));

app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/index.html");
})
app.get("/Subscribe/subscribe.html",function(req,res)
{
    res.sendFile(__dirname+"/Subscribe/subscribe.html");
})



const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'Gmail', 'Outlook'
    auth: {
      user: 'wiseweather3@gmail.com',
      pass: 'qziieikmnewvkrxn'
    }
});






cron.schedule("53 18 * * *", async () => {
    try {
      const weatherData = await weather.find().exec();
        console.log(weatherData);
      for (const weather of weatherData) {
        const { name, email, location } = weather;
        const ur1 = `https://api.weatherapi.com/v1/forecast.json?q=${location}&key=8ee881e28153477693c122027232706`;
  
        const response = await axios.get(ur1);
        const wData = response.data;
  
        const temp0=wData.forecast.forecastday[0].hour[0].temp_c;
            const temp1=wData.forecast.forecastday[0].hour[1].temp_c;
            const temp2=wData.forecast.forecastday[0].hour[2].temp_c;
            const temp3=wData.forecast.forecastday[0].hour[3].temp_c;
            const temp4=wData.forecast.forecastday[0].hour[4].temp_c;
            const temp5=wData.forecast.forecastday[0].hour[5].temp_c;
            const temp6=wData.forecast.forecastday[0].hour[6].temp_c;
            const temp7=wData.forecast.forecastday[0].hour[7].temp_c;
            const temp8=wData.forecast.forecastday[0].hour[8].temp_c;
            const temp9=wData.forecast.forecastday[0].hour[9].temp_c;
            const temp10=wData.forecast.forecastday[0].hour[10].temp_c;
            const temp11=wData.forecast.forecastday[0].hour[11].temp_c;
            const temp12=wData.forecast.forecastday[0].hour[12].temp_c;
            const temp13=wData.forecast.forecastday[0].hour[13].temp_c;
            const temp14=wData.forecast.forecastday[0].hour[14].temp_c;
            const temp15=wData.forecast.forecastday[0].hour[15].temp_c;
            const temp16=wData.forecast.forecastday[0].hour[16].temp_c;
            const temp17=wData.forecast.forecastday[0].hour[17].temp_c;
            const temp18=wData.forecast.forecastday[0].hour[18].temp_c;
            const temp19=wData.forecast.forecastday[0].hour[19].temp_c;
            const temp20=wData.forecast.forecastday[0].hour[20].temp_c;
            const temp21=wData.forecast.forecastday[0].hour[21].temp_c;
            const temp22=wData.forecast.forecastday[0].hour[22].temp_c;
            const temp23=wData.forecast.forecastday[0].hour[23].temp_c;


            const feels0=wData.forecast.forecastday[0].hour[0].condition.text;
            const feels1=wData.forecast.forecastday[0].hour[1].condition.text;
            const feels2=wData.forecast.forecastday[0].hour[2].condition.text;
            const feels3=wData.forecast.forecastday[0].hour[3].condition.text;
            const feels4=wData.forecast.forecastday[0].hour[4].condition.text;
            const feels5=wData.forecast.forecastday[0].hour[5].condition.text;
            const feels6=wData.forecast.forecastday[0].hour[6].condition.text;
            const feels7=wData.forecast.forecastday[0].hour[7].condition.text;
            const feels8=wData.forecast.forecastday[0].hour[8].condition.text;
            const feels9=wData.forecast.forecastday[0].hour[9].condition.text;
            const feels10=wData.forecast.forecastday[0].hour[10].condition.text;
            const feels11=wData.forecast.forecastday[0].hour[11].condition.text;
            const feels12=wData.forecast.forecastday[0].hour[12].condition.text;
            const feels13=wData.forecast.forecastday[0].hour[13].condition.text;
            const feels14=wData.forecast.forecastday[0].hour[14].condition.text;
            const feels15=wData.forecast.forecastday[0].hour[15].condition.text;
            const feels16=wData.forecast.forecastday[0].hour[16].condition.text;
            const feels17=wData.forecast.forecastday[0].hour[17].condition.text;
            const feels18=wData.forecast.forecastday[0].hour[18].condition.text;
            const feels19=wData.forecast.forecastday[0].hour[19].condition.text;
            const feels20=wData.forecast.forecastday[0].hour[20].condition.text;
            const feels21=wData.forecast.forecastday[0].hour[21].condition.text;
            const feels22=wData.forecast.forecastday[0].hour[22].condition.text;
            const feels23=wData.forecast.forecastday[0].hour[23].condition.text;

  
        const mailOptions = {
          from: "wiseweather3@gmail.com",
          to: email,
          subject: "Weather Wise Forecast",
          text: 'The weather forecast for today in '+location+' is ' +
          ' The Temperature at 0:00 is '+temp0 +' The condition is '+feels0 +'\n'+
          ' The Temperature at 1:00 is '+temp1 +' The condition is '+feels1 +'\n'+
          ' The Temperature at 2:00 is '+temp2 +' The condition is '+feels2 +'\n'+
          ' The Temperature at 3:00 is '+temp3 +' The condition is '+feels3 +'\n'+
          ' The Temperature at 4:00 is '+temp4 +' The condition is '+feels4 +'\n'+
          ' The Temperature at 5:00 is '+temp5 +' The condition is '+feels5 +'\n'+
          ' The Temperature at 6:00 is '+temp6 +' The condition is '+feels6 +'\n'+
          ' The Temperature at 7:00 is '+temp7 +' The condition is '+feels7 +'\n'+
          ' The Temperature at 8:00 is '+temp8 +' The condition is '+feels8 +'\n'+
          ' The Temperature at 9:00 is '+temp9 +' The condition is '+feels9 +'\n'+
          ' The Temperature at 10:00 is '+temp10 +' The condition is '+feels10 +'\n'+
          ' The Temperature at 11:00 is '+temp11 +' The condition is '+feels11 +'\n'+
          ' The Temperature at 12:00 is '+temp12 +' The condition is '+feels12 +'\n'+
          ' The Temperature at 13:00 is '+temp13 +' The condition is '+feels13 +'\n'+
          ' The Temperature at 14:00 is '+temp14 +' The condition is '+feels14 +'\n'+
          ' The Temperature at 15:00 is '+temp15 +' The condition is '+feels15 +'\n'+
          ' The Temperature at 16:00 is '+temp16 +' The condition is '+feels16 +'\n'+
          ' The Temperature at 17:00 is '+temp17 +' The condition is '+feels17 +'\n'+
          ' The Temperature at 18:00 is '+temp18 +' The condition is '+feels18 +'\n'+
          ' The Temperature at 19:00 is '+temp19 +' The condition is '+feels19 +'\n'+
          ' The Temperature at 20:00 is '+temp20 +' The condition is '+feels20 +'\n'+
          ' The Temperature at 21:00 is '+temp21 +' The condition is '+feels21 +'\n'+
          ' The Temperature at 22:00 is '+temp22 +' The condition is '+feels22 +'\n'+
          ' The Temperature at 23:00 is '+temp23 +' The condition is '+feels23 +'\n'

            
        };
  
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
      }
    } catch (error) {
      console.log("Error sending email:", error);
    }
  });







app.post("/subscribe", (req, res) => {
    const place = req.body.place;
    const nam = req.body.nam;
    const emai = req.body.emai;
    console.log(place);
    console.log(nam);
    console.log(emai);

    const details= new weather({
        name:nam,
        email: emai,
        location : place,
    });
    
    details.save();

    res.send("<h1>You have subscribed to Weather wise </h1>");

});




app.post("/", async (req, res) => {
    const location = req.body.location;
    console.log("Location: " + location);
    const url = `https://api.weatherapi.com/v1/current.json?q=${location}&key=8ee881e28153477693c122027232706`;
  
    try {
      const response = await axios.get(url);
      const weatherData = response.data;
      const temp=weatherData.current.temp_c;
      const condition=weatherData.current.condition.text;
      const feels=weatherData.current.feelslike_c;
      const humid=weatherData.current.humidity;
      const clouds =weatherData.current.cloud;
      console.log(temp);
      res.write("<h1>The temperature in "+location+" is "+temp+ "C</h1>");
      res.write("<h2>The current condition is "+condition+" </h2>");
      res.write("<h2>The temperature in "+location+" feels like "+feels+" C</h2>");
      res.write("<h2>The current humidity is "+humid+" </h2>");
      res.write("<h2>The clouds are "+clouds+" </h2>");
      res.send();
      console.log(weatherData);

    } catch (error) {
      console.log("Error fetching weather data:", error);
    }
});


const PORT=process.env.PORT || 3000;






app.listen(PORT);


// API KEY :8ee881e28153477693c122027232706
