class Temperature {
    static kelwinToCelcius(temp){
        return Math.round(parseFloat(temp) - 273.15);
    }
    static kelwinToFahrenheit(temp){
        return Math.round(((parseFloat(temp) - 273.15) * 1.8) + 32);
    }
}

class App {
    constructor() {
        this.config = { 
            apiKey: '9b1b809329935f7a52e800e85bc5a2a0',
            development: false,
            coordinates: {} 
        };
        this.getUserCoordinates(this.navigatorCallback);
    }

    renderData(){
        // Code conditions - https://openweathermap.org/weather-conditions
        // Group 2xx: Thunderstorm
        // Group 3xx: Drizzle
        // Group 5xx: Rain
        // Group 6xx: Snow
        // Group 7xx: Atmosphere
        // Group 800: Clear
        // Group 80x: Clouds

        if(this.weatherData.weather[0].id === 800){
            // goog weather
            document.getElementById('icon').childNodes[1].setAttribute('src','/icons/sun.svg');
            document.body.style.backgroundColor = '#fadc60';
        } else {
            // bad weather
            document.getElementById('icon').childNodes[1].setAttribute('src','/icons/wave.svg');
            document.body.style.backgroundColor = '#DCF9FF';
        }

        // description
        document.getElementById('description').innerHTML = this.weatherData.weather[0].description;

        // temp
        document.getElementById('temp').innerHTML = 
            Temperature.kelwinToCelcius( this.weatherData.main.temp ) + '&deg; C ' + 
            '<small>(' + Temperature.kelwinToFahrenheit( this.weatherData.main.temp ) + '&deg; F)</small>';

        // location
        document.getElementById('location').innerText = this.weatherData.name;

        // gps 
        document.getElementById('gps').innerText = `Location: ${this.config.coordinates.latitude},  ${this.config.coordinates.longitude}`;
    }
    
    weatherApiCallback(data,scope){
        scope.weatherData = data;
        scope.init();
    }
    
    navigatorCallback(coordinates,scope){
        scope.config.coordinates = coordinates;
        scope.getWeatherConditions(scope.weatherApiCallback);
    }
    
    /* 
     * 1. Wait to get user coordinates
     * 2. Wait to get api data
     * 3. Render data
     */
    init(){
        this.renderData();
    }

    getWeatherConditions(callback){
        let endpoint_weather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + this.config.coordinates.latitude + '&lon=' + this.config.coordinates.longitude + '&appid=' + this.config.apiKey;
        if(this.config.development){
            endpoint_weather = 'https://weather.kamilnowak.com/api/';
        }
        let scope = this;
        fetch(endpoint_weather)
            .then(function (resp) { return resp.json() }) // Convert data to json
            .then(function (data) {
                callback(data,scope); // Call drawWeather
            })
            .catch(function () {
                // catch any errors
            });
    }

    getUserCoordinates(callback){
        if (navigator.geolocation) {
            let scope = this;
            navigator.geolocation.getCurrentPosition( (position) => {
                const coordinates = {
                        latitude: position.coords.latitude, 
                        longitude: position.coords.longitude 
                    };
                callback(coordinates,scope);
            });
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App;
})


/* 
 * Push Notification
 */
Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
});
function displayNotification() {
    if (Notification.permission === "granted") {
        /* do our magic */
        navigator.serviceWorker.getRegistration().then(function (reg) {
            var options = {
                body: 'Here is a notification body!',
                icon: 'images/icons/icon-72x72.png',
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1
                }
            };
            reg.showNotification('Hello world!', options);
        });
    } else if (Notification.permission === "blocked") {
        /* the user has previously denied push. Can't reprompt. */
    } else {
        /* show a prompt to the user */
    }
}
displayNotification();
self.addEventListener('notificationclose', function (e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    console.log('Closed notification: ' + primaryKey);
});


/* 
 * Register Service Worker
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log(`Service Worker registered! Scope: ${registration.scope}`);
            })
            .catch(err => {
                console.log(`Service Worker registration failed: ${err}`);
            });
    });
}

/* 
 * Home Screen popup (visible on mobile devices)
 */
var btnAdd = document.createElement('div');
document.body.appendChild(btnAdd);

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can add to home screen
    btnAdd.style.display = 'block';
});
btnAdd.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    btnAdd.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
        .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
});