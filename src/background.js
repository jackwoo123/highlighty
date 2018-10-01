/* Highlighty.js | by Stephen Wu */

const defaultOptions = {
  highlighter: [
    {
      phrases: ["Hello there", "welcome to", "Highlighty!"],
      title: "Highlighty",
      color: "purple"
    }
  ],
  baseStyles: "border-radius: 0.3rem; padding: 0.05rem; color: white; font-weight: normal; box-shadow: 1px 1px 1px 1px grey;",
  autoHighlighter: true,
  enableManualHighlight: true,
  enableTitleMouseover: true,
  enablePartialMatch: true,
  enableCaseInsensitive: true,
  keyboardShortcut: 117
};

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason == "install") {
    chrome.storage.local.set(defaultOptions, () => {
      chrome.runtime.openOptionsPage();
    });
  } else {
    /*
      When user updates, set new, missing options to their default.
      This ensures updates are not breaking for new options.
      Developers should still be cautious of modifying the structure of existing options.
    */
    chrome.storage.local.get((currentOptions) => {
      for (let option of Object.keys(defaultOptions)) {
        if (!(option in currentOptions)) {
          chrome.storage.local.set(option, defaultOptions[option]);
        }
      }
    });
  }
});

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, "highlighty");
});


function getFakeImage(on) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = (on) ? "yellow" : "black";
  ctx.fillRect(10, 10, 100, 100);

  return ctx.getImageData(50, 50, 100, 100);
}

chrome.runtime.onMessage.addListener((request) => {
  if ("autoHighlighter" in request) { // Change icon request from content script
    chrome.browserAction.setIcon({imageData: getFakeImage(request.autoHighlighter)});
  }
});
