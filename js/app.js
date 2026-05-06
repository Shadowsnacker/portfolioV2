// ============================================
// NAVBAR — scroll detection
// ============================================

const navbar = document.querySelector("nav");
const hero = document.querySelector("#hero");

window.addEventListener("scroll", () => {
    // When scrolled past 75% of hero height, darken the nav
    const heroBottom = hero.offsetHeight * 0.75;

    if (window.scrollY > heroBottom) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// ============================================
// HAMBURGER — mobile menu toggle
// ============================================

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    navToggle.classList.toggle("open");
});

// Close menu when a link is tapped
// Even when the link takes us elswhere on page the menu STILL closes
navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
    });
});