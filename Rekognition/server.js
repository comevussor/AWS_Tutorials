var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var AWS = require('aws-sdk');
var dataUriToBuffer = require('data-uri-to-buffer');
var bucketName = 'node-sdk-sample-marc';
var keyName = 'hello_world.jpg';

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//Création
/*var rekognition = new AWS.Rekognition({region: 'eu-west-1'});
var params = {
    CollectionId: "myphotos"
   };
   rekognition.createCollection(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
});*/

//Suppression
/*var rekognition = new AWS.Rekognition({region: 'eu-west-1'});
var params = {
    CollectionId: "myphotos"
   };
   rekognition.deleteCollection(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
}); */

app.get('/', (request,response) => 
{
    console.log("LEOOO GET");
    response.send("it works");
});

app.post('/', (request,response) => 
{
    console.log("LEOOO POST");
    //console.log(request.body.data);

    var s3 = new AWS.S3({region: 'eu-west-1'});
    var params = {Bucket: bucketName, Key: keyName, Body: dataUriToBuffer(request.body.data)};
    
    s3.putObject(params, function(err, data) {
        if (err)
          console.log(err)
        else
          console.log("Successfully uploaded data  "+ keyName);
          var rekognition = new AWS.Rekognition({region: 'eu-west-1'});
          var params = {
            CollectionId: "myphotos", 
            FaceMatchThreshold: 95, 
            Image: 
            {
              S3Object: 
              {
                Bucket: bucketName, 
                Name: keyName
              }
            }, 
            MaxFaces: 1
           };
           rekognition.searchFacesByImage(params, function(err, data) {
             if (err) {
               console.log(err, err.stack); // an error occurred
               response.send("ERROR");
             }
             else {
               console.log(data);           // successful response
               response.send("OKAY :D");
             }
            });
      });
})


app.post('/register', (request,response) => 
{
    console.log("LEOOO POST REGISTER");
    //console.log(request.body.data);
    
    var s3 = new AWS.S3({region: 'eu-west-1'});
    var params = {Bucket: bucketName, Key: keyName, Body: dataUriToBuffer(request.body.data)};
    s3.putObject(params, function(err, data) {
        if (err)
          console.log(err)
        else
          console.log("Successfully uploaded data  "+ keyName);
          var rekognition = new AWS.Rekognition({region: 'eu-west-1'});
          var params = {
             CollectionId: "myphotos", 
             DetectionAttributes: [
             ], 
             Image: {
              S3Object: {
               Bucket: bucketName, 
               Name: keyName
              }
             }
            };
            rekognition.indexFaces(params, function(err, data) {
              if (err) {
                console.log(err, err.stack); // an error occurred
                response.send("ERROR");
              }
              else     console.log(data);           // successful response
         });
     });
})




app.listen("8080");
