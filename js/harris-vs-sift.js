(function() {
  function getCtx(id) {
    const c = document.getElementById(id);
    return c.getContext('2d');
  }

  function drawBuilding(ctx, x, y, w, h, color) {
    color = color || '#4a5568';
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#718096';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);
    const winW = w * 0.18, winH = h * 0.15;
    ctx.fillStyle = '#a0aec0';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        ctx.fillRect(x + w*0.15 + c * w*0.45, y + h*0.12 + r * h*0.28, winW, winH);
      }
    }
  }

  function drawCornerMarker(ctx, x, y, color, size) {
    color = color || '#f59e0b'; size = size || 8;
    ctx.beginPath();
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.lineTo(x - size, y + size);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBlobMarker(ctx, x, y, r, color) {
    color = color || '#6366f1';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = color + '30';
    ctx.fill();
  }

  function drawBlob(ctx, x, y, r, color) {
    color = color || '#2d3748';
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, '#13151d');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGround(ctx, w, h) {
    ctx.fillStyle = '#13151d';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1e2130';
    ctx.fillRect(0, h * 0.75, w, h * 0.25);
  }

  function drawMatchLine(ctx, x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Scenario 1: Basic Detection
  (function() {
    let ctx = getCtx('s1-harris');
    drawGround(ctx, 380, 260);
    drawBuilding(ctx, 80, 60, 120, 140);
    drawBlob(ctx, 300, 120, 30, '#4a5568');
    drawCornerMarker(ctx, 80, 60);
    drawCornerMarker(ctx, 200, 60);
    drawCornerMarker(ctx, 80, 200);
    drawCornerMarker(ctx, 200, 200);
    drawCornerMarker(ctx, 98, 77, '#f59e0b', 5);
    drawCornerMarker(ctx, 152, 77, '#f59e0b', 5);
    ctx.fillStyle = '#ef444480';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillText('\u2717 ignored', 280, 165);

    ctx = getCtx('s1-sift');
    drawGround(ctx, 380, 260);
    drawBuilding(ctx, 80, 60, 120, 140);
    drawBlob(ctx, 300, 120, 30, '#4a5568');
    drawBlobMarker(ctx, 80, 60, 10);
    drawBlobMarker(ctx, 200, 60, 10);
    drawBlobMarker(ctx, 80, 200, 10);
    drawBlobMarker(ctx, 200, 200, 10);
    drawBlobMarker(ctx, 98, 77, 7);
    drawBlobMarker(ctx, 152, 77, 7);
    drawBlobMarker(ctx, 300, 120, 30, '#22c55e');
    ctx.fillStyle = '#22c55e';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillText('\u2713 detected', 283, 165);
  })();

  // Scenario 2: Scale Change
  (function() {
    let ctx = getCtx('s2-harris');
    drawGround(ctx, 380, 260);
    drawBuilding(ctx, 30, 100, 60, 70, '#3d4557');
    drawCornerMarker(ctx, 30, 100, '#f59e0b', 6);
    drawCornerMarker(ctx, 90, 100, '#f59e0b', 6);
    ctx.fillStyle = '#f59e0b';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('\u03c3 fits', 35, 92);
    drawBuilding(ctx, 200, 20, 170, 220, '#3d4557');
    drawCornerMarker(ctx, 260, 75, '#ef4444', 6);
    drawCornerMarker(ctx, 320, 75, '#ef4444', 6);
    drawCornerMarker(ctx, 260, 135, '#ef4444', 6);
    ctx.fillStyle = '#ef4444';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('different features!', 230, 15);
    ctx.fillText('\u03c3 too small', 230, 250);

    ctx = getCtx('s2-sift');
    drawGround(ctx, 380, 260);
    drawBuilding(ctx, 30, 100, 60, 70, '#3d4557');
    drawBlobMarker(ctx, 30, 100, 8);
    drawBlobMarker(ctx, 90, 100, 8);
    ctx.fillStyle = '#6366f1';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('\u03c3\u2081', 55, 92);
    drawBuilding(ctx, 200, 20, 170, 220, '#3d4557');
    drawBlobMarker(ctx, 200, 20, 14);
    drawBlobMarker(ctx, 370, 20, 14);
    ctx.fillStyle = '#6366f1';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('\u03c3\u2082 (larger)', 240, 15);
    drawMatchLine(ctx, 30, 100, 200, 20, '#22c55e80');
    drawMatchLine(ctx, 90, 100, 370, 20, '#22c55e80');
    ctx.fillStyle = '#22c55e';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillText('\u2713 matched!', 120, 55);
  })();

  // Scenario 3: Rotation
  (function() {
    const cx = 290, cy = 130, a = 30 * Math.PI / 180, s = 40;
    const corners = [[-s,-s],[s,-s],[s,s],[-s,s]];

    let ctx = getCtx('s3-harris');
    drawGround(ctx, 380, 260);
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(40, 80, 80, 80);
    ctx.strokeStyle = '#718096';
    ctx.strokeRect(40, 80, 80, 80);
    drawCornerMarker(ctx, 40, 80, '#f59e0b', 6);
    drawCornerMarker(ctx, 120, 80, '#f59e0b', 6);
    drawCornerMarker(ctx, 40, 160, '#f59e0b', 6);
    drawCornerMarker(ctx, 120, 160, '#f59e0b', 6);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(-s, -s, s*2, s*2);
    ctx.strokeStyle = '#718096';
    ctx.strokeRect(-s, -s, s*2, s*2);
    ctx.restore();
    corners.forEach(function(p) {
      const rx = cx + p[0]*Math.cos(a) - p[1]*Math.sin(a);
      const ry = cy + p[0]*Math.sin(a) + p[1]*Math.cos(a);
      drawCornerMarker(ctx, rx, ry, '#f59e0b', 6);
    });
    drawMatchLine(ctx, 120, 80,
      corners[1][0]*Math.cos(a)-corners[1][1]*Math.sin(a)+cx,
      corners[1][0]*Math.sin(a)+corners[1][1]*Math.cos(a)+cy, '#22c55e60');

    ctx = getCtx('s3-sift');
    drawGround(ctx, 380, 260);
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(40, 80, 80, 80);
    ctx.strokeStyle = '#718096';
    ctx.strokeRect(40, 80, 80, 80);
    drawBlobMarker(ctx, 40, 80, 8);
    drawBlobMarker(ctx, 120, 80, 8);
    drawBlobMarker(ctx, 40, 160, 8);
    drawBlobMarker(ctx, 120, 160, 8);
    ctx.beginPath();
    ctx.moveTo(80, 120);
    ctx.lineTo(120, 120);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(120, 115);
    ctx.lineTo(128, 120);
    ctx.lineTo(120, 125);
    ctx.fill();
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillText('\u03b8=0\u00b0', 85, 112);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(-s, -s, s*2, s*2);
    ctx.strokeStyle = '#718096';
    ctx.strokeRect(-s, -s, s*2, s*2);
    ctx.restore();
    corners.forEach(function(p) {
      const rx = cx + p[0]*Math.cos(a) - p[1]*Math.sin(a);
      const ry = cy + p[0]*Math.sin(a) + p[1]*Math.cos(a);
      drawBlobMarker(ctx, rx, ry, 8);
    });
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 40*Math.cos(a), cy + 40*Math.sin(a));
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#22c55e';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillText('\u03b8=30\u00b0', 300, 115);
    drawMatchLine(ctx, 120, 80,
      corners[1][0]*Math.cos(a)-corners[1][1]*Math.sin(a)+cx,
      corners[1][0]*Math.sin(a)+corners[1][1]*Math.cos(a)+cy, '#22c55e60');
  })();

  // Scenario 4: Illumination Change
  (function() {
    let ctx = getCtx('s4-harris');
    drawGround(ctx, 380, 260);
    drawBuilding(ctx, 30, 80, 80, 100, '#4a5568');
    drawCornerMarker(ctx, 30, 80, '#f59e0b', 6);
    drawCornerMarker(ctx, 110, 80, '#f59e0b', 6);
    drawCornerMarker(ctx, 30, 180, '#f59e0b', 6);
    drawCornerMarker(ctx, 110, 180, '#f59e0b', 6);
    drawBuilding(ctx, 220, 80, 80, 100, '#1a1e2a');
    drawCornerMarker(ctx, 220, 80, '#f59e0b', 6);
    drawCornerMarker(ctx, 300, 80, '#f59e0b', 6);
    ctx.fillStyle = '#ef444480';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('\u2717', 216, 190);
    ctx.fillText('\u2717', 296, 190);
    ctx.fillText('below threshold', 225, 210);
    ctx.fillStyle = '#8b8fa3';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('dark', 240, 72);

    ctx = getCtx('s4-sift');
    drawGround(ctx, 380, 260);
    drawBuilding(ctx, 30, 80, 80, 100, '#4a5568');
    drawBlobMarker(ctx, 30, 80, 8);
    drawBlobMarker(ctx, 110, 80, 8);
    drawBlobMarker(ctx, 30, 180, 8);
    drawBlobMarker(ctx, 110, 180, 8);
    drawBuilding(ctx, 220, 80, 80, 100, '#1a1e2a');
    drawBlobMarker(ctx, 220, 80, 8);
    drawBlobMarker(ctx, 300, 80, 8);
    drawBlobMarker(ctx, 220, 180, 8);
    drawBlobMarker(ctx, 300, 180, 8);
    ctx.fillStyle = '#8b8fa3';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('dark', 240, 72);
    drawMatchLine(ctx, 110, 80, 220, 80, '#22c55e60');
    drawMatchLine(ctx, 110, 180, 220, 180, '#22c55e60');
    drawMatchLine(ctx, 30, 80, 300, 80, '#22c55e40');
    ctx.fillStyle = '#22c55e';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('normalised \u2192 \u2713', 140, 140);
  })();
})();
