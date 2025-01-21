// const apiKey = "d9cf7f99e0748d2ef4e7d75600c57edb";
// let queryCity = "shimla";

// // // Current Weather API Endpoint

// // http://api.weatherstack.com/current
// //     ? access_key = YOUR_ACCESS_KEY
// //     & query = New York

// // // optional parameters:

// //     & units = m
// //     & language = en
// //     & callback = MY_CALLBACK
// const urlCurrent = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${queryCity}`;
//  const re = fetch(urlCurrent)
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//     });
// // const res = JSON.parse(urlCurrent);
// console.log(re);

const apiKey = "2311494df380589310eb6d56646ec070"; // Replace with your API key
// const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your API key
const recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

// Function to fetch weather by city name
async function searchWeatherByCity() {
  const location = document.getElementById("locationInput").value.trim();
  if (!location) {
    alert("Please enter a city name!");
    return;
  }
  await fetchWeather(location);
  updateRecentCities(location);
}

// Function to fetch weather by current location
async function getWeatherByLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch weather data.");
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      alert(error.message);
    }
  });
}

// Function to fetch weather data
async function fetchWeather(location) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("City not found.");
    const data = await response.json();
    displayWeather(data);
    fetchExtendedForecast(data.coord.lat, data.coord.lon);
  } catch (error) {
    alert(error.message);
  }
}

// Function to display current weather
function displayWeather(data) {
  const { name, main, weather, wind } = data;
  const icon = weather[0].icon;
  const weatherDisplay = document.getElementById("weatherDisplay");

  weatherDisplay.innerHTML = `
          <div class="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
            <h2 class="text-xl font-bold">${name}</h2>
            <p class="text-sm text-gray-500 capitalize">${weather[0].description}</p>
            <div class="flex items-center mt-4">
              <img
                src="https://openweathermap.org/img/wn/${icon}@2x.png"
                alt="${weather[0].description}"
                class="w-12 h-12"
              />
              <p class="text-2xl font-semibold ml-4">${main.temp}°C</p>
            </div>
            <p class="mt-2">Humidity: ${main.humidity}% | Wind: ${wind.speed} m/s</p>
          </div>
        `;
}

// Function to fetch and display extended forecast
async function fetchExtendedForecast(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch forecast data.");
    const data = await response.json();
    displayExtendedForecast(data.list);
  } catch (error) {
    alert(error.message);
  }
}

// Function to display extended forecast
function displayExtendedForecast(forecast) {
  const extendedForecast = document.getElementById("extendedForecast");
  const days = forecast.filter((_, index) => index % 8 === 0); // 5-day forecast (one per day)

  extendedForecast.innerHTML = days
    .map(
      (day) => `
          <div class="bg-white shadow-md rounded-lg p-4 mb-4 max-w-md mx-auto">
            <p class="font-bold">${new Date(day.dt_txt).toDateString()}</p>
            <div class="flex items-center">
              <img
                src="https://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png"
                alt="${day.weather[0].description}"
                class="w-12 h-12"
              />
              <p class="text-lg font-semibold ml-4">${day.main.temp}°C</p>
            </div>
            <p class="text-sm">Humidity: ${day.main.humidity}% | Wind: ${
        day.wind.speed
      } m/s</p>
          </div>
        `
    )
    .join("");
}

// Function to update recent cities dropdown
function updateRecentCities(city) {
  if (!recentCities.includes(city)) {
    recentCities.unshift(city);
    if (recentCities.length > 5) recentCities.pop(); // Keep only the last 5 cities
    localStorage.setItem("recentCities", JSON.stringify(recentCities));
  }
  renderRecentCitiesDropdown();
}

// Function to render recent cities dropdown
function renderRecentCitiesDropdown() {
  const dropdown = document.getElementById("recentCitiesDropdown");
  const select = document.getElementById("recentCities");

  if (recentCities.length > 0) {
    dropdown.style.display = "block";
    select.innerHTML = recentCities
      .map((city) => `<option value="${city}">${city}</option>`)
      .join("");
  } else {
    dropdown.style.display = "none";
  }
}

// Function to fetch weather from dropdown
function searchFromDropdown() {
  const city = document.getElementById("recentCities").value;
  fetchWeather(city);
}

// Initialize dropdown on page load
renderRecentCitiesDropdown();
