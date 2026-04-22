// Wallstreet1929 random hiccup logic
// This script adds random ±100 variations to each investment per turn

(function() {
  // Save original renderTurn
  const origRenderTurn = window.renderTurn;
  if (!origRenderTurn) return;

  // Helper to get random hiccup value (0 or ±100)
  function randomHiccup() {
    const r = Math.random();
    if (r < 0.33) return 100;
    if (r < 0.66) return -100;
    return 0;
  }

  // Patch renderTurn
  window.renderTurn = function(idx) {
    // Clone the DATA object for this turn
    const d = { ...DATA[idx], p: { ...DATA[idx].p } };
    // Only apply hiccups after the first turn
    if (idx > 0 && idx < DATA.length) {
      // Add random hiccup to each investment
      ['a', 'b', 'c'].forEach(k => {
        d.p[k] += randomHiccup();
        // Prevent negative prices
        if (d.p[k] < 0) d.p[k] = 0;
      });
    }
    // Use the modified data for this turn
    // Push to hist for correct history
    hist.push({ ...d.p });
    // Call the original renderTurn logic, but with our modified data
    // Temporarily override DATA[idx]
    const orig = DATA[idx];
    DATA[idx] = d;
    origRenderTurn.call(this, idx);
    DATA[idx] = orig;
  };
})();
