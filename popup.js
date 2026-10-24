const $ = (id) => document.getElementById(id);

function render() {
  chrome.storage.local.get({ enabled: true, totalClaims: 0, channels: {}, lastClaim: null }, (d) => {
    $('enabled').checked = d.enabled;
    $('total').textContent = d.totalClaims;
    $('last').textContent = d.lastClaim ? `Last claim: ${new Date(d.lastClaim).toLocaleString()}` : 'No claims yet';

    const list = $('channels');
    list.replaceChildren();
    Object.entries(d.channels)
      .sort((a, b) => b[1] - a[1])
      .forEach(([name, count]) => {
        const li = document.createElement('li');
        const n = document.createElement('span');
        n.textContent = name;
        const c = document.createElement('span');
        c.textContent = count;
        li.append(n, c);
        list.append(li);
      });
  });
}

$('enabled').addEventListener('change', (e) => chrome.storage.local.set({ enabled: e.target.checked }));
$('reset').addEventListener('click', () => chrome.storage.local.set({ totalClaims: 0, channels: {}, lastClaim: null }));
chrome.storage.onChanged.addListener(render);
render();
