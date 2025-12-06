const picker = document.getElementById("currency-picker");

console.log("picker is:", picker);

// Load saved currency
chrome.storage.sync.get(["targetCurrency"], (data) => {
  console.log("Loaded currency:", data.targetCurrency);
  picker.value = data.targetCurrency || "USD";
});

// Save when user changes
picker.addEventListener("change", () => {
  chrome.storage.sync.set({ targetCurrency: picker.value }, () => {
    console.log("Saved currency:", picker.value);
  });
});
