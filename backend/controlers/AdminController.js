const bcrypt = require('bcrypt');
const UserValidationService = require('./../services/UserValidationService');
const {queryMethod} = require("../modules/mysqlModule");

exports.addUser = async (req, res) => {
    const validate = UserValidationService(req.body, 'register');

    if (!validate.isValid) {
        res.json({failedFields: validate.failed}).end();
    }

    try {
        const {username, email} = req.body;
        let sql = 'SELECT * FROM `users` WHERE `username` = ? OR `email` = ?';
        const result = await queryMethod(sql, [username, email.toLowerCase()]);

        let failed = [];
        result.forEach(elem => {
            if (elem.username === req.body.username && !failed.includes("username")) {
                failed[failed.length] = "username";
            }
            if (elem.email.toLowerCase() === req.body.email.toLowerCase() && !failed.includes("email")) {
                failed[failed.length] = "email";
            }
        })

        if (failed.length) {
            res.json({failedFields: failed}).end();
        } else {
            const {firstName, lastName, password, dateOfBirth, gender, teamId} = req.body;

            let teamName = '-';
            if (teamId) {
                const sqlTeam = 'SELECT `teamName`, `membersCount`, `maxMembersCount` FROM `teams` WHERE id = ?';

                const responseTeam = await queryMethod(sqlTeam, [teamId]);

                if (responseTeam) {
                    if (responseTeam[0].membersCount === responseTeam[0].maxMembersCount) {
                        res.json({message: `You can't add more user than ${resultTeam[0].maxMembersCount}`, isOk: false}).end();
                        return
                    } else {
                        teamName = responseTeam[0].teamName;
                        const sql = 'UPDATE `teams` SET `membersCount` = ? WHERE id = ?';
                        const values = [responseTeam[0].membersCount + 1, teamId];

                        const res = await queryMethod(sql, values);
                    }
                }
            }

            const hashPassword = await bcrypt.hash(password, 7);
            const sql = "INSERT INTO users (firstName, lastName, email, username, password, dateOfBirth, gender, isAdmin, deleted, teamName, teamId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const values = [firstName, lastName, email.toLowerCase(), username, hashPassword, dateOfBirth, gender, false, false, teamName, teamId ? teamId : 0];

            try {
                const addingResponse = await queryMethod(sql, values);
                res.json({addingResponse, message: "Registered successfully.", isOk: true}).end();
            } catch (e) {
                console.error(e);
                res.json({message: e.message}).end();
            }
        }
    } catch (e) {
        console.error(e);
        res.json({message: e.message}).end();
    }
}

exports.editUser = async (req, res) => {
    const validate = UserValidationService(req.body, 'register');

    if (!validate.isValid) {
        if ( !(validate.failed.length === 1 && validate.failed.includes("password")) ) {
            res.json({failedFields: validate.failed}).end();
        }
    }

    try {
        const {firstName, lastName, email, username, dateOfBirth, gender, id, teamId} = req.body;

        let  resultTeam;
        if (parseInt(teamId)) {
            const sql = 'SELECT `teamName`, `membersCount`, `maxMembersCount` FROM `teams` WHERE id = ? AND deleted != true';
            const values = [teamId];

            resultTeam = await queryMethod(sql, values);

            if (resultTeam[0].membersCount === resultTeam[0].maxMembersCount) {
                res.json({message: `You can't add more user than ${resultTeam[0].maxMembersCount}`, isOk: false}).end();
                return
            } else {
                const sql = 'UPDATE `teams` SET `membersCount` = ? WHERE id = ?';
                const values = [resultTeam[0].membersCount + 1, teamId];

                const res = await queryMethod(sql, values);
            }
        }

        if (!resultTeam) {
            resultTeam = '-';

            const sql = 'SELECT `teamId` FROM `users` WHERE id = ? AND deleted != true';
            const values = [id];

            const resUser = await queryMethod(sql, values);

            if (resUser.length && resUser[0].teamId) {
                const sql = 'UPDATE `teams` SET `membersCount` = `membersCount` - 1 WHERE id = ?';
                const values = [resUser[0].teamId];

                const response = await queryMethod(sql, values);

                console.log(response);
            }
        } else {
            resultTeam = resultTeam[0].teamName;
        }

        const sql = 'UPDATE `users` SET `firstName` = ?, `lastName` = ?, `email` = ?, `username` = ?, `dateOfBirth` = ?, `teamName` = ?, teamId = ?, `gender` = ? WHERE id = ?';
        const values = [firstName, lastName, email, username, dateOfBirth, resultTeam, resultTeam === '-' ? 0 : teamId, gender, id];

        const result = await queryMethod(sql, values);

        if (result.changedRows) {
            res.json({message: "Changed successfully", isOk: true}).end();
        } else {
            res.json({message: "Nothing to change", isOk: false}).end();
        }
    } catch (e) {
        console.error({message: e.message});
    }
}

exports.deleteUser = async (req, res) => {
    const {id} = req.body;

    const sqlTeam = 'SELECT teamId FROM `users` WHERE id = ?';
    const resultTeam = await queryMethod(sqlTeam, [id]);

    if (resultTeam) {
        const sqlDel = 'UPDATE `teams` SET `membersCount` = `membersCount` - 1 WHERE `id` = ?';
        const respDel = await queryMethod(sqlDel, [resultTeam[0].teamId])

        if (respDel.changedRows) {
            console.log('success')
        } else {
            console.log('failed')
        }
    }

    const sql = 'UPDATE `users` SET `deleted` = ? WHERE id = ?';
    const result = await queryMethod(sql, [true, id]);

    if (result.changedRows) {
        const sql = 'SELECT firstName, lastName, email, username, gender, dateOfBirth, teamName, id FROM `users` WHERE `isAdmin` != true AND `deleted` = false';
        const result = await queryMethod(sql);

        res.json({message: "Deleted", data: result, isOk: true}).end();
    } else if (result.affectedRows) {
        res.json({message: "User already deleted"}).end();
    } else {
        res.json({message: "User not found"}).end();
    }
}