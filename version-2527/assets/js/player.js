(function () {
    window.initMoviePlayer = function (sourceUrl) {
        var video = document.getElementById('moviePlayer');
        var cover = document.getElementById('playerCover');
        var button = document.getElementById('playButton');
        var ready = false;
        var hlsInstance = null;

        if (!video || !sourceUrl) {
            return;
        }

        var attachSource = function () {
            if (ready) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls();
                hlsInstance.loadSource(sourceUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = sourceUrl;
            }

            ready = true;
        };

        var begin = function () {
            attachSource();

            if (cover) {
                cover.classList.add('is-hidden');
            }

            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        };

        if (cover) {
            cover.addEventListener('click', begin);
        }

        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                begin();
            });
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                begin();
            }
        });
    };
})();
