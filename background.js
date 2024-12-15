/**
 * 차단할 URl 목록을 Chrome Storage 에서 가져와 인자로 들어온 Callback 함수를 실행시키는 함수
 * @param {function} callback 차단 목록의 URL 이라면 실행할 함수
 */
const getBlockedUrls = callback => {
    chrome.storage.sync.get(["blockedUrls"], result => {
        const urls = result.blockedUrls || [];
        callback(urls);
    })
};

chrome.webNavigation.onBeforeNavigate.addListener(details => {
    getBlockedUrls(blockedUrls => {
        const url = details.url;

        if (blockedUrls.some((blockedUrl => url.includes(blockedUrl)))) {
            chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("/html/blocked.html") });
        }
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
      blockedUrls: ["https://github.com"],
    });
})