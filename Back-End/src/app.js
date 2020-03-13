const express = require('express');
const config = require("./config.json")
var email_service = require('./services/email-service')
var weather_service = require("./services/weather-service")
var validation_service = require("./services/validation-service")
var db = require("./database/database_op")

const app = express();
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/sendEmail',(req,res)=> {

    // Validate the request
    const result = validation_service.validate_user(req.body)
    if(result.error) return res.status(400).send(result.error.details[0].message)

    let user_entry = {email: req.body.email, location: req.body.location}

    // Insert user into table
    let sql = 'INSERT INTO userData SET ?';
    let query = database.query(sql,user_entry,(err,result)=> {
        if(err){
            // Check if we get a duplicate entry error. If so send msg informing that user exists.
            if (err.code == 'ER_DUP_ENTRY'){
                reply = {result:  "Email " + req.body.email + " already exists"}
                return res.send(reply);
            }
            // If we get any other error, send a generic error message
            else return res.status(503).send("We are unable to service requests at this time, please try again later.")
        }
        else{
            // Successfull, so call async function to send email.
             reply = {result:  "Successfully sent email to " + req.body.email}
             email_service.send_email(req.body.email, req.body.location)
             return res.send(reply);
        }
    });
});


(async () => {
  database = await db.connect()

  //Load the weather for the first time
  await weather_service.update_weather()

  // Async call to the update weather every 1 hour.
  setInterval(()=>weather_service.update_weather(),1000*60*60)

  const port = process.env.PORT || 3000;
  app.listen(port,()=>console.log(`Listening on port ${port}`));
})();

