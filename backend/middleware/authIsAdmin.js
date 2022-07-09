const jwt = require('jsonwebtoken');
const {queryMethod} = require('./../modules/mysqlModule')

const verifyAdmin = async (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        res.json({message: "Token is required."}).end();
    }

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

        if (decodedToken?.id) {
            const sql = 'SELECT * FROM `users` WHERE `username` = ?';
            const result = await queryMethod(sql, [decodedToken.username]);

            if (result[0].isAdmin) {
                return next();
            } else {
                res.json({message: "You don't have permission."}).end();
            }
        } else {
            res.json({message: "No any result."}).end();
        }
    } catch (e) {
        res.json({message: e.message}).end();
    }
}

module.exports = verifyAdmin;