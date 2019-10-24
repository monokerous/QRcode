var connection=require('../../config/dbconnection');

var Matiere={

    ObtAllMatieres:function(callback)
    {
        //return connection.query("select * from matiere", callback);
        return connection.query("select m.*, p.nomP from matiere m LEFT JOIN promotion p ON m.promotionS=p.idP Order by p.nomP, m.nomM ASC", callback);
    },
    ObtAllMatieresOrdonneM:function(callback)
    {
        return connection.query("select m.*, p.nomP from matiere m LEFT JOIN promotion p ON m.promotionS=p.idP Order by m.nomM ASC", callback);
    },

    ObtAllMatieresByPromo:function(id, callback)
    {
        return connection.query("select * from matiere where promotionS=?", [id], callback);
    },

    ObtMatiereId:function(id, callback)
    {
        return connection.query("select * from matiere where idM=?", [id], callback);
    },

    PostMatiere: function(nom, promo, totalHeure, callback){
        return connection.query("INSERT INTO matiere (nomM, promotionS, totalHeure) values (?,?,?)", [nom, promo, totalHeure], callback);
    },

    PutMatiereId:function(id, nom, promo, totalHeure, callback) {
        return connection.query("update matiere SET nomM=?, promotionS=? totalHeure=?  where idM=?", [nom, promo, totalHeure, id], callback)
    },

    DelMatiereId:function(id) {
        return connection.query("delete from matiere where idM=?", [id])
    },
    DelMatiereByPromo : function (id) {
        return connection.query("delete from matiere where promotionS=?", [id])
    }
};
module.exports=Matiere;