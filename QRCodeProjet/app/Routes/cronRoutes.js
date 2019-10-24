var Seance=require('../Models/seancesModel');
var CheckLog = require('../CheckLogin');

var router = require('express').Router();
var async = require('async');
var fs = require("fs");
var nodemailer = require("nodemailer");
var ejs = require("ejs");
var qr = require('qr-image');
var moment = require('moment');

module.exports = {
    cronMail: function () {
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'uniflashqrcode@gmail.com',
                pass: 'uniflash2017'
            }
        });

        var code = qr.image(new Date().toString(), { type: 'png' });


        var date = moment(new Date()).format('YYYY-MM-DD');
        var tabSpeEnseignantSeance = [];
        var tabEnseignantSeance = [];
        var query = Seance.CronSeanceEnseignant(date, function(err,rows) {
            if (err)
                res.status(500).render('errorRequest.ejs', {page_title: "Error", role:req.user.roleU, ressource: "/enseignant/seance"});


            rows.forEach(function (element, index, array) {
                if(element.mailU in tabSpeEnseignantSeance) {
                    tabEnseignantSeance.push(element);
                    tabSpeEnseignantSeance[element.mailU] = tabEnseignantSeance;
                }
                else {
                    tabEnseignantSeance = [];
                    tabEnseignantSeance.push(element);
                    tabSpeEnseignantSeance[element.mailU] = tabEnseignantSeance;
                }

                if(index == (rows.length-1)){
                    rndr(tabSpeEnseignantSeance);
                }
            });


            function rndr(tab) {
                for(var enseignant in tabSpeEnseignantSeance)
                {
                    var seances = tabSpeEnseignantSeance[enseignant];
                    ejs.renderFile("views/cron.ejs", { allSeances: seances, date:date }, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            var attachments = [];
                            var j=0;
                            for(var s in seances){
                                var seance = seances[s];
                                var code = qr.image(seance.idS, { type: 'png' });
                                var cid = "uniqueQRCode"+j+"";

                                attach = {
                                    filename: 'qrcode.PNG',
                                    content: code,
                                    cid: cid
                                };
                                attachments.push(attach);
                                j++;
                            }

                            var mainOptions = {
                                from: '"UniFlash" uniflashqrcode@gmail.com',
                                to: enseignant,
                                subject: 'Vos QRCodes pour le '+date,
                                html: data,
                                attachments: attachments
                            };

                            transporter.sendMail(mainOptions, function (err, info) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Message sent: ' + info.response);
                                }
                            });
                        }
                    });
                }
            }
        });
    }
};
/*

module.exports = cronMail();
*/

