// -------------------------------------------------------------------------------------------
// Animates the `home` icon and sets it to a random frame on page load.
// -------------------------------------------------------------------------------------------

// Set the initial image index to 1
var currentImageIndex = getRandomInt(1, 4);
var intervalId;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to set the source of the header image
function setHeaderImage() {
    var imagePath = "/assets/images/website-icon-" + currentImageIndex + ".png";
    document.getElementById("home-button").src = imagePath;

    // Increment the image index
    console.log("image index", currentImageIndex)
    currentImageIndex++;

    // Reset to 1 if it exceeds the maximum value (4 in this case)
    if (currentImageIndex > 4) {
        currentImageIndex = 1;
    }
}

// Call the function when the window loads
window.onload = setHeaderImage;

// Event listener for mouseover
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("home-button").addEventListener("mouseover", function () {
        setHeaderImage;
        intervalId = setInterval(setHeaderImage, 500); // Call setHeaderImage every 1/3 second
    });

    // Event listener for mouseout
    document.getElementById("home-button").addEventListener("mouseout", function () {
        clearInterval(intervalId); // Stop calling setHeaderImage
    });
});

// -------------------------------------------------------------------------------------------
// Toggle the Navbars
// -------------------------------------------------------------------------------------------

// Determine if both panels are hidden and update the 'zen-mode' button accordingly
function updateHideButton(navBars, preCheck) {
    const button = document.querySelector('button');
    let closed = '{}';
    let open = '}{';
    let bothHidden = true; // Assume both are hidden initially
    if (preCheck) {
        closed = '}{'
        open = '{}'
    }
    navBars.forEach(function (navBar) {
        if (navBar.style.display !== 'none') {
            bothHidden = false; // If any navbar is visible, both are not hidden
        }
    });
    if (bothHidden) {
        button.textContent = open;
    } else {
        button.textContent = closed;
    }
    return bothHidden; // Return the status of both navbars
}

// Hide or show both navbars based on the button state
function toggleNavBars(navBars, hidden) {
    navBars.forEach(function (navBar) {
        if (hidden) {
            navBar.style.display = 'flex'; // Show the navbar
        } else {
            navBar.style.display = 'none'; // Hide the navbar
        }
    });
}

// Hide the respective navbar if the left or right edge has been clicked
function toggleNavBar(event) {
    const panelID = event.target.id;
    const button = document.querySelector('button');
    let navBar;
    if (panelID === 'left-side') {
        navBar = document.querySelector('nav.left');
    } else if (panelID === 'right-side') {
        navBar = document.querySelector('nav.right');
    } else {
        const navBars = document.querySelectorAll('nav');
        const hidden = updateHideButton(navBars, true); // Toggle the visibility of navbars and update button text
        toggleNavBars(navBars, hidden); // Hide or show both navbars based on the button state
        return; // Exit the function since no further action is needed
    }
    if (navBar.style.display === 'none') {
        navBar.style.display = 'flex'; // Show the navbar
    } else {
        navBar.style.display = 'none'; // Hide the navbar
    }
    updateHideButton(document.querySelectorAll('nav'), false); // Update the button text
}

document.addEventListener('DOMContentLoaded', function () {
    const panelToggleAreas = document.querySelectorAll('.panel-toggle-area');
    const button = document.querySelector('button');
    // Add event listener to side panels
    panelToggleAreas.forEach(function (toggleArea) {
        toggleArea.addEventListener('click', toggleNavBar);
    });
    // Add event listener to the button
    button.addEventListener('click', toggleNavBar);
});

// -------------------------------------------------------------------------------------------
// Configuring `MathJax` and `zero-md`.
// -------------------------------------------------------------------------------------------

// Configure MathJax settings; LaTeX rendering
MathJax = {
    tex: {
        inlineMath: [
            ['$', '$'], // you can change this to the delimiter of your choice
            ['\\(', '\\)']
        ]
    }
}
addEventListener('zero-md-rendered', () => MathJax.typeset())

// Configure zero-md
document.addEventListener("DOMContentLoaded", function () {
    const style = document.createElement('style');
    style.textContent = `
                        p {
                                font-size: larger;
                        }
                `;
    document.head.appendChild(style);
});