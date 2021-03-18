var express = require('express');
const con = require('./utils/dbconnect');
var bodyParser = require('body-parser');
const { json } = require('body-parser');
var PORT = process.env.PORT || 3000;

//Load and intialize MesageBirdSdk

var messagebird = require('messagebird')('<YOUR_ACCESS_KEY>');;

//Create Restful
var app = express();
var publicDir = (__dirname + '/public/')
app.use(express.static(publicDir));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));








app.post('/LandsImages', function (req, res) {
  con.query("SELECT * FROM landsimages WHERE Lands_ID=?", [req.body.Lands_ID], function (error, results) {
    if (error) throw error;
    res.send(results);
  });

});


app.get('/Investor', function (req, res) {
  con.query("SELECT Investor_Name, Investor_Email , Investor_Phonenum FROM Investor where Investor_ID = ?", [req.query.Investor_ID], function (error, rows, fields) {
    if (error) {
      console.log('Error in the query');
    }
    else {
      console.log(JSON.stringify(rows))
      res.status(200).json({
        data: rows[0],
      });
    }
  });

})

app.get('/InvestorProfileDetails', function (req, res) {
  con.query("Select Investor.Investor_ID, Investor.Investor_Name, Investor.Investor_Email , Investor.Investor_Phonenum, landinformation.Land_Price,landinformation.Land_Size ,reviewlands.Rating FROM landinformation JOIN Lands on landinformation.Lands_ID=Lands.Lands_ID  JOIN Investor on Lands.Investor_ID=Investor.Investor_ID JOIN reviewlands on reviewlands.Lands_ID=Lands.Lands_ID AND Investor.Investor_ID= ? ", [req.query.Investor_ID], function (error, rows, fields) {
    if (error) {
      console.log('Error in the query');
    }
    else {
      console.log(JSON.stringify(rows))
      res.status(200).json({
        data: rows[0],
      });
    }
  });

})

function asynqQuery(con, query, params) {
  return new Promise((resolve, reject) => {
    console.log("Query Started")
    con.query(query, params, (err, result) => {
      if (err)
        return reject(err);
      console.log("Query Finished")
      resolve(result);
    });
  });

}

//onResult is a callback that will be invoked after the query is executed in the database
function fetchImagesByLandId(landId) {
  console.log("landId:" + landId)
  return new Promise((resolve, reject) => {
    con.query("SELECT CONVERT(landsimages.LandsImageAerial USING utf8) as imageAerial, " +
      "CONVERT(landsimages.LandsImageFront USING utf8) as imageFront," +
      "CONVERT(landsimages.LandsImageBack USING utf8) as imageBack," +
      "CONVERT(landsimages.LandsImageRight USING utf8) as imageRight," +
      "CONVERT(landsimages.LandsImageLeft USING utf8) as imageLeft  " +
      " FROM  landsimages WHERE landsimages.Lands_ID=? ;", [landId], function (error, rows) {
        resolve(rows);
      });
  });
};
//HomeDetails QueryGET
app.get('/HomePageDetails', (re, res) => {
  con.query("Select lands.Lands_ID,Owner.Owner_Name , landinformation.Land_Price,landinformation.Land_Size, landlocation.Address ,reviewlands.Rating FROM landinformation"
    + " JOIN Lands on landinformation.Lands_ID=Lands.Lands_ID  JOIN Owner on Lands.Owner_ID=Owner.Owner_ID"
    + " JOIN reviewlands on reviewlands.Lands_ID=Lands.Lands_ID " +
    " JOIN landlocation on landlocation.Lands_ID=Lands.Lands_ID"
    + " JOIN landsimages on landsimages.Lands_ID=Lands.Lands_ID " +
    "WHERE reviewlands.Rating =5 LIMIT 5", async function (error, rows) {
      if (error) {
        console.log('Error in the query' + JSON.stringify(error));
      }
      else {
        var results = [];
        for (i in rows) {
          var imagesResult = await fetchImagesByLandId(rows[i].Lands_ID)
          console.log(JSON.stringify(imagesResult));
          var mappedImages = []
          console.log(JSON.stringify(mappedImages));
          mappedImages.push(imagesResult[0].imageAerial)
          mappedImages.push(imagesResult[0].imageFront)
          mappedImages.push(imagesResult[0].imageBack)
          mappedImages.push(imagesResult[0].imageRight)
          mappedImages.push(imagesResult[0].imageLeft)
          rows[i].imagesResult = mappedImages
          results.push(rows[i]);
        }
        res.status(200).json({
          data: results,
        });
      }
    });

})

//LandInforamtion according to OwnerID + Investor Name in it.
app.get('/LandsInformation', function (req, res) {
  con.query("Select landinformation.*,Owner.Owner_Name,Investor.Investor_Name,Products.Products_Name,reviewlands.Rating FROM landinformation JOIN Lands  on landinformation.Lands_ID=Lands.Lands_ID  JOIN Owner  on Lands.Owner_ID= Owner.Owner_ID  JOIN Investor on Lands.Investor_ID=Investor.Investor_ID  JOIN Products on Investor.Investor_ID=Products.Investor_ID  JOIN reviewlands on reviewlands.Lands_ID=Lands.Lands_ID and Lands.Owner_ID= 3 ", [req.query.Owner_ID], function (error, rows, fields) {
    if (error) {
      console.log('Error in the query');
    }
    else {
      var row = rows[0]
      fetchImagesByLandId(row.Lands_ID, function (error, imagesResult) {
        if (error) {
          console.log("Error: " + JSON.stringify(error))
        } else {
          var mappedImages = []
          mappedImages.push(imagesResult[0].imageAerial)
          mappedImages.push(imagesResult[0].imageFront)
          mappedImages.push(imagesResult[0].imageBack)
          mappedImages.push(imagesResult[0].imageRight)
          mappedImages.push(imagesResult[0].imageLeft)
          row.imagesResult = mappedImages
          console.log(JSON.stringify(rows))
          res.status(200).json({
            data: row,
          });
        }
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
        data: rows[0],
      });
    }
  });


})
//landsImage preview for a land
app.get('/landsimages', function (req, res) {
  con.query("SELECT CONVERT(landsimages.LandsImageAerial USING utf8) as imageAerial, " +
    "CONVERT(landsimages.LandsImageFront USING utf8) as imageFront," +
    "CONVERT(landsimages.LandsImageBack USING utf8) as imageBack," +
    "CONVERT(landsimages.LandsImageRight USING utf8) as imageRight," +
    "CONVERT(landsimages.LandsImageLeft USING utf8) as imageLeft  " +
    " FROM  landsimages WHERE Lands_ID=? ;", [req.query.Lands_ID], function (error, rows) {
      if (error) {
        console.log('Error in the query');
      }
      else {
        console.log(JSON.stringify(rows))
        res.status(200).json({
          data: rows
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
        data: rows[0],
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
  console.log("InvestorEmail: " + Investoremail + " \n InvestorPass: " + Investorpass);
  con.query("SELECT * from Investor WHERE Investor_Email=? and Investor_Pass=? LIMIT 1", [Investoremail, Investorpass], function (err, rows, fields) {
    console.log("rowslength: " + rows.length);
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
    if (err) {
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

//todo OAuth 2.0;
app.post('/Investorlog', (req, res) => {
  var Investore = req.body.Investor_Email;
  var Investorp = req.body.Investor_Pass;
  if (Investore && Investorp) {
    con.query("Select Investor.Investor_ID,Investor.Investor_Name,Investor.Investor_Phonenum from Investor" +
      " where Investor.Investor_Email=? and Investor_Pass=? LIMIT 1 ", [Investore, Investorp], function (err, rows) {
        var responseObject = rows[0]
        console.log("User name = " + Investore + ", password is " + Investorp);
        res.send(responseObject);
      });
  }
  else {
    res.send("Please enter username and password");
  }
});


//start server
app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
})