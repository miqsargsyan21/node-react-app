const Router = require('express');
const {addUser, editUser, deleteUser} = require("../controlers/AdminController");
const { addTeam, editTeam, deleteTeam, getAllTeams} = require('../controlers/TeamController');

const router = new Router();

router.post('/add', addUser);
router.put('/edit', editUser);
router.delete('/delete', deleteUser);

router.post('/addTeam', addTeam);
router.put('/editTeam', editTeam);
router.delete('/deleteTeam', deleteTeam);
router.get('/teams', getAllTeams);

module.exports = router;