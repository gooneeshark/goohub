(function(){
  if (document.getElementById('sharktool-loader-panel')) return;

  // Keep the manifest and tool URLs beside the loader in local and deployed builds.
  const REMOTE_BASE = document.currentScript?.src
    ? new URL('.', document.currentScript.src).href
    : 'https://sharkkadaw.netlify.app/sharktool/';

  const FALLBACK_TOOLS = [
    { id: 'page-clarity', name: 'Page Clarity', url: REMOTE_BASE + 'page-clarity.js', description: 'ตรวจโครงสร้างหัวข้อ ลิงก์ และข้อความอธิบายรูป พร้อมไฮไลต์จุดที่ควรทบทวน' },
    { id: 'monitor',   name: 'Monitor',    url: REMOTE_BASE + 'monitor.js' },
    { id: 'theme',     name: 'Theme',      url: REMOTE_BASE + 'Theme.js' },
    { id: 'snipers',   name: 'Snipers',    url: REMOTE_BASE + 'snipers.js' },
    { id: 'burpshark', name: 'BurpShark',  url: REMOTE_BASE + 'burpshark.js' },
    { id: 'sharkscan', name: 'SharkScan',  url: REMOTE_BASE + 'sharkscan.js' },
    { id: 'encryption', name: 'Encryption', url: REMOTE_BASE + 'encryption.js' },
    { id: 'postshark', name: 'PostShark',  url: REMOTE_BASE + 'postshark.js' },
    { id: 'devpanel',  name: 'Dev Panel',  url: REMOTE_BASE + 'tool.js' }
  ];

  const MANIFEST_URL = REMOTE_BASE + 'manifest.json';
  const STORAGE_KEY  = 'sharktool_loader_selected_v1';
  const THEME_KEY    = 'sharktool_page_theme_v1';

  // --- Utilities ---
  function el(tag, attrs, html){
    const e = document.createElement(tag);
    if (attrs) Object.assign(e, attrs);
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function line(logEl, msg){
    logEl.textContent += msg + '\n';
    logEl.scrollTop = logEl.scrollHeight;
  }

  function loadScript(url){
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = url;
      s.onload = () => resolve(url);
      s.onerror = () => reject(new Error('Load failed: ' + url));
      (document.head || document.documentElement).appendChild(s);
    });
  }

  async function loadManifest(){
    try {
      const res = await fetch(MANIFEST_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid manifest format');
      return data
        .map(x => {
          const raw = typeof x.url === 'string' ? x.url.trim() : '';
          const abs = /^(https?:)?\/\//i.test(raw) ? raw : (REMOTE_BASE + raw.replace(/^\.?\//, ''));
          return {
            id: typeof x.id === 'string' ? x.id : '',
            name: typeof x.name === 'string' && x.name.trim() ? x.name.trim() : x.id,
            url: abs,
            description: typeof x.description === 'string' ? x.description : ''
          };
        })
        .filter(x => x.id && x.url !== REMOTE_BASE);
    } catch (e) {
      console.warn('[SharkTool] Could not load manifest; using built-in tools.', e);
      return FALLBACK_TOOLS;
    }
  }

  // --- Page-wide theme support ---
  function ensureThemeStyleEl(){
    let st = document.getElementById('stl-page-theme');
    if (!st) {
      st = document.createElement('style');
      st.id = 'stl-page-theme';
      document.head.appendChild(st);
    }
    return st;
  }

  function themeCSS(name){
    switch(name){
      case 'dark':
        return `:root{--bg:#0b1220;--fg:#e2e8f0;--muted:#94a3b8;--card:#0f172a;--accent:#22c55e;--border:#1f2a44}
        body{background:var(--bg)!important;color:var(--fg)!important}
        a{color:#60a5fa!important}
        .card,section,article,main,header,footer,aside,nav{background:var(--card)!important;color:var(--fg)!important;border-color:var(--border)!important}
        button,input,select,textarea{background:#111827!important;color:var(--fg)!important;border:1px solid var(--border)!important}
        ::selection{background:#22c55e33}`;
      case 'cyber':
        return `:root{--bg:#0a0f0f;--fg:#d1fae5;--muted:#94f6e6;--card:#0f1a1a;--accent:#00ffd0;--border:#083d3d}
        body{background:linear-gradient(135deg,#05090a,#0a0f0f 40%,#0e1b1b)!important;color:var(--fg)!important}
        a{color:#00ffd0!important}
        .card,section,article,main,header,footer,aside,nav{background:rgba(0,255,208,0.05)!important;color:var(--fg)!important;border:1px solid #00ffd033!important;box-shadow:0 0 24px #00ffd011}
        button,input,select,textarea{background:#061414!important;color:var(--fg)!important;border:1px solid #00ffd033!important}
        ::selection{background:#00ffd044}`;
      case 'pastel':
        return `:root{--bg:#fff7fb;--fg:#3b3b4f;--muted:#6b7280;--card:#fff;--accent:#ff69b4;--border:#ffd6e7}
        body{background:linear-gradient(180deg,#fff7fb,#fff)!important;color:var(--fg)!important}
        a{color:#e91e63!important}
        .card,section,article,main,header,footer,aside,nav{background:#ffffffd9!important;color:var(--fg)!important;border:1px solid var(--border)!important;border-radius:12px}
        button,input,select,textarea{background:#fff!important;color:var(--fg)!important;border:1px solid var(--border)!important;border-radius:10px}
        ::selection{background:#ff69b422}`;
      case 'retro':
        return `:root{--bg:#222244;--fg:#ffdd44;--muted:#d9f99d;--card:#2b2b55;--accent:#88ffff;--border:#444477}
        body{background:repeating-linear-gradient(45deg,#1c1c3c 0 12px,#20204a 12px 24px)!important;color:var(--fg)!important}
        a{color:#88ffff!important}
        .card,section,article,main,header,footer,aside,nav{background:#2b2b55dd!important;color:var(--fg)!important;border:2px dotted #88ffffaa!important}
        button,input,select,textarea{background:#1f1f3f!important;color:var(--fg)!important;border:2px solid #ffdd44aa!important}
        ::selection{background:#88ffff44}`;
      case 'light':
        return `:root{--bg:#ffffff;--fg:#0f172a;--muted:#475569;--card:#f8fafc;--accent:#2563eb;--border:#e2e8f0}
        body{background:var(--bg)!important;color:var(--fg)!important}
        a{color:#2563eb!important}
        .card,section,article,main,header,footer,aside,nav{background:var(--card)!important;color:var(--fg)!important;border:1px solid var(--border)!important}
        button,input,select,textarea{background:#fff!important;color:var(--fg)!important;border:1px solid var(--border)!important}
        ::selection{background:#2563eb22}`;
      case 'system':
      default:
        return '';
    }
  }

  function applyTheme(name){
    if (!['system', 'light', 'dark', 'cyber', 'pastel', 'retro'].includes(name)) {
      name = 'system';
    }
    const css = themeCSS(name);
    const st = ensureThemeStyleEl();
    st.textContent = css;
    try {
      localStorage.setItem(THEME_KEY, name);
    } catch (error) {
      console.warn('[SharkTool] Could not save the selected page theme.', error);
    }
  }

  // --- Build UI panel ---
  const panel = el('div');
  panel.id = 'sharktool-loader-panel';
  panel.className = 'sharktool-loader-panel';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'SharkTool Loader');
  panel.style.cssText = `
    position:fixed; top:80px; right:20px; z-index:2147483646;
    background:#0b1220; color:#e2e8f0; border:1px solid #334155;
    padding:12px; border-radius:12px; width:320px; max-width:calc(100vw - 24px);
    max-height:calc(100vh - 24px); overflow:auto;
    font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    box-shadow:0 10px 30px rgba(0,0,0,.4);
  `;
  const panelStylesheet = el('link', {
    id: 'sharktool-loader-styles',
    rel: 'stylesheet',
    href: REMOTE_BASE + 'panel-theme.css'
  });
  document.head.appendChild(panelStylesheet);

  const header = el('div', { }, `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <div style="font-weight:700;display:flex;align-items:center;gap:8px;">
        <span style="color:#22c55e">🦈</span> SharkTool Loader
      </div>
      <div style="display:flex;gap:6px;">
        <button id="stl-min" title="ย่อ/ขยาย" style="background:#0ea5e9;color:#0b1220;border:none;border-radius:6px;padding:4px 8px;cursor:pointer">↕</button>
        <button id="stl-close" title="ปิด" style="background:#ef4444;color:#fff;border:none;border-radius:6px;padding:4px 8px;cursor:pointer">ปิด</button>
      </div>
    </div>
  `);

  // Theme bar
  const themeBar = el('div');
  themeBar.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px 0;';
  themeBar.innerHTML = `
    <div style="font-size:12px;color:#94a3b8;width:100%">Page Theme:</div>
    <button data-theme="system" style="background:#334155;color:#e2e8f0;border:none;border-radius:999px;padding:6px 10px;cursor:pointer">System</button>
    <button data-theme="light"  style="background:#e2e8f0;color:#0f172a;border:none;border-radius:999px;padding:6px 10px;cursor:pointer">Light</button>
    <button data-theme="dark"   style="background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:999px;padding:6px 10px;cursor:pointer">Dark</button>
    <button data-theme="cyber"  style="background:#061414;color:#00ffd0;border:1px solid #00ffd033;border-radius:999px;padding:6px 10px;cursor:pointer">Cyber</button>
    <button data-theme="pastel" style="background:#ffe4f1;color:#7a3b55;border:none;border-radius:999px;padding:6px 10px;cursor:pointer">Pastel</button>
    <button data-theme="retro"  style="background:#2b2b55;color:#ffdd44;border:1px dotted #88ffff;border-radius:999px;padding:6px 10px;cursor:pointer">Retro</button>
  `;

  const searchBox = el('input');
  searchBox.type = 'search';
  searchBox.placeholder = 'ค้นหาเครื่องมือ...';
  searchBox.setAttribute('aria-label', 'ค้นหาเครื่องมือ');
  searchBox.style.cssText = 'width:100%;padding:8px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;outline:none;margin-bottom:8px;'

  const list = el('div');
  list.id = 'stl-list';
  list.setAttribute('role', 'group');
  list.setAttribute('aria-label', 'รายการเครื่องมือ');
  list.style.cssText = 'max-height:220px;overflow:auto;margin-bottom:10px;border:1px dashed #334155;border-radius:8px;padding:6px;'

  const actions = el('div', {}, `
    <div style="display:flex; gap:8px; margin-bottom:6px;">
      <button id="stl-select-all" style="background:#334155;color:#e2e8f0;border:none;border-radius:8px;padding:8px;cursor:pointer">เลือกทั้งหมด</button>
      <button id="stl-unselect-all" style="background:#334155;color:#e2e8f0;border:none;border-radius:8px;padding:8px;cursor:pointer">ยกเลิกทั้งหมด</button>
      <button id="stl-load" style="flex:1;background:#22c55e;color:#0b1220;border:none;border-radius:8px;padding:8px;cursor:pointer;font-weight:700">Load</button>
    </div>
  `);

  const log = el('div');
  log.id = 'stl-log';
  log.setAttribute('role', 'status');
  log.setAttribute('aria-live', 'polite');
  log.style.cssText = 'font-size:12px;color:#93c5fd;white-space:pre-wrap;max-height:140px;overflow:auto;border-top:1px dashed #334155;padding-top:6px;'

  panel.appendChild(header);
  panel.appendChild(themeBar);
  panel.appendChild(searchBox);
  panel.appendChild(list);
  panel.appendChild(actions);
  panel.appendChild(log);
  document.body.appendChild(panel);

  // --- Dragging ---
  let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
  header.style.cursor = 'move';
  header.addEventListener('pointerdown', e => {
    if (e.target.closest('button') || e.target.tagName==='INPUT' || e.target.tagName==='TEXTAREA') return;
    dragging = true;
    sx = e.clientX;
    sy = e.clientY;
    const r = panel.getBoundingClientRect();
    ox = r.left;
    oy = r.top;
    e.preventDefault();
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp, { once: true });
    document.addEventListener('pointercancel', onUp, { once: true });
  });
  function onMove(e) {
    if (!dragging) return;
    panel.style.left = `${Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, ox + e.clientX - sx))}px`;
    panel.style.top = `${Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, oy + e.clientY - sy))}px`;
    panel.style.right = 'auto';
  }
  function onUp() {
    dragging = false;
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    document.removeEventListener('pointercancel', onUp);
  }

  // --- Minimize ---
  let minimized=false;
  header.querySelector('#stl-min').onclick = (event) => {
    minimized = !minimized;
    themeBar.style.display = minimized ? 'none' : '';
    list.style.display = minimized ? 'none' : '';
    searchBox.style.display = minimized ? 'none' : '';
    actions.style.display = minimized ? 'none' : '';
    log.style.display = minimized ? 'none' : '';
    event.currentTarget.setAttribute('aria-expanded', String(!minimized));
  };

  header.querySelector('#stl-close').onclick = () => panel.remove();

  // --- Render tools ---
  let tools = [];
  let savedSelection = [];
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(stored)) savedSelection = stored.filter(id => typeof id === 'string');
  } catch (error) {
    console.warn('[SharkTool] Ignoring invalid saved tool selection.', error);
  }
  const savedIds = new Set(savedSelection);
  function render(filterText){
    list.innerHTML = '';
    const q = (filterText||'').trim().toLowerCase();
    let visibleCount = 0;
    for (const t of tools) {
      if (q && !(t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) continue;
      visibleCount += 1;
      const row = el('label');
      row.style.cssText = 'display:flex;align-items:flex-start;gap:8px;margin:6px 2px;';
      const checkbox = el('input');
      checkbox.type = 'checkbox';
      checkbox.value = t.id;
      checkbox.checked = savedIds.has(t.id);
      checkbox.style.marginTop = '3px';
      const details = el('span');
      details.style.flex = '1';
      const name = el('span');
      name.textContent = t.name;
      name.style.cssText = 'display:block;font-weight:600;';
      const description = el('span');
      description.textContent = t.description || t.url;
      description.style.cssText = 'display:block;font-size:12px;color:#94a3b8;overflow-wrap:anywhere;';
      details.append(name, description);
      row.append(checkbox, details);
      list.appendChild(row);
    }
    if (!visibleCount) {
      list.textContent = q ? 'ไม่พบเครื่องมือที่ตรงกับคำค้นหา' : 'ไม่มีเครื่องมือให้เลือก';
    }
  }

  // Search
  searchBox.addEventListener('input', () => render(searchBox.value));

  // Theme buttons
  themeBar.querySelectorAll('button[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.getAttribute('data-theme')));
  });

  // Buttons
  actions.querySelector('#stl-select-all').onclick = () => {
    list.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = true);
  };
  actions.querySelector('#stl-unselect-all').onclick = () => {
    list.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
  };

  actions.querySelector('#stl-load').onclick = async () => {
    const ids = [...list.querySelectorAll('input[type=checkbox]:checked')].map(cb => cb.value);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      console.warn('[SharkTool] Could not save the selected tools.', error);
      line(log, 'บันทึกรายการที่เลือกไม่ได้ แต่จะลองโหลดเครื่องมือต่อ');
    }
    const selected = tools.filter(t => ids.includes(t.id));
    if (!selected.length){ line(log, 'โปรดเลือกอย่างน้อย 1 รายการ'); return; }

    line(log, 'เริ่มโหลด ' + selected.length + ' รายการ...');
    for (const t of selected) {
      try {
        line(log, '→ ' + t.name);
        await loadScript(t.url);
        line(log, '  ✓ Loaded: ' + t.url);
      } catch (e) {
        console.error(e);
        line(log, '  ✗ Error: ' + e.message);
      }
    }
    line(log, 'เสร็จสิ้น');
  };

  // --- Init ---
  (async function init(){
    let savedTheme = 'system';
    try {
      savedTheme = localStorage.getItem(THEME_KEY) || 'system';
    } catch (error) {
      console.warn('[SharkTool] Could not read the saved page theme.', error);
    }
    applyTheme(savedTheme);
    tools = await loadManifest();
    render('');
  })();
})();
