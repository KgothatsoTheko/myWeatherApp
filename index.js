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

}

//Fetching data from api 5 day forecast data
async function gettingWeather(latitude, longitude) {
    let log = await fetch (`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=0ce1aa27decb947120fb897abc655f72`)
    let data2 = await log.json()
    const uniqueForeCastDays = [];

    const createWeatherCard = (weatherItem) => {
        const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',]
        const day = new Date(weatherItem.dt_txt.slice(0, 11))
        console.log(week[day.getDay()])
        return bottom.innerHTML += `<div class="slot">
        <p><b>${Math.floor(weatherItem.main.temp - kelvin)}&degC</b></p>
        <span><img src="http://openweathermap.org/img/w/${weatherItem.weather[0].icon}.png"/></span>
        <h4>${week[day.getDay()]}</h4>
    </div>`
    }

    //Filter data for the list array containing dates
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

}

//Fetching data weather via search - current weather display
async function searchWeather(city) {
    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0ce1aa27decb947120fb897abc655f72`)
    let data = await res.json()
    let log = await fetch (`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=0ce1aa27decb947120fb897abc655f72`)
    let data2 = await log.json()
    console.log(data)
    console.log(data2)
    weather.temperature.value = Math.floor(data.main.temp - kelvin);
    weather.city = data.name
    weather.country = data.sys.country;
    weather.logo = data.weather[0].icon
    displayWeather()

    //search function for 3 hour display
    newArr = data2.list
    console.log(newArr)
    newArr.map = () => {
        for (i = 0; i < 5; i++)
        middle.innerHTML += `<div id="slot" class="slot">
        <p><b class="temperature-value1">${Math.floor(newArr[i].main.temp - kelvin)}&degC</b></p>
        <span class="logo1"><img id="logo1" src="http://openweathermap.org/img/w/${newArr[i].weather[0].icon}.png" alt="show"/></span>
        <h4 class="time">${newArr[i].dt_txt.slice(11, 16)}</h4>
        <small class="description">${newArr[i].weather[0].main}</small>
        </div>`
    } 
    newArr = newArr.map() 
    console.log(newArr)
}

//display ui function - current weather display
displayWeather = () => {
    logo.innerHTML = `<img src = "http://openweathermap.org/img/w/${weather.logo}.png"/>`;
    temperature.innerHTML = `${weather.temperature.value}&deg<span>C</span>`
    location1.innerHTML = `${weather.country}, ${weather.city}`;

}

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