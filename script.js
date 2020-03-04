$(document).ready(function() {

    /************************************* GLOBAL VARIABLES **************************************/

    let key = "d0ae07cdf36be7b5b427e0cb559afe4e"
    var city;



    /***************************************** FUNCTIONS *****************************************/

    const showCurrentWeather = function() {

        let city = "nashville,tennessee";
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURI(city) + "&appid=" + encodeURI(key);

        $.ajax({url: queryURL, method: "GET"})
            .then(function(response) {

                console.log(response);
                
                let name = response.name;
                let temp = ((response.main.temp) - 273.15) * (9 / 5) + 32;
                let humidity = response.main.humidity;
                let windSpeed = response.wind.speed * 2.237;
                let description = response.weather[0].description;
                let icon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";

                let span = $("<span>");
                let spanContent = "<span><img src=\"" + icon + "\" alt=\"weather icon\" \\></span>";

                $("#city").html(name);
                $("#description").html(description);
                $("#temperature").html("Temperature: " + temp.toFixed(2) + "&#176");
                $("#humidity").html("Humidity: " + humidity + " percent");
                $("#wind-speed").html("Wind Speed: " + windSpeed.toFixed(2) + " mph");

                span.html(spanContent);
                $("#description").append(span);
            });
    }

    const getCity = function() {

        let city = $("#city").val();

        console.log(city);

    }



    /*************************************** EVENT HANDLERS **************************************/
    
    showCurrentWeather();

    $("#search").on("click", getCity);

});