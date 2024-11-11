import api from '../api.js'; 
function createFileNode(fileInfo, level) {
    const node = document.createElement('div');
    node.className = 'file-system-node-box';
    node.dataset.path = fileInfo.path;
    node.dataset.level = level;
    node.style.setProperty('--level', level); 
    //ode.style.paddingLeft = `${level * 20}px`; // 缩进

    const img = document.createElement('img');
    img.src = fileInfo.type === 'directory' ? 'folder.png' : 'file.png';
    node.appendChild(img);

    const p = document.createElement('p');
    p.textContent = fileInfo.name;
    node.appendChild(p);

    if (fileInfo.type === 'directory') {
        node.onclick = onNodeClick;
    }

    return node;
}

function removeChildren(parentNode) {
    const level = parseInt(parentNode.style.getPropertyValue('--level'),10);
    let nextNode = parentNode.nextElementSibling;
    while (nextNode && parseInt(nextNode.style.getPropertyValue('--level'), 10) > level) {
        const nodeToRemove = nextNode;
        nextNode = nextNode.nextElementSibling;
        nodeToRemove.remove();
    }
}

async function updateFileSystem(node) {
    const path = node.dataset.path;
    const level = parseInt(node.style.getPropertyValue('--level'), 10);
    //const children = getDirectoryContents(path);
    const children = await api.getUserFileSystem(path);
    if (children.length === 0) {
        return;
    }
    removeChildren(node);
    children.forEach(child => {
        const childNode = createFileNode(child, level + 1);
        node.parentNode.insertBefore(childNode, node.nextSibling);
    });
}

async function onNodeClick(event) {
    const node = event.currentTarget;
    if (node.classList.contains('expanded')) {
        node.classList.remove('expanded');
        removeChildren(node);
    } else {
        node.classList.add('expanded');
        await updateFileSystem(node);
    }
}
function onAddFileBtnClick(event) {
    event.preventDefault();
    event.stopPropagation();
}
function onAddDirectoryBtnClick(event) {
    event.preventDefault()
    event.stopPropagation();
}
window.onNodeClick = onNodeClick;
window.onAddFileBtnClick = onAddFileBtnClick;
window.onAddDirectoryBtnClick = onAddDirectoryBtnClick;