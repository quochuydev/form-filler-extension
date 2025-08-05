const btn = document.getElementById("toggle");

// Load current state from storage
chrome.storage.local.get(["autoFillEnabled"], (res) => {
  const enabled = res.autoFillEnabled ?? true;
  updateButton(enabled);
});

// Button click → update storage + inform content
btn.addEventListener("click", async () => {
  const { autoFillEnabled } = await chrome.storage.local.get("autoFillEnabled");
  const newState = !autoFillEnabled;

  await chrome.storage.local.set({ autoFillEnabled: newState });
  updateButton(newState);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: {
        tabId: tabs[0].id,
      },
      func: (state) => window.setAutoFillState?.(state),
      args: [newState],
    });
  });
});

function updateButton(enabled) {
  btn.textContent = enabled ? "Auto-Fill ON" : "Auto-Fill OFF";
  btn.classList.toggle("off", !enabled);
}
