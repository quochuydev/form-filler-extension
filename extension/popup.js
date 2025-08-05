// === CONSTANTS ===
const ELEMENTS = {
  toggleBtn: document.getElementById("toggle"),
  addPatternBtn: document.getElementById("add-pattern"),
  patternModal: document.getElementById("pattern-modal"),
  savePatternBtn: document.getElementById("save-pattern"),
  cancelPatternBtn: document.getElementById("cancel-pattern"),
  patternsList: document.getElementById("patterns-list"),
  patternSelector: document.getElementById("pattern-selector"),
  patternType: document.getElementById("pattern-type"),
  patternValue: document.getElementById("pattern-value")
};

const STORAGE_KEYS = {
  autoFillEnabled: "autoFillEnabled",
  fillPatterns: "fillPatterns",
  defaultsInitialized: "defaultsInitialized"
};

// === STATE ===
let patterns = [];

// Default patterns
const defaultPatterns = [
  {
    id: "default-firstName",
    selector: "input[name='firstName']",
    type: "text",
    value: "RANDOM_NAME"
  },
  {
    id: "default-lastName",
    selector: "input[name='lastName']",
    type: "text",
    value: "RANDOM_NAME"
  },
  {
    id: "default-password",
    selector: "input[name='password']",
    type: "text",
    value: "Qwerty@123"
  },
  {
    id: "default-confirmPassword",
    selector: "input[name='confirmPassword']",
    type: "text",
    value: "Qwerty@123"
  }
];

// === INITIALIZATION ===
async function initialize() {
  try {
    const res = await chrome.storage.local.get([
      STORAGE_KEYS.autoFillEnabled,
      STORAGE_KEYS.fillPatterns,
      STORAGE_KEYS.defaultsInitialized
    ]);
    
    const enabled = res[STORAGE_KEYS.autoFillEnabled] ?? true;
    
    if (!res[STORAGE_KEYS.defaultsInitialized]) {
      await initializeDefaults();
    } else {
      patterns = res[STORAGE_KEYS.fillPatterns] || [];
    }
    
    updateButton(enabled);
    renderPatterns();
  } catch (error) {
    console.error('Failed to initialize popup:', error);
  }
}

async function initializeDefaults() {
  patterns = [...defaultPatterns];
  await chrome.storage.local.set({
    [STORAGE_KEYS.fillPatterns]: patterns,
    [STORAGE_KEYS.defaultsInitialized]: true
  });
}

initialize();

// === EVENT HANDLERS ===
ELEMENTS.toggleBtn.addEventListener("click", async () => {
  try {
    await toggleAutoFill();
  } catch (error) {
    console.error('Failed to toggle auto-fill:', error);
  }
});

ELEMENTS.addPatternBtn.addEventListener("click", () => showModal());
ELEMENTS.cancelPatternBtn.addEventListener("click", () => hideModal());
ELEMENTS.savePatternBtn.addEventListener("click", handleSavePattern);

// === AUTO-FILL TOGGLE ===
async function toggleAutoFill() {
  const { [STORAGE_KEYS.autoFillEnabled]: autoFillEnabled } = 
    await chrome.storage.local.get(STORAGE_KEYS.autoFillEnabled);
  
  const newState = !autoFillEnabled;
  await chrome.storage.local.set({ [STORAGE_KEYS.autoFillEnabled]: newState });
  updateButton(newState);
  
  await updateContentScript((state) => window.setAutoFillState?.(state), [newState]);
}

function updateButton(enabled) {
  ELEMENTS.toggleBtn.textContent = enabled ? "Auto-Fill ON" : "Auto-Fill OFF";
  ELEMENTS.toggleBtn.classList.toggle("off", !enabled);
}

// === PATTERN MANAGEMENT ===
function handleSavePattern() {
  const patternData = getPatternFormData();
  
  if (!validatePatternData(patternData)) {
    alert("Please fill in all fields");
    return;
  }
  
  const pattern = createPattern(patternData);
  addPattern(pattern);
  
  hideModal();
  clearForm();
}

function getPatternFormData() {
  return {
    selector: ELEMENTS.patternSelector.value.trim(),
    type: ELEMENTS.patternType.value,
    value: ELEMENTS.patternValue.value.trim()
  };
}

function validatePatternData({ selector, value }) {
  return selector && value;
}

function createPattern({ selector, type, value }) {
  return {
    id: Date.now().toString(),
    selector,
    type,
    value
  };
}

function addPattern(pattern) {
  patterns.push(pattern);
  savePatterns();
  renderPatterns();
}

// === MODAL MANAGEMENT ===
function showModal() {
  ELEMENTS.patternModal.style.display = "block";
}

function hideModal() {
  ELEMENTS.patternModal.style.display = "none";
}

function clearForm() {
  ELEMENTS.patternSelector.value = "";
  ELEMENTS.patternType.value = "text";
  ELEMENTS.patternValue.value = "";
}

async function savePatterns() {
  try {
    await chrome.storage.local.set({ [STORAGE_KEYS.fillPatterns]: patterns });
    await updateContentScript(
      (newPatterns) => window.updateFillPatterns?.(newPatterns),
      [patterns]
    );
  } catch (error) {
    console.error('Failed to save patterns:', error);
  }
}

// === CHROME API UTILITIES ===
async function updateContentScript(func, args) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func,
        args
      });
    }
  } catch (error) {
    console.error('Failed to update content script:', error);
  }
}

// === UI RENDERING ===
function renderPatterns() {
  ELEMENTS.patternsList.innerHTML = "";
  
  patterns.forEach(pattern => {
    const item = createPatternElement(pattern);
    ELEMENTS.patternsList.appendChild(item);
  });
}

function createPatternElement(pattern) {
  const item = document.createElement("div");
  item.className = "pattern-item";
  item.innerHTML = `
    <div class="selector">${escapeHtml(pattern.selector)}</div>
    <div class="type">Type: ${escapeHtml(pattern.type)}</div>
    <div class="value">Value: ${escapeHtml(pattern.value)}</div>
    <button class="remove-btn" data-pattern-id="${pattern.id}">Remove</button>
  `;
  return item;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// === EVENT DELEGATION ===
ELEMENTS.patternsList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const patternId = e.target.getAttribute("data-pattern-id");
    removePattern(patternId);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("quick-fill")) {
    const value = e.target.getAttribute("data-value");
    ELEMENTS.patternValue.value = value;
  }
});

function removePattern(id) {
  patterns = patterns.filter(p => p.id !== id);
  savePatterns();
  renderPatterns();
}

