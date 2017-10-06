var staticCacheName = 'myNewsSite-v0';

self.addEventListener('install', function (event) {
  console.log('ServiceWorker (' + staticCacheName + '): install called');
  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll([
        '/',
        'index.html',
        'manifest.json'
      ]);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('ServiceWorker: Activate');
  //activate active worker asap
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {

  //handle live reload function (for develop purpose)
  if (event.request.url.indexOf('/browser-sync/') !== -1) {
    //fetch(..) is the new XMLHttpRequest
    event.respondWith(fetch(event.request));
    return;
  }

  console.log('ServiceWorker: fetch called for ' + event.request.url);

  //if request in cache then return it, otherwise fetch it from the network
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("beforeinstallprompt", event => {
  // Suppress automatic prompting.
  event.preventDefault();

  // Show the (disabled-by-default) install button. This button
  // resolves the installButtonClicked promise when clicked.
  installButton.disabled = false;

  // Wait for the user to click the button.
  installButton.addEventListener("click", async e => {
    // The prompt() method can only be used once.
    installButton.disabled = true;

    // Show the prompt.
    const { userChoice } = await event.prompt();
    console.info(`user choice was: ${userChoice}`);
  });
});
