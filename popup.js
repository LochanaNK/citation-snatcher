document.getElementById("snag-btn").addEventListener("click", async () => {
  const statusDiv = document.getElementById("status");
  const resultBox = document.getElementById("result-box");

  statusDiv.textContent = "";
  resultBox.value = "Snagging...";

  try {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const activeTab = tabs[0];

    if (
      !activeTab ||
      !activeTab.url ||
      activeTab.url.startsWith("about:") ||
      activeTab.url.startsWith("mozilla:")
    ) {
      throw new Error("Cannot run on internal browser pages.");
    }
    try {
      await sendMessageToTab(activeTab.id);
    } catch (error) {
      console.log("Injecting script...");
      await browser.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ["content.js"],
      });
      await sednMessageToTab(activeTab.id);
    }
  } catch (error) {
    console.error("Dtailed Error:", error);
    resultBox.valu = `Error: ${error.message}`;
    statusDiv.textContent = "❌ Failed";
    statusDiv.style.color = "red";
  }
});

async function sendMessageToTab(tabId) {
  const response = await browser.tabs.sendMessage(tabId, {
    action: "snag_data",
  });
  if (!response) {
    throw new Error("No response.");
  }
  const resultBox = document.getElementById("result-box");
  const statusDiv = document.getElementById("status");

  const format = document.getElementById("format-select").value;

  const citation = formatCitation(response, format);

  resultBox.value = citation;
  navigator.clipboard.writeText(citation);

  statusDiv.textContent = "✅ Snagged and copied to clipboard!";
  statusDiv.style.color = "green";
}

function formatCitation(data, format) {
  const author = data.author;
  const title = data.title;
  const url = data.url;
  const siteName = data.siteName;

  const today = new Date();
  const accessedDate = `${today.toLocaleString("default", { month: "short" })}. ${today.getDate()}, ${today.getFullYear()}`;
  const pubYear = new Date().getFullYear();
  const shortMonth = today.toLocaleString("default", { month: "short" });
  const day = today.getDate();

  const isMultiAuthor = author.includes(",") || author.includes(" and ");
  const isSpecialAuthor =
    author.includes("Contributors") ||
    author.toLowerCase() === "unknown author";
  const nameParts =
    isSpecialAuthor || isMultiAuthor ? [] : author.trim().split(/\s+/);

  //IEEE format
  if (format === "ieee") {
    let ieeeAuthor = author;
    // Only flip names if it's a single person's name (e.g., "Shan Wang")
    if (nameParts.length > 1) {
      const lastName = nameParts.pop();
      const initials = nameParts
        .map((name) => `${name[0].toUpperCase()}.`)
        .join(" ");
      ieeeAuthor = `${initials} ${lastName}`;
    }

    const domain = new URL(url).hostname.replace("www.", "");

    return `[1] ${ieeeAuthor}, "${title}," ${domain}, ${pubYear}. [Online]. Available: ${url}. [Accessed: ${accessedDate}].`;
  }

  //mla format
  else if (format === "mla") {
    return `${author}. "${title}." ${siteName}, ${url}. Accessed ${accessedDate}.`;
  }

  //chicago format
  else if (format === "chicago") {
    let chicagoAuthor = author;
    if (nameParts.length > 1) {
      const lastName = nameParts.pop();
      const firstNames = nameParts.join(" ");
      chicagoAuthor = `${lastName}, ${firstNames}`;
    }
    return `${chicagoAuthor}. ${pubYear}. "${title}." ${siteName}. Accessed ${accessedDate}. ${url}.`;
  }

  //harvard format
  else if (format === "harvard") {
    let harvardAuthor = author;
    if (nameParts.length > 1) {
      const lastName = nameParts.pop();
      const initials = nameParts.map((name) => name[0].toUpperCase()).join("");
      harvardAuthor = `${lastName}, ${initials}.`;
    }
    return `${harvardAuthor}, ${pubYear}. *${title}*. ${siteName}. Available at: <${url}> [Accessed ${day} ${shortMonth} ${pubYear}].`;
  }

  //vancouver format
  else if (format === "vancouver") {
    let vancouverAuthor = author;
    if (nameParts.length > 1) {
      const lastName = nameParts.pop();
      const initials = nameParts.map((name) => name[0].toUpperCase()).join("");
      vancouverAuthor = `${lastName} ${initials}`;
    }
    return `[1] ${vancouverAuthor}. ${title}. ${siteName}; ${pubYear} [cited ${pubYear} ${shortMonth} ${day}]. Available from: ${url}`;
  }

  //apa format
  else {
    return `${author}. (${pubYear}). ${title}. Retrieved from ${url}`;
  }
}
