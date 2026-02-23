(function() {
  var currentStep = 0;

  function sRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }

  function goStep(n) {
    currentStep = n;
    document.querySelectorAll('.sift-section .step-panel').forEach(function(p, i) {
      p.classList.toggle('visible', i === n);
    });
    document.querySelectorAll('.sift-section .pip-step').forEach(function(p, i) {
      p.classList.toggle('active', i <= n);
    });
    document.getElementById('sift-btn-prev').disabled = (n === 0);
    document.getElementById('sift-btn-next').disabled = (n === 3);
    if (n === 0) draw1();
    if (n === 1) draw2();
    if (n === 2) draw3();
    if (n === 3) draw4();
  }

  window.siftGoStep = goStep;
  window.siftNext = function() { if (currentStep < 3) goStep(currentStep + 1); };
  window.siftPrev = function() { if (currentStep > 0) goStep(currentStep - 1); };

  function draw1() {
    var canvas = document.getElementById('sift-c1');
    var ctx = canvas.getContext('2d');
    var W = 860, H = 300;
    ctx.clearRect(0, 0, W, H);

    var colors = ['#3b82f6','#5b7bf6','#7b74f6','#9b6df6','#bb66f6'];
    var dogColors = ['#22d3ee','#60a5fa','#818cf8','#a78bfa'];

    // Gaussian Pyramid
    var gx = 30, gy = 25, gw = 100, gh = 50, gap = 6;
    ctx.fillStyle = '#3b82f620';
    sRoundRect(ctx, gx - 10, gy - 15, gw + 20, (gh + gap) * 5 + 20, 10);
    ctx.fill();
    ctx.strokeStyle = '#3b82f630'; ctx.stroke();

    ctx.fillStyle = '#3b82f6';
    ctx.font = '600 10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Gaussian Pyramid', gx + gw/2, gy - 4);

    for (var i = 0; i < 5; i++) {
      var y = gy + 8 + i * (gh + gap);
      ctx.fillStyle = colors[i] + '20';
      ctx.strokeStyle = colors[i] + '50';
      ctx.lineWidth = 1;
      sRoundRect(ctx, gx, y, gw, gh, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = colors[i];
      ctx.font = '500 9px JetBrains Mono, monospace';
      ctx.fillText('L(\u03c3' + (i+1) + ')', gx + gw/2, y + gh/2 + 3);
      var blurW = 10 + i * 8;
      ctx.fillStyle = colors[i] + '30';
      ctx.beginPath();
      ctx.ellipse(gx + gw - 18, y + gh/2, blurW/2, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff15';
    ctx.font = '20px DM Sans, sans-serif';
    ctx.fillText('\u2192', gx + gw + 15, H/2 + 5);

    // DoG Stack
    var dx = 180, dy = 35, dw = 100, dh = 55;
    ctx.fillStyle = '#22d3ee15';
    sRoundRect(ctx, dx - 10, dy - 15, dw + 20, (dh + gap) * 4 + 20, 10);
    ctx.fill();
    ctx.strokeStyle = '#22d3ee30'; ctx.stroke();

    ctx.fillStyle = '#22d3ee';
    ctx.font = '600 10px JetBrains Mono, monospace';
    ctx.fillText('DoG', dx + dw/2, dy - 4);

    for (var i = 0; i < 4; i++) {
      var y = dy + 8 + i * (dh + gap);
      ctx.fillStyle = dogColors[i] + '15';
      ctx.strokeStyle = dogColors[i] + '40';
      ctx.lineWidth = 1;
      sRoundRect(ctx, dx, y, dw, dh, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = dogColors[i];
      ctx.font = '500 9px JetBrains Mono, monospace';
      ctx.fillText('D' + (i+1), dx + dw/2, y + dh/2 + 3);
      ctx.fillStyle = '#ffffff30';
      ctx.font = '400 8px JetBrains Mono, monospace';
      ctx.fillText('L(\u03c3'+(i+2)+')\u2212L(\u03c3'+(i+1)+')', dx + dw/2, y + dh/2 + 15);
    }

    ctx.fillStyle = '#ffffff15';
    ctx.font = '20px DM Sans, sans-serif';
    ctx.fillText('\u2192', dx + dw + 15, H/2 + 5);

    // 3x3x3 Comparison
    var ex = 360, ey = 60, cellSize = 32;
    var layers3 = [
      { label: 'D\u1d62\u208a\u2081', color: '#60a5fa', yOff: 0,   xOff: -20 },
      { label: 'D\u1d62',           color: '#818cf8', yOff: 75,  xOff: 0   },
      { label: 'D\u1d62\u208b\u2081', color: '#a78bfa', yOff: 150, xOff: 20  }
    ];

    layers3.forEach(function(layer, li) {
      var bx = ex + layer.xOff, by = ey + layer.yOff;
      ctx.fillStyle = layer.color + '08';
      ctx.strokeStyle = layer.color + '20';
      sRoundRect(ctx, bx - 4, by - 4, cellSize * 3 + 8, cellSize * 3 + 8, 6);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = layer.color + '80';
      ctx.font = '500 9px JetBrains Mono, monospace';
      ctx.fillText(layer.label, bx + cellSize * 1.5, by - 8);

      for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 3; c++) {
          var isCenter = (li === 1 && r === 1 && c === 1);
          sRoundRect(ctx, bx + c*cellSize + 2, by + r*cellSize + 2, cellSize - 4, cellSize - 4, 4);
          if (isCenter) {
            ctx.fillStyle = '#fbbf2430'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
          } else {
            ctx.fillStyle = layer.color + '10'; ctx.strokeStyle = layer.color + '30'; ctx.lineWidth = 1;
          }
          ctx.fill(); ctx.stroke();
          if (isCenter) {
            ctx.fillStyle = '#fbbf24'; ctx.font = '700 11px JetBrains Mono, monospace';
            ctx.fillText('?', bx + c*cellSize + cellSize/2, by + r*cellSize + cellSize/2 + 4);
          }
        }
      }
    });

    ctx.fillStyle = '#ffffff15';
    ctx.font = '20px DM Sans, sans-serif';
    ctx.fillText('\u2192', ex + cellSize*3 + 40, H/2 + 5);

    // Result
    var rx = ex + cellSize*3 + 70;
    ctx.fillStyle = '#10b98115';
    sRoundRect(ctx, rx, ey + 40, 180, 140, 10); ctx.fill();
    ctx.strokeStyle = '#10b98130'; ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.font = '600 11px JetBrains Mono, monospace';
    ctx.fillText('Keypoint Candidates', rx + 90, ey + 60);

    var kps = [[30,30],[70,50],[120,70],[50,90],[140,40],[90,100]];
    kps.forEach(function(kp) {
      ctx.beginPath();
      ctx.arc(rx + 20 + kp[0], ey + 65 + kp[1], 5, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf2440'; ctx.fill();
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.stroke();
    });

    ctx.fillStyle = '#5e6380';
    ctx.font = '400 10px DM Sans, sans-serif';
    ctx.fillText('Many points,', rx + 90, ey + 160);
    ctx.fillText('still unfiltered', rx + 90, ey + 173);
    ctx.textAlign = 'start';
  }

  function draw2() {
    var canvas = document.getElementById('sift-c2');
    var ctx = canvas.getContext('2d');
    var W = 860, H = 280;
    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = 'center';

    var pw = 250, ph = 200, pgap = 20;
    var startX = (W - (pw*3 + pgap*2)) / 2;
    var panelTitles = ['Sub-Pixel Interpolation', 'Low-Contrast Filter', 'Edge Elimination'];
    var col = '#f59e0b';

    panelTitles.forEach(function(title, i) {
      var px = startX + i * (pw + pgap), py = 40;
      ctx.fillStyle = col + '08'; ctx.strokeStyle = col + '20';
      sRoundRect(ctx, px, py, pw, ph, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = col; ctx.font = '600 10px JetBrains Mono, monospace';
      ctx.fillText(title, px + pw/2, py + 20);

      if (i === 0) {
        var gx2 = px + 40, gy2 = py + 50;
        for (var r = 0; r < 3; r++) {
          for (var c = 0; c < 3; c++) {
            ctx.beginPath();
            ctx.arc(gx2 + c*40, gy2 + r*40, 6, 0, Math.PI*2);
            ctx.fillStyle = '#ffffff10'; ctx.fill();
            ctx.strokeStyle = '#ffffff30'; ctx.lineWidth = 1; ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(gx2+40, gy2+40, 8, 0, Math.PI*2);
        ctx.fillStyle = '#f59e0b30'; ctx.fill();
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath();
        ctx.arc(gx2+52, gy2+35, 6, 0, Math.PI*2);
        ctx.fillStyle = '#22c55e50'; ctx.fill();
        ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.setLineDash([2,2]);
        ctx.moveTo(gx2+44, gy2+38); ctx.lineTo(gx2+50, gy2+36);
        ctx.strokeStyle = '#22c55e80'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#f59e0b80'; ctx.font = '400 9px JetBrains Mono, monospace';
        ctx.fillText('discrete', gx2+40, gy2+60);
        ctx.fillStyle = '#22c55e80';
        ctx.fillText('interpolated', gx2+70, gy2+26);
        ctx.fillStyle = '#5e6380'; ctx.font = '400 10px DM Sans, sans-serif';
        ctx.fillText('Taylor-Expansion', px+pw/2, py+ph-30);
        ctx.fillText('\u2192 Sub-Pixel Position', px+pw/2, py+ph-15);

      } else if (i === 1) {
        var bx2 = px+30, by2 = py+45;
        var bars = [0.8,0.6,0.15,0.02,0.5,0.08,0.7,0.03];
        var threshold = 0.1;
        var barW2 = (pw-60)/bars.length - 4;
        var threshY = by2 + 120 - threshold*130;
        ctx.beginPath(); ctx.moveTo(bx2, threshY); ctx.lineTo(bx2+pw-60, threshY);
        ctx.strokeStyle = '#ef444480'; ctx.lineWidth = 1.5;
        ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#ef4444'; ctx.font = '400 8px JetBrains Mono, monospace';
        ctx.fillText('threshold', bx2+(pw-60)/2, threshY-6);
        bars.forEach(function(v, j) {
          var x2 = bx2 + j*(barW2+4), bh2 = v*130;
          var rej = v < threshold;
          ctx.fillStyle = rej ? '#ef444430' : '#f59e0b30';
          ctx.strokeStyle = rej ? '#ef4444' : '#f59e0b';
          ctx.lineWidth = 1;
          sRoundRect(ctx, x2, by2+120-bh2, barW2, bh2, 3); ctx.fill(); ctx.stroke();
          if (rej) {
            ctx.fillStyle = '#ef4444'; ctx.font = '700 10px JetBrains Mono, monospace';
            ctx.fillText('\u2717', x2+barW2/2, by2+140);
          }
        });
        ctx.fillStyle = '#5e6380'; ctx.font = '400 10px DM Sans, sans-serif';
        ctx.fillText('Weak responses', px+pw/2, py+ph-15);

      } else {
        var cx2 = px+pw/2, cy2 = py+110;
        ctx.save();
        ctx.beginPath(); ctx.ellipse(cx2-55, cy2, 40, 8, -0.2, 0, Math.PI*2);
        ctx.fillStyle = '#ef444415'; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5;
        ctx.fill(); ctx.stroke(); ctx.restore();
        ctx.fillStyle = '#ef4444'; ctx.font = '400 9px JetBrains Mono, monospace';
        ctx.fillText('Edge \u2717', cx2-55, cy2+25);
        ctx.fillStyle = '#5e6380'; ctx.font = '400 8px DM Sans, sans-serif';
        ctx.fillText('\u03bb\u2081 >> \u03bb\u2082', cx2-55, cy2+38);
        ctx.beginPath(); ctx.ellipse(cx2+55, cy2, 18, 15, 0, 0, Math.PI*2);
        ctx.fillStyle = '#22c55e15'; ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 1.5;
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#22c55e'; ctx.font = '400 9px JetBrains Mono, monospace';
        ctx.fillText('Blob/Corner \u2713', cx2+55, cy2+25);
        ctx.fillStyle = '#5e6380'; ctx.font = '400 8px DM Sans, sans-serif';
        ctx.fillText('\u03bb\u2081 \u2248 \u03bb\u2082', cx2+55, cy2+38);
        ctx.fillStyle = '#5e6380'; ctx.font = '400 10px DM Sans, sans-serif';
        ctx.fillText('Hessian matrix eigenvalues', px+pw/2, py+ph-15);
      }
    });
    ctx.textAlign = 'start';
  }

  function draw3() {
    var canvas = document.getElementById('sift-c3');
    var ctx = canvas.getContext('2d');
    var W = 860, H = 280;
    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = 'center';

    var lx = 80, ly = 140;
    ctx.fillStyle = '#10b98110';
    ctx.beginPath(); ctx.arc(lx+100, ly, 80, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#10b98130'; ctx.stroke();
    ctx.fillStyle = '#10b981'; ctx.font = '600 10px JetBrains Mono, monospace';
    ctx.fillText('Region around keypoint', lx+100, ly-95);
    ctx.beginPath(); ctx.arc(lx+100, ly, 5, 0, Math.PI*2);
    ctx.fillStyle = '#fbbf24'; ctx.fill();

    var arrows3 = [[20,-15,0.3],[40,-30,0.5],[60,10,0.7],[-20,30,0.4],[30,40,0.6],
      [-40,-20,0.3],[-30,45,0.5],[50,-45,0.8],[-55,10,0.4],[15,55,0.3],
      [-10,-50,0.6],[45,25,0.7],[-50,-40,0.2],[60,-20,0.65],[-25,60,0.35]];
    arrows3.forEach(function(arr) {
      var ax = lx+100+arr[0], ay = ly+arr[1], strength = arr[2];
      var angle = Math.atan2(-arr[1], arr[0]) + 0.3;
      var len = 12 * strength;
      ctx.beginPath(); ctx.moveTo(ax, ay);
      ctx.lineTo(ax + Math.cos(angle)*len, ay - Math.sin(angle)*len);
      ctx.strokeStyle = 'rgba(16,185,129,' + (0.3 + strength*0.5) + ')';
      ctx.lineWidth = 1.5; ctx.stroke();
    });

    ctx.fillStyle = '#ffffff15'; ctx.font = '20px DM Sans, sans-serif';
    ctx.fillText('\u2192', lx+210, ly+5);

    // Histogram
    var hx = 330, hy = 40, hw = 200, hh = 180;
    ctx.fillStyle = '#10b98108';
    sRoundRect(ctx, hx, hy, hw, hh, 10); ctx.fill();
    ctx.strokeStyle = '#10b98120'; ctx.stroke();
    ctx.fillStyle = '#10b981'; ctx.font = '600 10px JetBrains Mono, monospace';
    ctx.fillText('36-Bin Histogram', hx+hw/2, hy+18);

    var bins36 = [3,5,4,7,12,18,25,30,28,22,15,10,8,5,3,2,4,6,9,14,20,26,32,35,30,24,16,11,7,4,3,2,2,3,4,5];
    var maxBin = Math.max.apply(null, bins36);
    var barW36 = (hw-20)/36;

    bins36.forEach(function(v, i) {
      var bh = (v/maxBin) * (hh-50);
      var x = hx+10+i*barW36, y = hy+hh-15-bh;
      var isPeak = (i===23);
      ctx.fillStyle = isPeak ? '#fbbf2460' : '#10b98130';
      ctx.strokeStyle = isPeak ? '#fbbf24' : '#10b98160';
      ctx.lineWidth = 0.5;
      ctx.fillRect(x, y, barW36-1, bh); ctx.strokeRect(x, y, barW36-1, bh);
      if (isPeak) {
        ctx.fillStyle = '#fbbf24'; ctx.font = '600 9px JetBrains Mono, monospace';
        ctx.fillText('\u03b8', x+barW36/2, y-8);
        ctx.beginPath(); ctx.moveTo(x+barW36/2, y-4); ctx.lineTo(x+barW36/2, y);
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1; ctx.stroke();
      }
    });

    ctx.fillStyle = '#5e6380'; ctx.font = '400 8px JetBrains Mono, monospace';
    ctx.fillText('0\u00b0', hx+14, hy+hh-4);
    ctx.fillText('360\u00b0', hx+hw-14, hy+hh-4);

    ctx.fillStyle = '#ffffff15'; ctx.font = '20px DM Sans, sans-serif';
    ctx.fillText('\u2192', hx+hw+25, ly+5);

    // Result: keypoint with orientation
    var rx3 = 610, ry3 = 100;
    ctx.fillStyle = '#10b98110';
    ctx.beginPath(); ctx.arc(rx3+80, ry3+40, 55, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#10b98130'; ctx.stroke();
    ctx.beginPath(); ctx.arc(rx3+80, ry3+40, 6, 0, Math.PI*2);
    ctx.fillStyle = '#fbbf24'; ctx.fill();

    var oAngle = -0.7;
    ctx.beginPath();
    ctx.moveTo(rx3+80, ry3+40);
    ctx.lineTo(rx3+80+Math.cos(oAngle)*45, ry3+40+Math.sin(oAngle)*45);
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3; ctx.stroke();
    var tipX = rx3+80+Math.cos(oAngle)*45, tipY = ry3+40+Math.sin(oAngle)*45;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX-Math.cos(oAngle-0.4)*10, tipY-Math.sin(oAngle-0.4)*10);
    ctx.lineTo(tipX-Math.cos(oAngle+0.4)*10, tipY-Math.sin(oAngle+0.4)*10);
    ctx.fillStyle = '#fbbf24'; ctx.fill();
    ctx.fillStyle = '#fbbf24'; ctx.font = '600 11px JetBrains Mono, monospace';
    ctx.fillText('\u03b8 = dominant', rx3+80, ry3+115);
    ctx.fillText('orientation', rx3+80, ry3+130);
    ctx.fillStyle = '#5e6380'; ctx.font = '400 10px DM Sans, sans-serif';
    ctx.fillText('(x, y, \u03c3, \u03b8)', rx3+80, ry3+150);
    ctx.textAlign = 'start';
  }

  function draw4() {
    var canvas = document.getElementById('sift-c4');
    var ctx = canvas.getContext('2d');
    var W = 860, H = 320;
    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = 'center';

    var lx4 = 30, ly4 = 30, regionSize = 160;
    ctx.save();
    ctx.translate(lx4+regionSize/2+20, ly4+regionSize/2+20);
    ctx.rotate(-0.5);
    ctx.fillStyle = '#ec489910'; ctx.strokeStyle = '#ec489930'; ctx.lineWidth = 1;
    ctx.fillRect(-regionSize/2, -regionSize/2, regionSize, regionSize);
    ctx.strokeRect(-regionSize/2, -regionSize/2, regionSize, regionSize);

    var cellSize4 = regionSize/4;
    ctx.strokeStyle = '#ec489920';
    for (var k = 1; k < 4; k++) {
      ctx.beginPath();
      ctx.moveTo(-regionSize/2+k*cellSize4, -regionSize/2);
      ctx.lineTo(-regionSize/2+k*cellSize4, regionSize/2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-regionSize/2, -regionSize/2+k*cellSize4);
      ctx.lineTo(regionSize/2, -regionSize/2+k*cellSize4);
      ctx.stroke();
    }
    for (var r4 = 0; r4 < 4; r4++) {
      for (var c4 = 0; c4 < 4; c4++) {
        var cx4 = -regionSize/2+c4*cellSize4+cellSize4/2;
        var cy4 = -regionSize/2+r4*cellSize4+cellSize4/2;
        var angle4 = (r4*4+c4) * 0.7;
        var len4 = 10;
        ctx.beginPath(); ctx.moveTo(cx4, cy4);
        ctx.lineTo(cx4+Math.cos(angle4)*len4, cy4+Math.sin(angle4)*len4);
        ctx.strokeStyle = '#ec489960'; ctx.lineWidth = 1.5; ctx.stroke();
      }
    }
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(regionSize/2+15, 0);
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(regionSize/2+15, -4); ctx.lineTo(regionSize/2+22, 0); ctx.lineTo(regionSize/2+15, 4);
    ctx.fill();
    ctx.restore();

    ctx.beginPath(); ctx.arc(lx4+regionSize/2+20, ly4+regionSize/2+20, 4, 0, Math.PI*2);
    ctx.fillStyle = '#fbbf24'; ctx.fill();
    ctx.fillStyle = '#ec4899'; ctx.font = '600 10px JetBrains Mono, monospace';
    ctx.fillText('16\u00d716 Region', lx4+regionSize/2+20, ly4+regionSize+55);
    ctx.fillStyle = '#5e6380'; ctx.font = '400 9px DM Sans, sans-serif';
    ctx.fillText('aligned to \u03b8', lx4+regionSize/2+20, ly4+regionSize+70);

    ctx.fillStyle = '#ffffff15'; ctx.font = '20px DM Sans, sans-serif';
    ctx.fillText('\u2192', lx4+regionSize+55, H/2);

    // 4x4 Subregions
    var mx4 = 290, my4 = 30, subSize = 52, subGap = 4;
    ctx.fillStyle = '#ec4899'; ctx.font = '600 10px JetBrains Mono, monospace';
    ctx.fillText('4\u00d74 Subregions', mx4+(subSize*4+subGap*3)/2, my4);

    for (var r5 = 0; r5 < 4; r5++) {
      for (var c5 = 0; c5 < 4; c5++) {
        var sx = mx4+c5*(subSize+subGap), sy = my4+12+r5*(subSize+subGap);
        ctx.fillStyle = '#ec489910'; ctx.strokeStyle = '#ec489925'; ctx.lineWidth = 1;
        sRoundRect(ctx, sx, sy, subSize, subSize, 4); ctx.fill(); ctx.stroke();
        var bins8 = [0.3,0.7,0.5,0.9,0.4,0.6,0.8,0.2];
        var maxB = 0.9;
        var bw8 = (subSize-8)/8;
        bins8.forEach(function(v, j) {
          var bh8 = (v/maxB)*(subSize-16);
          ctx.fillStyle = 'hsl(' + (330+j*5) + ',70%,' + (40+v*30) + '%)';
          ctx.fillRect(sx+4+j*bw8, sy+subSize-4-bh8, bw8-1, bh8);
        });
      }
    }
    ctx.fillStyle = '#5e6380'; ctx.font = '400 9px DM Sans, sans-serif';
    ctx.fillText('8-bin histogram each', mx4+(subSize*4+subGap*3)/2, my4+(subSize+subGap)*4+22);

    ctx.fillStyle = '#ffffff15'; ctx.font = '20px DM Sans, sans-serif';
    ctx.fillText('\u2192', mx4+(subSize+subGap)*4+15, H/2);

    // 128-dim Vector
    var vx4 = 640, vy4 = 40, vw4 = 190, vh4 = 220;
    ctx.fillStyle = '#ec489908';
    sRoundRect(ctx, vx4, vy4, vw4, vh4, 10); ctx.fill();
    ctx.strokeStyle = '#ec489920'; ctx.stroke();
    ctx.fillStyle = '#ec4899'; ctx.font = '600 11px JetBrains Mono, monospace';
    ctx.fillText('128-dim Vector', vx4+vw4/2, vy4+22);
    ctx.fillStyle = '#5e6380'; ctx.font = '400 9px JetBrains Mono, monospace';
    ctx.fillText('16 \u00d7 8 = 128', vx4+vw4/2, vy4+40);

    var vecBars = 64, vBarW = (vw4-30)/vecBars;
    var fixedVals = [0.4,0.7,0.3,0.9,0.5,0.6,0.2,0.8,0.4,0.7,0.3,0.9,0.5,0.6,0.2,0.8,
      0.4,0.7,0.3,0.9,0.5,0.6,0.2,0.8,0.4,0.7,0.3,0.9,0.5,0.6,0.2,0.8,
      0.6,0.4,0.8,0.3,0.7,0.5,0.9,0.2,0.6,0.4,0.8,0.3,0.7,0.5,0.9,0.2,
      0.5,0.3,0.7,0.4,0.8,0.6,0.2,0.9,0.5,0.3,0.7,0.4,0.8,0.6,0.2,0.9];
    for (var vi = 0; vi < vecBars; vi++) {
      var v2 = fixedVals[vi], bh9 = v2*80;
      var hue2 = 330 + (vi/vecBars)*40;
      ctx.fillStyle = 'hsla('+hue2+',70%,55%,' + (0.3+v2*0.4) + ')';
      ctx.fillRect(vx4+15+vi*vBarW, vy4+140-bh9, vBarW-0.5, bh9);
    }
    ctx.fillStyle = '#5e6380'; ctx.font = '400 8px JetBrains Mono, monospace';
    ctx.fillText('... (128 values) ...', vx4+vw4/2, vy4+155);
    ctx.fillStyle = '#22c55e80'; ctx.font = '500 10px JetBrains Mono, monospace';
    ctx.fillText('normalised', vx4+vw4/2, vy4+180);
    ctx.fillStyle = '#5e6380'; ctx.font = '400 9px DM Sans, sans-serif';
    ctx.fillText('\u2192 illumination invariant', vx4+vw4/2, vy4+196);
    ctx.fillStyle = '#fbbf24'; ctx.font = '600 10px JetBrains Mono, monospace';
    ctx.fillText('= Feature Fingerprint', vx4+vw4/2, vy4+vh4-8);
    ctx.textAlign = 'start';
  }

  draw1();
})();
