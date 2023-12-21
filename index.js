const location1 = document.querySelector('.location')
const temperature = document.querySelector('.temperature-value')
const logo = document.querySelector('.logo')
const notification = document.querySelector('.notification')
const weather = {}

weather.temperature = {
    unit: 'Celsius'
}

setPosition = (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

showError = (error) => {
    notification.style.display = 'block';
    notification.innerHTML = `<p>${error.message} </p>`

}

getWeather = (latitude, longitude) => {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=0ce1aa27decb947120fb897abc655f72`
    
    fetch(api)
    .then(function(response) {
        let data = response.json();
        return data;
    })
    .then(function(data){
        weather.temperature.value = Math.floor(data.main.temp - kelvin);
        weather.city = data.name
        weather.country = data.sys.country;
        weather.logo = data.weather[0].icon
    })
    .then(function(){
        displayWeather();
    })

}

displayWeather = () => {
    logo.innerHTML = `<img src = "http://openweathermap.org/img/w/${weather.logo}.png"/>`;
    temperature.innerHTML = `${weather.temperature.value}&deg<span>C</span>`
    location1.innerHTML = `${weather.country}, ${weather.city}`;

}

const kelvin = 273;

if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notification.style.display = 'block';
    notification.innerHTML = '<p>Browser does not support Geolocation</p>';
}






