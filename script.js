const navBtns = document.querySelectorAll('.nav-btn');
const socialMedia = document.querySelectorAll('.social-media')

navBtns.forEach(button => {
    button.addEventListener('click', () => {
        const page = button.getAttribute('target')
        window.location.href = page;
    });
});

socialMedia.forEach(button => {
    button.addEventListener('click', () => {
        const url = button.getAttribute('data-url')
        if (url) {
            window.open(url, '_blank');
        }
    });
});