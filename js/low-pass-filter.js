(function() {
  const W = 200, H = 200;
  const origC = document.getElementById('lpf-orig');
  const filtC = document.getElementById('lpf-filt');
  const origCtx = origC.getContext('2d');
  const filtCtx = filtC.getContext('2d');
  let baseImg = null;

  function generateBase() {
    const img = origCtx.createImageData(W, H);
    const d = img.data;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        let v = Math.round(40 + 160 * (x / W));
        if (x > 60 && x < 135 && y > 45 && y < 150) v = 220;
        const cx = 145, cy = 145, r = 35;
        if ((x-cx)**2 + (y-cy)**2 < r*r) v = 80;
        d[i] = d[i+1] = d[i+2] = v;
        d[i+3] = 255;
      }
    }
    return img;
  }

  function addNoise(base, lvl) {
    const img = origCtx.createImageData(W, H);
    for (let i = 0; i < base.data.length; i += 4) {
      let v = base.data[i] + (Math.random() - 0.5) * lvl;
      v = Math.max(0, Math.min(255, Math.round(v)));
      img.data[i] = img.data[i+1] = img.data[i+2] = v;
      img.data[i+3] = 255;
    }
    return img;
  }

  function boxKernel(s) {
    const v = 1 / (s * s);
    return { kernel: Array(s*s).fill(v), size: s };
  }

  function gaussKernel(s) {
    const sig = s / 3, half = Math.floor(s / 2);
    const k = [];
    let sum = 0;
    for (let y = -half; y <= half; y++) {
      for (let x = -half; x <= half; x++) {
        const v = Math.exp(-(x*x + y*y) / (2 * sig * sig));
        k.push(v); sum += v;
      }
    }
    return { kernel: k.map(v => v / sum), size: s };
  }

  function applyKernel(src, { kernel, size }) {
    const half = Math.floor(size / 2);
    const out = filtCtx.createImageData(W, H);
    const s = src.data, d = out.data;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let acc = 0;
        for (let ky = 0; ky < size; ky++) {
          for (let kx = 0; kx < size; kx++) {
            const py = Math.min(H-1, Math.max(0, y + ky - half));
            const px = Math.min(W-1, Math.max(0, x + kx - half));
            acc += s[(py * W + px) * 4] * kernel[ky * size + kx];
          }
        }
        const di = (y * W + x) * 4;
        const v = Math.round(acc);
        d[di] = d[di+1] = d[di+2] = v;
        d[di+3] = 255;
      }
    }
    return out;
  }

  function renderKernel(kernel, size) {
    const div = document.getElementById('lpf-kdisplay');
    div.style.gridTemplateColumns = `repeat(${size}, 38px)`;
    div.innerHTML = '';
    const maxV = Math.max(...kernel);
    kernel.forEach(v => {
      const cell = document.createElement('div');
      cell.className = 'lpf-kcell';
      cell.textContent = v.toFixed(2);
      const a = 0.2 + 0.8 * (v / maxV);
      cell.style.background = `rgba(201,177,255,${a * 0.3})`;
      cell.style.borderColor = `rgba(201,177,255,${a * 0.5})`;
      div.appendChild(cell);
    });
  }

  function render() {
    const noise = parseInt(document.getElementById('lpf-noise').value);
    const type = document.getElementById('lpf-type').value;
    const size = parseInt(document.getElementById('lpf-ksize').value);
    const noisy = addNoise(baseImg, noise);
    origCtx.putImageData(noisy, 0, 0);
    const k = type === 'gaussian' ? gaussKernel(size) : boxKernel(size);
    renderKernel(k.kernel, k.size);
    filtCtx.putImageData(applyKernel(noisy, k), 0, 0);
  }

  function regen() { baseImg = generateBase(); render(); }

  document.getElementById('lpf-ksize').addEventListener('input', function() {
    document.getElementById('lpf-kval').textContent = this.value + '\u00d7' + this.value;
    render();
  });
  document.getElementById('lpf-noise').addEventListener('input', function() {
    document.getElementById('lpf-nval').textContent = this.value;
    render();
  });
  document.getElementById('lpf-type').addEventListener('change', render);
  document.getElementById('lpf-regen').addEventListener('click', regen);

  regen();
})();
