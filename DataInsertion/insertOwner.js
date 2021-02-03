// var express = require('express');
// const con = require('./utils/dbconnect');
// var bodyParser = require('body-parser');



// //Create Restful
// var app = express();
// var publicDir = (__dirname + '/public/')
// app.use(express.static(publicDir));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


// app.post('/OwnerInsert', function (req, res) {
//     con.query("INSERT INTO Owner (Owner_Name,Owner_Email, Owner_Pass, Owner_Phonenum) VALUES ('Jack', 'Jack@gmail.com', 'Jack0000', '88223344')", function (error, res,fields) {
//         if (error) {
//             console.log('Error in the query');
//         }
//         else {
//             console.log.apply('RecordsInserted'+res);
//         }
//     });
// });