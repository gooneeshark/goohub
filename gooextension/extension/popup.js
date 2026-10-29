'use strict';

const THEME_KEYS = [
  'dark', 'goonee', 'amoled', 'sepia', 'midnight', 'dracula', 'nord',
  'solarized_dark', 'solarized_light', 'high_contrast', 'grayscale',
  'cyberpunk', 'sharktheme', 'pastel', 'vibrant_red', 'vibrant_orange',
  'vibrant_blue', 'vibrant_purple'
];

const select = document.getElementById('theme');
const btnApply = document.getElementById('apply');
const btnRandom = document.getElementById('random');
const btnExport = document.getElementById('export');
const btnImport = document.getElementById('import-button');
const inputImport = document.getElementById('import');
const status = document.getElementById('status');

function setStatus(message, state = 'success') {
  status.textContent = message;
  status.dataset.state = state;
}

function renderThemeOptions() {
  const fragment = document.createDocumentFragment();
  for (const key of THEME_KEYS) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = key.replaceAll('_', ' ');
    fragment.append(option);
  }
  select.replaceChildren(fragment);
}

async function init() {
  renderThemeOptions();
  try {
    const { theme } = await chrome.storage.sync.get({ theme: 'dark' });
    select.value = THEME_KEYS.includes(theme) ? theme : 'dark';
  } catch (error) {
    setStatus(`Could not load saved theme: ${error.message}`, 'error');
    select.value = 'dark';
  }
}

btnApply.addEventListener('click', async () => {
  try {
    await chrome.storage.sync.set({ theme: select.value });
    setStatus('Theme saved.');
    window.close();
  } catch (error) {
    setStatus(`Could not save theme: ${error.message}`, 'error');
  }
});

btnRandom.addEventListener('click', async () => {
  const theme = THEME_KEYS[Math.floor(Math.random() * THEME_KEYS.length)];
  select.value = theme;
  try {
    const response = await chrome.runtime.sendMessage({ type: 'previewTheme', theme });
    if (!response?.ok) {
      setStatus(response?.error === 'not_on_twitter'
        ? 'Open X or Twitter to preview a theme.'
        : `Preview failed: ${response?.error || 'No response from the extension.'}`, 'error');
      return;
    }
    setStatus(`Previewing ${theme.replaceAll('_', ' ')}. Save to keep it.`);
  } catch (error) {
    setStatus(`Preview failed: ${error.message}`, 'error');
  }
});

btnExport.addEventListener('click', async () => {
  try {
    const data = await chrome.storage.sync.get(null);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'x-theme-settings.json';
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('Settings exported.');
  } catch (error) {
    setStatus(`Could not export settings: ${error.message}`, 'error');
  }
});

btnImport.addEventListener('click', () => inputImport.click());

inputImport.addEventListener('change', async () => {
  const file = inputImport.files?.[0];
  if (!file) return;

  try {
    const data = JSON.parse(await file.text());
    if (!data || typeof data !== 'object' || Array.isArray(data) ||
        typeof data.theme !== 'string' || !THEME_KEYS.includes(data.theme)) {
      throw new Error('The file must contain a supported theme setting.');
    }
    await chrome.storage.sync.set({ theme: data.theme });
    select.value = data.theme;
    setStatus('Theme imported and saved.');
  } catch (error) {
    setStatus(`Could not import settings: ${error.message}`, 'error');
  } finally {
    inputImport.value = '';
  }
});

void init();
