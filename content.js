browser.runtime.onMessage.addListener((request,sender,sendRsponse)=>{
    if(request.action === "snag_data"){

        const selection = window.getSelection().toString();

        const authorMeta = document.querySelector('meta[name="author"]');
        const author = authorMeta ? autherMeta :"Unknown Author";

        sendRsponse({
            title: document.title,
            url: window.location.href,
            selection: selection,
            author: author,
            date: new Date().toLocaleDateString()
        });
    }
});