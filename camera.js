// camera.js – real CCTV simulation with canvas overlay
(function() {
  'use strict';

  const video = document.getElementById('cctvFeed');
  const canvas = document.getElementById('overlayCanvas');
  const ctx = canvas.getContext('2d');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const motionIndicator = document.getElementById('motionIndicator');

  // use a real working camera stream (public test stream)
  const STREAM_URL = 'https://www.w3schools.com/html/mov_bbb.mp4'; // fallback video

  function initCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          video.srcObject = stream;
          video.play();
          loadingOverlay.style.display = 'none';
          motionIndicator.style.display = 'block';
        })
        .catch(err => {
          console.warn('getUserMedia failed, using fallback stream.', err);
          fallbackStream();
        });
    } else {
      fallbackStream();
    }
  }

  function fallbackStream() {
    video.src = STREAM_URL;
    video.load();
    video.play().catch(e => console.warn('fallback play error', e));
    loadingOverlay.style.display = 'none';
    motionIndicator.style.display = 'block';
  }

  // resize canvas to match video
  function resizeCanvas() {
    const rect = video.getBoundingClientRect();
    canvas.width = rect.width * 0.9;  // avoid pixelation
    canvas.height = rect.height * 0.9;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }

  window.addEventListener('resize', resizeCanvas);
  video.addEventListener('loadedmetadata', resizeCanvas);
  video.addEventListener('play', resizeCanvas);

  // draw overlay graphics (bounding boxes, labels)
  function drawOverlay(detections) {
    if (!ctx || !canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (!detections || detections.length === 0) return;

    detections.forEach(d => {
      const x = d.x * w, y = d.y * h, bw = d.w * w, bh = d.h * h;
      ctx.strokeStyle = d.color || '#31a8ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, bw, bh);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(x, y-20, bw, 20);
      ctx.fillStyle = '#fff';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(d.label + ' ' + (d.confidence ? Math.round(d.confidence*100)+'%' : ''), x+4, y-6);
    });
  }

  // expose to other modules
  window.Camera = {
    init: initCamera,
    drawOverlay: drawOverlay,
    video: video,
    canvas: canvas,
    resize: resizeCanvas
  };
})();