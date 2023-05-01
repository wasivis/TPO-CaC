const authorsEndpoint = "https://api.quotable.io/authors";
const PAGE_SIZE = 20;
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const totalPages = document.querySelector(".total-pages");
const displayPage = document.querySelector(".current-page");
let currentPage = 1;

async function fetchAuthors(page) {
    const response = await fetch(`${authorsEndpoint}?page=${currentPage}&limit=${PAGE_SIZE}`);
    const authorsData = await response.json();

    if (response.ok) {
        const authorList = document.getElementById("author-list");
        authorList.innerHTML = "";

        for (const author of authorsData.results) {
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
                this.src = 'https://writingcenter.fas.harvard.edu/sites/hwpi.harvard.edu/files/writingcenter/files/person-icon.png?m=1606151135';
            }

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

        totalPages.textContent = Math.ceil(authorsData.totalCount / PAGE_SIZE);
        displayPage.textContent = currentPage;

        if (currentPage === 1) {
            prevButton.disabled = true;
        } else {
            prevButton.disabled = false;
        }

        if (currentPage === totalPages) {
            nextButton.disabled = true;
        } else {
            nextButton.disabled = false;
        }
    } else {
        console.log(authorsData);
    }
}

fetchAuthors();

prevButton.addEventListener("click", () => {
  currentPage--;
  fetchAuthors();
});

nextButton.addEventListener("click", () => {
  currentPage++;
  fetchAuthors();
});