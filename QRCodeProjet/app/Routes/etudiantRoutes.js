var Etudiant = require('../Models/etudiantModel');
var CheckLog = require('../CheckLogin');
var Seance = require('../Models/seancesModel');

var router = require('express').Router();
var format = require('date-format');
var async = require('async');
var moment = require('moment');

// =====================================
// ETUDIANT ==========================
// =====================================

router.get('/seance/:id?', function(req, res, next) {CheckLog(req, res, next, "ETUDIANT");},function(req, res) {

    if(req.params.id) {
        var data = {};
        async.parallel([
            function (parallel_done) {
                var query1 = Etudiant.ObtSeanceWithMatiereId(req.params.id, function(err,rows) {
                    if (err)
                    {
                        res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/etudiant/seance"}+ req.param("id"));
                        return false;
                    }
                    data.seance = rows;
                    parallel_done();
                });
            },
            function (parallel_done) {
                var query2 = Etudiant.PeutSigner(req.params.id, req.user.id, function (err, rows2) {
                    if (err)
                    {
                        res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/etudiant/seance"}+ req.param("id"));
                        return false;
                    }
                    if (rows2.length <= 0) {
                        data.dejaPresent = false;
                    }
                    else {
                        data.dejaPresent = true;
                    }
                    parallel_done();
                });
            }
        ], function (err) {
            if (err)
            {
                res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/etudiant/seance"}+ req.param("id"));
                return false;
            }
            if (data.seance.length <= 0) {
                res.status(404).render('errorRessource.ejs', {
                    page_title: "Error", role:req.user.roleU,
                    ressource: "/etudiant/seance/" + req.param("id")
                });
                return false;
            }
            else {
                data.seance = data.seance[0]; //on ne garde que la premiere ligne
            }

            //vérifications promo
            if(req.user.promotionU != data.seance.promotionS){
                res.status(404).render('errorRessource.ejs', {
                    page_title: "Error", role:req.user.roleU,
                    ressource: "/etudiant/seance/" + req.param("id")
                });
                return false;
            }
            //vérifications horaire
            var heure = format.asString('hh:mm', new Date());
            var date = format.asString('yyyy-MM-dd', new Date());
            var dateSeance = data.seance.dateS = moment(data.seance.dateS).format("YYYY-MM-DD");
            var heureDebut = data.seance.heureDebut;
            var heureFin = data.seance.heureFin;

            var peutSigner = false;
            if((date == dateSeance) && (heureDebut <= heure && heure <= heureFin) && !data.dejaPresent){
                peutSigner = true;
            }

            res.status(200).render('Etudiant/signalerPresence.ejs',{
                page_title:"signalerPresence",
                format:format,
                peutSigner : peutSigner,
                dejaPresent: data.dejaPresent,
                seance:data.seance,
                chemin: ("etudiant/seance/"+data.seance.idS)}
                );
        });
    }
});

router.post('/seance/:id?', function(req, res, next) {CheckLog(req, res, next, "ETUDIANT");},function(req, res) {

    if(req.params.id) {
        var seance = req.params.id;
        var utilisateur = req.user.id;
        var date = new Date();
        var query = Etudiant.Signer(seance, utilisateur, date, function (err, rows) {
            if (err)
                res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/etudiant/seance"}+ req.param("id"));
            else
                res.status(201).redirect('/etudiant/seance/'+req.params.id);
        });
    }
});


router.get('/profile', function(req, res, next){ CheckLog(req, res, next, "ETUDIANT");}, function(req, res) {
    res.status(200).render('profile.ejs', { user : req.user });
});

router.get('/edtJournee', function(req, res, next){ CheckLog(req, res, next, "ETUDIANT");}, function(req, res) {

    var date= moment(new Date()).format("YYYY-MM-DD");

    var query = Seance.EdtEtudiant(req.user.id, date, function (err, rows) {
        if (err)
            res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/etudiant/edtJournee"});
        else
        {
            res.status(200).render("edtJournee.ejs", {
                page_title: "EDT_Journée_Etudiant", seance: rows
            });
        }
    });
});

module.exports = router;

