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
      if (Date.now() - Number(saved.savedAt) > consentMaxAge) {
        localStorage.removeItem(storageKey);
        return null;
      }
      return saved.choice;
    } catch {
      return null;
    }
  };

  const writeConsent = (choice) => {
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
    if (element.closest('header')) return 'cabecera';
    if (element.closest('footer')) return 'pie';
    return element.closest('section')?.id || 'contenido';
  };

  const sendEvent = (eventName, element) => {
    if (readConsent() !== 'accepted' || !analyticsLoaded || !window.gtag) return;
    window.gtag('event', eventName, {
      ubicacion_cta: getCtaLocation(element),
      transport_type: 'beacon',
    });
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (link) {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('tel:')) sendEvent('click_llamar', link);
      else if (/google\.[^/]+\/maps/i.test(link.href)) sendEvent('click_como_llegar', link);
      else if (/instagram\.com/i.test(link.href)) sendEvent('click_instagram', link);
      else if (/facebook\.com/i.test(link.href)) sendEvent('click_facebook', link);
    }

    const mapButton = event.target.closest('[data-load-map]');
    if (mapButton) sendEvent('click_cargar_mapa', mapButton);
  });

  const banner = document.createElement('section');
  banner.className = 'cookie-consent';
  banner.setAttribute('aria-label', 'Preferencias de privacidad');
  banner.hidden = true;
  banner.innerHTML = `
    <div class="cookie-consent__content">
      <div>
        <p class="cookie-consent__title">Tu privacidad, primero</p>
        <p>Con tu permiso, usamos Google Analytics para contar visitas y clics en llamar o cómo llegar. No activamos publicidad personalizada. <a href="/legal/cookies.html">Más información</a>.</p>
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
    const wasAccepted = readConsent() === 'accepted';
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
  document.body.append(banner, settingsButton);

  const consent = readConsent();
  if (consent === 'accepted') {
    loadAnalytics();
    settingsButton.hidden = false;
  } else if (consent === 'rejected') {
    settingsButton.hidden = false;
  } else {
    showBanner();
  }
})();
