chrome.tabs.onUpdated.addListener(sendMessageToContentScript);

async function sendMessageToContentScript(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && tab.url && tab.url.includes(".eolymp.io/scoreboard")){
        var message = {
            text: 'test'
        };
        chrome.tabs.sendMessage(tabId, message);
    }
}