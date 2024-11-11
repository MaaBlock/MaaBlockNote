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
}
module.exports = new NoteManager;