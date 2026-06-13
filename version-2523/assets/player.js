(function () {
  function setState(wrapper, text) {
    var state = wrapper.querySelector("[data-player-state]");
    if (!state) {
      return;
    }
    state.textContent = text;
    state.classList.toggle("is-visible", Boolean(text));
  }

  function playVideo(video, wrapper) {
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        setState(wrapper, "点击视频继续播放");
      });
    }
  }

  function startPlayer(wrapper) {
    if (wrapper.getAttribute("data-ready") === "true") {
      var readyVideo = wrapper.querySelector("video");
      if (readyVideo) {
        playVideo(readyVideo, wrapper);
      }
      return;
    }

    var video = wrapper.querySelector("video");
    var source = wrapper.getAttribute("data-source");
    if (!video || !source) {
      setState(wrapper, "播放源加载失败");
      return;
    }

    wrapper.setAttribute("data-ready", "true");
    wrapper.classList.add("is-playing");
    setState(wrapper, "正在加载");

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        setState(wrapper, "");
        playVideo(video, wrapper);
      });
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          setState(wrapper, "网络恢复中");
          hls.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          setState(wrapper, "媒体恢复中");
          hls.recoverMediaError();
        } else {
          setState(wrapper, "播放失败，请刷新重试");
          hls.destroy();
        }
      });
      wrapper._hls = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.addEventListener("loadedmetadata", function () {
        setState(wrapper, "");
        playVideo(video, wrapper);
      });
      video.load();
    } else {
      setState(wrapper, "当前浏览器不支持此格式");
    }
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (wrapper) {
      var button = wrapper.querySelector("[data-play-button]");
      var video = wrapper.querySelector("video");
      if (button) {
        button.addEventListener("click", function () {
          startPlayer(wrapper);
        });
      }
      if (video) {
        video.addEventListener("click", function () {
          startPlayer(wrapper);
        });
        video.addEventListener("play", function () {
          wrapper.classList.add("is-playing");
        });
        video.addEventListener("pause", function () {
          if (!video.ended) {
            wrapper.classList.remove("is-playing");
          }
        });
      }
    });
  }

  initPlayers();
})();
