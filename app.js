(function () {
    "use strict";

    var cfg = window.BM_LOADING_CONFIG || {};
    var state = {
        totalFiles: 0,
        filesNeeded: 0,
        downloaded: 0,
        progress: 0,
        tipIndex: 0,
        muted: false,
        musicStarted: false
    };

    function byId(id) {
        return document.getElementById(id);
    }

    function safeText(value, fallback) {
        var text = String(value == null ? "" : value).trim();
        return text || fallback || "";
    }

    function choose(list, random) {
        if (!Array.isArray(list) || !list.length) return null;
        if (random === false) return list[0];
        return list[Math.floor(Math.random() * list.length)];
    }

    function query(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name) || "";
    }

    function prettifyMap(map) {
        map = safeText(map, "CARTE INCONNUE");
        return map.replace(/_/g, " ").toUpperCase();
    }

    function setProgress(value) {
        value = Math.max(0, Math.min(100, Number(value) || 0));
        state.progress = Math.max(state.progress, value);
        byId("progress").style.width = state.progress + "%";
        byId("progress-glow").style.left = state.progress + "%";
        byId("percent").textContent = Math.round(state.progress) + "%";
        document.querySelector(".progress-track").setAttribute("aria-valuenow", Math.round(state.progress));
    }

    function setStatus(text) {
        byId("status").textContent = safeText(text, "CHARGEMENT...").toUpperCase();
    }

    function setDownload(text) {
        byId("download-file").textContent = safeText(text, "Synchronisation des ressources du serveur");
    }

    function nextTip() {
        var tips = Array.isArray(cfg.tips) ? cfg.tips : [];
        if (!tips.length) return;
        state.tipIndex = (state.tipIndex + 1) % tips.length;
        var card = document.querySelector(".protocol-card");
        card.classList.add("changing");
        window.setTimeout(function () {
            byId("tip").textContent = tips[state.tipIndex];
            byId("protocol-number").textContent = String(state.tipIndex + 1).padStart(2, "0");
            card.classList.remove("changing");
        }, 220);
    }

    function setAudioButton(icon, title, muted) {
        byId("audio-icon").textContent = icon;
        byId("track-name").textContent = title;
        byId("audio-toggle").classList.toggle("muted", muted === true);
    }

    function setupYouTubeMusic(track) {
        var videoId = String(track.youtubeId || "").replace(/[^a-zA-Z0-9_-]/g, "");
        if (!videoId) return false;

        var iframe = document.createElement("iframe");
        var volume = Math.round(Math.max(0, Math.min(1, Number(cfg.musicVolume) || 0.28)) * 100);
        var title = safeText(track.title, "MUSIQUE YOUTUBE");
        iframe.id = "youtube-player";
        iframe.title = title;
        iframe.allow = "autoplay; encrypted-media";
        iframe.src = "https://www.youtube-nocookie.com/embed/" + videoId
            + "?autoplay=1&loop=1&playlist=" + videoId
            + "&controls=0&rel=0&modestbranding=1&enablejsapi=1&playsinline=1";
        document.body.appendChild(iframe);

        function command(name, args) {
            if (!iframe.contentWindow) return;
            iframe.contentWindow.postMessage(JSON.stringify({
                event: "command",
                func: name,
                args: args || []
            }), "https://www.youtube-nocookie.com");
        }

        function startWithSound() {
            command("setVolume", [volume]);
            command("unMute");
            command("playVideo");
            state.musicStarted = true;
            state.muted = false;
            setAudioButton("◖))", title, false);
        }

        iframe.addEventListener("load", function () {
            command("setVolume", [volume]);
            command("playVideo");
        });

        setAudioButton("▶", "CLIQUER — " + title, false);
        byId("audio-toggle").addEventListener("click", function () {
            if (!state.musicStarted) {
                startWithSound();
                return;
            }

            state.muted = !state.muted;
            command(state.muted ? "mute" : "unMute");
            if (!state.muted) command("playVideo");
            setAudioButton(state.muted ? "×" : "◖))", title, state.muted);
        });

        return true;
    }

    function setupMusic() {
        var track = choose(cfg.music, cfg.randomMusic);
        var player = byId("music-player");
        if (!track) {
            byId("audio-toggle").hidden = true;
            return;
        }

        if (track.youtubeId && setupYouTubeMusic(track)) return;
        if (!track.file) {
            byId("audio-toggle").hidden = true;
            return;
        }

        player.src = track.file;
        player.volume = Math.max(0, Math.min(1, Number(cfg.musicVolume) || 0.28));
        setAudioButton("◖))", safeText(track.title, "AMBIANCE DU COMPLEXE"), false);

        function tryPlay() {
            var result = player.play();
            if (result && result.catch) result.catch(function () {});
        }

        player.addEventListener("ended", function () {
            setupMusic();
            tryPlay();
        }, {once: true});

        byId("audio-toggle").addEventListener("click", function () {
            state.muted = !state.muted;
            player.muted = state.muted;
            setAudioButton(
                state.muted ? "×" : "◖))",
                safeText(track.title, "AMBIANCE DU COMPLEXE"),
                state.muted
            );
            if (!state.muted) tryPlay();
        });

        document.addEventListener("click", tryPlay, {once: true});
        tryPlay();
    }

    function initialize() {
        byId("server-name").textContent = safeText(cfg.serverName, "BLACK MESA RP FRANCE");
        byId("facility").textContent = safeText(cfg.facilityName, "BLACK MESA RESEARCH FACILITY");
        byId("sector").textContent = safeText(cfg.sectorName, "RESEARCH SECTOR");
        byId("headline").textContent = safeText(cfg.headline, "Bienvenue au complexe");
        byId("tagline").textContent = safeText(cfg.tagline, "Connexion au serveur en cours.");

        var background = choose(cfg.backgrounds, cfg.randomBackground);
        if (background) byId("background").style.backgroundImage = "url('" + background.replace(/'/g, "%27") + "')";

        var map = query("mapname") || query("map");
        var player = query("steamid") || query("communityid");
        if (map) byId("map-name").textContent = prettifyMap(map);
        if (player) byId("player-name").textContent = "ID PERSONNEL " + player;

        var tips = Array.isArray(cfg.tips) ? cfg.tips : [];
        if (tips.length) byId("tip").textContent = tips[0];
        window.setInterval(nextTip, Math.max(2500, Number(cfg.tipsInterval) || 6500));
        setupMusic();

        // Animation de démonstration quand la page est ouverte hors de Garry's Mod.
        if (!query("mapname") && window.location.protocol === "file:") {
            byId("map-name").textContent = "RP SECTOR V2A UF";
            window.setInterval(function () {
                if (state.progress < 92) setProgress(state.progress + Math.random() * 4);
            }, 900);
        }
    }

    // Fonctions appelées automatiquement par Garry's Mod pendant la connexion.
    window.GameDetails = function (serverName, serverUrl, mapName, maxPlayers, steamId, gameMode) {
        if (safeText(serverName)) byId("server-name").textContent = safeText(serverName).toUpperCase();
        byId("map-name").textContent = prettifyMap(mapName);
        if (safeText(steamId)) byId("player-name").textContent = "ID PERSONNEL " + safeText(steamId);
        setStatus("Liaison établie — " + safeText(gameMode, "DarkRP"));
        setProgress(4);
    };

    window.SetFilesTotal = function (total) {
        state.totalFiles = Math.max(0, Number(total) || 0);
        state.downloaded = 0;
    };

    window.SetFilesNeeded = function (needed) {
        state.filesNeeded = Math.max(0, Number(needed) || 0);
        if (state.totalFiles > 0) {
            state.downloaded = Math.max(0, state.totalFiles - state.filesNeeded);
            setProgress(5 + (state.downloaded / state.totalFiles) * 90);
        }
    };

    window.DownloadingFile = function (fileName) {
        setStatus("Téléchargement des ressources");
        setDownload(safeText(fileName, "Ressource du serveur"));
        if (state.totalFiles > 0) {
            state.downloaded = Math.min(state.totalFiles, state.downloaded + 1);
            setProgress(5 + (state.downloaded / state.totalFiles) * 90);
        }
    };

    window.SetStatusChanged = function (status) {
        setStatus(status);
        setDownload(status);
        if (/sending client info|starting lua|retrieving server info/i.test(String(status))) setProgress(96);
    };

    document.addEventListener("DOMContentLoaded", initialize);
}());
