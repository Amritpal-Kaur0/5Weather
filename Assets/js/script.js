var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var searchHistory = document.querySelector('#searchedcities');
var cityWeather = document.querySelector('#city-weather');
var fiveDayForecast = document.querySelector('#five-day');
let searchedCities = [];
var apiKey = 'fe5e9834bfbca39697730b5ad134d449'


// fetch weather data 
async function getWeatherData(city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    var response = await fetch(apiURL);
    if (!response.ok) {
        return Error('Failed to get weather data');
  }
    var data = await response.json();
    console.log(data)
    return data;
}

//  current weather
function showCurrentWeather(data) {
    var cityInfo = document.querySelector('#city-info');
    var currentWeather = document.querySelector('#current-weather');
    var temperature = document.querySelector('#temperature');
    var windSpeed = document.querySelector('#wind-speed');
    var humidity = document.querySelector('#humidity');

    var date = new Date(data.list[0].dt * 1000).toLocaleDateString();
    var icon = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
    var k = data.list[0].main.temp;
    var temp = Math.trunc(k-273.15)
    var wind = `${data.list[0].wind.speed} m/s`;
    var humid = `${data.list[0].main.humidity}%`;

    cityInfo.textContent = `${data.city.name} (${date})`;
    currentWeather.innerHTML = `<img src="${icon}" alt="${data.list[0].weather[0].description}">`;
    temperature.textContent = `Temperature: ${temp}°C`;
    windSpeed.textContent = `Wind Speed: ${wind}`;
    humidity.textContent = `Humidity: ${humid}`;
    showFiveDayForecast(data)
}

//   5-day forecast 
function showFiveDayForecast(data) {
  var forecastDays = document.querySelectorAll('.grid-item');
  forecastDays.forEach(function(day, index) {
    var date = new Date(data.list[(index + 1) * 8 - 1].dt * 1000).toLocaleDateString();
    var icon = `https://openweathermap.org/img/wn/${data.list[(index + 1) * 8 - 1].weather[0].icon}.png`;
    var k1 = data.list[(index + 1) * 8 - 1].main.temp
    var tempe = Math.trunc(k1-273.15);
    var wind = `${data.list[(index + 1) * 8 - 1].wind.speed} m/s`;
    var humid = `${data.list[(index + 1) * 8 - 1].main.humidity}%`;

    day.innerHTML = `
      <h2>${date}</h2>
      <img src="${icon}" alt="${data.list[(index + 1) * 8 - 1].weather[0].description}">
      <p>Temperature: ${tempe} °C</p>
      <p>Wind Speed: ${wind}</p>
      <p>Humidity: ${humid}</p>
    `;
  });
}
//  search history
function renderSearchHistory() {
    searchHistory.innerHTML = '';
    var searchHistoryList = JSON.parse(localStorage.getItem('searchHistoryList')) || [];
    searchHistoryList.forEach(function(city) {
      var li = document.createElement('li');
      li.textContent = city;
      li.addEventListener('click', function() {
        searchInput.value = city;
        searchForm.dispatchEvent(new Event('submit'));
      });
      searchHistory.appendChild(li);
    });
    }
// save search history in local storage
function saveSearchHistory(city){
    searchedCities = JSON.parse(localStorage.getItem('searchHistoryList')) || [];
    if (!searchedCities.includes(city)) {
        searchedCities.push(city);
        localStorage.setItem('searchHistoryList', JSON.stringify(searchedCities));
      }
      renderSearchHistory()
    }
  document.getElementById('submit-button').addEventListener('click',async function(event){
    event.preventDefault()
    var cityName = searchInput.value
    var searchResult = await getWeatherData(cityName)
     showCurrentWeather(searchResult)
     saveSearchHistory(cityName)
  })
  renderSearchHistory()
  
