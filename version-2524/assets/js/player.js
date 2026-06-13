(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    document.querySelectorAll('.movie-player').forEach(function (box) {
      var video = box.querySelector('video');
      var overlay = box.querySelector('.player-overlay');
      var stream = box.getAttribute('data-stream');
      var started = false;
      var hls = null;

      function attach() {
        if (!video || !stream || started) {
          return;
        }
        started = true;
        video.controls = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      function play() {
        attach();
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }

      if (overlay) {
        overlay.addEventListener('click', play);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (!started) {
            play();
          }
        });
      }
      window.addEventListener('pagehide', function () {
        if (hls && typeof hls.destroy === 'function') {
          hls.destroy();
        }
      });
    });
  });
})();
