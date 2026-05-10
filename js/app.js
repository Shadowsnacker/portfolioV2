// ============================================
// NAVBAR — scroll detection
// ============================================

const navbar = document.querySelector("nav");
const hero = document.querySelector("#hero");

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
navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
    });
});

// ============================================
// VESICA PISCIS — ghost cascade on scroll
// ============================================

const ghostOrbit = document.querySelector(".ghost-orbit");
const waveRipple = document.querySelector(".wave-ripple");
const heroSection = document.querySelector("#hero");
const parallaxLayers = document.querySelectorAll(".parallax-layer");
const motifQuote = document.querySelector(".motif-quote");

let pulseActive = false;

function animateGhostCascade() {
    const duration = 1500;       // 1.5s total
    const pulseDuration = 500;   // 0.5s per 180° segment
    const startTime = performance.now();

    // Ghost circle opacity for each pulse: visible → fainter → barely there
    const pulseOpacity = [0.2, 0.12, 0.06];

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Which pulse are we in? (0, 1, or 2)
        const pulseIndex = Math.min(Math.floor(elapsed / pulseDuration), 2);

        // Progress within current pulse (0 to 1)
        const pulseProgress = (elapsed - (pulseIndex * pulseDuration)) / pulseDuration;

        // Total rotation: each pulse adds 180°
        const totalDegrees = (pulseIndex * 180) + (Math.min(pulseProgress, 1) * 180);

        // Eased rotation for smooth feel
        const eased = totalDegrees;

        // Set SVG native rotation around center point (110, 110)
        ghostOrbit.setAttribute("transform", `rotate(${eased}, 110, 110)`);

        // Fade in at start of pulse, fade out at end
        let opacity = pulseOpacity[pulseIndex];
        if (pulseProgress < 0.1) {
            opacity *= (pulseProgress / 0.1);     // fade in
        } else if (pulseProgress > 0.85) {
            opacity *= (1 - (pulseProgress - 0.85) / 0.15);  // fade out
        }

        // Apply opacity to both ghost circles
        const ghostCircles = ghostOrbit.querySelectorAll("circle");
        ghostCircles.forEach(c => c.setAttribute("opacity", opacity));

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            // Animation complete — reset ghost circles
            ghostCircles.forEach(c => c.setAttribute("opacity", 0));
            ghostOrbit.setAttribute("transform", "rotate(0, 110, 110)");
        }
    }

    requestAnimationFrame(step);
}

function animateWaveRipple() {
    const rippleCircles = waveRipple.querySelectorAll("circle");
    const duration = 800;
    const startR = 64;       // same as vesica piscis circles
    const endR = 74;         // ~15% larger
    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out — starts fast, slows down
        const eased = 1 - Math.pow(1 - progress, 3);

        const currentR = startR + (endR - startR) * eased;

        // Fade in quickly, fade out slowly
        let opacity;
        if (progress < 0.15) {
            opacity = 0.25 * (progress / 0.15);
        } else {
            opacity = 0.25 * (1 - (progress - 0.15) / 0.85);
        }

        rippleCircles.forEach(c => {
            c.setAttribute("r", currentR);
            c.setAttribute("opacity", opacity);
        });

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            // Reset
            rippleCircles.forEach(c => {
                c.setAttribute("r", startR);
                c.setAttribute("opacity", 0);
            });
        }
    }

    requestAnimationFrame(step);
}

function triggerPulse() {
    // Don't re-trigger while animation is running
    if (pulseActive) return;
    pulseActive = true;

    // Run the JS-driven ghost rotation
    animateGhostCascade();

    // Wave ripple fires when ghost cascade ends
    setTimeout(() => {
        animateWaveRipple();
    }, 1400);

    // Clean up after everything completes
    setTimeout(() => {
        pulseActive = false;
    }, 2500);
}

// ============================================
// SCROLL HANDLER — navbar + pulse + parallax
// ============================================

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;

    // Navbar background toggle
    if (scrollY > heroHeight * 0.75) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

    // Only trigger pulse while hero is in view
    if (scrollY < heroHeight && scrollY > 0) {
        triggerPulse();
    }

    // Internal parallax — each layer moves at its own rate
    if (scrollY < heroHeight) {
        parallaxLayers.forEach(layer => {
            const depth = parseFloat(layer.dataset.depth);
            const offset = scrollY * depth;
            layer.setAttribute("transform", `translate(0, ${offset})`);
        });

        // Quote follows the center dot layer at same rate
        if (motifQuote) {
            motifQuote.style.transform = `translateY(${scrollY * 0.06}px)`;
        }
    }
});