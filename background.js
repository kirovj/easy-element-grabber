// 存储数据
async function saveData(url, paragraph) {
    const result = await chrome.storage.local.get({ savedParagraphs: [] });
    const data = result.savedParagraphs.filter(item => item.url !== url);
    data.push({ url, paragraph, timestamp: new Date().toISOString() });
    await chrome.storage.local.set({ savedParagraphs: data });
}

// 接收内容脚本消息
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === "saveParagraph") {
        saveData(message.url, message.paragraph);
    }
});

// 处理快捷键命令
chrome.commands.onCommand.addListener((command) => {
    if (command === "save-paragraph") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "extractParagraph" });
        });
    }
});