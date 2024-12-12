const link =
  "http://api.weatherstack.com/current?access_key=a1f9967bd84999b58819a1fc2d839a29";


const root = document.getElementById("root");
const popup = document.getElementById("popup");
const textInput = document.getElementById("text-input");
const form = document.getElementById("form");

let store = {
  city: "Томск",
  temperature: 0,
  observationTime: "",
  isDay: "yes",
  description: "00:00 ",
  properties: {
    cloudcover: {},
    humidity: {},
    windSpeed: {},
    pressure: {},
    uvIndex: {},
    visibility: {},
    feelslike:{},
    windDir:{},
    windDegree:{},
  },
};

const fetchData = async () => {
  try {
    const query = localStorage.getItem("query") || store.city;
    const result = await fetch(`${link}&query=${query}`);
    const data = await result.json();

    const {
      current: {
        cloudcover,
        temperature,
        humidity,
        observation_time: observationTime,
        pressure,
        uv_index: uvIndex,
        visibility,
        is_day: isDay,
        weather_descriptions: description,
        wind_speed: windSpeed,
        feelslike,
        wind_dir: windDir,
        wind_degree: windDegree,
        precip,
      },
      location: { name },
    } = data;

    store = {
      ...store,
      isDay,
      city: name,
      temperature,
      observationTime,
      windDir,
      windDegree,
      precip,
      description: description[0],
      properties: {
        cloudcover: {
          title: "Облачность",
          value: `${cloudcover}%`,
          icon: "cloud.png",
        },
        humidity: {
          title: "Влажность",
          value: `${humidity}%`,
          icon: "humidity.png",
        },
        windSpeed: {
          title: "Скорость ветра",
          value: `${windSpeed} км/ч`,
          icon: "wind.png",
        },
        pressure: {
          title: "Давление",
          value: `${pressure * 0.75006375541921} мм.рт.ст.`,
          icon: "gauge.png",
        },
        uvIndex: {
          title: "Ультрафиолетовый индекс",
          value: `${uvIndex} / 100`,
          icon: "uv-index.png",
        },
        visibility: {
          title: "Видимость",
          value: `${visibility}%`,
          icon: "visibility.png",
        },
        feelslike: {
          title: "По ошущениям ",
          value: `${feelslike}°C`,
          icon: "osh.png",
        },
        windDir: {
          title: "Направление ветра ",
          value: `${windDir}`,
          icon: "www.png",
        },
        windDegree: {
          title: "Градус ветра",
          value: `${windDegree}°`,
          icon: "wind.png",
        },
        precip: {
          title: "Уровень осадков",
          value: `${precip} мм`,
          icon: "cap.png",
        }
      },
    };

    renderComponent();
  } catch (err) {
    console.log(err);
  }
};

const getImage = (description) => {
  const value = description.toLowerCase();

  switch (value) {
    case "partly cloudy":
      return "partly cloudy.gif";
    case "light drizzle":
      return "do.gif";
    case "cloud":
      return "cloudy.gif";
    case "rain":
      return "rain.gif";
    case "fog":
      return "fog.gif";
    case "sunny":
      return "sunny.gif";
    case "heavy snow":
      return "snow.gif";
    default:
      return "the.png";
  }
};

const renderProperty = (properties) => {
  return Object.values(properties)
    .map(({ title, value, icon }) => {
      return `<div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${value}</div>
              <div class="property-info__description">${title}</div>
            </div>
          </div>`;
    })
    .join("");
};

const markup = () => {
  const { city, description, observationTime, temperature, isDay, properties } =
    store;
  const containerClass = isDay === "yes" ? "is-day" : "";

  return `<div class="container ${containerClass}">
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Погода в городе </div>
                  <div class="city-title" id="city">
                  <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
                <img class="icon" src="./img/${getImage(description)}" alt="" />
                <div class="description">${description}</div>
              </div>
            
              <div class="top-right">
              <div class="city-info__subtitle">Время получения данных: ${observationTime}</div>
                <div class="city-info__title">${temperature}°C</div>
              </div>
            </div>
          </div>
        <div id="properties">${renderProperty(properties)}</div>
      </div>`;
};

const togglePopupClass = () => {
  popup.classList.toggle("active");
};

const renderComponent = () => {
  root.innerHTML = markup();

  const city = document.getElementById("city");
  city.addEventListener("click", togglePopupClass);
};

const handleInput = (e) => {
  store = {
    ...store,
    city: e.target.value,
  };
};

const handleSubmit = (e) => {
  e.preventDefault();
  const value = store.city;

  if (!value) return null;

  localStorage.setItem("query", value);
  fetchData();
  togglePopupClass();
};

form.addEventListener("submit", handleSubmit);
textInput.addEventListener("input", handleInput);

fetchData();


let switchMode=document.getElementById("switchMode");
switchMode.onclick = function (){
  let theme = document.getElementById("theme")
  if(theme.getAttribute("href")==="light-mode-style.css"){
    theme.href = "dark-mode-style.css";
  } else{
    theme.href = "light-mode-style.css"
  }
}