document.addEventListener('DOMContentLoaded', function() {
    fetch('public/components/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
        })
        .catch(error => console.error('Error loading sidebar:', error));
}); 

document.addEventListener('DOMContentLoaded', () => {
    fetch('public/components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('main').insertAdjacentHTML('beforeend', data);
        })
        .catch(error => console.error('Error loading footer:', error));
}); 