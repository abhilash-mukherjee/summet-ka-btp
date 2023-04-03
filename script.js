const countrySelect = document.getElementById("country");
const diseaseSelect = document.getElementById("disease");
const compareBtn = document.getElementById("compare");

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js';
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
}
initializeApp(firebaseConfig);

const db = getDatabase();

function fetchDiseases() {
  const diseasesRef = ref(db, 'Diseases');
  onValue(diseasesRef, (snapshot) => {
    const diseases = JSON.parse(snapshot.val());
    populateDiseaseSelect(diseases);
  }, {
    onlyOnce: true
  });
}
function fetchCountries() {
  const countriesRef = ref(db, 'SourceCountries');
  onValue(countriesRef, (snapshot) => {
    const countries = JSON.parse(snapshot.val());
    populateCountrySelect(countries);
  }, {
    onlyOnce: true
  });
}

function populateDiseaseSelect(diseases) {
  const countrySelect = document.getElementById('disease');
  diseases.forEach((disease) => {
    const option = document.createElement('option');
    option.value = disease;
    option.textContent = disease;
    countrySelect.appendChild(option);
  });
}

function populateCountrySelect(diseases) {
  const countrySelect = document.getElementById('country');
  diseases.forEach((country) => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });
}

fetchDiseases();
fetchCountries();

compareBtn.addEventListener("click", function(e) {
  e.preventDefault();
  if (countrySelect.value === "" || diseaseSelect.value === "") {
    alert("Please select a country and a disease.");
  } else {
    // Perform price comparison here
    showModal();
    console.log("Comparison successful!");
  }
});

function showModal() {
  const modal = document.querySelector(".modal");
  if (modal) {
    modal.style.display = "block";

    const closeBtn = modal.querySelector(".close-modal");
    closeBtn.addEventListener("click", function() {
      modal.style.display = "none";
    });
  }
}
compareBtn.addEventListener("click", function(e) {
  e.preventDefault();
  if (countrySelect.value === "" || diseaseSelect.value === "") {
    alert("Please select a country and a disease.");
  } else {
    // Redirect to the results page with country and disease as URL parameters
    window.location.href = `results.html?country=${encodeURIComponent(countrySelect.value)}&disease=${encodeURIComponent(diseaseSelect.value)}`;
  }
});
