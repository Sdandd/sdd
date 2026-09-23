/* SD&D — comportements du site (menu mobile, curseur avant/après, année) */

// Année du pied de page
document.getElementById('year').textContent = new Date().getFullYear();

// Menu mobile
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();

// Comparateur avant / après
document.querySelectorAll('[data-ba]').forEach(function (ba) {
  var handle = ba.querySelector('.ba-handle');
  var dragging = false;

  function setPos(percent) {
    percent = Math.max(0, Math.min(100, percent));
    ba.style.setProperty('--pos', percent + '%');
    handle.setAttribute('aria-valuenow', String(Math.round(percent)));
  }
  function posFromEvent(e) {
    var r = ba.getBoundingClientRect();
    setPos(((e.clientX - r.left) / r.width) * 100);
  }

  // Souris, doigt et stylet (Pointer Events)
  ba.addEventListener('pointerdown', function (e) {
    dragging = true;
    ba.setPointerCapture(e.pointerId);
    posFromEvent(e);
  });
  ba.addEventListener('pointermove', function (e) {
    if (dragging) posFromEvent(e);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (type) {
    ba.addEventListener(type, function () { dragging = false; });
  });

  // Clavier (flèches gauche/droite, Début, Fin)
  handle.addEventListener('keydown', function (e) {
    var now = Number(handle.getAttribute('aria-valuenow'));
    var step = e.shiftKey ? 20 : 5;
    if (e.key === 'ArrowLeft')  { setPos(now - step); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setPos(now + step); e.preventDefault(); }
    if (e.key === 'Home')       { setPos(0);   e.preventDefault(); }
    if (e.key === 'End')        { setPos(100); e.preventDefault(); }
  });

  // Boutons "Avant : Démolition / Réseaux / ..." (chantiers en plusieurs étapes)
  var card = ba.closest('.project');
  var buttons = card.querySelectorAll('.stage-btn');
  var beforeImgs = ba.querySelectorAll('.ba-before .ba-img');
  buttons.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b, j) {
        b.classList.toggle('is-active', i === j);
        b.setAttribute('aria-pressed', String(i === j));
      });
      beforeImgs.forEach(function (img, j) {
        img.classList.toggle('is-active', i === j);
      });
    });
  });
});
