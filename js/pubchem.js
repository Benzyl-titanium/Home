// ==UserScript==
// @name         PubChem 自动搜索助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动监听剪贴板并在 PubChem 中搜索
// @author       Your name
// @match        https://pubchem.ncbi.nlm.nih.gov/*
// @grant        GM_setClipboard
// @grant        GM_getClipboard
// ==/UserScript==

(function() {
    'use strict';

    let lastClipboardContent = '';
    
    // 定期检查剪贴板
    async function checkClipboard() {
        try {
            const currentContent = await navigator.clipboard.readText();
            
            // 如果剪贴板内容发生变化
            if (currentContent && currentContent !== lastClipboardContent) {
                lastClipboardContent = currentContent;
                
                // 构建搜索 URL
                const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(currentContent)}`;
                
                // 自动跳转到搜索结果
                window.location.href = searchUrl;
            }
        } catch (err) {
            console.error('无法读取剪贴板:', err);
        }
    }

    // 每 500ms 检查一次剪贴板
    setInterval(checkClipboard, 500);

    // 添加提示信息
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 9999;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    notification.textContent = '自动搜索已启用 - 复制内容即可自动搜索';
    document.body.appendChild(notification);

    // 3秒后隐藏提示
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
})();