
var LocalStrategy   = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var connection = require('./dbconnection');

module.exports = function(passport) {

    // utilisé pout serealizer l'utilisateur pour la session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // utilisé pout deserealizer l'utilisateur pour la session
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // SIGNUP ============================================================
    // =========================================================================

    passport.use(
        'local-signup',
        new LocalStrategy({
            // La stragégie se base sur le mail et le mot de passe de l'utilisateur
            // passReqToCallback nous permet de renvoyer la totalité de la demande
            usernameField : 'mail',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, mail, password, done) {
            // Grâce au mail de l'utilisateur, nous déterminons s'il extiste déjà
            // Si oui, nous renvoyons un message
            // Sinon nous l'ajoutons à la base de données
            // le username est construit à partir du nom et du prénom de l'utilisateur
            // idem pour le mot de passe

            connection.query("SELECT * FROM users WHERE mailU = ?",[mail], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length)
                    return done(null, false, req.flash('signupMessage', 'That mail is already taken.'));
                /*else
                {
                   var query = User.PutUserIdImgProfil(req.param("id"), namefile, function (err, rows) {
                        if (err)
                            res.status(500).render('errorRequest.ejs', {page_title:"Error", role:req.user.roleU, ressource: "/admin/users/" + req.param("id")});

                        res.status(200).redirect('/admin/users');
                    });

                    var newUserMysql = {
                        username: req.body.prenom.substring(0, 2) + req.body.nom.substring(0, 4),
                        password: bcrypt.hashSync(req.body.prenom.substring(0, 2) + req.body.nom.substring(0, 4), null, null),  // use the generateHash function in our user model
                        prenomU: req.body.prenom,
                        nomU: req.body.nom,
                        mailU: req.body.mail,
                        roleU: req.body.role,
                        promotionU: req.body.promotion,
                        imageProfileU:req.body.sampleFile
                    };

                    if(newUserMysql.roleU != "ETUDIANT")
                        newUserMysql.promotionU=null;

                    if (!req.files) {
                        newUserMysql.imageProfileU="imagePrfileDefault.jpg";
                    } else {

                        newUserMysql.imageProfileU="";

                    }


                    var insertQuery = "INSERT INTO users ( username, password, prenomU, nomU, mailU, roleU, promotionU ) values (?,?,?,?,?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password, newUserMysql.prenomU, newUserMysql.nomU, newUserMysql.mailU, newUserMysql.roleU, newUserMysql.promotionU, ],function(err, rows) {

                    return done(null, req.user);

                    });
                }*/
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){

                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'Utilisateur Incorrect ! '));
                }

                // Si le login utilisateur est reconnu mais que le password ne correspond pas
               /* if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Mot de Passe Incorrect !'));
*/
                // Si tout est bon, on retourne l'utilisateur
                return done(null, rows[0]);
            });
        })
    );
};
