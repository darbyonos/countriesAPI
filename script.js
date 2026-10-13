// ========================================
// API URL
// ========================================

const API_URL =
    "https://api.restcountries.com/countries/v5/name";

const MY_API_KEY = "rc_live_d5b405e311a643b6b9d8d6b2a2adf557";


// ========================================
// HTML ELEMENTS
// ========================================

const searchForm = document.querySelector("#searchForm");
const countryInput = document.querySelector("#countryInput");
const countryResult = document.querySelector("#countryResult");

const countryFlag = document.querySelector("#countryFlag");
const countryName = document.querySelector("#countryName");

const capital = document.querySelector("#capital");
const population = document.querySelector("#population");
const region = document.querySelector("#region");
const continent = document.querySelector("#continent");
const currency = document.querySelector("#currency");
const languages = document.querySelector("#languages");

const loading = document.querySelector("#loading");
const errorMessage = document.querySelector("#errorMessage");
const welcomeMessage = document.querySelector("#welcomeMessage");


// ========================================
// SEARCH EVENT
// ========================================

searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const country = countryInput.value.trim();

    if (country === "") {
        showError("Please enter a country name.");
        return;
    }

    searchCountry(country);

});


// ========================================
// SEARCH COUNTRY
// ========================================

async function searchCountry(country) {

    try {

        // Show loading message

        loading.classList.remove("hidden");

        errorMessage.classList.add("hidden");
        countryResult.classList.add("hidden");
        welcomeMessage.classList.add("hidden");


        // Build the API URL

        const params = new URLSearchParams({
            q: country,
            response_fields:
                "names.common,capitals,population,region,continents,currencies,languages,flag.url_svg,flag.description"
        });

        const url = `${API_URL}?${params.toString()}`;


        // Send request to the API

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${MY_API_KEY}`
            }
        });


        // Check whether the request succeeded

        if (!response.ok) {
            throw new Error("Country search failed.");
        }


        // Convert response to JSON

        const responseData = await response.json();


        // Get the countries from the API response

        const countries = responseData.data?.objects;


        if (!Array.isArray(countries) || countries.length === 0) {
            throw new Error("Country not found.");
        }


        // Prefer an exact country-name match

        const countryData = countries.find(function (item) {
            return item.names?.common?.toLowerCase() ===
                country.toLowerCase();
        }) || countries[0];


        // Display the country information

        displayCountry(countryData);

    } catch (error) {

        console.error("Country search error:", error);

        showError(
            "Unable to find that country. Check the spelling or try again."
        );

    } finally {

        // Hide loading message

        loading.classList.add("hidden");

    }

}


// ========================================
// DISPLAY COUNTRY
// ========================================

function displayCountry(countryData) {

    // Country flag

    countryFlag.src = countryData.flag?.url_svg || "";

    countryFlag.alt =
        countryData.flag?.description ||
        `${countryData.names?.common || "Country"} flag`;


    // Country name

    countryName.textContent =
        countryData.names?.common || "N/A";


    // Capital

    const capitals = countryData.capitals || [];

    capital.textContent = capitals.length
        ? capitals.map(function (item) {
            return typeof item === "string" ? item : item.name;
        }).filter(Boolean).join(", ")
        : "N/A";


    // Population

    population.textContent =
        typeof countryData.population === "number"
            ? countryData.population.toLocaleString()
            : "N/A";


    // Region

    region.textContent =
        countryData.region || "N/A";


    // Continent

    const continents = countryData.continents || [];

    continent.textContent =
        continents.length ? continents.join(", ") : "N/A";


    // Currency

    if (countryData.currencies) {

        const currencyList = Object.values(countryData.currencies);

        currency.textContent = currencyList.map(function (item) {

            if (typeof item === "string") {
                return item;
            }

            if (item.symbol && item.name) {
                return `${item.name} (${item.symbol})`;
            }

            return item.name || item.code || "";

        }).filter(Boolean).join(", ") || "N/A";

    } else {

        currency.textContent = "N/A";

    }


    // Languages

    if (Array.isArray(countryData.languages)) {

        languages.textContent = countryData.languages.map(function (item) {

            if (typeof item === "string") {
                return item;
            }

            return item.name || item.english_name || item.englishName || "";

        }).filter(Boolean).join(", ") || "N/A";

    } else {

        languages.textContent = "N/A";

    }


    // Show country result

    countryResult.classList.remove("hidden");

    errorMessage.classList.add("hidden");
    welcomeMessage.classList.add("hidden");

}


// ========================================
// ERROR FUNCTION
// ========================================

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.classList.remove("hidden");

    countryResult.classList.add("hidden");

    welcomeMessage.classList.add("hidden");

}
