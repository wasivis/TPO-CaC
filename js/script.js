const button = document.querySelector(".quote-btn");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const container = document.querySelector(".container");
const content = document.querySelector(".content");
const quoteContainer = document.querySelector(".quote-container");
const authorImage = document.getElementById("author-image");
const spinner = document.querySelector(".lds-ring");
const twitterShareButton = document.getElementById('twitter-share-btn');
const facebookShareButton = document.getElementById('facebook-share-btn');
const linkedInShareButton = document.getElementById('linkedin-share-btn');
const redditShareButton = document.getElementById('reddit-share-btn');

button.addEventListener("click", getQuote);
twitterShareButton.addEventListener("click", shareOnTwitter);
facebookShareButton.addEventListener("click", shareOnFacebook);
linkedInShareButton.addEventListener("click", shareOnLinkedIn);
redditShareButton.addEventListener("click", shareOnReddit);


async function getQuote() {
    container.classList.add("loading");
    spinner.style.display = "flex";
    content.style.display = "none";
    const quoteEndpoint = "https://api.quotable.io/random"
    const imageEndpoint = "https://images.quotable.dev/profile/200/"

    const response = await fetch(quoteEndpoint)
    const quoteData = await response.json()

    if (response.ok) {
        const authorSlug = quoteData.authorSlug;
        const imageUrl = `${imageEndpoint}/${authorSlug}.jpg`;

        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        const authorImageUrl = URL.createObjectURL(imageBlob);
        authorImage.src = authorImageUrl;
        authorImage.alt = quoteData.author;
        authorImage.onerror = function () {
            this.src = 'https://writingcenter.fas.harvard.edu/sites/hwpi.harvard.edu/files/writingcenter/files/person-icon.png?m=1606151135';
        }

        quote.textContent = quoteData.content;
        author.textContent = quoteData.author + ".";
        container.classList.remove("loading");
        content.style.display = "flex";
        spinner.style.display = "none";
    } else {
        const errorMessage = "An error occurred. Please try again later.";
        quote.textContent = errorMessage;
        author.textContent = "A lazy dev.";
        container.classList.remove("loading");
        spinner.style.display = "none";
        content.style.display = "flex"
        authorImage.src = "https://play-lh.googleusercontent.com/xlnwmXFvzc9Avfl1ppJVURc7f3WynHvlA749D1lPjT-_bxycZIj3mODkNV_GfIKOYJmG"
    }
}

function shareOnTwitter() {
    const quoteText = '"' + quote.textContent.trim() + '"';
    const authorText = author.textContent.trim();
    const url = "https://wasivis.github.io/randomquotegenerator/";
    const text = encodeURIComponent(`${quoteText} - ${authorText}\n\nVisit ${url} for more inspirational quotes!`);
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${text}&hashtags=RandomQuoteGenerator`;
    window.open(twitterShareUrl, "_blank");
}

function shareOnLinkedIn() {
    const quoteText = '"' + quote.textContent.trim() + '"';
    const authorText = author.textContent.trim();
    const url = "https://wasivis.github.io/randomquotegenerator/";
    const title = encodeURIComponent(`${quoteText} - ${authorText}`);
    const description = encodeURIComponent("Visit Random Quote Generator for more inspirational quotes!");
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}`;
    window.open(linkedInShareUrl, "_blank");
  }
  

function shareOnFacebook() {
    const quoteText = '"' + quote.textContent.trim() + '"';
    const authorText = author.textContent.trim();
    const url = "https://wasivis.github.io/randomquotegenerator/";
    const title = document.title;
    const description = "Discover hundreds of inspiring quotes with Random Quote Generator!";
    const image = "https://i.imgur.com/bjamLrr.png";
    const facebookShareUrl = `https://www.facebook.com/sharer.php?u=${url}&quote=${quoteText} - ${authorText}&title=${title}&description=${description}&picture=${image}`;
    window.open(facebookShareUrl, "_blank");
}

function shareOnReddit() {
    const quoteText = '"' + quote.textContent.trim() + '"';
    const authorText = author.textContent.trim();
    const url = `${quoteText} - ${authorText}`;
    const title = "Discover hundreds of inspiring quotes with Random Quote Generator! https://wasivis.github.io/randomquotegenerator/";
    const redditShareUrl = `https://www.reddit.com/submit?url=${url}&title=${title}`;
    window.open(redditShareUrl, "_blank");
}

getQuote();