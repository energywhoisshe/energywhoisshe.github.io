
//*spacebar 안내 한번만 보기*//
let hasShownSpaceHint = false;



// Ensure the SPACE hint element exists inside the modal (works even if HTML doesn't include it)
function ensureSpaceHintElement() {
  const modal = document.getElementById("modal");
  if (!modal) return null;

  let hint = document.getElementById("space-hint");
  if (!hint) {
    hint = document.createElement("div");
    hint.id = "space-hint";
    hint.textContent = "Press SPACE to enter full view";
    modal.appendChild(hint);
  }

  // Apply safe default styling (so it shows even without CSS)
  hint.style.position = "absolute";
  hint.style.bottom = "32px";
  hint.style.left = "50%";
  hint.style.transform = "translateX(-50%)";
  hint.style.zIndex = "1001";
  hint.style.opacity = "0";
  hint.style.transition = "opacity 0.8s ease";
  hint.style.pointerEvents = "none";
  hint.style.fontFamily = "inherit";
  hint.style.fontSize = "14px";
  hint.style.color = "rgba(255,255,255,0.65)";
  hint.style.letterSpacing = "0.02em";

  return hint;
}

document.querySelectorAll('.folder-item').forEach((item) => {
  const name = item.querySelector('.name')?.innerText.trim();
  if (name === 'Talks' || name === 'Pre-presentation') {
    item.addEventListener('click', () => {
      const slider = item.nextElementSibling;
      if (slider && slider.classList.contains('inline-slider')) {
        slider.classList.toggle('active');
      }
    });
  }
});

//**//
    let current = 0;
    const slides = document.querySelectorAll('.slide');

    function changeSlide(step) {
      slides[current].classList.remove('active');
      current = (current + step + slides.length) % slides.length;
      slides[current].classList.add('active');
    }

//**//
let modalItems = [];   // { src, gray }
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");

  // 이미지 + 그 이미지가 속한 슬라이더가 grayscale인지 함께 저장
  function buildModalItems() {
  const imgs = Array.from(document.querySelectorAll('img[onclick*="openModal"]'));
  return imgs.map(img => ({
    src: img.src,
    gray: img.closest(".inline-slider")?.classList.contains("grayscale") || false
  }));
}

modalItems = buildModalItems();


  function applyModalFilter() {
    const isGray = modalItems[currentIndex]?.gray;
    modalImg.style.filter = isGray ? "grayscale(100%)" : "none";
  }

  //* openModal 교체 *//
  window.openModal = function(arg) {
    // arg: <img> 엘리먼트(this) or 문자열(this.src) 모두 지원
    const src = (typeof arg === "string") ? arg : arg.src;

    currentIndex = modalItems.findIndex(x => x.src === src);
    if (currentIndex < 0) currentIndex = 0;

    // src를 못 찾았을 때도 안전하게 열리게
    modalImg.src = modalItems[currentIndex]?.src || src;

    // grayscale 적용도 안전하게
    applyModalFilter();

    modal.style.display = "flex";

    // ✅ SPACE 힌트: 이 페이지에서 1번만
    if (!hasShownSpaceHint) {
      const hint = ensureSpaceHintElement();
      if (hint) {
        hint.style.opacity = "1";
        setTimeout(() => { hint.style.opacity = "0"; }, 2200);
      }
      hasShownSpaceHint = true;
    }

    document.addEventListener("keydown", keyHandler);
  };

  //*openModal 교체*//
  
  window.closeModal = function() {
    modal.style.display = "none";
    document.removeEventListener("keydown", keyHandler);
  };

  window.nextImage = function() {
    currentIndex = (currentIndex + 1) % modalItems.length;
    modalImg.src = modalItems[currentIndex].src;
    applyModalFilter();
  };

  window.prevImage = function() {
    currentIndex = (currentIndex - 1 + modalItems.length) % modalItems.length;
    modalImg.src = modalItems[currentIndex].src;
    applyModalFilter();
  };

  function keyHandler(event) {
    if (event.key === "ArrowRight") nextImage();
    else if (event.key === "ArrowLeft") prevImage();
    else if (event.key === "Escape") closeModal();
  }
});

// === Spacebar: toggle fullscreen black background in modal ===
let fullscreenMode = false;

function toggleFullscreenMode() {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  if (!modal || !modalImg) return;

  // 모달이 열려있을 때만 동작하게(원하면 이 조건 제거 가능)
  if (modal.style.display !== "flex") return;

  fullscreenMode = !fullscreenMode;

  const leftArrow = modal.children[0];
  const rightArrow = modal.children[1];

  if (fullscreenMode) {
    modal.style.background = "black";
    leftArrow.style.opacity = "0";
    rightArrow.style.opacity = "0";
    document.body.style.overflow = "hidden";
  } else {
    modal.style.background = "rgba(0,0,0,0.8)";
    leftArrow.style.opacity = "";
    rightArrow.style.opacity = "";
    document.body.style.overflow = "";
  }
}

// Space 누르면 토글 (스크롤 방지)
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    toggleFullscreenMode();
  }
});


/* === Block right-click ONLY on images === */

document.addEventListener("contextmenu", function(e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach(img => {
    img.setAttribute("draggable", "false");
  });
});