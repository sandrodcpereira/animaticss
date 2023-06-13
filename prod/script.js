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
var lastPickedDemo = -1;
var randomDemo;
var animationPreview = document.getElementById("animationPreview");
var currentFrame = document.getElementById("currentFrame");
var selectFrames = document.getElementById("selectFrames");
var animationSpeedInput = document.getElementById("animationSpeed");
var imageUploadAlias = document.getElementById("imageUploadAlias");
var refreshButton = document.getElementById("refreshButton");
var imageUpload = document.getElementById("imageUpload");
var frameInput = document.getElementById('frameInput');
var codeContainer = document.querySelector('.language-css');


document.addEventListener("DOMContentLoaded", function() {
	pickNewDemo();
});

async function pickNewDemo() {
	await pickRandomDemo();          // step 1
	await updateSourceFromDemo();    // step 2
	await noFramesUpdate();          // step 3
	await handleNewSource();
	await animationSpeedUpdate();
  await updateCodeSnippet()
} 

async function handleNewSource() {
  await calculateSourceDimensions();    // step 4
  await new Promise((resolve) => setTimeout(resolve, 300));
  await resizeAnimationPreview();       // step 5
	await updateAnimationKeyframes();     // step 6
  await findPossibleNoFrames();
  await generateRadioButtons();
  await noFramesScrollToSelection();
  await noFramesUpdate();
}

// step 1, pick a random demo
// inputs: --
// outputs: noFrames, animationSpeed, sourceImg, animationSpeedAdjusted

function pickRandomDemo() {
  do {
    randomDemo = Math.floor(Math.random() * animationDemo.length);
  } while (randomDemo === lastPickedDemo);

  lastPickedDemo = randomDemo;
  var randomDemo = animationDemo[randomDemo];
	noFrames = randomDemo.noFrames;
	animationSpeed = randomDemo.animationSpeed;
	sourceImg = randomDemo.sourceImg;
	animationSpeedAdjusted = randomDemo.animationSpeed * 0.1;
	animationSpeedInput.value = animationSpeed;
	console.log("1. Picking a random demo...");
}

// step 2, use image source from demo selected
// inputs: sourceImg
// outputs: --

function updateSourceFromDemo() {
	var sourceImgContainer = document.getElementById("sourceImg");
	sourceImgContainer.src = sourceImg;
	animationPreview.style.backgroundImage = "url(" + sourceImg + ")";
	console.log("2. Demo picked. Now processing...");
}

// step 3, updates animation based on number of frames selected
// inputs: animationSpeedAdjusted, noFrames
// outputs: --

function noFramesUpdate() {
	var animationPreviewUpdate = `preview ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;
	var animationFrameUpdate = `currentFrame ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;
	var frameWidthPercentage = 100 / noFrames;

	animationPreview.style.animation = animationPreviewUpdate; 								// updates number of steps
  currentFrame.style.width = "calc(" + frameWidthPercentage + "% - 4px)"; 	// updates current frame width
  currentFrame.style.animation = animationFrameUpdate;											// updates current frame steps

  console.log("3. Updated the number of steps to the ones defined (in the array or by input).")
  updateCodeSnippet();
}

// step 4, lifts and stores dimensions of the image source
// inputs: sourceImg
// outputs: sourceWidth, sourceHeight

function calculateSourceDimensions() {
  	var img = new Image();
  	img.src = sourceImg;

  	img.onload = function() {
  	  sourceWidth = this.naturalWidth;
  	  sourceHeight = this.naturalHeight;

  	  console.log("4. New demo size is: " + sourceWidth + " by " + sourceHeight + ".");
  	};
}

// step 5, resizes the preview according to number of frames selected
// inputs: sourceWidth, noFrames, sourceHeight
// outputs: previewWidth, previewHeight

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

	console.log("5. Resized the animation preview window to match the number of steps.");
}

// step 6, updates the animation keyframes to match the preview window
// inputs: previewWidth
// outputs: --

function updateAnimationKeyframes() {
  let root = document.documentElement;
  root.style.setProperty('--previewEnd', "calc(100% - " + (previewWidth) + "px)");

  console.log( root.style.getPropertyValue('--previewEnd') );
  console.log("6. Updated the CSS keyframes to match the size of the preview.");
}





// updates frames on change to radio button selection

selectFrames.addEventListener("change", function(event) {
  var selectedRadioButton = event.target;

  if (selectedRadioButton.checked) {
    noFrames = selectedRadioButton.value;
    resizeAnimationPreview();
    noFramesUpdate(); 
    updateAnimationKeyframes();
    noFramesScrollToSelection();
  }
});







// updates speed on changes to the slider

function handleSpeedChange(event) {
	var inputId = event.target.id;
  var inputValue = event.target.value;

	animationSpeed = inputValue;
	animationSpeedAdjusted = inputValue * 0.1;
	console.log("animationSpeed changed. New value:", animationSpeed);
	animationSpeedUpdate();
}

animationSpeedInput.addEventListener("input", handleSpeedChange);

// updates animation speed in the code

function animationSpeedUpdate() {
  var speedPreviewUpdate = `preview ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;
  var speedFrameUpdate = `currentFrame ${animationSpeedAdjusted}s steps(${noFrames}) infinite`;

    animationPreview.style.animation = speedPreviewUpdate;
    currentFrame.style.animation = speedFrameUpdate;
    updateCodeSnippet();
}






// handles the local image upload 

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

// updates the image sources from an uploaded asset

function updateSourceFromUpload(imageDataURL) {
  	var imgElement = document.getElementById("sourceImg");
  	imgElement.src = imageDataURL;
	animationPreview.style.backgroundImage = "url(" + imageDataURL + ")";  
	sourceImg = imageDataURL;

	handleNewSource();
	resetNoFrames();
}

// resets the number of frames when a new image is uploaded

function resetNoFrames() {
  var radioButtons = selectFrames.querySelectorAll("input[type='radio']");
  
  if (radioButtons.length > 0) {
    var firstRadioButton = radioButtons[0];
    firstRadioButton.checked = true;
    noFrames = firstRadioButton.value;

    updateCodeSnippet();
  }
}

// codes for toolbar buttons

refreshButton.addEventListener("click", pickNewDemo);

imageUploadAlias.addEventListener("click", function() {
  imageUpload.click();
});

var darkBackground = document.getElementById("darkBackground");

darkBackground.addEventListener("click", function() {
  darkBackground.classList.toggle("dark");
  document.body.classList.toggle("dark");

});


// calculate integer options for number of frames

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

// generates radio buttons based on the function above

function generateRadioButtons() {
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

    var selectedRadioButton = selectFrames.querySelector("input[type='radio'][value='" + noFrames + "']");
    if (selectedRadioButton) {
      selectedRadioButton.checked = true;
    }
  }
}

// scrolls the number of frames input to show the selected value

function noFramesScrollToSelection() {
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
	frameInput.scrollLeft = scrollOffset;
}

var nextFrameButton = document.getElementById('nextFrame');
nextFrameButton.addEventListener('click', selectNextRadioButton);

function selectNextRadioButton() {
  var radioButtons = selectFrames.querySelectorAll('input[type="radio"]');
  
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      radioButtons[i].checked = false;
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

// selects the previous value in number of frames

function selectPreviousRadioButton() {
  var radioButtons = selectFrames.querySelectorAll('input[type="radio"]');
  
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      radioButtons[i].checked = false;
      
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

// saves the current selected number of frames (not sure what this is for)

function storeSelectedNoFrames() {
  var selectedRadioButton = selectFrames.querySelector('input[type="radio"]:checked');

  if (selectedRadioButton) {
    noFrames = selectedRadioButton.value;
  }
}

// update css snippet

function updateCodeSnippet() {
  var sourceWidthPerFrame = sourceWidth / noFrames;
  document.getElementById("replaceWidth").textContent = sourceWidthPerFrame + "px";
  document.getElementById("replaceHeight").textContent = sourceHeight + "px";
  document.getElementById("replaceSpeed").textContent = animationSpeedAdjusted.toFixed(1) + "s";
  document.getElementById("replaceFrames").textContent = noFrames;
  document.getElementById("replaceBackgroundPosition").textContent = "-" + sourceWidth + "px";
}

// copy code snippet button

function copyCodeSnippet() {
  var codeSnippetContainer = document.getElementById("codeSnippet");
  var codeSnippetText = codeSnippetContainer.textContent || codeSnippetContainer.innerText;

  var textarea = document.createElement("textarea");
  textarea.value = codeSnippetText;
  document.body.appendChild(textarea);

  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  copyCodeButton.classList.add("copied");
  setTimeout(() => {
    copyCodeButton.classList.remove("copied");
  }, 1000);
}

var copyCodeButton = document.getElementById("copyCode");
copyCodeButton.addEventListener("click", copyCodeSnippet);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();

    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

