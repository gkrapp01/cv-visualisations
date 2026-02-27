(function () {
  var steps = [
    {
      title: '0 · Input',
      render: function () {
        return [
          '<div class="sa-card">',
          '  <h2>Image is split into patches</h2>',
          '  <div class="sa-desc">',
          '    An image (N×N) is divided into <strong>n = N²/P²</strong> patches.',
          '    Each patch is projected into a <strong>vector of dimension d</strong> via a learned linear layer.',
          '    Here n = 4 patches and d = 3 for illustration.',
          '  </div>',
          '  <div class="sa-analogy">Think of cutting a photo into puzzle pieces. Each piece is described as a list of numbers — that\'s the vector.</div>',
          '  <div class="sa-visual">',
          '    <div class="sa-patches-row">',
          '      <div class="sa-patch-box">P1</div>',
          '      <div class="sa-patch-box">P2</div>',
          '      <div class="sa-patch-box">P3</div>',
          '      <div class="sa-patch-box">P4</div>',
          '    </div>',
          '    <div class="sa-arrow">↓</div>',
          '    <div class="sa-matrix-row">',
          saVec('x₁', [0.3, 0.7, 0.1], 'sa-input-color'),
          saVec('x₂', [0.9, 0.2, 0.5], 'sa-input-color'),
          saVec('x₃', [0.1, 0.8, 0.4], 'sa-input-color'),
          saVec('x₄', [0.6, 0.3, 0.9], 'sa-input-color'),
          '    </div>',
          '  </div>',
          '</div>',
        ].join('');
      },
    },
    {
      title: '1 · Q, K, V',
      render: function () {
        return [
          '<div class="sa-card">',
          '  <h2>Step 1: Each vector is projected into Q, K, and V</h2>',
          '  <div class="sa-desc">',
          '    Each patch vector <strong>xᵢ</strong> is multiplied by three different weight matrices to produce three new vectors:<br><br>',
          '    <strong class="sa-q">Q (Query)</strong> — "What am I looking for?"<br>',
          '    <strong class="sa-k">K (Key)</strong> — "What do I offer?"<br>',
          '    <strong class="sa-v">V (Value)</strong> — "What information do I carry?"',
          '  </div>',
          '  <div class="sa-analogy">At a conference: your <b>Query</b> is your question — "Who knows computer vision?". Your <b>Key</b> is your name badge — "ViT expert". Your <b>Value</b> is the knowledge you share when someone engages with you.</div>',
          '  <div class="sa-visual">',
          '    <div class="sa-flow">',
          '      <div class="sa-flow-box sa-input-box">x₁<span class="sa-dim">(d)</span></div>',
          '      <div class="sa-arrow">→</div>',
          '      <div style="display:flex;flex-direction:column;gap:0.4rem">',
          '        <div class="sa-flow-box sa-q-box">Q₁ = x₁ · W_Q<span class="sa-dim">(d)</span></div>',
          '        <div class="sa-flow-box sa-k-box">K₁ = x₁ · W_K<span class="sa-dim">(d)</span></div>',
          '        <div class="sa-flow-box sa-v-box">V₁ = x₁ · W_V<span class="sa-dim">(d)</span></div>',
          '      </div>',
          '    </div>',
          '    <div class="sa-matrix-row" style="margin-top:1rem">',
          saVec('Q₁', [0.5, 0.2, 0.8], 'sa-q-color'),
          saVec('Q₂', [0.1, 0.9, 0.3], 'sa-q-color'),
          saVec('Q₃', [0.7, 0.4, 0.6], 'sa-q-color'),
          saVec('Q₄', [0.3, 0.6, 0.1], 'sa-q-color'),
          '    </div>',
          '    <div class="sa-complexity">',
          '      <strong>Cost:</strong> 3 matrix multiplications (W_Q, W_K, W_V), each for n vectors of dimension d → <span class="sa-formula">O(n · d²)</span>',
          '      <div class="sa-dim-note">Each W matrix is d×d, applied to n vectors.</div>',
          '    </div>',
          '  </div>',
          '</div>',
        ].join('');
      },
    },
    {
      title: '2 · Attention Scores',
      render: function () {
        var bars = [
          { l: 'P1↔P1', v: '0.85', h: 72 },
          { l: 'P1↔P2', v: '0.30', h: 25 },
          { l: 'P1↔P3', v: '0.72', h: 61 },
          { l: 'P1↔P4', v: '0.15', h: 13 },
        ];
        var barsHtml = bars
          .map(function (b) {
            return [
              '<div class="sa-bar-item">',
              '  <div class="sa-bar-value">' + b.v + '</div>',
              '  <div class="sa-bar" style="height:' + b.h + 'px"></div>',
              '  <div class="sa-bar-label">' + b.l + '</div>',
              '</div>',
            ].join('');
          })
          .join('');
        return [
          '<div class="sa-card">',
          '  <h2>Step 2: How relevant is each patch to me?</h2>',
          '  <div class="sa-desc">',
          '    For every Query Qᵢ we compute the <strong>dot product</strong> with all Keys Kⱼ.',
          '    This gives a score: how well does Key j match Query i?<br><br>',
          '    <strong class="sa-score">Score(i,j) = Qᵢ · Kⱼᵀ / √d</strong><br><br>',
          '    The <strong>/ √d</strong> prevents values from exploding (numerical stability).',
          '  </div>',
          '  <div class="sa-analogy">Back at the conference: you broadcast your question to the room and compare it with each person\'s name badge. The better the match, the higher the score.</div>',
          '  <div class="sa-visual">',
          '    <div style="text-align:center;margin-bottom:0.8rem;font-family:\'JetBrains Mono\',monospace;font-size:0.85rem">',
          '      <span class="sa-q">Q₁</span>',
          '      <span style="color:#5e6380;margin:0 0.3rem">·</span>',
          '      <span class="sa-k">[ K₁, K₂, K₃, K₄ ]ᵀ</span>',
          '      <span style="color:#5e6380;margin:0 0.3rem">→</span>',
          '      <span class="sa-score">Scores for patch 1</span>',
          '    </div>',
          '    <div class="sa-score-bars">' + barsHtml + '</div>',
          '    <div style="text-align:center;margin-top:0.8rem;font-size:0.82rem;color:#5e6380">',
          '      → Apply <strong>Softmax</strong> so all scores sum to 1 (= attention weights)',
          '    </div>',
          '    <div class="sa-complexity">',
          '      <strong>Cost:</strong> Q·Kᵀ is a matrix multiply of (n×d) · (d×n) → <span class="sa-formula">O(n² · d)</span>',
          '      <div class="sa-dim-note">Often the most expensive step — every patch must be compared to every other patch.</div>',
          '    </div>',
          '  </div>',
          '</div>',
        ].join('');
      },
    },
    {
      title: '3 · Weighted Sum',
      render: function () {
        var weights = [0.45, 0.1, 0.35, 0.1];
        var weightsHtml = weights
          .map(function (w) {
            return (
              '<div class="sa-weight-cell" style="opacity:' +
              (0.35 + w) +
              '">' +
              w +
              '</div>'
            );
          })
          .join('');
        return [
          '<div class="sa-card">',
          '  <h2>Step 3: Aggregate values using attention weights</h2>',
          '  <div class="sa-desc">',
          '    The softmax scores are used as <strong>weights</strong> to compute a weighted sum of the Values V.',
          '    Patches with a higher score contribute more to the output.',
          '  </div>',
          '  <div class="sa-analogy">You\'ve decided who to listen to most. The person with the highest score shares the most information with you; others contribute proportionally less.</div>',
          '  <div class="sa-visual">',
          '    <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;justify-content:center">',
          '      <div>',
          '        <div style="text-align:center;font-family:\'JetBrains Mono\',monospace;font-size:0.72rem;color:#facc15;margin-bottom:4px">Weights</div>',
          '        <div style="display:flex;gap:4px">' + weightsHtml + '</div>',
          '      </div>',
          '      <div class="sa-op-symbol">×</div>',
          '      <div class="sa-matrix-row">',
          saVec('V₁', [0.4, 0.1, 0.7], 'sa-v-color'),
          saVec('V₂', [0.2, 0.8, 0.3], 'sa-v-color'),
          saVec('V₃', [0.9, 0.5, 0.1], 'sa-v-color'),
          saVec('V₄', [0.1, 0.3, 0.6], 'sa-v-color'),
          '      </div>',
          '    </div>',
          '    <div class="sa-arrow" style="margin:0.8rem 0">↓</div>',
          '    <div class="sa-matrix-row">',
          '      <div class="sa-vec sa-out-color sa-highlight">',
          '        <div class="sa-vec-label">out₁</div>',
          '        <div class="sa-vec-cell">0.52</div>',
          '        <div class="sa-vec-cell">0.32</div>',
          '        <div class="sa-vec-cell">0.42</div>',
          '      </div>',
          '    </div>',
          '    <div style="text-align:center;margin-top:0.5rem;font-size:0.8rem;color:#5e6380;font-family:\'JetBrains Mono\',monospace">',
          '      out₁ = 0.45·V₁ + 0.10·V₂ + 0.35·V₃ + 0.10·V₄',
          '    </div>',
          '    <div class="sa-complexity">',
          '      <strong>Cost:</strong> Scores matrix (n×n) · V (n×d) → <span class="sa-formula">O(n² · d)</span>',
          '    </div>',
          '  </div>',
          '</div>',
        ].join('');
      },
    },
    {
      title: '4 · Total Complexity',
      render: function () {
        return [
          '<div class="sa-card">',
          '  <h2>Summary: Total complexity of one attention layer</h2>',
          '  <div class="sa-desc">Three main steps and their computational costs:</div>',
          '  <div class="sa-visual">',
          '    <div style="display:flex;flex-direction:column;gap:0.8rem;width:100%">',
          '      <div class="sa-cost-row sa-cost-q">',
          '        <span>① Generate Q, K, V</span>',
          '        <span class="sa-formula sa-q">O(n · d²)</span>',
          '      </div>',
          '      <div class="sa-cost-row sa-cost-score">',
          '        <span>② Q · Kᵀ &nbsp;(Scores)</span>',
          '        <span class="sa-formula sa-score">O(n² · d)</span>',
          '      </div>',
          '      <div class="sa-cost-row sa-cost-v">',
          '        <span>③ Scores · V &nbsp;(Output)</span>',
          '        <span class="sa-formula sa-v">O(n² · d)</span>',
          '      </div>',
          '      <div class="sa-cost-row sa-cost-total">',
          '        <span style="font-weight:700">Total</span>',
          '        <span class="sa-formula" style="color:#22c55e;font-size:1.05rem">O(n² · d + n · d²)</span>',
          '      </div>',
          '    </div>',
          '    <div class="sa-complexity" style="margin-top:1.2rem">',
          '      <strong>Intuition:</strong><br>',
          '      • <span class="sa-formula">n² · d</span> dominates when n ≫ d (many patches, small vectors) — every patch must "look at" every other patch<br>',
          '      • <span class="sa-formula">n · d²</span> dominates when d ≫ n (few patches, large vectors) — the projection is expensive<br><br>',
          '      <div class="sa-dim-note">In practice (ViT-B/16): n = 196 (14×14 patches), d = 768 → the n² · d term dominates.</div>',
          '    </div>',
          '  </div>',
          '</div>',
        ].join('');
      },
    },
  ];

  function saVec(label, values, colorClass) {
    return [
      '<div class="sa-vec ' + colorClass + '">',
      '  <div class="sa-vec-label">' + label + '</div>',
      values
        .map(function (v) {
          return '<div class="sa-vec-cell">' + v + '</div>';
        })
        .join(''),
      '</div>',
    ].join('');
  }

  var saCurrentStep = 0;

  function saRenderNav() {
    var nav = document.getElementById('saStepNav');
    if (!nav) return;
    nav.innerHTML = steps
      .map(function (s, i) {
        var cls = 'sa-step-btn' + (i === saCurrentStep ? ' active' : '');
        return '<button class="' + cls + '" onclick="saGoToStep(' + i + ')">' + s.title + '</button>';
      })
      .join('');
  }

  window.saGoToStep = function (i) {
    saCurrentStep = i;
    saRenderNav();
    var content = document.getElementById('saContent');
    if (content) content.innerHTML = steps[i].render();
  };

  function saInit() {
    saRenderNav();
    saGoToStep(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', saInit);
  } else {
    saInit();
  }
})();
