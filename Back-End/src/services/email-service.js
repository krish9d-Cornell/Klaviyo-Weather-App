const nodemailer = require("nodemailer");
const config = require("../config.json")
const weather_service = require("./weather-service")
const email_config = config.email

/**
 * Send an email to the provided address.
 * @param {string} dest_addr - Address to send email to.
 * @param {string} location - Location of reciever.
 */
function send_email(dest_addr, location) {

  let message = weather_service.get_weather_message(location)

  let transporter = nodemailer.createTransport({
      service: email_config.service,
      port: email_config.port,
      secure: false,
      auth: {
        user: email_config.user,
        pass: email_config.password
      },
      tls:{
        rejectUnauthorized: false
      }
  });

  transporter.sendMail({
      from: email_config.sender,
      to: dest_addr,
      subject: message.subject,
      text: message.body,
  });
}

module.exports.send_email = send_email;
