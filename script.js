const phone = '523313976529';
const foundButtons = [document.getElementById('foundBtn'), document.getElementById('foundBtnBottom')].filter(Boolean);

function sendLocation(btn){
  const original = btn.textContent;
  btn.textContent = '📍 Obteniendo ubicación...';
  btn.disabled = true;

  const fallback = () => {
    const text = encodeURIComponent('Hola Paola, encontré a Mate. No pude compartir mi ubicación automáticamente, pero estoy con él.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    btn.textContent = original;
    btn.disabled = false;
  };

  if(!navigator.geolocation){ fallback(); return; }

  navigator.geolocation.getCurrentPosition(
    ({coords}) => {
      const maps = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
      const text = encodeURIComponent(`Hola Paola, encontré a Mate.\n\nMi ubicación es:\n${maps}\n\nEstoy con él.`);
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
      btn.textContent = '✅ Abrí WhatsApp';
      btn.disabled = false;
    },
    fallback,
    {enableHighAccuracy:true, timeout:10000, maximumAge:0}
  );
}

foundButtons.forEach(btn => btn.addEventListener('click', () => sendLocation(btn)));

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImg.src = item.dataset.img;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', event => {
  if(event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', event => {
  if(event.key === 'Escape') closeLightbox();
});

if('serviceWorker' in navigator){
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
const stickyButton = document.getElementById("foundBtnSticky");
if (stickyButton) {
  stickyButton.addEventListener("click", () => {
    document.getElementById("foundBtn").click();
  });
}

const shareBtn = document.getElementById("shareBtn");
if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const url = "https://werodude1251.github.io/QR/?v=40";
    const text = "Esta es la identificación digital de Mate 🐶";

    if (navigator.share) {
      await navigator.share({
        title: "Mate | Identificación digital",
        text,
        url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Enlace copiado.");
    }
  });
}