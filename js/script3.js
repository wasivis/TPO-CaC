const authorsEndpoint = "https://api.quotable.io/authors";
const PAGE_SIZE = 20;
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const totalPages = document.querySelector(".total-pages");
const displayPage = document.querySelector(".current-page");
const authorList = document.getElementById("author-list");
let allAuthors = null
let currentPage = 1;

// Fetch all authors from the API endpoint
async function fetchAllAuthors() {
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
        }
        page++;
    }
    return results;
}

// Fetch all authors and render the first page
async function fetchAuthors() {
    allAuthors = await fetchAllAuthors();
    if (allAuthors) {
        renderPage(1);
        totalPages.textContent = Math.ceil(allAuthors.length / PAGE_SIZE);
        totalPages.dataset.totalPages = totalPages.textContent;
    } else {
        console.log("An error occurred. Please try again later.")
    }
}

// Render a specified page of authors
function renderPage(page) {
    currentPage = page;
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageAuthors = allAuthors.slice(startIndex, endIndex);

    authorList.innerHTML = "";

    for (const author of pageAuthors) {
        const listItem = document.createElement("li");
        listItem.classList.add("author-item");

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

    if (currentPage === Number(totalPages.dataset.totalPages)) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

//Event listeners for "Previous" and "Next" buttons
prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        renderPage(currentPage - 1);
    }
});

nextButton.addEventListener("click", () => {
    if (currentPage < Number(totalPages.dataset.totalPages)) {
        renderPage(currentPage + 1);
    }
});

fetchAuthors();