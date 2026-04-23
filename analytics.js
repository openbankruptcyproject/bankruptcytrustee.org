// drowningindebt.org — conversion event tracking for Ad Grant
// Events fire into the existing gtag() pipeline (two GA4 streams).
// Mark any of these as Conversions in GA4 UI -> Configure -> Events before launch.
(function () {
  if (typeof gtag !== 'function') return;

  var path = location.pathname;

  // 1. Screener CTA click — the green button linking to 1328f.com
  document.querySelectorAll('a.cta').forEach(function (el) {
    el.addEventListener('click', function () {
      gtag('event', 'screener_cta_click', {
        page_path: path,
        link_url: el.href,
      });
    });
  });

  // 2. Outbound click — any link leaving drowningindebt.org
  document.querySelectorAll('a[href^="http"]').forEach(function (el) {
    if (el.hostname && el.hostname !== location.hostname) {
      el.addEventListener('click', function () {
        gtag('event', 'outbound_click', {
          page_path: path,
          outbound_url: el.href,
          link_domain: el.hostname,
        });
      });
    }
  });

  // 3. Scroll depth — 75% of page viewed
  var fired75 = false;
  window.addEventListener(
    'scroll',
    function () {
      if (fired75) return;
      var denom = document.documentElement.scrollHeight - window.innerHeight;
      if (denom <= 0) return;
      var pct = (window.scrollY / denom) * 100;
      if (pct >= 75) {
        fired75 = true;
        gtag('event', 'scroll_75', { page_path: path });
      }
    },
    { passive: true }
  );

  // 4. Engagement — 30 seconds on page (matches GA4 engaged-session threshold)
  setTimeout(function () {
    gtag('event', 'engaged_30s', { page_path: path });
  }, 30000);
})();
