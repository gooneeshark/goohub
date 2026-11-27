const TARGET_HOSTS = new Set(['gu.loop.fans']);
const THEME_KEYS = ['dark','goonee','amoled','sepia','midnight','dracula','nord','solarized_dark','solarized_light','high_contrast','grayscale','cyberpunk','sharktheme','pastel','vibrant_red','vibrant_orange','vibrant_blue','vibrant_purple'];
const THEME_FILE = (key) => `themes/${key}.css`;

async function getTheme() {
  const { theme } = await chrome.storage.sync.get({ theme: 'dark' });
  return THEME_KEYS.includes(theme) ? theme : 'dark';
}

async function removeAllThemes(tabId) {
  await Promise.all(THEME_KEYS.map(key =>
    chrome.scripting.removeCSS({ target: { tabId }, files: [THEME_FILE(key)] }).catch(() => {})
  ));
}

async function applyThemeToTab(tabId) {
  const theme = await getTheme();
  await removeAllThemes(tabId);
  await chrome.scripting.insertCSS({ target: { tabId }, files: [THEME_FILE(theme)] });
}

function isTarget(url) {
  try { return TARGET_HOSTS.has(new URL(url).hostname); } catch { return false; }
}

// Show the extension action only on gu.loop.fans.
chrome.runtime.onInstalled.addListener(async () => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({ pageUrl: { hostEquals: 'gu.loop.fans' } }),
      ],
      actions: [new chrome.declarativeContent.ShowAction()]
    }]);
  });
});

// Inject CSS when page completes loading
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab?.url && isTarget(tab.url)) {
    applyThemeToTab(tabId);
  }
});

// Re-apply on theme change
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'sync' && changes.theme) {
    const tabs = await chrome.tabs.query({});
    for (const t of tabs) {
      if (t.id && t.url && isTarget(t.url)) {
        await applyThemeToTab(t.id);
      }
    }
  }
});

// Preview a theme without saving (for popup random/preview)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg && msg.type === 'previewTheme' && msg.theme) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id && tab.url && isTarget(tab.url)) {
        try {
          await removeAllThemes(tab.id);
          await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: [THEME_FILE(msg.theme)] });
          sendResponse({ ok: true });
        } catch (e) {
          sendResponse({ ok: false, error: String(e) });
        }
      } else {
        sendResponse({ ok: false, error: 'not_on_target' });
      }
    }
  })();
  return true; // keep channel open for async sendResponse
});
