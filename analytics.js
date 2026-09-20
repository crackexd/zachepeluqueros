(() => {
  'use strict';

  const measurementId = window.ZacheAnalyticsConfig?.measurementId?.trim() || '';
  const isConfigured = /^G-[A-Z0-9]+$/i.test(measurementId);

  // No se muestra ningún aviso ni se contacta con Google hasta configurar GA4.
  if (!isConfigured) return;

  const storageKey = 'zache_cookie_consent_v1';
  const consentMaxAge = 180 * 24 * 60 * 60 * 1000;
  let analyticsLoaded = false;

  const readConsent = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (!saved || !['accepted', 'rejected'].includes(saved.choice)) return null;
      const savedAt = Number(saved.savedAt);
      if (!Number.isFinite(savedAt) || savedAt <= 0 || savedAt > Date.now() || Date.now() - savedAt > consentMaxAge) {
        localStorage.removeItem(storageKey);
        return null;
      }
      return saved.choice;
    } catch {
      return null;
    }
  };

  let currentConsent = readConsent();

  const writeConsent = (choice) => {
    currentConsent = choice;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ choice, savedAt: Date.now() }));
    } catch {
      // El bloqueo del almacenamiento local no impide respetar la elección actual.
    }
  };

  const ensureDataLayer = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
      };
  };

  const setGoogleConsent = (analyticsStorage) => {
    ensureDataLayer();
    window.gtag('consent', 'update', {
      analytics_storage: analyticsStorage,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  };

  const loadAnalytics = () => {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    ensureDataLayer();

    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    });
    setGoogleConsent('granted');
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      anonymize_ip: true,
      cookie_expires: 15552000,
      cookie_update: false,
    });

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(tag);
  };

  const clearGoogleAnalyticsCookies = () => {
    const hostnameParts = window.location.hostname.split('.');
    const domains = ['', window.location.hostname, `.${window.location.hostname}`];
    if (hostnameParts.length > 2) domains.push(`.${hostnameParts.slice(-2).join('.')}`);

    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      if (!name.startsWith('_ga')) return;
      domains.forEach((domain) => {
        const domainPart = domain ? `; domain=${domain}` : '';
        document.cookie = `${name}=; Max-Age=0; path=/${domainPart}; SameSite=Lax`;
      });
    });
  };

  const getCtaLocation = (element) => {
    if (element.closest('.whatsapp-contact')) return 'whatsapp_flotante';
    if (element.closest('.contact-dock')) return 'barra_movil';
    if (element.closest('header')) return 'cabecera';
    if (element.closest('footer')) return 'pie';
    return element.closest('section')?.id || 'contenido';
  };

  const sendEvent = (eventName, element, parameters = {}) => {
    if (currentConsent !== 'accepted' || !analyticsLoaded || !window.gtag) return;
    window.gtag('event', eventName, {
      ubicacion_cta: getCtaLocation(element),
      ...parameters,
      transport_type: 'beacon',
    });
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (link) {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('tel:')) sendEvent('click_llamar', link);
      else if (link.matches('.whatsapp-contact')) sendEvent('click_whatsapp', link);
      else if (/google\.[^/]+\/maps/i.test(link.href)) sendEvent('click_como_llegar', link);
      else if (/instagram\.com/i.test(link.href)) sendEvent('click_instagram', link);
      else if (/facebook\.com/i.test(link.href)) sendEvent('click_facebook', link);
      else if (link.origin === window.location.origin && /\/servicios\/[^/]+\.html$/.test(link.pathname)) {
        sendEvent('click_ver_servicio', link, { servicio: link.pathname.split('/').pop().replace('.html', '') });
      } else if (link.hash === '#cita') sendEvent('click_info_cita', link);
    }

  });

  document.querySelectorAll('.faq-list details').forEach((answer, index) => {
    answer.addEventListener('toggle', () => {
      if (answer.open) sendEvent('abrir_pregunta', answer, { pregunta_id: `pregunta_${index + 1}` });
    });
  });

  const banner = document.createElement('section');
  banner.className = 'cookie-consent';
  banner.setAttribute('aria-label', 'Preferencias de privacidad');
  banner.hidden = true;
  banner.innerHTML = `
    <div class="cookie-consent__content">
      <div>
        <p class="cookie-consent__title">Tu privacidad, primero</p>
        <p>Con tu permiso, usamos Google Analytics para contar visitas, clics en servicios, llamar o cómo llegar y consultas de preguntas frecuentes. No activamos publicidad personalizada. <a href="/legal/cookies.html">Más información</a>.</p>
      </div>
      <div class="cookie-consent__actions">
        <button type="button" data-consent-choice="rejected">Rechazar</button>
        <button type="button" data-consent-choice="accepted">Aceptar</button>
      </div>
    </div>
  `;

  const settingsButton = document.createElement('button');
  settingsButton.type = 'button';
  settingsButton.className = 'cookie-settings-button';
  settingsButton.textContent = 'Configurar cookies';
  settingsButton.hidden = true;

  // Mantener el control junto a la información legal y liberar la esquina inferior.
  const footer = document.querySelector('.site-footer');
  const cookiesLink = footer?.querySelector('a[href$="cookies.html"]');
  const settingsContainer = cookiesLink?.parentElement || footer?.querySelector('.footer-bottom p:last-child') || footer;
  if (settingsContainer) {
    if (!cookiesLink && settingsContainer.childNodes.length) settingsContainer.append(' · ');
    settingsContainer.append(settingsButton);
  }

  const showBanner = () => {
    banner.hidden = false;
    settingsButton.hidden = true;
  };

  const hideBanner = () => {
    banner.hidden = true;
    settingsButton.hidden = false;
  };

  banner.addEventListener('click', (event) => {
    const button = event.target.closest('[data-consent-choice]');
    if (!button) return;

    const choice = button.dataset.consentChoice;
    const wasAccepted = currentConsent === 'accepted';
    writeConsent(choice);

    if (choice === 'accepted') {
      loadAnalytics();
      hideBanner();
      return;
    }

    if (wasAccepted) {
      setGoogleConsent('denied');
      clearGoogleAnalyticsCookies();
      window.location.reload();
      return;
    }

    hideBanner();
  });

  settingsButton.addEventListener('click', showBanner);
  document.body.append(banner);

  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    const wasAccepted = currentConsent === 'accepted';
    currentConsent = readConsent();
    if (wasAccepted && currentConsent !== 'accepted') {
      setGoogleConsent('denied');
      clearGoogleAnalyticsCookies();
      window.location.reload();
    } else if (currentConsent === 'accepted') {
      loadAnalytics();
      hideBanner();
    } else if (currentConsent === 'rejected') {
      hideBanner();
    } else {
      showBanner();
    }
  });

  const consent = currentConsent;
  if (consent === 'accepted') {
    loadAnalytics();
    settingsButton.hidden = false;
  } else if (consent === 'rejected') {
    settingsButton.hidden = false;
  } else {
    showBanner();
  }
})();
