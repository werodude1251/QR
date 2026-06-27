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

if('serviceWorker' in navigator){
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
