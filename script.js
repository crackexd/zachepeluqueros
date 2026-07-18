const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');
const year = document.querySelector('[data-year]');
const loadMapButton = document.querySelector('[data-load-map]');

const closeMenu = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  menu?.classList.remove('is-open');
  header?.classList.remove('menu-active');
  document.body.classList.remove('menu-open');
  const label = menuButton?.querySelector('.sr-only');
  if (label) label.textContent = 'Abrir menú';
};

menuButton?.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menu?.classList.toggle('is-open', willOpen);
  header?.classList.toggle('menu-active', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
  const label = menuButton.querySelector('.sr-only');
  if (label) label.textContent = willOpen ? 'Cerrar menú' : 'Abrir menú';
});

menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1040) closeMenu();
});

const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

if (year) year.textContent = new Date().getFullYear();

loadMapButton?.addEventListener('click', () => {
  const mapCard = loadMapButton.closest('.map-card');
  const consent = loadMapButton.closest('[data-map-consent]');

  if (!mapCard || !consent) return;

  const frame = document.createElement('iframe');
  frame.className = 'map-frame';
  frame.title = 'Mapa de Zache Peluqueros en Google Maps';
  frame.loading = 'lazy';
  frame.referrerPolicy = 'no-referrer-when-downgrade';
  frame.allowFullscreen = true;
  frame.src = 'https://www.google.com/maps?q=Zache+Peluqueros,+Calle+de+Javier+de+Miguel+7,+Madrid&output=embed';

  consent.replaceWith(frame);
  mapCard.classList.add('is-loaded');
});

const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px' },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
