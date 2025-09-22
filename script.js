/*
==================================================================
== MANUAL CONTROLS: EDIT THE VARIABLES BELOW TO CHANGE ANIMATION ==
==================================================================
*/

// ** Control Spaceship Speed **
// 1 = Normal speed.
// 2 = Twice as fast (animation finishes in half the scroll distance).
// 0.5 = Half speed (animation takes twice the scroll distance).
const scrollSpeedMultiplier = 1.0;

// ** Control Spaceship's Horizontal Direction (X-Axis Path) **
// The spaceship will move between these horizontal points as you scroll.
// This new path removes the zigzag and creates a smooth diagonal movement.
const spaceshipXPath = [
  50, // Start on-screen at the top right
  -5,
  70,
  -15,
  100,
  100,
  100,
  
 // End on the left
];

// ** Control Planet Positions Here **
const planetPositions = [
  { selector: '.planet-1', top: 25, left: 75 },
  { selector: '.planet-2', top: 45, left: 25 },
  { selector: '.planet-3', top: 70, left: 70 },
  { selector: '.planet-4', top: 110, left: 40 }
];

/*
==================================================================
== ANIMATION LOGIC: No need to edit below this line ==
==================================================================
*/

// Function to set the planet positions based on the array above
function setupPlanetPositions() {
  planetPositions.forEach(planet => {
    const el = document.querySelector(planet.selector);
    if (el) {
      el.style.top = `${planet.top}%`;
      el.style.left = `${planet.left}%`;
    }
  });
}

// This function handles the spaceship's flight path
function updateSpaceshipPosition() {
  const spaceship = document.getElementById('spaceship');
  const modelViewer = document.getElementById('spaceship-viewer');
  if (!spaceship || !modelViewer) return;

  const scrolled = window.pageYOffset;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  
  // ** NEW **: Adjust scroll position by the multiplier for speed control
  const adjustedScroll = scrolled * scrollSpeedMultiplier;
  const scrollProgress = Math.min(Math.max(adjustedScroll / maxScroll, 0), 1);

  // Y-AXIS (TOP): Moves down smoothly across the whole page
  const top = scrollProgress * 70;

  // X-AXIS (LEFT) & ROTATION: Interpolated from the spaceshipXPath array
  const pathProgress = scrollProgress * (spaceshipXPath.length - 1);
  const currentIndex = Math.floor(pathProgress);
  const nextIndex = Math.min(currentIndex + 1, spaceshipXPath.length - 1);
  const segmentProgress = pathProgress - currentIndex;

  const currentX = spaceshipXPath[currentIndex];
  const nextX = spaceshipXPath[nextIndex];
  
  const left = currentX + (nextX - currentX) * segmentProgress;
  
  // Determine rotation based on horizontal direction
  const isMovingRight = nextX > currentX;
  const yaw = isMovingRight ? -90 : 90; // -90 faces right, 90 faces left
  const pitch = 80; // Keep a consistent downward angle

  // Apply the calculated styles
  spaceship.style.top = `${top}%`;
  spaceship.style.left = `${left}%`;
  modelViewer.setAttribute('camera-orbit', `${yaw}deg ${pitch}deg 105%`);

  // Disappearance Logic
  if (scrollProgress >= 1.0) {
      spaceship.style.opacity = 0;
  } else {
      spaceship.style.opacity = 1;
  }
}

// --- Standard Animation and Scroll Logic ---
function createScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => { entry.target.classList.add('animate'); }, delay);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  const elementsToObserve = document.querySelectorAll('.page-section, .planet-row, .astronaut, #main-title, #nontech-title, .endurance-img-container');
  elementsToObserve.forEach(el => observer.observe(el));
}

let ticking = false;
function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateSpaceshipPosition();
      ticking = false;
    });
    ticking = true;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setupPlanetPositions(); 
  createScrollObserver();
  window.addEventListener('scroll', handleScroll);
  updateSpaceshipPosition();
  const mainTitle = document.getElementById('main-title');
  if (mainTitle) {
    setTimeout(() => { mainTitle.classList.add('animate'); }, 100);
  }
});