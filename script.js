var animationDemo = [
	{
    	noFrames: 10,
    	animationSpeed: 9,
   		sourceImg: "assets/demo-1.png"
	},
	{
    	noFrames: 24,
    	animationSpeed: 20,
    	sourceImg: "assets/demo-2.png"
	},
	{
    	noFrames: 22,
    	animationSpeed: 19,
    	sourceImg: "assets/demo-3.png"
	},
];

var noFrames;
var animationSpeed;
var animationSpeedAdjusted;

var sourceImg;


var previewWidth;
var previewHeight;




var animationPreview = document.getElementById("animationPreview");
var noFramesInput = document.getElementById("noFrames");
var animationSpeedInput = document.getElementById("animationSpeed");


var sourceWidth;
var sourceHeight;





noFramesInput.addEventListener("keydown", function(event) {
  // Check if Shift key is pressed
  if (event.shiftKey) {
    // Increase or decrease value by 10
    if (event.key === "ArrowUp") {
      noFramesInput.stepUp(9);
    } else if (event.key === "ArrowDown") {
      noFramesInput.stepDown(9);
    }
  }
});

noFramesInput.addEventListener("keyup", function(event) {
  // Reset the input's step value to 1 when Shift key is released
  if (!event.shiftKey) {
    noFramesInput.step = 1;
  }
});



// Picks a random demo out of the array defined above

function pickRandomDemo() {
	var randomIndex = Math.floor(Math.random() * animationDemo.length);
	var randomDemo = animationDemo[randomIndex];

	noFrames = randomDemo.noFrames;
	animationSpeed = randomDemo.animationSpeed;
	sourceImg = randomDemo.sourceImg;
	animationSpeedAdjusted = randomDemo.animationSpeed * 0.1;

	noFramesInput.value = noFrames;
	animationSpeedInput.value = animationSpeed;
}

// Updates the images from the local available demos

function updateSourceFromDemo() {
	var sourceImgContainer = document.getElementById("sourceImg");
	sourceImgContainer.src = sourceImg;

	animationPreview.style.backgroundImage = "url(" + sourceImg + ")";
}

document.addEventListener("DOMContentLoaded", function() {
	
	pickRandomDemo();				// fetch demo
	updateSourceFromDemo();				// update image assets
	calculateSourceDimensions();	// caculate image asset dimensions

	noFramesUpdate();				// update number of frames from array
	animationSpeedUpdate();			// update animation speed from array

	setTimeout(resizeAnimationPreview, 50);
	setTimeout(updateAnimationKeyframes, 50);
});


// Calculates the image source dimensions for use in all those functions down below.

function calculateSourceDimensions() {
	var img = new Image();
	img.src = sourceImg;

	img.onload = function() {
	  // Store the width and height in variables
	  sourceWidth = this.naturalWidth;
	  sourceHeight = this.naturalHeight;

	  // Use the width and height variables as needed
	  console.log("Image width: " + sourceWidth);
	  console.log("Image height: " + sourceHeight);
	};
}


// Makes all the changes and calls all the functions when the values are updated.

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

    resizeAnimationPreview();		// resizes the animation preview window
    updateAnimationKeyframes();		// update the CSS keyframes to the correct value
}

function animationSpeedUpdate() {
	var speedPreviewUpdate = `preview ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;
	var speedFrameUpdate = `currentFrame ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;

    animationPreview.style.animation = speedPreviewUpdate;
    currentFrame.style.animation = speedFrameUpdate;
}




// Runs all the necessary functions when the value of the inputs change.

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
    	resizeAnimationPreview();
    }
}

noFramesInput.addEventListener("input", handleInputChange);
animationSpeedInput.addEventListener("input", handleInputChange);



// Handles the local image upload 

var imageUpload = document.getElementById("imageUpload");

imageUpload.addEventListener("change", handleImageUpload);

function handleImageUpload(event) {
  var file = event.target.files[0];
    processImage(file);
}

function processImage(file) {
  var reader = new FileReader();
  reader.onload = function(event) {
    var imageDataURL = event.target.result;  
    updateSourceFromUpload(imageDataURL);
  };

  reader.readAsDataURL(file);
}

function updateSourceFromUpload(imageDataURL) {
  	var imgElement = document.getElementById("sourceImg");
  	imgElement.src = imageDataURL;
	animationPreview.style.backgroundImage = "url(" + imageDataURL + ")";  
	sourceImg = imageDataURL;

	calculateSourceDimensions();
	setTimeout(resizeAnimationPreview, 50);
	setTimeout(updateAnimationKeyframes, 50);
	
}


// Resizes the animation preview window to match the size of each individual frame

function resizeAnimationPreview() {

	previewWidth = sourceWidth / noFrames;
	previewHeight = sourceHeight;


	if (previewWidth > 320) {

		var scaleFactor = 320 / previewWidth;
		previewWidth *= scaleFactor;
		previewHeight *= scaleFactor;
	}

	if (previewHeight > 320) {
    	var scaleFactor = 320 / previewHeight;
    	previewWidth *= scaleFactor;
    	previewHeight *= scaleFactor;
	}

	animationPreview.style.width = previewWidth + "px";
	animationPreview.style.height = previewHeight + "px";
}

// Updates CSS keyframe logic to account for the preview window size

function updateAnimationKeyframes() {
  var styleSheets = document.styleSheets;

  for (var i = 0; i < styleSheets.length; i++) {
    var styleSheet = styleSheets[i];

    if (styleSheet instanceof CSSStyleSheet) {
      var rules = styleSheet.cssRules || styleSheet.rules;
      for (var j = 0; j < rules.length; j++) {
        var rule = rules[j];

        if (rule instanceof CSSKeyframesRule && rule.name === "preview") {
          var keyframes = rule.cssRules;
          for (var k = 0; k < keyframes.length; k++) {
            var keyframe = keyframes[k];

            if (keyframe.style.hasOwnProperty("backgroundPositionX")) {
              keyframe.style.backgroundPositionX = "calc(100% - " + previewWidth + "px)";
            }
          }
        }
      }
    }
  }
}







