
function onLogoutClick(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    setTimeout(() => {
        window.location.assign('../login/login.html');
    }, 0);
}

window.onLogoutClick = onLogoutClick;