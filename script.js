$(document).ready(function() {

    /************************************* GLOBAL VARIABLES **************************************/

    let key = "d0ae07cdf36be7b5b427e0cb559afe4e"



    /***************************************** FUNCTIONS *****************************************/

    const showCurrentWeather = function() {

        let city = "nashville,tennessee";
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURI(city) + "&appid=" + encodeURI(key);

        $.ajax({url: queryURL, method: "GET"})
            .then(function(response) {

                console.log(response);
                
                let name = response.name;
                let temp = response.main.temp;
                let humidity = response.main.humidity;
                let windSpeed = response.wind.speed;
                let icon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";

                console.log(name);
                console.log(temp);
                console.log(humidity);
                console.log(windSpeed);
                console.log(icon);
            });
    }




    /*************************************** EVENT HANDLERS **************************************/
    
    showCurrentWeather();

});