chrome.runtime.sendMessage({ type: "PING" }, (response) => {
  if (response?.type === "PONG") {
    console.log("Service worker is alive!", response);
  }
});

// Inject toggle button into the page
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "🟢 Auto-Fill ON";
Object.assign(toggleBtn.style, {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  zIndex: 9999,
  padding: "8px 12px",
  backgroundColor: "#0a0",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
});
document.body.appendChild(toggleBtn);

let isEnabled = true;

// Update UI from state
window.setAutoFillState = (state) => {
  isEnabled = state;
  toggleBtn.textContent = isEnabled ? "🟢 Auto-Fill ON" : "🔴 Auto-Fill OFF";
  toggleBtn.style.backgroundColor = isEnabled ? "#0a0" : "#a00";
};

// Load initial state from storage
chrome.storage.local.get(["autoFillEnabled"], (res) => {
  isEnabled = res.autoFillEnabled ?? true;
  window.setAutoFillState(isEnabled);
});

// Toggle handler
toggleBtn.addEventListener("click", () => {
  isEnabled = !isEnabled;
  window.setAutoFillState(isEnabled);
  chrome.storage.local.set({ autoFillEnabled: isEnabled });
});

// === OBSERVER ===
const observer = new MutationObserver((mutations) => {
  if (!isEnabled) return;

  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        const form = node.querySelector("form");
        if (form) {
          setTimeout(() => fillForm(form), 500); // Allow rendering to complete
        }
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// === FORM-FILLING UTIL ===
function setReactInputValue(input, value) {
  const setter = Object.getOwnPropertyDescriptor(input.__proto__, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function fillForm(form) {
  const inputs = form.querySelectorAll("input");

  inputs.forEach((input) => {
    console.log("input.name", input.name);
    if (input.name.includes("firstName"))
      setReactInputValue(input, getRandomName());
    if (input.name.includes("lastName"))
      setReactInputValue(input, getRandomName());
    if (input.name.includes("password"))
      setReactInputValue(input, "Qwerty@123");
    if (input.name.includes("confirmPassword"))
      setReactInputValue(input, "Qwerty@123");
  });
}

// === RANDOM NAME GEN ===
function getRandomName() {
  const names = [
    "Lukas",
    "Emma",
    "Leon",
    "Mia",
    "Ben",
    "Hannah",
    "Finn",
    "Emilia",
    "Paul",
    "Sophia",
    "Elias",
    "Lina",
    "Noah",
    "Marie",
    "Luis",
    "Lea",
    "Jonas",
    "Clara",
    "Maximilian",
    "Ella",
    "Henry",
    "Lilly",
    "Julian",
    "Anna",
    "Felix",
    "Laura",
    "Moritz",
    "Leni",
    "Theo",
    "Charlotte",
    "Mats",
    "Amelie",
    "Jakob",
    "Nele",
    "Emil",
    "Luisa",
    "Tom",
    "Ida",
    "Oskar",
    "Emily",
    "David",
    "Frida",
    "Leo",
    "Maja",
    "Anton",
    "Greta",
    "Niklas",
    "Lara",
    "Jannik",
    "Sarah",
    "Tim",
    "Nora",
    "Samuel",
    "Melina",
    "Erik",
    "Jule",
    "Fabian",
    "Isabell",
    "Philipp",
    "Alina",
    "Hannes",
    "Finja",
    "Matteo",
    "Paula",
    "Tobias",
    "Johanna",
    "Benedikt",
    "Marlene",
    "Simon",
    "Luna",
    "Aaron",
    "Ronja",
    "Jan",
    "Sophie",
    "Milan",
    "Helena",
    "Max",
    "Anni",
    "Levin",
    "Stella",
    "Florian",
    "Pia",
    "Nico",
    "Jana",
    "Valentin",
    "Mira",
    "Sebastian",
    "Carlotta",
    "Jonathan",
    "Lucia",
    "Vincent",
    "Martha",
    "Robin",
    "Tilda",
    "Julius",
    "Lotte",
    "Konstantin",
    "Zoey",
    "Linus",
    "Elisa",
  ];
  return names[Math.floor(Math.random() * names.length)];
}
