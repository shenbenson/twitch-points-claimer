// Watches the Twitch page for the "Claim Bonus" chest and clicks it.

const SELECTORS = [
  '[data-test-selector="community-points-summary"] button[aria-label="Claim Bonus"]',
  'button[aria-label="Claim Bonus"]',
  '.claimable-bonus__icon',
];

let enabled = true;
let pendingClick = false;

chrome.storage.local.get({ enabled: true }, (data) => {
  enabled = data.enabled;
  if (enabled) tryClaim();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    enabled = changes.enabled.newValue;
    if (enabled) tryClaim();
  }
});

function findClaimButton() {
  for (const sel of SELECTORS) {
    const el = document.querySelector(sel);
    if (el) return el.closest('button') || el;
  }
  return null;
}

function currentChannel() {
  const seg = location.pathname.split('/').filter(Boolean)[0];
  return seg ? seg.toLowerCase() : 'unknown';
}

function tryClaim() {
  if (!enabled || pendingClick) return;
  const button = findClaimButton();
  if (!button) return;

  // Short random delay so we don't click the instant the chest renders.
  pendingClick = true;
  const delay = 500 + Math.random() * 1500;
  setTimeout(() => {
    pendingClick = false;
    const btn = findClaimButton();
    if (!enabled || !btn) return;
    btn.click();
    recordClaim(currentChannel());
  }, delay);
}

function recordClaim(channel) {
  chrome.storage.local.get({ totalClaims: 0, channels: {} }, (data) => {
    const channels = data.channels;
    channels[channel] = (channels[channel] || 0) + 1;
    const totalClaims = data.totalClaims + 1;
    chrome.storage.local.set({ totalClaims, channels, lastClaim: Date.now() });
    chrome.runtime.sendMessage({ type: 'claimed', totalClaims }).catch(() => {});
  });
  console.log(`[Points Claimer] Claimed bonus on ${channel}`);
}

// Twitch is a single-page app, so watch DOM changes rather than page loads.
const observer = new MutationObserver(() => tryClaim());
observer.observe(document.body, { childList: true, subtree: true });

// Fallback poll in case the observer misses something (e.g. background tab throttling).
setInterval(tryClaim, 15000);
