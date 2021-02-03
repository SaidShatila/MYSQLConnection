var express = require('express');
const con = require('./utils/dbconnect');
var bodyParser = require('body-parser');



//Create Restful
var app = express();
var publicDir = (__dirname + '/public/')
app.use(express.static(publicDir));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/LandsImages',function(req,res){
con.query("SELECT * FROM landsimages WHERE Lands_ID=?",[req.body.Lands_ID],function(error,results){
  if(error) throw error;
  res.send(results);  
});

});


app.get('/Investor', function (req, res) {
  con.query("SELECT Investor_Name, Investor_Pass FROM Investor where Investor_Name = 'Teddy Wimbridge'", function (error, rows, fields) {
    if (error) {
      console.log('Error in the query');
    }
    else {
      console.log(JSON.stringify(rows))
      res.status(200).json({
        data: rows,
      });
    }
  });

})

//LandInforamtion according to OwnerID + Investor Name in it.
app.get('/LandsInformation', function (req, res) {
  con.query("Select landinformation.*,Owner.Owner_Name,Investor.Investor_Name,Products.Products_Name,reviewlands.Rating FROM landinformation JOIN Lands  on landinformation.Lands_ID=Lands.Lands_ID  JOIN Owner  on Lands.Owner_ID= Owner.Owner_ID  JOIN Investor on Lands.Investor_ID=Investor.Investor_ID  JOIN Products on Investor.Investor_ID=Products.Investor_ID  JOIN reviewlands on reviewlands.Lands_ID=Lands.Lands_ID and Lands.Owner_ID='3' ", function (error, rows, fields) {
    if (error) {
      console.log('Error in the query');
    }
    else {
      console.log(JSON.stringify(rows))
      res.status(200).json({
        data: rows,
      });
    }
  });


})
//LandHistory for information details about RentedOld Lands
app.get('/Landshistory', function (req, res) {
  con.query("Select Landshistory.*  From Landshistory  JOIN Lands  on landshistory.Lands_ID=Lands.Lands_ID and  Lands.Owner_ID=6;", function (error, rows, fields) {
    if (error) {
      console.log('Error in the query');
    }
    else {
      console.log(JSON.stringify(rows))
      res.status(200).json({
        data: rows,
      });
    }
  });


})
//landsImage preview for a land
app.get('/landsimages', function (req, res) {
  con.query("Select landsimages.LandsImageAerial From landsimages Where Lands_ID=102 ;", function (error, rows, fields) {
    if (error) {
      console.log('Error in the query');
    }
    else {
      console.log(JSON.stringify(rows))
      res.status(200).json({
        data: rows,
      });
    }
  });

  
})
//Rating for lands from investor side
app.get('/Rating', function (req, res) {
  con.query("Select Rating From reviewlands JOIN Investor on reviewlands.Investor_ID=Investor.Investor_ID  and Investor.Investor_ID=3;", function (error, rows, fields) {
    if (error) {
      console.log('Error in the query');
    }
    else {
      console.log(JSON.stringify(rows))
      res.status(200).json({
        data: rows,
      });
    }
  });

  
})

//Investor by name
app.get('/InvestorBYNAME', function (req, res) {
  con.query("Select Investor_Name From Investor,Lands Where Investor.Investor_ID=Lands.Investor_ID and Lands.Lands_ID=7;", function (error, rows, fields) {
    if (error) {
      console.log('Error in the query');
    }
    else {
      console.log(JSON.stringify(rows))
      res.status(200).json({
        data: rows,
      });
    }
  });

})

app.put('/OwnerUpdate', function (req, res) {
  con.query("UPDATE Owner SET Owner_Name=?,Owner_Email=?,Owner_Pass=?, Owner_Phonenum=? WHERE Owner_ID=?", [req.body.Owner_Name, req.body.Owner_Email, req.body.Owner_Pass, req.body.Owner_Phonenum, req.body.Owner_ID], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});



app.put('/InvestorUpdate', function (req, res) {
  con.query("UPDATE Investor SET Investor_Name=?,Investor_Email=?,Investor_Pass=?, Investor_Phonenum=? WHERE Investor_ID=?", [req.body.Investor_Name, req.body.Investor_Email, req.body.Investor_Pass, req.body.Investor_Phonenum, req.body.Investor_ID], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//InvestorLogin through email and password
app.post('/InvestorLogin', function (req, res) {
  var Investoremail = req.body.Investor_Email;
  var Investorpass = req.body.Investor_Pass;
  var data = {
    "Data": ""
  };
  console.log("InvestorEmail: " + Investoremail + " \n InvestorPass: "+ Investorpass);
  con.query("SELECT * from Investor WHERE Investor_Email=? and Investor_Pass=? LIMIT 1", [Investoremail, Investorpass], function (err, rows, fields) {
    console.log("rowslength: "+ rows.length);
    if (rows.length != 0) {
      data["Data"] = "Successfully logged in..";
      res.json(data);
    } else {
      data["Data"] = "Email or password is incorrect.";
      res.json(data);
    }
  });
});

app.post('/InvestorInsert', function (req, res) {
  var postData = req.body;

  con.query("INSERT INTO Investor SET ? ", postData, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, postData: results, message: 'New user has been created successfully.' });
    
  });
});


app.post('/OwnerInsert', function (req, res) {
  var postData = req.body;

  con.query("INSERT INTO Owner SET ? ", postData, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, postData: results, message: 'New user has been created successfully.' });
  });
});

//OwnerLogin through email and password
app.post('/OwnerLogin', function (req, res) {
  var Owneremail = req.body.Owner_Email;
  var Ownerpass = req.body.Owner_Pass;
  var data = {
    "Data": ""
  };
  con.query("SELECT * from Owner WHERE Owner_Email=? and Owner_Pass=? LIMIT 1", [Owneremail, Ownerpass], function (err, rows, fields) {
    if(err){
      throw err;
    }
    if (rows.length != 0) {
      data["Data"] = "Successfully logged in..";
      res.json(data);
    } else {
      data["Data"] = "Email or password is incorrect.";
      res.json(data);
    }
  });
});


app.post('/Investorlog', (req, res) => {
  var Investore = req.body.Investor_Email;
  var Investorp = req.body.Investor_Pass;
  var responseObject = {
    "text" : "Login Successful"
  }
  console.log("User name = " + Investore + ", password is " + Investorp);
  res.send(responseObject);
});


//start server
app.listen(3000, () => {
  console.log('listening on port 3000');
})