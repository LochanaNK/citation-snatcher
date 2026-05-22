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
            date: new Date().toLocaleDateString()
        });
    }
});

function getSmartAuthor(){
    if (window.location.hostname.includes("wikipedia.org")) {
        return "Wikipedia Contributors";
    }
    //method 1: author link
    const authorElements = document.querySelectorAll('a[rel="author"], a[href*="/author/"]');
    if (authorElements.length > 0) {
        const authors = [];
        authorElements.forEach(el => {
            // cloning to remove superscripts and icons
            const clone = el.cloneNode(true);
            
            // Remove superscripts (like a 1, b 2) and button/icon elements commonly inside author blocks
            clone.querySelectorAll('sup, sub, button, svg, img, .icon').forEach(subEl => subEl.remove());
            
            let name = clone.innerText.trim();
            
            // Clean up residual punctuation or trailing markers if any
            name = name.replace(/[\d,✉️*†‡§#]+$/g, '').trim(); 
            
            if (name && !authors.includes(name) && name.length > 1) {
                authors.push(name);
            }
        });

        if (authors.length > 0) {
            return combineAuthors(authors);
        }
    }
    //method 2 : JSON-LD
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
        try {
            // Remove control characters to prevent JSON parsing failures
            const cleanJsonString = jsonLd.innerText.replace(/[\u0000-\u0019]+/g, "");
            const data = JSON.parse(cleanJsonString);

            // If author is an array of objects: [{name: "Shan Wang"}, {name: "Fang Wang"}]
            if (Array.isArray(data.author)) {
                const authors = data.author.map(a => typeof a === 'object' ? a.name : a).filter(Boolean);
                if (authors.length > 0) return combineAuthors(authors);
            } 
            // If author is a single object or single string
            else if (data.author) {
                if (data.author.name) return data.author.name;
                if (typeof data.author === 'string') return data.author;
            }

            if (data.creator && data.creator.name) return data.creator.name;
        } catch (error) {
            console.log("JSON-LD parse failed", error);
        }
    }
    //method 3: common meta tags
    const metaSelectors = [
        'meta[name="author"]',
        'meta[property="article:author"]',
        'meta[name="dc.creator"]'
    ];

    for (const selector of metaSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            const authors = Array.from(elements)
                .map(el => el.content ? el.content.trim() : '')
                .filter(Boolean);
            
            if (authors.length > 0) {
                return combineAuthors(authors);
            }
        }
    }

    const singleMetaSelectors = ['meta[name="twitter:creator"]', 'meta[name="byl"]'];
    for (const selector of singleMetaSelectors) {
        const element = document.querySelector(selector);
        if (element && element.content) return element.content.trim();
    }
   
    //method 4: og:site_name
    const siteName = document.querySelector('meta[property="og:site_name"]');
    if(siteName && siteName.content){
        return siteName.content;
    }

    return "Unknown Author";
}

function getSmartTitle(){
    const ogTitle = document.querySelector('meta[property="og:title"]');

    if(ogTitle && ogTitle.content){
        return ogTitle.content;
    }
    return document.title;
}
function getSiteName(){
    const siteName = document.querySelector('meta[property="og:site_name]');
    if(siteName && siteName.content){
        return siteName.content;
    }
    return document.siteName;
}
