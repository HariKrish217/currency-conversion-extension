// ---------------------------------------------------------
//  DETECT TEXT SELECTION
document.addEventListener("mouseup", () => {
  const selected = window.getSelection().toString().trim();
  if (!selected) return;

  chrome.runtime.sendMessage({
    type: "TEXT_SELECTED",
    text: selected
  });
});

// ---------------------------------------------------------
// LISTEN FOR BACKGROUND MESSAGES
chrome.runtime.onMessage.addListener(async (msg) => { 

  if (msg.type === "RUN_TESSERACT") {
    await handleOCR(msg.imageUrl);
  }

  if (msg.type === "SHOW_POPUP") {
    showPopup(msg.value);
  }
});

// ---------------------------------------------------------
// OCR HANDLER 
async function handleOCR(imageUrl) {
  showPopup("Scanning image...");

  try {
    const base64 = await imageToBase64(imageUrl);

    const result = await Tesseract.recognize(base64, "eng", {
      logger: m => console.log("OCR:", m)
    });

    if (!result || !result.data || !result.data.text) {
      showPopup("Could not read text.");
      return;
    }

    const text = result.data.text.trim();
    console.log("OCR Result:", text);


    chrome.runtime.sendMessage({
      type: "OCR_TEXT",
      text
    });

  } catch (err) {
    console.error("OCR Error:", err);
    showPopup("OCR failed.");
  }
}

// ---------------------------------------------------------
// Convert IMAGE URL → BASE64
async function imageToBase64(url) {
  const res = await fetch(url); 
  const blob = await res.blob();

  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// ---------------------------------------------------------
// Popup UI
function showPopup(text) {
  const popup = document.createElement("div");
  popup.innerText = text;

  Object.assign(popup.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "14px 18px",
    background: "rgba(30,30,30,0.9)",
    color: "#fff",
    fontSize: "15px",
    fontFamily: "Arial, sans-serif",
    borderRadius: "10px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
    zIndex: "999999",
    opacity: "0",
    transform: "translateY(-10px)",
    transition: "all 0.25s ease"
  });

  document.body.appendChild(popup);

  requestAnimationFrame(() => {
    popup.style.opacity = "1";
    popup.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    popup.style.opacity = "0";
    popup.style.transform = "translateY(-10px)";
    setTimeout(() => popup.remove(), 250);
  }, 3000);
}

// Debug
console.log("Is Tesseract available?", window.Tesseract);
