const form = document.querySelector('.form-container');
const submitButton = form.querySelector('.ssubmit-btn');
const thankYouMessage = document.querySelector('.thank-you-message');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const response = await fetch(form.action, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    });

    if (response.ok) {
        form.style.display = 'none';
        thankYouMessage.style.display = 'block';
    }
});