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
var possibleNoFrames;
var animationSpeed;
var animationSpeedAdjusted;
var sourceImg;
var sourceWidth;
var sourceHeight;
var previewWidth;
var previewHeight;

var animationPreview = document.getElementById("animationPreview");
var currentFrame = document.getElementById("currentFrame");
var selectFrames = document.getElementById("selectFrames");
var animationSpeedInput = document.getElementById("animationSpeed");
var imageUploadAlias = document.getElementById("imageUploadAlias");
var refreshButton = document.getElementById("refreshButton");
var imageUpload = document.getElementById("imageUpload");

document.addEventListener("DOMContentLoaded", function() {
	pickNewDemo();
});

async function pickNewDemo() {
	await pickRandomDemo();
	await updateSourceFromDemo();
	await noFramesUpdate();
	await handleNewSource();
	await animationSpeedUpdate();
} 

async function handleNewSource() {
  await calculateSourceDimensions();
  await new Promise((resolve) => setTimeout(resolve, 200));
  await resizeAnimationPreview();
	await updateAnimationKeyframes();
  await findPossibleNoFrames();
  await generateRadioButtons();
  await noFramesScrollToSelection();
}

function pickRandomDemo() {
	var randomIndex = Math.floor(Math.random() * animationDemo.length);
	var randomDemo = animationDemo[randomIndex];
	noFrames = randomDemo.noFrames;
	animationSpeed = randomDemo.animationSpeed;
	sourceImg = randomDemo.sourceImg;
	animationSpeedAdjusted = randomDemo.animationSpeed * 0.1;
	animationSpeedInput.value = animationSpeed;
	console.log("1. Picking a random demo...");
}

function updateSourceFromDemo() {
	var sourceImgContainer = document.getElementById("sourceImg");
	sourceImgContainer.src = sourceImg;
	animationPreview.style.backgroundImage = "url(" + sourceImg + ")";
	console.log("2. Demo picked. Now processing...");
}

// checks for new frames selected on radio button

selectFrames.addEventListener("change", function(event) {
  var selectedRadioButton = event.target;

  if (selectedRadioButton.checked) {
    noFrames = selectedRadioButton.value;
    console.log(noFrames);
    
    resizeAnimationPreview();
		noFramesUpdate();	
		updateAnimationKeyframes();

		noFramesScrollToSelection();
  }
});

function noFramesUpdate() {
	var animationPreviewUpdate = `preview ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;
	var animationFrameUpdate = `currentFrame ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;
	var frameWidthPercentage = 100 / noFrames;

	animationPreview.style.animation = animationPreviewUpdate; 								// updates number of steps
  currentFrame.style.width = "calc(" + frameWidthPercentage + "% - 4px)"; 	// updates current frame width
  currentFrame.style.animation = animationFrameUpdate;											// updates current frame steps

  console.log("3. Updated the number of steps to the ones defined (in the array or by input).")
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
	  console.log("4. New demo size is: " + sourceWidth + " by " + sourceHeight + ".");
	};
}

// Makes all the changes and calls all the functions when the values are updated.

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

	animationPreview.style.width = previewWidth + "px"; 		// sets preview width
	animationPreview.style.height = previewHeight + "px";		// sets preview height

	console.log("5. Resized the animation preview window to match the number of steps.")
}

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

  console.log("6. Updated the CSS keyframes to match the size of the preview.");
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
}

animationSpeedInput.addEventListener("input", handleSpeedChange);

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

	handleNewSource();
	resetNoFrames();
}

function resetNoFrames() {
  var radioButtons = selectFrames.querySelectorAll("input[type='radio']");
  
  if (radioButtons.length > 0) {
    var firstRadioButton = radioButtons[0];
    firstRadioButton.checked = true;
    noFrames = firstRadioButton.value;
  }
}

// toolbar

refreshButton.addEventListener("click", pickNewDemo);

imageUploadAlias.addEventListener("click", function() {
  imageUpload.click();
});

var darkBackground = document.getElementById("darkBackground");

darkBackground.addEventListener("click", function() {
  darkBackground.classList.toggle("dark");
});

// calculate integer options for noFrames, generate radio button

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
  var radioButtons = selectFrames.querySelectorAll("input[type='radio']");
  var noFramesContainer = document.getElementById("noFramesContainer");

  selectFrames.innerHTML = "";



  if (possibleNoFrames.length === 0) {

    var messageElement = document.createElement("p");
    messageElement.textContent = "Oops, can't split this image into equal sized frames...";
    noFramesContainer.appendChild(messageElement);

  } else {
    for (var i = 0; i < possibleNoFrames.length; i++) {
      var radioButton = document.createElement("input");
      radioButton.type = "radio";
      radioButton.name = "noFrames";
      radioButton.value = possibleNoFrames[i];
      radioButton.id = possibleNoFrames[i];
      var messageElement = noFramesContainer.querySelector("#noFramesContainer > p");

      if (messageElement) {
		    noFramesContainer.removeChild(messageElement);
		  }

      selectFrames.appendChild(radioButton);
      
      var label = document.createElement("label");
      label.textContent = possibleNoFrames[i];
      label.setAttribute("for", possibleNoFrames[i]); // Set the "for" attribute
    
      
    	selectFrames.appendChild(label);

    }

    // Select the radio button with the value matching noFrames
    var selectedRadioButton = selectFrames.querySelector("input[type='radio'][value='" + noFrames + "']");
    if (selectedRadioButton) {
      selectedRadioButton.checked = true;
    }
  }
}

// Frames input logic



function noFramesScrollToSelection() {
	var element = document.getElementById('frameInput');
	//element.scrollLeft += 100; // Scroll right by 100 pixels


	var radioButtons = document.querySelectorAll('#selectFrames input[type="radio"]');
	var radioButtonCount = radioButtons.length;

	var checkedIndex = -1;
	for (var i = 0; i < radioButtonCount; i++) {
	  if (radioButtons[i].checked) {
	    checkedIndex = i;
	    break;
	  }
	}

	var scrollOffset = checkedIndex * 40;
	var frameInput = document.getElementById('frameInput');
	frameInput.scrollLeft = scrollOffset;
}


var nextFrameButton = document.getElementById('nextFrame');
nextFrameButton.addEventListener('click', selectNextRadioButton);


function selectNextRadioButton() {
  var selectFrames = document.getElementById('selectFrames');
  var radioButtons = selectFrames.querySelectorAll('input[type="radio"]');
  
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      // Uncheck the current radio button
      radioButtons[i].checked = false;
      
      // Select the next radio button (loop back to the beginning if reached the end)
      var nextIndex = (i + 1) % radioButtons.length;
      radioButtons[nextIndex].checked = true;
            
      break;
    }
  }
  noFramesScrollToSelection();
  storeSelectedNoFrames();
  resizeAnimationPreview();
	noFramesUpdate();	
	updateAnimationKeyframes();
}

var prevFrameButton = document.getElementById('prevFrame');
prevFrameButton.addEventListener('click', selectPreviousRadioButton);

function selectPreviousRadioButton() {
  var selectFrames = document.getElementById('selectFrames');
  var radioButtons = selectFrames.querySelectorAll('input[type="radio"]');
  
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      // Uncheck the current radio button
      radioButtons[i].checked = false;
      
      // Select the previous radio button (loop back to the end if reached the beginning)
      var prevIndex = (i - 1 + radioButtons.length) % radioButtons.length;
      radioButtons[prevIndex].checked = true;
      
      break;
    }
  }
  noFramesScrollToSelection();
  storeSelectedNoFrames();
  resizeAnimationPreview();
	noFramesUpdate();	
	updateAnimationKeyframes();
}


function storeSelectedNoFrames() {
  var selectFrames = document.getElementById('selectFrames');
  var selectedRadioButton = selectFrames.querySelector('input[type="radio"]:checked');

  if (selectedRadioButton) {
    noFrames = selectedRadioButton.value;
  }
}

