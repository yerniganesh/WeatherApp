const input = document.getElementById('input');
const btn = document.getElementById('btn');
const apiKey = 'e3a46268fdc2475cb63214712240202';
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

    // background based on condition
    const isDay = current.is_day === 1 ? 'day' : 'night';
    const codes = [
      [1000], // clear
      [1003, 1006, 1009], // cloudy
      [1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246], // rainy
      [1066, 1114, 1210, 1213, 1216] // snowy
    ];
    const images = [
      `./images/${isDay}/clear.jpg`,
      `./images/${isDay}/cloudy.jpg`,
      `./images/${isDay}/rainy.jpg`,
      `./images/${isDay}/snowy.jpg`
    ];

    for (let i = 0; i < codes.length; i++) {
      if (codes[i].includes(current.condition.code)) {
        body.style.backgroundImage = `url('${images[i]}')`;
        break;
      }
    }
  }
};

const getData = async (city) => {
  try {
    const result = await fetchData(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
    return result;
  } catch {
    return { error: { message: 'Failed to fetch data' } };
  }
};

const getLocationWeather = async (lat, lon) => {
  const result = await fetchData(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`);
  return result;
};

const gotLocation = async (position) => {
  const result = await getLocationWeather(position.coords.latitude, position.coords.longitude);
  updateWeatherInfo(result);
};

const failedLocation = () => console.log('Failed to get location');

// search button
btn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (!input.value) return alert('Please type a city name');
  const result = await getData(input.value);
  updateWeatherInfo(result);
});

// get my location
locBtn.addEventListener('click', () => navigator.geolocation.getCurrentPosition(gotLocation, failedLocation));

// preset cities
[...cities].forEach(el => el.addEventListener('click', async () => {
  const result = await getData(el.innerText);
  updateWeatherInfo(result);
}));

// load current location weather on page load
window.addEventListener('load', () => {
  navigator.geolocation.getCurrentPosition(gotLocation, failedLocation);
});
