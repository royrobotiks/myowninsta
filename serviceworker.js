// A2HS service worker based on https://mdn.github.io/pwa-examples/a2hs/
console.log('service worker says hello!');

// Set up channel with same name as in app.js
var count=0;
const broadcast = new BroadcastChannel('count-channel');
broadcast.onmessage = (event) => {
  if (event.data && event.data.type === 'INCREASE_COUNT') {
    broadcast.postMessage({ payload: ++count });
  }
};



self.addEventListener('install', function(e) {
  console.log('install!');
broadcast.postMessage({ payload: 'sw: try to install!' });

});

self.addEventListener('fetch', function(e) {
  console.log('fetch!');
broadcast.postMessage({ payload: 'sw: try to fetch!' });
});
