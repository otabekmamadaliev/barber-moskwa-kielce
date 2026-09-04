/* Barber Shop Łukasz Moskwa — skrypt tylko tej strony. Bez zależności. */
(function () {
  'use strict';
  var T = {}; try { T = JSON.parse(document.getElementById('i18n').textContent) || {}; } catch (e) {}
  var t = function (k, d) { return T[k] || d; };
  var spokojnie = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* pasek chudnie po zjechaniu z góry */
  var top = document.querySelector('.top');
  if (top) {
    var s = function () { top.classList.toggle('przewiniety', window.scrollY > 30); };
    s(); window.addEventListener('scroll', s, { passive: true });
  }

  /* menu na telefonie */
  var btn = document.querySelector('.menu-btn');
  var mob = document.getElementById('mob');
  if (btn && mob) {
    var etykieta = btn.getAttribute('aria-label');
    btn.addEventListener('click', function () {
      var open = mob.classList.toggle('otwarte');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? t('closeMenu', etykieta) : etykieta);
    });
    mob.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { mob.classList.remove('otwarte'); btn.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mob.classList.contains('otwarte')) btn.click();
    });
  }

  /* ---- nagłówek wjeżdża słowo po słowie ----
     Pomysł z newyorkbarbershop.ca (ich keyframe `wordIn`).
     Rozbijamy TYLKO na spacjach, więc tekst zostaje tym samym tekstem —
     czytnik ekranu i zaznaczanie myszą działają jak wcześniej.
     Bez JS albo przy zredukowanym ruchu nagłówek jest po prostu widoczny. */
  if (!spokojnie) {
    document.querySelectorAll('[data-slowa]').forEach(function (el) {
      var slowa = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      slowa.forEach(function (w, i) {
        var s = document.createElement('span');
        s.className = 'slowo';
        s.textContent = w;
        s.style.animationDelay = (i * 70) + 'ms';
        el.appendChild(s);
        if (i < slowa.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });
  }

  /* sekcje wchodzą po kolei */
  if ('IntersectionObserver' in window && !spokojnie) {
    var cele = document.querySelectorAll('.zaklad-tresc p, .punkty li, .poz, .praca figure, .gdzie, .kiedy table');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.style.transition = 'opacity .7s ease, transform .7s cubic-bezier(.2,.7,.25,1)';
        en.target.style.opacity = 1; en.target.style.transform = 'none';
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .05 });
    Array.prototype.forEach.call(cele, function (el, i) {
      el.style.opacity = 0; el.style.transform = 'translateY(18px)';
      el.style.transitionDelay = (i % 5) * 65 + 'ms';
      io.observe(el);
    });
  }

  /* Kliknięcie w przełącznik zapamiętuje wybór, żeby automat nie zabierał
     użytkownika z powrotem przy następnym wejściu. */
  document.querySelectorAll('a.lang').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('jezyk', (a.getAttribute('hreflang') || a.textContent).trim().toLowerCase().slice(0,2)); } catch (e) {}
    });
  });

  /* Zakres obejmujacy dzisiejszy dzien dostaje znacznik. Liczy przegladarka,
     bo strona jest statyczna i data budowania nic tu nie znaczy. */
  (function () {
    var i = (new Date().getDay() + 6) % 7;
    var zakresy = document.querySelectorAll('.zakres[data-dni]');
    for (var k = 0; k < zakresy.length; k++) {
      var dni = zakresy[k].getAttribute('data-dni').split(',');
      if (dni.indexOf(String(i)) > -1) { zakresy[k].classList.add('dzis'); break; }
    }
  })();
})();
