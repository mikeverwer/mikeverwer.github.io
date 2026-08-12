// ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████ 
// ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██      
// █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
// ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
// ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████ 

// -------------------------------------------------------------------------------------------
// Animates the `home` icon and sets it to a random frame on page load.
// -------------------------------------------------------------------------------------------

// Set the initial frame to a random glider step
var currentImageIndex = getRandomInt(1, 4);
var animationFrameId = null;
var lastFrameTime = 0;
const FRAME_DURATION = 400; // ms between glider steps

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setHeaderImage() {
    document.getElementById("home-button-use")
        .setAttribute('href', `/assets/images/icons-sprite.svg#glider-${currentImageIndex}`);

    currentImageIndex++;
    if (currentImageIndex > 4) {
        currentImageIndex = 1;
    }
}

function animateGlider(timestamp) {
    if (timestamp - lastFrameTime >= FRAME_DURATION) {
        setHeaderImage();
        lastFrameTime = timestamp;
    }
    animationFrameId = requestAnimationFrame(animateGlider);
}

function stopGliderAnimation() {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

// -------------------------------------------------------------------------------------------
// Toggle the sidebar navs via the { } button.
// -------------------------------------------------------------------------------------------

function toggleSidebars() {
    const button = document.getElementById("toggle-sidebars");
    const container = document.querySelector('.container');
    const navBars = [
        document.getElementById('leftNav'),
        document.getElementById('rightNav'),
    ];

    const currentlyHidden = navBars[0].classList.contains('hiding');

    container.classList.toggle('zen', !currentlyHidden);
    navBars.forEach(nav => nav.classList.toggle('hiding', !currentlyHidden));

    // Button flip animation 
    button.classList.add('flipping');
    setTimeout(() => {
        button.textContent = currentlyHidden ? '{ }' : '}{';
        button.classList.remove('flipping');
    }, 150);
}

// ██████   ██████  ███    ███     ██       ██████   █████  ██████  ███████ ██████  
// ██   ██ ██    ██ ████  ████     ██      ██    ██ ██   ██ ██   ██ ██      ██   ██ 
// ██   ██ ██    ██ ██ ████ ██     ██      ██    ██ ███████ ██   ██ █████   ██   ██ 
// ██   ██ ██    ██ ██  ██  ██     ██      ██    ██ ██   ██ ██   ██ ██      ██   ██ 
// ██████   ██████  ██      ██     ███████  ██████  ██   ██ ██████  ███████ ██████

document.addEventListener('DOMContentLoaded', function () {

    setHeaderImage();  // initial frame

    const homeButton = document.getElementById("home-button-icon");
    homeButton.addEventListener("mouseenter", function () {
        lastFrameTime = 0; // ensures the first frame swap fires immediately, not after a stale delay
        animationFrameId = requestAnimationFrame(animateGlider);
    });
    homeButton.addEventListener("mouseleave", stopGliderAnimation);


    // -------------------------------------------------------------------------------------------
    // Wire up the { } sidebar toggle button.
    // -------------------------------------------------------------------------------------------
    document
        .getElementById("toggle-sidebars")
        .addEventListener('click', toggleSidebars);
});