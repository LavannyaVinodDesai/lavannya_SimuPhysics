const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const searchArea = document.getElementById("search-area");
const simulationContent = document.getElementById("simulation-content");
const newChatBtn = document.querySelector(".new-chat");

const toggleBtn = document.getElementById("toggle-btn");
let isPlaying = true;  // ✅ simulation starts running immediately
let simStarted = false;

// Start Simulation
// Enter key
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();   // ✅ stops page reload
    startSimulation();
  }
});

// Start Simulation
function startSimulation() {
  const value = searchInput.value.trim();
  if (!value) return;

  // Move search bar to top-left
  searchArea.classList.remove("centered");
  searchArea.classList.add("left-aligned");

  // Show simulation + controls
  simulationContent.classList.remove("hidden");

  // Run p5.js setup (first time only)
  if (!simStarted && typeof setup === "function") {
    simStarted = true;

    // simulation starts immediately → button should say "Pause"
    toggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
    isPlaying = true;
  }
}

// Button click
searchBtn.addEventListener("click", startSimulation);

// Enter key
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startSimulation();
});

// ✅ Toggle Play/Pause
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    if (isPlaying) {
      // Pause simulation
      if (typeof noLoop === "function") noLoop();
      toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
      isPlaying = false;
    } else {
      // Resume simulation
      if (typeof loop === "function") loop();
      toggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
      isPlaying = true;
    }
  });
}

// ✅ Reset when new chat is clicked
newChatBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchArea.classList.remove("left-aligned");
  searchArea.classList.add("centered");
  simulationContent.classList.add("hidden");

  // Reset state
  if (simStarted) {
    simStarted = false;
    if (typeof remove === "function") remove(); // remove p5 canvas
  }
  isPlaying = false;
  toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
});
