const mysql = require('mysql');

//Connect to MYSQL
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aggrigator'

}
);

con.connect((err)=>{
    if(err){
        console.log('Error connecting to DB');
    }else{
        console.log('connection successful');
    }
})

module.exports = con;