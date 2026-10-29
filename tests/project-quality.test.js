const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { existsSync, readFileSync, readdirSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const readJson = file => JSON.parse(readFileSync(path.join(root, file), 'utf8'));

test('bookmarklet manifest entries resolve to local tool files', () => {
  const manifest = readJson('bookmarklettool/manifest.json');
  const loader = readFileSync(path.join(root, 'bookmarklettool/loader.js'), 'utf8');
  assert.ok(Array.isArray(manifest) && manifest.length > 0);

  for (const tool of manifest) {
    assert.ok(tool.id && tool.name && tool.url, 'each tool needs an id, name, and URL');
    assert.ok(!/^(?:https?:)?\/\//i.test(tool.url), `${tool.id} should use a local source path`);
    assert.ok(existsSync(path.join(root, 'bookmarklettool', tool.url)), `${tool.url} should exist`);
  }

  const fallbackIds = [...loader.matchAll(/\{ id: '([^']+)'/g)].map(match => match[1]);
  assert.deepEqual([...fallbackIds].sort(), manifest.map(tool => tool.id).sort());
});

test('Page Clarity demo has local runtime and predictable review examples', () => {
  const demo = readFileSync(path.join(root, 'bookmarklettool/demo.html'), 'utf8');

  assert.match(demo, /<script src="\.\/loader\.js"><\/script>/);
  assert.match(demo, /<h1[^>]*>[\s\S]*?<\/h1>[\s\S]*?<h3/);
  assert.match(demo, /<a href="#details"><\/a>/);
  const images = [...demo.matchAll(/<img\b[^>]*>/g)].map(([image]) => image);
  assert.equal(images.length, 2);
  assert.equal(images.filter(image => /\balt=/.test(image)).length, 1);
});

test('homepage navigation resolves and deployment-specific image assets are removed', () => {
  const homepage = readFileSync(path.join(root, 'index.html'), 'utf8');
  const ids = [...homepage.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id);

  assert.equal((homepage.match(/<main\b/g) || []).length, 1);
  assert.doesNotMatch(homepage, /<img\b|(?:og|twitter):image/i);
  assert.doesNotMatch(homepage, /Twitter Theme|twitter-theme|twitter-theme-extension/i);
  assert.doesNotMatch(homepage, /goohub\.js\.org|goohubl\.vercel\.app|goo-nee\.netlify\.app/i);
  assert.match(homepage, /<nav[^>]+aria-label="เมนูหลัก"/);
  assert.match(homepage, /<nav[^>]+aria-labelledby="page-toc-title"/);

  for (const [, target] of homepage.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.includes(target), `homepage anchor #${target} should exist`);
  }
  for (const [, target] of homepage.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|#|data:|javascript:)/i.test(target)) continue;
    const localPath = decodeURIComponent(target.split(/[?#]/, 1)[0]);
    assert.ok(existsSync(path.resolve(root, localPath)), `homepage references missing local asset ${target}`);
  }

  const tools = readFileSync(path.join(root, 'playground/goorum-tools.js'), 'utf8');
  assert.match(tools, /new URL\(`\$\{TOOLS_BASE\}\$\{element\.dataset\.scriptPath\}`, window\.location\.href\)/);
});

test('X Themes manifest and popup assets are complete', () => {
  const extensionRoot = path.join(root, 'gooextension/extension');
  const manifest = readJson('gooextension/extension/manifest.json');

  assert.equal(manifest.manifest_version, 3);
  assert.ok(existsSync(path.join(extensionRoot, manifest.background.service_worker)));
  assert.ok(existsSync(path.join(extensionRoot, manifest.action.default_popup)));
  for (const icon of Object.values(manifest.icons)) {
    assert.ok(existsSync(path.join(extensionRoot, icon)), `${icon} should exist`);
  }
  for (const key of ['popup.css', 'popup.js']) {
    assert.ok(existsSync(path.join(extensionRoot, key)), `${key} should exist`);
  }

  const themeFiles = new Set(
    readdirSync(path.join(extensionRoot, 'themes'))
      .filter(file => file.endsWith('.css'))
      .map(file => file.slice(0, -4))
  );
  const worker = readFileSync(path.join(extensionRoot, manifest.background.service_worker), 'utf8');
  const themeKeys = worker.match(/const THEME_KEYS = \[([^\]]+)\]/)?.[1]
    .match(/'([^']+)'/g)
    .map(key => key.slice(1, -1)) ?? [];
  assert.ok(themeKeys.length > 0);
  assert.deepEqual([...themeKeys].sort(), [...themeFiles].sort());

  const popup = readFileSync(path.join(extensionRoot, manifest.action.default_popup), 'utf8');
  for (const id of ['theme', 'apply', 'random', 'export', 'import-button', 'import', 'status']) {
    assert.match(popup, new RegExp(`id="${id}"`), `popup should provide #${id}`);
  }
});

test('changed JavaScript entry points parse successfully', () => {
  const files = [
    'bookmarklettool/loader.js',
    'bookmarklettool/page-clarity.js',
    'gooextension/extension/popup.js',
    'gooextension/extension/service_worker.js',
    'playground/script.js',
    'playground/goorum-tools.js',
    'playground/simple-script.js',
    'LAB/gambling-lab.js',
    'LAB/docs/gambling-lab.js',
    'playground/tests/cross-browser-compatibility.test.js',
    'playground/tests/test-runner.js'
  ];

  for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
    assert.equal(result.status, 0, `${file} failed syntax validation:\n${result.stderr}`);
  }
});

test('updated documentation links resolve within the repository', () => {
  const documents = [
    'README.md',
    'ARCHITECTURE.md',
    'TOOLS_GUIDE.md',
    'bookmarklettool/Freetool.md',
    'bookmarklettool/DEV_GUIDE.md',
    'bookmarklettool/UX_DEMO_PLAN.md',
    'LAB/README_DEPLOY.md',
    'LAB/README_GamblingLAB.md',
    'LAB/docs/README_GamblingLAB.md',
    'gooextension/final/README.md'
  ];

  for (const document of documents) {
    const source = readFileSync(path.join(root, document), 'utf8');
    for (const [, href] of source.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(?:https?:|mailto:|#)/i.test(href)) continue;
      const target = decodeURIComponent(href.split(/[?#]/, 1)[0]);
      assert.ok(existsSync(path.resolve(root, path.dirname(document), target)),
        `${document} links to missing path ${href}`);
    }
  }
});

test('Gambling API lab markup matches its shared runtime', () => {
  const pagePath = 'LAB/docs/GamblingAPI_lab.html';
  const page = readFileSync(path.join(root, pagePath), 'utf8');
  const runtime = readFileSync(path.join(root, 'LAB/gambling-lab.js'), 'utf8');
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  const references = [...runtime.matchAll(/(?:\$|getElementById)\(['"]([A-Za-z0-9_-]+)['"]\)/g)]
    .map(match => match[1]);

  assert.doesNotMatch(page, /^\s*\+/m, 'HTML should not contain pasted diff markers');
  assert.equal(new Set(ids).size, ids.length, 'HTML IDs should be unique');
  assert.ok(existsSync(path.join(root, 'LAB/docs/lab.css')));
  assert.ok(existsSync(path.join(root, 'LAB/docs/gambling-lab.js')));
  for (const id of references) {
    assert.ok(ids.includes(id), `runtime expects #${id} in the page`);
  }
});
