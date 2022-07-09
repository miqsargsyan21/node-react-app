const bcrypt = require('bcrypt');
const UserValidationService = require('./../services/UserValidationService');
const {queryMethod} = require("../modules/mysqlModule");
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    if (req.body.username && req.body.password) {
        const validate = UserValidationService(req.body, 'login');

        if (!validate.isValid) {
            res.json({failedFields: validate.failed}).end();
        }

        try {
            const {username, password} = req.body;
            const sql = 'SELECT * FROM `users` WHERE `username` = ?';
            const result = await queryMethod(sql, [username]);
            const isTruePassword = result.length ? bcrypt.compareSync(password, result[0].password) : null;

            if (!result.length) {
                res.json({message: "User not found.", isOk: false}).end();
            } else if (result[0].deleted) {
                res.json({message: "User not found.", isOk: false}).end();
            } else if (isTruePassword) {
                const accessToken = jwt.sign(
                    {
                        id: result[0].id,
                        username: result[0].username
                    },
                    process.env.TOKEN_KEY,
                    {expiresIn: '24h'}
                );

                const dataUser = {
                    username: result[0].username,
                    dateOfBirth: result[0].dateOfBirth,
                    isAdmin: result[0].isAdmin,
                    teamName: result[0].teamName,
                    gender: result[0].gender
                }

                res.json({message: "Everything is ok.", isOk: true, accessToken: accessToken, dataUser}).end();
            } else {
                res.json({message: "Password is wrong.", isOk: false}).end();
            }
        } catch (e) {
            console.error(e);
            res.json({message: "Something went wrong.", isOk: false}).end();
        }
    } else {
        res.json({message: "Username are password are required", isOk: false}).end();
    }
}

exports.register = async (req, res) => {
    const {username, email, firstName, lastName, password, secondPassword, dateOfBirth, gender} = req.body;

    if (username && email && firstName && lastName && password && dateOfBirth && gender && secondPassword) {
        const validate = UserValidationService(req.body, 'register');

        if (!validate.isValid) {
            res.json({failedFields: validate.failed}).end();
        }

        try {
            const sql = 'SELECT * FROM `users` WHERE `username` = ? OR `email` = ?';
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
                const hashPassword = await bcrypt.hash(password, 7);
                const sql = "INSERT INTO users (firstName, lastName, email, username, password, dateOfBirth, gender, isAdmin, deleted, teamName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const values = [firstName, lastName, email.toLowerCase(), username, hashPassword, dateOfBirth, gender, false,false, "-"];

                try {
                    const addingResponse = await queryMethod(sql, values);
                    res.json({addingResponse, message: "Registered successfully."}).end();
                } catch (e) {
                    console.error(e);
                    res.json({message: e.message}).end();
                }
            }
        } catch (e) {
            res.json({message: "Something went wrong."}).end();
        }
    } else {
        res.json({message: "All fields are required."}).end();
    }
}

exports.someUser = async (req, res) => {
    const {id} = req.body;

    if (id) {
        try {
            const sql = 'SELECT firstName, lastName, email, username, dateOfBirth, gender, teamName, teamId FROM `users` WHERE `id` = ?';
            const result = await queryMethod(sql, [id]);

            res.json(result).end();
        } catch (e) {
            res.json({message: e.message}).end();
        }
    } else {
        res.json({message: "Id required field."}).end();
    }
}

exports.someTeam = async (req, res) => {
    const {teamId} = req.body;

    if (teamId) {
        const sql = 'SELECT teamName, membersCount, maxMembersCount FROM `teams` WHERE `id` = ?';
        const result = await queryMethod(sql, [teamId]);

        res.json(result).end();
    } else {
        res.json({message: "Id required field.", isOk: false}).end();
    }
}