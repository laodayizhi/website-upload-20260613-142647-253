(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var button = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var nextButton = slider.querySelector('.hero-next');
    var prevButton = slider.querySelector('.hero-prev');
    var index = 0;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle('is-active', position === index);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle('is-active', position === index);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        show(index + 1);
      });
    }
    if (prevButton) {
      prevButton.addEventListener('click', function () {
        show(index - 1);
      });
    }
    dots.forEach(function (dot, position) {
      dot.addEventListener('click', function () {
        show(position);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-m3u8-player]'));
    players.forEach(function (box) {
      var video = box.querySelector('video');
      var startButton = box.querySelector('.player-start');
      var message = box.querySelector('.player-message');
      var source = box.getAttribute('data-src');
      var attached = false;
      var hlsInstance = null;

      function setMessage(text) {
        if (message) {
          message.textContent = text || '';
        }
      }

      function attachSource() {
        if (attached || !video || !source) {
          return;
        }
        attached = true;
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setMessage('视频加载失败，请稍后重试');
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else {
          setMessage('当前浏览器暂不支持此播放源');
        }
      }

      function playVideo() {
        attachSource();
        if (!video) {
          return;
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            setMessage('点击播放器后即可开始播放');
          });
        }
      }

      if (startButton) {
        startButton.addEventListener('click', playVideo);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (video.paused) {
            playVideo();
          } else {
            video.pause();
          }
        });
        video.addEventListener('play', function () {
          box.classList.add('is-playing');
          setMessage('');
        });
        video.addEventListener('pause', function () {
          box.classList.remove('is-playing');
        });
        video.addEventListener('ended', function () {
          box.classList.remove('is-playing');
        });
      }
      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  function initSearchPage() {
    var results = document.getElementById('search-results');
    var summary = document.getElementById('search-summary');
    if (!results || !window.MOVIE_SEARCH_DATA) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var keyword = (params.get('q') || '').trim().toLowerCase();
    var input = document.querySelector('.hero-search input[name="q"]');
    if (input) {
      input.value = params.get('q') || '';
    }
    if (!keyword) {
      results.innerHTML = '';
      return;
    }
    var matched = window.MOVIE_SEARCH_DATA.filter(function (item) {
      var haystack = [
        item.title,
        item.region,
        item.type,
        item.year,
        item.genre,
        item.oneLine,
        (item.tags || []).join(' ')
      ].join(' ').toLowerCase();
      return haystack.indexOf(keyword) !== -1;
    }).slice(0, 96);

    if (summary) {
      summary.textContent = matched.length ? '已找到相关影片，点击卡片可进入播放页。' : '未找到匹配内容，可以换一个关键词。';
    }
    results.innerHTML = matched.map(function (item) {
      return [
        '<article class="movie-card">',
        '  <a class="poster-wrap" href="' + item.url + '">',
        '    <span class="poster-letter">' + escapeHtml(item.title.charAt(0)) + '</span>',
        '    <img class="cover-image" src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy" onerror="this.remove();">',
        '    <span class="poster-meta">' + escapeHtml(item.year) + '</span>',
        '  </a>',
        '  <div class="card-body">',
        '    <a class="card-title" href="' + item.url + '">' + escapeHtml(item.title) + '</a>',
        '    <p class="card-line">' + escapeHtml(item.oneLine || '') + '</p>',
        '    <div class="card-tags"><span>' + escapeHtml(item.region || '') + '</span><span>' + escapeHtml(item.genre || '') + '</span></div>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  ready(function () {
    initMenu();
    initHero();
    initPlayers();
    initSearchPage();
  });
}());
