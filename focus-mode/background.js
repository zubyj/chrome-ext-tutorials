// Allows extension to set initial state or perform other tasks on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({ text: 'OFF' });
});

/* 
Tracks the state of the current tab

After the user clicks on the extension action, the extension will check if the URL matches a documentation page. Next, it will
check the state of the current tab and set the next state.
*/

const extensions = 'https://developer.chrome.com/docs/extensions'
const webstore = 'https://developer.chrome.com/docs/webstore'

chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
        // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });

        const nextState = prevState === 'OFF' ? 'ON' : 'OFF';

        // Set the action badge to the next state
        chrome.action.setBadgeText({ text: nextState, tabId: tab.id });

        if (nextState === "ON") {
            // Insert the CSS file when the user turns the extension on 
            await chrome.scripting.insertCSS({
                files: ["focus-mode.css"],
                target: { tabId: tab.id },
            });
        }
        else if (nextState == "OFF") {
            // Remove the CSS file when the user turns the extension off
            await chrome.scripting.removeCSS({
                target: { tabId: tab.id },
                files: ["focus-mode.css"],
            });
        }
    }
});

