import api from '../api.js'; 
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form'); 
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const user = Object.fromEntries(formData);
        try {
            const ret = await api.login(user);
            const token = ret.token;
            localStorage.setItem('token', token);
            window.confirm('登录成功');
            setTimeout(() => {
                window.location.assign('../editor/editor.html');
            }, 0);
        } catch (error) {
            window.confirm('登录发生错误');
            document.getElementById('error-text').textContent = error.message;
            console.error(error);
        }
    });
});