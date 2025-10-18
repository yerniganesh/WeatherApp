const input = document.getElementById('input');
const btn = document.getElementById('btn');
const apiKey = 'YOUR_API_KEY'; // Replace with your WeatherAPI key
const cityNameEl = document.getElementById('city-name');
const dateTimeEl = document.getElementById('date-time');
const conditionEl = document.getElementById('condition2');
const tempEl = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const countryEl = document.getElementById('country');
const locBtn = document.getElementById('getlocation');
const cities = document.getElementsByClassName('city');
const iconEl = document.getElementById('icon');
const body = document.querySelector('.weather-app');

const fetchData = async (url) => {
  try {
    const data = await fetch(url);
    if (!data.ok) throw new Error(data.statusText);
    return data.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateWeatherInfo = (result) => {
  const { error, location, current } = result;
  if (error) {
    cityNameEl.innerText = `Error: ${error.message}`;
    [countryEl, dateTimeEl, tempEl, humidityEl, conditionEl, iconEl].forEach(el => el.innerText = '');
    iconEl.src = '';
  } else {
    cityNameEl.innerText = location.name;
    countryEl.innerText = location.country;
    dateTimeEl.innerText = location.localtime;
    tempEl.innerText = `${current.temp_c} °C`;
    humidityEl.innerText = `${current.humidity} %`;
    conditionEl.innerText = current.condition.text;
    iconEl.src = current.condition.icon;

    // Optional: Change background based on weather
    const isDay = current.is_day === 1 ? 'day' : 'night';
    if (current.condition.code === 1000) body.style.background = 'linear-gradient(to top, #56ccf2, #2f80ed)'; // clear
    else if ([1003, 1006, 1009].includes(current.condition.code)) body.style.background = 'linear-gradient(to top, #bdc3c7, #2c3e50)'; // cloudy
    else if ([1063, 1180, 1183, 1186, 1189, 1192, 1195].includes(current.condition.code)) body.style.background = 'linear-gradient(to top, #4e54c8, #8f94fb)'; // rainy
    else body.style.background = 'linear-gradient(to top, #83a4d4, #b6fbff)'; // snow or others
  }
};

const getData = async (city) => {
  try {
    return await fetchData(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
  } catch {
    return { error: { message: 'Failed to fetch data' } };
  }
};

const getLocationWeather = async (lat, lon) => {
  return await fetchData(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`);
};

const gotLocation = async (position) => {
  const result = await getLocationWeather(position.coords.latitude, position.coords.longitude);
  updateWeatherInfo(result);
};

const failedLocation = () => console.log('Failed to get location');

// Search button
btn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (!input.value) return alert('Please type a city name');
  const result = await getData(input.value);
  updateWeatherInfo(result);
});

// Geolocation button
locBtn.addEventListener('click', () => navigator.geolocation.getCurrentPosition(gotLocation, failedLocation));

// Preset cities
[...cities].forEach(el => el.addEventListener('click', async () => {
  const result = await getData(el.innerText);
  updateWeatherInfo(result);
}));

// Load current location weather on page load
window.addEventListener('load', () => {
  navigator.geolocation.getCurrentPosition(gotLocation, failedLocation);
});
