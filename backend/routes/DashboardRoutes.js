const Router = require('express');
const {dashboard, usersInfo, teamsInfo} = require("../controlers/DashboardController");

const router = new Router();

router.post('/dashboard', dashboard);
router.get('/users', usersInfo);
router.get('/teams', teamsInfo);

module.exports = router;