const express = require('express');
const cookieParser = require('cookie-parser');
const config = require('./config');
const userManager = require('./userManager');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const noteManager = require('./noteManager');

app.use(cors({
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie']  
}));
app.use(cookieParser());
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
function generateToken(username,expiresIn) {
    const token = jwt.sign({username: username}, config.jwtSecret, { expiresIn: expiresIn });
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
        const token = generateToken(username,'1h');
        console.log('Generated token:', token);
        res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.cookie('test', 'test',{ 
            sameSite: 'lax'
        });
        res.cookie('token', token, 
        { 
            httpOnly: false,
        });
        res.status(200).json({message: '登录成功',token: token });
    } catch (error) {
        res.status(400).json({ error: error.message  });
    }
});
/*
function checkToken(req,res,next){
    if (!req.cookies.token) {
        return res.status(401).json({ error: '请先登录' });
    }
    try {
        const decoded = verifyToken(req.cookies.token);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ error: '请重新登录' });
    }
}*/
function checkToken(req,res,next){
    var token;
    if (req.method == 'GET'){
        token = req.query.token;
    } else {
        token = req.body.token;
    }
    if (!token) {
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
    try {
        const files = noteManager.getUserFileSystem(user.username,req.query.dir || '');
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
