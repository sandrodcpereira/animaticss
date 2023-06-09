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

var imageUploadAlias = document.getElementById("imageUploadAlias");
var refreshButton = document.getElementById("refreshButton");
var imageUpload = document.getElementById("imageUpload");

var sourceWidth;
var sourceHeight;



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
	pickNewDemo();
});


function pickNewDemo() {
	pickRandomDemo();				// fetch demo
	updateSourceFromDemo();				// update image assets
	calculateSourceDimensions();	// caculate image asset dimensions

	noFramesUpdate();				// update number of frames from array
	animationSpeedUpdate();			// update animation speed from array

	setTimeout(resizeAnimationPreview, 50);
	setTimeout(updateAnimationKeyframes, 50);
} 

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

function noFramesUpdate() {
	var animationPreviewUpdate = `preview ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;
	var animationFrameUpdate = `currentFrame ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;

	var frameWidthPercentage = 100 / noFrames;
    currentFrame.style.width = "calc(" + frameWidthPercentage + "% - 4px)";
    
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

function handleSpeedChange(event) {
	var inputId = event.target.id;
  var inputValue = event.target.value;

	animationSpeed = inputValue;
	animationSpeedAdjusted = inputValue * 0.1;
	console.log("animationSpeed changed. New value:", animationSpeed);
	animationSpeedUpdate();
	resizeAnimationPreview();
}

animationSpeedInput.addEventListener("input", handleSpeedChange);


function handleNoFramesChange(event) {
	var inputId = event.target.id;
  var inputValue = event.target.value;

  noFrames = inputValue;
	console.log("noFrames changed. New value:", noFrames);
	noFramesUpdate();
}

noFramesInput.addEventListener("input", handleNoFramesChange);



// Handles the local image upload 

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



// Actions

refreshButton.addEventListener("click", pickNewDemo);

imageUploadAlias.addEventListener("click", function() {
  imageUpload.click();
});


var darkBackground = document.getElementById("darkBackground");

darkBackground.addEventListener("click", function() {
  darkBackground.classList.toggle("dark");
});


// Calculating possible options for noFrames

var possibleNoFrames;

function findPossibleNoFrames() {
  possibleNoFrames = [];
  
  for (var i = 2; i <= 64; i++) {
    var result = sourceWidth / i;
    
    if (Number.isInteger(result)) {
      possibleNoFrames.push(i);
    }
  }
  
  return possibleNoFrames;
}

function generateRadioButtons() {
  var selectFrames = document.getElementById("selectFrames");
  
  selectFrames.innerHTML = "";
  
  for (var i = 0; i < possibleNoFrames.length; i++) {
    var radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.name = "noFrames";
    radioButton.value = possibleNoFrames[i];
    radioButton.id = possibleNoFrames[i];
    
    selectFrames.appendChild(radioButton);
    
    var label = document.createElement("label");
    label.textContent = possibleNoFrames[i];
    label.setAttribute("for", possibleNoFrames[i]); // Set the "for" attribute
    
    selectFrames.appendChild(label);
  }

  var radioButtons = document.querySelectorAll("#selectFrames input[type='radio']");

  for (var i = 0; i < radioButtons.length; i++) {
	  if (radioButtons[i].value == noFrames) {
	    radioButtons[i].checked = true;
	    break; // Stop the loop after finding the matching radio button
	  }
	}
}





