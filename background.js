chrome.runtime.onInstalled.addListener(() => {
  console.log("Service worker installed/updated");
});


// ---------------------------------------------------
// CLEAN OCR NOISE
function cleanOCRText(text) {
  return text
    .replace(/[^\w\s$.€£₹]/g, " ")  
    .replace(/\s+/g, " ")           
    .trim();
}

// ---------------------------------------------------
// FIX BROKEN OCR NUMBERS

function repairBrokenNumbers(text) {
  return text
    .replace(/(\d)\s?g\s?g\s?(\d)/gi, "$1.$2") 
    .replace(/(\d)\s?O\s?(\d)/gi, "$1.$2")      
    .replace(/(\d)\s+(\d{2})\b/g, "$1.$2")      
    .replace(/\s+/g, " ");
}


// ---------------------------------------------------
//SMART PRICE EXTRACTION FROM TEXT
function extractSmartPrices(text) {
  let cleaned = cleanOCRText(text);
  cleaned = repairBrokenNumbers(cleaned);

  const regex = /([₹$€£])\s*\d[\d,]*(?:\.\d+)?/g;
  let matches = cleaned.match(regex);

  if (!matches) return [];

  return matches.map(m => m.replace(/\s+/g, ""));
}

// Extract currency details from selected text
function parseCurrency(text) {
  const match = text.match(/([₹$€£])\s?(\d[\d,]*(?:\.\d+)?)/);

  if (!match) return null;

  const symbol = match[1];
  const amount = parseFloat(match[2].replace(/,/g, ""));

  const currencyMap = {
    "$": "USD",
    "₹": "INR",
    "€": "EUR",
    "£": "GBP"
  };

  return {
    from: currencyMap[symbol],
    amount
  };
}



// Actual API conversion
async function getConvertedValue(amount, from, to) {
  const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
  const data = await res.json();
  return amount * data.rates[to];
}

// Main listener
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "TEXT_SELECTED") {
    const parsed = parseCurrency(msg.text);
    if (!parsed) return;

    const { from, amount } = parsed;
    console.log(amount)

    // Get user-selected target currency
    chrome.storage.sync.get("targetCurrency", async (data) => {
      const toCurrency = data.targetCurrency || "USD";

      const converted = await getConvertedValue(amount, from, toCurrency);

      // Send popup message back to content script
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "SHOW_POPUP",
        value: `${msg.text} = ${toCurrency} ${converted.toFixed(2)}`
      });
    });
  }


  if (msg.type === "OCR_TEXT") {
    const prices = extractSmartPrices(msg.text);


    if (prices.length === 0) {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "SHOW_POPUP",
        value: "No valid price found in image."
      });
      return;
    }
    const parsed = parseCurrency(prices[1]);
    if (!parsed) return;

    const { from, amount } = parsed;
    console.log(amount)

    // Get user-selected target currency
    chrome.storage.sync.get("targetCurrency", async (data) => {
      const toCurrency = data.targetCurrency || "USD";

      const converted = await getConvertedValue(amount, from, toCurrency);
      console.log(converted);

      // Send popup message back to content script
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "SHOW_POPUP",
        value: `${prices[1]} = ${toCurrency} ${converted.toFixed(2)}`
      });
    });

    chrome.tabs.sendMessage(sender.tab.id,{
        type: "SHOW_POPUP",
        value: prices[1]
      },
    );
    console.log(prices)
  }
  return true;
});

//context-menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "tesseract-ocr",
    title: "Extract Text (Tesseract OCR)",
    contexts: ["image"]
  });
  return true;
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "tesseract-ocr") {
    chrome.tabs.sendMessage(tab.id, {
      type: "RUN_TESSERACT",
      imageUrl: info.srcUrl
    });
  }
  return true;
});


