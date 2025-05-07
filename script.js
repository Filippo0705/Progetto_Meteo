import cardTemplate from "./cardTemplate.js";

// DOM Elements
const body = document.body;

const cittaInput = document.getElementById("inputCitta");
const container = document.getElementById("container"); // not used in the current code but kept for potential future use
const cittaT = document.getElementById("citta");
const temp = document.getElementById("temp");
const cerca = document.getElementById("cerca");
const nazione = document.getElementById("nazione");
const ora = document.getElementById("ora");
const precipitazioni = document.getElementById("precipitazioni");
const vento = document.getElementById("vento");
const condizioni = document.getElementById("condizioni");
const umidita = document.getElementById("umidita");

const forecastBtn = document.getElementById("mostraForecast");
const forecastContent = document.querySelector("#forecastCards");

// API Info
const API_KEY = "433a4377c3ec4e2ca6a123148251004";
const BASE_URL = "https://api.weatherapi.com/v1/";

// Builds the full endpoint URL dynamically
function buildWeatherEndpoint(city, type = "current") {
    const endpointPath = `${type}.json`;

    const params = new URLSearchParams({
        key: API_KEY,
        q: city,
        aqi: "no",
        lang: "it",
        days: 3 // For forecast, you can adjust this as needed
    });

    return `${BASE_URL}${endpointPath}?${params.toString()}`;
}

async function getData(city, type = "current") {
    if (!city) {
        alert("Inserisci prima una città");
        return;
    }

    try {
        const response = await fetch(buildWeatherEndpoint(city, type));

        if (!response.ok) {
            throw new Error("Richiesta fallita");
        }

        const weatherData = await response.json();
        console.log(weatherData);

        return weatherData;
    } catch (error) {
        alert(error.message);
        console.error("Errore nel fetch: ", error);
        return null;
    }
}

const generateForecastCard = (data, id = "") => {
    const dataList = {
        time: data.time,
        temperature: data.temp_c,
        humidity: data.humidity,
        wind: data.wind_kph,
        precipitation: data.precip_in,
        conditions: data.condition,
        cardId: id
    }
    return cardTemplate.createWeatherCard(dataList);
}

const generateForecastCol = (data, id = "") => {
    const col = document.createElement("div");
    col.classList.add("col-12", "col-md-4", "col-lg-3", "mb-4", "d-flex", "justify-content-center");
    col.innerHTML = generateForecastCard(data, id);
    return col;
}

function setData(data) {
    temp.innerHTML = `${data.current.temp_c} °C`;
    cittaT.innerHTML = data.location.name;
    nazione.innerHTML = data.location.country;
    ora.innerHTML = data.location.localtime;
    precipitazioni.innerHTML = `${data.current.precip_in} %`;
    vento.innerHTML = `${data.current.wind_kph} Km/h`;
    umidita.innerHTML = `${data.current.humidity} %`;
    condizioni.innerHTML = data.current.condition.text;

    createImg(data.current.condition.icon);
    cambiaSfondo(data.current.condition.text);
}

function createImg(srcImg) {
    const img = document.createElement("img");
    img.src = srcImg;
    condizioni.append(img);
}

function cambiaSfondo(meteoCondition) {

    // Remove previous weather classes
    body.classList.forEach(cls => {
        if (cls.startsWith("meteo-")) {
            body.classList.remove(cls);
        }
    });

    // Normalize the condition text to a safe CSS class
    const normalizedCondition = meteoCondition
        .toLowerCase()
        .normalize("NFD").replace(/[̀-ͯ]/g, "") // Remove accents
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    const weatherClass = `meteo-${normalizedCondition}`;
    body.classList.add(weatherClass);
}

// Event Listener
cerca.addEventListener("click", async () => {
    let weatherData = await getData(cittaInput.value.trim(), "forecast");
    setData(weatherData);
    forecastContent.innerHTML = "";
});

forecastBtn.addEventListener("click", async () => {
    let weatherData = await getData(cittaInput.value.trim(), "forecast");
    if (!weatherData) return;
    weatherData.forecast.forecastday.map((day, index) => {
        day.hour.map((hour) => {
            forecastContent.appendChild(generateForecastCol(hour, `forecast-${day + hour}`))

        });
    });
});