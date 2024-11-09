const express = require('express');
const config = require('./config');
const userManager = require('./userManager');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const noteManager = require('./noteManager');
app.use(cors());
app.use(express.json());
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const inviteCode = req.body.inviteCode;
    try {
        const user = userManager.register(username, password, inviteCode);    
        res.status(200).json({message: '注册成功'});
    } catch (error) {
        //console.log(error);
        res.status(400).json({ error: error.message  });
    }
});
function generateToken(user,expiresIn) {
    const token = jwt.sign({username: user.username}, config.jwtSecret, { expiresIn: expiresIn });
    return token;
}
function verifyToken(token) {
    const user = jwt.verify(token, config.jwtSecret);
    return user;
}
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        userManager.login(username, password);    
        generateToken(username,'1h');
        res.cookie('token', generateToken(username,'1h'), 
        { 
            expires: new Date(Date.now() + 60 * 60 * 1000) ,
            httpOnly: true
        })
        ;
        res.status(200).json({message: '登录成功'});
    } catch (error) {
        res.status(400).json({ error: error.message  });
    }
});
function checkToken(req,res,next){
    if (!req.cookies.token) {
        return res.status(401).json({ error: '请先登录' });
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ error: '请重新登录' });
    }
}
app.use(checkToken);
app.get('/getUserFileSystem', (req, res) => {
    const user = req.user;
    noteManager.getUserFileSystem(user,req.query.dir || '');
})

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
