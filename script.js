const input = document.getElementById('input');
const btn = document.getElementById('btn');
const apiKey = 'YOUR_API_KEY'; // Replace with your WeatherAPI key
const cityNameEl = document.getElementById('city-name');
const dateTimeEl = document.getElementById('date-time');
const conditionEl = document.getElementById('condition2');
const tempEl = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const countryEl = document.getElementById('country');
const windEl = document.getElementById('wind');
const locBtn = document.getElementById('getlocation');
const cities = document.getElementsByClassName('city');
const iconEl = document.getElementById('icon');
const body = document.querySelector('.weather-app');

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  } catch (err) {
    alert('Failed to fetch weather data!');
  }
};

const updateWeather = (data) => {
  if (!data) return;

  const { location, current } = data;
  cityNameEl.innerText = location.name;
  countryEl.innerText = location.country;
  dateTimeEl.innerText = location.localtime;
  tempEl.innerText = `${current.temp_c}°C`;
  humidityEl.innerText = `${current.humidity}%`;
  windEl.innerText = `${current.wind_kph} km/h`;
  conditionEl.innerText = current.condition.text;
  iconEl.src = current.condition.icon;

  // Background changes dynamically
  if (current.condition.code === 1000) body.style.background = 'linear-gradient(to right, #56CCF2, #2F80ED)'; // clear
  else if ([1003,1006,1009].includes(current.condition.code)) body.style.background = 'linear-gradient(to right, #bdc3c7, #2c3e50)'; // cloudy
  else if ([1063,1180,1183,1186,1189,1192,1195].includes(current.condition.code)) body.style.background = 'linear-gradient(to right, #4e54c8, #8f94fb)'; // rainy
  else body.style.background = 'linear-gradient(to right, #83a4d4, #b6fbff)'; // others
};

const getWeather = async (city) => {
  const data = await fetchData(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
  updateWeather(data);
};

// Search Button
btn.addEventListener('click', () => {
  if (!input.value) return alert('Enter a city name');
  getWeather(input.value);
});

// Preset cities
[...cities].forEach(city => city.addEventListener('click', () => {
  getWeather(city.innerText);
}));

// Geolocation
locBtn.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude, longitude } = pos.coords;
    const data = await fetchData(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`);
    updateWeather(data);
  }, () => alert('Failed to get location!'));
});

// Load default location
window.addEventListener('load', () => {
  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude, longitude } = pos.coords;
    const data = await fetchData(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`);
    updateWeather(data);
  }, () => getWeather('New York'));
});
