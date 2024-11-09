import api from '../api.js'; 
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    form.addEventListener('submit',async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const user = Object.fromEntries(formData);
        console.log(user);
        try {
            await api.register(user);
            const ret = window.confirm('注册成功，跳转到登录');
            console.log(ret);
            if (ret) {
                setTimeout(() => {
                    window.location.assign('../login/login.html');
                }, 0)
            }
        } catch (error) {
            console.error(error);
            document.getElementById('error-text').textContent = error.message;
        }
    });

});