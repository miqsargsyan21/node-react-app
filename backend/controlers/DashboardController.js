const {queryMethod} = require("../modules/mysqlModule");

exports.dashboard = async (req, res) => {
    res.json(req.userData).end();
}

exports.usersInfo = async (req, res) => {
    if (req.userData.isAdmin) {
        const sql = 'SELECT firstName, lastName, email, username, gender, dateOfBirth, teamName, id, teamId FROM `users` WHERE `isAdmin` != true AND `deleted` = false';
        const result = await queryMethod(sql);

        res.json(result).end();
    } else {
        const sql = 'SELECT firstName, lastName, email, username, gender, dateOfBirth, teamName, id FROM `users` WHERE `teamName` = ? AND `teamName` != ? AND `username` != ? AND `deleted` = false';
        const values = [req.userData.teamName, '-', req.userData.username];
        const result = await queryMethod(sql, values);

        res.json(result).end();
    }
}

exports.teamsInfo = async  (req, res) => {
    if (req.userData.isAdmin) {
        const sql = 'SELECT id, teamName, membersCount, maxMembersCount FROM `teams` WHERE  `deleted` = false';
        const result = await queryMethod(sql);

        res.json(result).end();
    } else {
        const sqlUser = 'SELECT teamId FROM `users` WHERE `username` = ? AND `teamName` != ? AND `deleted` = false';
        const valuesUser = [req.userData.username, '-'];

        const resultUser = await queryMethod(sqlUser, valuesUser);
        console.log(req.userData)

        if (resultUser.length) {
            const sql = 'SELECT teamName, membersCount, maxMembersCount, id FROM `teams` WHERE `id` = ? AND `deleted` = false';
            const values = [resultUser[0].teamId];
            const result = await queryMethod(sql, values);
            res.json(result).end();
        }

        res.json(resultUser).end();
    }
}