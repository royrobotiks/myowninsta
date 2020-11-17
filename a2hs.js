// A2HS handling based on https://mdn.github.io/pwa-examples/a2hs/

if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('serviceworker.js')
           .then(function() { console.log('Service Worker Registered');
           document.getElementById("debug_box").innerHTML += '<br>Service Worker Registered<br>';});
}

// Set up communication channel
const broadcast = new BroadcastChannel('count-channel');

// Listen to the response
broadcast.onmessage = (event) => {
  console.log(event.data.payload);
};

// Code to handle install prompt on desktop

let deferredPrompt;
const addBtn = document.querySelector('.add_button');
addBtn.style.display = 'none';
const addTxt = document.querySelector('.add_text');
addTxt.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
//document.getElementById("debug_box").innerHTML += 'beforeinstallprompt?!<br>';
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';
  addTxt.style.display = 'block';

  addBtn.addEventListener('click', (e) => {

    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    document.getElementById("debug_box").innerHTML += 'A2HS User prompt...';
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
          document.getElementById("debug_box").innerHTML += 'accepted!<br>';
        } else {
          console.log('User dismissed the A2HS prompt');
          document.getElementById("debug_box").innerHTML += 'rejected!<br>';
        }
        deferredPrompt = null;
      });
  });
});
