const fs = require('fs');
const path = require('path');
const config = require('./config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


class UserManager{
    constructor() {
    }
    
    loadUser(username) {
        const fileData =  fs.readFileSync(`${config.userdataPath}/${username}/${username}.json`, 'utf8');
        const user = JSON.parse(fileData);
        if (!user) {
            throw new Error('用户不存在');
        } 
        return user;
    }
    isUserExsists(username) {
        const fileData =  fs.existsSync(`${config.userdataPath}/${username}/${username}.json`, 'utf8');
        if (fileData) {
            const data = fs.readFileSync(`${config.userdataPath}/${username}/${username}.json`, 'utf8');
            console.log(data);
            return true;
        }
        return false;
    }
    saveUser(username,password) {
        const user = {
            username: username,
            password: bcrypt.hashSync(password, 10),
        }
        fs.mkdirSync(`${config.userdataPath}/${username}`);
        fs.writeFileSync(`${config.userdataPath}/${username}/${username}.json`, JSON.stringify(user));
    }
    checkInveteCode(inviteCode) {

    }
    checkPassword(password) {
        if (!password) {
            throw new Error('密码无效');
        }
    }
    checkUserName(username){
        if (this.isUserExsists(username)) {
            throw new Error('该用户名已存在');
        }
        if (!username) {
            throw new Error('用户名无效');
        }
    }
    register(username, password, inviteCode) {
        try {
            this.checkUserName(username)
            this.checkPassword(password)
            this.checkInveteCode(inviteCode)
            this.saveUser(username, password)
        }
        catch (error) {
            throw error;
        }
    }
    login(username, password){
        if (!this.isUserExsists(username)) {
            throw new Error('用户名或密码错误');
        }
        const user = this.loadUser(username);
        if (!bcrypt.compareSync(password, user.password)) {
            throw new Error('用户名或密码错误');
        }
        return;
    }
}

module.exports = new UserManager;