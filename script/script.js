const APIKey = "433a4377c3ec4e2ca6a123148251004";

async function getData() {
    
    const dataRespons = fetch(APIKey);
    const meteoJson = JSON.stringify(dataRespons);
    console.log(meteoJson);
    
}