const mysql = require('mysql');

//Connect to MYSQL
var con = mysql.createConnection({
    host: 'sql11.freemysqlhosting.net',
    user: 'sql11399822',
    password: 'w3Gg9qqiGd',
    database: 'sql11399822'

}
);

con.connect((err) => {
    if (err) {
        console.log('Error connecting to DB');
    } else {
        console.log('connection successful');
    }
})

module.exports = con;