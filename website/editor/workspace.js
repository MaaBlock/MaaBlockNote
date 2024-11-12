import MEvent from "../MBlib/event.js";

function onWorkSpaceTabsClick(event) {
    const clickTab = event.currentTarget;
    document.querySelectorAll('.workspace-tabs').forEach(tab => {
        tab.classList.remove('active');
    });
    clickTab.classList.add('active');
    const activeTab = document.querySelector('.work-space-tab.active');
    
}
function onWorkSpaceTabsDeleteClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const deleteBtn = event.currentTarget;
    const tab = deleteBtn.parentElement;
    if (tab.classList.contains('active')) {
        if (tab.nextElementSibling && tab.nextElementSibling.classList.contains('workspace-tabs')) {
            tab.nextElementSibling.classList.add('active');
        } else if (tab.previousElementSibling && tab.previousElementSibling.classList.contains('workspace-tabs')) {
            tab.previousElementSibling.classList.add('active');
        }
    }
    tab.remove();
    freshWorkSpace();
}
function freshWorkSpace() {
    const workSpaceTabArea = document.querySelector('.workspace-tab-bars-area');
    const workArea = document.querySelector('.workspace-area');
    if (workSpaceTabArea.children.length) {
        workArea.style.display = 'block';
    } else {
        workArea.style.display = 'none';
    }
}
function addWorkFile(path) {
    const name = path.split('\\').pop();
    const workSpaceTabArea = document.querySelector('.workspace-tab-bars-area');
    const newTab = document.createElement('div');
    newTab.classList.add('workspace-tabs');
    newTab.dataset.path = path;
    newTab.textContent = name;
    newTab.onclick = onWorkSpaceTabsClick;
    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('workspace-tabs-delete-btn');
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = onWorkSpaceTabsDeleteClick;
    newTab.appendChild(deleteBtn);
    workSpaceTabArea.appendChild(newTab);
    MEvent.addClickEvent(newTab);
    freshWorkSpace();
}
function isOnWorkspace(path) {
    var finded = false;
    document.querySelectorAll('.workspace-tabs').forEach(tab => {
        const comparePath = tab.dataset.path;
        MEvent.addClickEvent(tab);
        if (comparePath == path) {
            finded = true;
            return true;
        }
    })
    return finded; 
    /* TOTHINK:
    const ret = document.querySelector('.workspace-tabs[data-path="' + path + '"]');
    if (ret) {
        return true;
    } else {
        return false;
    }*/
}
window.isOnWorkspace = isOnWorkspace;
window.freshWorkSpace = freshWorkSpace;

window.addWorkFile = addWorkFile;
window.onWorkSpaceTabsClick = onWorkSpaceTabsClick;
window.onWorkSpaceTabsDeleteClick = onWorkSpaceTabsDeleteClick;