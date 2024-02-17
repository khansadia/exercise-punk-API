const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const randomBeerBtn = document.getElementById("beer-btn");
const beerName = document.querySelector(".beer-name");
const beerImage = document.querySelector(".beer-card img");
const beerUrl = document.querySelector("#more-info-beer-btn");
const searchResults = document.getElementById("search-results");
const paginationButtons = document.getElementById("pagination-buttons");
const mainErrorMessage = document.getElementById("main-error-message");
const errorMessage = document.getElementById("error-message");
const spinner = document.getElementById("spinner");

renderMainPage();
renderDetailedPage();

async function renderMainPage() {
  if (!document.querySelector("#main-page")) {
    return;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    // Function to handle form submission
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();

      try {
        if (searchTerm !== "") {
          const beers = await searchBeer(searchTerm);

          if (beers.length === 0) {
            mainErrorMessage.textContent = "Cannot find any beer";
          }

          displaySearchResults(beers);
        }
      } catch (error) {
        console.error("Error searching for beers:", error);
      }
    });
    await getRandomAndDisplayBeer();
    randomBeerBtn.addEventListener("click", async () => {
      await getRandomAndDisplayBeer();
    });

    // Function to handle click event for random beer button
    async function getRandomAndDisplayBeer() {
      const randomBeer = await getRandomBeer();
      displayBeer(randomBeer);
    }
  });

  /* Search feature:
Function to validate the search term.
Function to search for beers using the Punk API.
Display search results with pagination
  */

  async function searchBeer(query) {
    mainErrorMessage.textContent = "";

    showSpinner();
    try {
      const response = await fetch(
        `https://api.punkapi.com/v2/beers?beer_name=${query}`
      );
      const data = await response.json();
      return data;
    } catch (e) {
    } finally {
      hideSpinner();
    }
  }

  function clearList() {
    searchResults.innerHTML = ""; // Clear previous search results
  }

  function displaySearchResults(beers) {
    const itemsPerPage = 10;
    let currentPage = 1;

    function paginateResults() {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedBeers = beers.slice(startIndex, endIndex);

      clearList();
      paginatedBeers.forEach((beer) => {
        const beerItem = document.createElement("li");
        beerItem.textContent = beer.name;
        beerItem.classList.add("beer-item");
        beerItem.addEventListener("click", () => {
          navigateToBeerInfoPage(beer.id);
        });
        searchResults.appendChild(beerItem);
      });

      updatePaginationButtons();
    }

    function updatePaginationButtons() {
      const totalPages = Math.ceil(beers.length / itemsPerPage);
      paginationButtons.innerHTML = "";

      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.add("pagination-btn");
        if (i === currentPage) {
          pageBtn.disabled = true;
          pageBtn.classList.add("active");
        }
        pageBtn.addEventListener("click", () => {
          currentPage = i;
          paginateResults();
        });
        paginationButtons.appendChild(pageBtn);
      }
    }

    paginateResults();
  }

  function navigateToBeerInfoPage(id) {
    const url = `/beer-details.html?id=${id}`;
    window.location.href = url;
  }
  async function getRandomBeer() {
    const response = await fetch("https://api.punkapi.com/v2/beers/random");
    const [randomBeer] = await response.json();
    return randomBeer;
  }

  function displayBeer(beer) {
    beerName.textContent = beer.name;
    beerUrl.href = `/beer-details.html?id=${beer.id}`;
    if (beer.image_url) {
      beerImage.src = beer.image_url;
      beerImage.alt = "Beer Image";
      beerImage.style.display = "block";
    } else {
      beerImage.src = "/no-image.jpeg";
      beerImage.alt = "No image available";
      beerImage.style.display = "block";
    }
  }
}

async function renderDetailedPage() {
  if (!document.querySelector("#detailed-page")) {
    return;
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    const beerDetails = await fetchBeerDetails(id);
    displayBeerDetails(beerDetails);
  } catch (error) {
    errorMessage.textContent =
      "Error fetching drink information. Please try again later.";
  }

  /* Details beer feature:
    Function to get a beer from the Punk API according to its name.
    Function to display the details beer.
    */
  async function fetchBeerDetails(id) {
    try {
      const response = await fetch(`https://api.punkapi.com/v2/beers/${id}`);

      const data = await response.json();
      const beerDetails = data[0];
      return beerDetails;
    } catch (error) {
      errorMessage.textContent =
        "Error fetching drink information. Please try again later.";
    }
  }

  function displayBeerDetails(beerDetails) {
    const beerDescriptionElem = document.querySelector(".beer-description");
    const beerVolumeElem = document.querySelector(".beer-volume");
    const beerAbvElem = document.querySelector(".beer-abv");
    const beerIngredientsElem = document.querySelector(".beer-ingredients");
    const beerFoodPairingElem = document.querySelector(".beer-food-pairing");
    const beerBrewersTipsElem = document.querySelector(".beer-brewers-tips");

    if (beerDetails) {
      beerName.textContent = beerDetails.name;
      beerDescriptionElem.textContent = `Description: ${beerDetails.description}`;
      beerVolumeElem.textContent = `Volume: ${
        beerDetails.volume ? beerDetails.volume.value : "N/A"
      } ${beerDetails.volume ? beerDetails.volume.unit : "N/A"}`;
      beerAbvElem.textContent = `ABV: ${
        beerDetails.abv ? beerDetails.abv : "N/A"
      }`;
      beerIngredientsElem.textContent = `Ingredients: ${getIngredients(
        beerDetails.ingredients
      )}`;
      beerFoodPairingElem.textContent = `Food Pairing: ${
        beerDetails.food_pairing ? beerDetails.food_pairing : "N/A"
      }`;
      beerBrewersTipsElem.textContent = `Brewers Tips: ${
        beerDetails.brewers_tips ? beerDetails.brewers_tips : "N/A"
      }`;

      if (beerDetails.image_url) {
        beerImage.src = beerDetails.image_url;
      } else {
        beerImage.style.display = "none";
        beerImage.src = "/no-image.jpeg";
        beerImage.alt = "image not available";
        beerImage.style.display = "block";
      }
    } else {
      errorMessage.textContent = "No information about the drink";
    }
  }

  // Function to get a string representation of ingredients
  function getIngredients(ingredients) {
    let ingredientArray = [];

    if (ingredients.malt) {
      ingredientArray.push("Malt:\n");
      ingredients.malt.forEach((malt) => {
        ingredientArray.push(
          `  ${malt.name}: ${malt.amount.value} ${malt.amount.unit}`
        );
      });
    }

    if (ingredients.hops) {
      ingredientArray.push("\nHops:\n");
      ingredients.hops.forEach((hop) => {
        ingredientArray.push(
          `  ${hop.name}: ${hop.amount.value} ${hop.amount.unit} (${hop.add} - ${hop.attribute})`
        );
      });
    }

    if (ingredients.yeast) {
      ingredientArray.push("\nYeast:\n"); // Add a new line after the category label
      ingredientArray.push(`${ingredients.yeast}`);
    }

    return ingredientArray.join("\n");
  }
}

function hideSpinner() {
  spinner.style.display = "none";
}
function showSpinner() {
  spinner.style.display = "block";
}

      
const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
const year = currentDate.getFullYear();

document.getElementById("current-Date").textContent = `${day}/${month}/${year}`;

