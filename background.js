async function saveData(url, paragraph) {
    const result = await chrome.storage.local.get({ savedParagraphs: [] });
    const data = result.savedParagraphs;
    data.push({
        url,
        paragraph,
        timestamp: new Date().toISOString(),
        hostname: new URL(url).hostname // 添加域名便于后续分析
    });
    await chrome.storage.local.set({ savedParagraphs: data });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
        if (message.action === "saveParagraph") {
            saveData(message.url, message.paragraph);
            // 向来源标签页发送确认通知
            chrome.tabs.sendMessage(sender.tab.id, {
                action: "showNotification",
                count: message.paragraphs?.length || 1 // 确保数值存在
            });
        }
    } catch (error) {
        console.error('消息处理失败:', error);
        // 向内容脚本发送错误通知
        chrome.tabs.sendMessage(sender.tab.id, {
            action: "showNotification",
            error: true,
            message: '操作失败，请刷新页面重试'
        });
    }
    return true;
});

// 处理快捷键命令
chrome.commands.onCommand.addListener((command) => {
    if (command === "save-paragraph") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "extractParagraph" });
        });
    }
});

