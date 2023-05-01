let button = document.querySelector(".quote-btn");
let quote = document.querySelector(".quote");
let author = document.querySelector(".author");
let container = document.querySelector(".quote-container");
let authorImage = document.querySelector(".author-image");

button.addEventListener("click", getQuote);

async function getQuote() {
    const quoteEndpoint = "https://api.quotable.io/random"
    const imageEndpoint = "https://images.quotable.dev/profile/200/"

    const response = await fetch(quoteEndpoint)
    const quoteData = await response.json()

    if (response.ok) {
        const authorSlug = quoteData.authorSlug;
        const imageUrl = `${imageEndpoint}/${authorSlug}.jpg`;

        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        authorImage.src = URL.createObjectURL(imageBlob);

        quote.textContent = quoteData.content;
        author.textContent = quoteData.author + ".";
    } else {
        quote.textContent = "An error occured";
        console.log(quoteData);
    }
}

getQuote();