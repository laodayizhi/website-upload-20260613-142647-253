(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (box) {
        var video = box.querySelector('video');
        var button = box.querySelector('[data-play]');
        var stream = box.getAttribute('data-stream');
        var active = false;
        var hlsInstance = null;

        var attach = function () {
            if (!video || !stream || active) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else {
                video.src = stream;
            }

            active = true;
        };

        var play = function () {
            attach();
            box.classList.add('is-playing');
            video.controls = true;
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        };

        if (button && video) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                play();
            });
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!active) {
                    play();
                }
            });
        }

        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
})();
