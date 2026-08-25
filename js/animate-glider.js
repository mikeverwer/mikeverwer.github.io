// animate-glider.js
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

document.addEventListener('DOMContentLoaded', function () {

    setHeaderImage();  // initial frame

    const homeButton = document.getElementById("home-button-icon");
    homeButton.addEventListener("mouseenter", function () {
        lastFrameTime = 0; // ensures the first frame swap fires immediately, not after a stale delay
        animationFrameId = requestAnimationFrame(animateGlider);
    });
    homeButton.addEventListener("mouseleave", stopGliderAnimation);
});