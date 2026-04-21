(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function currentTheme() {
    var stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // Follow the OS if the user has not picked an explicit theme yet.
  var mq = window.matchMedia('(prefers-color-scheme: light)');
  if (mq.addEventListener) {
    mq.addEventListener('change', function () {
      if (!localStorage.getItem('theme')) {
        root.removeAttribute('data-theme');
      }
    });
  }

  // --- Lightbox ---
  var dialog = document.getElementById('lightbox');
  var dialogImg = document.getElementById('lightbox-img');
  var dialogClose = dialog ? dialog.querySelector('.lightbox-close') : null;

  function openLightbox(src, alt) {
    if (!dialog || !dialogImg || !src) return;
    dialogImg.src = src;
    dialogImg.alt = alt || '';
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeLightbox() {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  if (dialog) {
    dialog.addEventListener('close', function () {
      if (dialogImg) dialogImg.removeAttribute('src');
    });
    dialog.addEventListener('click', function (e) {
      // Backdrop click: dialog fills the viewport, so clicks outside the
      // image target the dialog itself.
      if (e.target === dialog) closeLightbox();
    });
  }
  if (dialogClose) {
    dialogClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeLightbox();
    });
  }

  document.addEventListener('click', function (e) {
    var shot = e.target.closest && e.target.closest('.card-shot');
    if (!shot) return;
    var img = shot.querySelector('img');
    if (img) openLightbox(img.currentSrc || img.src, shot.getAttribute('aria-label') || '');
  });
})();
