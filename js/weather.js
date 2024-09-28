document.addEventListener("DOMContentLoaded", () => {
    const apiKey = config.apiKey;  // config.js에서 가져옴

    // Geolocation API를 사용해 브라우저의 위치 정보 가져오기
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // OpenWeatherMap API URL
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

                // Fetch API to send GET request
                fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Process the API response
                        console.log("Weather Data:", data);
                        displayWeather(data, lat, lon);
                        displayDateTime();
                    })
                    .catch(error => {
                        // Handle any errors that occur during the request
                        console.error("Error fetching weather data:", error);
                    });
            },
            error => {
                console.error("Geolocation error:", error);
                document.querySelector('.location').innerHTML = 'Unable to retrieve your location.';
            }
        );
    } else {
        document.querySelector('.location').innerHTML = 'Geolocation is not supported by this browser.';
    }

    // Function to display weather and location data
    function displayWeather(data, lat, lon) {
        const weatherKor = document.querySelector('.weatherKor');
        const weatherEng = document.querySelector('.weatherEng');
        const temperatureDiv = document.querySelector('.temperature');
        const latitudeElement = document.querySelector('.latitude');
        const longitudeElement = document.querySelector('.longitude');
        const locationElement = document.querySelector('.location');
        
        const { name, weather, main } = data;
        const state = weather[0].main;
        const temperature = (main.temp - 273.15).toFixed(2); // Convert from Kelvin to Celsius
        if(state=="Rain"){
            weatherKor.innerHTML = "비" ;     
        }else if(state=="Clear"){
            weatherKor.innerHTML = "맑음";
        }else if(state=="Clouds"){
            weatherKor.innerHTML = "흐림";
        }else if(state=="Snow"){
            weatherKor.innerHTML = "눈";
        }
        // Display city name, weather condition, and temperature in the HTML
        weatherEng.innerHTML = state;     // 날씨 상태 출력
        temperatureDiv.innerHTML = `${temperature} °C`;  // 온도 출력

        // Display latitude and longitude
        latitudeElement.innerHTML = `${lat}`;
        longitudeElement.innerHTML = `${lon}`;

        // Set location name (city)
        locationElement.innerHTML = name;

        // Set the data-weather attribute dynamically based on the weather state
        document.documentElement.setAttribute('data-weather', state.toLowerCase());
    }

    // Function to display current date and time
    function displayDateTime() {
        const now = new Date();

        // Extract the month, day, and time
        const month = now.getMonth() + 1;  // getMonth() is zero-indexed
        const day = now.getDate();
        const hours = now.getHours().toString().padStart(2, '0'); // Ensure two digits
        const minutes = now.getMinutes().toString().padStart(2, '0'); // Ensure two digits

        // Display the current month and day
        document.querySelector('.month').textContent = month;
        document.querySelector('.day').textContent = day;

        // Display the current time
        document.querySelector('.time').textContent = `${hours}:${minutes}`;
    }
});
