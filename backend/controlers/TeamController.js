const {queryMethod} = require("../modules/mysqlModule");
const TeamValidationService = require("../services/TeamValidationService");

exports.addTeam = async (req, res) => {
    const {teamName, membersCount} = req.body;

    if (teamName && membersCount) {
        const validate = TeamValidationService(req.body);

        if (!validate.isValid) {
            res.json({failedFields: validate.failed}).end();
        } else {
            const sql = "INSERT INTO teams (teamName, maxMembersCount) VALUES (?, ?)";
            const values = [teamName, membersCount];

            try {
                const addingResponse = await  queryMethod(sql, values);
                res.json({addingResponse, message: "Registered successfully.", isOk: true}).end();
            } catch (e) {
                console.error(e);
                res.json({message: e.message, isOk: false}).end();
            }
        }
    } else {
        res.json({message: 'All fields are required.', isOk: false}).end();
    }
}

exports.editTeam = async (req, res) => {
    const {teamName, membersCount, teamId} = req.body;

    if (teamName && membersCount && teamId) {
        const validate = TeamValidationService({teamName, membersCount: parseInt(membersCount), teamId});

        if (!validate.isValid) {
            res.json({failedFields: validate.failed}).end();
        } else {
            const sql = "UPDATE `teams` SET teamName = ?, maxMembersCount = ? WHERE id = ?";
            const values = [teamName, membersCount, teamId];

            const result = await queryMethod(sql, values);

            if (result.changedRows) {
                res.json({message: "Changed successfully", isOk: true}).end();
            } else {
                res.json({message: "Nothing to change", isOk: true}).end();
            }
        }
    } else {
        res.json({message: 'All fields are required.', isOk: false}).end();
    }
}

exports.deleteTeam = async (req, res) => {
    const {teamId} = req.body;

    if (teamId) {
        const sqlUser = 'UPDATE `users` SET teamName = ?, teamId = ? WHERE teamId = ?';

        const responseUser = await queryMethod(sqlUser, ['-', 0, teamId]);

        if (responseUser.changedRows) {
            console.log('Success');
        } else {
            console.log('Failed');
        }


        const sql = 'UPDATE `teams` SET `deleted` = ? WHERE id = ?'
        const result = await queryMethod(sql, [true, teamId]);

        if (result.changedRows) {
            res.json({message: "Deleted", isOk: true}).end();
        } else if (result.affectedRows) {
            res.json({message: "Team already deleted"}).end();
        } else {
            res.json({message: "Team not found"}).end();
        }
    } else {
        res.json({message: 'All fields are required.', isOk: false}).end();
    }
}

exports.getAllTeams = async (req, res) => {
    try {
        const sql = 'SELECT teamName, id FROM `teams` WHERE deleted != true';
        const result = await queryMethod(sql);

        res.json({isOk: true, result}).end();
    } catch (e) {
        res.json({isOk: false, message: "Something went wrong."}).end();
    }
}