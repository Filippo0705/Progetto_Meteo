import cardTemplate from "./cardTemplate.js";

// DOM Elements
const body = document.body;

const cittaInput = document.getElementById("inputCitta");
const container = document.getElementById("container");
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
    // Format time for display
    let formattedTime = "";
    if (data.time) {
        const timeOnly = data.time.split(" ")[1];
        formattedTime = timeOnly || data.time;
    }

    const dataList = {
        title: formattedTime,
        subtitle: data.time ? new Date(data.time).toLocaleDateString('it-IT', { weekday: 'long' }) : "",
        time: "",
        temperature: data.temp_c || 0,
        humidity: data.humidity || 0,
        wind: data.wind_kph || 0,
        precipitation: data.precip_in || 0,
        conditions: data.condition || { text: "N/A", icon: "" },
        cardId: id
    }
    return cardTemplate.createWeatherCard(dataList);
}

const generateForecastCol = (data, id = "") => {
    const swiperSlide = document.createElement("div");
    swiperSlide.className = "swiper-slide";
    swiperSlide.innerHTML = generateForecastCard(data, id);
    return swiperSlide;
}

// Create day header for grouping hourly forecasts
const createDayHeader = (date) => {
    const formattedDate = new Date(date).toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    const header = document.createElement("div");
    header.className = "day-header mb-3 mt-4";
    header.innerHTML = `
        <h4 class="text-center text-primary">${formattedDate}</h4>
        <div class="swiper-container mb-4">
            <div class="swiper-wrapper">
                <!-- Hourly forecast cards will be inserted here -->
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
    `;
    return header;
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
    // Clear previous images
    const existingImg = condizioni.querySelector('img');
    if (existingImg) {
        existingImg.remove();
    }

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

// Initialize swiper for a given container
function initSwiper(container) {
    return new Swiper(container, {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            // When screen width is >= 640px
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            // When screen width is >= 768px
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            // When screen width is >= 1024px
            1024: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
        }
    });
}

// Event Listener
cerca.addEventListener("click", async () => {
    let weatherData = await getData(cittaInput.value.trim());
    if (weatherData) {
        setData(weatherData);
        forecastContent.innerHTML = ""; // Clear forecast when changing city
    }
});

forecastBtn.addEventListener("click", async () => {
    // First check if a city has been entered
    if (!cittaInput.value.trim()) {
        alert("Inserisci prima una città");
        return;
    }

    // Clear previous forecast data
    forecastContent.innerHTML = "";

    let weatherData = await getData(cittaInput.value.trim(), "forecast");
    if (!weatherData) return;

    // Create a swiper for each day
    weatherData.forecast.forecastday.forEach((day) => {
        // Create a day header with its own swiper container
        const daySection = createDayHeader(day.date);
        forecastContent.appendChild(daySection);

        // Get the swiper-wrapper for this day
        const swiperWrapper = daySection.querySelector('.swiper-wrapper');

        // Add hourly forecasts to this day's swiper
        day.hour.forEach((hour, hourIndex) => {
            const hourCard = generateForecastCol(hour, `forecast-${day.date}-${hourIndex}`);
            swiperWrapper.appendChild(hourCard);
        });

        // Initialize the swiper for this day
        const swiperContainer = daySection.querySelector('.swiper-container');
        initSwiper(swiperContainer);
    });
});

// Load Swiper.js from CDN
function loadSwiperJS() {
    // Load CSS
    const swiperCSS = document.createElement('link');
    swiperCSS.rel = 'stylesheet';
    swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css';
    document.head.appendChild(swiperCSS);

    // Load JS
    const swiperScript = document.createElement('script');
    swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js';
    document.body.appendChild(swiperScript);

    // Add some additional styles for the swiper
    const customStyles = document.createElement('style');
    customStyles.textContent = `
        .swiper-container {
            width: 100%;
            padding: 10px 30px;
            overflow: hidden;
            position: relative;
        }
        .swiper-slide {
            display: flex;
            justify-content: center;
        }
        .day-header {
            border-top: 1px solid #dee2e6;
            padding-top: 15px;
        }
        #forecast {
            margin-top: 40px;
            max-width: 100%;
            padding: 0 15px;
        }
        .swiper-button-next, .swiper-button-prev {
            color: #0d6efd;
        }
        .swiper-pagination-bullet-active {
            background: #0d6efd;
        }
    `;
    document.head.appendChild(customStyles);
}

// Load Swiper.js when the document loads
document.addEventListener('DOMContentLoaded', loadSwiperJS);