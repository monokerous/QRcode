var Matiere=require('../Models/matieresModel');
var Seance=require('../Models/seancesModel');
var Promo=require('../Models/promosModel');
var CheckLog = require('../CheckLogin');

var router = require('express').Router();
var moment = require('moment');
var mailer = require("nodemailer");
var colors = require('colors');
var async = require('async');
var pdfMaker = require('pdf-maker');
var PDFImage = require("pdf-image").PDFImage;


/***** import primaries materials in order to build the Api code *****/
// import Google api library
var {google} = require("googleapis");
// import the Google drive module in google library
var drive = google.drive("v3");
// import our private key
var key = require("../../private_key.json");
// import path ° directories calls °
var path = require("path");
// import fs ° handle data in the file system °
var fs = require("fs");
// =====================================
// ETUDIANT ==========================
// =====================================

router.get('/fichePresence/:id?', function(req, res, next) {CheckLog(req, res, next, "ADMINISTRATION");},function(req, res) {

    if(req.params.id) {
        fs.readFile('./PDF/'+req.params.id+'.pdf', function (err,data){
            res.contentType("application/pdf");
            res.status(200).send(data);
        });
    }
	else{
		async.parallel([
			function(parallel_done) {
				var query = Promo.ObtAllPromos(function(err,rows)
				{
					if (err){
						res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/fichePresence/"});
					}
					promos = rows;
					parallel_done();
				});	
			},
			function(parallel_done) {
				var query2 = Seance.ObtAllSeances(function(err,rows2) {
					if (err){
						res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/fichePresence"});
					}
					if (rows2.length != 0) {
							nomPromo = rows2[0].nomP
                            rows2.forEach(function (element) {
                                element.dateS = moment(element.dateS).format("YYYY-MM-DD");
                            });
                            //return false;
                    }

                    seances = rows2;
					parallel_done();
				});
			},
			function (parallel_done) {
				var query3 = Matiere.ObtAllMatieres(function (err, rows3) {
					if (err)
					{
						res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/fichePresence"});
					}

					matieres = rows3;
					parallel_done();
				});
			},
		], function(err){
			if(err)
				res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/fichePresence/"});
			else
				res.status(200).render('FichePresence/formulaire.ejs', {page_title: "fichePresence", matieres: matieres ,promos: promos, nomPromo: nomPromo, seances: seances, chemin:"admin/fichePresence/", moment: moment});
		});
	}
});

router.post('/fichePresence/:id?', function(req, res, next) {CheckLog(req, res, next, "ADMINISTRATION");},function(req, res) {
    //generer le pdf
    if(req.body){
		var promo = req.body.promo;
		var date = req.body.date;
	}
	else{
		var id = document.getElementsByClassName("generer")[0].id;
		var idCompo = id.split(' ');
		var promo = idCompo[0];
		var date = idCompo[1];
	}
		
    var allSeances = [];
    allSeances["entete"] = [];
	allSeances["heureDebut"] = [];
	allSeances["heureFin"] = [];
    allSeances["etudiants"] = [];
    allSeances["lignes"] = [];
    allSeances["enseignants"] = [];
    allSeances["commentaire"] = [];
	allSeances["nbPresent"] = [];
	
	
	
	
    var nomPromo;
    var query = Seance.ObtSeancesFiche(promo, date, function(err,rows)
    {
        if(err)
            res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/fichePresence"});

        if(rows.length != 0) {
			nbEtudiantPromo = 0;
			
            nomPromo = rows[0].nomP
            rows.forEach(function (seance, indexS) {
                allSeances["entete"].push(seance.nomM);
				allSeances["heureDebut"].push(moment(seance.heureDebut, "HH:mm:ss").format("HH:mm"));
				allSeances["heureFin"].push(moment(seance.heureFin, "HH:mm:ss").format("HH:mm"));
                allSeances["enseignants"].push(seance.nomU + " " + seance.prenomU);
                allSeances["commentaire"].push(seance.commentaire);
				
				
				var nbPresent=0;
				var query0 = Seance.NbPresentSeance(seance.idS, function (err, rows0) {
					if (err)
						res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/fichePresence"});

					if (rows0.length != 0)
						nbPresent = rows0[0].nbPresent;
						allSeances["nbPresent"].push(nbPresent++);
				});
				
                var query2 = Seance.ObtEtudiantEnseignant(seance.idS, function (err2, rows2) {
                    if (err2)
                        res.status(500).render('errorRequest.ejs', {page_title: "Error", role:req.user.roleU, ressource: "/admin/fichePresence"});

                    rows2.forEach(function (etudiant, indexE) {
                        if (!("etu"+etudiant.id in allSeances["lignes"])) {;
                            allSeances["lignes"]["etu"+etudiant.id] = [];
							
                            allSeances["etudiants"]["etu"+etudiant.id] = etudiant.nomU + " " + etudiant.prenomU;
							nbEtudiantPromo ++;
                        }
						
                        var query4 = Seance.ObtBadgeEtuSeance(parseInt(etudiant.id), seance.idS, function (err4, rows4) {
                            if (err4)
                                res.status(500).render('errorRequest.ejs', {page_title: "Error", role:req.user.roleU, ressource: "/enseignant/seance"});

                            if (rows4.length == 0){
                                allSeances["lignes"]["etu"+etudiant.id].push(0);
                            }else{
                                allSeances["lignes"]["etu"+etudiant.id].push(1);
							}
							
                            if((indexE == rows2.length-1) && (indexS == rows.length-1)){
								
								var directories = __dirname+'/../../assets';
								console.log(directories.green);
								var assestPath=path.join(directories);
								assestPath=assestPath.replace(new RegExp(/\\/g),'/');
                                console.log(assestPath.green);
								
                                var template = './views/FichePresence/recap.ejs';
                                var data = {
                                    allSeances: allSeances,
                                    date: date,
                                    promo: nomPromo,
									nbEtudiantPromo: nbEtudiantPromo,
									assestPath: assestPath,
									moment: moment
                                };
								
                                var pdfPath = './PDF/recap'+date+nomPromo+'.pdf';
								
								var option = {
                                    paperSize: {
                                        format: 'A4',
                                        orientation: 'portrait',
                                        border: '1.8cm',
										base: 'file:///'+assestPath
										
                                    }

                                };

                                pdfMaker(template, data, pdfPath, option);

                                res.status(200).render('FichePresence/recap.ejs', {
                                    page_title: "fichePresence",
                                    chemin:"admin/fichePresence/",
                                    allSeances: allSeances,
                                    date:date,
                                    promo:nomPromo,
									nbEtudiantPromo:nbEtudiantPromo,
									assestPath:assestPath,
									moment: moment,
                                    pathFile:pdfPath
                                });
                            }
                        });
                    });
                });
            });
			
			var pdfImage = new PDFImage('./PDF/recap'+date+nomPromo+'.pdf', {
			  combinedImage: true
			});
			 
			pdfImage.convertFile().then(function (imagePaths) {
			   // /tmp/slide.png 
			   console.log(imagePath.green);
			}, function (err) {
			  console.log(err, 500);
			});
			/******************************************************
			******************************************************
			ENVOYER PAR EMAIL EN PARALLELE DE LA GENERATION
			******************************************************
			*******************************************************/
			//authentification sur l'adresse mail de l'expediteur
			var smtpTransport = mailer.createTransport("SMTP",{
				service: "Gmail",
				auth: {
					user: "albus.dumbledoremiage@gmail.com",
					pass: "motdepasse12"
				}
			});
			//Création du mail 
			var mail = {
				from: "Dumbledore Albus MIAGE",
				to: "yann.bourgues@gmail.com",
				subject: "Fiche de présence " +nomPromo+ " MIAGE - " +date,
				html: "Bonjour,\nCi-joint la fiche du présence de "+nomPromo+ " MIAGE du "+date,
				attachments: [
					{
					  filePath: './PDF/recap'+date+nomPromo+'.pdf'
					},
				]
			}
			//Commande d'envoie du mail
			smtpTransport.sendMail(mail, function(error, response){
				if(error){
					console.log("*******************************************".red);
					console.log("Erreur lors de l'envoie du mail!".red);
					console.log(error.red);
					console.log("*******************************************".red);
				}else{
					console.log("*******************************************".green);
					console.log("Mail envoyé avec succès!".green);
					console.log("Envoyé à :"+mail.to.green);
					console.log("Bravooo !!!!".rainbow);
					console.log("*******************************************".green);
				}
				smtpTransport.close();
			});	
			
			/******************************************************
			******************************************************
			ENVOYER sur drive google EN PARALLELE DE LA GENERATION
			******************************************************
			*******************************************************/	
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
			  'name': 'recap'+date+nomPromo+'.pdf',
			  parents: [folderId]
			};
			var media = {
			  mimeType: 'application/pdf',
			  body: fs.createReadStream('./PDF/recap'+date+nomPromo+'.pdf')
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
			
			
        }
        else {
            res.status(200).render('Enseignant/validerPresence.ejs', {
                page_title: "validerPresence", seance: [],
                chemin: "enseignant/seance/", moment:moment
            });
        }
    });	
});

module.exports = router;

