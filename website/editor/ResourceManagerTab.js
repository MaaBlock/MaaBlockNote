import api from '../api.js'; 
function createFileNode(fileInfo, level) {
    const node = document.createElement('div');
    node.className = 'file-system-node-box';
    node.dataset.path = fileInfo.path;
    node.dataset.level = level;
    node.dataset.type = fileInfo.type;
    node.style.setProperty('--level', level); 
    //ode.style.paddingLeft = `${level * 20}px`; // 缩进

    const img = document.createElement('img');
    img.src = fileInfo.type === 'directory' ? 'folder.png' : 'file.png';
    node.appendChild(img);

    const p = document.createElement('p');
    p.textContent = fileInfo.name;
    node.appendChild(p);

    if (fileInfo.type === 'directory') {
        node.onclick = window.onNodeClick;
    } else {
        node.onclick = window.onFileClick;
    }

    return node;
}
function createUnnamedNode(node, type) {
    const newNode = document.createElement('div');
    newNode.className = 'file-system-node-box';
    newNode.dataset.path = node.dataset.path;
    newNode.dataset.type = type;
    const level = node.style.getPropertyValue('--level');
    const newLevel = node.dataset.type === 'file' ? level : parseInt(level,10) + 1;
    newNode.style.setProperty('--level', newLevel);

    const img = document.createElement('img');
    img.src = type === 'directory' ? 'folder.png' : 'file.png';
    newNode.appendChild(img);

    const input = document.createElement('input');
    input.value = '';
    input.type = 'text';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    newNode.appendChild(input);
    node.parentNode.insertBefore(newNode, node.nextSibling);
    const saveName = async () => {
        const text = input.value.trim();
        if (text) {
            try {
                await api.addFile(type,newNode.dataset.path, text);
            } catch (error) {
                console.error(error.message);
                //alert(error.message);
            }
        } else {
            newNode.remove();
        }
    }
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            saveName();
        }
    });
    input.addEventListener('blur', (event) => {
        saveName();
    });
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
    document.querySelectorAll('.file-system-node-box.active').forEach(activeNode => {
        activeNode.classList.remove('active');
    })
    node.classList.add('active');
    if (node.classList.contains('expanded')) {
        node.classList.remove('expanded');
        removeChildren(node);
    } else {
        node.classList.add('expanded');
        await updateFileSystem(node);
    }
}
async function onFileClick(event) {
    const node = event.currentTarget;
    document.querySelectorAll('.file-system-node-box.active').forEach(activeNode => {
        activeNode.classList.remove('active');
    })
    node.classList.add('active');
}
function onAddFileBtnClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const activeNode = document.querySelector('.file-system-node-box.active');
    if (!activeNode) {
        alert('请先选择要添加的文件');
    }
    createUnnamedNode(activeNode, 'file');
}
function onAddDirectoryBtnClick(event) {
    event.preventDefault()
    event.stopPropagation();
    const activeNode = document.querySelector('.file-system-node-box.active');
    if (!activeNode) {
        alert('请先选择要添加的文件夹');
    }
    createUnnamedNode(activeNode, 'directory');
}

function onRenameBtnClick(event) {
    event.preventDefault()
    event.stopPropagation();
    const activeNode = document.querySelector('.file-system-node-box.active');
    if (!activeNode) {
        alert('请先选择要重命名的文件或文件夹');
    }
    if (activeNode.style.getPropertyValue('--level') === '0') {
        alert('根目录不可以重命名');
        return;
    }
    const text = activeNode.querySelector('p');
    const oldPath = activeNode.dataset.path;
     
    
    const input = document.createElement('input');
    input.value = text.textContent;
    input.type = 'text';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    text.replaceWith(input);
    input.focus();
    input.select();
    const saveRename = async () => {
        if (input.value) {
            const newName = input.value;
            try {
                await api.rename(oldPath, newName);
                text.textContent = input.value;
                input.replaceWith(text);
                updateFileSystem(activeNode.parentNode);
            } catch (error) {
                console.error(error.message);
            }
        } else {
            input.replaceWith(text);
        }
    }
    input.addEventListener('blur', saveRename);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            saveRename();
        } else if (event.key === 'Escape') {
            input.replaceWith(text);
        }
    });
}
window.onNodeClick = onNodeClick;
window.onFileClick = onFileClick;
window.onAddFileBtnClick = onAddFileBtnClick;
window.onAddDirectoryBtnClick = onAddDirectoryBtnClick;
window.onRenameBtnClick = onRenameBtnClick;