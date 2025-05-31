document.addEventListener('DOMContentLoaded', function() {
    const avatarLink = document.getElementById('avatar-link');
    const footerLink = document.getElementById('footer-link');
    
    function handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const currentPath = window.location.pathname;
        const isIndexPage = currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('index.html');
        
        if (isIndexPage) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const targetUrl = e.currentTarget.getAttribute('data-href');
            if (targetUrl) {
                window.location.href = targetUrl;
            }
        }
    }
    
    if (avatarLink) {
        avatarLink.addEventListener('click', handleClick);
    }
    
    if (footerLink) {
        footerLink.addEventListener('click', handleClick);
    }
}); 