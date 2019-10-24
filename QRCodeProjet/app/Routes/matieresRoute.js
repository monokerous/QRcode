var Matiere = require('../Models/matieresModel');
var Promotion = require('../Models/promosModel');
var Seance = require('../Models/seancesModel');
var CheckLog = require('../CheckLogin');

var router = require('express').Router();
var async = require('async');

// =====================================
// MATIERES ==========================
// =====================================

router.get('/matieres/:id?', function(req, res, next) {CheckLog(req, res, next, "ADMINISTRATION");},function(req, res) {

    var data = {};
    var data2 = {};

    if(req.params.id) {
        if(req.param("id")=="create") {
            var query1 = Promotion.ObtAllPromos(function (err, rows) {
                if (err)
                    res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/matiere"}+ req.param("id"));
                if (rows.length <= 0) {
                    res.status(404).render('errorRessource.ejs', {
                        page_title: "Error", role:req.user.roleU,
                        ressource: "/admin/matieres/" + req.param("id")
                    });
                }
                else
                    res.status(200).render('Matieres/createMatiere.ejs', {page_title: "createMatiere", promos:rows, chemin:"admin/matieres/"});
            });
        }
        else
        {
            async.parallel([
                function (parallel_done) {
                    var query = Matiere.ObtMatiereId(req.params.id, function (err, rows) {
                        if (err)
                        {
                            res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/matiere"}+ req.param("id"));
                            return false;
                        }
                        if (rows.length <= 0) {
                            res.status(404).render('errorRessource.ejs', {
                                page_title: "Error", role:req.user.roleU,
                                ressource: "/admin/matieres/" + req.param("id")
                            });
                            return false;
                        }

                        data.table1 = rows;
                        parallel_done();
                    });
                },
                function (parallel_done) {
                    var query1 = Promotion.ObtAllPromos(function (err, rows2) {
                        if (err)
                        {
                            res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/matiere"}+ req.param("id"));
                            return false;
                        }
                        if (rows2.length <= 0) {
                            res.status(404).render('errorRessource.ejs', {
                                page_title: "Error", role:req.user.roleU,
                                ressource: "/admin/matieres/" + req.param("id")
                            });
                            return false;
                        }
                        data.table2 = rows2;
                        parallel_done();
                    });
                },
            ], function (err) {
                if (err)
                    res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/matiere"}+ req.param("id"));
                else
                    res.status(200).render('Matieres/detailMatiere.ejs', {page_title: "detailMatiere", matieres:data.table1, promos:data.table2, chemin: "admin/matieres/"});
            });
        }
    }
    else
    {
        async.parallel([
            function(parallel_done) {
                var query = Matiere.ObtAllMatieres(function(err,rows)
                {
                    if(err)
                        res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/matiere"});

                    data2.table1 = rows;
                    parallel_done();
                });
            },
            function(parallel_done) {
                var query2 = Promotion.ObtAllPromos(function (err, rows2) {
                    if (err)
                        res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/matiere"});

                    data2.table2 = rows2;
                    parallel_done();
                });
            }
        ], function(err){
            if(err)
                res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/matiere"});
            else
                res.status(200).render('Matieres/allMatieres.ejs',{page_title:"allMatieres", matieres:data2.table1, promos:data2.table2, chemin:"admin/matieres/"});
        });
    }
});

router.post('/matieres',function(req, res, next){ CheckLog(req, res, next, "ADMINISTRATION");}, function(req, res)
{
    var query = Matiere.PostMatiere(req.body.nom, req.body.promo, req.body.totalHeure, function (err, rows) {
        if (err)
            res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/matiere"});
        else
            res.status(201).redirect('/admin/matieres');
    });
});

router.put('/matieres/:id?', function(req, res, next){ CheckLog(req, res, next, "ADMINISTRATION");}, function(req, res)
{
    if (req.param("id"))
    {
        var nomM = req.body.nom;
        var promotionS = req.body.promo;
        var totalHeure = req.body.totalHeure;
		
		
        var query = Matiere.PutMatiereId(req.param("id"), nomM, promotionS, totalHeure, function (err, rows) {
            if (err)
                res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/matiere"}+ req.param("id"));
        });
    }
});


router.delete('/matieres/:id?', function(req, res, next){ CheckLog(req, res, next, "ADMINISTRATION");}, function(req, res)
{
    if(req.param("id")) {
        async.parallel([
            function(parallel_done) {

                var query = Matiere.DelMatiereId(req.param("id"), function (err, rows) {
                    if (err)
                        res.status(500).render('errorRequest.ejs', {
                            page_title: "Error", role:req.user.roleU,
                            ressource: "/admin/matiere"
                        } + req.param("id"));

                    parallel_done();

                });
            },
            function(parallel_done) {
                var query2 = Seance.DelSeanceByMatiere(req.param("id"), function (err, rows) {
                    if (err)
                        res.status(500).render('errorRequest.ejs', {
                            page_title: "Error", role:req.user.roleU,
                            ressource: "/admin/matiere/" + req.param("id")
                        });

                    parallel_done();

                });
            }
            ], function(err){
                    if(err)
                        res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/matiere"});
        });
    }
});

module.exports = router;

