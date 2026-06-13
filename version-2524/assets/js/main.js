(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobile = document.querySelector('[data-mobile-nav]');
    if (toggle && mobile) {
      toggle.addEventListener('click', function () {
        mobile.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === current);
        });
      }

      function move(step) {
        show(current + step);
      }

      function start() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          move(1);
        }, 5000);
      }

      if (prev) {
        prev.addEventListener('click', function () {
          move(-1);
          start();
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          move(1);
          start();
        });
      }
      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
          show(dotIndex);
          start();
        });
      });

      show(0);
      start();
    });

    document.querySelectorAll('[data-filter-form]').forEach(function (panel) {
      var input = panel.querySelector('[data-search-input]');
      var region = panel.querySelector('[data-region-filter]');
      var type = panel.querySelector('[data-type-filter]');
      var year = panel.querySelector('[data-year-filter]');
      var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

      function valueOf(control) {
        return control ? control.value.trim() : '';
      }

      function apply() {
        var query = valueOf(input).toLowerCase();
        var regionValue = valueOf(region);
        var typeValue = valueOf(type);
        var yearValue = valueOf(year);

        cards.forEach(function (card) {
          var text = [
            card.dataset.title || '',
            card.dataset.region || '',
            card.dataset.type || '',
            card.dataset.year || '',
            card.dataset.tags || ''
          ].join(' ').toLowerCase();
          var matched = true;
          if (query && text.indexOf(query) === -1) {
            matched = false;
          }
          if (regionValue && card.dataset.region !== regionValue) {
            matched = false;
          }
          if (typeValue && card.dataset.type !== typeValue) {
            matched = false;
          }
          if (yearValue && card.dataset.year !== yearValue) {
            matched = false;
          }
          card.hidden = !matched;
        });
      }

      [input, region, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
    });
  });
})();
