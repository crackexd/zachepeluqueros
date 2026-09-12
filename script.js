const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');
const year = document.querySelector('[data-year]');

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
  if (willOpen && menu) menu.scrollTop = 0;
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

// Se comparte siempre la URL pública del artículo, sin parámetros ni anclas.
document.querySelectorAll('[data-article-share]').forEach((panel) => {
  const url = panel.querySelector('[data-share-url]')?.value;
  const title = document.querySelector('.article-hero h1')?.textContent.trim();
  if (!url || !title) return;

  const copyButton = panel.querySelector('[data-share-copy]');
  const nativeButton = panel.querySelector('[data-share-native]');
  const fallback = panel.querySelector('[data-share-fallback]');
  const input = panel.querySelector('[data-share-url]');
  const status = panel.querySelector('[data-share-status]');
  const shareData = { title, url };
  const showManualCopy = (message) => {
    fallback.hidden = false;
    status.textContent = message;
    input.focus();
    input.select();
  };

  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    copyButton.disabled = true;
    status.textContent = '';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      fallback.hidden = true;
      status.textContent = 'Enlace copiado. Ya puedes enviarlo a quien quieras.';
    } catch {
      showManualCopy('Copia el enlace seleccionado para compartir este artículo.');
    } finally {
      copyButton.disabled = false;
    }
  });

  let canShare = window.isSecureContext && typeof navigator.share === 'function';
  try {
    if (canShare && navigator.canShare) canShare = navigator.canShare(shareData);
  } catch {
    canShare = false;
  }
  if (!canShare) return;

  nativeButton.hidden = false;
  nativeButton.addEventListener('click', async () => {
    nativeButton.disabled = true;
    status.textContent = '';
    try {
      await navigator.share(shareData);
    } catch (error) {
      if (error.name !== 'AbortError') {
        showManualCopy('Puedes copiar este enlace o compartirlo por WhatsApp.');
      }
    } finally {
      nativeButton.disabled = false;
    }
  });
});

const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-reveal');
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

// Los enlaces a un servicio complementario abren su respuesta antes de navegar.
document.querySelectorAll('a[href="#preguntas-belleza"]').forEach((link) => {
  link.addEventListener('click', () => {
    const answer = document.getElementById('preguntas-belleza');
    if (answer) answer.open = true;
  });
});

if (window.location.hash === '#preguntas-belleza') {
  const answer = document.getElementById('preguntas-belleza');
  if (answer) answer.open = true;
}
