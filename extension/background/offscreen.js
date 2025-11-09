// extension/background/offscreen.js

// This script is loaded by offscreen.html
// It listens for a message from the service worker to start the capture process.

chrome.runtime.onMessage.addListener(handleMessages);

async function handleMessages(request) {
  // We only want to listen for messages targeted to the offscreen document
  if (request.target !== 'offscreen') {
    return;
  }

  if (request.action === 'start-capture') {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: false,
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = () => {
        // A short delay to ensure the first frame is available
        setTimeout(() => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Stop the stream tracks to release resources
          stream.getTracks().forEach(track => track.stop());
          video.remove();

          // Send the captured frame back to the service worker as a data URL
          const dataUrl = canvas.toDataURL('image/png');
          chrome.runtime.sendMessage({ action: 'capture-success', dataUrl: dataUrl });

          // Close the offscreen document as its job is done
          window.close();
        }, 150); // 150ms delay seems to be reliable
      };

    } catch (error) {
      // If the user cancels the screen share prompt or an error occurs
      chrome.runtime.sendMessage({ action: 'capture-failure', error: error.message });
      window.close();
    }
  }
}
