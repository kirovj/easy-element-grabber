document.addEventListener('DOMContentLoaded', loadData);
document.getElementById('copyAll').addEventListener('click', copyAllParagraphs);
document.getElementById('clearAll').addEventListener('click', clearAllData);

async function loadData() {
    const { savedParagraphs } = await chrome.storage.local.get({ savedParagraphs: [] });
    const resultsDiv = document.getElementById('results');
    const countSpan = document.getElementById('count');

    countSpan.textContent = savedParagraphs.length;
    resultsDiv.innerHTML = savedParagraphs
        .map((item, index) => `
      <div class="item">
        <div class="meta">#${index + 1} - ${new Date(item.timestamp).toLocaleString()}</div>
        <div class="paragraph">${item.paragraph}</div>
      </div>`
        ).join('');
}

async function copyAllParagraphs() {
    const { savedParagraphs } = await chrome.storage.local.get({ savedParagraphs: [] });

    if (savedParagraphs.length === 0) {
        showNotification('没有可复制的内容', 'warning');
        return;
    }

    // 拼接所有段落内容
    const textToCopy = savedParagraphs
        .map(item => item.paragraph)
        .join('\n');

    try {
        await navigator.clipboard.writeText(textToCopy);
        showNotification(`已复制 ${savedParagraphs.length} 个段落到剪贴板`, 'success');
    } catch (err) {
        showNotification('复制失败，请手动选择内容复制', 'error');
        console.error('复制失败:', err);
    }
}

async function clearAllData() {
    await chrome.storage.local.set({ savedParagraphs: [] });
    showNotification('已清除所有数据', 'success');
    loadData(); // 刷新显示
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;

    setTimeout(() => {
        notification.textContent = '';
        notification.className = 'notification';
    }, 2000);
}