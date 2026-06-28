const phone = "523313976529";

/* ===========================
   Botones de ubicación
=========================== */

function setFoundButtonsText(text) {
    ["foundBtn", "foundBtnBottom", "foundBtnSticky"].forEach((id) => {
        const btn = document.getElementById(id);
        if (btn) btn.textContent = text;
    });
}

function updateStatusToast(title, subtitle) {
    const toast = document.getElementById("statusToast");
    if (!toast) return;

    toast.innerHTML = `
        <strong>${title}</strong>
        <span>${subtitle}</span>
    `;

    toast.classList.add("show");
}

function hideStatusToast(delay = 3500) {
    const toast = document.getElementById("statusToast");
    if (!toast) return;

    setTimeout(() => {
        toast.classList.remove("show");
    }, delay);
}

function openWhatsApp(message) {
    setTimeout(() => {
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
        setFoundButtonsText("📍 Encontré a Mate");
        hideStatusToast(1200);
    }, 700);
}

function openWhatsAppNoLocation() {
    updateStatusToast(
        "⚠️ No pude obtener ubicación",
        "Abriré WhatsApp para que puedas escribirle a Paola."
    );

    const message =
        `Hola Paola 👋%0A%0A` +
        `Encontré a Mate 🐶, pero no pude compartir mi ubicación automáticamente.`;

    openWhatsApp(message);
}

function sendLocation() {
    updateStatusToast(
        "💚 Gracias por ayudar a Mate",
        "📍 Localizando tu ubicación..."
    );

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

            updateStatusToast(
                "✅ Ubicación obtenida",
                "Abriendo WhatsApp..."
            );

            const message =
                `Hola Paola 👋%0A%0A` +
                `Encontré a Mate 🐶%0A%0A` +
                `Mi ubicación es:%0A${mapsUrl}%0A%0A` +
                `Estoy con él.`;

            openWhatsApp(message);
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
   Compartir página
=========================== */

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


/* ===========================
   Galería / lightbox
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

function showPhoto(index) {
    if (!galleryImages.length) return;

    currentPhotoIndex = (index + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentPhotoIndex].src;

    if (photoCounter) {
        photoCounter.textContent = `${currentPhotoIndex + 1} / ${galleryImages.length}`;
    }
}

if (galleryImages.length && lightbox && lightboxImg && lightboxClose) {
    galleryImages.forEach((img, index) => {
        img.addEventListener("click", () => {
            showPhoto(index);
            lightbox.classList.add("show");
        });
    });

    lightboxClose.addEventListener("click", () => {
        lightbox.classList.remove("show");
    });

    if (prevPhoto) {
        prevPhoto.addEventListener("click", (e) => {
            e.stopPropagation();
            showPhoto(currentPhotoIndex - 1);
        });
    }

    if (nextPhoto) {
        nextPhoto.addEventListener("click", (e) => {
            e.stopPropagation();
            showPhoto(currentPhotoIndex + 1);
        });
    }

    let startX = 0;

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