async function request(url, method, data = null, headers = {}) {
    try {
        console.log(data);
        data.token = localStorage.getItem('token');
        const option = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            credentials: 'include'
        };
        if (method=='GET' && data) {   
            url += '?' + new URLSearchParams(data).toString(); 
        } else {
            option.body = JSON.stringify(data); 
        }
        const res = await fetch('http://localhost:40605' + url,option);
        
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
    getUserFileSystem: (dir = '') => request(`/getUserFileSystem`, 'GET',{dir:dir})
};

export default api;