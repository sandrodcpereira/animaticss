var whyModal = document.getElementById("whyModal");
var creditsModal = document.getElementById("creditsModal");

var creditsModalTrigger = document.getElementById("creditsModalTrigger");
var whyModalTrigger = document.querySelectorAll(".whyModalTrigger");

var creditsModalCloseTrigger = document.getElementById("creditsModalClose");
var whyModalCloseTrigger = document.getElementById("whyModalClose");

creditsModalTrigger.addEventListener("click", function() {
  creditsModal.classList.add("open");
  document.body.style.overflow = 'hidden';
});

whyModalTrigger.forEach(function(trigger) {
  trigger.addEventListener("click", function() {
    whyModal.classList.add("open");
    document.body.style.overflow = 'hidden';
  });
});

creditsModalCloseTrigger.addEventListener("click", function() {
  creditsModalClose();
});


whyModalCloseTrigger.addEventListener("click", function() {
  whyModalClose();
});

window.onclick = function(event) {
  if (event.target == whyModal) {
    whyModalClose();
  };
  if (event.target == creditsModal) {
    creditsModalClose();
  }
}

function whyModalClose() {
	whyModal.classList.remove("open");
	document.body.style.overflow = 'initial';
}

function creditsModalClose() {
	creditsModal.classList.remove("open");
	document.body.style.overflow = 'initial';
}

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && document.getElementById("whyModal").classList.contains("open")) {
    whyModalClose();
  }
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && document.getElementById("creditsModal").classList.contains("open")) {
    creditsModalClose();
  }
});


