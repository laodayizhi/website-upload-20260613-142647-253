(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));

    if (slides.length > 0) {
        var currentSlide = 0;

        var showSlide = function (nextIndex) {
            currentSlide = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, index) {
                slide.classList.toggle('is-active', index === currentSlide);
            });
            dots.forEach(function (dot, index) {
                dot.classList.toggle('is-active', index === currentSlide);
            });
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(currentSlide + 1);
            }, 5600);
        }
    }

    var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));

    filterForms.forEach(function (form) {
        var scope = document.querySelector(form.getAttribute('data-filter-target')) || document;
        var searchInput = form.querySelector('[data-filter-search]');
        var yearSelect = form.querySelector('[data-filter-year]');
        var regionSelect = form.querySelector('[data-filter-region]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

        var normalize = function (value) {
            return String(value || '').toLowerCase().trim();
        };

        var filterCards = function () {
            var query = normalize(searchInput ? searchInput.value : '');
            var year = yearSelect ? yearSelect.value : '';
            var region = regionSelect ? regionSelect.value : '';

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-summary')
                ].join(' '));
                var matchesQuery = !query || haystack.indexOf(query) !== -1;
                var matchesYear = !year || card.getAttribute('data-year') === year;
                var matchesRegion = !region || card.getAttribute('data-region') === region;
                card.classList.toggle('is-hidden', !(matchesQuery && matchesYear && matchesRegion));
            });
        };

        [searchInput, yearSelect, regionSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', filterCards);
                control.addEventListener('change', filterCards);
            }
        });
    });
})();
