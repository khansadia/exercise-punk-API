const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const randomBeerBtn = document.getElementById("random-beer-btn");
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