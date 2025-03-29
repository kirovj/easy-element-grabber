// 预设选择器（用户可自行修改）
const XPATH_SELECTOR = '//a[@id="t_tt1_0"]'; // 示例XPath
// 或使用正则表达式：const REGEX = /Important: (.+?)\b/;

// 处理提取请求
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractParagraph") {
        try {
            // 使用XPath
            const result = document.evaluate(
                XPATH_SELECTOR,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            );
            let paragraph = result.singleNodeValue?.textContent?.trim();

            // 如果用正则：
            // const text = document.body.textContent;
            // const match = text.match(REGEX);
            // const paragraph = match ? match[1] : null;

            if (paragraph) {
                // 截取到第一个空格并转大写
                let formatted = paragraph.split(' ')[0].toUpperCase();
                paragraph = formatted;
                console.log("get success: ", paragraph);

                chrome.runtime.sendMessage({
                    action: "saveParagraph",
                    url: window.location.href,
                    paragraph: paragraph
                });
            }
        } catch (error) {
            console.error("提取失败:", error);
        }
    }
});

// 初始化通知元素（确保只创建一次）
let notificationElement = null;

function ensureNotification() {
    if (!notificationElement) {
        notificationElement = document.createElement('div');
        notificationElement.id = 'custom-notification';
        notificationElement.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: -300px;
      padding: 12px 20px;
      background: #4CAF50;
      color: white;
      border-radius: 4px;
      transition: right 0.3s;
      z-index: 9999;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      display: none; /* 初始隐藏 */
    `;
        document.body.appendChild(notificationElement);
    }
    return notificationElement;
}

// 接收消息处理
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "showNotification") {
        const notification = ensureNotification();
        const count = message.count ?? '未知数量';
        notification.textContent = `已捕获 ${count} 个目标`;
        notification.style.display = 'block';
        notification.style.right = '20px';

        setTimeout(() => {
            notification.style.right = '-300px';
            // 动画结束后隐藏
            setTimeout(() => notification.style.display = 'none', 300);
        }, 2000);
    }
    return true; // 保持消息通道开放
});

// 在文档加载时预初始化
document.addEventListener('DOMContentLoaded', ensureNotification);