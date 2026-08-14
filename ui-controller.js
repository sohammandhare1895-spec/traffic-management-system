// ui-controller.js – UI interactions, buttons, logs, gallery, settings
(function() {
  'use strict';

  const logContainer = document.getElementById('eventLog');
  const galleryGrid = document.getElementById('galleryGrid');

  // add log entry
  function addLog(message, icon = '📌') {
    if (!logContainer) return;
    const li = document.createElement('li');
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    li.innerHTML = `<time>${time}</time> ${icon} ${message}`;
    logContainer.prepend(li);
    if (logContainer.children.length > 50) {
      logContainer.removeChild(logContainer.lastChild);
    }
  }

  // snapshot: capture current video frame + overlay
  function takeSnapshot() {
    const video = document.getElementById('cctvFeed');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 360;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // overlay from main canvas
    const overlayCanvas = document.getElementById('overlayCanvas');
    if (overlayCanvas) {
      ctx.drawImage(overlayCanvas, 0, 0, canvas.width, canvas.height);
    }
    const dataUrl = canvas.toDataURL('image/jpeg');
    addGalleryItem(dataUrl, 'snapshot');
    addLog('📸 snapshot captured', '📸');
  }

  function addGalleryItem(src, label = 'capture') {
    if (!galleryGrid) return;
    const card = document.createElement('div');
    card.className = 'file-card';
    const img = document.createElement('img');
    img.src = src;
    img.alt = label;
    const p = document.createElement('p');
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    p.innerText = `${label} · ${time}`;
    card.appendChild(img);
    card.appendChild(p);
    galleryGrid.prepend(card);
    if (galleryGrid.children.length > 20) {
      galleryGrid.removeChild(galleryGrid.lastChild);
    }
  }

  // clear gallery
  function clearGallery() {
    if (galleryGrid) {
      while (galleryGrid.firstChild) galleryGrid.removeChild(galleryGrid.firstChild);
    }
    addLog('🗑️ gallery cleared', '🗑️');
  }

  // toggle recording badge
  let recording = true;
  function toggleRecording() {
    recording = !recording;
    const badge = document.getElementById('recBadge');
    if (badge) {
      badge.style.display = recording ? 'inline-block' : 'none';
    }
    addLog(recording ? '⏺️ recording started' : '⏹️ recording stopped', recording ? '⏺️' : '⏹️');
  }

  // reset: clear logs, gallery, reset metrics
  function resetDashboard() {
    if (logContainer) {
      while (logContainer.firstChild) logContainer.removeChild(logContainer.firstChild);
      addLog('🔄 dashboard reset', '🔄');
    }
    // clear gallery
    clearGallery();
    // reset detection list
    const list = document.getElementById('scanResults');
    if (list) {
      list.innerHTML = `<li><span>🔄 reset</span><span>—</span></li>`;
    }
    // reset metrics to defaults
    document.getElementById('vehicleCount').innerText = '0';
    document.getElementById('pedestrianCount').innerText = '0';
    document.getElementById('avgSpeed').innerText = '0';
    document.getElementById('congestionLevel').innerText = '0%';
    document.getElementById('flowLabel').innerText = '—';
    document.getElementById('densityLabel').innerText = '—';
    document.getElementById('incidentCount').innerText = '0';
    addLog('📊 metrics reset', '📊');
  }

  // simulate event
  function simulateEvent() {
    const events = [
      '🚦 traffic light changed to green',
      '🚗 vehicle detected · plate ABC-123',
      '🚶 pedestrian crossing at crosswalk',
      '⚠️ congestion alert · 82%',
      '📡 AI recalibrated',
      '🚨 emergency vehicle detected',
      '🌧️ weather change detected'
    ];
    const msg = events[Math.floor(Math.random() * events.length)];
    addLog(msg, '⚡');
  }

  // settings: sensitivity & threshold
  function initSettings() {
    const sens = document.getElementById('sensitivity');
    const sensVal = document.getElementById('sensVal');
    const thr = document.getElementById('detectionThreshold');
    const thrVal = document.getElementById('thrVal');

    if (sens && sensVal) {
      sens.addEventListener('input', () => {
        sensVal.innerText = sens.value;
        addLog(`🔧 sensitivity set to ${sens.value}`, '🔧');
      });
    }
    if (thr && thrVal) {
      thr.addEventListener('input', () => {
        thrVal.innerText = thr.value + '%';
        addLog(`🎯 confidence threshold ${thr.value}%`, '🎯');
      });
    }

    // night mode toggle
    const night = document.getElementById('nightMode');
    if (night) {
      night.addEventListener('change', () => {
        addLog(night.checked ? '🌙 night mode ON' : '☀️ night mode OFF', night.checked ? '🌙' : '☀️');
      });
    }
    const heatmap = document.getElementById('heatmapToggle');
    if (heatmap) {
      heatmap.addEventListener('change', () => {
        addLog(heatmap.checked ? '🔥 heatmap overlay ON' : '🧊 heatmap overlay OFF', heatmap.checked ? '🔥' : '🧊');
      });
    }
  }

  // bind buttons
  function bindButtons() {
    document.getElementById('snapshotBtn')?.addEventListener('click', takeSnapshot);
    document.getElementById('toggleRecBtn')?.addEventListener('click', toggleRecording);
    document.getElementById('resetBtn')?.addEventListener('click', resetDashboard);
    document.getElementById('simulateBtn')?.addEventListener('click', simulateEvent);
    document.getElementById('clearGalleryBtn')?.addEventListener('click', clearGallery);
  }

  // update live datetime
  function updateClock() {
    const el = document.getElementById('liveDateTime');
    if (el) {
      const now = new Date();
      el.innerText = now.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  }

  // init UI
  function initUI() {
    bindButtons();
    initSettings();
    updateClock();
    setInterval(updateClock, 1000);
    // add initial log
    addLog('🚀 system initialized', '🚀');
    // mock some gallery items
    for (let i = 0; i < 2; i++) {
      const d = new Date();
      d.setMinutes(d.getMinutes() - i*3);
      const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      // placeholder image
      const card = document.createElement('div');
      card.className = 'file-card';
      const img = document.createElement('img');
      img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23111e31' width='100' height='100'/%3E%3Ctext x='12' y='55' fill='%2391a4bd' font-size='12' font-family='sans'%3Ecapture-${i+1}%3C/text%3E%3C/svg%3E`;
      img.alt = 'placeholder';
      const p = document.createElement('p');
      p.innerText = `capture-${i+1} · ${time}`;
      card.appendChild(img);
      card.appendChild(p);
      galleryGrid?.appendChild(card);
    }
  }

  window.UI = {
    addLog,
    takeSnapshot,
    addGalleryItem,
    clearGallery,
    toggleRecording,
    resetDashboard,
    simulateEvent,
    init: initUI
  };
})();