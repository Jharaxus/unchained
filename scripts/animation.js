const titleElement = document.querySelector('.title-1-numbers');
let currentValue = parseFloat(titleElement.textContent.replace(/\$|,/g, '')); // Remove dollar signs and commas from the value
setInterval(() => {
  currentValue += 13.23;
  titleElement.textContent = '$ ' + currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Format the value with 2 decimal places and add dollar sign and commas
}, 1000);

// Get the HTML element with class "delimiter"
const delimiterElement = document.querySelector('.delimiter');

// Create a function to animate the ray of light
function animateRayOfLight() {
  const rayOfLightElement = document.createElement('div'); // Create a new div element for the ray of light
  rayOfLightElement.classList.add('ray-of-light'); // Add a class to the ray of light element
  delimiterElement.appendChild(rayOfLightElement); // Append the ray of light element to the delimiter element

  // Set a timeout to remove the ray of light element after 1 second
  setTimeout(() => {
    delimiterElement.removeChild(rayOfLightElement); // Remove the ray of light element from the delimiter element
  }, 3000);
}

// Set an interval to animate the ray of light every 2 seconds
setInterval(() => {
  animateRayOfLight();
}, 3000);

const delimiterElement2 = document.querySelector('.delimiter2');

// Create a function to animate the ray of light
function animateRayOfLight2() {
  const rayOfLightElement2 = document.createElement('div'); // Create a new div element for the ray of light
  rayOfLightElement2.classList.add('ray-of-light2'); // Add a class to the ray of light element
  delimiterElement2.appendChild(rayOfLightElement2); // Append the ray of light element to the delimiter element

  // Set a timeout to remove the ray of light element after 1 second
  setTimeout(() => {
    delimiterElement2.removeChild(rayOfLightElement2); // Remove the ray of light element from the delimiter element
  }, 3000);
}

// Set an interval to animate the ray of light every 2 seconds
setInterval(() => {
  animateRayOfLight2();
}, 3000);