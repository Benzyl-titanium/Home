async function handleHomeLinkClick(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    
    // 检查是否是内部链接（Bio、Stats、Like、Repo）
    if (href === '#bio' || href === '#stats' || href === '#like' || href === '#repo') {
        // 关闭侧边栏
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
            closeSidebar();
        }
    }
    
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

                const sidebar = document.querySelector('.sidebar');
                if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
                    closeSidebar();
                }

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

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!sidebar || !overlay) return;

    sidebar.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    overlay.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    sidebar.style.transform = `translateX(-${sidebar.offsetWidth}px)`;
    sidebar.classList.add('-translate-x-full');
    overlay.style.opacity = '0';
    document.body.style.overflow = '';

    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    
    setTimeout(() => {
        overlay.classList.add('hidden', 'pointer-events-none');
    }, 300);
}

function openSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!sidebar || !overlay) return;

    sidebar.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    overlay.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    sidebar.style.transform = 'translateX(0)';
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden', 'pointer-events-none');
    overlay.style.opacity = '0.5';
    document.body.style.overflow = 'hidden';
}

function bindAllEvents() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
        overlay.style.pointerEvents = 'auto';

        const menuToggle = document.querySelector('.menu-toggle'); 
        if (menuToggle) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = sidebar.classList.contains('-translate-x-full');
                
                sidebar.style.transition = 'transform 0.3s ease-out';
                overlay.style.transition = 'opacity 0.3s ease-out';
                
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    if (isOpen) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
                
                if (isOpen) {
                    openSidebar();
                } else {
                    closeSidebar();
                }
            });
        }
        overlay.addEventListener('click', () => {
            closeSidebar();
        });

    }

    const menuButtons = document.querySelectorAll('.project-menu-btn');
    menuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const submenu = button.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                const isHidden = submenu.style.display === 'none';
                
                submenu.style.display = isHidden ? 'block' : 'none';
                
                const icon = button.querySelector('.fa-chevron-down, .fa-chevron-up');
                if (icon) {
                    if (isHidden) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    } else {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    }
                }

                if (isHidden) {
                    button.classList.add('bg-gray-100', 'text-gray-900');
                } else {
                    button.classList.remove('bg-gray-100', 'text-gray-900');
                }

                if (isHidden) {
                    const sidebar = document.querySelector('.sidebar');
                    const buttonRect = button.getBoundingClientRect();
                    const sidebarRect = sidebar.getBoundingClientRect();
                    
                    if (buttonRect.top < sidebarRect.top || buttonRect.bottom > sidebarRect.bottom) {
                        requestAnimationFrame(() => {
                            sidebar.scrollTo({
                                top: sidebar.scrollTop + buttonRect.top - sidebarRect.top - 20,
                                behavior: 'smooth'
                            });
                        });
                    }
                }
            }
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.project-menu-btn') && !e.target.closest('.sidebar')) {
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
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) {
                overlay.classList.add('opacity-0', 'pointer-events-none');
            }
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
}); 