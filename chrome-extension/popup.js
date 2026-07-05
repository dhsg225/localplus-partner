const PARTNER_ORIGIN_PATTERNS = ['https://partners.localplus.city/*', 'http://localhost:3000/*'];
const INGESTION_URL = 'https://partners.localplus.city/ingestion';

const statusEl = document.getElementById('status');
const contentEl = document.getElementById('content');
const sourceEl = document.getElementById('source');
const modeEl = document.getElementById('mode');
const dateEl = document.getElementById('date');

dateEl.value = new Date().toISOString().split('T')[0];

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? '#ef4444' : '#6b7280';
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Injected into the page — must be self-contained (no closures over outer scope).
function getSelectionText() {
  return window.getSelection ? window.getSelection().toString() : '';
}

// Injected into the page — best-effort scan for a FB post's text.
// Facebook's markup churns constantly, so this tries a few historically-stable
// hooks and otherwise grabs the largest text block inside the first article-like
// container. Treat this as a convenience, not a guarantee — selecting text by
// hand and using "Grab selected text" is the reliable path.
function autoDetectPostText() {
  const candidates = [];
  document.querySelectorAll('[data-ad-preview="message"], [data-ad-comet-preview="message"]').forEach(el => candidates.push(el));
  if (candidates.length === 0) {
    document.querySelectorAll('[role="article"]').forEach(article => {
      let best = null;
      let bestLen = 0;
      article.querySelectorAll('div[dir="auto"]').forEach(el => {
        const len = (el.textContent || '').length;
        if (len > bestLen) { bestLen = len; best = el; }
      });
      if (best) candidates.push(best);
    });
  }
  if (candidates.length === 0) return '';
  const winner = candidates.reduce((a, b) => (b.textContent || '').length > (a.textContent || '').length ? b : a);
  return (winner.textContent || '').trim();
}

// Injected into the ingestion dashboard tab.
function postDraftIntoPage(payload) {
  window.postMessage({ type: 'LOCALPLUS_INGEST_DRAFT', payload }, window.location.origin);
}

document.getElementById('grabSelected').addEventListener('click', async () => {
  setStatus('Reading selection…');
  try {
    const tab = await getActiveTab();
    const [{ result }] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: getSelectionText });
    if (!result || !result.trim()) {
      setStatus('Nothing selected on that tab — highlight the post text first.', true);
      return;
    }
    contentEl.value = result.trim();
    setStatus('Captured selected text. Review it below, then send.');
  } catch (err) {
    setStatus(`Could not read that tab: ${err.message}`, true);
  }
});

document.getElementById('autoDetect').addEventListener('click', async () => {
  setStatus('Scanning page for a post…');
  try {
    const tab = await getActiveTab();
    if (!tab.url || !tab.url.includes('facebook.com')) {
      setStatus('Open a Facebook page first.', true);
      return;
    }
    const [{ result }] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: autoDetectPostText });
    if (!result) {
      setStatus('Auto-detect found nothing — select the text by hand instead.', true);
      return;
    }
    contentEl.value = result;
    setStatus('Auto-detected a post. Double-check it before sending — Facebook\'s layout changes often.');
  } catch (err) {
    setStatus(`Could not scan that tab: ${err.message}`, true);
  }
});

document.getElementById('send').addEventListener('click', async () => {
  const content = contentEl.value.trim();
  if (!content) {
    setStatus('Nothing to send yet.', true);
    return;
  }
  const payload = {
    source_name: sourceEl.value.trim() || 'Sandy Beach',
    mode: modeEl.value,
    date: dateEl.value,
    content
  };

  setStatus('Opening ingestion dashboard…');
  try {
    const existing = await chrome.tabs.query({ url: PARTNER_ORIGIN_PATTERNS });
    let tab = existing.find(t => (t.url || '').includes('/ingestion')) || existing[0];

    if (!tab) {
      tab = await chrome.tabs.create({ url: INGESTION_URL, active: false });
      await new Promise(resolve => {
        function onUpdated(tabId, info) {
          if (tabId === tab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(onUpdated);
            resolve();
          }
        }
        chrome.tabs.onUpdated.addListener(onUpdated);
      });
    }

    await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: postDraftIntoPage, args: [payload] });
    await chrome.tabs.update(tab.id, { active: true });
    const win = await chrome.windows.get(tab.windowId);
    await chrome.windows.update(win.id, { focused: true });

    setStatus('Sent. Switch to the dashboard tab — the intake form should be pre-filled.');
  } catch (err) {
    setStatus(`Failed to send: ${err.message}`, true);
  }
});
