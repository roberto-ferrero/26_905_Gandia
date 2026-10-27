import { icon } from './icons.js';
import { asset } from './gallery-data.js';
import { heroSlides, landscapeSrcset } from './environment-data.js';

export function initHero() {
  const hero = document.querySelector('.hero');
  const container = hero.querySelector('.hero-images');
  const controls = hero.querySelector('.hero-controls');
  const dots = hero.querySelector('.hero-dots');
  const playback = hero.querySelector('#hero-playback');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const images = [container.querySelector('img')];
  let activeIndex = 0;
  let requestedIndex = 0;
  let requestVersion = 0;
  let timer;
  let busy = false;
  let inView = true;
  let hovering = false;
  let focused = false;
  let paused = reducedMotion.matches;

  // Only the beach is critical. The other photographs load at low priority.
  heroSlides.slice(1).forEach((slide) => {
    const image = new Image();
    image.className = 'hero-image';
    image.alt = slide.alt;
    image.width = 1860;
    image.height = 840;
    image.decoding = 'async';
    image.fetchPriority = 'low';
    image.sizes = '100vw';
    image.srcset = landscapeSrcset(slide);
    image.src = asset(`${slide.id}-1860.webp`);
    image.setAttribute('aria-hidden', 'true');
    container.append(image);
    images.push(image);
  });
  images.forEach((image, index) => { image.style.objectPosition = heroSlides[index].position; });
  dots.innerHTML = heroSlides.map((slide, index) => `<button type="button" data-slide="${index}" aria-label="Mostrar fotografía: ${slide.caption}" aria-pressed="${index === 0}"><span></span></button>`).join('');
  controls.hidden = false;

  function updatePlayback() {
    playback.setAttribute('aria-label', paused ? 'Reanudar rotación de fotografías' : 'Pausar rotación de fotografías');
    playback.innerHTML = icon(paused ? 'play' : 'pause');
  }
  function schedule() {
    clearTimeout(timer);
    if (paused || focused || hovering || !inView || document.hidden || busy) return;
    timer = setTimeout(() => { void showSlide((activeIndex + 1) % images.length); }, 7000);
  }
  async function showSlide(index, manual = false) {
    requestedIndex = (index + images.length) % images.length;
    const target = requestedIndex;
    const version = ++requestVersion;
    clearTimeout(timer);
    busy = true;
    if (manual) { paused = true; updatePlayback(); }
    // Decode before fading in; a slow or failed request never replaces a visible photo with a blank.
    try {
      await images[target].decode();
    } catch {
      if (version !== requestVersion) return;
      requestedIndex = activeIndex;
      busy = false;
      if (manual) hero.querySelector('#hero-status').textContent = 'No se ha podido cargar la fotografía. Puedes probar con otra.';
      schedule();
      return;
    }
    if (version !== requestVersion) return;
    activeIndex = target;
    images.forEach((image, i) => {
      image.classList.toggle('is-active', i === target);
      image.setAttribute('aria-hidden', String(i !== target));
    });
    dots.querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-pressed', String(i === target)));
    hero.querySelector('#hero-caption').textContent = heroSlides[target].caption;
    if (manual) hero.querySelector('#hero-status').textContent = `${target + 1} de ${images.length}: ${heroSlides[target].caption}`;
    busy = false;
    schedule();
  }
  hero.querySelector('#hero-previous').addEventListener('click', () => { void showSlide(requestedIndex - 1, true); });
  hero.querySelector('#hero-next').addEventListener('click', () => { void showSlide(requestedIndex + 1, true); });
  dots.addEventListener('click', (event) => {
    const button = event.target.closest('[data-slide]');
    if (button) void showSlide(Number(button.dataset.slide), true);
  });
  controls.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    void showSlide(requestedIndex + (event.key === 'ArrowLeft' ? -1 : 1), true);
  });
  playback.addEventListener('click', () => { paused = !paused; updatePlayback(); schedule(); });
  hero.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') { hovering = true; schedule(); } });
  hero.addEventListener('pointerleave', () => { hovering = false; schedule(); });
  hero.addEventListener('focusin', () => { focused = true; schedule(); });
  hero.addEventListener('focusout', (event) => { focused = hero.contains(event.relatedTarget); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) paused = true;
    updatePlayback();
    schedule();
  });
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; schedule(); }, { threshold: .15 }).observe(hero);
  updatePlayback();
  schedule();
}
