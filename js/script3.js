const authorsEndpoint = "https://api.quotable.io/authors";
const PAGE_SIZE = 20;
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const totalPages = document.querySelector(".total-pages");
const displayPage = document.querySelector(".current-page");
const authorList = document.getElementById("author-list");
const authorQuotesContainer = document.getElementById("author-quotes");
const searchInput = document.getElementById("search-input");
const searchContainer = document.querySelector(".search-container");
const errorMessage = document.getElementById("authors-error-message")
const spinner = document.querySelector(".loader");
let allAuthors = null;
let matchingAuthors = null;
let currentPage = 1;

const quotesEndpoint = "https://api.quotable.io/quotes";

//Event listeners for search input
searchContainer.addEventListener("click", (event) => {
    if (event.target.matches("#search-button")) {
        searchAuthors();
    }
});

searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search-button").click();
    }
});

//Event listener for search input
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm === "") {
        matchingAuthors = null;
        errorMessage.textContent = "";
        errorMessage.style.display = "none";
        renderPage(1, allAuthors);
        const totalAllPages = Math.ceil(allAuthors.length / PAGE_SIZE);
        totalPages.textContent = totalAllPages;
        totalPages.dataset.totalPages = totalAllPages;
        nextButton.disabled = currentPage === totalAllPages;
    }
});

// Fetch all authors from the API endpoint
async function fetchAllAuthors() {
    spinner.style.display = "flex";
    const results = [];
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages) {
        const response = await fetch(`${authorsEndpoint}?page=${page}&pageSize=${PAGE_SIZE}`);
        const data = await response.json();
        if (response.ok) {
            results.push(...data.results);
            totalPages = Math.ceil(data.totalCount / PAGE_SIZE);
        } else {
            console.log("An error occurred. Please try again later.")
            errorMessage.textContent = "An error occurred. Please try again later.";
        }
        page++;
    }
    spinner.style.display = "none";
    return results;
}

// Fetch all authors and render the first page
async function fetchAuthors() {
    try {
        allAuthors = await fetchAllAuthors();
        renderPage(1);
        totalPages.textContent = Math.ceil(allAuthors.length / PAGE_SIZE);
        totalPages.dataset.totalPages = totalPages.textContent;
    } catch (error) {
        console.log(error);
        errorMessage.textContent = "An error occurred. Please try again later.";
    }
}

// Render a specified page of authors
function renderPage(page, authors = allAuthors) {
    currentPage = page;
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageAuthors = authors.slice(startIndex, endIndex);

    authorList.innerHTML = "";

    for (const author of pageAuthors) {
        const listItem = document.createElement("li");
        listItem.classList.add("author-item");

        listItem.addEventListener("click", () => {
            loadAuthorQuotes(author.slug);
        });

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("author-image-container-list");
        listItem.appendChild(imageContainer);

        const image = document.createElement("img");
        image.src = `https://images.quotable.dev/profile/200/${author.slug}.jpg`;
        image.alt = author.name;
        image.classList.add("author-image-list");
        imageContainer.appendChild(image);
        image.onerror = function () {
            this.src =
                "https://writingcenter.fas.harvard.edu/sites/hwpi.harvard.edu/files/writingcenter/files/person-icon.png?m=1606151135";
        };

        const content = document.createElement("div");
        content.classList.add("author-content");
        listItem.appendChild(content);

        const name = document.createElement("h2");
        name.textContent = author.name;
        name.classList.add("author-name");
        content.appendChild(name);

        const bio = document.createElement("p");
        bio.textContent = author.bio;
        bio.classList.add("author-bio");
        content.appendChild(bio);

        authorList.appendChild(listItem);
    }

    displayPage.textContent = currentPage;

    if (currentPage === 1) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    const totalMatchingPages = Math.ceil(
        (matchingAuthors ? matchingAuthors.length : allAuthors.length) / PAGE_SIZE
    );

    if (currentPage === totalMatchingPages || totalMatchingPages === 1) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

//Search for authors that contain user's query
function searchAuthors() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
    const searchTerm = searchInput.value.toLowerCase();
    matchingAuthors = allAuthors.filter((author) =>
        author.name.toLowerCase().includes(searchTerm));
    currentPage = 1;

    let totalMatchingPages = Math.ceil(
        (matchingAuthors ? matchingAuthors.length : allAuthors.length) / PAGE_SIZE
    );

    if (matchingAuthors.length === 0) {
        errorMessage.textContent = "No results found.";
        errorMessage.style.display = "flex";
        totalMatchingPages = 1;
    }

    totalPages.textContent = totalMatchingPages;
    totalPages.dataset.totalPages = totalMatchingPages;

    renderPage(1, matchingAuthors || allAuthors);

    nextButton.disabled = currentPage === totalMatchingPages;
}

//Event listeners for "Previous" and "Next" buttons
prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        if (matchingAuthors && matchingAuthors.length > 0) {
            renderPage(currentPage - 1, matchingAuthors);
        } else {
            renderPage(currentPage - 1, allAuthors);
        }
    }
});

nextButton.addEventListener("click", () => {
    if (currentPage < Number(totalPages.dataset.totalPages)) {
        if (matchingAuthors && matchingAuthors.length > 0) {
            renderPage(currentPage + 1, matchingAuthors);
        } else {
            renderPage(currentPage + 1, allAuthors);
        }
    }
});

fetchAuthors();