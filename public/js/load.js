async function handleHomeLinkClick(e) {
    e.preventDefault();
    
    if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
        try {
            const response = await fetch('index.html');
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const mainContent = doc.querySelector('main');
            
            document.title = doc.title;
            
            const currentMain = document.querySelector('main');
            currentMain.style.opacity = '0';
            
            setTimeout(async () => {
                currentMain.innerHTML = mainContent.innerHTML;
                
                history.pushState({}, '', 'index.html');
                
                try {
                    const footerResponse = await fetch('public/components/footer.html');
                    const footerHtml = await footerResponse.text();
                    currentMain.insertAdjacentHTML('beforeend', footerHtml);
                    
                    const footerLinks = document.querySelectorAll('footer a.home-link');
                    for (const link of footerLinks) {
                        link.addEventListener('click', handleHomeLinkClick);
                    }
                } catch (error) {
                    console.error('Error loading footer:', error);
                }
                
                currentMain.style.transition = 'opacity 0.5s ease';
                currentMain.style.opacity = '1';
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 300);
        } catch (error) {
            console.error('Error loading index page:', error);
            window.location.href = 'index.html';
        }
    } else {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('public/components/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            
            for (const link of document.querySelectorAll('.home-link')) {
                link.addEventListener('click', handleHomeLinkClick);
            }
        })
        .catch(error => console.error('Error loading sidebar:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('public/components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('main').insertAdjacentHTML('beforeend', data);
            
            const footerLinks = document.querySelectorAll('footer a.home-link');
            for (const link of footerLinks) {
                link.addEventListener('click', handleHomeLinkClick);
            }
        })
        .catch(error => console.error('Error loading footer:', error));
}); 