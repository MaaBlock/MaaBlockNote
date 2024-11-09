const fs = require('fs');
const path = require('path');
const config = require('./config');
const userManager = require('./userManager');

class NoteManager {
    getUserFileSystem(user,dir){
        const fullPath = path.join(config.notesPath, user, 'private',dir);
        files = getDirectoryContents(fullPath);
        return files;
    }

    getDirectoryContents(dirPath) {
        const contents = fs.readdirSync(dirPath, { withFileTypes: true });
        return contents.map(item => {
            const fullPath = path.join(dirPath, item.name);
            return {
                name: item.name,
                type: item.isDirectory() ? 'directory' : 'file',
                path: path.relative(path.join(config.notesPath, 'private'), fullPath),
                childenNum: item.isDirectory()? this.getDirectoryContents(fullPath).length : 0, 
            };
        });
    }
}
module.exports = new NoteManager;