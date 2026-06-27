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

const galleryItems = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentPhoto = 0;

function openPhoto(index){
  if(!galleryItems.length) return;
  currentPhoto = (index + galleryItems.length) % galleryItems.length;
  lightboxImg.src = galleryItems[currentPhoto].dataset.src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closePhoto(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
}

function nextPhoto(){ openPhoto(currentPhoto + 1); }
function prevPhoto(){ openPhoto(currentPhoto - 1); }

galleryItems.forEach((item, index) => item.addEventListener('click', () => openPhoto(index)));
lightboxClose?.addEventListener('click', closePhoto);
lightboxNext?.addEventListener('click', nextPhoto);
lightboxPrev?.addEventListener('click', prevPhoto);
lightbox?.addEventListener('click', (event) => { if(event.target === lightbox) closePhoto(); });

document.addEventListener('keydown', (event) => {
  if(!lightbox.classList.contains('open')) return;
  if(event.key === 'Escape') closePhoto();
  if(event.key === 'ArrowRight') nextPhoto();
  if(event.key === 'ArrowLeft') prevPhoto();
});

let touchStartX = null;
lightbox?.addEventListener('touchstart', (event) => { touchStartX = event.touches[0].clientX; }, {passive:true});
lightbox?.addEventListener('touchend', (event) => {
  if(touchStartX === null) return;
  const diff = event.changedTouches[0].clientX - touchStartX;
  if(Math.abs(diff) > 50){ diff < 0 ? nextPhoto() : prevPhoto(); }
  touchStartX = null;
}, {passive:true});

if('serviceWorker' in navigator){
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
