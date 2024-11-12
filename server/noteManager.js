const fs = require('fs');
const path = require('path');
const config = require('./config');
const userManager = require('./userManager');

class NoteManager {
    getUserFileSystem(user,dir){
        const fullPath = path.join(config.userdataPath, user, 'private',dir);
        const files = this.getDirectoryContents(user,fullPath);
        return files;
    }

    getDirectoryContents(username,dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const contents = fs.readdirSync(dirPath, { withFileTypes: true });
        return contents.map(item => {
            const fullPath = path.join(dirPath, item.name);
            return {
                name: item.name,
                type: item.isDirectory() ? 'directory' : 'file',
                path: path.relative(path.join(config.userdataPath,username, 'private'), fullPath),
                childenNum: item.isDirectory()? this.getDirectoryContents(username,fullPath).length : 0, 
            };
        });
    }
    rename(username, oldPath, newName) {
        try {
            const oldFullPath = path.join(config.userdataPath, username, 'private', oldPath);
            const newPath = path.join(path.dirname(oldFullPath), newName);
            fs.renameSync(oldFullPath, newPath);
        } catch (error) {
            throw new Error(`重命名失败: ${error.message}`);
        }
    }
    addFile(username,type,srcPath, name) {
        var newPath;
        const newnewPath = path.join(config.userdataPath, username, 'private', srcPath);
        const srcFile = fs.statSync(newnewPath);    
        if (srcFile.isDirectory()) {
            newPath = path.join(config.userdataPath,username,'private',srcPath, name);
        } else {
            newPath = path.join(config.userdataPath,username,'private',srcPath.dirname(srcPath), name);
        }
        if (type === 'directory') {
            fs.mkdirSync(newPath, { recursive: true });
        } else {
            fs.writeFileSync(newPath, '');
        }
    }
}
module.exports = new NoteManager;