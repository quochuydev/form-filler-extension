const btn = document.getElementById("toggle");
const addPatternBtn = document.getElementById("add-pattern");
const patternModal = document.getElementById("pattern-modal");
const savePatternBtn = document.getElementById("save-pattern");
const cancelPatternBtn = document.getElementById("cancel-pattern");
const patternsList = document.getElementById("patterns-list");

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

// Load current state from storage and initialize defaults
chrome.storage.local.get(["autoFillEnabled", "fillPatterns", "defaultsInitialized"], (res) => {
  const enabled = res.autoFillEnabled ?? true;
  
  // Initialize default patterns if not already done
  if (!res.defaultsInitialized) {
    patterns = [...defaultPatterns];
    chrome.storage.local.set({ 
      fillPatterns: patterns, 
      defaultsInitialized: true 
    });
  } else {
    patterns = res.fillPatterns || [];
  }
  
  updateButton(enabled);
  renderPatterns();
});

// Toggle button functionality
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

// Pattern management
addPatternBtn.addEventListener("click", () => {
  showModal();
});

cancelPatternBtn.addEventListener("click", () => {
  hideModal();
});

savePatternBtn.addEventListener("click", () => {
  const selector = document.getElementById("pattern-selector").value.trim();
  const type = document.getElementById("pattern-type").value;
  const value = document.getElementById("pattern-value").value.trim();

  if (!selector || !value) {
    alert("Please fill in all fields");
    return;
  }

  const pattern = {
    id: Date.now().toString(),
    selector,
    type,
    value
  };

  patterns.push(pattern);
  savePatterns();
  renderPatterns();
  hideModal();
  clearForm();
});

function showModal() {
  patternModal.style.display = "block";
}

function hideModal() {
  patternModal.style.display = "none";
}

function clearForm() {
  document.getElementById("pattern-selector").value = "";
  document.getElementById("pattern-type").value = "text";
  document.getElementById("pattern-value").value = "";
}

function savePatterns() {
  chrome.storage.local.set({ fillPatterns: patterns });
  
  // Update content script with new patterns
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: {
        tabId: tabs[0].id,
      },
      func: (newPatterns) => {
        if (window.updateFillPatterns) {
          window.updateFillPatterns(newPatterns);
        }
      },
      args: [patterns],
    });
  });
}

function renderPatterns() {
  patternsList.innerHTML = "";
  
  patterns.forEach(pattern => {
    const item = document.createElement("div");
    item.className = "pattern-item";
    
    item.innerHTML = `
      <div class="selector">${pattern.selector}</div>
      <div class="type">Type: ${pattern.type}</div>
      <div class="value">Value: ${pattern.value}</div>
      <button class="remove-btn" data-pattern-id="${pattern.id}">Remove</button>
    `;
    
    patternsList.appendChild(item);
  });
}

// Event delegation for remove buttons
patternsList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const patternId = e.target.getAttribute("data-pattern-id");
    removePattern(patternId);
  }
});

// Quick-fill buttons functionality
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("quick-fill")) {
    const value = e.target.getAttribute("data-value");
    document.getElementById("pattern-value").value = value;
  }
});

function removePattern(id) {
  patterns = patterns.filter(p => p.id !== id);
  savePatterns();
  renderPatterns();
}

