work();

function work(){
    chrome.runtime.onMessage.addListener(receiveMessageFromBackground);
}

async function receiveMessageFromBackground(message, sender, sendResponse) {
    const { text } = message; // placeholder

    let urlParams = new URLSearchParams(window.location.search);
    let size = urlParams.get('size');

    console.log(size)
    if (size === null || size !== "100") {
        urlParams.set('size', 100);
        window.location.search = urlParams.toString();
        return;
    }

}