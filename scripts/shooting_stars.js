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
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar5');
  animateRayOfLighttt(delimiterElement, 'ray-of-light5');
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar7');
  animateRayOfLighttt(delimiterElement, 'ray-of-light7');
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar9');
  animateRayOfLighttt(delimiterElement, 'ray-of-light9');
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar11');
  animateRayOfLighttt(delimiterElement, 'ray-of-light11');
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar13');
  animateRayOfLighttt(delimiterElement, 'ray-of-light13');
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar17');
  animateRayOfLighttt(delimiterElement, 'ray-of-light17');
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar19');
  animateRayOfLighttt(delimiterElement, 'ray-of-light19');
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar21');
  animateRayOfLighttt(delimiterElement, 'ray-of-light21');
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar23');
  animateRayOfLighttt(delimiterElement, 'ray-of-light23');
}, 8000);



// Set an interval to animate the ray of light every 2 seconds with a delay of 1 second for the second delimiter element
setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar4');
  setTimeout(() => {
    animateRayOfLighttt(delimiterElement, 'ray-of-light4');
  }, 4000);
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar6');
  setTimeout(() => {
    animateRayOfLighttt(delimiterElement, 'ray-of-light6');
  }, 4000);
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar8');
  setTimeout(() => {
    animateRayOfLighttt(delimiterElement, 'ray-of-light8');
  }, 4000);
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar10');
  setTimeout(() => {
    animateRayOfLighttt(delimiterElement, 'ray-of-light10');
  }, 4000);
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar12');
  setTimeout(() => {
    animateRayOfLighttt(delimiterElement, 'ray-of-light12');
  }, 4000);
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar14');
  setTimeout(() => {
    animateRayOfLighttt(delimiterElement, 'ray-of-light14');
  }, 4000);
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar16');
  setTimeout(() => {
    animateRayOfLighttt(delimiterElement, 'ray-of-light16');
  }, 4000);
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar18');
  setTimeout(() => {
    animateRayOfLighttt(delimiterElement, 'ray-of-light18');
  }, 4000);
}, 8000);

setInterval(() => {
  const delimiterElement = document.querySelector('.shootingStar20');
  setTimeout(() => {
    animateRayOfLighttt(delimiterElement, 'ray-of-light20');
  }, 4000);
}, 8000);
