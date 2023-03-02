// Create a reusable function to animate a ray of light within a delimiter element
function animateRayOfLighttt(delimiterElement, rayOfLightClass) {
  const rayOfLightElement = document.createElement('div'); // Create a new div element for the ray of light
  rayOfLightElement.classList.add(rayOfLightClass); // Add a class to the ray of light element
  delimiterElement.appendChild(rayOfLightElement); // Append the ray of light element to the delimiter element

  // Set a timeout to remove the ray of light element after 1 second
  setTimeout(() => {
    delimiterElement.removeChild(rayOfLightElement); // Remove the ray of light element from the delimiter element
  }, 250);
}

// Set an interval to animate the ray of light every 2 seconds for the first delimiter element
setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar3');
  animateRayOfLighttt(delimiterElement, 'ray-of-light3');
}, 3000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar5');
  animateRayOfLighttt(delimiterElement, 'ray-of-light5');
}, 3000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar7');
  animateRayOfLighttt(delimiterElement, 'ray-of-light7');
}, 3000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar9');
  animateRayOfLighttt(delimiterElement, 'ray-of-light9');
}, 3000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar11');
  animateRayOfLighttt(delimiterElement, 'ray-of-light11');
}, 3000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar13');
  animateRayOfLighttt(delimiterElement, 'ray-of-light13');
}, 3000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar15');
  animateRayOfLighttt(delimiterElement, 'ray-of-light15');
}, 3000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar17');
  animateRayOfLighttt(delimiterElement, 'ray-of-light17');
}, 3000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar19');
  animateRayOfLighttt(delimiterElement, 'ray-of-light19');
}, 3000);

// Set an interval to animate the ray of light every 2 seconds with a delay of 1 second for the second delimiter element
setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar4');
  setTimeout(() => {
    animateRayOfLighttt(delimiterElement, 'ray-of-light4');
  }, 1000);
}, 3000);
