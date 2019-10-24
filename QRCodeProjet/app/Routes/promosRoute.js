var CheckLog = require('../CheckLogin');
var Promo = require('../Models/promosModel');
var Matiere = require('../Models/matieresModel');
var Seance = require('../Models/seancesModel');

var router = require('express').Router();
var async = require('async');

// =====================================
// PROMOTIONS ==========================
// =====================================

router.get('/promotions/:id?', function(req, res, next) {CheckLog(req, res, next, "ADMINISTRATION");},function(req, res) {

    if(req.params.id) {
        if(req.params.id == "create"){
            res.status(200).render('Promos/createPromo.ejs', {page_title: "createPromo", chemin:"admin/promotions/"});
        }
        else {
            var query = Promo.ObtPromoId(req.params.id, function(err,rows)
            {
                if(err)
                    res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/promos/" + req.param("id")});
                if(rows.length <= 0)
                    res.status(404).render('errorRessource.ejs',{page_title:"Error", role:req.user.roleU, ressource:"/admin/promotions/"+req.param("id")});
                else
                    res.status(200).render('Promos/detailPromo.ejs',{page_title:"detailPromo", promo:rows, chemin:"admin/promotions/"});
            });
        }

    }
    else {
        var query = Promo.ObtAllPromos(function (err, rows) {
            if (err)
                res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/promos/"});
            else
                res.status(200).render('Promos/allPromos.ejs', {page_title: "allPromos", promos: rows, chemin:"admin/promotions/"});
        });
    }
});


router.delete('/promotions/:id?', function(req, res, next){ CheckLog(req, res, next, "ADMINISTRATION");}, function(req, res)
{
    if(req.param("id")) {
        async.parallel([
            function(parallel_done) {

                var query = Promo.DelPromoId(req.param("id"), function (err, rows) {
                    if (err)
                        res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/promos/" + req.param("id")});

                    parallel_done();

                });
            },
            function(parallel_done) {
                var query2 = Matiere.ObtAllMatieresByPromo(req.param("id"), function (err, rows2) {
                    rows2.forEach(function (element) {
                        var query4 = Seance.DelSeanceByMatiere(element.idM, function (err, rows) {
                            if (err)
                                res.status(500).render('errorRequest.ejs', {
                                    page_title: "Error", role:req.user.roleU,
                                    ressource: "/admin/matiere/" + req.param("id")
                                });
                        });
                    });

                    var query3 = Matiere.DelMatiereByPromo(req.param("id"), function (err, rows) {
                        if (err)
                            res.status(500).render('errorRequest.ejs', {
                                page_title: "Error", role:req.user.roleU,
                                ressource: "/admin/promos/" + req.param("id")
                            });
                    });
                });
            }
        ], function(err){
            if(err)
                res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/matiere"});
        });
    }
});



router.put('/promotions/:id?', function(req, res, next){ CheckLog(req, res, next, "ADMINISTRATION");}, function(req, res)
{
    if (req.param("id")) {

        var nomP = req.body.nom;
        var query = Promo.PutPromoId(req.param("id"), nomP, function (err, rows) {
            if (err)
                res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/promos/" + req.param("id")});
        });
    }
});

router.post('/promotions', function(req, res, next){ CheckLog(req, res, next, "ADMINISTRATION");}, function(req, res)
{
    var nomP = req.body.nom;
    var query = Promo.AddPromoId(nomP.toUpperCase(), function (err, rows) {
        if (err)
            res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/promos/"});

        res.status(201).redirect('/admin/promotions');
    });
});


module.exports = router;

