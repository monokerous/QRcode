
module.exports= function (req, res, next, role)
{
    // Vérification du role de l'utilisateur avant de lui renvoyer la page demandée
    if (req.isAuthenticated()) {
        if (role == req.user.roleU) {
            return next();
        }
        else {    // Si il n'a pas le bon rôle, il est renvoyé à la page de login et reçoit un msg d'erreur
            req.session.returnTo = req.originalUrl;
            req.flash('loginMessage', 'Vous n avez pas les droits pour accéder à la page demandée');
            res.status(403).redirect('/login');
        }
    }
    else {    // Si il n'est pas authentifié, il est renvoyé à la page de login et reçoit un msg d'erreur
        req.session.returnTo = req.originalUrl;
        req.flash('loginMessage', 'Vous n avez pas les droits pour accéder à la page demandée');
        res.status(401).redirect('/login');
    }

};
