// app.js – main entry, orchestrates all modules
(function() {
  'use strict';

  // wait for DOM and modules
  document.addEventListener('DOMContentLoaded', function() {
    // init camera
    if (window.Camera) {
      window.Camera.init();
    } else {
      console.warn('Camera module not loaded');
    }

    // init UI
    if (window.UI) {
      window.UI.init();
    } else {
      console.warn('UI module not loaded');
    }

    // start AI engine
    if (window.AI) {
      window.AI.start(1500);
      // add event log periodically
      setInterval(() => {
        if (window.DataManager) {
          const evt = window.DataManager.generateEvent();
          if (window.UI) window.UI.addLog(evt, '📡');
        }
        // update metrics from AI
        if (window.DataManager) {
          const veh = Math.floor(180 + Math.random() * 140);
          const ped = Math.floor(20 + Math.random() * 40);
          const spd = Math.floor(30 + Math.random() * 30);
          const cong = Math.floor(45 + Math.random() * 45);
          window.DataManager.updateMetrics({
            vehicles: veh,
            pedestrians: ped,
            avgSpeed: spd,
            congestion: cong,
            incidents: Math.floor(Math.random() * 3),
            flow: cong < 55 ? 'low' : cong < 75 ? 'moderate' : 'high',
            density: Math.random() < 0.3 ? 'low' : Math.random() < 0.7 ? 'medium' : 'high'
          });
        }
      }, 4000);
    } else {
      console.warn('AI module not loaded');
    }

    // resize camera canvas after a small delay
    setTimeout(() => {
      if (window.Camera) window.Camera.resize();
    }, 500);
  });
})();