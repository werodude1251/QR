/* ===========================
   Configuración
=========================== */
const phone = "523313976529";
const siteUrl = "https://werodude1251.github.io/QR/";

/* ===========================
   Splash screen
=========================== */
const splashScreen = document.getElementById("splashScreen");

if (splashScreen) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      splashScreen.classList.add("hide");
    }, 1100);
  });
}

/* ===========================
   Enviar ubicación por WhatsApp
=========================== */
function showStatusToast() {
  const toast = document.getElementById("statusToast");
  if (toast) {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
  }
}

function setFoundButtonsText(text) {
  ["foundBtn", "foundBtnBottom", "foundBtnSticky"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.textContent = text;
  });
}

function openWhatsAppNoLocation() {
  const message =
    `Hola Paola 👋%0A%0A` +
    `Encontré a Mate 🐶, pero no pude compartir mi ubicación automáticamente.`;

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  setFoundButtonsText("📍 Encontré a Mate");
}

function sendLocation() {
  showStatusToast();
  setFoundButtonsText("📍 Obteniendo ubicación...");

  if (!navigator.geolocation) {
    openWhatsAppNoLocation();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const mapsUrl = `https://maps.google.com/?q=${lat},${lon}`;

      const message =
        `Hola Paola 👋%0A%0A` +
        `Encontré a Mate 🐶%0A%0A` +
        `Mi ubicación es:%0A${mapsUrl}%0A%0A` +
        `Estoy con él.`;

      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
      setFoundButtonsText("📍 Encontré a Mate");
    },
    () => {
      openWhatsAppNoLocation();
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

["foundBtn", "foundBtnBottom", "foundBtnSticky"].forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", sendLocation);
});

/* ===========================
   Compartir ficha
=========================== */
const shareBtn = document.getElementById("shareBtn");

if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const text = "Esta es la identificación digital de Mate 🐶";

    if (navigator.share) {
      await navigator.share({
        title: "Mate | Identificación digital",
        text,
        url: siteUrl
      });
    } else {
      await navigator.clipboard.writeText(siteUrl);
      alert("Enlace copiado.");
    }
  });
}

/* ===========================
   Galería y lightbox
=========================== */
const galleryImages = [
  document.querySelector(".mate-photo"),
  ...Array.from(document.querySelectorAll(".gallery-grid img"))
].filter(Boolean);

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const prevPhoto = document.getElementById("prevPhoto");
const nextPhoto = document.getElementById("nextPhoto");
const photoCounter = document.getElementById("photoCounter");

let currentPhotoIndex = 0;
let startX = 0;

function showPhoto(index) {
  if (!galleryImages.length) return;
  currentPhotoIndex = (index + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentPhotoIndex].src;
  photoCounter.textContent = `${currentPhotoIndex + 1} / ${galleryImages.length}`;
}

if (galleryImages.length && lightbox && lightboxImg && lightboxClose && prevPhoto && nextPhoto && photoCounter) {
  galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => {
      showPhoto(index);
      lightbox.classList.add("show");
    });
  });

  lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("show");
  });

  prevPhoto.addEventListener("click", (e) => {
    e.stopPropagation();
    showPhoto(currentPhotoIndex - 1);
  });

  nextPhoto.addEventListener("click", (e) => {
    e.stopPropagation();
    showPhoto(currentPhotoIndex + 1);
  });

  lightboxImg.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  lightboxImg.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        showPhoto(currentPhotoIndex + 1);
      } else {
        showPhoto(currentPhotoIndex - 1);
      }
    }
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("show");
    }
  });
}
