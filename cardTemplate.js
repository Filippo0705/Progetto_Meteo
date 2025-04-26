/* This function creates a weather card template using HTML and Bootstrap classes.
It returns a string containing the HTML structure for the card, with dynamic data. */

function createWeatherCard({ title, subtitle, time, temperature, humidity, wind, precipitation, conditions, cardId = "" }) {
    const id = cardId ? `id="${cardId}"` : "";
    const conditionIcon = conditions.icon ? `<img src="${conditions.icon}" alt="${conditions.text}" class="weather-icon" />` : "";
    return `
      <div ${id} class="card shadow p-4" style="max-width: 420px;">
        <div class="card-body text-center">
  
          <h3 class="card-title mb-0">${title}</h3>
          <h6 class="text-muted">${subtitle}</h6>
          <h6 class="text-secondary mb-4">${time}</h6>
  
          <p class="fs-1 fw-bold text-primary mb-1">${temperature}  °C</p>
          <div class="mb-4 d-flex flex-column align-items-center gap-2">
            ${conditions.text}
            ${conditionIcon}
          </div>
  
          <div class="row text-start text-muted small g-3">
            <div class="col-4">
              <div class="section-title">Umidità</div>
              <div>${humidity} %</div>
            </div>
            <div class="col-4">
              <div class="section-title">Vento</div>
              <div>${wind} km/h</div>
            </div>
            <div class="col-4">
              <div class="section-title">Precipitazioni</div>
              <div>${precipitation} %</div>
            </div>
          </div>
  
        </div>
      </div>
    `;
}

export default { createWeatherCard };