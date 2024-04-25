# Hover Image Test

This is a test, [Hover over me](/assets/images/fair_die.png "/assets/images/fair_die.png")

<style>
    a {
        position: relative;
        display: inline-block;
    }

    a:hover::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 0;
        background-image: url(attr(title));
        background-size: cover; /* Adjust the background size */
        background-repeat: no-repeat; /* Ensure image doesn't repeat */
        background-color: white; /* Set background color */
        border: 1px solid black;
        padding: 5px;
        border-radius: 5px;
        z-index: 1;
        display: block; /* Ensures the hover box has the size of the image */
        width: 200px; /* Set a fixed width for the hover box */
    }
