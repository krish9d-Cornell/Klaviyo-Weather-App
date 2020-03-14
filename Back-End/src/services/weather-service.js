const cities = require("../data/cities.js")
const config = require("../config.json")
const weather_config = config.weather
var request= require('request')
curr_temp = {}
next_temp = {}
weather= {}

/**
 * Update the weather of all cities in the cities list.
 */
async function update_weather(){

    console.log("Updating weather")
    var apiKey = weather_config.key
    var citylist = cities.cities

    //Iterate over city list and update weather for all cities
    for(i=0, size = citylist.length; i<size; i++){
        var city = citylist[i]
        var url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
        request(url,function(error,response,body){
            if(error){
                // we can use the old cache value, so ignore error
            }else{
                weather_json = JSON.parse(body)
                curr_temp[weather_json.city.name] = weather_json.list[0].main.temp
                // Next day's temperature
                next_temp[weather_json.city.name] = weather_json.list[8].main.temp
                weather[weather_json.city.name] = weather_to_text(weather_json.list[0].weather[0].main)
            }
        });
    }
}

/**
 * Get the email message that is appropriate for a city, based on location.
 * @param {string} city - city for which the message should be sent.
 */
function get_weather_message(city){

    if (weather[city] === "clear" || ((curr_temp[city] - next_temp[city] > 5) && weather[city] != "rainy"))
        msg_subject = "It's nice out! Enjoy a discount on us."
    else if (weather[city] == "rainy" || ((next_temp[city] - curr_temp[city] > 5) && weather[city] != "clear"))
        msg_subject = "Not so nice out? That's okay, enjoy a discount on us."
    else
        msg_subject = "Enjoy a discount on us!"

    // Make sure we do have weather data
    if (city in weather){
        msg_body = "Greetings from Klaviyo! It's "+ weather[city]+" outside in "
                   +city+ " and the temperature is "+ Math.round((curr_temp[city] -273))
                   + " degree celsius. Stay safe from the virus!"
    }
    // In case weather data is empty, use genric message (this should almost never be the case)
    else{
        msg_body = "Greetings from Klaviyo!"
        msg_subject = "Enjoy a discount on us!"
    }

    return {subject: msg_subject, body: msg_body }
}

/**
 * Convert the weather into more readable text
 * @param {string} weather - weather string that needs to be converted
 */
function weather_to_text(weather){
    if(weather == "Rain") return "rainy"

    else if (weather == "Clouds") return "cloudy"

    else return weather.toLowerCase()
}

module.exports.get_weather_message = get_weather_message;
module.exports.update_weather = update_weather;