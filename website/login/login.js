import api from '../api.js'; 
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const user = Object.fromEntries(formData);
        try {
            api.login(user);
            setTimeout(() => {
                window.location.assign('../editor/editor.html');
            }, 0);
        } catch (error) {
            document.getElementById('error-text').textContent = error.message;
        }
    });
});