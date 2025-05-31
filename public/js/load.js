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
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        sidebar.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            e.stopPropagation();
        }, { passive: true });

        sidebar.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;

            if (diff > 0 && !sidebar.classList.contains('-translate-x-full')) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });

        sidebar.addEventListener('touchend', () => {
            isDragging = false;
        }, { passive: true });

        const toggleBodyScroll = (isOpen) => {
            if (isOpen) {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
                document.body.style.touchAction = 'none';
            } else {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.touchAction = '';
            }
        };

        let touchStartX = 0;
        let touchEndX = 0;

        sidebar.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        sidebar.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const swipeDistance = touchEndX - touchStartX;

            if (swipeDistance < -50 && !sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.add('-translate-x-full');
                toggleBodyScroll(false);
            }
        }, { passive: true });

        document.body.addEventListener('click', (e) => {
            const menuToggle = e.target.closest('.menu-toggle');
            if (menuToggle) {
                e.stopPropagation();
                const isOpen = sidebar.classList.contains('-translate-x-full');
                sidebar.classList.toggle('-translate-x-full');
                toggleBodyScroll(!isOpen);
            }
        });
        
        document.addEventListener('click', (e) => {
            const menuToggle = document.querySelector('.menu-toggle');
            if (sidebar.classList.contains('-translate-x-full')) return;
            
            if (menuToggle && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.add('-translate-x-full');
                toggleBodyScroll(false);
            }
            if (!menuToggle && !sidebar.contains(e.target)){
                sidebar.classList.add('-translate-x-full');
                toggleBodyScroll(false);
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