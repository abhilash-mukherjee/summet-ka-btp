import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js';

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

onValue(diagnosisToRateRef, (snapshot) => {
  const diagnosisToRateData = snapshot.val();
  onValue(countryRatingsRef, (snapshot) => {
    const countryRatingsData = snapshot.val();
    onValue(flightPricingRef, (snapshot) => {
      const flightPricingData = snapshot.val();
      displayDestinationCountries(diagnosisToRateData, countryRatingsData, flightPricingData);
    });
  });
});

function displayDestinationCountries(diagnosisToRateData, countryRatingsData, flightPricingData) {
  const destinationCountriesList = document.getElementById("destinationCountriesList");

  for (const country in diagnosisToRateData) {
    if (diagnosisToRateData.hasOwnProperty(country)) {
      const cost = diagnosisToRateData[country][selectedDisease];

      if (cost) {
        const listItem = document.createElement("li");
        listItem.textContent = `${country}: ${cost}`;

        const ratings = countryRatingsData[country];
        if (ratings) {
          const ratingsText = Object.entries(ratings).map(([key, value]) => `${key}: ${value}`).join(', ');
          listItem.textContent += ` | Ratings: ${ratingsText}`;
        }
        const flightCosts = flightPricingData[country] && flightPricingData[country][selectedCountry];
        if (flightCosts) {
          const flightCostsText = `Flight costs (Floor - Ceiling): ${flightCosts.floor_price} - ${flightCosts.ceiling_price}`;
          listItem.textContent += ` | ${flightCostsText}`;
        }
    
        destinationCountriesList.appendChild(listItem);
      }
    }
  }
}