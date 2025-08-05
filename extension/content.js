// === CONSTANTS ===
const RANDOM_PLACEHOLDERS = {
  NAME: "RANDOM_NAME",
  EMAIL: "RANDOM_EMAIL",
  PHONE: "RANDOM_PHONE",
  ADDRESS: "RANDOM_ADDRESS",
  COMPANY: "RANDOM_COMPANY",
  TEXT: "RANDOM_TEXT"
};

const FORM_FILL_DELAY = 500;

// === INITIALIZATION ===
chrome.runtime.sendMessage({ type: "PING" }, (response) => {
  if (response?.type === "PONG") {
    console.log("Service worker is alive!", response);
  }
});

let isEnabled = true;
let fillPatterns = [];

// === STATE MANAGEMENT ===
window.setAutoFillState = (state) => {
  isEnabled = state;
};

window.updateFillPatterns = (newPatterns) => {
  fillPatterns = newPatterns;
};

// Load initial state from storage
chrome.storage.local.get(["autoFillEnabled", "fillPatterns"], (res) => {
  isEnabled = res.autoFillEnabled ?? true;
  fillPatterns = res.fillPatterns || [];
});

// === OBSERVER ===
const observer = new MutationObserver((mutations) => {
  if (!isEnabled) return;

  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        const form = node.querySelector("form");
        if (form) {
          setTimeout(() => fillForm(form), FORM_FILL_DELAY);
        }
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// === FORM-FILLING UTILITIES ===
function setReactInputValue(input, value) {
  const setter = Object.getOwnPropertyDescriptor(input.__proto__, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function resolveRandomValue(value) {
  const randomGenerators = {
    [RANDOM_PLACEHOLDERS.NAME]: getRandomName,
    [RANDOM_PLACEHOLDERS.EMAIL]: getRandomEmail,
    [RANDOM_PLACEHOLDERS.PHONE]: getRandomPhone,
    [RANDOM_PLACEHOLDERS.ADDRESS]: getRandomAddress,
    [RANDOM_PLACEHOLDERS.COMPANY]: getRandomCompany,
    [RANDOM_PLACEHOLDERS.TEXT]: getRandomText
  };
  
  return randomGenerators[value] ? randomGenerators[value]() : value;
}

function fillForm(form) {
  fillPatterns.forEach(pattern => {
    try {
      const elements = form.querySelectorAll(pattern.selector);
      elements.forEach(element => {
        fillElementByType(element, pattern);
      });
    } catch (error) {
      console.error(`Error applying pattern "${pattern.selector}":`, error);
    }
  });
}

function fillElementByType(element, pattern) {
  const { type, value } = pattern;
  const actualValue = resolveRandomValue(value);
  
  const fillStrategies = {
    text: () => fillTextInput(element, actualValue),
    email: () => fillTextInput(element, actualValue),
    number: () => fillNumberInput(element, actualValue),
    checkbox: () => fillCheckbox(element, actualValue),
    radio: () => fillRadio(element, actualValue),
    select: () => fillSelect(element, actualValue)
  };
  
  const strategy = fillStrategies[type] || (() => fillTextInput(element, actualValue));
  strategy();
}

function fillTextInput(element, value) {
  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    setReactInputValue(element, value);
  }
}

function fillNumberInput(element, value) {
  if (element.tagName === "INPUT") {
    const numValue = parseFloat(value) || 0;
    setReactInputValue(element, numValue.toString());
  }
}

function fillCheckbox(element, value) {
  if (element.tagName === "INPUT" && element.type === "checkbox") {
    const shouldCheck = value.toLowerCase() === "true" || value === "1";
    element.checked = shouldCheck;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function fillRadio(element, value) {
  if (element.tagName === "INPUT" && element.type === "radio" && element.value === value) {
    element.checked = true;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function fillSelect(element, value) {
  if (element.tagName === "SELECT") {
    const option = Array.from(element.options).find(opt => 
      opt.value === value || opt.textContent.trim() === value
    );
    if (option) {
      element.selectedIndex = option.index;
      element.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
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

function getRandomEmail() {
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "test.com"];
  const name = getRandomName().toLowerCase();
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const number = Math.floor(Math.random() * 999);
  return `${name}${number}@${domain}`;
}

function getRandomPhone() {
  const areaCodes = ["555", "123", "456", "789", "234"];
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
  const number = Math.floor(Math.random() * 9000000) + 1000000;
  return `${areaCode}-${number.toString().slice(0, 3)}-${number.toString().slice(3)}`;
}

function getRandomAddress() {
  const streets = ["Main St", "Oak Ave", "First St", "Second St", "Park Rd", "Elm St", "Maple Ave"];
  const streetNumber = Math.floor(Math.random() * 9999) + 1;
  const street = streets[Math.floor(Math.random() * streets.length)];
  return `${streetNumber} ${street}`;
}

function getRandomCompany() {
  const companies = [
    "TechCorp", "DataSystems", "InnovateLab", "FutureTech", "SmartSolutions",
    "GlobalTech", "NextGen", "ProActive", "DynamicSoft", "AlphaTech",
    "BetaCorp", "GammaSystems", "DeltaInnovation", "OmegaTech", "ZenithSoft"
  ];
  return companies[Math.floor(Math.random() * companies.length)];
}

function getRandomText() {
  const texts = [
    "Lorem ipsum dolor sit amet",
    "This is a test message",
    "Sample text for testing",
    "Random content here",
    "Default placeholder text",
    "Testing form filling",
    "Automated text input",
    "Demo content example"
  ];
  return texts[Math.floor(Math.random() * texts.length)];
}
