import type { WebsiteDetails } from '../types'

const escapeHtml = (str: string) =>
  str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]!)

export const downloadFile = (filename: string, content: string, mimeType = 'text/html;charset=utf-8') => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const generateAppHtml = (prompt: string, title: string): string => {
  const safeTitle = escapeHtml(title || 'My Interactive App')
  const safePrompt = escapeHtml(prompt || 'Personal interactive workspace')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} • Built with Buildly</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f4f3f8;
      color: #1a1824;
      font-family: 'Manrope', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: #ffffff;
      border-bottom: 1px solid #e5e3ec;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand { display: flex; align-items: center; gap: 12px; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif; }
    .logo-badge {
      width: 38px; height: 38px; border-radius: 12px;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: white; display: grid; place-items: center; font-size: 18px;
    }
    main { max-width: 820px; width: 100%; margin: 32px auto; padding: 0 20px; flex: 1; }
    .hero {
      background: linear-gradient(135deg, #6d28d9, #4338ca);
      color: white; padding: 32px; border-radius: 28px;
      box-shadow: 0 20px 40px rgba(79, 70, 229, 0.22);
    }
    .hero h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 32px; font-weight: 800; margin-top: 8px; }
    .hero p { opacity: 0.85; font-size: 14px; margin-top: 8px; line-height: 1.6; max-width: 600px; }
    .stats-bar { display: flex; gap: 16px; margin-top: 24px; align-items: center; }
    .progress-track { flex: 1; height: 8px; background: rgba(255, 255, 255, 0.25); border-radius: 99px; overflow: hidden; }
    .progress-fill { height: 100%; background: #ffffff; border-radius: 99px; transition: width 0.3s ease; }
    .card {
      background: white; border: 1px solid #e5e3ec;
      border-radius: 24px; padding: 24px; margin-top: 24px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
    }
    .form-row { display: flex; gap: 10px; margin-top: 16px; }
    input {
      flex: 1; padding: 14px 18px; border: 1px solid #d9d6e4;
      border-radius: 14px; font-size: 14px; outline: none; transition: 0.2s;
    }
    input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15); }
    button.btn-add {
      background: #7c3aed; color: white; border: none;
      padding: 0 24px; border-radius: 14px; font-weight: 700;
      font-size: 14px; cursor: pointer; transition: 0.2s;
    }
    button.btn-add:hover { background: #6d28d9; }
    .item-list { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
    .item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 18px; border-radius: 14px; border: 1px solid #eeecf4;
      background: #faf9fd; transition: 0.2s;
    }
    .item.done { opacity: 0.65; background: #f0edf8; text-decoration: line-through; }
    .check-btn {
      width: 24px; height: 24px; border-radius: 8px; border: 2px solid #bbb3d2;
      background: transparent; display: grid; place-items: center;
      cursor: pointer; margin-right: 12px; font-size: 12px; font-weight: 900;
    }
    .check-btn.checked { background: #7c3aed; border-color: #7c3aed; color: white; }
    .item-left { display: flex; align-items: center; flex: 1; }
    .delete-btn { background: none; border: none; font-size: 18px; color: #a49eb6; cursor: pointer; padding: 4px; }
    .delete-btn:hover { color: #e11d48; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <div class="logo-badge">⚡</div>
      <span>${safeTitle}</span>
    </div>
    <span style="font-size: 12px; color: #8e88a0; font-weight: 600;">Buildly Standalone App</span>
  </header>

  <main>
    <section class="hero">
      <small style="text-transform: uppercase; letter-spacing: 0.12em; font-weight: 800; font-size: 11px;">Your Workspace</small>
      <h1>${safeTitle}</h1>
      <p>${safePrompt}</p>
      <div class="stats-bar">
        <div class="progress-track"><div id="progress" class="progress-fill" style="width: 50%;"></div></div>
        <span id="stat-text" style="font-size: 12px; font-weight: 700;">2 / 4 complete</span>
      </div>
    </section>

    <section class="card">
      <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px;">Add New Item</h2>
      <form id="add-form" class="form-row">
        <input id="item-input" placeholder="Type a task, goal, or entry..." required autocomplete="off" />
        <button type="submit" class="btn-add">Add Item</button>
      </form>

      <div id="list" class="item-list"></div>
    </section>
  </main>

  <script>
    let items = [
      { id: 1, text: "Explore your custom workspace", done: true },
      { id: 2, text: "Try adding a new entry", done: false },
      { id: 3, text: "Review progress and marks", done: true },
      { id: 4, text: "Share your Buildly creation", done: false }
    ];

    const list = document.querySelector("#list");
    const progress = document.querySelector("#progress");
    const statText = document.querySelector("#stat-text");

    function update() {
      list.innerHTML = "";
      const doneCount = items.filter(i => i.done).length;
      const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;
      progress.style.width = pct + "%";
      statText.textContent = doneCount + " / " + items.length + " complete (" + pct + "%)";

      items.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "item " + (item.done ? "done" : "");
        div.innerHTML = \`
          <div class="item-left">
            <button class="check-btn \${item.done ? 'checked' : ''}">\${item.done ? '✓' : ''}</button>
            <span>\${item.text}</span>
          </div>
          <button class="delete-btn" title="Delete">×</button>
        \`;
        div.querySelector(".check-btn").onclick = () => {
          items[index].done = !items[index].done;
          update();
        };
        div.querySelector(".delete-btn").onclick = () => {
          items.splice(index, 1);
          update();
        };
        list.appendChild(div);
      });
    }

    document.querySelector("#add-form").onsubmit = (e) => {
      e.preventDefault();
      const inp = document.querySelector("#item-input");
      if (!inp.value.trim()) return;
      items.push({ id: Date.now(), text: inp.value.trim(), done: false });
      inp.value = "";
      update();
    };

    update();
  </script>
</body>
</html>`
}

export const generateWebsiteHtml = (website: WebsiteDetails): string => {
  const brand = escapeHtml(website.businessName || 'Evergreen Studio')
  const color = website.color || '#6366f1'
  const tagline = escapeHtml(website.tagline || 'Something truly meaningful, made for you.')
  const blurb = escapeHtml(website.blurb || 'We build exceptional experiences tailored to your goals.')
  const owner = escapeHtml(website.owner || 'Alex Johnson')
  const about = escapeHtml(website.about || 'Dedicated to crafting products of highest quality.')

  const heroTitle = escapeHtml(website.heroHeadline || brand)
  const cta = escapeHtml(website.ctaText || 'Get Started')
  const featuresList = (website.features && website.features.length > 0) ? website.features : [
    { title: 'Premium Quality', desc: 'Built with high-grade standards and modern craftsmanship.' },
    { title: 'Tailored Experience', desc: 'Designed precisely around the needs of your audience.' },
    { title: 'Direct Support', desc: 'Reliable, hands-on assistance every step of the journey.' }
  ]

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brand} • Official Website</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #ffffff;
      color: #1f1d2b;
      font-family: 'Manrope', sans-serif;
      line-height: 1.6;
    }
    header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 20px 40px; max-width: 1200px; margin: 0 auto;
    }
    .logo { font-size: 20px; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif; color: #1a1727; }
    .btn-brand {
      background: ${color}; color: white; padding: 12px 24px;
      border-radius: 99px; text-decoration: none; font-weight: 700; font-size: 14px;
      display: inline-block; transition: transform 0.2s;
    }
    .btn-brand:hover { transform: translateY(-2px); }
    .hero {
      max-width: 1200px; margin: 40px auto 100px; padding: 0 40px;
      display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 60px; align-items: center;
    }
    .badge {
      display: inline-block; padding: 6px 14px; border-radius: 99px;
      background: ${color}15; color: ${color}; font-size: 12px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;
    }
    h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 56px; font-weight: 800; line-height: 1.1; margin-bottom: 20px; }
    p.lead { font-size: 18px; color: #5a566a; margin-bottom: 30px; }
    .art-card {
      aspect-ratio: 4/3; border-radius: 36px;
      background: linear-gradient(135deg, ${color}, #1f1b2e);
      padding: 36px; color: white; display: flex; flex-direction: column; justify-content: space-between;
      box-shadow: 0 24px 60px rgba(0,0,0,0.15);
    }
    .features {
      background: #f9f8fc; padding: 80px 40px;
      border-top: 1px solid #ede9f6; border-bottom: 1px solid #ede9f6;
    }
    .features-wrap { max-width: 1200px; margin: 0 auto; }
    .grid3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 40px; }
    .f-card { background: white; padding: 32px; border-radius: 24px; border: 1px solid #eae6f4; }
    .founder-sec { max-width: 900px; margin: 100px auto; padding: 0 40px; text-align: center; }
    footer { border-top: 1px solid #eae6f4; padding: 30px 40px; text-align: center; font-size: 13px; color: #7f7a90; }
    @media (max-width: 800px) {
      .hero { grid-template-columns: 1fr; }
      h1 { font-size: 38px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="logo">${brand}</div>
    <a href="#contact" class="btn-brand">${cta}</a>
  </header>

  <section class="hero">
    <div>
      <span class="badge">Official Brand</span>
      <h1>${heroTitle}</h1>
      <p class="lead">${blurb}</p>
      <a href="#contact" class="btn-brand">${cta}</a>
    </div>
    <div class="art-card">
      <small style="opacity: 0.8; letter-spacing: 0.1em; text-transform: uppercase;">Featured Concept</small>
      <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px;">${tagline}</h2>
      <p style="opacity: 0.9; font-size: 14px;">Founded by ${owner}</p>
    </div>
  </section>

  <section class="features">
    <div class="features-wrap">
      <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 32px; text-align: center;">Why ${brand}</h2>
      <div class="grid3">
        ${featuresList.map(f => `
          <div class="f-card">
            <h3 style="font-size: 18px; margin-bottom: 8px;">${escapeHtml(f.title)}</h3>
            <p style="color: #666; font-size: 14px;">${escapeHtml(f.desc)}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section class="founder-sec" id="about">
    <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 32px;">Meet ${owner}</h2>
    <p style="margin-top: 16px; color: #5a566a; font-size: 16px; line-height: 1.8;">${about}</p>
  </section>

  <footer>
    © ${new Date().getFullYear()} ${brand}. Created and Published with Buildly.
  </footer>
</body>
</html>`
}

export const generateGameHtml = (gameType: string, prompt: string): string => {
  const safeName = escapeHtml(prompt || 'Nebula Space Dodger')
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeName} • Buildly Arcade</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=JetBrains+Mono:wght@700;800&family=Manrope:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0d0b18; color: #f3f0ff; font-family: 'Manrope', sans-serif;
      min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 16px; user-select: none;
    }
    .wrapper { width: min(740px, 96vw); display: flex; flex-direction: column; gap: 14px; }
    .top-bar {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
      gap: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
      border-radius: 20px; padding: 10px 18px; backdrop-filter: blur(10px);
    }
    .btn {
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: white;
      padding: 8px 16px; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;
    }
    .btn:hover { background: rgba(255,255,255,0.18); transform: translateY(-1px); }
    .btn-primary {
      background: linear-gradient(135deg, #7c3aed, #4f46e5); border: none;
      box-shadow: 0 4px 18px rgba(124, 58, 237, 0.4);
    }
    .btn-primary:hover { background: linear-gradient(135deg, #8b5cf6, #6366f1); }
    .hud {
      display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: bold;
      padding: 0 6px;
    }
    .canvas-box {
      position: relative; aspect-ratio: 16/10; max-height: 460px; width: 100%;
      border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15);
      background: black; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }
    canvas { width: 100%; height: 100%; display: block; }
    .overlay {
      position: absolute; inset: 0; background: rgba(13, 11, 24, 0.85); backdrop-filter: blur(6px);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 24px; text-align: center; gap: 14px;
    }
    .score-big { font-family: 'JetBrains Mono', monospace; font-size: 52px; font-weight: 900; color: #fbbf24; }
    .modal-box {
      background: linear-gradient(135deg, #1f1836, #120e22); border: 1px solid rgba(255,255,255,0.2);
      border-radius: 28px; padding: 28px; width: min(440px, 94vw); text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,0.7);
    }
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
      display: none; align-items: center; justify-content: center; z-index: 100; padding: 16px;
    }
    .modal-backdrop.open { display: flex; }
    .lb-row {
      display: flex; align-items: center; justify-content: space-between; padding: 10px 14px;
      border-radius: 14px; background: rgba(255,255,255,0.05); margin-bottom: 6px; font-size: 13px;
    }
    .avatar-btn {
      width: 40px; height: 40px; border-radius: 12px; font-size: 20px;
      border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.08);
      cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
    }
    .avatar-btn.selected { border: 2px solid white; background: #7c3aed; }
    .pill {
      font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 99px;
      background: rgba(124, 58, 237, 0.2); color: #c4b5fd; border: 1px solid rgba(124, 58, 237, 0.4);
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="top-bar">
      <div style="display: flex; align-items: center; gap: 8px;">
        <button id="player-profile-btn" class="btn">
          <span id="player-icon-badge" style="font-size: 16px;">🚀</span>
          <span id="player-name-badge">Alex J.</span>
          <span style="opacity: 0.6; font-size: 11px;">✎</span>
        </button>
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        <button id="sound-btn" class="btn" title="Toggle Sound">🔊</button>
        <button id="lb-btn" class="btn">🏆 Leaderboard</button>
      </div>
    </div>

    <div class="hud">
      <div>Score: <span id="score-text" style="color: #a78bfa; font-family: 'JetBrains Mono', monospace; font-size: 18px;">0</span></div>
      <div>Stars: <span id="stars-text" style="color: #facc15; font-family: 'JetBrains Mono', monospace;">★ 0</span></div>
      <div id="lives-box" style="display: flex; gap: 4px;">❤️❤️❤️</div>
    </div>

    <div class="canvas-box">
      <canvas id="game-canvas" width="700" height="440"></canvas>
      <div id="start-overlay" class="overlay">
        <span id="start-avatar" style="font-size: 48px;">🚀</span>
        <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; font-weight: 900;">${safeName}</h2>
        <p style="color: #a5a1b8; font-size: 13px; max-width: 380px;">Dodge asteroid hazards and collect golden star cores to set the high score.</p>
        <button id="start-btn" class="btn btn-primary" style="padding: 12px 28px; font-size: 15px; margin-top: 8px;">
          Launch Mission 🚀
        </button>
        <div style="font-size: 12px; opacity: 0.7; margin-top: 6px;">Controls: Arrow Keys or [W][A][S][D]</div>
      </div>
    </div>
  </div>

  <!-- Player Customizer Modal -->
  <div id="player-modal" class="modal-backdrop">
    <div class="modal-box">
      <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 16px;">Customize Player</h3>
      <div style="text-align: left; margin-bottom: 16px;">
        <label style="font-size: 12px; font-weight: bold; color: #a5a1b8; display: block; margin-bottom: 6px;">Player Name</label>
        <input id="player-name-input" type="text" maxlength="16" style="width: 100%; padding: 10px 14px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; color: white; font-weight: bold; font-size: 14px; outline: none;">
      </div>
      <div style="text-align: left; margin-bottom: 20px;">
        <label style="font-size: 12px; font-weight: bold; color: #a5a1b8; display: block; margin-bottom: 8px;">Choose Avatar Icon</label>
        <div id="avatars-grid" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
      </div>
      <button id="save-player-btn" class="btn btn-primary" style="width: 100%; padding: 12px; justify-content: center;">Save Profile ✓</button>
    </div>
  </div>

  <!-- Score Card Modal -->
  <div id="score-card-modal" class="modal-backdrop">
    <div class="modal-box">
      <div class="pill" id="sc-header-badge">🚀 Alex J. • Score Card</div>
      <h3 id="sc-game-title" style="font-size: 24px; font-weight: 900; margin-top: 10px;">Mission Complete</h3>
      <div id="sc-new-high" style="display: none; color: #fbbf24; font-size: 12px; font-weight: 800; margin-top: 4px;">🏆 NEW PERSONAL BEST!</div>

      <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 20px; margin: 16px 0;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #a5a1b8;">Final Score</div>
        <div class="score-big" id="sc-score">0</div>
        <div id="sc-tier" style="font-size: 12px; color: #c4b5fd; font-weight: 700; margin-top: 4px;">Rank: Swift Challenger</div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px;">
        <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 11px; color: #a5a1b8;">Stars Gathered</div>
          <div id="sc-stars" style="font-size: 18px; font-weight: 800; color: #facc15;">0</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-size: 11px; color: #a5a1b8;">Survival Time</div>
          <div id="sc-time" style="font-size: 18px; font-weight: 800; color: #38bdf8;">0s</div>
        </div>
      </div>

      <button id="replay-btn" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 14px; justify-content: center; margin-bottom: 10px;">
        Play Again (Replay) ↻ [R]
      </button>
      <div style="display: flex; gap: 8px;">
        <button id="sc-to-lb" class="btn" style="flex: 1; justify-content: center;">Leaderboard 🏆</button>
        <button id="sc-close" class="btn" style="flex: 1; justify-content: center;">Close</button>
      </div>
    </div>
  </div>

  <!-- Leaderboard Modal -->
  <div id="lb-modal" class="modal-backdrop">
    <div class="modal-box" style="width: min(480px, 94vw); text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="font-size: 20px; font-weight: 800;">🏆 Hall of Fame</h3>
        <button id="lb-close" class="btn" style="padding: 6px 12px;">✕</button>
      </div>
      <div id="lb-list" style="max-height: 280px; overflow-y: auto; padding-right: 4px;"></div>
    </div>
  </div>

  <script>
    // Web Audio API Retro Synth
    class RetroAudio {
      constructor() { this.ctx = null; this.soundOn = true; }
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      }
      pickup() {
        if (!this.soundOn) return;
        this.init(); if (!this.ctx) return;
        const now = this.ctx.currentTime, osc = this.ctx.createOscillator(), g = this.ctx.createGain();
        osc.type = 'triangle'; osc.frequency.setValueAtTime(587, now); osc.frequency.setValueAtTime(1174, now + 0.1);
        g.gain.setValueAtTime(0.2, now); g.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(g); g.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.22);
      }
      crash() {
        if (!this.soundOn) return;
        this.init(); if (!this.ctx) return;
        const now = this.ctx.currentTime, osc = this.ctx.createOscillator(), g = this.ctx.createGain();
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(180, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
        g.gain.setValueAtTime(0.25, now); g.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(g); g.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.25);
      }
      gameover() {
        if (!this.soundOn) return;
        this.init(); if (!this.ctx) return;
        const now = this.ctx.currentTime, osc = this.ctx.createOscillator(), g = this.ctx.createGain();
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(392, now); osc.frequency.setValueAtTime(196, now + 0.3);
        g.gain.setValueAtTime(0.25, now); g.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.connect(g); g.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.6);
      }
      click() {
        if (!this.soundOn) return;
        this.init(); if (!this.ctx) return;
        const now = this.ctx.currentTime, osc = this.ctx.createOscillator(), g = this.ctx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(800, now);
        g.gain.setValueAtTime(0.1, now); g.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(g); g.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.05);
      }
    }
    const audio = new RetroAudio();

    // Player Profile State
    const avatarList = ['🚀', '⚡', '👾', '🦊', '🤖', '👑', '🐱', '🦄', '🔥'];
    let player = { name: 'Alex J.', icon: '🚀' };
    try {
      const saved = localStorage.getItem('buildly_game_player');
      if (saved) player = JSON.parse(saved);
    } catch(e) {}

    function updatePlayerBadge() {
      document.getElementById('player-icon-badge').textContent = player.icon;
      document.getElementById('player-name-badge').textContent = player.name;
      document.getElementById('start-avatar').textContent = player.icon;
    }
    updatePlayerBadge();

    // Sound toggle
    const soundBtn = document.getElementById('sound-btn');
    soundBtn.onclick = () => {
      audio.soundOn = !audio.soundOn;
      soundBtn.textContent = audio.soundOn ? '🔊' : '🔇';
      audio.click();
    };

    // Leaderboard State
    let leaderboard = [
      { id: '1', name: 'NovaStrike', icon: '🚀', score: 980, date: 'Today' },
      { id: '2', name: 'CyberViper', icon: '⚡', score: 840, date: 'Yesterday' },
      { id: '3', name: 'PixelQueen', icon: '👑', score: 720, date: '2 days ago' },
      { id: '4', name: 'StarGazer', icon: '🦄', score: 650, date: '3 days ago' }
    ];
    try {
      const stored = localStorage.getItem('buildly_game_lb');
      if (stored) leaderboard = JSON.parse(stored);
    } catch(e) {}

    function saveLeaderboard(score) {
      leaderboard.push({
        id: Date.now().toString(),
        name: player.name || 'Anonymous',
        icon: player.icon || '🚀',
        score: score,
        date: 'Just now'
      });
      leaderboard.sort((a,b) => b.score - a.score);
      try { localStorage.setItem('buildly_game_lb', JSON.stringify(leaderboard)); } catch(e) {}
    }

    function renderLeaderboard() {
      const list = document.getElementById('lb-list');
      list.innerHTML = leaderboard.map((item, idx) => {
        const badge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '#' + (idx + 1);
        const isMe = item.name === player.name;
        return \`
          <div class="lb-row" style="\${isMe ? 'border: 1px solid #7c3aed; background: rgba(124, 58, 237, 0.2);' : ''}">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 800; width: 22px;">\${badge}</span>
              <span style="font-size: 16px;">\${item.icon}</span>
              <span style="font-weight: 700;">\${item.name}</span>
              \${isMe ? '<span style="font-size: 9px; background: #7c3aed; padding: 1px 5px; border-radius: 4px; font-weight: 800;">YOU</span>' : ''}
            </div>
            <div style="font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #fbbf24;">\${item.score} pts</div>
          </div>
        \`;
      }).join('');
    }

    // Modal Triggers
    document.getElementById('lb-btn').onclick = () => {
      audio.click();
      renderLeaderboard();
      document.getElementById('lb-modal').classList.add('open');
    };
    document.getElementById('lb-close').onclick = () => {
      audio.click();
      document.getElementById('lb-modal').classList.remove('open');
    };

    // Player Customizer
    document.getElementById('player-profile-btn').onclick = () => {
      audio.click();
      document.getElementById('player-name-input').value = player.name;
      const grid = document.getElementById('avatars-grid');
      grid.innerHTML = avatarList.map(a => \`
        <button class="avatar-btn \${a === player.icon ? 'selected' : ''}" data-icon="\${a}">\${a}</button>
      \`).join('');
      grid.querySelectorAll('.avatar-btn').forEach(btn => {
        btn.onclick = () => {
          grid.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        };
      });
      document.getElementById('player-modal').classList.add('open');
    };

    document.getElementById('save-player-btn').onclick = () => {
      audio.click();
      const val = document.getElementById('player-name-input').value.trim();
      const sel = document.querySelector('#avatars-grid .avatar-btn.selected');
      if (val) player.name = val;
      if (sel) player.icon = sel.dataset.icon;
      try { localStorage.setItem('buildly_game_player', JSON.stringify(player)); } catch(e) {}
      updatePlayerBadge();
      document.getElementById('player-modal').classList.remove('open');
    };

    // Score Card Modal Actions
    function showScoreCard(score, stars, duration) {
      document.getElementById('sc-header-badge').textContent = player.icon + ' ' + player.name + ' • Score Card';
      document.getElementById('sc-score').textContent = score;
      document.getElementById('sc-stars').textContent = stars;
      document.getElementById('sc-time').textContent = duration + 's';
      document.getElementById('sc-tier').textContent = 'Rank: ' + (score > 600 ? '🌟 Grandmaster' : score > 300 ? '🚀 Veteran Pilot' : '⚡ Swift Challenger');

      const hi = parseInt(localStorage.getItem('buildly_game_hi') || '0', 10);
      if (score > hi) {
        document.getElementById('sc-new-high').style.display = 'block';
        try { localStorage.setItem('buildly_game_hi', score.toString()); } catch(e) {}
      } else {
        document.getElementById('sc-new-high').style.display = 'none';
      }

      saveLeaderboard(score);
      document.getElementById('score-card-modal').classList.add('open');
    }

    document.getElementById('replay-btn').onclick = () => {
      audio.click();
      document.getElementById('score-card-modal').classList.remove('open');
      startGame();
    };
    document.getElementById('sc-to-lb').onclick = () => {
      document.getElementById('score-card-modal').classList.remove('open');
      renderLeaderboard();
      document.getElementById('lb-modal').classList.add('open');
    };
    document.getElementById('sc-close').onclick = () => {
      document.getElementById('score-card-modal').classList.remove('open');
    };

    // Hotkey for Replay
    window.addEventListener('keydown', (e) => {
      if ((e.key === 'r' || e.key === 'R') && document.getElementById('score-card-modal').classList.contains('open')) {
        document.getElementById('score-card-modal').classList.remove('open');
        startGame();
      }
    });

    // Space Runner Game Loop
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    let score = 0, starsCount = 0, lives = 3, startTime = 0;
    let playing = false, animId = null;
    let ship = { x: canvas.width / 2, y: canvas.height - 50, speed: 6 };
    let keys = {};
    let obstacles = [], pickups = [];
    let bgStars = [];
    for (let i = 0; i < 40; i++) bgStars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, s: 1 + Math.random() * 2 });

    window.onkeydown = e => keys[e.key] = true;
    window.onkeyup = e => keys[e.key] = false;

    function startGame() {
      score = 0; starsCount = 0; lives = 3; startTime = Date.now();
      obstacles = []; pickups = [];
      ship.x = canvas.width / 2; ship.y = canvas.height - 50;
      document.getElementById("start-overlay").style.display = "none";
      document.getElementById("score-text").textContent = "0";
      document.getElementById("stars-text").textContent = "★ 0";
      document.getElementById("lives-box").textContent = "❤️❤️❤️";
      playing = true;
      audio.pickup();
      cancelAnimationFrame(animId);
      loop();
    }

    document.getElementById('start-btn').onclick = startGame;

    function loop() {
      if (!playing) return;

      if ((keys["ArrowLeft"] || keys["a"] || keys["A"]) && ship.x > 20) ship.x -= ship.speed;
      if ((keys["ArrowRight"] || keys["d"] || keys["D"]) && ship.x < canvas.width - 20) ship.x += ship.speed;
      if ((keys["ArrowUp"] || keys["w"] || keys["W"]) && ship.y > 40) ship.y -= ship.speed;
      if ((keys["ArrowDown"] || keys["s"] || keys["S"]) && ship.y < canvas.height - 30) ship.y += ship.speed;

      if (Math.random() < 0.05) {
        obstacles.push({ x: 20 + Math.random() * (canvas.width - 40), y: -20, r: 12 + Math.random() * 14, s: 3 + Math.random() * 3 });
      }
      if (Math.random() < 0.02) {
        pickups.push({ x: 20 + Math.random() * (canvas.width - 40), y: -20, r: 10, s: 2.5 });
      }

      ctx.fillStyle = "#0a0815";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      bgStars.forEach(s => { s.y += s.s; if (s.y > canvas.height) s.y = 0; ctx.fillRect(s.x, s.y, 2, 2); });

      // Draw Ship
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(-4, 12, 8, 8);
      ctx.fillStyle = "#8b5cf6";
      ctx.beginPath();
      ctx.moveTo(0, -18); ctx.lineTo(16, 12); ctx.lineTo(-16, 12); ctx.closePath();
      ctx.fill();
      ctx.font = "14px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(player.icon, 0, -2);
      ctx.restore();

      // Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        let o = obstacles[i];
        o.y += o.s;
        ctx.fillStyle = "#f43f5e";
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();

        let dx = o.x - ship.x, dy = o.y - ship.y;
        if (Math.sqrt(dx*dx + dy*dy) < o.r + 14) {
          obstacles.splice(i, 1);
          lives--;
          audio.crash();
          document.getElementById("lives-box").textContent = "❤️".repeat(Math.max(0, lives)) + "🖤".repeat(Math.max(0, 3 - lives));
          if (lives <= 0) {
            playing = false;
            audio.gameover();
            const dur = Math.round((Date.now() - startTime) / 1000);
            showScoreCard(score, starsCount, dur);
            return;
          }
        } else if (o.y > canvas.height + 30) {
          obstacles.splice(i, 1);
          score += 10;
          document.getElementById("score-text").textContent = score;
        }
      }

      // Pickups
      for (let i = pickups.length - 1; i >= 0; i--) {
        let p = pickups[i];
        p.y += p.s;
        ctx.fillStyle = "#facc15";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();

        let dx = p.x - ship.x, dy = p.y - ship.y;
        if (Math.sqrt(dx*dx + dy*dy) < p.r + 14) {
          pickups.splice(i, 1);
          starsCount++;
          score += 50;
          audio.pickup();
          document.getElementById("score-text").textContent = score;
          document.getElementById("stars-text").textContent = "★ " + starsCount;
        } else if (p.y > canvas.height + 30) {
          pickups.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(loop);
    }
  </script>
</body>
</html>`
}
