const cittaInput = document.getElementById("inputCitta");
const container = document.getElementById("container");
const citta = document.getElementById("citta");
const temp = document.getElementById("temp");
const APIMeteoLink = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=f525b71042eee1c9a21f67159be80fe4&units=metric&lang=it";
const lat = 0; //latitudine della città
const lon = 0; //longitudine della città

async function getData() {
    
    const dataRespons = await fetch();
    const meteoJson = await JSON.stringify(dataRespons);
    console.log(meteoJson);
    
}

getData();