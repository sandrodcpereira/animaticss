

var animationDemo = [
  {
    noFrames: 2,
    animationSpeed: 20,
    animationFrames: "assets/demo-1.png"
  },
  {
    noFrames: 50,
    animationSpeed: 40,
    animationFrames: "assets/demo-2.png"
  },
  {
    noFrames: 25,
    animationSpeed: 2,
    animationFrames: "assets/demo-3.png"
  },
];

var noFrames;
var animationSpeed;
var animationSpeedAdjusted;
var animationFrames;

// Function to pick a random group and assign values to variables
function setRandomDemoValues() {
  // Randomly select an index from the animationDemo array
  var randomIndex = Math.floor(Math.random() * animationDemo.length);
  var randomDemo = animationDemo[randomIndex];

  // Assign values from the random group to variables
  noFrames = randomDemo.noFrames;
  animationSpeed = randomDemo.animationSpeed;
  animationFrames = randomDemo.animationFrames;
  animationSpeedAdjusted = randomDemo.animationSpeed * 0.1;

  // Update the inputs with the values
  document.getElementById("noFrames").value = noFrames;
  document.getElementById("animationSpeed").value = animationSpeed;
}

// Execute the function on page load
document.addEventListener("DOMContentLoaded", function() {
  setRandomDemoValues();
  noFramesUpdate();
  animationSpeedUpdate();
});


// Animation updates

function noFramesUpdate() {
	var animationPreviewUpdate = `preview ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;
	var animationFrameUpdate = `currentFrame ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;

	var frameWidthPercentage = 100 / noFrames;
    currentFrame.style.width = frameWidthPercentage + "%";

    var animationPreview = document.getElementById("animationPreview");
    var animationFrame = document.getElementById("currentFrame");
    
    animationPreview.style.animation = animationPreviewUpdate;
    animationFrame.style.animation = animationFrameUpdate;
}


function animationSpeedUpdate() {
	var speedPreviewUpdate = `preview ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;
	var speedFrameUpdate = `currentFrame ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;

	var speedPreview = document.getElementById("animationPreview");
    var speedFrame = document.getElementById("currentFrame");

    speedPreview.style.animation = speedPreviewUpdate;
    speedFrame.style.animation = speedFrameUpdate;
}




 // Update variables on input change

function handleInputChange(event) {
    var inputId = event.target.id;
    var inputValue = event.target.value;

    if (inputId === "noFrames") {
    	noFrames = inputValue;
    	console.log("noFrames changed. New value:", noFrames);
    	noFramesUpdate();

    } else if (inputId === "animationSpeed") {
    	animationSpeed = inputValue;
    	animationSpeedAdjusted = inputValue * 0.1;
    	console.log("animationSpeed changed. New value:", animationSpeed);
    	animationSpeedUpdate();
    }
  }

  var noFramesInput = document.getElementById("noFrames");
  var animationSpeedInput = document.getElementById("animationSpeed");

  noFramesInput.addEventListener("input", handleInputChange);
  animationSpeedInput.addEventListener("input", handleInputChange);

