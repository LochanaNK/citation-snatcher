# Citation Snatcher 🎓

> **Stop wasting time formatting bibliographies.** Snag citations in seconds directly from your browser.

**Citation Snatcher** is a lightweight Firefox extension designed to streamline research for students and developers. Simply highlight text on any webpage, click the extension, and instantly generate a perfectly formatted citation (APA, MLA or IEEE) copied to your clipboard.

It features **"Smart Detection"** logic that can find author names even on complex sites like Wikipedia, news blogs, and academic journals.

---

## ✨ Features

* **⚡️ Instant Snagging:** Generate a citation with just two clicks.
* **📋 Auto-Copy:** The result is automatically copied to your clipboard, ready to paste.
* **🔄 Multi-Format Support:** Switch between **APA (7th Edition)**, **MLA** and **IEEE** styles via a dropdown menu.
* **🧠 Smart Author Detection:** Intelligently extracts metadata by checking:
    * **Wikipedia:** Detects community articles and cites "Wikipedia Contributors."
    * **JSON-LD:** Reads hidden SEO data on modern news sites (e.g., NYTimes, Medium).
    * **Meta Tags:** Scans standard HTML tags (`<meta name="author">`).
    * **Fallbacks:** Gracefully defaults to the website name if no human author is found.
* **🔒 Privacy-First:** All processing happens locally in your browser. No data is sent to external servers.

---
## 🛠️ Installation

### 🦊 For Firefox (Recommended)
You can install the extension directly from the official store:
👉 **[Get Citation Snatcher on Firefox Add-ons](YOUR_AMO_STORE_LINK_HERE)**

---

### 🌐 For Google Chrome, Brave, Edge, and Opera
Since the extension utilizes the standard **Manifest V3** structure, you can easily load it manually into any Chromium-based browser:

1. **Download / Clone** this repository as a ZIP file to your computer and unzip it.
2. Open your Chromium browser and navigate to **`chrome://extensions/`** in the address bar.
3. In the top-right corner of the Extensions page, toggle the **"Developer mode"** switch to **ON**.
4. Click the **"Load unpacked"** button that appears in the top-left corner.
5. Select the unzipped folder containing your project files (the folder that has your `manifest.json`).

*The Citation Snatcher icon will now appear in your browser toolbar! (You may need to click the puzzle piece 🧩 extension icon to pin it).*

---

## 📖 How to Use

1.  **Browse:** Navigate to any article or webpage (e.g., a Wikipedia page).
2.  **Select:** Highlight the text you want to quote.
3.  **Click:** Open the **Citation Snatcher** extension icon.
4.  **Format:** Choose **APA**, **MLA** or **IEEE** from the dropdown menu.
5.  **Snag:** Click the **"Snag Selection"** button.

✅ The formatted citation will appear in the text box and be copied to your clipboard!

---

## 📂 Project Structure

This extension uses **Manifest V3** and vanilla JavaScript (no build step required).

```text
citation-snatcher/
│
├── manifest.json   # Configuration: Permissions (activeTab, scripting) and metadata.
├── popup.html      # UI: The popup window with the dropdown and buttons.
├── popup.js        # Logic: Handles the formatting (APA, MLA, IEEE) and UI updates.
└── content.js      # Script: Injected into the page to scrape Author, Title, and URL.
