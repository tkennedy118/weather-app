$(document).ready(function() {

    /************************************* GLOBAL VARIABLES **************************************/

    let key = "d0ae07cdf36be7b5b427e0cb559afe4e"

    /***************************************** FUNCTIONS *****************************************/

    const showCurrentWeather = function(city) {

        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURI(city) + "&appid=" + encodeURI(key);

        // ajax request to display weather info
        $.ajax({
            url: queryURL, 
            method: "GET",
            success: function(response) {
                
                // variables obtained from current weather data API
                let name = response.name;
                let temp = ((response.main.temp) - 273.15) * (9 / 5) + 32;
                let humidity = response.main.humidity;
                let windSpeed = response.wind.speed * 2.237;
                let description = response.weather[0].description;
                let icon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";

                let span = $("<span>");
                let spanContent = "<img src=\"" + icon + "\" alt=\"weather icon\" \\>";

                // display to page
                $("#city-display").html(name);
                $("#description").html(description);
                $("#temperature").html("Temperature: " + temp.toFixed(2) + "&#176");
                $("#humidity").html("Humidity: " + humidity + " percent");
                $("#wind-speed").html("Wind Speed: " + windSpeed.toFixed(2) + " mph");

                span.html(spanContent);
                $("#description").append(span);

                // set local storage, display uv info, update recents on page
                showUV(response, city);
                setLocalStorage(response);
                populateRecents();
            }
        });
    }

    const showUV = function(response, city) {

        let lat = response.coord.lat;
        let lon = response.coord.lon;

        let queryURL = "http://api.openweathermap.org/data/2.5/uvi?&lat=" + encodeURI(lat) + "&lon=" + encodeURI(lon) + "&appid=" + encodeURI(key)

        // ajax request to display uv info
        $.ajax({url: queryURL, method: "GET"})
            .then(function(response) {

                var color;
                let val = response.value;

                // create span to display uv color
                let span = $("<span>");

                if (val < 3) {

                    color = "green";
                } else if (val < 6) {

                    color = "yellow";
                } else if (val < 8 ) {

                    color = "orange";
                } else {
                    
                    color = "red";
                }

                // span properties, id located in css
                span.attr("id", "uv-icon");
                span.css("background-color", color);

                // display to page
                $("#uv-index").html("UV Index: " + val);
                $("#uv-index").append(span);

                // get current date from API and set global current day
                currentDay = response.date_iso.split("").splice(0, 10).join("");

                getFiveDayForecast(city, currentDay);
            });
    }

    const setLocalStorage = function(response) {

        let city = response.name;
        var index;

        // get array of cities from local storage
        let arr = JSON.parse(localStorage.getItem("cityArr"));

        // array was found in local storage
        if (arr !== null) {

            if (arr.includes(city)) {

                // remove the item from its current index.
                // this is done to keep track of most recent searches
                index = arr.indexOf(city);
                arr.splice(index, 1);
            }
        }

        // array not found in local storage
        else {
            arr = [];
        }
        
        // push to local storage
        arr.push(city);
        localStorage.setItem("cityArr", JSON.stringify(arr));
    }

    const populateRecents = function() {

        let recents = $("#recents");
        var citiesToDisplay;
        var storedCities = []; 
        
        // set citiesToDisplay to locally stored cities, else set to popular cities
        if (localStorage.getItem("cityArr") !== null) {

            // get stored cities
            storedCities = JSON.parse(localStorage.getItem("cityArr")).reverse();

            // keep max length at 12
            if (storedCities.length > 12) {

                citiesToDisplay = storedCities.splice(0, 12);
            } else {

                citiesToDisplay = storedCities;
            }
        }

        // clear current
        recents.empty();

        // display cities to sidebar
        citiesToDisplay.forEach(function(city) {

            let button = $("<button>");

            button.attr({
                type: "button",
                class: "list-group-item list-group-item-action round-0 recent-cities"
            });
            button.html(city);

            recents.append(button);
        })
    }

    // FUNCTION: enter most recent locally stored city to display automatically
    const onPageLoad = function() {

        if (localStorage.getItem("cityArr") !== null) {

            // get most recently queried city
            let storedCities = JSON.parse(localStorage.getItem("cityArr"));
            let mostRecent = storedCities[storedCities.length - 1];

            showCurrentWeather(mostRecent);
        }
    }

    // Function: display the current date in the DOM
    const displayCurrentDate = function(currentDay) {

        // get each part of date into a variable
        // let month = date.splice(5, 2).join("");
        // let day = date.splice(6, 2).join("");
        // let year = date.splice(0, 4).join("");
    }

    const getFiveDayForecast = function(city, currentDay) {

        let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + encodeURI(city) + "&appid=" + encodeURI(key);

        // call function to display current day
        displayCurrentDate(currentDay);

        // ajax request to display weather info
        $.ajax({
            url: queryURL, 
            method: "GET",
            success: function(response) {

                // get last time value for comparison
                let [mostRecentForecast, mostRecentTime] = response.list[39].dt_txt.split(" ");

                response.list.forEach(function(forecast) {

                    // get date and time
                    let [forecastDate, time] = forecast.dt_txt.split(" ");
                    
                    // use weather info from the most recent time of the last day, for the next 5 days
                    if (forecastDate !== currentDay && time === mostRecentTime) {
                        console.log(forecastDate + " " + time);

                        // variables obtained from API
                        let temp = ((response.main.temp) - 273.15) * (9 / 5) + 32;
                        let humidity = response.main.humidity;
                        let icon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";

                        let span = $("<span>");
                        let spanContent = "<img src=\"" + icon + "\" alt=\"weather icon\" \\>";
                        
                        // display to page
                        $("#city-display").html(name);
                        $("#description").html(description);
                        $("#temperature").html("Temperature: " + temp.toFixed(2) + "&#176");
                        $("#humidity").html("Humidity: " + humidity + " percent");
                        $("#wind-speed").html("Wind Speed: " + windSpeed.toFixed(2) + " mph");

                        span.html(spanContent);
                        $("#description").append(span);
                    }
                }); 
            }
        });
    }

    /*************************************** EVENT HANDLERS **************************************/

    // on page load
    onPageLoad();

    // user clicks search icon
    $("#search").on("click", function() {

        // get input value
        let city = $("#city-input").val();

        // get weather data and display it
        showCurrentWeather(city);

        $("#city-input").val("");
    });

    // user presses enter
    $("#city-input").on("keyup", function(event) {

        // number 13 is the "Enter" key on a keyboard
        if (event.keyCode === 13) {
            event.preventDefault();

            // change focus
            $("#search").focus();

            // trigger click event
            $("#search").click();
        }
    });

    $(document).on("click", ".recent-cities", function() {

        let city = $(this).text();

        showCurrentWeather(city);
    })
});