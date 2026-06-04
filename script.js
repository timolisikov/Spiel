const canvas = document.getElementById("confetti-canvas");
const candles = Array.from(document.querySelectorAll(".candle"));
const finale = document.getElementById("finale");
const imageModal = document.getElementById("image-modal");
const imageModalPhoto = document.getElementById("image-modal-photo");
const animalZoomButtons = Array.from(document.querySelectorAll(".animal-zoom-button"));
const imageModalCloseButtons = Array.from(document.querySelectorAll(".image-modal-close, .image-modal-backdrop"));

function openImageModal(image) {
  if (!imageModal || !imageModalPhoto) {
    return;
  }

  imageModalPhoto.src = image.src;
  imageModalPhoto.alt = image.alt;
  imageModal.classList.remove("hidden");
  imageModal.setAttribute("aria-hidden", "false");
}

function closeImageModal() {
  if (!imageModal || !imageModalPhoto) {
    return;
  }

  imageModal.classList.add("hidden");
  imageModal.setAttribute("aria-hidden", "true");
  imageModalPhoto.src = "";
  imageModalPhoto.alt = "";
}

animalZoomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");

    if (image) {
      openImageModal(image);
    }
  });
});

imageModalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeImageModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeImageModal();
  }
});

if (canvas) {
  const ctx = canvas.getContext("2d");
  const confettiPieces = [];
  const confettiColors = ["#ff5f87", "#ffd95a", "#7ed6ff", "#87f2a8", "#9c89ff", "#ff9f68"];

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function burstConfetti(amount) {
    for (let index = 0; index < amount; index += 1) {
      confettiPieces.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * window.innerHeight * 0.4,
        size: 5 + Math.random() * 9,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speedX: -2 + Math.random() * 4,
        speedY: 2 + Math.random() * 4.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: -0.16 + Math.random() * 0.32,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    confettiPieces.forEach((piece) => {
      piece.x += piece.speedX;
      piece.y += piece.speedY;
      piece.rotation += piece.rotationSpeed;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;

      if (piece.shape === "rect") {
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.65);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    for (let index = confettiPieces.length - 1; index >= 0; index -= 1) {
      if (confettiPieces[index].y > window.innerHeight + 40) {
        confettiPieces.splice(index, 1);
      }
    }

    requestAnimationFrame(animateConfetti);
  }

  resizeCanvas();
  burstConfetti(document.body.classList.contains("page-game") ? 120 : 180);
  animateConfetti();
  window.addEventListener("resize", resizeCanvas);

  if (candles.length > 0) {
    candles.forEach((candle) => {
      candle.addEventListener("click", () => {
        candle.classList.add("is-out");
        candle.disabled = true;

        if (candles.every((item) => item.classList.contains("is-out"))) {
          finale.classList.remove("hidden");
          burstConfetti(260);
        }
      });
    });
  }
}
