var Seance = require('../Models/seancesModel');
var CheckLog = require('../CheckLogin');

var router = require('express').Router();
var moment = require('moment');

// =====================================
// ENSEIGNANT ==========================
// =====================================

router.get('/seance', function(req, res, next) {CheckLog(req, res, next, "ENSEIGNANT");},function(req, res) {
    FactoryEnseignant(req, res, 'Enseignant/validerPresence.ejs');
});
router.get('/listEtuStandard', function(req, res, next) {CheckLog(req, res, next, "ENSEIGNANT");}, function(req, res) {
    FactoryEnseignant(req, res, 'Enseignant/listEtuStandard.ejs');
});
router.get('/listEtuTrombinoscope', function(req, res, next) {CheckLog(req, res, next, "ENSEIGNANT");}, function(req, res) {
    FactoryEnseignant(req, res, 'Enseignant/listEtuTrombinoscope.ejs');
});

router.put('/seance/:id?', function(req, res, next){ CheckLog(req, res, next, "ENSEIGNANT");}, function(req, res)
{
    if (req.param("id"))
    {
        var commentaire = req.body.commentaire;
        var id = req.param("id");

        var query = Seance.ValiderSeance(id, commentaire, function (err, rows) {
            if (err)
                res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/enseignant/seance"}+ req.param("id"));
        });
    }
});

router.get('/profile', function(req, res, next){ CheckLog(req, res, next, "ENSEIGNANT");}, function(req, res) {
    res.status(200).render('profile.ejs', { user : req.user });
});

router.get('/edtJournee', function(req, res, next){ CheckLog(req, res, next, "ENSEIGNANT");}, function(req, res) {

    var date= moment(new Date()).format("YYYY-MM-DD");

    var query = Seance.EdtEnseignant(req.user.id, date, function (err, rows) {
        if (err)
            res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/enseignant/edtJournee"});
        else
        {
            res.status(200).render('edtJournee.ejs', {page_title: "EDT_Journée_Enseignant", seance: rows});
        }
    });
});

module.exports = router;

//requêtes à la base de données
function FactoryEnseignant (req, res, vue)
{
    var query = Seance.ObtSeanceEnseignant(req.user.id, function(err,rows)
    {
        if(err)
            res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/enseignant/seance"});
        if(rows.length != 0) {

            rows.forEach(function (element) {
                element.dateS = moment(element.dateS).format('YYYY-MM-DD');
            });


            var query2 = Seance.ObtEtudiantEnseignant(rows[0].idS, function (err, rows2) {
                if (err)
                    res.status(500).render('errorRequest.ejs', {page_title: "Error", role:req.user.roleU, ressource: "/enseignant/seance"});

                var rowsbadge = [];

                rows2.forEach(function (element) {
                    var query3 = Seance.ObtBadgeEtuSeance(element.id, rows[0].idS, function (err, rows3) {

                        if (err)
                            res.status(500).render('errorRequest.ejs', {page_title: "Error", role:req.user.roleU, ressource: "/enseignant/seance"});
                        if (rows3.length == 0)
                            rowsbadge.push(0);
                        else
                            rowsbadge.push(moment(rows3[0].dateSignB).format("HH:mm:ss"));

                        if (rowsbadge.length == rows2.length) {
                            var nbPresent=0;

                            var query2 = Seance.NbPresentSeance(rows[0].idS, function (err, rows4) {
                                if (err)
                                    res.status(500).render('errorRequest.ejs', {
                                        page_title: "Error",
                                        role: req.user.roleU,
                                        ressource: "/enseignant/seance"
                                    });

                                if (rows4.length != 0)
                                    nbPresent = rows4[0].nbPresent;

                                res.status(200).render(vue, {
                                    page_title: "validerPresence", seance: rows,
                                    etudiants: rows2, badge: rowsbadge, presence: nbPresent, chemin: "enseignant/seance"
                                });
                            });
                        }
                    });
                });
            });
        }
        else {
            res.status(200).render(vue, {
                page_title: "validerPresence", seance: [],
                chemin: "enseignant/seance"
            });
        }
    });
}