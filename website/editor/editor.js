function onTabBtnClick(event) {
    const clickBtn = event.currentTarget;
    const wasActive = clickBtn.classList.contains('active');
    document.querySelectorAll('.bar-button').forEach(btn => {
        btn.classList.remove('active');
    });
    if (!wasActive) {
        clickBtn.classList.add('active');
    }
    const tabContent = document.getElementById('bar-content');
    tabContent.innerHTML = '';
    const activeBtn = document.querySelector('.bar-button.active');
    if (!activeBtn) {
        return;
    }
    const activeId = activeBtn.id;
    const url = './' + activeId.slice(0, -3) + '.html';

    fetch(url)
        .then(res => res.text())
        .then(html => {
            console.log('Received HTML:', html);
            if (html === undefined) {
                console.error('Received undefined HTML');
                return;
            }
            tabContent.innerHTML = html;
            const ResourceManagerScript = document.createElement('script');
            ResourceManagerScript.src = 'ResourceManagerTab.js';
            ResourceManagerScript.type = 'module';
            document.body.appendChild(ResourceManagerScript); 
            const UserScript = document.createElement('script');
            UserScript.src = 'UserTab.js';
            UserScript.type = 'module';
            document.body.appendChild(UserScript);
        }) 
}
function initWorkSpace() {
    const workSpaceArea = document.querySelector(".workspace-area");
    fetch('./workspace.html')
    .then(res => res.text())
    .then(html => {
        workSpaceArea.innerHTML = html;
        const workSpaceScript = document.createElement('script');
        workSpaceScript.src = 'workspace.js';
        workSpaceScript.type = 'module';
        document.body.appendChild(workSpaceScript);
        window.freshWorkSpace();
    }) 
}
window.onTabBtnClick = onTabBtnClick;
initWorkSpace();