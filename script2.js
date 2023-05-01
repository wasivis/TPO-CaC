let quote = document.querySelector(".quote");
let author = document.querySelector(".author");
let container = document.querySelector(".dailyQuote-container");
let authorImage = document.querySelector(".author-image");

async function getQuote() {
    const url1 = "https://api.quotable.io/quotes/mg8F-nsmPEj"
    const url2 = "https://images.quotable.dev/profile/200/albert-einstein.jpg"

    const response1 = await fetch(url1)
    const data1 = await response1.json()

    const response2 = await fetch(url2)
    const blob = await response2.blob();
    authorImage.src = URL.createObjectURL(blob)

    if (response1.ok) {
        quote.textContent = data1.content;
        author.textContent = data1.author + ".";
    } else {
        quote.textContent = "An error occured";
        console.log(data1);
    }
}

getQuote();