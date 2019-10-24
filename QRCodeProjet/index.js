/***** import primaries materials in order to build the Api code *****/
// import Google api library
var {google} = require("googleapis");
// import the Google drive module in google library
var drive = google.drive("v3");
// import our private key
var key = require("./private_key.json");

// import path ° directories calls °
var path = require("path");
// import fs ° handle data in the file system °
var fs = require("fs");


/***** make the request to retrieve an authorization allowing to works with the Google drive web service *****/
// retrieve a JWT
var jwToken = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key, ["https://www.googleapis.com/auth/drive"],
  null
);
jwToken.authorize((authErr) => {
  if (authErr) {
    console.log("error : " + authErr);
    return;
  } else {
    console.log("Authorization accorded");
  }
});


// upload file in specific folder
var folderId = "1vtSx_0HEXL4tFN2Q1Azc28I80_urgTxG";
var fileMetadata = {
  'name': 'recap2018-11-12M2.pdf',
  parents: [folderId]
};
var media = {
  mimeType: 'application/pdf',
  body: fs.createReadStream('PDF/recap2018-11-12M2.pdf')
};
drive.files.create({
  auth: jwToken,
  resource: fileMetadata,
  media: media,
  fields: 'id'
}, function(err, file) {
  if (err) {
    // Handle error
    console.error(err);
  } else {
    console.log('File Id: ', file.id);
  }
});