const photos = [
  {
    src: "assets/photos/photo-01.jpeg",
    alt: "Una selfie de los dos bajo el cielo azul.",
    caption: "a tu lado ♡",
  },
  {
    src: "assets/photos/photo-02.jpeg",
    alt: "Los dos juntos frente al espejo.",
    caption: "mi lugar favorito",
  },
  {
    src: "assets/photos/photo-03.jpeg",
    alt: "Una aventura juntos rodeados de montañas.",
    caption: "aventuras contigo",
  },
  {
    src: "assets/photos/photo-04.jpeg",
    alt: "Una cena especial para celebrar juntos.",
    caption: "un día para recordar",
  },
  {
    src: "assets/photos/photo-05.jpeg",
    alt: "Los dos juntos en lo alto de las montañas.",
    caption: "el mundo contigo",
  },
  {
    src: "assets/photos/photo-06.jpeg",
    alt: "Un abrazo lleno de cariño.",
    caption: "mi abrazo favorito",
  },
  {
    src: "assets/photos/photo-07.jpeg",
    alt: "Un momento especial compartido juntos.",
    caption: "siempre nosotros",
  },
];

const letter = `Amor mío:

Contemplar la magnitud de tu existencia me llena de una gratitud infinita. Hoy, en el día de tu cumpleaños, quiero detener el tiempo por un instante para agradecerle al destino por haber cruzado nuestros caminos.

Eres la personificación de la ternura, la elegancia y la nobleza. Cada uno de tus gestos ilumina mis días con una claridad inquebrantable, transformando lo ordinario en algo extraordinario y memorable. Admiro profundamente tu perseverancia, tu bondad desmedida y esa capacidad única que posees para regar de alegría todo lo que te rodea.

Deseo que este nuevo año de vida esté colmado de realizaciones, de sueños cumplidos y de instantes tan luminosos como tu sonrisa. Que la vida te devuelva con creces todo el amor y la generosidad que entregas incansablemente al mundo. Yo, por mi parte, prometo estar a tu lado para celebrarte, cuidarte y amarte en cada paso de este hermoso viaje.

Feliz cumpleaños, mi vida. Te amo con toda la fuerza de mi alma. ❤️`;

const intro = document.querySelector(".intro");
const openGiftButton = document.querySelector("#open-gift");
const heartStage = document.querySelector("#heart-stage");
const heartProgress = document.querySelector("#heart-progress");
const heartInstructions = document.querySelector("#heart-instructions");
const experience = document.querySelector("#experiencia");
const letterCopy = document.querySelector("#letter-copy");
const letterAccessible = document.querySelector("#letter-accessible");
const skipWritingButton = document.querySelector("#skip-writing");
const letterEndMark = document.querySelector("#letter-end-mark");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxCount = document.querySelector("#lightbox-count");
const lightboxCloseButton = document.querySelector("#lightbox-close");
const lightboxPreviousButton = document.querySelector("#lightbox-prev");
const lightboxNextButton = document.querySelector("#lightbox-next");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let writingTimer;
let activePhotoIndex = 0;
let heartTaps = 0;
let letterTextNodes = [];
let lastFocusedElement;
let beatResetTimer;

function revealIntroPhotos() {
  const introPhotos = [...document.querySelectorAll(".intro-photo")];
  if (reducedMotion.matches) {
    introPhotos.forEach((photo) => photo.classList.add("is-visible"));
    intro.classList.add("show-second");
    heartStage.classList.add("is-ready");
    openGiftButton.classList.add("is-ready");
    openGiftButton.disabled = false;
    return;
  }

  introPhotos.forEach((photo, index) => {
    window.setTimeout(() => photo.classList.add("is-visible"), 350 + index * 260);
  });
  window.setTimeout(() => intro.classList.add("show-second"), 2600);
  window.setTimeout(() => {
    heartStage.classList.add("is-ready");
    openGiftButton.classList.add("is-ready");
    openGiftButton.disabled = false;
  }, 3500);
}

function addHeartBurst() {
  const burst = document.createElement("span");
  burst.className = "heart-burst";
  burst.setAttribute("aria-hidden", "true");
  burst.textContent = ["♥", "♡", "✦"][heartTaps - 1];
  burst.style.setProperty("--drift", `${(Math.random() - 0.5) * 90}px`);
  document.querySelector(".intro-copy").append(burst);
  burst.addEventListener("animationend", () => burst.remove(), { once: true });
}

function openGift() {
  intro.hidden = true;
  experience.hidden = false;
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
  startLetter();
}

function tapHeart() {
  if (openGiftButton.disabled || heartTaps >= 3) return;

  heartTaps += 1;
  openGiftButton.classList.remove("is-beating");
  void openGiftButton.offsetWidth;
  openGiftButton.classList.add("is-beating");
  window.clearTimeout(beatResetTimer);
  beatResetTimer = window.setTimeout(() => openGiftButton.classList.remove("is-beating"), 520);
  const hearts = [...heartProgress.querySelectorAll("span")];
  hearts[heartTaps - 1].classList.add("is-lit");
  heartProgress.setAttribute("aria-label", `${heartTaps} de 3 toques al corazón`);
  heartInstructions.textContent = heartTaps === 3
    ? "Nuestro recuerdo más bonito empieza ahora... ♥"
    : `Un latido más: ${3 - heartTaps} ${3 - heartTaps === 1 ? "toque" : "toques"} de corazón`;
  addHeartBurst();

  const photosToHighlight = [...document.querySelectorAll(".intro-photo")];
  const highlightedPhoto = photosToHighlight[(heartTaps + 1) % photosToHighlight.length];
  highlightedPhoto.classList.add("is-highlighted");
  window.setTimeout(() => highlightedPhoto.classList.remove("is-highlighted"), 800);

  if (heartTaps === 3) {
    openGiftButton.disabled = true;
    openGiftButton.classList.add("is-opening");
    window.setTimeout(openGift, reducedMotion.matches ? 0 : 900);
  }
}

function buildLetter() {
  const paragraphs = letter.split("\n\n");
  letterTextNodes = [];
  letterCopy.replaceChildren();

  paragraphs.forEach((text, index) => {
    const paragraph = document.createElement("p");
    paragraph.className = "letter-paragraph";
    const textNode = document.createTextNode("");
    paragraph.append(textNode);
    letterCopy.append(paragraph);
    letterTextNodes.push({ source: text, node: textNode });
  });
}

function finishLetter() {
  window.clearInterval(writingTimer);
  letterTextNodes.forEach(({ source, node }) => {
    node.textContent = source;
  });
  skipWritingButton.hidden = true;
  letterEndMark.classList.add("is-visible");
}

function startLetter() {
  letterAccessible.textContent = letter;
  buildLetter();
  if (reducedMotion.matches) {
    finishLetter();
    return;
  }

  let paragraphIndex = 0;
  let position = 0;
  writingTimer = window.setInterval(() => {
    const paragraph = letterTextNodes[paragraphIndex];
    const characters = Array.from(paragraph.source);
    position = Math.min(position + 3, characters.length);
    paragraph.node.textContent = characters.slice(0, position).join("");

    if (position === characters.length) {
      paragraphIndex += 1;
      position = 0;
      if (paragraphIndex === letterTextNodes.length) finishLetter();
    }
  }, 12);
}

function showPhoto(index) {
  activePhotoIndex = (index + photos.length) % photos.length;
  const photo = photos[activePhotoIndex];
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxCaption.textContent = photo.caption;
  lightboxCount.textContent = `${String(activePhotoIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
}

function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  showPhoto(index);
  lightbox.showModal();
  document.body.classList.add("lightbox-open");
  lightboxCloseButton.focus();
}

function closeLightbox() {
  if (!lightbox.open) return;
  lightbox.close();
  document.body.classList.remove("lightbox-open");
  lastFocusedElement?.focus();
}

openGiftButton.addEventListener("click", tapHeart);

skipWritingButton.addEventListener("click", finishLetter);

document.querySelectorAll(".memory").forEach((memory) => {
  memory.addEventListener("click", () => openLightbox(Number(memory.dataset.photo)));
});

lightboxCloseButton.addEventListener("click", closeLightbox);
lightboxPreviousButton.addEventListener("click", () => showPhoto(activePhotoIndex - 1));
lightboxNextButton.addEventListener("click", () => showPhoto(activePhotoIndex + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("close", () => {
  document.body.classList.remove("lightbox-open");
  lastFocusedElement?.focus();
});
document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;
  if (event.key === "ArrowLeft") showPhoto(activePhotoIndex - 1);
  if (event.key === "ArrowRight") showPhoto(activePhotoIndex + 1);
});

revealIntroPhotos();
