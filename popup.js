document.getElementById("snag-btn").addEventListener("click", async()=>{

    const statusDiv = document.getElementById("status");
    const resultBox = document.getElementById("result-box");

    statusDiv.textContent = "";
    resultBox.value = "Snagging...";

    try{
        const tabs = await browser.tabs.query({active:true,currentWindow:true});
        const activeTab = tabs[0];

        if(!activeTab || !activeTab.url || activeTab.url.startsWith("about:") || activeTab.url.startsWith("mozilla:")){
            throw new Error("Cannot run on internal browser pages.");
        }
        try{
            await sendMessageToTab(activeTab.id);
        }catch(error){
            console.log("Injecting script...");
            await browser.scripting.executeScript({
                target: {tabId: activeTab.id},
                files:["content.js"]
            });
            await sednMessageToTab(activeTab.id);
        }
    }catch(error){
        console.error("Dtailed Error:",error);
        resultBox.valu = `Error: ${error.message}`;
        statusDiv.textContent = "❌ Failed";
        statusDiv.style.color = "red";
    }
});

async function sendMessageToTab(tabId){
    const response = await browser.tabs.sendMessage(tabId,{action: "snag_data"});
    if(!response){
        throw new Error("No response.");
    }
    const resultBox = document.getElementById("result-box");
    const statusDiv = document.getElementById("status");

    const format = document.getElementById("format-select").value;

    const citation = formatCitation(response,format);

    resultBox.value = citation;
    navigator.clipboard.writeText(citation);

    statusDiv.textContent = "✅ Snagged and copied to clipboard!";
    statusDiv.style.color = "green";
}

function formatCitation(data,format){
    const author = data.author;
    const title = data.title;
    const url = data.url;
    const siteName = data.siteName;

    const today = new Date();
    const accessedDate = `${today.toLocaleString('default', { month: 'short' })}. ${today.getDate()}, ${today.getFullYear()}`;
    const pubYear = new Date().getFullYear();

    //IEEE format
    if(format === "ieee"){
        let ieeeAuthor = author;
        if(author.includes(" ") && !author.includes("Contributors")){
            const parts = author.split();
            const last = parts.pop();
            const first = parts[0];
            if(first && last){
                ieeeAuthor = `${first[0]}. ${last}`;
            }
        }

        const domain = new URL(url).hostname.replace("www.", "");

        return `[1] ${ieeeAuthor}, "${title}," ${domain}, ${pubYear}. [Online]. Available: ${url}. [Accessed: ${accessedDate}].`;
    }
    else if(format === "mla"){
        return `${author}. "${title}." ${siteName}, ${url}. Accessed ${accessedDate}.`;
    }

    else{

        //APA format
        return `${author}. (${pubYear}). ${title}. Retrieved from ${url}`;
    }
}