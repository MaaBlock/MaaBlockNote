import { login } from "../server/userManager";

async function request(url, method, data = null, headers = {}) {
    try {
        console.log(data);
        const res = await fetch('http://localhost:40605' + url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(data)
        });
        const ret = await res.json();
        if (!res.ok) {
            throw new Error(ret.error);
        }
        return ret;
    } catch (error) {
        throw error;
    }
}
const api = {
    request: request,
    register: (data) => request('/register', 'POST', data),
    login: (data) => request('/login', 'POST', data),
    getUserFileSystem: (dir = '') => request(`/getUserFileSystem${dir}`, 'GET')
};

export default api;