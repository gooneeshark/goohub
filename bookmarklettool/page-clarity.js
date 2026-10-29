(function () {
  const PANEL_ID = 'sharktool-page-clarity';
  const STYLE_ID = 'sharktool-page-clarity-style';
  const MARKER = 'data-sharktool-page-clarity';
  const existingPanel = document.getElementById(PANEL_ID);

  if (existingPanel) {
    existingPanel.focus();
    return;
  }

  const previousMarkers = new Map();
  let issueCount = 0;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    [${MARKER}="issue"] {
      outline: 3px solid #f97316 !important;
      outline-offset: 3px !important;
      scroll-margin: 24px !important;
    }
    #${PANEL_ID}, #${PANEL_ID} * { box-sizing: border-box; }
    #${PANEL_ID} button:focus-visible {
      outline: 2px solid #38bdf8;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);

  const panel = document.createElement('section');
  panel.id = PANEL_ID;
  panel.tabIndex = -1;
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Page Clarity: ตรวจโครงสร้างหน้า');
  panel.style.cssText = [
    'position:fixed',
    'top:16px',
    'left:16px',
    'z-index:2147483645',
    'width:min(380px, calc(100vw - 32px))',
    'max-height:calc(100vh - 32px)',
    'overflow:auto',
    'padding:16px',
    'border:1px solid #475569',
    'border-radius:14px',
    'background:#0b1220',
    'color:#e2e8f0',
    'box-shadow:0 12px 36px rgba(0,0,0,.42)',
    'font:14px/1.5 system-ui, sans-serif'
  ].join(';');

  const heading = document.createElement('h2');
  heading.textContent = 'Page Clarity';
  heading.style.cssText = 'font-size:18px;margin:0;';

  const subtitle = document.createElement('p');
  subtitle.textContent = 'ตรวจโครงสร้างที่ช่วยให้อ่านและนำทางหน้าเว็บได้ง่ายขึ้น';
  subtitle.style.cssText = 'color:#cbd5e1;margin:4px 0 12px;';

  const header = document.createElement('div');
  header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;';

  const closeButton = makeButton('ปิด', '#334155');
  closeButton.setAttribute('aria-label', 'ปิด Page Clarity');
  header.append(heading, closeButton);

  const summary = document.createElement('p');
  summary.setAttribute('role', 'status');
  summary.setAttribute('aria-live', 'polite');
  summary.style.cssText = 'margin:0 0 10px;padding:10px;border-radius:8px;background:#172554;color:#dbeafe;';

  const results = document.createElement('div');
  results.setAttribute('aria-label', 'ผลการตรวจ');

  const footer = document.createElement('div');
  footer.style.cssText = 'display:flex;gap:8px;margin-top:12px;';
  const scanButton = makeButton('ตรวจอีกครั้ง', '#0369a1');
  const clearButton = makeButton('ล้างไฮไลต์', '#334155');
  footer.append(scanButton, clearButton);

  panel.append(header, subtitle, summary, results, footer);
  document.body.appendChild(panel);

  function makeButton(label, background) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.style.cssText = [
      'min-height:36px',
      'padding:7px 10px',
      'border:0',
      'border-radius:8px',
      'background:' + background,
      'color:#fff',
      'font:inherit',
      'font-weight:600',
      'cursor:pointer'
    ].join(';');
    return button;
  }

  function isToolUi(element) {
    return Boolean(element.closest('#sharktool-loader-panel, #' + PANEL_ID));
  }

  function clearHighlights() {
    for (const [element, previousValue] of previousMarkers) {
      if (previousValue === null) element.removeAttribute(MARKER);
      else element.setAttribute(MARKER, previousValue);
    }
    previousMarkers.clear();
  }

  function mark(element) {
    if (!previousMarkers.has(element)) {
      previousMarkers.set(element, element.getAttribute(MARKER));
    }
    element.setAttribute(MARKER, 'issue');
  }

  function accessibleName(element) {
    const label = element.getAttribute('aria-label') || element.getAttribute('title');
    if (label && label.trim()) return label.trim();
    const text = (element.textContent || '').replace(/\s+/g, ' ').trim();
    if (text) return text;
    return [...element.querySelectorAll('img[alt]')]
      .map(image => image.getAttribute('alt').trim())
      .filter(Boolean)
      .join(' ');
  }

  function scan() {
    clearHighlights();
    const issues = [];
    const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')]
      .filter(element => !isToolUi(element));
    let previousLevel = 0;

    for (const element of headings) {
      const level = Number(element.tagName.slice(1));
      if (previousLevel && level > previousLevel + 1) {
        issues.push({
          element,
          message: `หัวข้อ H${previousLevel} ข้ามมา H${level}`,
          detail: accessibleName(element) || 'หัวข้อนี้ไม่มีข้อความ'
        });
      }
      previousLevel = level;
    }

    for (const element of document.querySelectorAll('a, button')) {
      if (isToolUi(element)) continue;
      if (!accessibleName(element)) {
        issues.push({
          element,
          message: element.tagName === 'A' ? 'ลิงก์ไม่มีชื่อที่อธิบายปลายทาง' : 'ปุ่มไม่มีชื่อที่อธิบายการทำงาน',
          detail: element.tagName.toLowerCase()
        });
      }
    }

    for (const element of document.querySelectorAll('img:not([alt])')) {
      if (!isToolUi(element)) {
        issues.push({
          element,
          message: 'รูปภาพไม่มีข้อความ alt',
          detail: element.getAttribute('src') ? 'ควรเพิ่มคำอธิบาย หรือใช้ alt="" หากเป็นรูปตกแต่ง' : 'รูปภาพ'
        });
      }
    }

    issueCount = issues.length;
    for (const issue of issues) mark(issue.element);
    summary.textContent = issueCount
      ? `พบ ${issues.length} จุดที่ควรตรวจ · ไฮไลต์สีส้มบนหน้า`
      : 'ไม่พบจุดที่เลือกตรวจในหน้านี้';
    results.replaceChildren();

    if (!issues.length) {
      const empty = document.createElement('p');
      empty.textContent = 'ลองตรวจหน้าเดโมเพื่อดูตัวอย่างผลลัพธ์';
      empty.style.color = '#cbd5e1';
      results.appendChild(empty);
      return;
    }

    const list = document.createElement('ol');
    list.style.cssText = 'padding-left:22px;margin:0;display:grid;gap:8px;';
    issues.forEach((issue, index) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `${issue.message} — ${issue.detail}`;
      button.setAttribute('aria-label', `ไปยังจุดที่ ${index + 1}: ${issue.message}`);
      button.style.cssText = [
        'width:100%',
        'padding:8px',
        'border:1px solid #475569',
        'border-radius:8px',
        'background:#172033',
        'color:#e2e8f0',
        'font:inherit',
        'text-align:left',
        'cursor:pointer'
      ].join(';');
      button.addEventListener('click', () => {
        clearHighlights();
        mark(issue.element);
        summary.textContent = `ไฮไลต์จุดที่ ${index + 1} จาก ${issueCount} แล้ว`;
        issue.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        issue.element.focus({ preventScroll: true });
      });
      item.appendChild(button);
      list.appendChild(item);
    });
    results.appendChild(list);
  }

  scanButton.addEventListener('click', scan);
  clearButton.addEventListener('click', () => {
    clearHighlights();
    summary.textContent = issueCount
      ? `พบ ${issueCount} จุด · ล้างไฮไลต์แล้ว`
      : 'ไม่พบจุดที่เลือกตรวจในหน้านี้';
  });
  closeButton.addEventListener('click', () => {
    clearHighlights();
    style.remove();
    panel.remove();
  });
  scan();
})();
