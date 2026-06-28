const phone = "523313976529";
const pageUrl = "https://werodude1251.github.io/QR/";

/* ===========================
   Ubicación / WhatsApp
=========================== */
function setFoundButtonsText(text) {
    ["foundBtn", "foundBtnBottom", "foundBtnSticky"].forEach((id) => {
        const btn = document.getElementById(id);
        if (btn) btn.textContent = text;
    });
}

function updateStatusToast(title, subtitle, progress = 0) {
    const overlay = document.getElementById("rescueOverlay");
    const titleEl = document.getElementById("rescueTitle");
    const messageEl = document.getElementById("rescueMessage");
    const barEl = document.getElementById("rescueBar");

    if (!overlay || !titleEl || !messageEl || !barEl) return;

    titleEl.innerHTML = title;
    messageEl.innerHTML = subtitle;
    barEl.style.width = progress + "%";
    overlay.classList.add("show");
}

function hideStatusToast(delay = 3500) {
    const overlay = document.getElementById("rescueOverlay");
    if (!overlay) return;

    setTimeout(() => {
        overlay.classList.remove("show");
        const barEl = document.getElementById("rescueBar");
        if (barEl) barEl.style.width = "0%";
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
        "💬 Abriendo WhatsApp para contactar a Paola...",
        100
    );

    const message =
        `Hola Paola 👋%0A%0A` +
        `Encontré a Mate 🐶, pero no pude compartir mi ubicación automáticamente.`;

    openWhatsApp(message);
}

function sendLocation() {
    updateStatusToast(
        "💚 Gracias por ayudar a Mate",
        "📍 Localizando tu ubicación...",
        35
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
                "💬 Preparando WhatsApp...",
                100
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
        const text = "Esta es la identificación digital de Mate 🐶";

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Mate | Identificación digital",
                    text,
                    url: pageUrl
                });
            } catch (_) {}
        } else {
            await navigator.clipboard.writeText(pageUrl);
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
    if (!galleryImages.length || !lightboxImg) return;

    currentPhotoIndex = (index + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentPhotoIndex].currentSrc || galleryImages[currentPhotoIndex].src;

    if (photoCounter) {
        photoCounter.textContent = `${currentPhotoIndex + 1} / ${galleryImages.length}`;
    }
}

if (galleryImages.length && lightbox && lightboxImg && lightboxClose) {
    galleryImages.forEach((img, index) => {
        img.addEventListener("click", () => {
            showPhoto(index);
            lightbox.classList.add("show");
            lightbox.setAttribute("aria-hidden", "false");
        });
    });

    function closeLightbox() {
        lightbox.classList.remove("show");
        lightbox.setAttribute("aria-hidden", "true");
    }

    lightboxClose.addEventListener("click", closeLightbox);

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
    }, { passive: true });

    lightboxImg.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            showPhoto(diff > 0 ? currentPhotoIndex + 1 : currentPhotoIndex - 1);
        }
    });

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    window.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("show")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showPhoto(currentPhotoIndex - 1);
        if (e.key === "ArrowRight") showPhoto(currentPhotoIndex + 1);
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
        }, 900);
    });
}

/* ===========================
   Service Worker
=========================== */
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
    });
}

/* ===========================
   Animaciones inteligentes
=========================== */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});