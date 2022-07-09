const jwt = require('jsonwebtoken');
const {queryMethod} = require("./../modules/mysqlModule");

const verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        res.json({message: "Token is required."}).end();
    }

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

        if (decodedToken?.id) {
            const sql = 'SELECT * FROM `users` WHERE `username` = ?';
            const result = await queryMethod(sql, [decodedToken.username]);

            const dataUser = {
                username: result[0].username,
                dateOfBirth: result[0].dateOfBirth,
                isAdmin: result[0].isAdmin,
                teamName: result[0].teamName,
                gender: result[0].gender
            }

            req.userData = dataUser;
            return next();
        } else {
            res.json({message: "No any result."}).end();
        }
    } catch (e) {
        res.json({message: e.message}).end();
    }
}

module.exports = verifyToken;