(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-menu]');

    if (menuButton && menu) {
        menuButton.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        var show = function (index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };

        var start = function () {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                show(index);
                start();
            });
        });

        if (slides.length > 1) {
            start();
        }
    }

    var input = document.querySelector('[data-search-input]');
    var clearButton = document.querySelector('[data-clear-search]');
    var emptyState = document.querySelector('[data-empty-state]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));

    if (input && cards.length) {
        var apply = function () {
            var keyword = input.value.trim().toLowerCase();
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = (card.getAttribute('data-title') || '').toLowerCase();
                var matched = !keyword || haystack.indexOf(keyword) !== -1;
                card.hidden = !matched;
                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.hidden = visible !== 0;
            }
        };

        input.addEventListener('input', apply);

        if (clearButton) {
            clearButton.addEventListener('click', function () {
                input.value = '';
                apply();
                input.focus();
            });
        }
    }
})();
