# Citation Snatcher 🎓

> **Stop wasting time formatting bibliographies.** Snag citations in seconds directly from your browser.

**Citation Snatcher** is a lightweight Firefox extension designed to streamline research for students and developers. Simply highlight text on any webpage, click the extension, and instantly generate a perfectly formatted citation (APA or IEEE) copied to your clipboard.

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

## 🛠️ Installation (Developer Mode)

Since this is a custom extension, you load it through Firefox's debugging tool.

1.  **Download/Clone** this repository to a folder on your computer.
2.  Open Firefox and type **`about:debugging`** in the address bar.
3.  Click on **"This Firefox"** in the left sidebar.
4.  Click the **"Load Temporary Add-on..."** button.
5.  Navigate to your folder and select the **`manifest.json`** file.

*The extension icon should now appear in your browser toolbar.*

---

## 📖 How to Use

1.  **Browse:** Navigate to any article or webpage (e.g., a Wikipedia page).
2.  **Select:** Highlight the text you want to quote.
3.  **Click:** Open the **Citation Snatcher** extension icon.
4.  **Format:** Choose **APA** or **IEEE** from the dropdown menu.
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
├── popup.js        # Logic: Handles the formatting (APA/IEEE) and UI updates.
└── content.js      # Script: Injected into the page to scrape Author, Title, and URL.
