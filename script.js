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
var sourceWidth = 10000;
var sourceHeight = 1000;

var previewWidth;
var previewHeight;


var animationPreview = document.getElementById("animationPreview");
var noFramesInput = document.getElementById("noFrames");
var animationSpeedInput = document.getElementById("animationSpeed");



// Page load actions

function pickRandomDemoOnLoad() {
	var randomIndex = Math.floor(Math.random() * animationDemo.length);
	var randomDemo = animationDemo[randomIndex];

	noFrames = randomDemo.noFrames;
	animationSpeed = randomDemo.animationSpeed;
	sourceImg = randomDemo.sourceImg;
	animationSpeedAdjusted = randomDemo.animationSpeed * 0.1;

	noFramesInput.value = noFrames;
	animationSpeedInput.value = animationSpeed;
}

function updateFramesOnLoad() {
	var sourceImgContainer = document.getElementById("sourceImg");
	sourceImgContainer.src = sourceImg;

	animationPreview.style.backgroundImage = "url(" + sourceImg + ")";
}

document.addEventListener("DOMContentLoaded", function() {
	pickRandomDemoOnLoad();
	updateFramesOnLoad();
	noFramesUpdate();
	animationSpeedUpdate();
	resizeAnimationPreview();

	updateAnimationKeyframes();
	
});




// Update preview based on changes to values

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

    	updateAnimationKeyframes();

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




// image upload processing

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
    
    displayUploadedImage(imageDataURL);
  };

  reader.readAsDataURL(file);
}

function displayUploadedImage(imageDataURL) {
  	var imgElement = document.getElementById("sourceImg");
  	imgElement.src = imageDataURL;

	animationPreview.style.backgroundImage = "url(" + imageDataURL + ")";  
}


// aspect ratio calculation







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




// test

// Function to update the @keyframes rule
function updateAnimationKeyframes() {
  // Get the style sheets
  var styleSheets = document.styleSheets;

  // Loop through the style sheets
  for (var i = 0; i < styleSheets.length; i++) {
    var styleSheet = styleSheets[i];

    // Check if the style sheet is a CSSStyleSheet
    if (styleSheet instanceof CSSStyleSheet) {
      // Loop through the CSS rules
      var rules = styleSheet.cssRules || styleSheet.rules;
      for (var j = 0; j < rules.length; j++) {
        var rule = rules[j];

        // Check if the rule is a keyframes rule and matches the name "preview"
        if (rule instanceof CSSKeyframesRule && rule.name === "preview") {
          // Loop through the keyframes
          var keyframes = rule.cssRules;
          for (var k = 0; k < keyframes.length; k++) {
            var keyframe = keyframes[k];

            // Check if the keyframe rule contains the property "background-position-x"
            if (keyframe.style.hasOwnProperty("backgroundPositionX")) {
              // Update the value of the "background-position-x" property
              keyframe.style.backgroundPositionX = "calc(100% - " + previewWidth + "px)";
            }
          }
        }
      }
    }
  }
}







