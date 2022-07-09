const Router = require('express');
const {login, register, someUser} = require('./../controlers/UserController');
const {someTeam} = require("../controlers/UserController");

const router = new Router();

router.post('/login', login);

router.post('/register', register);

router.post('/info', someUser);

router.post('/infoTeam', someTeam);

module.exports = router;