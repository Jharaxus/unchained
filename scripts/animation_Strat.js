// Create a reusable function to animate a ray of light within a delimiter element
function animateRayOfLight(delimiterElement, rayOfLightClass) {
  const rayOfLightElement = document.createElement('div'); // Create a new div element for the ray of light
  rayOfLightElement.classList.add(rayOfLightClass); // Add a class to the ray of light element
  delimiterElement.appendChild(rayOfLightElement); // Append the ray of light element to the delimiter element

  // Set a timeout to remove the ray of light element after 1 second
  setTimeout(() => {
    delimiterElement.removeChild(rayOfLightElement); // Remove the ray of light element from the delimiter element
  }, 1000);
}

// Set an interval to animate the ray of light every 2 seconds for the first delimiter element
setInterval(() => {
  const delimiterElement = document.querySelector('.delimiter');
  animateRayOfLight(delimiterElement, 'ray-of-light');
}, 3000);

// Set an interval to animate the ray of light every 2 seconds with a delay of 1 second for the second delimiter element
setInterval(() => {
  const delimiterElement = document.querySelector('.delimiter2');
  setTimeout(() => {
    animateRayOfLight(delimiterElement, 'ray-of-light2');
  }, 1000);
}, 3000);
