import './styles.css';
import { icon } from './icons.js';
import { photos, categories, asset } from './gallery-data.js';
import { environmentPlaces, landscapeSrcset } from './environment-data.js';
import { initHero } from './hero.js';
import { sendInquiry } from './inquiry.js';
import { fetchAvailability } from './availability.js';
import { siteConfig, availability } from './site-config.js';
import { addDays, parseDate, isReserved, seasonFor, quoteStay, monthCells, shiftMonth, formatDate, currency } from './calendar.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
$$('[data-icon]').forEach((element) => { element.innerHTML = icon(element.dataset.icon); });
initHero();
$$('[data-maps]').forEach((element) => { element.href = siteConfig.mapsUrl; });
if (siteConfig.ownerUrl) {
  $('#owner-link').href = siteConfig.ownerUrl;
  $('#owner-link').hidden = false;
}

// Mobile navigation stays small until explicitly opened.
const menuToggle = $('.menu-toggle');
const navigation = $('#main-nav');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  menuToggle.innerHTML = icon('menu');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  menuToggle.innerHTML = icon(open ? 'close' : 'menu');
});
$$('a', navigation).forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', (event) => {
  // The toggle replaces its SVG; composedPath still includes the original header.
  if (!event.composedPath().includes($('.site-header'))) closeMenu();
});
matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

// Native dialogs provide focus trapping and Escape support; scroll stays stable.
const dialogTriggers = new WeakMap();
function openDialog(dialog) {
  dialogTriggers.set(dialog, document.activeElement);
  document.body.style.setProperty('--scrollbar-width', `${window.innerWidth - document.documentElement.clientWidth}px`);
  document.body.classList.add('modal-open');
  dialog.showModal();
}
$$('dialog').forEach((dialog) => {
  dialog.addEventListener('close', () => {
    if (!$('dialog[open]')) document.body.classList.remove('modal-open');
    dialogTriggers.get(dialog)?.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
$$('[data-close]').forEach((button) => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));

const lightbox = $('#lightbox');
let lightboxItems = [];
let lightboxIndex = 0;
function displayLightboxItem() {
  const item = lightboxItems[lightboxIndex];
  const image = $('#lightbox-image');
  image.src = item.src || asset(`${item.id}-${item.fullWidth || 1400}.webp`);
  image.alt = item.alt;
  $('#lightbox-title').textContent = item.title;
  $('#lightbox-detail').textContent = item.detail;
  $('#lightbox-count').textContent = `${String(lightboxIndex + 1).padStart(2, '0')} / ${String(lightboxItems.length).padStart(2, '0')}`;
  const single = lightboxItems.length === 1;
  $('.lightbox-prev').hidden = single;
  $('.lightbox-next').hidden = single;
  $('.lightbox-tip').textContent = single ? 'Esc para cerrar' : '← → para explorar · Esc para cerrar';
  // Preload the next photograph only after the current one has been requested.
  if (!single) {
    const next = lightboxItems[(lightboxIndex + 1) % lightboxItems.length];
    const preload = new Image();
    preload.src = next.src || asset(`${next.id}-${next.fullWidth || 1400}.webp`);
  }
}
function showPhotos(items, index = 0) {
  lightboxItems = items;
  lightboxIndex = index;
  displayLightboxItem();
  openDialog(lightbox);
  $('.lightbox-close').focus();
}
function stepPhoto(direction) {
  lightboxIndex = (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
  displayLightboxItem();
}
$('.lightbox-prev').addEventListener('click', () => stepPhoto(-1));
$('.lightbox-next').addEventListener('click', () => stepPhoto(1));
lightbox.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    stepPhoto(event.key === 'ArrowLeft' ? -1 : 1);
  }
});
let touchStart = null;
$('#lightbox-image').addEventListener('touchstart', (event) => {
  touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
}, { passive: true });
$('#lightbox-image').addEventListener('touchend', (event) => {
  if (!touchStart || !event.changedTouches.length) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 60 && Math.abs(dy) < 70) stepPhoto(dx > 0 ? -1 : 1);
  touchStart = null;
}, { passive: true });

let activeCategory = 'all';
let filteredPhotos = photos;
const filters = $('.gallery-filters');
filters.innerHTML = categories.map((category) => `<button class="gallery-filter" type="button" data-category="${category.id}" aria-pressed="${category.id === activeCategory}" aria-controls="gallery">${category.name}</button>`).join('');
function renderGallery() {
  filteredPhotos = activeCategory === 'all' ? photos : photos.filter((photo) => photo.category === activeCategory);
  const visible = filteredPhotos.slice(0, 3);
  const gallery = $('#gallery');
  gallery.dataset.count = visible.length;
  gallery.dataset.layout = activeCategory === 'all' ? 'overview' : 'rooms';
  gallery.innerHTML = visible.map((photo, index) => {
    // Cover crops need enough source pixels for the image height, not just the column width.
    const sizes = photo.sizes || (activeCategory === 'all' ? '(max-width: 760px) 100vw, 25vw' : `(max-width: 760px) ${index === 0 ? '100vw' : '50vw'}, ${index === 0 ? '50vw' : '25vw'}`);
    return `<figure class="photo-card"><button class="photo-open" type="button" data-photo="${index}" data-fit="${photo.fit || 'cover'}" aria-label="Ampliar fotografía: ${photo.title}"><img src="${asset(`${photo.id}-960.webp`)}" srcset="${asset(`${photo.id}-480.webp`)} 480w, ${asset(`${photo.id}-960.webp`)} 960w, ${asset(`${photo.id}-${photo.fullWidth}.webp`)} ${photo.fullWidth}w" sizes="${sizes}" width="960" height="960" loading="lazy" decoding="async" draggable="false" alt="${photo.alt}" /><span class="photo-expand">${icon('expand')}</span></button><figcaption><span>${photo.title}</span><span class="photo-number">${String(index + 1).padStart(2, '0')}</span></figcaption></figure>`;
  }).join('');
  $$('[data-category]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.category === activeCategory)));
  $('#gallery-summary').textContent = activeCategory === 'all' ? 'Un lugar para disfrutar a tu ritmo.' : `${filteredPhotos.length} fotografías · ${categories.find((category) => category.id === activeCategory).name}`;
  $('#view-all').innerHTML = `Ver ${activeCategory === 'all' ? 'todas las fotografías' : `las ${filteredPhotos.length} fotografías`} ${icon('arrow')}`;
}
filters.addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  activeCategory = button.dataset.category;
  renderGallery();
});
$('#gallery').addEventListener('click', (event) => {
  const button = event.target.closest('[data-photo]');
  if (button) showPhotos(filteredPhotos, Number(button.dataset.photo));
});
$('#view-all').addEventListener('click', () => showPhotos(filteredPhotos));
renderGallery();

let activePlace = 'apartment';
function selectPlace(key) {
  const place = environmentPlaces[key];
  activePlace = key;
  const isApartment = key === 'apartment';
  $$('[data-place]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.place === key)));
  $('#place-title').textContent = place.title;
  $('#place-description').textContent = place.description;
  const image = $('#environment-image');
  image.srcset = place.photo ? landscapeSrcset(place.photo) : place.srcset;
  image.src = place.photo ? asset(`${place.photo.id}-1860.webp`) : place.src;
  image.alt = place.photo?.alt || place.alt;
  image.style.objectPosition = place.photo?.position || place.position || 'center';
  $('#environment-caption').textContent = place.photo?.caption || place.caption;
  $('#apartment-highlight').hidden = !isApartment;
  $('.map-disclaimer').hidden = !isApartment;
  $('#view-plan').hidden = !isApartment;
  $('#environment-directions').hidden = !isApartment;
  $('#expand-map').setAttribute('aria-label', `Ampliar imagen: ${isApartment ? 'Gandiazar IV' : place.title}`);
}
$$('[data-place]').forEach((button) => {
  button.addEventListener('click', () => selectPlace(button.dataset.place));
});
selectPlace('apartment');
$('#expand-map').addEventListener('click', () => {
  const place = environmentPlaces[activePlace];
  showPhotos([{ src: place.photo ? asset(`${place.photo.id}-1860.webp`) : place.src, title: place.photo?.caption || place.caption || place.title, alt: place.photo?.alt || place.alt, detail: activePlace === 'apartment' ? 'Ilustración orientativa. Calle Valldigna, 19 · Gandía Playa.' : place.description }]);
});
$('#view-plan').addEventListener('click', () => showPhotos([{ src: asset('plano-1451.webp'), title: 'Plano de la urbanización', alt: 'Plano original con los bloques G, F, E, D, C, B y A, la plaza de garaje y las piscinas.', detail: 'El apartamento está en el bloque D, planta 10. Plano facilitado por el propietario.' }]));

let currentMonth = availability.initialMonth;
let availabilityState = 'loading';
let sendingInquiry = false;
let availabilityRequest;
let availabilityTimer;
let arrival = availability.initialArrival;
let departure = availability.initialDeparture;
const arrivalInput = $('#arrival');
const departureInput = $('#departure');
arrivalInput.min = availability.firstDate;
arrivalInput.max = availability.lastDate;
departureInput.max = addDays(availability.lastDate, 1);
$('#rate-list').innerHTML = availability.seasons.map((season) => `<div class="rate"><i class="legend-dot season-${season.season} rate-${season.id}"></i><div><span>${season.name}</span><strong>${currency(season.price)}/noche</strong></div></div>`).join('');
function selectedQuote() {
  if (availabilityState !== 'ready') return { valid: false, message: 'Espera a que se confirme la disponibilidad o contacta por WhatsApp.' };
  return quoteStay(arrival, departure, availability);
}
function renderCalendar() {
  const monthLabel = formatDate(currentMonth, { day: undefined, month: 'long', year: 'numeric' }).replace(' de ', ' ');
  $('#calendar-month').textContent = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  $('#previous-month').disabled = currentMonth <= availability.firstDate.slice(0, 7) + '-01';
  $('#next-month').disabled = currentMonth >= availability.lastDate.slice(0, 7) + '-01';
  const validSelection = selectedQuote().valid;
  $('#calendar-grid').innerHTML = monthCells(currentMonth).map((date) => {
    if (!date) return '<span class="calendar-cell empty" aria-hidden="true"></span>';
    const booked = isReserved(date, availability);
    const checkout = booked && arrival && !departure && quoteStay(arrival, date, availability).valid;
    const blocked = availabilityState !== 'ready' || date < availability.firstDate || date > availability.lastDate || (booked && !checkout);
    const start = date === arrival && !isReserved(date, availability);
    const end = date === departure && validSelection;
    const between = validSelection && date > arrival && date < departure;
    const season = seasonFor(date, availability);
    const classes = ['calendar-cell', booked ? 'reserved' : '', checkout ? 'can-checkout' : '', start ? 'range-start' : '', end ? 'range-end' : '', between ? 'in-range' : ''].filter(Boolean).join(' ');
    const status = availabilityState !== 'ready' ? 'Disponibilidad sin confirmar' : end ? 'Salida seleccionada' : start ? 'Llegada seleccionada' : checkout ? 'Disponible solo como salida' : booked ? 'Reservado' : `Disponible, temporada ${season.name.toLowerCase()}, ${currency(season.price)} por noche`;
    return `<button type="button" class="${classes}" data-date="${date}" title="Temporada ${season.name.toLowerCase()} · ${currency(season.price)}/noche" ${blocked && !end ? 'disabled' : ''} aria-label="${formatDate(date, { weekday: 'long', year: 'numeric' })}. ${status}" aria-pressed="${start || end || between}"><span class="day-number">${parseDate(date).getUTCDate()}</span><span class="season-dot season-${season.season} rate-${season.id}"></span></button>`;
  }).join('');
  $('#calendar-hint').textContent = availabilityState === 'loading' ? 'Consultando las fechas disponibles…' : availabilityState === 'error' ? 'No podemos consultar la disponibilidad. Contacta por WhatsApp o inténtalo más tarde.' : arrival && !departure ? 'Ahora elige el día de salida.' : 'Elige tu llegada y después tu salida. La salida no cuenta como noche.';
  $('#availability-status').textContent = availabilityState === 'ready' ? 'Tarifas 2027 · Disponibilidad actualizada' : availabilityState === 'loading' ? 'Tarifas 2027 · Consultando disponibilidad…' : 'Disponibilidad pendiente de confirmar';
  $('#calendar-grid').setAttribute('aria-busy', String(availabilityState === 'loading'));
  $('#calendar-grid').classList.toggle('availability-unknown', availabilityState !== 'ready');
  $('.submit-button').disabled = sendingInquiry || availabilityState !== 'ready';
}
function updateQuote() {
  const quote = selectedQuote();
  const error = $('#booking-error');
  error.hidden = availabilityState !== 'ready' || quote.valid || !departure;
  error.textContent = quote.valid ? '' : quote.message;
  $('#quote-total').textContent = quote.valid ? currency(quote.total) : '—';
  $('#quote-detail').textContent = quote.valid ? quote.breakdown.map((row) => `${row.nights} ${row.nights === 1 ? 'noche' : 'noches'} × ${currency(row.price)}`).join(' + ') + (quote.cleaningFee ? ` + limpieza: ${currency(quote.cleaningFee)}` : '') : availabilityState !== 'ready' ? 'Disponibilidad pendiente de confirmar' : 'Selecciona una estancia disponible';
}
function syncDates() {
  arrivalInput.value = arrival;
  departureInput.value = departure;
  departureInput.min = parseDate(arrival) ? addDays(arrival, 1) : addDays(availability.firstDate, 1);
  updateQuote();
  renderCalendar();
  updateWhatsAppLinks();
}
function focusCalendarDate(date) { $(`[data-date="${date}"]`)?.focus({ preventScroll: true }); }
$('#calendar-grid').addEventListener('click', (event) => {
  const button = event.target.closest('[data-date]');
  if (!button || button.disabled) return;
  const date = button.dataset.date;
  if (!arrival || departure || date <= arrival) {
    if (isReserved(date, availability)) return;
    arrival = date;
    departure = '';
  } else {
    departure = date;
  }
  syncDates();
  focusCalendarDate(date);
});
$('#calendar-grid').addEventListener('keydown', (event) => {
  const button = event.target.closest('[data-date]');
  const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
  if (!button || !delta) return;
  event.preventDefault();
  let target = addDays(button.dataset.date, delta);
  while (target >= availability.firstDate && target <= availability.lastDate) {
    const checkout = arrival && !departure && quoteStay(arrival, target, availability).valid;
    if (!isReserved(target, availability) || checkout || target === departure) break;
    target = addDays(target, delta > 0 ? 1 : -1);
  }
  if (target < availability.firstDate || target > availability.lastDate) return;
  currentMonth = target.slice(0, 7) + '-01';
  renderCalendar();
  focusCalendarDate(target);
});
function changeMonth(direction) { currentMonth = shiftMonth(currentMonth, direction); renderCalendar(); }
$('#previous-month').addEventListener('click', () => changeMonth(-1));
$('#next-month').addEventListener('click', () => changeMonth(1));
[arrivalInput, departureInput].forEach((input) => input.addEventListener('change', () => {
  arrival = arrivalInput.value;
  departure = departureInput.value;
  if (parseDate(arrival) && arrival >= availability.firstDate && arrival <= availability.lastDate) currentMonth = arrival.slice(0, 7) + '-01';
  syncDates();
}));
syncDates();

const messageDialog = $('#message-dialog');
function showMessage(title, description, summary = '') {
  $('#message-title').textContent = title;
  $('#message-description').textContent = description;
  $('#inquiry-summary').textContent = summary;
  $('#inquiry-summary').hidden = !summary;
  $('#copy-inquiry').hidden = !summary;
  $('#dialog-whatsapp').hidden = !summary;
  $('#copy-status').textContent = '';
  openDialog(messageDialog);
}
const contactInput = $('#guest-contact');
contactInput.addEventListener('input', () => contactInput.setCustomValidity(''));
function inquiryText() {
  const start = arrivalInput.value;
  const end = departureInput.value;
  const quote = quoteStay(start, end, availability);
  const name = $('#guest-name').value.trim();
  const contact = $('#guest-contact').value.trim();
  const message = $('#guest-message').value.trim();
  const dates = quote.valid ? `\n\nLlegada: ${formatDate(start, { year: 'numeric' })}\nSalida: ${formatDate(end, { year: 'numeric' })}\nEstancia: ${quote.nights} noches${quote.cleaningFee ? `\nLimpieza: ${currency(quote.cleaningFee)}` : ''}\nTotal orientativo: ${currency(quote.total)}` : '';
  return `Consulta sobre el apartamento en Gandía Playa${dates}${name ? `\n\nNombre: ${name}` : ''}${contact ? `\nContacto: ${contact}` : ''}${message ? `\n\nMensaje: ${message}` : ''}`;
}
function updateWhatsAppLinks() {
  const number = siteConfig.contact.whatsapp.replace(/\D/g, '');
  if (!number) return;
  $$('[data-contact="whatsapp"]').forEach((link) => {
    link.href = `https://wa.me/${number}?text=${encodeURIComponent(inquiryText())}`;
    link.title = 'Abrir WhatsApp con los datos de tu consulta';
  });
}
$('#contacto').addEventListener('input', updateWhatsAppLinks);
$('#contacto').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (sendingInquiry) return;
  const quote = selectedQuote();
  if (!quote.valid) {
    $('#booking-error').hidden = false;
    $('#booking-error').textContent = quote.message;
    arrivalInput.focus();
    return;
  }
  const contact = contactInput.value.trim();
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const looksLikePhone = /^[+()\d\s.-]+$/.test(contact) && contact.replace(/\D/g, '').length >= 7;
  if (!looksLikeEmail && !looksLikePhone) {
    contactInput.setCustomValidity('Introduce un email o un teléfono válido para poder responderte.');
    contactInput.reportValidity();
    return;
  }
  const name = $('#guest-name').value.trim();
  if (!name) { $('#guest-name').focus(); return; }
  const summary = inquiryText();
  const button = $('.submit-button');
  const buttonContent = button.innerHTML;
  const status = $('#inquiry-status');
  const payload = { arrival, departure, name, contact, message: $('#guest-message').value.trim(), website: $('#guest-website').value };
  sendingInquiry = true;
  button.disabled = true;
  button.textContent = 'Enviando consulta…';
  $('#contacto').setAttribute('aria-busy', 'true');
  status.textContent = 'Enviando tu consulta…';
  status.classList.remove('form-error');
  try {
    const result = await sendInquiry(payload, `${import.meta.env.BASE_URL}api/inquiry.php`);
    status.textContent = `Consulta enviada. Referencia: ${result.reference}.`;
    showMessage('Consulta enviada.', 'Te responderemos personalmente. El envío no confirma ni bloquea una reserva. También puedes continuar por WhatsApp.', `${summary}\n\nReferencia: ${result.reference}`);
    $('#dialog-whatsapp').href = `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(summary)}`;
  } catch (error) {
    status.textContent = error.message;
    status.classList.add('form-error');
  } finally {
    sendingInquiry = false;
    button.disabled = availabilityState !== 'ready';
    button.innerHTML = buttonContent;
    $('#contacto').removeAttribute('aria-busy');
  }
});
$('#copy-inquiry').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#inquiry-summary').textContent);
    $('#copy-status').textContent = 'Consulta copiada.';
  } catch {
    $('#copy-status').textContent = 'No se ha podido copiar automáticamente. Selecciona y copia el texto de la consulta.';
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents($('#inquiry-summary'));
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
$$('[data-contact]').forEach((link) => {
  const type = link.dataset.contact;
  const value = siteConfig.contact[type];
  if (value) {
    if (link.hasAttribute('data-contact-label')) link.textContent = value;
    link.href = type === 'email' ? `mailto:${value}` : type === 'telephone' ? `tel:${value.replace(/[^+\d]/g, '')}` : `https://wa.me/${value.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, me gustaría recibir información sobre el apartamento en Gandía Playa.')}`;
    if (type === 'whatsapp') { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  } else {
    link.href = '#contacto';
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showMessage('Hablaremos directamente.', 'El teléfono y WhatsApp del propietario se incorporarán antes de publicar la web. Mientras tanto, puedes probar el formulario y preparar una consulta de ejemplo.');
    });
  }
});
updateWhatsAppLinks();

function refreshAvailability() {
  if (availabilityRequest) return availabilityRequest;
  clearTimeout(availabilityTimer);
  availabilityState = 'loading';
  syncDates();
  let nextDelay = 60000;
  availabilityRequest = fetchAvailability(`${import.meta.env.BASE_URL}api/availability.php`, availability)
    .then((data) => {
      availability.reservations = data.reservations;
      availabilityState = 'ready';
      nextDelay = Math.max(5000, Math.min(300000, Date.parse(data.checkedAt) + 301000 - Date.now()));
    })
    .catch(() => { availabilityState = 'error'; })
    .finally(() => {
      syncDates();
      availabilityRequest = null;
      availabilityTimer = setTimeout(() => { if (!document.hidden) refreshAvailability(); }, nextDelay);
    });
  return availabilityRequest;
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshAvailability(); });
refreshAvailability();
