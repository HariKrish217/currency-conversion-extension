# Smart Currency OCR Converter  
A Chrome extension that converts prices detected from **text selection** or **OCR on images** into your preferred currency — instantly, accurately, and beautifully.

Powered by **Tesseract.js OCR**, smart regex cleaning, and live exchange rates.  
Perfect for travelers, shoppers, students, and anyone browsing global prices.

---

### Features

#### *OCR (Optical Character Recognition)*
Right-click on any image → **Extract prices automatically**  
Works on:
- Product photos  
- Posters  
- Menu screenshots  
- Ads  
- Pricing banners  

#### *Text Selection Conversion*
Select any text like:
$20
€15.99
₹2,099
£49
(currently works for dollars,euros,britsh pound and ruppees)

The extension instantly converts it to your selected currency.

#### *Live Exchange Rates*
Uses real-time conversion via exchangerate-api.
Your Choice of Output Currency
Choose from:
- INR  
- USD  
- EUR  
- GBP  
- JPY
- you can add currency of your own choice 

Stored using Chrome Sync — your preference is always remembered.

#### *Smart OCR Cleaning*
Fixes common OCR issues:
- Broken spacing (`2 95` → `2.95`)
- OCR noise removal  
- Symbol extraction (`$`, `₹`, `€`, `£`)  
- Misread characters (`g g`, `O`, etc.)

---
### *Folder structure*
smart-currency-ocr-extension/
│  
├── manifest.json  
├── background.js  
├── content.js  
├── popup.html  
├── popup.js  
├── styles.css  
│  
├── icons/  
│   ├── icon16.png  
│   ├── icon32.png  
│   ├── icon48.png  
│   └── icon128.png  

---

### *Support the Project*

If you find this extension useful:
Star the GitHub repo
Share it with friends
Contribute ideas or improvements

# *Author*
Built by *Arch*



    
