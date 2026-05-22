browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "snag_data") {
    const selection = window.getSelection().toString();

    const author = getSmartAuthor();
    const title = getSmartTitle();
    const siteName = getSiteName();

    sendResponse({
      title: title,
      url: window.location.href,
      selection: selection,
      author: author,
      siteName: siteName,
      date: new Date().toLocaleDateString(),
    });
  }
});

function getSmartAuthor() {
  if (window.location.hostname.includes("wikipedia.org")) {
    return "Wikipedia Contributors";
  }

  //method 1: high-priority academic meta tags
  const academicSelectors = [
    'meta[name="citation_author"]',
    'meta[name="dc.Description.keyInvestigators"]',
  ];

  for (const selector of academicSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      const authors = Array.from(elements)
        .map((el) => (el.content ? el.content.trim() : ""))
        .filter(Boolean);

      if (authors.length > 0) {
        console.log("Found via Academic Meta Tags:", authors);
        return combineAuthors(authors);
      }
    }
  }

  //method 2: Robust Multi-Author HTML Link Scraping
  const authorElements = document.querySelectorAll(
    'a[rel="author"], a[href*="/author/"], button[data-xocs-content-type="author"], .react-xocs-alternative-link',
  );

  if (authorElements.length > 0) {
    const authors = [];

    authorElements.forEach((el) => {
      // 1. PREFERRED MATCH: Directly check for explicit academic name structures
      const givenNameEl = el.querySelector(".given-name");
      const surnameEl = el.querySelector(".surname");

      if (givenNameEl && surnameEl) {
        const fullName = `${givenNameEl.innerText.trim()} ${surnameEl.innerText.trim()}`;
        if (fullName.length > 1 && !authors.includes(fullName)) {
          authors.push(fullName);
        }
      }
      // 2. FALLBACK MATCH: For basic personal blogs that don't use structured spans
      else if (
        !el.closest("header") &&
        !el.closest("nav") &&
        el.tagName !== "BUTTON"
      ) {
        const clone = el.cloneNode(true);

        // Remove footprints, annotations, and visual icons
        clone
          .querySelectorAll(
            "button, svg, img, .author-ref, [class*='author-ref']",
          )
          .forEach((subEl) => subEl.remove());

        let name = clone.innerText.trim();

        // Strip out footnote suffix letters (like " a", " b")
        name = name.replace(/\s+[a-z]$/i, "").trim();
        // Clean up numbers, symbols, and commas
        name = name.replace(/[\d,✉️*†‡§#\s​]+$/g, "").trim();
        name = name.replace(/^[,.\s]+/g, "").trim();

        // Guard against stray functional terms
        const UIKeywords = [
          "help",
          "cite",
          "share",
          "download",
          "abstract",
          "outline",
          "show",
        ];
        const isUIButton = UIKeywords.some((keyword) =>
          name.toLowerCase().includes(keyword),
        );

        if (
          name &&
          !isUIButton &&
          !authors.includes(name) &&
          name.length > 1 &&
          name.toLowerCase() !== "email author" &&
          !name.includes(",")
        ) {
          authors.push(name);
        }
      }
    });

    if (authors.length > 0) {
      console.log("Found via HTML Scraping Links/Buttons:", authors);
      return combineAuthors(authors);
    }
  }

  //method 3 : JSON-LD
  const jsonLd = document.querySelector('script[type="application/ld+json"]');
  if (jsonLd) {
    try {
      const cleanJsonString = jsonLd.innerText.replace(/[\u0000-\u0019]+/g, "");
      const data = JSON.parse(cleanJsonString);

      if (Array.isArray(data.author)) {
        const authors = data.author
          .map((a) => (typeof a === "object" ? a.name : a))
          .filter(Boolean);
        if (authors.length > 0) return combineAuthors(authors);
      } else if (data.author) {
        if (data.author.name) return data.author.name;
        if (typeof data.author === "string") return data.author;
      }
    } catch (error) {
      console.log("JSON-LD parse failed", error);
    }
  }

  //method 4: common meta tags
  const metaSelectors = [
    'meta[name="author"]',
    'meta[property="article:author"]',
    'meta[name="dc.creator"]',
  ];

  for (const selector of metaSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      const authors = Array.from(elements)
        .map((el) => (el.content ? el.content.trim() : ""))
        .filter(Boolean);

      if (authors.length > 0) {
        return combineAuthors(authors);
      }
    }
  }

  const singleMetaSelectors = [
    'meta[name="twitter:creator"]',
    'meta[name="byl"]',
  ];
  for (const selector of singleMetaSelectors) {
    const element = document.querySelector(selector);
    if (element && element.content) return element.content.trim();
  }

  //method 5: og:site_name fallback
  const siteName = document.querySelector('meta[property="og:site_name"]');
  if (siteName && siteName.content) {
    return siteName.content;
  }

  return "Unknown Author";
}

function getSmartTitle() {
  const ogTitle = document.querySelector('meta[property="og:title"]');

  if (ogTitle && ogTitle.content) {
    return ogTitle.content;
  }
  return document.title;
}

function getSiteName() {
  const siteName = document.querySelector('meta[property="og:site_name"]');
  if (siteName && siteName.content) {
    return siteName.content;
  }

  return window.location.hostname.replace("www.", "");
}

function combineAuthors(authorArray) {
  if (!Array.isArray(authorArray) || authorArray.length === 0)
    return "Unknown Author";
  if (authorArray.length === 1) return authorArray[0];
  if (authorArray.length === 2)
    return `${authorArray[0]} and ${authorArray[1]}`;

  return (
    authorArray.slice(0, -1).join(", ") +
    ", and " +
    authorArray[authorArray.length - 1]
  );
}
