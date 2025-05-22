// ==UserScript==
// @name         PubChem
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  PubChem
// @author       Your name
// @match        https://pubchem.ncbi.nlm.nih.gov
// @match        https://pubchem.ncbi.nlm.nih.gov/#query=*
// @grant        GM_setClipboard
// @grant        GM_getClipboard
// ==/UserScript==

(function() {
    'use strict';

    let lastClipboardContent = '';
    
    async function checkClipboard() {
        try {
            const currentContent = await navigator.clipboard.readText();

            if (currentContent && currentContent !== lastClipboardContent) {
                lastClipboardContent = currentContent;

                const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(currentContent)}`;

                window.location.href = searchUrl;
            }
        } catch (err) {
            console.error('NAA:', err);
        }
    }

    setInterval(checkClipboard, 500);
})();
