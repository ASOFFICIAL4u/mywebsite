// Sticky Navbar Effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.classList.add('sticky');
    } else {
        nav.classList.remove('sticky');
    }
});

// Scroll Reveal Animation Logic
const revealElements = document.querySelectorAll('.reveal');

const scrollReveal = function() {
    for (let i = 0; i < revealElements.length; i++) {
        let windowHeight = window.innerHeight;
        let revealTop = revealElements[i].getBoundingClientRect().top;
        let revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            revealElements[i].classList.add('active');
        }
    }
}

window.addEventListener('scroll', scrollReveal);

// Initial Trigger
scrollReveal();

// Mobile Hamburger (Basic)
const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', () => {
    alert("Mobile menu clicked! In a full build, this would slide out the drawer.");
});