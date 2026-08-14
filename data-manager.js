// data-manager.js – state management, metrics aggregation
(function() {
  'use strict';

  const state = {
    vehicles: 247,
    pedestrians: 38,
    avgSpeed: 42,
    congestion: 72,
    incidents: 0,
    flow: 'moderate',
    density: 'high'
  };

  // update metrics from AI or external
  function updateMetrics(metrics) {
    if (!metrics) return;
    if (metrics.vehicles !== undefined) state.vehicles = metrics.vehicles;
    if (metrics.pedestrians !== undefined) state.pedestrians = metrics.pedestrians;
    if (metrics.avgSpeed !== undefined) state.avgSpeed = metrics.avgSpeed;
    if (metrics.congestion !== undefined) state.congestion = metrics.congestion;
    if (metrics.incidents !== undefined) state.incidents = metrics.incidents;
    if (metrics.flow) state.flow = metrics.flow;
    if (metrics.density) state.density = metrics.density;

    // update DOM
    const domMap = {
      vehicleCount: state.vehicles,
      pedestrianCount: state.pedestrians,
      avgSpeed: state.avgSpeed,
      congestionLevel: state.congestion + '%',
      incidentCount: state.incidents,
      flowLabel: state.flow,
      densityLabel: state.density
    };
    Object.keys(domMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = domMap[id];
    });
    // flow class
    const flowEl = document.getElementById('flowLabel');
    if (flowEl) {
      const c = state.congestion;
      flowEl.className = c < 55 ? 'low' : c < 75 ? 'medium' : 'high';
    }
  }

  // get state snapshot
  function getState() {
    return { ...state };
  }

  // generate random event log entry (called by AI)
  function generateEvent() {
    const events = [
      '🚦 signal phase changed',
      '🚗 vehicle detected · plate XYZ-123',
      '🚶 pedestrian crossing',
      '⚠️ congestion alert · 87%',
      '📡 AI model updated',
      '🚨 emergency vehicle priority',
      '🌧️ rain detected'
    ];
    return events[Math.floor(Math.random() * events.length)];
  }

  // expose data manager
  window.DataManager = {
    updateMetrics,
    getState,
    generateEvent
  };
})();