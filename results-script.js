import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js';
import { getDatabase, ref, onValue, get } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyBd9jVpyObrm7wZjY8uQudURMU1S2aQshM",
  authDomain: "hospital-6525a.firebaseapp.com",
  databaseURL: "https://hospital-6525a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hospital-6525a",
  storageBucket: "hospital-6525a.appspot.com",
  messagingSenderId: "687566722505",
  appId: "1:687566722505:web:a6db6c7f14b1bfb52e4418",
  measurementId: "G-FCLV70JYZE"
};
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getDatabase(getApp());

const selectedCountry = new URLSearchParams(window.location.search).get('country');
const selectedDisease = new URLSearchParams(window.location.search).get('disease');

document.getElementById("selectedCountry").innerText = selectedCountry;
document.getElementById("selectedDisease").innerText = selectedDisease;

const diagnosisToRateRef = ref(db, 'DiagnosisToRate');
const countryRatingsRef = ref(db, 'CountryRatings');
const flightPricingRef = ref(db, 'FlightCosts');

async function fetchData() {
  const diagnosisToRateData = await getDatabaseData(diagnosisToRateRef);
  const countryRatingsData = await getDatabaseData(countryRatingsRef);
  const flightPricingData = await getDatabaseData(flightPricingRef);

  displayDestinationCountries(diagnosisToRateData, countryRatingsData, flightPricingData);
}

function getDatabaseData(databaseRef) {
  return new Promise(async (resolve, reject) => {
    try {
      const snapshot = await get(databaseRef);
      resolve(snapshot.val());
    } catch (error) {
      reject(error);
    }
  });
}

fetchData().catch((error) => console.error('Error fetching data:', error));

function displayDestinationCountries(diagnosisToRateData, countryRatingsData, flightPricingData) {
  const mainElement = document.querySelector("main");

  for (const country in diagnosisToRateData) {
    if (diagnosisToRateData.hasOwnProperty(country)) {
      const diagnosisToRate = diagnosisToRateData[country];
      const cost = diagnosisToRate[selectedDisease];

      if (cost) {
        const card = document.createElement("div");
        card.className = "card";

        const countryHeader = document.createElement("h2");
        countryHeader.textContent = country;
        card.appendChild(countryHeader);

        const leftColumn = document.createElement("div");
        leftColumn.className = "left-column";

        const ratings = countryRatingsData[country];
        if (ratings) {
          const ratingsTable = document.createElement("table");
          const tbody = document.createElement("tbody");

          Object.entries(ratings).forEach(([key, value], index) => {
            if (index % 2 === 0) {
              const tr = document.createElement("tr");
              const th = document.createElement("th");
              th.textContent = `${key.replace(/_/g, ' ')}:`;
              const td = document.createElement("td");
              td.textContent = value;
              tr.appendChild(th);
              tr.appendChild(td);
              tbody.appendChild(tr);
            } else {
              const tr = tbody.lastElementChild;
              const th = document.createElement("th");
              th.textContent = `${key.replace(/_/g, ' ')}:`;
              const td = document.createElement("td");
              td.textContent = value;
              tr.appendChild(th);
              tr.appendChild(td);
            }
          });

          ratingsTable.appendChild(tbody);
          leftColumn.appendChild(ratingsTable);
        }

        card.appendChild(leftColumn);

        const rightColumn = document.createElement("div");
        rightColumn.className = "right-column";

        const costHeader = document.createElement("h3");
        costHeader.textContent = `Cost: $${cost.toLocaleString()}`;
        rightColumn.appendChild(costHeader);

        const flightCosts = flightPricingData[country] && flightPricingData[country][selectedCountry];
        if (flightCosts) {
          const flightCostsElement = document.createElement("p");
          flightCostsElement.className = "flight-costs";
          flightCostsElement.innerHTML = `Flight costs: <span class="highlighted">$${flightCosts.Floor.toLocaleString()}</span> - <span class="highlighted">$${flightCosts.Ceiling.toLocaleString()}</span>`;
          rightColumn.appendChild(flightCostsElement);
        } else {
          const flightCostsElement = document.createElement("p");
          flightCostsElement.textContent = "Flight costs: not available - not available";
          rightColumn.appendChild(flightCostsElement);
        }

        card.appendChild(rightColumn);
        mainElement.appendChild(card);
      }
    }
  }
}
