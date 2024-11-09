const config = {
    port: 40605,
    userdataPath: '../userdata',
    jwtSecret: 'MaBlock'
};



module.exports = {
    port: config.port || 40605,
    userdataPath: config.userdataPath || '../userdata/',
    jwtSecret: config.jwtSecret || 'secretKey',
};