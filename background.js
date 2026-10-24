// Keeps the toolbar badge in sync with the total claim count.

function updateBadge(enabled, totalClaims) {
  chrome.action.setBadgeText({ text: enabled ? (totalClaims ? String(totalClaims) : '') : 'OFF' });
  chrome.action.setBadgeBackgroundColor({ color: enabled ? '#9147ff' : '#777777' });
}

function refresh() {
  chrome.storage.local.get({ enabled: true, totalClaims: 0 }, (d) => updateBadge(d.enabled, d.totalClaims));
}

chrome.runtime.onInstalled.addListener(refresh);
chrome.runtime.onStartup.addListener(refresh);
chrome.storage.onChanged.addListener(refresh);
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'claimed') refresh();
});
