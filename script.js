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
//Nome API weather api
const APIKey = "433a4377c3ec4e2ca6a123148251004";
const APIMeteoLink = "https://api.weatherapi.com/v1/current.json?key=433a4377c3ec4e2ca6a123148251004&q=Florence&aqi=no&lang=it";

async function getData(citta) {

    if (citta == "") {

        alert("Inserisci prima una città");
        return;

    }

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=433a4377c3ec4e2ca6a123148251004&q=${citta}&aqi=no&lang=it`);

        if (!response.ok) {
            throw new Error("Città non valida o richiesta fallita");
        }

        const meteoJson = await response.json();
        setData(meteoJson);
        getDataForecast(citta);
        console.log(meteoJson);

    } catch (error) {

        alert(error.message);
        console.error("Errore nel fetch: ", error);

    }

}

function setData(data) {

    temp.innerHTML = data.current.temp_c + " C";
    cittaT.innerHTML = data.location.name;
    nazione.innerHTML = data.location.country;
    ora.innerHTML = data.location.localtime;
    precipitazioni.innerHTML = data.current.precip_in + " %";
    vento.innerHTML = data.current.wind_kph + " Km/h";
    umidita.innerHTML = data.current.humidity + " %";
    condizioni.innerHTML = data.current.condition.text;
    createImg(data.current.condition.icon);
    cambiaSfondo(data.current.condition.text);

}

function createImg(srcImg) {

    const img = document.createElement("img");
    img.src = srcImg;
    condizioni.append(img);

}

function cambiaSfondo(meteo) {

    const body = document.body;

    // Rimuove tutte le classi precedenti che iniziano con "meteo-"
    body.classList.forEach(cls => {
        if (cls.startsWith("meteo-")) {
            body.classList.remove(cls);
        }
    });

    // Normalizza il testo della condizione
    const normalized = meteo
        .toLowerCase()
        .replace(/[àá]/g, "a")
        .replace(/[èé]/g, "e")
        .replace(/[ìí]/g, "i")
        .replace(/[òó]/g, "o")
        .replace(/[ùú]/g, "u")
        .replace(/[^a-z0-9\s]/g, "") // Rimuove caratteri speciali
        .trim()
        .replace(/\s+/g, "-"); // Spazi → trattini

    const classeMeteo = `meteo-${normalized}`;

    // Applica la nuova classe
    body.classList.add(classeMeteo);

}

async function getDataForecast(citta) {

    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=433a4377c3ec4e2ca6a123148251004&q=${citta}&days=7&aqi=no&alerts=no`);

        if (!response.ok) {
            throw new Error("richiesta fallita");
        }

        const meteoJson = await response.json();
        console.log(meteoJson);

    } catch (error) {

        alert(error.message);
        console.error("Errore nel fetch: ", error);

    }

}

cerca.addEventListener("click", () => {

    getData(cittaInput.value);
    cittaInput.value = "";

});