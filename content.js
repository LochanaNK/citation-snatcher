browser.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    if(request.action === "snag_data"){

        const selection = window.getSelection().toString();

        const author = getSmartAuthor();
        const title = getSmartTitle();

        sendResponse({
            title: title,
            url: window.location.href,
            selection: selection,
            author: author,
            date: new Date().toLocaleDateString()
        });
    }
});

function getSmartAuthor(){
    if(window.location.hostname.includes("wikipedia.org")){
        return "Wikipedia Contributors";
    }

    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if(jsonLd){
        try{
            const data = JSON.parse(jsonLd.innerText);

            if(data.author && data.author.name){
                return data.author.name;
            }
            if(data.creator &&data.creator.name){
                return data.creator.name;
            }
            if(Array.isArray(data.author) && data.author[0].name){
                return data.author[0].name;
            }
            if(data.publisher && data.publisher.name){
                return data.publisher.name;
            }
        }catch(error){
            console.log("JSON-LD parse failed", error);
        }
    }

    const metaSelectors = [
        'meta[name="author"]',
        'meta[name="twitter:creator"]',
        'meta[property="article:author"]',
        'meta[name="byl"]',
        'meta[name="dc.creator"]'
    ];

    for(const selector of metaSelectors){
        const element = document.querySelector(selector);
        if(element && element.content){
            return element.content;
        }
    }

    const authorLink = document.querySelector('a[rel="author"]');
    if(authorLink){
        return authorLink.innterText;
    }

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