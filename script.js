// Variables
const apiKey = 'YOUR_API_KEY'; // Replace this with your actual OpenWeather API key
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const cityNameEl = document.getElementById('city-name');
const temperatureEl = document.getElementById('temperature');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const forecastContainer = document.getElementById('forecast-cards');
const historyList = document.getElementById('history-list');

// Load search history from localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSearchHistory();
});

// Event listener for the search button
searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeatherData(city);
    }
});

// Fetch weather data from OpenWeather API
function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            getForecastData(city);
            saveSearchHistory(city);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Display current weather data
function displayCurrentWeather(data) {
    cityNameEl.textContent = `${data.name} (${new Date().toLocaleDateString()})`;
    temperatureEl.textContent = `Temperature: ${data.main.temp} °F`;
    humidityEl.textContent = `Humidity: ${data.main.humidity} %`;
    windSpeedEl.textContent = `Wind Speed: ${data.wind.speed} MPH`;
}

// Fetch 5-day forecast data
function getForecastData(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

// Display 5-day forecast data
function displayForecast(data) {
    forecastContainer.innerHTML = ''; // Clear previous forecast
    for (let i = 0; i < data.list.length; i += 8) {
        const dayData = data.list[i];
        const forecastCard = document.createElement('div');
        forecastCard.innerHTML = `
            <h4>${new Date(dayData.dt_txt).toLocaleDateString()}</h4>
            <p>Temp: ${dayData.main.temp} °F</p>
            <p>Wind: ${dayData.wind.speed} MPH</p>
            <p>Humidity: ${dayData.main.humidity} %</p>
        `;
        forecastContainer.appendChild(forecastCard);
    }
}

// Save search history to localStorage
function saveSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        displaySearchHistory();
    }
}

// Load search history from localStorage
function loadSearchHistory() {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.forEach(city => {
        addToHistoryList(city);
    });
}

// Display search history
function displaySearchHistory() {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    historyList.innerHTML = ''; // Clear the list
    history.forEach(city => {
        addToHistoryList(city);
    });
}

// Add city to the search history list
function addToHistoryList(city) {
    const li = document.createElement('li');
    li.textContent = city;
    li.addEventListener('click', () => {
        getWeatherData(city);
    });
    historyList.appendChild(li);
}
