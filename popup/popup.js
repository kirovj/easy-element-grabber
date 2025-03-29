document.addEventListener('DOMContentLoaded', loadData);
document.getElementById('export').addEventListener('click', exportData);

async function loadData() {
    const { savedParagraphs } = await chrome.storage.local.get({ savedParagraphs: [] });
    const resultsDiv = document.getElementById('results');

    resultsDiv.innerHTML = savedParagraphs
        .map(item => `
      <div class="item">
        <div class="url">${item.url}</div>
        <div class="paragraph">${item.paragraph}</div>
      </div>`
        ).join('');
}

function exportData() {
    chrome.storage.local.get({ savedParagraphs: [] }, (data) => {
        const blob = new Blob([JSON.stringify(data.savedParagraphs, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url,
            filename: 'saved_paragraphs.json'
        });
    });
}