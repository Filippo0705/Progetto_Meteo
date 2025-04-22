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
const APIMeteoLink = "http://api.weatherapi.com/v1/current.json?key=433a4377c3ec4e2ca6a123148251004&q=Florence&aqi=no&lang=it";

async function getData(citta) {

    if(citta == ""){

        alert("Inserisci prima una città");
        return;
        
    }
    
    const dataRespons = await fetch(`http://api.weatherapi.com/v1/current.json?key=433a4377c3ec4e2ca6a123148251004&q=${citta}&aqi=no&lang=it`);
    const meteoJson = await dataRespons.json();
    console.log(meteoJson);
    temp.innerHTML = meteoJson.current.temp_c + " C";
    cittaT.innerHTML = meteoJson.location.name;
    nazione.innerHTML = meteoJson.location.country;
    ora.innerHTML = meteoJson.location.localtime;
    precipitazioni.innerHTML = meteoJson.current.precip_in + " %";
    vento.innerHTML = meteoJson.current.wind_kph + " Km/h";
    condizioni.innerHTML = meteoJson.current.condition.text;
    const img = document.createElement("img");
    img.src = meteoJson.current.condition.icon;
    condizioni.append(img);
}


cerca.addEventListener("click", () => {

    getData(cittaInput.value);
    cittaInput.value = "";
    
});
