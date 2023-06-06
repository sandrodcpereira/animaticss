var animationDemo = [
	{
    	noFrames: 10,
    	animationSpeed: 9,
   		animationFrames: "assets/demo-1.png"
	},
	{
    	noFrames: 24,
    	animationSpeed: 20,
    	animationFrames: "assets/demo-2.png"
	},
	{
    	noFrames: 22,
    	animationSpeed: 19,
    	animationFrames: "assets/demo-3.png"
	},
];

var noFrames;
var animationSpeed;
var animationSpeedAdjusted;
var animationFrames;

var framesWidth;
var framesHeight;

// Page load actions

function pickRandomDemoOnLoad() {
	var randomIndex = Math.floor(Math.random() * animationDemo.length);
	var randomDemo = animationDemo[randomIndex];

	noFrames = randomDemo.noFrames;
	animationSpeed = randomDemo.animationSpeed;
	animationFrames = randomDemo.animationFrames;
	animationSpeedAdjusted = randomDemo.animationSpeed * 0.1;

	document.getElementById("noFrames").value = noFrames;
	document.getElementById("animationSpeed").value = animationSpeed;
}

function updateFramesOnLoad() {
	var animationFramesContainer = document.getElementById("animationFrames");
	animationFramesContainer.src = animationFrames;

	var animationPreviewContainer = document.getElementById("animationPreview");
	animationPreviewContainer.style.backgroundImage = "url(" + animationFrames + ")";
}

document.addEventListener("DOMContentLoaded", function() {
	pickRandomDemoOnLoad();
	updateFramesOnLoad();
	noFramesUpdate();
	animationSpeedUpdate();
	
	
	getImageDimensions(animationFrames, function(width, height) {
	  // Store the width and height in framesWidth and framesHeight variables
	  const framesWidth = width;
	  const framesHeight = height;

	  // Use the width and height as needed
	  console.log("Width:", framesWidth);
	  console.log("Height:", framesHeight);
	});

	resizeAnimationPreview();
	
});




// Update preview based on changes to values

var animationPreview = document.getElementById("animationPreview");
var currentFrame = document.getElementById("currentFrame");
var frameCounter = document.getElementById("frameCounter");
var speedCounter = document.getElementById("speedCounter");

function noFramesUpdate() {
	var animationPreviewUpdate = `preview ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;
	var animationFrameUpdate = `currentFrame ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;

	var frameWidthPercentage = 100 / noFrames;
    currentFrame.style.width = frameWidthPercentage + "%";
    
    animationPreview.style.animation = animationPreviewUpdate;
    currentFrame.style.animation = animationFrameUpdate;
}

function animationSpeedUpdate() {
	var speedPreviewUpdate = `preview ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;
	var speedFrameUpdate = `currentFrame ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;

    animationPreview.style.animation = speedPreviewUpdate;
    currentFrame.style.animation = speedFrameUpdate;
}





 // Update variables on input change

function handleInputChange(event) {
    var inputId = event.target.id;
    var inputValue = event.target.value;

    if (inputId === "noFrames") {
    	noFrames = inputValue;
    	console.log("noFrames changed. New value:", noFrames);
    	noFramesUpdate();
    	resizeAnimationPreview();

    } else if (inputId === "animationSpeed") {
    	animationSpeed = inputValue;
    	animationSpeedAdjusted = inputValue * 0.1;
    	console.log("animationSpeed changed. New value:", animationSpeed);
    	animationSpeedUpdate();
    	resizeAnimationPreview();
    }
  }

  var noFramesInput = document.getElementById("noFrames");
  var animationSpeedInput = document.getElementById("animationSpeed");

  noFramesInput.addEventListener("input", handleInputChange);
  animationSpeedInput.addEventListener("input", handleInputChange);




// image processing

var imageUpload = document.getElementById("imageUpload");

imageUpload.addEventListener("change", handleImageUpload);

function handleImageUpload(event) {
  var file = event.target.files[0];
  
  // Process the image file
  processImage(file);
}

function processImage(file) {
  var reader = new FileReader();

  reader.onload = function(event) {
    var imageDataURL = event.target.result;
    
    // Use the image data URL as needed (e.g., display or manipulate the image)
    displayUploadedImage(imageDataURL);
  };

  reader.readAsDataURL(file);
}

function displayUploadedImage(imageDataURL) {
  	var imgElement = document.getElementById("animationFrames");
  	imgElement.src = imageDataURL;

	var animationPreviewContainer = document.getElementById("animationPreview");
	animationPreviewContainer.style.backgroundImage = "url(" + imageDataURL + ")";  
}


function getImageDimensions(url, callback) {
  const img = new Image();
  img.onload = function() {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    callback(width, height);
  };
  img.src = url;
}



function resizeAnimationPreview() {
  // Get the required values
  var framesWidth = 4000;
  var noFrames = noFrames;
  var framesHeight = 300;


  // Calculate the width based on framesWidth and noFrames
  var width = framesWidth / noFrames;
  
  // Check if the width exceeds the maximum width of 480px
  if (width > 320) {
    // Scale down the dimensions proportionally
    var scaleFactor = 320 / width;
    width *= scaleFactor;
    framesHeight *= scaleFactor;
  }
  
  // Set the width and height of #animationPreview
  var animationPreview = document.getElementById("animationPreview");
  animationPreview.style.width = width + "px";
  animationPreview.style.height = framesHeight + "px";
}


