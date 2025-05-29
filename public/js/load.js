async function handleHomeLinkClick(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    
    if (href.startsWith('http') || href.startsWith('https')) {
        window.open(href, '_blank');
        return;
    }
    
    if (href.includes('designdrugs.html') || 
        href.includes('Structural-formula.html') || 
        href.includes('solubility.html') ||
        href.includes('chemgame.html') ||
        href.includes('chemhandbook.html') ||
        href.includes('marvin.html')) {
        window.location.href = href;
        return;
    }
    
    const hash = href.split('#')[1];
    
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
                
                history.pushState({}, '', href);
                
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
                
                if (hash) {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            }, 300);
        } catch (error) {
            console.error('Error loading index page:', error);
            window.location.href = href;
        }
    } else {
        if (hash) {
            const element = document.getElementById(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('public/components/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            
            const menuToggle = document.querySelector('.menu-toggle');
            const sidebar = document.querySelector('.sidebar');
            
            if (menuToggle && sidebar) {
                menuToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sidebar.classList.toggle('active');
                });
                
                document.addEventListener('click', (e) => {
                    if (sidebar.classList.contains('active') && 
                        !menuToggle.contains(e.target)) {
                        sidebar.classList.remove('active');
                    }
                });
            }

            const menuButtons = document.querySelectorAll('.project-menu-btn');
            for (const button of menuButtons) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    for (const otherButton of menuButtons) {
                        if (otherButton !== button) {
                            const otherSubmenu = otherButton.nextElementSibling;
                            if (otherSubmenu) {
                                otherSubmenu.style.display = 'none';
                            }
                        }
                    }
                    
                    const submenu = button.nextElementSibling;
                    if (submenu) {
                        if (submenu.style.display === 'none') {
                            submenu.style.display = 'block';
                        } else {
                            submenu.style.display = 'none';
                        }
                    }
                });
            }
            
            document.addEventListener('click', (e) => {
                const submenus = document.querySelectorAll('.submenu');
                for (const submenu of submenus) {
                    if (!submenu.contains(e.target) && !submenu.previousElementSibling.contains(e.target)) {
                        submenu.style.display = 'none';
                    }
                }
            });
            
            const navLinks = document.querySelectorAll('.nav a');
            for (const link of navLinks) {
                link.addEventListener('click', (e) => {
                    if (!link.classList.contains('project-menu-btn')) {
                        const href = link.getAttribute('href');
                        if (href && !href.startsWith('http')) {
                            e.preventDefault();
                            handleHomeLinkClick(e);
                        }
                    }
                });
            }
            
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