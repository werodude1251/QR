const phone = "523313976529";

function sendLocation() {
  const btns = [
    document.getElementById("foundBtn"),
    document.getElementById("foundBtnBottom"),
    document.getElementById("foundBtnSticky")
  ].filter(Boolean);

  btns.forEach(btn => btn.textContent = "📍 Obteniendo ubicación...");

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

      btns.forEach(btn => btn.textContent = "✅ Abrir WhatsApp");
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

function openWhatsAppNoLocation() {
  const message =
    `Hola Paola 👋%0A%0A` +
    `Encontré a Mate 🐶, pero no pude compartir mi ubicación automáticamente.`;

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}

["foundBtn", "foundBtnBottom", "foundBtnSticky"].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", sendLocation);
});

const shareBtn = document.getElementById("shareBtn");

if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const url = "https://werodude1251.github.io/QR/";
    const text = "Esta es la identificación digital de Mate 🐶";

    if (navigator.share) {
      await navigator.share({
        title: "Mate | Identificación digital",
        text,
        url
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Enlace copiado.");
    }
  });
}

const galleryImages = document.querySelectorAll(".gallery-grid img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

galleryImages.forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.classList.add("show");
  });
});

lightboxClose.addEventListener("click", () => {
  lightbox.classList.remove("show");
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove("show");
  }
});