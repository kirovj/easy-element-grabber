// 预设选择器（用户可自行修改）
const XPATH_SELECTOR = '//h1[@id="subject_tpc"]'; // 示例XPath
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
            const paragraph = result.singleNodeValue?.textContent?.trim();

            // 如果用正则：
            // const text = document.body.textContent;
            // const match = text.match(REGEX);
            // const paragraph = match ? match[1] : null;

            if (paragraph) {
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