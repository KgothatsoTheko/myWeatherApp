const location1 = document.querySelector('.location')
const temperature = document.querySelector('.temperature-value')
const logo = document.querySelector('.logo')
const notification = document.querySelector('.notification')
const searchInput = document.querySelector('.search')
const searchBtn = document.querySelector('.search-icon')
const logo1 = document.querySelector('.logo1')
const temperature1 = document.querySelector('.temperature-value1')
const time = document.querySelector('.time')
const description = document.querySelector('.description')
const middle = document.getElementById('middle')
const bottom = document.getElementById('bottom')

//Data
const weather = {}
const kelvin = 273;
weather.temperature = {
    unit: 'Celsius'
}

//gets current coordinates
setPosition = (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
    fetchWeather(latitude, longitude);
    gettingWeather(latitude, longitude);
}

//error message saying if you have geolocation
showError = (error) => {
    notification.style.display = 'block';
    notification.innerHTML = `<p>${error.message} </p>`

}

//Fetching data from api current weather data
getWeather = (latitude, longitude) => {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=0ce1aa27decb947120fb897abc655f72`

    //converts to json
    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        //getting data for current weather and location
        .then(function (data) {
            console.log(data)
            weather.temperature.value = Math.floor(data.main.temp - kelvin);
            weather.city = data.name
            weather.country = data.sys.country;
            weather.logo = data.weather[0].icon
        })
        //display function
        .then(function () {
            displayWeather();
        })

}

//Fetching data from api 3 hour forecast data
fetchWeather = (latitude, longitude) => {
    let api1 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=0ce1aa27decb947120fb897abc655f72`

    fetch(api1)
        .then(function (response) {
            let data1 = response.json();
            return data1;
        })
        .then(function (data1) {
            data1.list.map = () => {
                for (i = 0; i < 5; i++)
                middle.innerHTML += `<div id="slot" class="slot">
                <p><b class="temperature-value1">${Math.floor(data1.list[i].main.temp - kelvin)}&degC</b></p>
                <span class="logo1"><img id="logo1" src="http://openweathermap.org/img/w/${data1.list[i].weather[0].icon}.png" alt="show"/></span>
                <h4 class="time">${data1.list[i].dt_txt.slice(11, 16)}</h4>
                <small class="description">${data1.list[i].weather[0].main}</small>
                </div>`
            }
                data1.list = data1.list.map()
                console.log(data1)
        })
    // weather.temperature.value = Math.floor(data1.list[0].main.temp - kelvin);
    // weather.logo1 = data1.list[0].weather[0].icon
    // weather.time = data1.list[0].dt_txt.slice(11, 16)
    // weather.description = data1.list[0].weather[0].main
}
    // .then(function () {
    //     showWeather();
    // })

//Fetching data from api 5 day forecast data
async function gettingWeather(latitude, longitude) {
    let log = await fetch (`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=0ce1aa27decb947120fb897abc655f72`)
    let data2 = await log.json()
    const uniqueForeCastDays = [];
    const createWeatherCard = (weatherItem) => {
        return bottom.innerHTML += `<div class="slot">
        <p><b>${Math.floor(weatherItem.main.temp - kelvin)}&degC</b></p>
        <span><img src="http://openweathermap.org/img/w/${weatherItem.weather[0].icon}.png"/></span>
        <h4>${weatherItem.dt_txt}</h4>
    </div>`
    }
    const fiveDaysForecast = data2.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if(!uniqueForeCastDays.includes(forecastDate)) {
            return uniqueForeCastDays.push(forecastDate);
        }
    })
    console.log(fiveDaysForecast)

    fiveDaysForecast.forEach(weatherItem => {
        createWeatherCard(weatherItem)
    })

    // fiveDaysForecast.map = () => {
    //     for (i = 0; i < 5; i++) {
    //         bottom.innerHTML += `<div class="slot">
    //         <p><b>${Math.floor(fiveDaysForecast.main.temp - kelvin)}&degC</b></p>
    //         <span><img src="http://openweathermap.org/img/w/${fiveDaysForecast.weather[0].icon}.png"/></span>
    //         <h4>${day}</h4>
    //     </div>`
    //     }
    // }
    // data2.list = data2.list.map()

}


//Fetching data weather via search
async function searchWeather(city) {
    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0ce1aa27decb947120fb897abc655f72`)
    let data = await res.json()
    weather.temperature.value = Math.floor(data.main.temp - kelvin);
    weather.city = data.name
    weather.country = data.sys.country;
    weather.logo = data.weather[0].icon
    displayWeather();
}

//display ui function
displayWeather = () => {
    logo.innerHTML = `<img src = "http://openweathermap.org/img/w/${weather.logo}.png"/>`;
    temperature.innerHTML = `${weather.temperature.value}&deg<span>C</span>`
    location1.innerHTML = `${weather.country}, ${weather.city}`;

}

//showing ui for 3 hour weather
// showWeather = () => {

//     temperature1.innerHTML = `${weather.temperature.value}&deg<b>C</b>`
//     logo1.innerHTML = `<img src = "http://openweathermap.org/img/w/${weather.logo1}.png"/>`
//     time.innerHTML = `${weather.time}`
//     description.innerHTML = `${weather.description}`

// }

//Checks if browser supports geolocation
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notification.style.display = 'block';
    notification.innerHTML = '<p>Browser does not support Geolocation</p>';
}

//search function
searchBtn.addEventListener('click', () => {
    searchWeather(searchInput.value)

})






