const mysql = require('mysql');

const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mydb'
}

const connection = mysql.createConnection(mysqlConfig);

connection.connect((err) => {
    if (err) {
        console.log('Error!', err.message);
    } else {
        console.log('Connected.');
    }
});

exports.queryMethod = (sql, values = [] ) => {
    return new Promise((res, rej) => {
        connection.query(sql, values, function (err, result) {
            if (err) {
                rej(err);
                return;
            }
            res(result);
        })
    })
}