chrome.runtime.sendMessage({ type: "PING" }, (response) => {
  if (response?.type === "PONG") {
    console.log("Service worker is alive!", response);
  }
});

let isEnabled = true;

// Update state from popup
window.setAutoFillState = (state) => {
  isEnabled = state;
};

// Load initial state from storage
chrome.storage.local.get(["autoFillEnabled"], (res) => {
  isEnabled = res.autoFillEnabled ?? true;
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

let fillPatterns = [];

// Load patterns from storage
chrome.storage.local.get(["fillPatterns"], (res) => {
  fillPatterns = res.fillPatterns || [];
});

// Update patterns when changed from popup
window.updateFillPatterns = (newPatterns) => {
  fillPatterns = newPatterns;
};

// === FORM-FILLING UTIL ===
function setReactInputValue(input, value) {
  const setter = Object.getOwnPropertyDescriptor(input.__proto__, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
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
  let actualValue = value;
  
  // Handle random placeholders
  if (value === "RANDOM_NAME") {
    actualValue = getRandomName();
  } else if (value === "RANDOM_EMAIL") {
    actualValue = getRandomEmail();
  } else if (value === "RANDOM_PHONE") {
    actualValue = getRandomPhone();
  } else if (value === "RANDOM_ADDRESS") {
    actualValue = getRandomAddress();
  } else if (value === "RANDOM_COMPANY") {
    actualValue = getRandomCompany();
  } else if (value === "RANDOM_TEXT") {
    actualValue = getRandomText();
  }
  
  switch (type) {
    case "text":
    case "email":
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        setReactInputValue(element, actualValue);
      }
      break;
      
    case "number":
      if (element.tagName === "INPUT") {
        const numValue = parseFloat(actualValue) || 0;
        setReactInputValue(element, numValue.toString());
      }
      break;
      
    case "checkbox":
      if (element.tagName === "INPUT" && element.type === "checkbox") {
        const shouldCheck = actualValue.toLowerCase() === "true" || actualValue === "1";
        element.checked = shouldCheck;
        element.dispatchEvent(new Event("change", { bubbles: true }));
      }
      break;
      
    case "radio":
      if (element.tagName === "INPUT" && element.type === "radio") {
        if (element.value === actualValue) {
          element.checked = true;
          element.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      break;
      
    case "select":
      if (element.tagName === "SELECT") {
        const option = Array.from(element.options).find(opt => 
          opt.value === actualValue || opt.textContent.trim() === actualValue
        );
        if (option) {
          element.selectedIndex = option.index;
          element.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      break;
      
    default:
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        setReactInputValue(element, actualValue);
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
