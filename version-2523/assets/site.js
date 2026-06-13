(function () {
  function rootPrefix() {
    return document.body.getAttribute("data-root-prefix") || ".";
  }

  function resolveUrl(path) {
    var prefix = rootPrefix();
    if (prefix === ".") {
      return "./" + path;
    }
    return prefix + "/" + path;
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-primary-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var previous = slider.querySelector("[data-hero-prev]");
    var next = slider.querySelector("[data-hero-next]");
    var index = 0;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    if (previous) {
      previous.addEventListener("click", function () {
        show(index - 1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5000);
  }

  function renderSearchItem(movie) {
    var image = movie.cover ? '<img src="' + resolveUrl(movie.cover) + '" alt="" loading="lazy" onerror="this.classList.add('is-hidden');">' : "";
    return '<a class="search-item" href="' + resolveUrl(movie.url) + '">' +
      '<span class="search-thumb">' + image + '</span>' +
      '<span>' +
      '<strong class="search-title">' + movie.title + '</strong>' +
      '<small class="search-meta">' + movie.year + ' · ' + movie.region + ' · ' + movie.type + '</small>' +
      '</span>' +
      '</a>';
  }

  function initSearch() {
    var forms = Array.prototype.slice.call(document.querySelectorAll("[data-search-form]"));
    var data = window.SEARCH_MOVIES || [];
    forms.forEach(function (form) {
      var input = form.querySelector("[data-search-input]");
      var panel = form.querySelector("[data-search-panel]");
      if (!input || !panel) {
        return;
      }

      function runSearch() {
        var query = input.value.trim().toLowerCase();
        if (!query) {
          panel.classList.remove("is-open");
          panel.innerHTML = "";
          return [];
        }
        var results = data.filter(function (movie) {
          return movie.search.indexOf(query) !== -1;
        }).slice(0, 10);
        if (!results.length) {
          panel.innerHTML = '<div class="search-item"><span></span><span><strong class="search-title">未找到相关片名</strong><small class="search-meta">换一个关键词试试</small></span></div>';
        } else {
          panel.innerHTML = results.map(renderSearchItem).join("");
        }
        panel.classList.add("is-open");
        return results;
      }

      input.addEventListener("input", runSearch);
      input.addEventListener("focus", runSearch);
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var results = runSearch();
        if (results.length) {
          window.location.href = resolveUrl(results[0].url);
        }
      });
      document.addEventListener("click", function (event) {
        if (!form.contains(event.target)) {
          panel.classList.remove("is-open");
        }
      });
    });
  }

  initMenu();
  initHero();
  initSearch();
})();
