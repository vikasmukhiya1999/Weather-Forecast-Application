const API_KEY = "2311494df380589310eb6d56646ec070";
const baseURL = `https://api.openweathermap.org/data/2.5/forecast?`;

const STORAGE_KEY = "searchHistory";
let searchHistory = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const cityInput = document.getElementById("city-input");
const myLocation = document.getElementById("my-location");
const DisplaySearchHistory = document.getElementById("search-history");

cityInput.addEventListener("change", (e) => {
  const cityName = e.target.value;
  if (cityInput) {
    fetchData(`${baseURL}q=${cityName}&units=metric&appid=${API_KEY}`);
    cityInput.value = "";
    DisplaySearchHistory.parentElement.classList.add("hidden");
  }
});

cityInput.addEventListener("click", () => {
  if (searchHistory.length > 1) {
    DisplaySearchHistory.parentElement.classList.remove("hidden");
  }
});

cityInput.addEventListener("focus", () => {
  if (searchHistory.length > 1) {
    DisplaySearchHistory.innerHTML = "";
    searchHistory.forEach((cityName) => {
      const listItem = document.createElement("li");
      listItem.className =
        "text-gray-800 hover:bg-gray-100 p-2 rounded-md cursor-pointer";
      listItem.textContent = cityName;
      listItem.addEventListener("click", () => {
        fetchData(`${baseURL}q=${cityName}&units=metric&appid=${API_KEY}`);
        setTimeout(() => {
          DisplaySearchHistory.parentElement.classList.add("hidden");
        }, 200);
      });
      DisplaySearchHistory.parentElement.classList.remove("hidden");
      DisplaySearchHistory.appendChild(listItem);
    });
  }
});

cityInput.addEventListener("blur", () => {
  setTimeout(() => {
    DisplaySearchHistory.innerHTML = "";
    DisplaySearchHistory.parentElement.classList.add("hidden");
  }, 100);
});

myLocation.addEventListener("click", () => {
  getLocationWeather();
});

const getLocationWeather = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchData(`${baseURL}lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
  });
};

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const weatherData = await response.json();
    displayWeatherData(weatherData);
  } catch (error) {
    console.error(error);
    console.log(error.message);
    alert("City not found. Please enter a valid city name.");
  }
};

const saveHistyory = (cityName) => {
  if (!searchHistory.includes(cityName)) {
    if (searchHistory.length > 4) {
      searchHistory.pop();
      searchHistory.unshift(cityName);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory));
    } else {
      searchHistory.unshift(cityName);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory));
    }
  }
};

const displayWeatherData = (data) => {
  const optionsDay = { weekday: "short" }; // Full day name (e.g., "Tuesday")
  const optionsDate = { day: "numeric" }; // Day of the month (e.g., "28")
  const optionsMonth = { month: "short" }; // Short month name (e.g., "Jan")
  const optionsYear = { year: "numeric" }; // 4-digit year (e.g., "2022")
  const optionsTime = { hour: "numeric", minute: "numeric", hour12: true };

  const utcDate = new Date();

  const currentDay = new Intl.DateTimeFormat(navigator.language, optionsDay);
  const currentDate = new Intl.DateTimeFormat(navigator.language, optionsDate);
  const currentMonth = new Intl.DateTimeFormat(
    navigator.language,
    optionsMonth
  );
  const currentYear = new Intl.DateTimeFormat(navigator.language, optionsYear);
  const currentTime = new Intl.DateTimeFormat(navigator.language, optionsTime); //.format(new Date(data.list[index].dt_txt)) ;

  const mainHeader = document.getElementById("main-header");
  const mainBody = document.getElementById("main-body");
  const mainFooter = document.getElementById("main-footer");
  const hourlyForecast = document.getElementById("hourly-forecast");
  const dailyForecast = document.getElementById("daily-forecast");

  mainHeader.innerHTML = `
    <h2 id="city-name" class="text-3xl font-bold">${data.city.name}, ${
    data.city.country
  }</h2>
    <p id="region-date-time" class="text-sm text-gray-600">${currentDay.format(
      utcDate
    )}, ${currentDate.format(utcDate)}-${currentMonth.format(
    utcDate
  )}-${currentYear.format(utcDate)}</p>
    <p id="lat-lon" class="text-xs text-gray-400" >lat: ${
      data.city.coord.lat
    }, lon: ${data.city.coord.lon}</p>
  `;

  mainBody.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${
      data.list[0].weather[0].icon
    }@2x.png" alt="weather img"
    class="drop-shadow-[5px_5px_5px_rgba(50,50,50,0.50)] w-24 h-24 lg:w-32 lg:h-32" />
    <div class="ml-4 text-left">
    <div class="text-6xl mb-2">${Math.round(data.list[0].main.temp)}&deg;</div>
    <p class="text-lg text-gray-700">Feels like ${Math.round(
      data.list[0].main.feels_like
    )}&deg;C</p>
    <p class="text-lg text-gray-800">${data.list[0].weather[0].main}, ${
    data.list[0].weather[0].description
  }</p>
    <p class="text-sm text-gray-700">High: ${Math.round(
      data.list[0].main.temp_max
    )}&deg;C | Low: ${Math.round(data.list[0].main.temp_min)}&deg;C</p>
    </div>
    `;

  mainFooter.innerHTML = `
    <div  class="bg-teal-50 p-6 rounded-lg shadow-md flex items-center justify-center space-x-2">
        <span class="material-icons text-teal-500">water_drop</span>
        <div>
          <p class="font-medium">Humidity</p>
          <p class="text-gray-700">${data.list[0].main.humidity}%</p>
        </div>
      </div>

      <div class="bg-teal-50 p-6 rounded-lg shadow-md flex items-center justify-center space-x-2">
        <span class="material-icons text-teal-500">air</span>
        <div>
          <p class="font-medium">Wind</p>
          <p class="text-gray-700">${data.list[0].wind.speed} km/h </p>
        </div>
      </div>

      <div class="bg-teal-50 p-6 rounded-lg shadow-md flex items-center justify-center space-x-2">
        <span class="material-icons text-teal-500">pool</span>
        <div>
          <p class="font-medium">Sea Level</p>
          <p class="text-gray-700">${data.list[0].main.sea_level} hPa</p>
        </div>
      </div>

      <div class="bg-teal-50 p-6 rounded-lg shadow-md flex items-center justify-center space-x-2">
        <span class="material-icons text-teal-500">density_small</span>
        <div>
          <p class="font-medium">Density</p>
          <p class="text-gray-700">${data.city.population} sqmi</p>
        </div>
      </div>
    `;

  for (const index in data.list) {
    if (Object.prototype.hasOwnProperty.call(data.list, index)) {
      hourlyForecast.innerHTML += `<div
          class="bg-gradient-to-b from-teal-100 to-teal-50 p-4 rounded-lg shadow-md flex flex-col items-center min-w-[120px]">
          <p class="font-medium">${currentDate.format(
            new Date(data.list[index].dt_txt)
          )}-${currentMonth.format(new Date(data.list[index].dt_txt))}</p>
          <p class="text-xs text-gray-500">${currentTime.format(
            new Date(data.list[index].dt_txt)
          )}</p>
          <img class="drop-shadow-[5px_5px_5px_rgba(50,50,50,0.50)]" src="https://openweathermap.org/img/wn/${
            data.list[index].weather[0].icon
          }@2x.png" alt="Sunny" class="w-10 h-10 my-1" />
          <p class="text-gray-700">${Math.round(
            data.list[index].main.temp
          )}&deg;C</p>
          <p class="text-xs text-gray-500">${
            data.list[index].weather[0].main
          }</p>
        </div>
      `;
    }
  }

  for (let index = 1; index <= data.list.length; index += 8) {
    dailyForecast.innerHTML += `
      <div class="flex flex-col bg-gradient-to-r from-teal-100 to-teal-50 p-4 rounded-xl shadow-md min-w-80 mx-1 mb-2">
        <!-- Top Section: Date and Icon -->
        <div class="flex justify-between items-center mb-2">
          <div>
            <p class="text-lg font-semibold text-gray-800">${currentDay.format(
              new Date(data.list[index].dt_txt)
            )}</p>
            <p class="text-sm text-gray-600"> ${currentDate.format(
              new Date(data.list[index].dt_txt)
            )}-${currentMonth.format(
      new Date(data.list[index].dt_txt)
    )}-${currentYear.format(new Date(data.list[index].dt_txt))}</p>
          </div>
          <img class="drop-shadow-[5px_5px_5px_rgba(50,50,50,0.50)]" src="https://openweathermap.org/img/wn/${
            data.list[index].weather[0].icon
          }@2x.png" alt="Weather Icon" class="w-14 h-14" />
        </div>

        <!-- Middle Section: Temperature Details -->
        <div class="flex justify-between items-center border-t pt-2">
          <div class="text-center">
            <p class="text-sm font-semibold text-teal-600">High</p>
            <p class="text-lg font-bold text-gray-800">${Math.round(
              data.list[index].main.temp_max
            )}&deg;C</p>
          </div>
          <div class="text-center">
            <p class="text-sm font-semibold text-teal-600">Low</p>
            <p class="text-lg font-bold text-gray-800">${Math.round(
              data.list[index].main.temp_min
            )}&deg;C</p>
          </div>
          <div class="text-center">
            <p class="text-sm font-semibold text-teal-600">Feels Like</p>
            <p class="text-lg font-bold text-gray-800">${Math.round(
              data.list[index].main.feels_like
            )}&deg;C</p>
          </div>

        </div>

        <!-- Bottom Section: Additional Info -->
        <div class="flex justify-between items-center border-t pt-2 mt-2 text-sm">
          <div class="flex items-center">
            <span class="material-icons text-teal-500 mr-1">water_drop</span>
            <p>Humidity: ${data.list[index].main.humidity}%</p>
          </div>
          <div class="flex items-center">
            <span class="material-icons text-teal-500 mr-1">air</span>
            <p>Wind: ${data.list[index].wind.speed} km/h</p>
          </div>
        </div>
      </div>
      `;
  }

  saveHistyory(data.city.name);
};

// IIFE for first time location fetching //
(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetchData(`${baseURL}lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
  });
})();
