// HTML 요소 가져오기
const blockUrlInput = document.getElementById("block-url");
const addUrlButton = document.getElementById("add-url");
const blockedList = document.getElementById("blocked-list");

/**
 * 차단 목록을 불러와 화면에 표시
 */
function loadBlockedUrls() {
  chrome.storage.sync.get(["blockedUrls"], (result) => {
    const blockedUrls = result.blockedUrls || [];
    blockedList.innerHTML = ""; // 기존 목록 초기화
    blockedUrls.forEach((url) => {
      const listItem = document.createElement("li");
      listItem.textContent = url;

      // 삭제 버튼 추가
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.style.marginLeft = "10px";
      deleteButton.addEventListener("click", () => {
        deleteBlockedUrl(url);
      });

      listItem.appendChild(deleteButton);
      blockedList.appendChild(listItem);
    });
  });
}

/**
 * 차단 목록에 URL 추가
 * @returns void
 */
function addBlockedUrl() {
  const url = blockUrlInput.value.trim();
  if (!url) {
    alert("Please enter a valid URL.");
    return;
  }

  chrome.storage.sync.get(["blockedUrls"], (result) => {
    const blockedUrls = result.blockedUrls || [];
    if (blockedUrls.includes(url)) {
      alert("This URL is already in the blocked list.");
      return;
    }

    blockedUrls.push(url);
    chrome.storage.sync.set({ blockedUrls }, () => {
      blockUrlInput.value = ""; // 입력 필드 초기화
      loadBlockedUrls(); // 목록 새로고침
    });
  });
}

/**
 * 차단 목록에서 URL 삭제
 * @param {string} url 
 */
function deleteBlockedUrl(url) {
  chrome.storage.sync.get(["blockedUrls"], (result) => {
    const blockedUrls = result.blockedUrls || [];
    const updatedUrls = blockedUrls.filter((blockedUrl) => blockedUrl !== url);
    chrome.storage.sync.set({ blockedUrls: updatedUrls }, () => {
      loadBlockedUrls(); // 목록 새로고침
    });
  });
}

// 이벤트 리스너 등록
addUrlButton.addEventListener("click", addBlockedUrl);

// 초기화
loadBlockedUrls();
