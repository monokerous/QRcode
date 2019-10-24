var User=require('../Models/usersModel');
var Promo=require('../Models/promosModel');
var CheckLog=require('../CheckLogin');

var colors = require('colors');

const fileUpload = require('express-fileupload');
var bcrypt = require('bcrypt-nodejs');

const http = require('http');
const fs = require('fs');

var bodyParser = require('body-parser');
const multer = require('multer');
const csv = require('fast-csv');

const upload = multer({ dest: './assets/csv/' });

var path = require('path');
var router = require('express').Router();
var async = require('async');


    // =====================================
    // USERS ===============================
    // =====================================

    router.get('/users/:id?', function(req, res, next){ CheckLog(req, res, next, "ADMINISTRATION");}, function(req, res)
    {
        var data = {};

        if(req.param("id")) {
            async.parallel([
                function(parallel_done) {
                    var query = User.ObtUserId(req.param("id"), function (err, rows) {
                        if (err)
                        {
                            res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/users/"}+ req.param("id"));
                            return false;
                        }
                        if (rows.length <= 0)
                        {
                            res.status(404).render('errorRessource.ejs', {page_title: "Error", role:req.user.roleU, data:rows.length, ressource:"/admin/users/" + req.param("id")});
                            return false;
                        }

                        data.table1 = rows;

                        parallel_done();
                    });
                },
                function(parallel_done) {
                    var query2 = Promo.ObtAllPromos(function (err, rows2) {
                        if (err)
                            res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/users/" + req.param("id")});

                        data.table2 = rows2;
                        parallel_done();
                    });
                }
            ], function(err){
                if(err)
                    res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/users/" + req.param("id")});
                else
                    res.status(200).render('Users/detailUser.ejs',{page_title:"detailUser", user:data.table1, promos:data.table2, chemin:"admin/users/"});
            });
        }
        else
        {
            var tabEtu = [];
            var tabEns = [];
            var tabAdmin = [];
			var tabPromos = [];
			var tabEtuPromo = [];

			var query = Promo.ObtAllPromos(function (err, rows) {
				if (err){
					res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/users/"});
				}
				else{
					rows.forEach(function(element) {
						tabPromos.push(element);	
					});
				}
			});
			
            var query = User.ObtAllUsers(function(err,rows)
            {
                var sessionUser = req.session.passport.user;
                var lengthResult = 0;

                if(err)
                    res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/users/"});

                rows.forEach(function(element) {
                    if(element.roleU=="ETUDIANT")
                        tabEtu.push(element);
                    else if(element.roleU=="ENSEIGNANT")
                        tabEns.push(element);
                    else {
                        tabAdmin.push(element);
                        lengthResult++;
                    }
                });

                res.status(200).render('Users/allUsers.ejs',{page_title:"allUsers", etudiants:tabEtu, enseignants:tabEns, administration:tabAdmin, promos:tabPromos, etudiantPromos:tabEtuPromo, session:sessionUser, nbAdmin:lengthResult, chemin:"admin/users/"});
            });
        }
    });

    router.put('/users/:id?', function(req, res, next){ CheckLog(req, res, next, "ADMINISTRATION");}, function(req, res)
    {
        if (req.param("id"))
        {
            var username= req.body.prenom.substring(0, 2).toLowerCase() + req.body.nom.substring(0, 4).toLowerCase();
            var password= req.body.password;
            // bcrypt.hashSync(req.body.prenom.substring(0, 2).toLowerCase() + req.body.nom.substring(0, 4).toLowerCase(), null, null);  // use the generateHash function in our user model
            var nomU = req.body.nom.toUpperCase();
            var prenomU = req.body.prenom.charAt(0).toUpperCase() + req.body.prenom.slice(1);
            var mailU = req.body.mail;
            var promotionU = req.body.promotion;

            var query = User.PutUserId(req.param("id"), username, password, nomU, prenomU, mailU, promotionU, function (err, rows) {
            if (err)
                res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/users/" + req.param("id")});
            });
        }
    });

    router.use(fileUpload());

    router.post('/createUser', function(req, res) {
        var username= req.body.prenom.substring(0, 2).toLowerCase() + req.body.nom.substring(0, 4).toLowerCase();
        var password= req.body.password;
        // bcrypt.hashSync(req.body.prenom.substring(0, 2).toLowerCase() + req.body.nom.substring(0, 4).toLowerCase(), null, null);  // use the generateHash function in our user model
        var nomU = req.body.nom.toUpperCase();
        var prenomU = req.body.prenom.charAt(0).toUpperCase() + req.body.prenom.slice(1);
        var mailU = req.body.mail;
        var roleU = req.body.role;
        var promotionU = null;
        var imgProfileComplement = "";

        if(roleU=="ETUDIANT")
            promotionU=req.body.promotion;

        if (Object.keys(req.files).length !== 0) {
            if(roleU=="ENSEIGNANT")
                imgProfileComplement= "Ens";
            else if(roleU=="ADMIN")
                imgProfileComplement= "Adm";
            else
                imgProfileComplement= promotionU;

            var namefile = nomU+"_"+prenomU+"_"+imgProfileComplement+".jpg";

            var sampleFile = req.files.sampleFile;

            console.log("---------------");
            console.log(namefile);
            console.log(sampleFile);

            sampleFile.mv('./assets/files/imgProfileUsers/' + namefile, function (err) {
                if (err)
                    return res.status(500).send(err);

                console.log('File uploaded!');

                var query = User.AddUser(username, password, prenomU, nomU, mailU, roleU, promotionU, namefile, function (err, rows) {
                    if (err)
                        res.status(500).render('errorRequest.ejs', {
                            page_title: "Error",
                            role: req.user.roleU,
                            ressource: "/admin/users/"
                        });

                    res.status(200).redirect('/admin/users');
                });
            });
        }
        else {
            namefile="profileImgDefault.jpeg";

            var query = User.AddUser(username, password, prenomU, nomU, mailU, roleU, promotionU, namefile, function (err, rows) {
                if (err)
                    res.status(500).render('errorRequest.ejs', {
                        page_title: "Error",
                        role: req.user.roleU,
                        ressource: "/admin/users/"
                    });

                res.status(200).redirect('/admin/users');
            });
        }
    });

    router.post('/upload/:id&:img',  function(req, res, next){ CheckLog(req, res, next, "ADMINISTRATION");}, function(req, res) {
		
        if (!req.files)
            res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/users/" + req.param("id")});

        var sampleFile = req.files.sampleFile;
        var namefile = req.param("img")+'.jpg';

        sampleFile.mv('./assets/files/imgProfileUsers/'+namefile, function(err) {
            if (err)
                return res.status(500).send(err);

            console.log('File uploaded!');

            var query = User.PutUserIdImgProfil(req.param("id"), namefile, function (err, rows) {
                if (err)
                    res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/users/" + req.param("id")});

                res.status(200).redirect('/admin/users');
            });
        });
    });
	
	/************************************************
	UPLOAD IMPORT CSV
	*************************************************/
	router.post('/uploads', upload.single('file'), function(req, res){
		
		var errorFileNull= "";

		const fileRows = [];
		if(req.files.file != null){
			console.log('fichier good'.green);
			// open uploaded file
			console.log(req.files.file.name);
			file=req.files.file;
			name=req.files.file.name;
			file.mv('./assets/csv/'+name , function(err) {
				if (err)
                    return res.status(500).send(err);

                console.log('File uploaded!');

                csv.fromPath("./assets/csv/"+name)
					.on("data", function (data) {
						fileRows.push(data.toString()); // push each row
					})
					.on("end", function () {
						for(i=1;i<fileRows.length;i++){
							rows = fileRows[i].split(';');
							console.log(rows);
							console.log(rows[1].blue);
							var username = rows[1];
                            var password =rows[5];
                            // bcrypt.hashSync('test', null, null);;  // use the generateHash function in our user model
							var nomU = rows[0].toUpperCase();
							var prenomU = rows[1].charAt(0).toUpperCase() + rows[1].slice(1);
							var mailU = rows[2];
							var roleU = rows[3];
							var promotionU = rows[4];
							var namefile = null;
							
							var query = User.AddUser(username, password, prenomU, nomU, mailU, roleU, promotionU, namefile, function (err, rows) {
								if (err)
									console.log(err);
							})
						}
						console.log('Read finished'.green);
					  //process "fileRows" and respond
					})
					
					/*var username= fileRows[0];
					var password= "test";  // use the generateHash function in our user model
					var nomU = req.body.nom.toUpperCase();
					var prenomU = req.body.prenom.charAt(0).toUpperCase() + req.body.prenom.slice(1);
					var mailU = req.body.mail;
					var roleU = req.body.role;
					var promotionU = null;
					var imgProfileComplement = "";
					var query = User.AddUser(username, password, prenomU, nomU, mailU, roleU, promotionU, namefile, function (err, rows) {
						if (err)
							res.status(500).render('errorRequest.ejs', {
								page_title: "Error",
								role: req.user.roleU,
								ressource: "/admin/users/"
							});*/
						res.status(200).redirect('/admin/users');
					//})
			});
		}
		else{
			console.log('Aucun fichier chargé'.red);
			errorFileNull = "Aucun fichier chargé";
			res.status(500).redirect('/admin/users/create');
		}
			
		/*if(req.files.file != null){
			
			console.log('fichier good'.green);

			fs.createReadStream("./assets/csv/data.csv")
			.pipe(csv())
			.on('data',function(data){
				console.log(data.green);
			})
			.on('end',function(data){
				console.log('Read finished'.green);
			});
				res.status(200).redirect('/admin/users');
			}
		else{
			console.log('Aucun fichier chargé'.red);
			errorFileNull = "Aucun fichier chargé";
			res.status(500).redirect('/admin/users/create');
		}*/
	});
	
    router.delete('/users/:id?', function(req, res, next){ CheckLog(req, res, next, "ADMINISTRATION");}, function(req, res)
    {
        if(req.param("id")) {
            var query = User.DelUserId(req.param("id"), function (err, rows) {
			if (err)
				res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/users/" + req.param("id")});

            });
        }
    });

module.exports = router;