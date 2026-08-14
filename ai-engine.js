// ai-engine.js – AI detection simulation with advanced graphics
(function() {
  'use strict';

  const objectClasses = [
    { label: 'Sedan', icon: 'fa-car', color: '#31a8ff' },
    { label: 'SUV', icon: 'fa-car', color: '#4fc3f7' },
    { label: 'Truck', icon: 'fa-truck', color: '#ffc857' },
    { label: 'Motorcycle', icon: 'fa-motorcycle', color: '#ff5571' },
    { label: 'Pedestrian', icon: 'fa-person-walking', color: '#27d17f' },
    { label: 'Bus', icon: 'fa-bus', color: '#ffa726' },
    { label: 'Bicycle', icon: 'fa-bicycle', color: '#ab47bc' }
  ];

  let detections = [];
  let intervalId = null;
  let isRunning = true;

  // generate random detection list
  function generateDetections() {
    const count = 3 + Math.floor(Math.random() * 5);
    const newDetections = [];
    for (let i = 0; i < count; i++) {
      const cls = objectClasses[Math.floor(Math.random() * objectClasses.length)];
      newDetections.push({
        label: cls.label,
        color: cls.color,
        confidence: 0.75 + Math.random() * 0.24,
        x: 0.1 + Math.random() * 0.8,
        y: 0.1 + Math.random() * 0.7,
        w: 0.08 + Math.random() * 0.2,
        h: 0.08 + Math.random() * 0.25
      });
    }
    return newDetections;
  }

  function updateDetectionList() {
    detections = generateDetections();
    const list = document.getElementById('scanResults');
    const empty = document.getElementById('emptyDetection');
    if (!list) return;

    if (detections.length === 0) {
      list.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    list.innerHTML = detections.map(d => 
      `<li><span><i class="fas ${d.icon || 'fa-circle'}" style="color:${d.color};"></i> ${d.label}</span><span>${Math.round(d.confidence*100)}%</span></li>`
    ).join('');
  }

  // start AI loop
  function startAI(interval = 1200) {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      if (!isRunning) return;
      updateDetectionList();
      // push to camera overlay
      if (window.Camera) {
        window.Camera.drawOverlay(detections);
      }
      // update metrics randomly
      updateMetrics();
    }, interval);
    // initial run
    updateDetectionList();
  }

  function stopAI() {
    isRunning = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function updateMetrics() {
    const veh = document.getElementById('vehicleCount');
    const ped = document.getElementById('pedestrianCount');
    const speed = document.getElementById('avgSpeed');
    const cong = document.getElementById('congestionLevel');
    const flow = document.getElementById('flowLabel');
    const density = document.getElementById('densityLabel');
    const incident = document.getElementById('incidentCount');

    if (veh) veh.innerText = Math.floor(180 + Math.random() * 140);
    if (ped) ped.innerText = Math.floor(20 + Math.random() * 40);
    if (speed) speed.innerText = Math.floor(30 + Math.random() * 30);
    const c = Math.floor(45 + Math.random() * 45);
    if (cong) cong.innerText = c + '%';
    if (flow) {
      if (c < 55) flow.innerText = 'low';
      else if (c < 75) flow.innerText = 'moderate';
      else flow.innerText = 'high';
      flow.className = c < 55 ? 'low' : c < 75 ? 'medium' : 'high';
    }
    if (density) {
      const d = Math.random();
      density.innerText = d < 0.3 ? 'low' : d < 0.7 ? 'medium' : 'high';
    }
    if (incident) incident.innerText = Math.floor(Math.random() * 3);
  }

  // expose AI engine
  window.AI = {
    start: startAI,
    stop: stopAI,
    getDetections: () => detections,
    generate: generateDetections,
    updateList: updateDetectionList
  };
})();