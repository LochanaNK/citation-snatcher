document.getElementById("snag-btn").addEventListener("click", async()=>{

    const statusDiv = document.getElementById("status");
    const resultBox = document.getElementById("result-box");

    try{
        const tabs = await browser.tabs.query({active:true, currentWindow:true});
        const activeTab = tabs[0];

        const response = await browser.tabs.sendMessage(activeTab,id,{action:"snag_data"});

        if(response)
        {
            const citaion = `${response.author}.(${response.date}).(${response.title})."(${response.selection})".Retrieved from (${response.url})`;

            resultBox.value = citaion;
            statusBox.value = "Copied to clipboard!";
        }

    }catch(error)
    {
        console.error("Error: ",error);
        resultBox.value = "Error: Could not grab text. Make sure to select some text on the page.";
    }
});