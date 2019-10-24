var connection=require('../../config/dbconnection');

var Etudiant={

    ObtSeanceWithMatiereId:function(id, callback) {
        return connection.query("select * from seance s LEFT JOIN matiere m ON s.matiereS=m.idM where idS = ?;", [id], callback)
    },

    PeutSigner:function(seance, utilisateur, callback) {
        return connection.query("select * from badge where seanceB = ? and utilisateurB = ?;", [seance, utilisateur], callback)
    },

    Signer:function(seance, utilisateur, date, callback) {
        return connection.query("insert into badge (seanceB, utilisateurB, dateSignB) values (?,?,?);", [seance, utilisateur, date], callback)
    },

};
module.exports=Etudiant;
