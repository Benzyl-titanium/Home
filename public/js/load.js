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
            
            const newMainContent = doc.querySelector('main').innerHTML; // 获取新页面的main内容
            const currentMain = document.querySelector('main');
            
            document.title = doc.title;
            
            currentMain.style.opacity = '0';
            
            setTimeout(async () => {
                currentMain.innerHTML = newMainContent;
                history.pushState({}, '', href);
                
                try {
                    const footerResponse = await fetch('public/components/footer.html');
                    const footerHtml = await footerResponse.text();
                    currentMain.insertAdjacentHTML('beforeend', footerHtml);
                    
                } catch (error) {
                    console.error('Error loading footer:', error);
                }
                
                currentMain.style.transition = 'opacity 0.5s ease';
                currentMain.style.opacity = '1';

                bindAllEvents();

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

function bindAllEvents() {
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebar) {
        document.body.addEventListener('click', (e) => {
            const menuToggle = e.target.closest('.menu-toggle');
            if (menuToggle) {
                e.stopPropagation();
                sidebar.classList.toggle('-translate-x-full');
            }
        });
        
        document.addEventListener('click', (e) => {
            const menuToggle = document.querySelector('.menu-toggle');
            if (sidebar.classList.contains('-translate-x-full')) return;
            
            if (menuToggle && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                 sidebar.classList.add('-translate-x-full');
             }
             if (!menuToggle && !sidebar.contains(e.target)){
                 sidebar.classList.add('-translate-x-full');
             }
        });
    }

    const menuButtons = document.querySelectorAll('.project-menu-btn');
    menuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            menuButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    const otherSubmenu = otherButton.nextElementSibling;
                    if (otherSubmenu && otherSubmenu.classList.contains('submenu')) {
                        otherSubmenu.style.display = 'none';
                    }
                }
            });
            
            const submenu = button.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                submenu.style.display = submenu.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.project-menu-btn') && !e.target.closest('.sidebar')) {
            const submenus = document.querySelectorAll('.submenu');
            submenus.forEach(submenu => {
                submenu.style.display = 'none';
            });
        }
    });

    const navLinks = document.querySelectorAll('a[href^="#"], .home-link');
    for (const link of navLinks) {
        if (!link.classList.contains('project-menu-btn')) {
            link.removeEventListener('click', handleHomeLinkClick);
            link.addEventListener('click', handleHomeLinkClick);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('public/components/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            bindAllEvents();
        })
        .catch(error => console.error('Error loading sidebar:', error));

    fetch('public/components/footer.html')
        .then(response => response.text())
        .then(data => {
            const main = document.querySelector('main');
            if (main) {
                main.insertAdjacentHTML('beforeend', data);
            }
        })
        .catch(error => console.error('Error loading footer:', error));

    bindAllEvents();
}); 