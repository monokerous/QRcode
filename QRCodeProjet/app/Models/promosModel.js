var connection=require('../../config/dbconnection');

var Promos={

    ObtAllPromos:function(callback)
    {
        return connection.query("select * from promotion order by nomP", callback);
    },

    ObtPromoId:function(id, callback)
    {
        return connection.query("select * from promotion where idP=? order by nomP", [id], callback);
    },

    PutPromoId:function(id, nom, callback) {
        return connection.query("update promotion SET nomP=? where idP=?", [nom, id], callback)
    },

    DelPromoId:function(id) {
        return connection.query("delete from promotion where idP=?", [id])
    },

    AddPromoId:function(nomP, callback) {
        return connection.query("INSERT INTO promotion(nomP) VALUES (?)", [nomP], callback)
    }

};
module.exports=Promos;
