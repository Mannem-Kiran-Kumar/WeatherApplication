const apiKey = '3caabbdf703730aa74fcb7bcdd433ffe';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const descriptionElement = document.getElementById('description');
const feelsLikeElement = document.getElementById('feelslike');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');
const pressureElement = document.getElementById('pressure');
const weatherIcon = document.getElementById('weatherIcon');

searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    } else {
        alert("Please Enter a Location");
    }
});

function fetchWeather(location) {
  const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Invalid Location");
      return response.json();
    })
    .then(data => {
      updateWeatherUI(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      alert("Please Enter a Valid Location");
    });
}

function fetchWeatherByCoords(lat, lon) {
  const url = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      updateWeatherUI(data);
    })
    .catch(error => console.error('Error fetching geolocation weather:', error));
}

function updateWeatherUI(data) {
  const condition = data.weather[0].description;
  const emoji = getWeatherEmoji(condition.toLowerCase());
  const iconCode = data.weather[0].icon;
  locationElement.textContent = `${data.name}`;
  descriptionElement.textContent = `🌥️ Condition: ${condition} ${emoji}`;
  feelsLikeElement.textContent = `🤗 Feels Like: ${Math.round(data.main.feels_like)}°C`;
  humidityElement.textContent = `💧 Humidity: ${data.main.humidity}%`;
  windElement.textContent = `🌬️ Wind Speed: ${data.wind.speed} m/s`;
  pressureElement.textContent = `📏 Pressure: ${data.main.pressure} hPa`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  changeBackground(condition.toLowerCase());
}

function getWeatherEmoji(condition) {
  if (condition.includes("clear")) return "☀️";
  if (condition.includes("cloud")) return "☁️";
  if (condition.includes("rain")) return "🌧️";
  if (condition.includes("drizzle")) return "🌦️";
  if (condition.includes("thunderstorm")) return "⛈️";
  if (condition.includes("snow")) return "❄️";
  if (condition.includes("mist") || condition.includes("fog")) return "🌫️";
  return "🌈";
}

function changeBackground(condition) {
  if (condition.includes("clear")) {
    document.body.style.backgroundImage = "url('assets/images/clear.gif')";
  } else if (condition.includes("cloud")) {
    document.body.style.backgroundImage = "url('assets/images/cloudy.gif')";
  } else if (condition.includes("rain")) {
    document.body.style.backgroundImage = "url('assets/images/rain.gif')";
  } else if (condition.includes("snow")) {
    document.body.style.backgroundImage = "url('assets/images/snow.jpg')";
  } else if (condition.includes("thunderstorm")) {
    document.body.style.backgroundImage = "url('assets/images/thunder.jpg')";
  } else {
    document.body.style.backgroundImage = "url('assets/images/default.jpg')";
  }

  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
}

window.onload = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherByCoords(lat, lon);
    }, () => {
      console.log("Geolocation denied or not available.");
    });
  }
};