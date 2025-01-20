const CACHE_NAME = "tetris-pwa-v1";
const urlsToCache = [
  "/tetris-pwa/",
  "/tetris-pwa/index.html",
  "/tetris-pwa/manifest.json",
  "/tetris-pwa/assets/icons/icon-192x192.png",
  "/tetris-pwa/assets/icons/icon-512x512.png",
  "/tetris-pwa/game.js",
  "/tetris-pwa/scenes/GameScene.js",
  "/tetris-pwa/scenes/MenuScene.js",
  "/tetris-pwa/game-objects/Tetromino.js",
  "https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
